/* =========================================================
   Nicotch — historique local des rapports
   Les rapports sont stockés UNIQUEMENT dans ce navigateur
   (localStorage). Rien n'est envoyé sur Internet.
   ========================================================= */
(function () {
  "use strict";
  var ND = window.ND;
  var esc = ND.esc;
  var zoneListe, zoneRapport, statut;

  function lire() {
    var h = ND.stock.lire(ND.CLE_HISTO, []);
    return Array.isArray(h) ? h : [];
  }

  function afficherListe() {
    zoneRapport.innerHTML = "";
    zoneRapport.classList.add("cache");
    zoneListe.classList.remove("cache");
    document.getElementById("barre-histo").classList.remove("cache");
    var h = lire();
    var cont = document.getElementById("liste-histo");
    document.getElementById("btn-tout-effacer").disabled = h.length === 0;
    if (!h.length) {
      cont.innerHTML = '<div class="carte vide"><p>Aucun rapport enregistré pour l\'instant.</p><p>À la fin d\'un diagnostic, cliquez sur « Enregistrer dans l\'historique ».</p>' +
        '<p><a class="btn btn-rouge" href="reparation.html#choisir">Lancer un diagnostic</a></p></div>';
      return;
    }
    cont.innerHTML = h.map(function (d) {
      var prob = ND.trouverProbleme(d.type, d.probleme);
      var res = prob && prob.resultats[d.resultat];
      return '<div class="carte histo-item"><div class="infos">' +
        '<p class="meta-rapport">' + esc(ND.dateFr(d.date)) + " · " + esc(ND.libelleAppareil(d)) + "</p>" +
        "<h3>" + esc(prob ? ND.tx(prob.titre, d.modele) : "Rapport") + "</h3>" +
        '<p class="meta-rapport">' + esc(res ? ND.tx(res.titre, d.modele) : "") + "</p></div>" +
        '<div class="groupe"><button type="button" class="btn btn-rouge btn-petit" data-voir="' + esc(d.id) + '">Voir le rapport</button>' +
        '<button type="button" class="btn btn-contour btn-petit" data-suppr="' + esc(d.id) + '">Supprimer</button></div></div>';
    }).join("");
  }

  function voir(id) {
    var d = lire().filter(function (x) { return x.id === id; })[0];
    if (!d) return;
    zoneListe.classList.add("cache");
    document.getElementById("barre-histo").classList.add("cache");
    zoneRapport.classList.remove("cache");
    zoneRapport.innerHTML =
      '<div class="diag-barre no-print"><button type="button" class="btn btn-contour btn-petit" id="btn-retour-liste">← Retour à l\'historique</button>' +
      '<button type="button" class="btn btn-rouge btn-petit" id="btn-imprimer-histo">🖨️ Imprimer ou enregistrer en PDF</button></div>' +
      ND.rendreRapport(d, { interactif: false });
    document.getElementById("btn-retour-liste").addEventListener("click", afficherListe);
    document.getElementById("btn-imprimer-histo").addEventListener("click", function () { window.print(); });
    var t = zoneRapport.querySelector("h2");
    if (t) { t.setAttribute("tabindex", "-1"); t.focus(); }
  }

  function supprimer(id) {
    if (!window.confirm("Supprimer ce rapport de l'historique ?")) return;
    ND.stock.ecrire(ND.CLE_HISTO, lire().filter(function (x) { return x.id !== id; }));
    statut.textContent = "Rapport supprimé.";
    afficherListe();
  }

  function toutEffacer() {
    if (!window.confirm("Effacer tout l'historique de ce navigateur ? Cette action est définitive.")) return;
    ND.stock.supprimer(ND.CLE_HISTO);
    statut.textContent = "Historique entièrement effacé.";
    afficherListe();
  }

  document.addEventListener("DOMContentLoaded", function () {
    zoneListe = document.getElementById("zone-liste");
    zoneRapport = document.getElementById("zone-rapport");
    statut = document.getElementById("statut-histo");
    document.getElementById("liste-histo").addEventListener("click", function (e) {
      var v = e.target.closest("[data-voir]");
      var s = e.target.closest("[data-suppr]");
      if (v) voir(v.getAttribute("data-voir"));
      if (s) supprimer(s.getAttribute("data-suppr"));
    });
    document.getElementById("btn-tout-effacer").addEventListener("click", toutEffacer);
    afficherListe();
  });
})();
