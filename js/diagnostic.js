/* =========================================================
   Nicotch — moteur du diagnostic interactif
   Fonctionne pour les PC et les consoles. Chaque écran est mémorisé
   dans une pile : le bouton « Retour » (et le bouton retour du
   navigateur) revient à l'écran précédent.
   ========================================================= */
(function () {
  "use strict";
  var ND = window.ND;
  var esc = ND.esc;

  var zone, filAriane, barreProgression, btnRetour, btnRecommencer;
  var params = new URLSearchParams(location.search);
  var type = params.get("type") === "console" ? "console" : "pc";

  /*
    Un écran = { vue, ctx: { plateforme, modele, probleme }, noeud, resultat, reponses: [...], date, faits }
    vue : "plateformes" | "modeles" | "problemes" | "question" | "resultat"
  */
  var pile = [];
  var position = -1;

  function ecranCourant() { return pile[position]; }
  function copie(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- Navigation ---------- */
  function aller(ecran, remplacer) {
    pile = pile.slice(0, position + 1);
    pile.push(ecran);
    position = pile.length - 1;
    try {
      if (remplacer) history.replaceState({ nd: position }, "");
      else history.pushState({ nd: position }, "");
    } catch (e) { /* aperçu local : sans importance */ }
    afficher(true);
  }

  function retour() {
    if (position > 0) {
      try { history.back(); } catch (e) { position--; afficher(true); }
    }
  }

  window.addEventListener("popstate", function (e) {
    var cible = e.state && typeof e.state.nd === "number" ? e.state.nd : 0;
    if (cible >= 0 && cible < pile.length) { position = cible; afficher(true); }
  });

  function recommencer() {
    var depart = ecranDepart(false);
    pile = [];
    position = -1;
    aller(depart, true);
  }

  /* Choisit l'écran de départ, éventuellement d'après l'adresse (liens depuis l'accueil ou les fiches) */
  function ecranDepart(lireAdresse) {
    var ctx = { plateforme: null, modele: null, probleme: null };
    if (type === "pc") {
      var idp = lireAdresse ? params.get("probleme") : null;
      var p = idp && ND.trouverProbleme("pc", idp);
      if (p) { ctx.probleme = p.id; return { vue: "question", ctx: ctx, noeud: p.debut, reponses: [] }; }
      return { vue: "problemes", ctx: ctx, reponses: [] };
    }
    var plat = lireAdresse ? ND.trouverPlateforme(params.get("plateforme")) : null;
    if (plat) {
      ctx.plateforme = plat.id;
      if (plat.modeles.length === 1) { ctx.modele = plat.modeles[0].id; return { vue: "problemes", ctx: ctx, reponses: [] }; }
      return { vue: "modeles", ctx: ctx, reponses: [] };
    }
    return { vue: "plateformes", ctx: ctx, reponses: [] };
  }

  /* ---------- Affichage ---------- */
  function afficher(focus) {
    var e = ecranCourant();
    if (!e) return;
    var html = "";
    if (e.vue === "plateformes") html = vuePlateformes(e);
    else if (e.vue === "modeles") html = vueModeles(e);
    else if (e.vue === "problemes") html = vueProblemes(e);
    else if (e.vue === "question") html = vueQuestion(e);
    else if (e.vue === "resultat") html = vueResultat(e);
    zone.innerHTML = html;

    btnRetour.disabled = position <= 0;
    majFilAriane(e);
    majProgression(e);
    brancherEvenements(e);

    if (focus) {
      var titre = zone.querySelector("h2");
      if (titre) { titre.setAttribute("tabindex", "-1"); titre.focus({ preventScroll: true }); }
      var haut = document.getElementById("diagnostic");
      if (haut && haut.getBoundingClientRect().top < 0) haut.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function boutonReponse(attr, ico, titre, sous) {
    return '<button type="button" class="reponse" ' + attr + '><span class="ico" aria-hidden="true">' + ico + "</span><span>" + esc(titre) +
      (sous ? "<small>" + esc(sous) + "</small>" : "") + '</span><span class="fleche" aria-hidden="true">›</span></button>';
  }

  function vuePlateformes() {
    var h = '<div class="carte question-carte"><h2>Quelle est votre console ?</h2><p class="aide">Choisissez la marque de votre console.</p><div class="reponses">';
    window.ND_DIAG.plateformes.forEach(function (p) {
      h += boutonReponse('data-plateforme="' + p.id + '"', p.icone, p.nom, p.modeles.map(function (m) { return m.nom; }).join(" · "));
    });
    return h + "</div></div>";
  }

  function vueModeles(e) {
    var p = ND.trouverPlateforme(e.ctx.plateforme);
    var h = '<div class="carte question-carte"><h2>Quel modèle de ' + esc(p.nom) + " ?</h2>";
    h += '<p class="aide">Les conseils sont adaptés à votre modèle. Le nom figure sur l\'étiquette sous ou derrière la console.</p><div class="reponses">';
    p.modeles.forEach(function (m) { h += boutonReponse('data-modele="' + m.id + '"', p.icone, m.nom, m.detail); });
    return h + "</div></div>";
  }

  function vueProblemes(e) {
    var liste = type === "console" ? window.ND_DIAG.consoles : window.ND_DIAG.pc;
    var h = '<div class="carte question-carte"><h2>Quel est le problème ?</h2><p class="aide">Choisissez le symptôme qui ressemble le plus à votre situation.</p><div class="reponses">';
    liste.forEach(function (p) { h += boutonReponse('data-probleme="' + p.id + '"', p.icone, ND.tx(p.titre, e.ctx.modele), ND.tx(p.resume, e.ctx.modele)); });
    return h + "</div></div>";
  }

  function vueQuestion(e) {
    var prob = ND.trouverProbleme(type, e.ctx.probleme);
    var n = prob.noeuds[e.noeud];
    var m = e.ctx.modele;
    var h = '<div class="carte question-carte"><p class="meta-rapport">' + prob.icone + " " + esc(ND.tx(prob.titre, m)) + "</p>";
    h += "<h2>" + esc(ND.tx(n.q, m)) + "</h2>";
    if (n.aide) h += '<p class="aide">' + esc(ND.tx(n.aide, m)) + "</p>";
    h += '<div class="reponses">';
    n.rep.forEach(function (r, i) {
      if (!ND.applicable(r, m)) return;
      h += boutonReponse('data-reponse="' + i + '"', r.ico || "•", ND.tx(r.t, m), ND.tx(r.sous, m));
    });
    return h + "</div></div>";
  }

  function vueResultat(e) {
    var d = donneesRapport(e);
    var h = ND.rendreRapport(d, { interactif: true });
    h += '<div class="actions-rapport">' +
      '<button type="button" class="btn btn-rouge" id="btn-imprimer">🖨️ Imprimer ou enregistrer en PDF</button>' +
      '<button type="button" class="btn btn-contour" id="btn-sauver">💾 Enregistrer dans l\'historique</button>' +
      '<button type="button" class="btn btn-contour" id="btn-recommencer-bas">🔄 Faire un nouveau diagnostic</button>' +
      "</div>" +
      '<p class="message-statut no-print" id="statut" role="status" aria-live="polite"></p>' +
      '<p class="meta-rapport no-print">Astuce PDF : dans la fenêtre d\'impression, choisissez l\'imprimante « Microsoft Print to PDF » ou « Enregistrer au format PDF ». L\'historique est conservé uniquement dans ce navigateur, sur cet appareil.</p>';
    return h;
  }

  function donneesRapport(e) {
    return {
      type: type,
      plateforme: e.ctx.plateforme,
      modele: e.ctx.modele,
      probleme: e.ctx.probleme,
      resultat: e.resultat,
      reponses: e.reponses,
      date: e.date,
      faits: e.faits || []
    };
  }

  function majFilAriane(e) {
    var morceaux = [];
    if (type === "console") {
      var p = ND.trouverPlateforme(e.ctx.plateforme);
      var m = ND.trouverModele(p, e.ctx.modele);
      morceaux.push(m ? m.nom : (p ? p.nom : "Choix de la console"));
    } else {
      morceaux.push("PC");
    }
    if (e.ctx.probleme) morceaux.push(ND.tx(ND.trouverProbleme(type, e.ctx.probleme).titre, e.ctx.modele));
    if (e.vue === "resultat") morceaux.push("Rapport");
    filAriane.innerHTML = "<strong>Diagnostic</strong> › " + morceaux.map(esc).join(" › ");
  }

  function majProgression(e) {
    var pct;
    if (e.vue === "resultat") pct = 100;
    else if (e.vue === "plateformes") pct = 5;
    else if (e.vue === "modeles") pct = 15;
    else if (e.vue === "problemes") pct = type === "console" ? 25 : 10;
    else pct = Math.min(85, 35 + e.reponses.length * 15);
    barreProgression.style.width = pct + "%";
    barreProgression.parentNode.setAttribute("aria-valuenow", String(pct));
  }

  /* ---------- Réactions aux clics ---------- */
  function brancherEvenements(e) {
    zone.querySelectorAll("[data-plateforme]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = ND.trouverPlateforme(b.getAttribute("data-plateforme"));
        var ctx = { plateforme: p.id, modele: null, probleme: null };
        var rep = [{ q: "Console", r: p.nom }];
        if (p.modeles.length === 1) {
          ctx.modele = p.modeles[0].id;
          aller({ vue: "problemes", ctx: ctx, reponses: rep });
        } else {
          aller({ vue: "modeles", ctx: ctx, reponses: rep });
        }
      });
    });
    zone.querySelectorAll("[data-modele]").forEach(function (b) {
      b.addEventListener("click", function () {
        var ctx = copie(e.ctx);
        ctx.modele = b.getAttribute("data-modele");
        var m = ND.trouverModele(ND.trouverPlateforme(ctx.plateforme), ctx.modele);
        aller({ vue: "problemes", ctx: ctx, reponses: e.reponses.concat([{ q: "Modèle", r: m.nom }]) });
      });
    });
    zone.querySelectorAll("[data-probleme]").forEach(function (b) {
      b.addEventListener("click", function () {
        var p = ND.trouverProbleme(type, b.getAttribute("data-probleme"));
        var ctx = copie(e.ctx);
        ctx.probleme = p.id;
        aller({ vue: "question", ctx: ctx, noeud: p.debut, reponses: e.reponses.concat([{ q: "Problème", r: ND.tx(p.titre, ctx.modele) }]) });
      });
    });
    zone.querySelectorAll("[data-reponse]").forEach(function (b) {
      b.addEventListener("click", function () {
        var prob = ND.trouverProbleme(type, e.ctx.probleme);
        var n = prob.noeuds[e.noeud];
        var r = n.rep[Number(b.getAttribute("data-reponse"))];
        var m = e.ctx.modele;
        var reps = e.reponses.concat([{ q: ND.tx(n.q, m), r: ND.tx(r.t, m) }]);
        var ctx = copie(e.ctx);
        if (r.suite) {
          aller({ vue: "question", ctx: ctx, noeud: r.suite, reponses: reps });
        } else if (r.res) {
          aller({ vue: "resultat", ctx: ctx, resultat: r.res, reponses: reps, date: new Date().toISOString(), faits: [] });
        } else if (r.aller) {
          var autre = ND.trouverProbleme(type, r.aller);
          ctx.probleme = autre.id;
          reps.push({ q: "Parcours suivi", r: ND.tx(autre.titre, m) });
          aller({ vue: "question", ctx: ctx, noeud: autre.debut, reponses: reps });
        }
      });
    });

    if (e.vue === "resultat") {
      document.getElementById("btn-imprimer").addEventListener("click", function () { window.print(); });
      document.getElementById("btn-recommencer-bas").addEventListener("click", recommencer);
      document.getElementById("btn-sauver").addEventListener("click", function () { sauvegarder(e); });
      zone.querySelectorAll("[data-fait]").forEach(function (c) {
        c.addEventListener("change", function () {
          var i = Number(c.getAttribute("data-fait"));
          e.faits = e.faits || [];
          var pos = e.faits.indexOf(i);
          if (c.checked && pos === -1) e.faits.push(i);
          if (!c.checked && pos !== -1) e.faits.splice(pos, 1);
          var li = c.closest(".controle");
          if (li) li.classList.toggle("fait", c.checked);
          if (e.idHisto) sauvegarder(e, true);
        });
      });
    }
  }

  /* ---------- Historique local (stockage du navigateur) ---------- */
  function sauvegarder(e, silencieux) {
    var statut = document.getElementById("statut");
    var histo = ND.stock.lire(ND.CLE_HISTO, []);
    if (!Array.isArray(histo)) histo = [];
    var d = donneesRapport(e);
    if (!e.idHisto) e.idHisto = "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    d.id = e.idHisto;
    var existant = histo.findIndex(function (x) { return x.id === d.id; });
    if (existant !== -1) histo[existant] = d; else histo.unshift(d);
    histo = histo.slice(0, 30); // on garde les 30 derniers rapports
    var ok = ND.stock.ecrire(ND.CLE_HISTO, histo);
    if (!silencieux && statut) {
      statut.textContent = ok
        ? "✓ Rapport enregistré dans l'historique de ce navigateur. Les cases cochées seront aussi mises à jour."
        : "Impossible d'enregistrer : le stockage du navigateur est désactivé (navigation privée ?). Vous pouvez toujours imprimer le rapport.";
      if (ok) document.getElementById("btn-sauver").textContent = "✓ Enregistré dans l'historique";
    }
  }

  /* ---------- Démarrage ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    zone = document.getElementById("zone-diagnostic");
    filAriane = document.getElementById("fil-ariane");
    barreProgression = document.querySelector(".progression span");
    btnRetour = document.getElementById("btn-retour");
    btnRecommencer = document.getElementById("btn-recommencer");

    document.getElementById("titre-diag").textContent = type === "console" ? "Diagnostiquer ma console" : "Diagnostiquer mon PC";
    document.getElementById("intro-diag").textContent = type === "console"
      ? "PlayStation, Xbox ou Nintendo Switch : répondez à quelques questions pour obtenir les causes possibles et les contrôles à faire, adaptés à votre modèle."
      : "Répondez à quelques questions simples pour obtenir les causes possibles de la panne et les contrôles à faire, du plus simple au plus technique.";
    document.title = (type === "console" ? "Diagnostic console" : "Diagnostic PC") + " – Nicotch";

    btnRetour.addEventListener("click", retour);
    btnRecommencer.addEventListener("click", recommencer);

    aller(ecranDepart(true), true);
  });
})();
