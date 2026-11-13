/* =========================================================
   Nicotch — affichage des jeux
   • Page Jeux (jeux.html) : catalogue + filtres par genre
   • Accueil (index.html) : « Derniers jeux »
   • Page Jouer (jouer.html?jeu=ID) : le jeu dans un cadre, avec
     les commandes, le plein écran et le retour au catalogue.
   ========================================================= */
(function () {
  "use strict";
  var ND = window.ND;
  var esc = ND.esc;

  // Un identifiant de jeu ne contient que lettres minuscules, chiffres et tirets
  // (protège contre les chemins bizarres dans l'adresse).
  function idValide(id) { return typeof id === "string" && /^[a-z0-9-]+$/.test(id); }

  function jeuxTries() {
    var l = (window.ND_JEUX || []).filter(function (j) { return j && idValide(j.id) && j.titre; });
    return l.slice().sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
  }
  function trouver(id) {
    var l = jeuxTries();
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  }
  function cheminJeu(j) { return "jeux/" + j.id + "/index.html"; }

  function vignette(j) {
    if (!j.apercu && j.affiche) {
      return '<div class="jeu-apercu jeu-apercu-affiche"><img src="' + esc(j.affiche) + '" alt="" loading="lazy"></div>';
    }
    if (j.apercu) {
      return '<img class="jeu-apercu" src="' + esc(j.apercu) + '" alt="" loading="lazy" width="800" height="450">';
    }
    return '<div class="jeu-apercu jeu-apercu-vide" aria-hidden="true">' + esc(j.icone || "🎮") + "</div>";
  }

  function etiquettes(j) {
    return '<div class="etiquettes">' +
      (j.genre ? '<span class="etiquette">' + esc(j.genre) + "</span>" : "") +
      '<span class="etiquette">' + (j.mobile ? "📱 Mobile et ordinateur" : "🖥️ Ordinateur") + "</span>" +
      (j.manette ? '<span class="etiquette">🎮 Manette compatible</span>' : "") +
      (j.trilogie ? '<span class="etiquette etiquette-trilogie">Trilogie · ' + j.trilogie + "/3</span>" : "") +
      "</div>";
  }

  function carte(j) {
    if (j.bientot) {
      return '<article class="carte jeu-carte jeu-bientot">' + vignette(j) +
        '<div class="jeu-corps"><span class="badge-bientot">Bientôt disponible</span><h3>' + esc(j.titre) + "</h3>" +
        (j.genre ? '<div class="etiquettes"><span class="etiquette">' + esc(j.genre) + "</span></div>" : "") +
        "<p>" + esc(j.description || "") + "</p>" +
        '<p class="meta-rapport">En cours de création. Revenez bientôt !</p></div></article>';
    }
    return '<article class="carte jeu-carte">' + vignette(j) +
      '<div class="jeu-corps"><h3>' + esc(j.titre) + "</h3>" + etiquettes(j) +
      "<p>" + esc(j.description || "") + "</p>" +
      '<a class="btn btn-bleu" href="jouer.html?jeu=' + encodeURIComponent(j.id) + '">▶ Jouer à ' + esc(j.titre) + "</a></div></article>";
  }

  var MESSAGE_VIDE = '<div class="carte vide"><p class="vide-icone" aria-hidden="true">🕹️</p>' +
    "<h3>Les jeux arrivent bientôt</h3><p>Nicotch prépare ses premiers jeux. Revenez très vite !</p>" +
    '<p><a class="btn btn-rouge" href="reparation.html">En attendant, diagnostiquer un appareil</a></p></div>';

  /* ---------- Vitrine (jeux.html) : la trilogie + les autres jeux, côte à côte ---------- */
  function carteVitrine(j) {
    var img = j.affiche
      ? '<span class="vitrine-cadre"><img class="vitrine-fond" src="' + esc(j.affiche) + '" alt="" loading="lazy">' +
        '<img class="vitrine-affiche" src="' + esc(j.affiche) + '" alt="Affiche de ' + esc(j.titre) + '" loading="lazy"></span>'
      : '<span class="vitrine-cadre trilogie-sans-affiche"><img src="' + esc(j.apercu) + '" alt="" loading="lazy"><span>' + esc(j.titre) + "</span></span>";
    return '<li><a class="trilogie-lien vitrine-lien" href="jouer.html?jeu=' + encodeURIComponent(j.id) + '">' +
      (j.trilogie ? '<span class="trilogie-num">' + j.trilogie + "</span>" : "") + img +
      '<span class="trilogie-titre">' + esc(j.titre) + '</span><span class="trilogie-genre">' + esc(j.genre || "") + "</span>" +
      '<span class="btn btn-bleu btn-petit">▶ Jouer</span></a></li>';
  }
  function trilogie() {
    var zone = document.getElementById("bloc-trilogie");
    var dispo = jeuxTries().filter(function (j) { return !j.bientot && (j.affiche || j.apercu); });
    var tri = dispo.filter(function (j) { return j.trilogie; }).sort(function (a, b) { return a.trilogie - b.trilogie; });
    var autres = dispo.filter(function (j) { return !j.trilogie; });
    if (!dispo.length) { zone.classList.add("cache"); return; }
    function groupe(titre, sous, liste, classe) {
      if (!liste.length) return "";
      return '<div class="vitrine-groupe ' + classe + '" style="--n:' + liste.length + '"><h2>' + titre + "</h2>" +
        '<p class="sous-titre">' + sous + "</p>" +
        '<ol class="vitrine-liste">' + liste.map(carteVitrine).join("") + "</ol></div>";
    }
    zone.innerHTML = '<div class="vitrine">' +
      groupe('La trilogie <span class="r">Last Track</span>', "La bande contre les zombies, en trois épisodes et trois styles de jeu.", tri, "vitrine-trilogie") +
      groupe('Les autres <span class="b">aventures</span>', "Une course néon et une quête de chevalier.", autres, "vitrine-solo") +
      "</div>";
  }

  /* ---------- Catalogue (jeux.html) ---------- */
  function catalogue() {
    var zone = document.getElementById("liste-jeux");
    var zoneFiltres = document.getElementById("filtres-jeux");
    var compteur = document.getElementById("compteur-jeux");
    var tous = jeuxTries();
    var genreActif = "tous";

    if (!tous.length) {
      zone.innerHTML = MESSAGE_VIDE;
      zone.classList.remove("grille-3");
      zoneFiltres.parentNode.classList.add("cache");
      return;
    }
    var genres = [];
    tous.forEach(function (j) { if (j.genre && genres.indexOf(j.genre) === -1) genres.push(j.genre); });
    genres.sort();

    function afficher() {
      var l = tous.filter(function (j) { return genreActif === "tous" || j.genre === genreActif; });
      zone.innerHTML = l.map(carte).join("");
      compteur.textContent = l.length + (l.length > 1 ? " jeux" : " jeu");
    }
    if (genres.length > 1) {
      zoneFiltres.innerHTML = ["tous"].concat(genres).map(function (g) {
        return '<button type="button" class="filtre" data-genre="' + esc(g) + '" aria-pressed="' + (g === genreActif) + '">' + (g === "tous" ? "Tous les jeux" : esc(g)) + "</button>";
      }).join("");
      zoneFiltres.addEventListener("click", function (e) {
        var b = e.target.closest("[data-genre]");
        if (!b) return;
        genreActif = b.getAttribute("data-genre");
        zoneFiltres.querySelectorAll("[data-genre]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        afficher();
      });
    } else {
      zoneFiltres.parentNode.classList.add("cache");
    }
    afficher();
  }

  /* ---------- Derniers jeux (accueil) ---------- */
  function derniers() {
    var zone = document.getElementById("derniers-jeux");
    var l = jeuxTries().slice(0, Number(zone.getAttribute("data-limite")) || 3);
    if (!l.length) {
      zone.classList.remove("grille-3");
      zone.innerHTML = '<div class="carte"><p>🕹️ Les premiers jeux arrivent bientôt. <a href="jeux.html">Voir la section Jeux ›</a></p></div>';
      return;
    }
    zone.innerHTML = l.map(carte).join("");
  }

  /* ---------- Jouer (jouer.html) ---------- */
  function jouer() {
    var id = new URLSearchParams(location.search).get("jeu");
    var j = idValide(id) ? trouver(id) : null;
    if (j && j.bientot) j = null;
    var zone = document.getElementById("zone-jeu");
    if (!j) {
      document.getElementById("titre-jeu").textContent = "Jeu introuvable";
      zone.innerHTML = '<div class="carte vide"><p>Ce jeu n\'existe pas ou n\'est plus disponible.</p><p><a class="btn btn-bleu" href="jeux.html">Voir tous les jeux</a></p></div>';
      return;
    }
    document.title = j.titre + " – Nicotch Rétro Games";
    document.getElementById("titre-jeu").textContent = j.titre;
    document.getElementById("fil-jeu").textContent = j.titre;
    document.getElementById("desc-jeu").textContent = j.description || "";
    var portrait = j.format === "portrait";
    zone.innerHTML =
      etiquettes(j) +
      '<div class="cadre-jeu' + (portrait ? " portrait" : "") + '" id="cadre-jeu">' +
        '<iframe id="iframe-jeu" src="' + esc(cheminJeu(j)) + '" title="' + esc(j.titre) + '" allow="fullscreen; gamepad; autoplay" allowfullscreen></iframe>' +
      "</div>" +
      '<div class="jeu-actions">' +
        '<button type="button" class="btn btn-rouge" id="btn-plein-ecran">⛶ Plein écran</button>' +
        '<a class="btn btn-contour" href="' + esc(cheminJeu(j)) + '" target="_blank" rel="noopener">↗ Ouvrir le jeu seul</a>' +
        '<a class="btn btn-contour" href="jeux.html">← Tous les jeux</a>' +
      "</div>" +
      '<div class="jeu-infos">' +
        '<div>' +
          (j.commandes ? '<div class="bandeau-alerte bandeau-info"><strong>🎮 Commandes</strong><ul class="liste-commandes">' +
            j.commandes.split(/\.\s+/).filter(Boolean).map(function (c) { return "<li>" + esc(c.replace(/\.$/, "")) + "</li>"; }).join("") + "</ul></div>" : "") +
          (!j.mobile ? '<p class="meta-rapport">Ce jeu est conçu pour un ordinateur (clavier' + (j.manette ? ", souris ou manette" : " et souris") + ") : il n'est pas jouable au doigt sur téléphone.</p>" : "") +
        "</div>" +
        (j.affiche ? '<img class="jeu-affiche" src="' + esc(j.affiche) + '" alt="Affiche de ' + esc(j.titre) + '" loading="lazy">' : "") +
      "</div>" +
      '<p class="meta-rapport">Astuce : cliquez une fois dans le jeu pour que le clavier fonctionne. Le premier chargement peut prendre quelques secondes (moteur de jeu d’environ 40 Mo), les suivants sont bien plus rapides.</p>';

    var cadre = document.getElementById("cadre-jeu");
    var btn = document.getElementById("btn-plein-ecran");
    var peutPleinEcran = !!(cadre.requestFullscreen || cadre.webkitRequestFullscreen);
    if (!peutPleinEcran) { btn.disabled = true; btn.title = "Le plein écran n'est pas disponible sur cet appareil"; }
    btn.addEventListener("click", function () {
      var f = cadre.requestFullscreen || cadre.webkitRequestFullscreen;
      try {
        var r = f && f.call(cadre);
        if (r && r.catch) r.catch(function () {});
      } catch (e) { /* refusé par le navigateur : rien à faire */ }
      var ifr = document.getElementById("iframe-jeu");
      if (ifr) ifr.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("bloc-trilogie")) trilogie();
    if (document.getElementById("liste-jeux")) catalogue();
    if (document.getElementById("derniers-jeux")) derniers();
    if (document.getElementById("zone-jeu")) jouer();
  });
})();
