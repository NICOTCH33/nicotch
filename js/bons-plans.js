/* Nicotch — affichage de la page Bons plans (données : js/data-bons-plans.js) */
(function () {
  "use strict";
  var MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.ND_BONS_PLANS || { FAMILLES: [], PRODUITS: [] };
    var esc = window.ND.esc;
    var famille = "tout";
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

    function carte(p) {
      return '<article class="carte plan">' +
        '<div class="plan-haut"><span class="icone" aria-hidden="true">' + esc(p.icone || "🛒") + "</span>" +
        '<span class="badge-affilie">Lien affilié</span></div>' +
        "<h3>" + esc(p.titre) + "</h3>" +
        "<p>" + esc(p.pourquoi || "") + "</p>" +
        '<div class="plan-actions">' +
        '<a class="btn btn-rouge" href="' + esc(p.lien) + '" target="_blank" rel="sponsored noopener noreferrer">🛒 Voir le prix sur Amazon</a>' +
        "</div></article>";
    }

    function boutons() {
      var tous = [{ id: "tout", nom: "Tout", icone: "" }].concat(data.FAMILLES);
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
      var html = "", total = 0;
      data.FAMILLES.forEach(function (f) {
        if (famille !== "tout" && famille !== f.id) return;
        f.categories.forEach(function (c) {
          var lot = produits.filter(function (p) { return p.categorie === c.id; });
          if (!lot.length) return;   // catégorie vide : on ne l'affiche pas
          total += lot.length;
          html += '<section class="plan-section" aria-labelledby="cat-' + esc(c.id) + '">' +
            '<h2 class="plan-titre" id="cat-' + esc(c.id) + '"><span aria-hidden="true">' + esc(f.icone) + "</span> " + esc(c.nom) + "</h2>" +
            (c.outil ? '<p class="plan-outil">💡 <a href="' + esc(c.outil.lien) + '">' + esc(c.outil.texte) + " ›</a></p>" : "") +
            '<div class="grille grille-auto">' + lot.map(carte).join("") + "</div></section>";
        });
      });
      liste.innerHTML = html || '<p class="texte-doux">Aucun produit dans cette famille pour le moment.</p>';
      compteur.textContent = total + (total > 1 ? " produits" : " produit");
    }

    zoneFiltres.addEventListener("click", function (e) {
      var b = e.target.closest(".filtre");
      if (!b) return;
      famille = b.getAttribute("data-famille");
      boutons(); afficher();
    });
    boutons(); afficher();
  });
})();
