/* =========================================================
   Nicotch — bibliothèque : recherche et filtres
   ========================================================= */
(function () {
  "use strict";
  var ND = window.ND;
  var esc = ND.esc;
  var categorieActive = "toutes";
  var liste, champ, compteur;

  // Recherche sans tenir compte des accents ni des majuscules
  function normaliser(s) {
    // « Wi-Fi » et « wifi » doivent se trouver mutuellement : on retire aussi tirets et points
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[-.]/g, "");
  }
  function nomCategorie(id) {
    for (var i = 0; i < window.ND_CATEGORIES.length; i++) if (window.ND_CATEGORIES[i].id === id) return window.ND_CATEGORIES[i].nom;
    return id;
  }
  function textePourRecherche(f) {
    return normaliser([f.titre, f.symptome, f.causes.join(" "), f.verifs.join(" "), f.etapes.join(" "), f.precautions.join(" "), f.cats.map(nomCategorie).join(" ")].join(" "));
  }

  function lienDiag(f) {
    if (!f.diag) return "";
    var url = "diagnostic.html?type=" + f.diag.type;
    if (f.diag.type === "pc") url += "&probleme=" + encodeURIComponent(f.diag.id);
    else if (f.diag.plateforme) url += "&plateforme=" + encodeURIComponent(f.diag.plateforme);
    return '<p><a class="btn btn-rouge btn-petit" href="' + url + '">Lancer le diagnostic interactif</a></p>';
  }

  function rendreFiche(f) {
    var li = function (t) { return "<li>" + esc(t) + "</li>"; };
    return '<details class="carte fiche" id="' + f.id + '">' +
      '<summary><span class="ico" aria-hidden="true">' + f.icone + "</span><span>" +
      '<span class="cat">' + esc(f.cats.map(nomCategorie).join(" · ")) + "</span>" +
      "<h3>" + esc(f.titre) + "</h3>" +
      '<span class="etiquette niv-' + f.niveau + '">Difficulté : ' + ND.NIVEAUX[f.niveau] + "</span></span>" +
      '<span class="ouvrir">Détails</span></summary>' +
      '<div class="fiche-corps">' +
      "<h4>🩺 Symptôme</h4><p>" + esc(f.symptome) + "</p>" +
      "<h4>🔍 Causes fréquentes</h4><ul>" + f.causes.map(li).join("") + "</ul>" +
      "<h4>✅ Vérifications préalables</h4><ul>" + f.verifs.map(li).join("") + "</ul>" +
      "<h4>🔧 Étapes de résolution</h4><ol>" + f.etapes.map(li).join("") + "</ol>" +
      "<h4>⚠️ Précautions importantes</h4><ul>" + f.precautions.map(li).join("") + "</ul>" +
      '<p class="meta-rapport">Niveau de difficulté : ' + ND.NIVEAUX[f.niveau] + ". En cas de doute ou de risque électrique, faites appel à un professionnel.</p>" +
      lienDiag(f) +
      "</div></details>";
  }

  function filtrer() {
    var q = normaliser(champ.value.trim());
    var mots = q.split(/\s+/).filter(Boolean);
    var res = window.ND_FICHES.filter(function (f) {
      if (categorieActive !== "toutes" && f.cats.indexOf(categorieActive) === -1) return false;
      var t = f._texte || (f._texte = textePourRecherche(f));
      return mots.every(function (m) { return t.indexOf(m) !== -1; });
    });
    liste.innerHTML = res.length
      ? res.map(rendreFiche).join("")
      : '<p class="carte vide">Aucune fiche ne correspond. Essayez un autre mot (par exemple « écran », « wifi », « manette ») ou choisissez « Toutes ».</p>';
    compteur.textContent = res.length + (res.length > 1 ? " fiches affichées" : " fiche affichée") + " sur " + window.ND_FICHES.length;
  }

  function construireFiltres() {
    var zone = document.getElementById("filtres");
    var cats = [{ id: "toutes", nom: "Toutes", icone: "📚" }].concat(window.ND_CATEGORIES);
    zone.innerHTML = cats.map(function (c) {
      return '<button type="button" class="filtre" data-cat="' + c.id + '" aria-pressed="' + (c.id === categorieActive) + '">' + c.icone + " " + esc(c.nom) + "</button>";
    }).join("");
    zone.addEventListener("click", function (e) {
      var b = e.target.closest("[data-cat]");
      if (!b) return;
      categorieActive = b.getAttribute("data-cat");
      zone.querySelectorAll("[data-cat]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      filtrer();
    });
  }

  function ouvrirFicheDemandee() {
    var params = new URLSearchParams(location.search);
    var id = params.get("fiche") || (location.hash ? location.hash.slice(1) : "");
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") {
      el.open = true;
      el.classList.add("surbrillance");
      setTimeout(function () { el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 50);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    liste = document.getElementById("liste-fiches");
    champ = document.getElementById("recherche-fiches");
    compteur = document.getElementById("compteur");
    var params = new URLSearchParams(location.search);
    var cat = params.get("categorie");
    if (cat && window.ND_CATEGORIES.some(function (c) { return c.id === cat; })) categorieActive = cat;
    construireFiltres();
    champ.addEventListener("input", filtrer);
    filtrer();
    ouvrirFicheDemandee();
  });
})();
