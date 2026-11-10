/* =========================================================
   Nicotch — fabrication du rapport de diagnostic
   Utilisé par la page Diagnostic (rapport en cours) et par la page
   Historique (réafficher un rapport enregistré).
   ========================================================= */
(function () {
  "use strict";
  var ND = window.ND = window.ND || {};
  var esc = function (s) { return ND.esc(s); };

  var FAMILLES = { ps4: "ps", ps5: "ps", xone: "xbox", xseries: "xbox", "switch": "switch" };

  /* Texte adapté au modèle : chaîne simple, ou objet { modèle / famille / def } */
  ND.tx = function (valeur, modele) {
    if (valeur == null) return "";
    if (typeof valeur !== "object" || Array.isArray(valeur)) return valeur;
    var fam = FAMILLES[modele];
    if (modele && valeur[modele] != null) return valeur[modele];
    if (fam && valeur[fam] != null) return valeur[fam];
    if (valeur.def != null) return valeur.def;
    return "";
  };

  /* Un élément « only » s'applique-t-il au modèle choisi ? */
  ND.applicable = function (el, modele) {
    if (!el || !el.only) return true;
    if (!modele) return false;
    return el.only.indexOf(modele) !== -1 || el.only.indexOf(FAMILLES[modele]) !== -1;
  };

  ND.trouverProbleme = function (type, id) {
    var liste = type === "console" ? window.ND_DIAG.consoles : window.ND_DIAG.pc;
    for (var i = 0; i < liste.length; i++) if (liste[i].id === id) return liste[i];
    return null;
  };
  ND.trouverPlateforme = function (id) {
    var l = window.ND_DIAG.plateformes || [];
    for (var i = 0; i < l.length; i++) if (l[i].id === id) return l[i];
    return null;
  };
  ND.trouverModele = function (plateforme, id) {
    if (!plateforme) return null;
    for (var i = 0; i < plateforme.modeles.length; i++) if (plateforme.modeles[i].id === id) return plateforme.modeles[i];
    return null;
  };

  var LIBELLE_CAUSE = { forte: ["Fréquent", "p-forte"], moyenne: ["Possible", "p-moyenne"], faible: ["Plus rare", "p-faible"] };

  /* Description de l'appareil, ex. « Console PlayStation — PS5 » */
  ND.libelleAppareil = function (d) {
    if (d.type !== "console") return "Ordinateur (PC)";
    var p = ND.trouverPlateforme(d.plateforme);
    var m = ND.trouverModele(p, d.modele);
    return "Console " + (p ? p.nom : "") + (m ? " — " + m.nom + " (" + m.detail + ")" : "");
  };

  /*
    d = { type, plateforme, modele, probleme, resultat, reponses:[{q,r}], date, faits:[index] }
    options = { interactif: true/false }
  */
  ND.rendreRapport = function (d, options) {
    options = options || {};
    var prob = ND.trouverProbleme(d.type, d.probleme);
    if (!prob || !prob.resultats[d.resultat]) {
      return '<div class="carte"><p>Ce rapport ne peut pas être affiché (données introuvables). Il provient peut-être d\'une ancienne version du site.</p></div>';
    }
    var r = prob.resultats[d.resultat];
    var m = d.modele;
    var faits = d.faits || [];
    var h = [];

    h.push('<article class="carte rapport" aria-labelledby="titre-rapport">');
    h.push('<p class="rapport-impression-entete">Rapport généré par Nicotch (Diagnostic &amp; Réparation) — outil d\'aide au dépannage, résultat indicatif.</p>');
    h.push('<div class="rapport-entete">');
    h.push('<img src="assets/logos/repare-carre-300.png" width="96" height="96" alt="Nicotch – Répare console et PC">');
    h.push("<div><p class=\"meta-rapport\">Rapport de diagnostic · " + esc(ND.dateFr(d.date)) + "</p>");
    h.push('<h2 id="titre-rapport">' + esc(ND.tx(r.titre, m)) + "</h2>");
    h.push('<p class="meta-rapport"><strong>Appareil :</strong> ' + esc(ND.libelleAppareil(d)) + " · <strong>Problème :</strong> " + esc(ND.tx(prob.titre, m)) + "</p></div>");
    h.push("</div>");

    h.push('<div class="bandeau-alerte bandeau-info"><strong>Résultat indicatif.</strong> Ce rapport liste des causes <em>possibles</em> d\'après vos réponses. Il ne constitue pas un diagnostic certain : seuls les contrôles ci-dessous permettent de confirmer la cause.</div>');
    if (r.intro) h.push("<p>" + esc(ND.tx(r.intro, m)) + "</p>");

    // Réponses données
    if (d.reponses && d.reponses.length) {
      h.push("<h3>Vos réponses</h3><ol class=\"liste-reponses\">");
      d.reponses.forEach(function (x) { h.push("<li>" + esc(x.q) + " → <b>" + esc(x.r) + "</b></li>"); });
      h.push("</ol>");
    }

    // Sauvegarde
    if (r.sauvegarde) {
      h.push('<div class="bandeau-alerte"><strong>⚠️ Sauvegardez vos données.</strong> Certaines étapes peuvent entraîner une perte de données. Si vous avez encore accès à vos fichiers, copiez-les sur un autre support avant de continuer. <a href="fiches.html?fiche=stock-sauvegarde">Comment sauvegarder ?</a></div>');
    }

    // Causes
    h.push("<h3>Causes possibles</h3><ul class=\"causes\">");
    (r.causes || []).forEach(function (c) {
      var lib = LIBELLE_CAUSE[c[1]] || LIBELLE_CAUSE.moyenne;
      h.push('<li><span class="pastille ' + lib[1] + '">' + lib[0] + "</span><span>" + esc(ND.tx(c[0], m)) + "</span></li>");
    });
    h.push("</ul>");

    // Contrôles
    var controles = (r.controles || []).filter(function (c) { return ND.applicable(c, m); });
    h.push("<h3>Contrôles à effectuer, dans l'ordre</h3>");
    h.push('<p class="meta-rapport">Du plus simple au plus technique. Arrêtez-vous dès que le problème est réglé.</p>');
    h.push('<ol class="controles">');
    controles.forEach(function (c, i) {
      var niv = c.niv || 1;
      var fait = faits.indexOf(i) !== -1;
      h.push('<li class="controle' + (fait ? " fait" : "") + '" data-index="' + i + '">');
      h.push('<div class="controle-tete"><span class="num" aria-hidden="true">' + (i + 1) + "</span><div>");
      h.push("<h4>" + esc(ND.tx(c.t, m)) + "</h4>");
      h.push('<div class="etiquettes"><span class="etiquette niv-' + niv + '">Difficulté : ' + ND.NIVEAUX[niv] + '</span><span class="etiquette">🧰 ' + esc(ND.tx(c.outils, m) || "Aucun outil") + "</span>" + (fait ? '<span class="etiquette niv-1">✓ Effectué</span>' : "") + "</div>");
      h.push("</div></div>");
      h.push("<p>" + esc(ND.tx(c.comment, m)) + "</p>");
      if (c.attendu) h.push('<p class="resultat-attendu"><strong>Résultat attendu :</strong> ' + esc(ND.tx(c.attendu, m)) + "</p>");
      h.push('<div class="suite">');
      if (c.ok) h.push('<div class="ok">✅ <strong>Si c\'est le cas :</strong> ' + esc(ND.tx(c.ok, m)) + "</div>");
      if (c.ko) h.push('<div class="ko">➡️ <strong>Sinon :</strong> ' + esc(ND.tx(c.ko, m)) + "</div>");
      h.push("</div>");
      if (options.interactif) {
        h.push('<label class="case-fait"><input type="checkbox" data-fait="' + i + '"' + (fait ? " checked" : "") + "> J'ai effectué ce contrôle</label>");
      }
      h.push("</li>");
    });
    h.push("</ol>");

    // Précautions
    var avert = (r.avert || []).map(function (a) { return ND.tx(a, m); });
    h.push("<h3>Précautions importantes</h3>");
    avert.forEach(function (a) { h.push('<div class="bandeau-alerte bandeau-danger"><strong>Attention :</strong> ' + esc(a) + "</div>"); });
    h.push('<div class="bandeau-alerte"><strong>Besoin d\'aide ?</strong> ' + esc(ND.tx(r.pro, m) || "En cas de doute, de risque électrique ou si les contrôles ne suffisent pas, faites appel à un professionnel de la réparation.") + "</div>");

    // Assistance officielle (consoles)
    if (d.type === "console") {
      var p = ND.trouverPlateforme(d.plateforme);
      if (p && p.support) {
        h.push('<p><strong>Assistance officielle :</strong> <a href="' + esc(p.support.url) + '" target="_blank" rel="noopener">' + esc(p.support.nom) + "</a> — procédures du fabricant, état de la garantie et réparations.</p>");
      }
    }

    // Fiches liées
    // Pour une console, on n'affiche pas les fiches propres à une autre marque
    var CAT_MARQUE = { ps: "ps", xbox: "xbox", "switch": "nintendo" };
    var marque = d.type === "console" ? CAT_MARQUE[FAMILLES[m]] : null;
    var fiches = (r.fiches || []).map(function (id) {
      for (var i = 0; i < window.ND_FICHES.length; i++) if (window.ND_FICHES[i].id === id) return window.ND_FICHES[i];
      return null;
    }).filter(function (f) {
      if (!f) return false;
      if (!marque) return true;
      var marquesFiche = f.cats.filter(function (c) { return c === "ps" || c === "xbox" || c === "nintendo"; });
      return marquesFiche.length === 0 || marquesFiche.indexOf(marque) !== -1;
    });
    if (fiches.length) {
      h.push('<h3 class="no-print">Fiches de dépannage liées</h3><div class="liens-fiches no-print">');
      fiches.forEach(function (f) {
        h.push('<a class="btn btn-contour btn-petit" href="fiches.html?fiche=' + encodeURIComponent(f.id) + '">' + f.icone + " " + esc(f.titre) + "</a>");
      });
      h.push("</div>");
    }

    h.push("</article>");
    return h.join("");
  };
})();
