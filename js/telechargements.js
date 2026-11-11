/* Nicotch — affichage de la page Téléchargements (données : js/data-telechargements.js) */
(function () {
  "use strict";
  /* Icônes maison au trait (pas de logos de marques) */
  var ICONES = {
    cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx=".5"/><path d="M9 2v4M12 2v4M15 2v4M9 18v4M12 18v4M15 18v4M2 9h4M2 12h4M2 15h4M18 9h4M18 12h4M18 15h4"/>',
    gpu: '<path d="M2 5h2v15"/><rect x="4" y="6" width="18" height="11" rx="1.5"/><circle cx="9" cy="11.5" r="3.2"/><circle cx="17" cy="11.5" r="3.2"/><path d="M7 17v2h9v-2"/>',
    capteurs: '<path d="M3 17a9 9 0 0118 0"/><path d="M12 17l4.5-6"/><circle cx="12" cy="17" r="1.4"/><path d="M5.5 12.5l1.2.8M12 8v1.5M18.5 12.5l-1.2.8"/><path d="M8 21h8"/>',
    temp: '<path d="M10 4a2 2 0 014 0v10.3a4 4 0 11-4 0z"/><circle cx="12" cy="17.5" r="1.6"/><path d="M12 16V9M17 6h3M17 9.5h2M17 13h3"/>',
    disque: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="11" r="5"/><circle cx="12" cy="11" r="1.2"/><path d="M15.5 14.5l2.5 3.5"/><circle cx="6" cy="18" r=".6"/>',
    stress: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    ram: '<rect x="2" y="7" width="20" height="8" rx="1"/><rect x="4.5" y="9" width="3" height="4"/><rect x="10.5" y="9" width="3" height="4"/><rect x="16.5" y="9" width="3" height="4"/><path d="M4 15v2M7 15v2M10 15v2M14 15v2M17 15v2M20 15v2"/>',
    chrono: '<circle cx="12" cy="13.5" r="8"/><path d="M12 13.5l3.5-3.5M10 2.5h4M12 2.5v3M19 6l1.5-1.5"/>',
    usb: '<rect x="7" y="9" width="10" height="13" rx="1.5"/><path d="M9 9V3h6v6"/><path d="M10.5 5.5h.01M13.5 5.5h.01"/><path d="M12 13v5M10 16l2 2 2-2"/>',
    ventilo: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="2"/><path d="M12 10c-1-3 0-5.5 3-6M14 12c3-1 5.5 0 6 3M12 14c1 3 0 5.5-3 6M10 12c-3 1-5.5 0-6-3"/>',
    camembert: '<path d="M12 3a9 9 0 109 9h-9z"/><path d="M15 2.5A9 9 0 0121.5 9H15z"/>',
    corbeille: '<path d="M4 6h16M9 6V3.5h6V6"/><path d="M6 6l1 15h10l1-15"/><path d="M10 10v7M14 10v7"/>',
    demarrage: '<path d="M12 2v9"/><path d="M6.3 6.3a8 8 0 1011.4 0"/>',
    pilote: '<rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/><path d="M12 7.5v5M9.5 10.5l2.5 2.5 2.5-2.5"/>',
    archive: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 3v2M12 7v2M12 11v2"/><rect x="10" y="13" width="4" height="5" rx="1"/>',
    video: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 8.5v7l6-3.5z"/>',
    bouclier: '<path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>'
  };
  function icone(id, classe) {
    return '<span class="ligne-ico ' + (classe || "") + '" aria-hidden="true"><svg class="ico" viewBox="0 0 24 24" focusable="false">' +
      (ICONES[id] || ICONES.pilote) + "</svg></span>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var data = window.ND_TELECHARGEMENTS || { CATEGORIES: [], LOGICIELS: [] };
    var esc = window.ND.esc;
    var cat = "tout";
    var zoneFiltres = document.getElementById("filtres");
    var liste = document.getElementById("liste-logiciels");
    var compteur = document.getElementById("compteur");
    var majour = document.getElementById("mise-a-jour");
    if (majour && data.MISE_A_JOUR) { majour.textContent = "🗓️ Liste vérifiée en " + data.MISE_A_JOUR; majour.hidden = false; }

    // Sécurité : uniquement des liens https://
    var logiciels = (data.LOGICIELS || []).filter(function (l) { return /^https:\/\//.test(l.lien || ""); });

    function domaine(url) {
      try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return ""; }
    }

    function carte(l, couleur) {
      return '<article class="carte logiciel ' + couleur + '">' +
        '<div class="logiciel-haut">' + icone(l.icone) +
          '<div><h3>' + esc(l.nom) + '</h3>' +
          '<p class="logiciel-badges"><span class="badge-gratuit">Gratuit</span><span class="badge-os">Windows</span>' +
          (l.portable ? '<span class="badge-os">Version portable</span>' : "") + "</p></div></div>" +
        "<p>" + esc(l.pourquoi) + "</p>" +
        (l.attention ? '<p class="logiciel-attention">⚠️ ' + esc(l.attention) + "</p>" : "") +
        '<div class="plan-actions">' +
          '<a class="btn btn-contour" href="' + esc(l.lien) + '" target="_blank" rel="noopener noreferrer">⬇️ Site officiel</a>' +
          '<span class="logiciel-domaine">' + esc(domaine(l.lien)) + "</span>" +
        "</div></article>";
    }

    function boutons() {
      var tous = [{ id: "tout", court: "Tout" }].concat(data.CATEGORIES.map(function (c) {
        return { id: c.id, court: c.nom.split(" :")[0] };
      }));
      zoneFiltres.innerHTML = tous.map(function (c) {
        return '<button type="button" class="filtre" data-cat="' + esc(c.id) + '" aria-pressed="' + (c.id === cat) + '">' + esc(c.court) + "</button>";
      }).join("");
    }

    function afficher() {
      var html = "", total = 0;
      data.CATEGORIES.forEach(function (c, i) {
        if (cat !== "tout" && cat !== c.id) return;
        var lot = logiciels.filter(function (l) { return l.categorie === c.id; });
        if (!lot.length) return;
        total += lot.length;
        var couleur = (i % 2) ? "ligne-bleue" : "ligne-rouge";
        html += '<section class="plan-section ' + couleur + '" aria-labelledby="cat-' + esc(c.id) + '">' +
          '<h2 class="plan-titre" id="cat-' + esc(c.id) + '">' + icone(c.icone, "titre-ico") + "<span>" + esc(c.nom) + "</span></h2>" +
          (c.intro ? '<p class="plan-outil">' + esc(c.intro) + "</p>" : "") +
          '<div class="grille grille-auto">' + lot.map(function (l) { return carte(l, couleur); }).join("") + "</div></section>";
      });
      liste.innerHTML = html || '<p class="texte-doux">Aucun logiciel dans cette catégorie pour le moment.</p>';
      compteur.textContent = total + (total > 1 ? " logiciels" : " logiciel");
    }

    zoneFiltres.addEventListener("click", function (e) {
      var b = e.target.closest(".filtre");
      if (!b) return;
      cat = b.getAttribute("data-cat");
      boutons(); afficher();
    });
    boutons(); afficher();
  });
})();
