/* =========================================================
   Nicotch — tableau des scores en ligne (page jouer.html)
   ---------------------------------------------------------
   Fonctionnement :
   1. À la fin d'une partie, le jeu (dans l'iframe) envoie son score
      à la page avec :
        window.parent.postMessage({ source: "nicotch-jeu", type: "score",
                                    score: 12450, variante: "normal" }, "*");
   2. La page propose au joueur d'entrer un pseudo.
   3. Le score part dans la base Supabase (fonction ajouter_score),
      et le classement se met à jour.

   CONFIG : colle ici l'adresse du projet Supabase et la clé publique
   (« Publishable key » ou « anon public »). Ces deux valeurs sont
   publiques par nature : la sécurité est assurée côté base.
   Tant qu'elles sont vides, le tableau des scores reste caché.
   ========================================================= */
var ND_SCORES = {
  URL: "https://vviakpuooiafkgdpottz.supabase.co",   // ex. "https://abcdefghij.supabase.co"
  CLE: "sb_publishable_CXE2Lii_-UAU667IoMKc0A_kj_evsXQ"    // ex. "sb_publishable_xxxxxxxx" ou "eyJhbGciOi..."
};

(function () {
  "use strict";
  var MOTS = /(connard|connasse|encul|salope|pute|putain|merde|batard|bite|couille|nique|ntm|fdp|pd|nazi|hitler|fuck|shit|bitch|dick|cunt|nigg)/i;
  var NOMS_VARIANTES = { easy: "Plage", normal: "Campagne", hard: "Montagne" };

  function lire(cle) { try { return localStorage.getItem(cle); } catch (e) { return null; } }
  function ecrire(cle, v) { try { localStorage.setItem(cle, v); } catch (e) { /* stockage indisponible */ } }

  function entetes() {
    var h = { "apikey": ND_SCORES.CLE, "Content-Type": "application/json", "Accept": "application/json" };
    if (/^eyJ/.test(ND_SCORES.CLE)) h.Authorization = "Bearer " + ND_SCORES.CLE; // ancienne clé « anon »
    return h;
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!ND_SCORES.URL || !ND_SCORES.CLE) return;
    var zone = document.getElementById("zone-jeu");
    var idJeu = new URLSearchParams(location.search).get("jeu");
    var jeu = (window.ND_JEUX || []).filter(function (j) { return j.id === idJeu; })[0];
    if (!zone || !jeu || !jeu.scores) return;
    var esc = window.ND.esc;
    var base = ND_SCORES.URL.replace(/\/$/, "") + "/rest/v1/";
    var variante = jeu.varianteScores || null;   // piste ou mode (ex. Run 82 : easy, normal, hard)
    var dernier = null;           // dernier score reçu, en attente de pseudo

    var bloc = document.createElement("section");
    bloc.className = "carte scores";
    bloc.setAttribute("aria-labelledby", "titre-scores");
    bloc.innerHTML =
      '<h2 id="titre-scores">🏆 Tableau des scores</h2>' +
      '<p class="meta-rapport" id="scores-variante" hidden></p>' +
      '<form class="scores-envoi" id="scores-envoi" hidden novalidate>' +
        '<p class="scores-bravo" id="scores-bravo"></p>' +
        '<label class="champ-label" for="scores-pseudo">Ton pseudo (2 à 12 lettres, chiffres, - ou _)</label>' +
        '<div class="scores-ligne"><input id="scores-pseudo" maxlength="12" autocomplete="nickname" pattern="[A-Za-z0-9_-]{2,12}" required>' +
        '<button class="btn btn-rouge" type="submit" id="scores-ok">Enregistrer</button>' +
        '<button class="btn btn-contour" type="button" id="scores-non">Non merci</button></div>' +
        '<p class="meta-rapport">Seul le pseudo et le score sont publiés, rien d\'autre.</p>' +
      "</form>" +
      '<p class="contact-statut" id="scores-statut" role="status" aria-live="polite" hidden></p>' +
      '<ol class="scores-liste" id="scores-liste"><li class="texte-doux">Chargement…</li></ol>';
    var infos = zone.querySelector(".jeu-infos");
    zone.insertBefore(bloc, infos || null);

    var form = bloc.querySelector("#scores-envoi");
    var champ = bloc.querySelector("#scores-pseudo");
    var statut = bloc.querySelector("#scores-statut");
    var liste = bloc.querySelector("#scores-liste");
    champ.value = lire("nicotch_pseudo") || "";
    if (variante) { var pv = bloc.querySelector("#scores-variante"); pv.textContent = "Classement : " + (NOMS_VARIANTES[variante] || variante); pv.hidden = false; }

    function message(t, type) { statut.textContent = t; statut.className = "contact-statut " + (type || ""); statut.hidden = !t; }

    function charger() {
      var url = base + "meilleurs_scores?select=pseudo,score,cree_le&order=score.desc&limit=10&jeu=eq." + encodeURIComponent(jeu.id) +
        (variante ? "&variante=eq." + encodeURIComponent(variante) : "");
      fetch(url, { headers: entetes() })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (lignes) {
          var moi = (lire("nicotch_pseudo") || "").toLowerCase();
          liste.innerHTML = lignes.length ? lignes.map(function (l, i) {
            var rang = ["🥇", "🥈", "🥉"][i] || (i + 1) + ".";
            return '<li class="' + (l.pseudo.toLowerCase() === moi ? "scores-moi" : "") + '"><span class="scores-rang">' + rang + "</span>" +
              '<span class="scores-pseudo">' + esc(l.pseudo) + '</span><span class="scores-points">' + Number(l.score).toLocaleString("fr-FR") + "</span></li>";
          }).join("") : '<li class="texte-doux">Aucun score pour l\'instant : sois le premier ! 🚀</li>';
        })
        .catch(function () { liste.innerHTML = '<li class="texte-doux">Le classement est indisponible pour le moment.</li>'; });
    }

    // Score envoyé par le jeu
    window.addEventListener("message", function (e) {
      var ifr = document.getElementById("iframe-jeu");
      if (!ifr || e.source !== ifr.contentWindow) return;
      var d = e.data;
      if (!d || d.source !== "nicotch-jeu" || d.type !== "score") return;
      var s = Math.floor(Number(d.score));
      if (!isFinite(s) || s < 1 || s > 10000000) return;
      var v = typeof d.variante === "string" && /^[a-z0-9-]{1,20}$/.test(d.variante) ? d.variante : null;
      if (v !== variante) {
        variante = v;
        var p = bloc.querySelector("#scores-variante");
        p.textContent = v ? "Classement : " + (NOMS_VARIANTES[v] || v) : "";
        p.hidden = !v;
        charger();
      }
      dernier = s;
      bloc.querySelector("#scores-bravo").textContent = "🎉 Bravo ! " + s.toLocaleString("fr-FR") + " points. Tu veux l'inscrire au classement ?";
      form.hidden = false; message("");
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pseudo = champ.value.trim();
      if (!/^[A-Za-z0-9_-]{2,12}$/.test(pseudo)) { message("Pseudo : 2 à 12 caractères, lettres sans accent, chiffres, - ou _.", "erreur"); champ.focus(); return; }
      if (MOTS.test(pseudo)) { message("Ce pseudo n'est pas accepté. Choisis-en un autre 🙂", "erreur"); champ.focus(); return; }
      if (dernier === null) return;
      var bouton = bloc.querySelector("#scores-ok");
      bouton.disabled = true;
      fetch(base + "rpc/ajouter_score", {
        method: "POST", headers: entetes(),
        body: JSON.stringify({ p_jeu: jeu.id, p_variante: variante, p_pseudo: pseudo, p_score: dernier })
      })
        .then(function (r) {
          if (r.ok) return;
          return r.json().catch(function () { return {}; }).then(function (j) { throw new Error(j.message || "erreur"); });
        })
        .then(function () {
          ecrire("nicotch_pseudo", pseudo);
          dernier = null; form.hidden = true;
          message("✅ Score enregistré ! Défie tes potes de faire mieux 😎", "ok");
          charger();
        })
        .catch(function (err) {
          var m = String(err.message || "");
          message(/trop rapide/.test(m) ? "⏳ Doucement ! Attends quelques secondes avant d'envoyer un autre score." :
                  /refuse/.test(m) ? "Ce pseudo n'est pas accepté. Choisis-en un autre 🙂" :
                  "❌ Le score n'a pas pu être enregistré. Réessaie dans un moment.", "erreur");
        })
        .then(function () { bouton.disabled = false; });
    });
    bloc.querySelector("#scores-non").addEventListener("click", function () { dernier = null; form.hidden = true; });

    charger();
  });
})();
