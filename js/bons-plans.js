/* Nicotch — affichage de la page Bons plans (données : js/data-bons-plans.js) */
(function () {
  "use strict";
  /* Une icône néon par catégorie (même style que la page Config PC) */
  var ICONES = {
    outils: '<path d="M13.5 6.5l4 4"/><path d="M15.5 3.5l5 5-2.5 2.5-5-5z"/><path d="M13 9L4.5 17.5 3 21l3.5-1.5L15 11"/>',
    entretien: '<path d="M18 2l4 4M20 4l-3.5 3.5"/><path d="M16.5 7.5l-8 8a2.1 2.1 0 01-3-3l8-8z"/><path d="M10 9l2 2M7.5 11.5l2 2"/><path d="M5.5 18.5L2 22"/>',
    gpu: '<path d="M2 5h2v15"/><rect x="4" y="6" width="18" height="11" rx="1.5"/><circle cx="9" cy="11.5" r="3.2"/><circle cx="17" cy="11.5" r="3.2"/><path d="M7 17v2h9v-2"/>',
    cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx=".5"/><path d="M9 2v4M12 2v4M15 2v4M9 18v4M12 18v4M15 18v4M2 9h4M2 12h4M2 15h4M18 9h4M18 12h4M18 15h4"/>',
    cm: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><rect x="6" y="6" width="5" height="5"/><path d="M14 5v7M16.5 5v7M6 15h12M6 18h9"/><circle cx="18.5" cy="18" r=".8"/>',
    ram: '<rect x="2" y="7" width="20" height="8" rx="1"/><rect x="4.5" y="9" width="3" height="4"/><rect x="10.5" y="9" width="3" height="4"/><rect x="16.5" y="9" width="3" height="4"/><path d="M4 15v2M7 15v2M10 15v2M14 15v2M17 15v2M20 15v2"/>',
    stockage: '<rect x="2" y="8" width="20" height="8" rx="1"/><circle cx="19.5" cy="12" r="1.2"/><rect x="5" y="10" width="4" height="4"/><rect x="10.5" y="10" width="4" height="4"/><path d="M2 10H1M2 14H1"/>',
    alim: '<rect x="2" y="5" width="20" height="14" rx="1.5"/><circle cx="9" cy="12" r="4.5"/><path d="M9 7.5v9M4.5 12h9"/><path d="M17.5 8.5l-1.5 3h2.5l-1.5 3"/>',
    refroidissement: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="2"/><path d="M12 10c-1-3 0-5.5 3-6M14 12c3-1 5.5 0 6 3M12 14c1 3 0 5.5-3 6M10 12c-3 1-5.5 0-6-3"/>',
    boitiers: '<rect x="6" y="2" width="12" height="20" rx="1.5"/><rect x="8.5" y="5" width="7" height="9" rx="1"/><circle cx="12" cy="17.5" r="1.5"/><path d="M8 20h8"/>',
    ecrans: '<rect x="2" y="3" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 16v5"/>',
    claviers: '<rect x="1.5" y="6" width="21" height="12" rx="1.5"/><path d="M5 9.5h1M8.5 9.5h1M12 9.5h1M15.5 9.5h1M19 9.5h0M5 12.5h1M8.5 12.5h1M12 12.5h1M15.5 12.5h1M19 12.5h0M7 15.5h10"/>',
    souris: '<rect x="6.5" y="2.5" width="11" height="19" rx="5.5"/><path d="M12 2.5v6M6.5 9h11"/>',
    audio: '<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="2.5" y="14" width="4" height="7" rx="1.5"/><rect x="17.5" y="14" width="4" height="7" rx="1.5"/>',
    manettes: '<path d="M7 7h10a5 5 0 014.8 6.4l-1 3.5a2.5 2.5 0 01-4.2 1L14.5 16h-5l-2.1 1.9a2.5 2.5 0 01-4.2-1l-1-3.5A5 5 0 017 7z"/><path d="M7 10.5v3M5.5 12h3"/><circle cx="16" cy="11" r=".8"/><circle cx="18" cy="13" r=".8"/>'
  };
  /* Illustration néon de la catégorie (assets/categories/<id>.webp),
     avec l'icône au trait en secours si l'image n'existe pas */
  var IMAGES = ["outils", "entretien", "gpu", "cpu", "cm", "ram", "stockage", "alim", "refroidissement",
                "boitiers", "ecrans", "claviers", "souris", "audio", "manettes"];
  function icone(id, classe) {
    if (IMAGES.indexOf(id) !== -1) {
      return '<span class="cat-img ' + (classe || "") + '" aria-hidden="true"><img src="assets/categories/' + id +
        '.webp" alt="" width="256" height="256" loading="lazy" decoding="async"></span>';
    }
    return '<span class="cat-ico ' + (classe || "") + '" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24" focusable="false">' +
      (ICONES[id] || ICONES.outils) + "</svg></span>";
  }

  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.ND_BONS_PLANS || { FAMILLES: [], PRODUITS: [] };
    var esc = window.ND.esc;
    var famille = "tout";
    var jour = window.ND.aujourdhui();
    // Un produit est « en promo » si son champ promo (date de fin) n'est pas dépassé
    function enPromo(p) { return !!(p.promo && jour <= p.promo); }
    var zoneFiltres = document.getElementById("filtres");
    var liste = document.getElementById("liste-plans");
    var compteur = document.getElementById("compteur");
    var majour = document.getElementById("mise-a-jour");

    // On n'accepte que les liens https:// (sécurité)
    var produits = (data.PRODUITS || []).filter(function (p) { return /^https:\/\//.test(p.lien || ""); })
      .sort(function (a, b) { return (b.date || "").localeCompare(a.date || ""); });

    // Date « Sélection mise à jour le… » = le produit le plus récent
    var d = produits.length && /^(\d{4})-(\d{2})-(\d{2})$/.exec(produits[0].date || "");
    if (d && majour) {
      majour.textContent = "🗓️ Sélection mise à jour le " + parseInt(d[3], 10) + " " + MOIS[parseInt(d[2], 10) - 1] + " " + d[1];
      majour.hidden = false;
    }

    // Couleur alternée rouge / bleu, une par catégorie (dans l'ordre de la page)
    var couleur = {}, n = 0;
    data.FAMILLES.forEach(function (f) { f.categories.forEach(function (c) { couleur[c.id] = (n++ % 2) ? "ligne-bleue" : "ligne-rouge"; }); });

    function carte(p) {
      return '<article class="carte plan ' + couleur[p.categorie] + '">' +
        '<div class="plan-haut">' + icone(p.categorie) +
        '<span class="plan-badges">' + (enPromo(p) ? '<span class="badge-promo">🔥 Promo</span>' : "") +
        (p.affilie === false ? "" : '<span class="badge-affilie">Lien affilié</span>') + "</span></div>" +
        "<h3>" + esc(p.titre) + "</h3>" +
        "<p>" + esc(p.pourquoi || "") + "</p>" +
        (p.note ? '<p class="logiciel-attention">⚠️ ' + esc(p.note) + "</p>" : "") +
        '<div class="plan-actions">' +
        '<a class="btn btn-rouge" href="' + esc(p.lien) + '" target="_blank" rel="' + (p.affilie === false ? "nofollow" : "sponsored") + ' noopener noreferrer">🛒 Voir le prix sur ' + esc(p.marchand || "Amazon") + "</a>" +
        "</div></article>";
    }

    function boutons() {
      var tous = [{ id: "tout", nom: "Tout", icone: "" }];
      if (produits.some(enPromo)) tous.push({ id: "promos", nom: "Promos du moment", icone: "🔥" });
      tous = tous.concat(data.FAMILLES);
      zoneFiltres.innerHTML = tous.map(function (f) {
        return '<button type="button" class="filtre" data-famille="' + esc(f.id) + '" aria-pressed="' + (f.id === famille) + '">' +
          esc((f.icone ? f.icone + " " : "") + f.nom) + "</button>";
      }).join("");
    }

    function afficher() {
      if (!produits.length) {
        liste.innerHTML = '<div class="carte plan-vide"><div class="icone" aria-hidden="true">🛍️</div>' +
          "<h3>Les premiers bons plans arrivent bientôt</h3>" +
          "<p>Outils de réparation, composants et périphériques : une sélection de produits utiles, testée et conseillée.</p></div>";
        compteur.textContent = "";
        return;
      }
      var html = "", total = 0, sommaire = "";
      if (famille === "promos") {
        var promos = produits.filter(enPromo);
        liste.innerHTML = '<section class="plan-section ligne-rouge"><h2 class="plan-titre"><span>🔥 Promos du moment</span></h2>' +
          '<p class="plan-outil">Produits en promotion au moment où je les ai ajoutés. Le prix réel est toujours celui affiché sur Amazon.</p>' +
          '<div class="grille grille-auto">' + promos.map(carte).join("") + "</div></section>";
        compteur.textContent = promos.length + (promos.length > 1 ? " promos" : " promo");
        return;
      }
      data.FAMILLES.forEach(function (f) {
        if (famille !== "tout" && famille !== f.id) return;
        f.categories.forEach(function (c) {
          var lot = produits.filter(function (p) { return p.categorie === c.id; });
          if (!lot.length) return;   // catégorie vide : on ne l'affiche pas
          total += lot.length;
          sommaire += '<a class="cat-puce ' + couleur[c.id] + '" href="#cat-' + esc(c.id) + '">' + icone(c.id) +
            '<span>' + esc(c.nom) + '</span><span class="cat-nb">' + lot.length + "</span></a>";
          html += '<section class="plan-section ' + couleur[c.id] + '" aria-labelledby="cat-' + esc(c.id) + '">' +
            '<h2 class="plan-titre" id="cat-' + esc(c.id) + '">' + icone(c.id) + "<span>" + esc(c.nom) + "</span></h2>" +
            (c.outil ? '<p class="plan-outil">💡 <a href="' + esc(c.outil.lien) + '">' + esc(c.outil.texte) + " ›</a></p>" : "") +
            '<div class="grille grille-auto">' + lot.map(carte).join("") + "</div></section>";
        });
      });
      liste.innerHTML = html
        ? '<nav class="cat-sommaire" aria-label="Catégories">' + sommaire + "</nav>" + html
        : '<p class="texte-doux">Aucun produit dans cette famille pour le moment.</p>';
      compteur.textContent = total + (total > 1 ? " produits" : " produit");
    }

    zoneFiltres.addEventListener("click", function (e) {
      var b = e.target.closest(".filtre");
      if (!b) return;
      famille = b.getAttribute("data-famille");
      boutons(); afficher();
    });
    // Bandeau de l'événement (Black Friday…), visible seulement pendant les dates
    var bandeau = document.getElementById("bandeau-evenement");
    if (bandeau && window.ND.evenementActif()) {
      var ev = window.ND.EVENEMENT;
      var nb = produits.filter(enPromo).length;
      bandeau.innerHTML = "<strong>" + esc(ev.emoji + " " + ev.nom) + "</strong> sur Amazon, " + esc(ev.texte) + ". " +
        (nb ? "Les produits marqués <strong>🔥 Promo</strong> étaient en promotion quand je les ai sélectionnés : vérifiez toujours le prix sur Amazon avant d'acheter."
            : "Je sélectionne les meilleures promos utiles : revenez bientôt !");
      bandeau.hidden = false;
      if (nb) famille = "promos";
    }
    boutons(); afficher();
  });
})();
