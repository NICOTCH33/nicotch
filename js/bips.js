/* =========================================================
   Nicotch — décodeur de bips BIOS
   1. on choisit le BIOS (ou « je ne sais pas »)
   2. on tape le rythme entendu (court / long)
   3. les codes correspondants s'affichent, avec un bouton pour les écouter
   ========================================================= */
(function () {
  "use strict";

  var ND = window.ND || {};
  var esc = ND.esc || function (s) { return String(s); };
  var DATA = ND.BIPS;
  var NIV = { ok: ["p-ok", "✅ Normal"], moyen: ["p-moyenne", "⚠️ À vérifier"], fort: ["p-forte", "⛔ Bloquant"] };

  var etat = { famille: null, motif: "" };

  /* ---------- Son : un « bip » de haut-parleur de PC ---------- */
  var audio = null;
  var finLecture = 0;
  function jouer(motif, boucle) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
    } catch (e) { return; }
    var t = Math.max(audio.currentTime + 0.05, finLecture);
    var tours = boucle ? 2 : 1;
    for (var r = 0; r < tours; r++) {
      motif.split(" ").forEach(function (b) {
        if (b === "|") { t += 0.45; return; }
        var duree = b === "L" ? 0.7 : 0.15;
        var osc = audio.createOscillator(), gain = audio.createGain();
        osc.type = "square"; osc.frequency.value = 1000;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
        gain.gain.setValueAtTime(0.06, t + duree - 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
        osc.connect(gain); gain.connect(audio.destination);
        osc.start(t); osc.stop(t + duree + 0.02);
        t += duree + 0.18;
      });
      t += 0.9;
    }
    finLecture = t;
  }

  /* ---------- Dessin d'un motif : ● court, ▬ long ---------- */
  function dessinMotif(motif, boucle) {
    var h = motif.split(" ").map(function (b) {
      if (b === "|") return '<span class="bip-pause" aria-hidden="true"></span>';
      return '<span class="bip ' + (b === "L" ? "bip-long" : "bip-court") + '" aria-hidden="true"></span>';
    }).join("");
    return '<span class="bip-motif" role="img" aria-label="' + esc(texteMotif(motif, boucle)) + '">' + h +
      (boucle ? '<span class="bip-boucle" aria-hidden="true">🔁</span>' : "") + "</span>";
  }
  function texteMotif(motif, boucle) {
    var c = 0, l = 0, morceaux = [];
    function pousse() {
      if (l) morceaux.push(l + " long" + (l > 1 ? "s" : ""));
      if (c) morceaux.push(c + " court" + (c > 1 ? "s" : ""));
      c = 0; l = 0;
    }
    var prec = "";
    motif.split(" ").forEach(function (b) {
      if (b === "|") { pousse(); morceaux.push("pause"); prec = ""; return; }
      if (b === "L" && prec === "C") pousse();
      if (b === "L") l++; else c++;
      prec = b;
    });
    pousse();
    return morceaux.join(", ") + (boucle ? " (en boucle)" : "");
  }
  function normal(motif) { return motif.replace(/[\s|]/g, ""); }

  /* ---------- Étape 1 : choix du BIOS ---------- */
  function afficherFamilles() {
    var zone = document.getElementById("familles");
    var h = DATA.familles.map(function (f) {
      return '<button type="button" class="reponse famille" data-id="' + f.id + '" aria-pressed="false">' +
        '<span class="famille-ico" aria-hidden="true">' + f.ico + "</span>" +
        "<span><span class=\"famille-nom\">" + esc(f.nom) + '</span><span class="famille-sous">' + esc(f.sous) + "</span></span></button>";
    }).join("");
    h += '<button type="button" class="reponse famille" data-id="tous" aria-pressed="false">' +
      '<span class="famille-ico" aria-hidden="true">❓</span><span><span class="famille-nom">Je ne sais pas</span>' +
      '<span class="famille-sous">On cherche dans toutes les marques</span></span></button>';
    zone.innerHTML = h;
    zone.addEventListener("click", function (e) {
      var b = e.target.closest(".famille");
      if (b) choisirFamille(b.getAttribute("data-id"), true);
    });
  }

  function choisirFamille(id, defiler) {
    etat.famille = id;
    document.querySelectorAll(".famille").forEach(function (b) {
      var actif = b.getAttribute("data-id") === id;
      b.classList.toggle("actif", actif);
      b.setAttribute("aria-pressed", actif ? "true" : "false");
    });
    document.getElementById("etape-rythme").hidden = false;
    var f = famille(id);
    document.getElementById("note-famille").textContent = f ? f.note :
      "Astuce : la marque du BIOS s'affiche souvent au démarrage, sur l'étiquette de la puce du BIOS, ou dans Windows (touche Windows + R, tapez msinfo32 : ligne « Version du BIOS »).";
    afficherCodes();
    if (defiler) document.getElementById("etape-rythme").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function famille(id) {
    for (var i = 0; i < DATA.familles.length; i++) if (DATA.familles[i].id === id) return DATA.familles[i];
    return null;
  }

  /* ---------- Étape 2 : le rythme entendu ---------- */
  function initComposeur() {
    document.getElementById("composeur").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var a = b.getAttribute("data-action");
      if (a === "C" || a === "L") {
        if (normal(etat.motif).length >= 12) return;
        etat.motif = (etat.motif ? etat.motif + " " : "") + a;
        jouer(a, false);
      } else if (a === "retour") {
        etat.motif = etat.motif.split(" ").slice(0, -1).join(" ");
      } else if (a === "effacer") {
        etat.motif = "";
      } else if (a === "ecouter" && etat.motif) {
        jouer(etat.motif, false);
        return;
      }
      majComposeur();
      afficherCodes();
    });
  }
  function majComposeur() {
    var aff = document.getElementById("motif-saisi");
    aff.innerHTML = etat.motif ? dessinMotif(etat.motif, false) + '<span class="motif-texte">' + esc(texteMotif(etat.motif, false)) + "</span>"
      : '<span class="motif-vide">Appuyez sur « Court » ou « Long » dans l\'ordre où vous les entendez.</span>';
  }

  /* ---------- Étape 3 : les codes ---------- */
  function afficherCodes() {
    var zone = document.getElementById("liste-codes");
    var liste = [];
    DATA.familles.forEach(function (f) {
      if (etat.famille !== "tous" && etat.famille !== f.id) return;
      f.codes.forEach(function (c) { liste.push({ f: f, c: c }); });
    });
    var cherche = normal(etat.motif);
    var titre = document.getElementById("titre-codes");
    if (cherche) {
      liste = liste.filter(function (x) { return normal(x.c.motif) === cherche; });
      titre.textContent = liste.length ? (liste.length === 1 ? "Code correspondant" : liste.length + " codes correspondants") : "Aucun code ne correspond exactement";
    } else {
      titre.textContent = etat.famille === "tous" ? "Tous les codes" : "Les codes de ce BIOS";
    }
    if (!liste.length) {
      zone.innerHTML = '<div class="carte vide"><p>Recomptez les bips (redémarrez le PC si besoin) ou essayez « Je ne sais pas » pour chercher dans toutes les marques.</p></div>';
      return;
    }
    zone.innerHTML = liste.map(function (x, i) {
      var c = x.c, n = NIV[c.niv] || NIV.moyen;
      return '<article class="carte code-bip">' +
        '<div class="code-tete">' + dessinMotif(c.motif, c.boucle) +
          '<button type="button" class="btn btn-contour btn-petit" data-ecoute="' + i + '">▶ Écouter</button></div>' +
        '<h3><span class="pastille ' + n[0] + '">' + n[1] + "</span> " + esc(c.sens) + "</h3>" +
        '<p class="code-motif">' + esc(texteMotif(c.motif, c.boucle)) + (etat.famille === "tous" ? " · " + esc(x.f.nom) : "") + "</p>" +
        "<p>" + esc(c.cause) + "</p>" +
        '<ul class="liste-points">' + c.faire.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        (c.fiche ? '<a class="btn btn-contour btn-petit" href="fiches.html?fiche=' + esc(c.fiche) + '">📄 Fiche : bips et RAM</a>' : "") +
        "</article>";
    }).join("");
    zone.onclick = function (e) {
      var b = e.target.closest("[data-ecoute]");
      if (b) { var x = liste[+b.getAttribute("data-ecoute")]; jouer(x.c.motif, x.c.boucle); }
    };
  }

  /* ---------- Les voyants de diagnostic ---------- */
  function afficherVoyants() {
    document.getElementById("voyants").innerHTML = DATA.voyants.map(function (v) {
      return '<div class="carte voyant"><h3><span class="led" style="background:' + v.couleur + ';box-shadow:0 0 10px ' + v.couleur + '" aria-hidden="true"></span>' + esc(v.nom) + "</h3>" +
        "<p>" + esc(v.sens) + "</p><p><strong>À faire :</strong> " + esc(v.faire) + "</p></div>";
    }).join("");
  }

  function demarrer() {
    if (!DATA) return;
    afficherFamilles();
    initComposeur();
    majComposeur();
    afficherVoyants();
    var demande = new URLSearchParams(location.search).get("bios");
    if (demande && (famille(demande) || demande === "tous")) choisirFamille(demande, false);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", demarrer); else demarrer();
})();
