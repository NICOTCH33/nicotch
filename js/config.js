/* =========================================================
   Nicotch — Configurateur PC (données : js/data-config.js)
   - choix de la gamme
   - choix des pièces (la 1re de chaque liste = conseillée)
   - adaptation automatique carte mère / RAM au processeur
   - 6 vérifications de compatibilité
   - puissance d'alimentation conseillée (même formule que le calculateur)
   ========================================================= */
(function () {
  "use strict";

  var COMPOSANTS = [
    { id: "cpu", nom: "Processeur", icone: "🧠" },
    { id: "cm", nom: "Carte mère", icone: "🟩" },
    { id: "ram", nom: "Mémoire vive (RAM)", icone: "📏" },
    { id: "gpu", nom: "Carte graphique", icone: "🎮" },
    { id: "ssd", nom: "Stockage", icone: "💾" },
    { id: "alim", nom: "Alimentation", icone: "⚡" },
    { id: "refroid", nom: "Refroidissement du processeur", icone: "❄️" },
    { id: "boitier", nom: "Boîtier", icone: "📦" }
  ];
  // Même formule que le calculateur d'alimentation
  var BASE_CARTE_MERE = 50, PAR_BARRETTE = 4, PAR_SSD = 6, PAR_VENTILO = 3, POMPE = 10, MARGE = 1.25;
  var TAILLES = [450, 550, 650, 750, 850, 1000, 1200, 1300, 1600];
  var MARGE_GPU = 20; // mm de marge conseillée entre la carte graphique et la façade

  var C, P, esc, gamme, choix = {}, messageAuto = "";

  function $(id) { return document.getElementById(id); }
  function piece(slot) { return P[choix[slot]]; }

  /* Pièces proposées pour un composant, filtrées selon la compatibilité */
  function options(slot) {
    var liste = gamme.composants[slot] || [];
    if (slot === "cm") {
      var cpu = piece("cpu");
      liste = liste.filter(function (id) { return P[id].socket === cpu.socket; });
    }
    if (slot === "ram") {
      var cm = piece("cm");
      liste = liste.filter(function (id) { return P[id].ddr === cm.ddr; });
    }
    return liste;
  }

  /* Si la pièce choisie n'est plus compatible, on prend la 1re compatible */
  function adapter() {
    var avant = { cm: choix.cm, ram: choix.ram };
    ["cm", "ram"].forEach(function (slot) {
      var ok = options(slot);
      if (ok.indexOf(choix[slot]) === -1) {
        // pour la RAM, on garde si possible la même quantité
        var meme = slot === "ram" && P[avant.ram] ? ok.filter(function (id) { return P[id].go === P[avant.ram].go; })[0] : null;
        choix[slot] = meme || ok[0];
      }
    });
    var change = [];
    if (avant.cm && avant.cm !== choix.cm) change.push("la carte mère");
    if (avant.ram && avant.ram !== choix.ram) change.push("la mémoire vive");
    if (change.length) {
      var phrase = change.join(" et ") + (change.length > 1 ? " ont été adaptées" : " a été adaptée") + " automatiquement au processeur choisi.";
      messageAuto = "🔄 " + phrase.charAt(0).toUpperCase() + phrase.slice(1);
    } else { messageAuto = ""; }
  }

  function choisirGamme(id, defiler) {
    var g = C.GAMMES.filter(function (x) { return x.id === id; })[0];
    if (!g || g === gamme) {            // clic sur le PC déjà ouvert : on referme
      gamme = null;
      try { history.replaceState(null, "", location.pathname); } catch (e) { /* rien */ }
      afficherGammes(); $("detail").hidden = true; return;
    }
    gamme = g;
    choix = {};
    COMPOSANTS.forEach(function (c) { choix[c.id] = (gamme.composants[c.id] || [])[0]; });
    messageAuto = "";
    try { history.replaceState(null, "", "#" + gamme.id); } catch (e) { /* rien */ }
    afficherGammes(); afficher();
    $("detail").hidden = false;
    if (defiler) $("detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- Dessins (SVG néon) ---------- */
  var ICONES = {
    cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9" y="9" width="6" height="6" rx=".5"/><path d="M9 2v4M12 2v4M15 2v4M9 18v4M12 18v4M15 18v4M2 9h4M2 12h4M2 15h4M18 9h4M18 12h4M18 15h4"/>',
    cm: '<rect x="3" y="3" width="18" height="18" rx="1.5"/><rect x="6" y="6" width="5" height="5"/><path d="M14 5v7M16.5 5v7M6 15h12M6 18h9"/><circle cx="18.5" cy="18" r=".8"/>',
    ram: '<rect x="2" y="7" width="20" height="8" rx="1"/><rect x="4.5" y="9" width="3" height="4"/><rect x="10.5" y="9" width="3" height="4"/><rect x="16.5" y="9" width="3" height="4"/><path d="M4 15v2M7 15v2M10 15v2M14 15v2M17 15v2M20 15v2"/>',
    gpu: '<path d="M2 5h2v15"/><rect x="4" y="6" width="18" height="11" rx="1.5"/><circle cx="9" cy="11.5" r="3.2"/><circle cx="17" cy="11.5" r="3.2"/><path d="M7 17v2h9v-2"/>',
    ssd: '<rect x="2" y="8" width="20" height="8" rx="1"/><circle cx="19.5" cy="12" r="1.2"/><rect x="5" y="10" width="4" height="4"/><rect x="10.5" y="10" width="4" height="4"/><path d="M2 10H1M2 14H1"/>',
    alim: '<rect x="2" y="5" width="20" height="14" rx="1.5"/><circle cx="9" cy="12" r="4.5"/><path d="M9 7.5v9M4.5 12h9"/><path d="M17.5 8.5l-1.5 3h2.5l-1.5 3"/>',
    refroid: '<circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="2"/><path d="M12 10c-1-3 0-5.5 3-6M14 12c3-1 5.5 0 6 3M12 14c1 3 0 5.5-3 6M10 12c-3 1-5.5 0-6-3"/>',
    boitier: '<rect x="6" y="2" width="12" height="20" rx="1.5"/><rect x="8.5" y="5" width="7" height="9" rx="1"/><circle cx="12" cy="17.5" r="1.5"/><path d="M8 20h8"/>'
  };
  function icone(id) {
    return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONES[id] + "</svg>";
  }

  /* PC monté qui « grandit » et s'équipe avec la gamme (niveau 1 à 4) */
  function dessinPC(niveau) {
    var h = 84 + niveau * 10, w = 58 + niveau * 6, x = (120 - w) / 2, y = 136 - h;
    var vitreW = w - 22, nbVentilos = niveau === 1 ? 2 : 3, ventiloR = Math.min(7, (h - 34) / (nbVentilos * 2.6));
    var id = "pcg" + niveau, svg = "";
    svg += '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF2B3A"/><stop offset="1" stop-color="#48A9FF"/></linearGradient></defs>';
    // halo au sol
    svg += '<ellipse cx="60" cy="137" rx="' + (w / 2 + 8) + '" ry="3.5" fill="url(#' + id + ')" opacity=".35"/>';
    // boîtier
    svg += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5" fill="#0B0F15" stroke="url(#' + id + ')" stroke-width="2.2"/>';
    // vitre
    var vx = x + 5, vy = y + 6, vh = h - 12;
    svg += '<rect x="' + vx + '" y="' + vy + '" width="' + vitreW + '" height="' + vh + '" rx="2.5" fill="#121822" stroke="#3a4656" stroke-width="1"/>';
    // carte mère + processeur
    svg += '<rect x="' + (vx + 3) + '" y="' + (vy + 3) + '" width="' + (vitreW - 6) + '" height="' + (vh * 0.55) + '" rx="1.5" fill="#0d1a14" stroke="#2c5a3e" stroke-width=".8"/>';
    var cx = vx + vitreW * 0.42, cy = vy + vh * 0.2;
    if (niveau >= 3) {
      // watercooling AIO : radiateur en haut + tuyaux + pompe
      svg += '<rect x="' + (vx + 3) + '" y="' + (vy + 2) + '" width="' + (vitreW - 6) + '" height="5" rx="1" fill="#1d2633" stroke="#48A9FF" stroke-width=".9"/>';
      svg += '<path d="M' + (cx - 3) + " " + (vy + 7) + "v" + (cy - vy - 9) + "M" + (cx + 3) + " " + (vy + 7) + "v" + (cy - vy - 9) + '" stroke="#5c6b80" stroke-width="1.4" fill="none"/>';
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="5" fill="#141c27" stroke="url(#' + id + ')" stroke-width="1.4"/>';
    } else {
      svg += '<rect x="' + (cx - 6) + '" y="' + (cy - 6) + '" width="12" height="12" rx="1.5" fill="#141c27" stroke="#8892a0" stroke-width=".9"/>';
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="4.2" fill="none" stroke="' + (niveau === 1 ? "#8892a0" : "#48A9FF") + '" stroke-width="1"/>';
    }
    // RAM
    for (var r = 0; r < 2; r++) svg += '<rect x="' + (cx + 9 + r * 3) + '" y="' + (cy - 7) + '" width="1.8" height="15" fill="' + (niveau >= 3 ? "#FF2B3A" : "#4b5566") + '"/>';
    // carte graphique (plus longue et épaisse avec la gamme)
    var gy = vy + vh * 0.58, gw = (vitreW - 8) * (0.62 + niveau * 0.09), gh = 5 + niveau * 1.2;
    svg += '<rect x="' + (vx + 3) + '" y="' + gy + '" width="' + gw + '" height="' + gh + '" rx="1.2" fill="#1a2230" stroke="url(#' + id + ')" stroke-width="1.1"/>';
    if (niveau >= 2) svg += '<rect x="' + (vx + 5) + '" y="' + (gy + gh - 1.6) + '" width="' + (gw - 4) + '" height="1" fill="#48A9FF" opacity=".8"/>';
    // cache-alimentation
    svg += '<rect x="' + (vx + 1) + '" y="' + (vy + vh - 13) + '" width="' + (vitreW - 2) + '" height="11" rx="1.5" fill="#0e131b" stroke="#2a3340" stroke-width=".8"/>';
    // ventilateurs en façade (anneaux néon)
    var fx = x + w - 8.5, zoneH = h - 16;
    for (var f = 0; f < nbVentilos; f++) {
      var fy = y + 10 + zoneH * (f + 0.5) / nbVentilos;
      var coul = nbVentilos === 1 ? "#48A9FF" : (f / (nbVentilos - 1) < 0.5 ? "#FF2B3A" : "#48A9FF");
      if (niveau >= 3 && f === 1) coul = "#B44BFF";
      svg += '<circle cx="' + fx + '" cy="' + fy + '" r="' + ventiloR + '" fill="#0B0F15" stroke="' + coul + '" stroke-width="' + (niveau >= 2 ? 1.8 : 1.2) + '"' + (niveau >= 2 ? ' class="pc-anneau"' : "") + "/>";
      svg += '<circle cx="' + fx + '" cy="' + fy + '" r="1.4" fill="' + coul + '"/>';
    }
    return '<svg class="pc-dessin" viewBox="0 0 120 142" aria-hidden="true" focusable="false">' + svg + "</svg>";
  }

  function court(p, type) {
    if (type === "cpu") return p.nom.replace(/^AMD /, "");
    if (type === "gpu") return p.nom.replace(/^(AMD Radeon|NVIDIA GeForce) /, "");
    if (type === "ram") return p.go + " Go " + p.ddr;
    return p.nom;
  }

  /* ---------- Puissance ---------- */
  function puissance() {
    var cpu = piece("cpu"), gpu = piece("gpu"), ram = piece("ram"), ref = piece("refroid"), boi = piece("boitier");
    var ventilos = (boi.ventilos || 0) + (ref.ventilos || 0);
    var total = cpu.w + gpu.w + BASE_CARTE_MERE + ram.barrettes * PAR_BARRETTE + PAR_SSD +
      ventilos * PAR_VENTILO + (ref.type2 === "aio" ? POMPE : 0);
    var conseil = TAILLES[TAILLES.length - 1];
    for (var i = 0; i < TAILLES.length; i++) { if (TAILLES[i] >= total * MARGE) { conseil = TAILLES[i]; break; } }
    if (gpu.fab > conseil) conseil = gpu.fab;
    return { total: total, conseil: conseil };
  }

  /* ---------- Les 6 vérifications ---------- */
  function verifications() {
    var cpu = piece("cpu"), cm = piece("cm"), ram = piece("ram"), gpu = piece("gpu"),
        alim = piece("alim"), ref = piece("refroid"), boi = piece("boitier"), pw = puissance();
    var v = [];
    v.push(cpu.socket === cm.socket
      ? { etat: "ok", titre: "Processeur et carte mère", texte: "Même socket " + cpu.socket + "." }
      : { etat: "ko", titre: "Processeur et carte mère", texte: "Socket différent : " + cpu.socket + " / " + cm.socket + "." });
    v.push(ram.ddr === cm.ddr
      ? { etat: "ok", titre: "Mémoire vive", texte: ram.ddr + ", comme la carte mère." }
      : { etat: "ko", titre: "Mémoire vive", texte: "La carte mère attend de la " + cm.ddr + ", pas de la " + ram.ddr + "." });
    v.push(boi.formats.indexOf(cm.format) !== -1
      ? { etat: "ok", titre: "Format de la carte mère", texte: (cm.format === "mATX" ? "Micro-ATX" : "ATX") + " accepté par le boîtier." }
      : { etat: "ko", titre: "Format de la carte mère", texte: "Ce boîtier n'accepte pas le format " + cm.format + "." });
    var marge = boi.gpuMax - gpu.longueur, conseilMm = boi.gpuMax - MARGE_GPU;
    v.push({
      etat: marge >= MARGE_GPU ? "ok" : marge >= 0 ? "attention" : "ko",
      titre: "Longueur de la carte graphique",
      texte: "Place dans le boîtier : " + boi.gpuMax + " mm. Les modèles courants mesurent jusqu'à ~" + gpu.longueur + " mm. " +
        (marge >= 0 ? "Choisissez un modèle de " + conseilMm + " mm maximum." : "Carte probablement trop longue : prenez un boîtier plus grand.")
    });
    var r;
    if (ref.type2 === "origine") {
      r = cpu.ventirad ? { etat: "ok", texte: "Ventirad livré avec le processeur." }
        : { etat: "ko", texte: "Ce processeur est vendu sans ventirad : ajoutez-en un." };
    } else if (ref.type2 === "tour") {
      r = ref.hauteur <= boi.ventiradMax ? { etat: "ok", texte: "Ventirad de " + ref.hauteur + " mm, le boîtier accepte " + boi.ventiradMax + " mm." }
        : { etat: "ko", texte: "Ventirad trop haut : " + ref.hauteur + " mm pour " + boi.ventiradMax + " mm maximum." };
    } else {
      r = !boi.radiateurs.length ? { etat: "attention", texte: "Emplacements radiateur non confirmés pour ce boîtier : à vérifier." }
        : boi.radiateurs.indexOf(ref.radiateur) !== -1 ? { etat: "ok", texte: "Radiateur " + ref.radiateur + " mm accepté par le boîtier." }
        : { etat: "ko", texte: "Le boîtier n'accepte pas de radiateur de " + ref.radiateur + " mm." };
    }
    r.titre = "Refroidissement"; v.push(r);
    v.push(alim.w >= pw.conseil
      ? { etat: "ok", titre: "Puissance de l'alimentation", texte: alim.w + " W pour " + pw.conseil + " W conseillés." }
      : { etat: "ko", titre: "Puissance de l'alimentation", texte: alim.w + " W, c'est trop juste : " + pw.conseil + " W conseillés." });
    return v;
  }

  /* ---------- Affichage ---------- */
  function afficherGammes() {
    $("gammes").innerHTML = C.GAMMES.map(function (g, i) {
      var cpu = P[g.composants.cpu[0]], gpu = P[g.composants.gpu[0]], ram = P[g.composants.ram[0]];
      return '<button type="button" class="pc-carte" data-gamme="' + esc(g.id) + '" aria-expanded="' + (g === gamme) + '" aria-controls="detail">' +
        dessinPC(i + 1) +
        '<span class="pc-nom">' + esc(g.nom) + "</span>" +
        '<span class="pc-prix">Config à <span class="nowrap">~' + esc(g.prix) + "</span></span>" +
        '<span class="pc-perf">(' + esc(g.perf).replace(/ ~/, "&nbsp;~").replace(/ fps/, "&nbsp;fps") + ")</span>" +
        '<span class="pc-specs">' + esc(court(cpu, "cpu")) + "<br>" + esc(court(gpu, "gpu")) + "<br>" + esc(court(ram, "ram")) + "</span>" +
        '<span class="pc-voir">' + (g === gamme ? "Masquer ▲" : "Voir la config ▼") + "</span></button>";
    }).join("");
  }

  function lienAchat(p) {
    return p.lien && /^https:\/\//.test(p.lien)
      ? '<a class="btn btn-contour btn-petit" href="' + esc(p.lien) + '" target="_blank" rel="sponsored noopener noreferrer">🛒 Voir le prix</a>'
      : "";
  }

  function afficher() {
    $("gamme-titre").textContent = gamme.nom + " — " + gamme.budget;
    $("gamme-usage").textContent = gamme.usage;
    $("auto-note").textContent = messageAuto;
    $("auto-note").hidden = !messageAuto;

    $("composants").innerHTML = COMPOSANTS.map(function (c, i) {
      var ok = options(c.id), p = piece(c.id), conseille = gamme.composants[c.id][0] === choix[c.id];
      var choixHtml = ok.length > 1
        ? '<label class="sr" for="sel-' + c.id + '">' + esc(c.nom) + "</label>" +
          '<select id="sel-' + c.id + '" data-slot="' + c.id + '">' + ok.map(function (id) {
            return '<option value="' + esc(id) + '"' + (id === choix[c.id] ? " selected" : "") + ">" +
              esc(P[id].nom) + (id === gamme.composants[c.id][0] ? " ★" : "") + "</option>";
          }).join("") + "</select>"
        : '<p class="ligne-nom">' + esc(p.nom) + "</p>";
      return '<li class="ligne ' + (i % 2 ? "ligne-bleue" : "ligne-rouge") + '">' +
        '<span class="ligne-ico">' + icone(c.id) + "</span>" +
        '<div class="ligne-corps"><p class="ligne-type">' + esc(c.nom) +
        (conseille ? ' <span class="badge-conseil">Conseillé</span>' : ' <span class="badge-alt">Alternative</span>') +
        (ok.length > 1 ? ' <span class="ligne-choix">' + ok.length + " choix</span>" : "") + "</p>" +
        choixHtml +
        '<p class="ligne-pourquoi">' + esc(p.pourquoi || "") + "</p></div>" +
        '<div class="ligne-achat">' + lienAchat(p) + "</div></li>";
    }).join("");

    var pw = puissance();
    $("conso").textContent = pw.total;
    $("conseil").textContent = pw.conseil;
    var v = verifications();
    var ko = v.filter(function (x) { return x.etat === "ko"; }).length;
    var att = v.filter(function (x) { return x.etat === "attention"; }).length;
    var SYMB = { ok: "✅", attention: "⚠️", ko: "❌" };
    $("verifs").innerHTML = v.map(function (x) {
      return '<li class="verif verif-' + x.etat + '"><span aria-hidden="true">' + SYMB[x.etat] + "</span>" +
        "<div><strong>" + esc(x.titre) + "</strong><br>" + esc(x.texte) + "</div></li>";
    }).join("");
    $("bilan").className = "config-bilan " + (ko ? "bilan-ko" : att ? "bilan-attention" : "bilan-ok");
    $("bilan").textContent = ko ? "❌ " + ko + (ko > 1 ? " problèmes" : " problème") + " de compatibilité"
      : att ? "⚠️ Compatible, avec " + att + (att > 1 ? " points" : " point") + " à vérifier"
      : "✅ Tout est compatible";
  }

  document.addEventListener("DOMContentLoaded", function () {
    C = window.ND_CONFIG; P = C.PIECES; esc = window.ND.esc;
    $("mise-a-jour").textContent = C.MISE_A_JOUR;

    $("gammes").addEventListener("click", function (e) {
      var b = e.target.closest(".pc-carte");
      if (b) choisirGamme(b.getAttribute("data-gamme"), true);
    });
    $("composants").addEventListener("change", function (e) {
      var s = e.target.closest("select[data-slot]");
      if (!s) return;
      choix[s.getAttribute("data-slot")] = s.value;
      adapter(); afficher();
      var nouveau = $("sel-" + s.getAttribute("data-slot"));
      if (nouveau) nouveau.focus();
    });
    $("btn-reinit").addEventListener("click", function () { var id = gamme.id; gamme = null; choisirGamme(id); });
    $("btn-imprimer").addEventListener("click", function () { window.print(); });

    var depart = (location.hash || "").slice(1);
    afficherGammes();
    if (depart) choisirGamme(depart);
  });
})();
