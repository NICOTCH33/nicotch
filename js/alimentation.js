/* =========================================================
   Nicotch — Calculateur d'alimentation
   Consommation maximale réaliste de chaque modèle
   (en watts). Pour modifier un chiffre ou ajouter un modèle : c'est ici.
   ========================================================= */
(function () {
  "use strict";

  /* Chaque groupe = une liste déroulante <optgroup>.
     w   = consommation maximale réaliste en jeu ou en pleine charge (watts)
     fab = (cartes graphiques) puissance d'alimentation conseillée par le fabricant, en watts */
  var PROCESSEURS = [
    { groupe: "Je ne connais pas le modèle exact", liste: [
      ["PC bureautique / basse consommation", 90],
      ["PC gaming milieu de gamme", 150],
      ["PC haut de gamme", 230],
      ["Ancien PC (4 cœurs, 6 ans et plus)", 95]
    ]},
    { groupe: "AMD Ryzen 9000 (AM5)", liste: [
      ["Ryzen 5 9600X", 88], ["Ryzen 7 9700X", 88], ["Ryzen 7 9800X3D", 162],
      ["Ryzen 9 9900X", 162], ["Ryzen 9 9950X", 230], ["Ryzen 9 9950X3D", 230]
    ]},
    { groupe: "AMD Ryzen 7000 (AM5)", liste: [
      ["Ryzen 5 7500F / 7600", 88], ["Ryzen 5 7600X", 142], ["Ryzen 7 7700", 88], ["Ryzen 7 7700X", 142],
      ["Ryzen 7 7800X3D", 120], ["Ryzen 9 7900", 88], ["Ryzen 9 7900X", 230], ["Ryzen 9 7950X", 230], ["Ryzen 9 7950X3D", 162]
    ]},
    { groupe: "AMD Ryzen 5000 (AM4)", liste: [
      ["Ryzen 5 5500 / 5600 / 5600X", 76], ["Ryzen 7 5700X", 76], ["Ryzen 7 5800X", 142],
      ["Ryzen 7 5700X3D / 5800X3D", 142], ["Ryzen 9 5900X", 142], ["Ryzen 9 5950X", 142]
    ]},
    { groupe: "AMD Ryzen 1000 à 3000 (AM4)", liste: [
      ["Ryzen 3 / Ryzen 5 (1000 à 3000)", 88], ["Ryzen 7 (1000 à 3000)", 105], ["Ryzen 9 3900X / 3950X", 142]
    ]},
    { groupe: "Intel Core Ultra 200 (LGA1851)", liste: [
      ["Core Ultra 5 245K", 159], ["Core Ultra 7 265K", 250], ["Core Ultra 9 285K", 250]
    ]},
    { groupe: "Intel Core 12e à 14e génération (LGA1700)", liste: [
      ["Core i3-12100 / 13100 / 14100", 89], ["Core i5-12400 / 13400 / 14400 (avec ou sans F)", 148],
      ["Core i5-12600K", 150], ["Core i5-13600K / 14600K", 181], ["Core i7-12700K", 190],
      ["Core i7-13700K / 14700K", 253], ["Core i9-12900K", 241], ["Core i9-13900K / 14900K", 253]
    ]},
    { groupe: "Intel Core 10e et 11e génération", liste: [
      ["Core i3-10100", 90], ["Core i5-10400 / 11400", 134], ["Core i5-10600K / 11600K", 182],
      ["Core i7-10700K / 11700K", 229], ["Core i9-10900K / 11900K", 251]
    ]},
    { groupe: "Intel Core 6e à 9e génération", liste: [
      ["Core i3 (6e à 9e gén.)", 65], ["Core i5-6500 / 7500 / 8400 / 9400", 80],
      ["Core i7-6700K / 7700K", 95], ["Core i7-8700K / 9700K", 120], ["Core i9-9900K", 150]
    ]}
  ];

  var CARTES_GRAPHIQUES = [
    { groupe: "Pas de carte graphique", liste: [
      ["Aucune (graphique intégré au processeur)", 0, 0]
    ]},
    { groupe: "NVIDIA GeForce RTX 50", liste: [
      ["RTX 5060", 145, 550], ["RTX 5060 Ti", 180, 600], ["RTX 5070", 250, 650],
      ["RTX 5070 Ti", 300, 750], ["RTX 5080", 360, 850], ["RTX 5090", 575, 1000]
    ]},
    { groupe: "NVIDIA GeForce RTX 40", liste: [
      ["RTX 4060", 115, 550], ["RTX 4060 Ti", 165, 550], ["RTX 4070", 200, 650], ["RTX 4070 Super", 220, 650],
      ["RTX 4070 Ti / 4070 Ti Super", 285, 700], ["RTX 4080 / 4080 Super", 320, 750], ["RTX 4090", 450, 850]
    ]},
    { groupe: "NVIDIA GeForce RTX 30", liste: [
      ["RTX 3050", 130, 550], ["RTX 3060", 170, 550], ["RTX 3060 Ti", 200, 600], ["RTX 3070", 220, 650],
      ["RTX 3070 Ti", 290, 750], ["RTX 3080", 320, 750], ["RTX 3080 Ti / 3090", 350, 750], ["RTX 3090 Ti", 450, 850]
    ]},
    { groupe: "NVIDIA GeForce RTX 20 et GTX 16 / 10", liste: [
      ["RTX 2060 / 2060 Super", 175, 500], ["RTX 2070 / 2070 Super", 215, 650], ["RTX 2080 / 2080 Super", 250, 650],
      ["RTX 2080 Ti", 250, 650], ["GTX 1650", 75, 300], ["GTX 1660 / 1660 Super / 1660 Ti", 125, 450],
      ["GTX 1050 Ti", 75, 300], ["GTX 1060", 120, 400], ["GTX 1070 / 1070 Ti", 180, 500], ["GTX 1080 / 1080 Ti", 250, 600]
    ]},
    { groupe: "AMD Radeon RX 9000", liste: [
      ["RX 9060 XT", 160, 450], ["RX 9070", 220, 650], ["RX 9070 XT", 304, 750]
    ]},
    { groupe: "AMD Radeon RX 7000", liste: [
      ["RX 7600", 165, 550], ["RX 7600 XT", 190, 600], ["RX 7700 XT", 245, 700], ["RX 7800 XT", 263, 700],
      ["RX 7900 GRE", 260, 700], ["RX 7900 XT", 315, 750], ["RX 7900 XTX", 355, 800]
    ]},
    { groupe: "AMD Radeon RX 6000", liste: [
      ["RX 6500 XT", 107, 400], ["RX 6600", 132, 500], ["RX 6600 XT / 6650 XT", 180, 500], ["RX 6700 XT / 6750 XT", 250, 650],
      ["RX 6800", 250, 650], ["RX 6800 XT", 300, 750], ["RX 6900 XT / 6950 XT", 335, 850]
    ]},
    { groupe: "AMD Radeon RX 5000 et RX 500", liste: [
      ["RX 5500 XT", 130, 450], ["RX 5600 XT", 150, 550], ["RX 5700 / 5700 XT", 225, 600], ["RX 570 / 580 / 590", 185, 500]
    ]},
    { groupe: "Intel Arc", liste: [
      ["Arc B570", 150, 500], ["Arc B580", 190, 600], ["Arc A750 / A770", 225, 600]
    ]}
  ];

  // Liste « à plat » : la valeur de chaque <option> est sa position dans cette liste
  function aplatir(groupes) {
    var tout = [];
    groupes.forEach(function (g) { g.liste.forEach(function (m) { tout.push({ nom: m[0], w: m[1], fab: m[2] || 0, groupe: g.groupe }); }); });
    return tout;
  }
  var CPU = aplatir(PROCESSEURS), GPU = aplatir(CARTES_GRAPHIQUES);

  var BASE_CARTE_MERE = 50;   // carte mère, chipset, ports
  var PAR_BARRETTE = 4, PAR_SSD = 6, PAR_HDD = 9, PAR_VENTILO = 3;
  var POMPE = 10, RGB_USB = 20, OVERCLOCK = 0.15; // +15 % sur processeur et carte graphique
  var MARGE = 1.25;           // marge de 25 % : l'alimentation travaille vers 75-80 % de sa puissance en pleine charge
  var TAILLES = [450, 550, 650, 750, 850, 1000, 1200, 1300, 1600];

  function $(id) { return document.getElementById(id); }
  function nombre(id, max) {
    var v = parseInt($(id).value, 10);
    if (isNaN(v) || v < 0) v = 0;
    return Math.min(v, max);
  }
  function remplir(select, groupes, plat, defaut) {
    var html = "", i = 0;
    groupes.forEach(function (g) {
      html += '<optgroup label="' + window.ND.esc(g.groupe) + '">';
      g.liste.forEach(function () {
        html += '<option value="' + i + '"' + (plat[i].nom === defaut ? " selected" : "") + ">" + window.ND.esc(plat[i].nom) + "</option>";
        i++;
      });
      html += "</optgroup>";
    });
    select.innerHTML = html;
  }

  function calculer() {
    var cpu = CPU[$("cpu").value] || CPU[0];
    var gpu = GPU[$("gpu").value] || GPU[0];
    var oc = $("overclock").checked ? 1 + OVERCLOCK : 1;
    var lignes = [
      ["Processeur", Math.round(cpu.w * oc)],
      ["Carte graphique", Math.round(gpu.w * oc)],
      ["Carte mère", BASE_CARTE_MERE],
      ["Mémoire vive", nombre("ram", 8) * PAR_BARRETTE],
      ["Stockage", nombre("ssd", 8) * PAR_SSD + nombre("hdd", 8) * PAR_HDD],
      ["Ventilation", nombre("ventilos", 12) * PAR_VENTILO + ($("watercooling").checked ? POMPE : 0)],
      ["LED et accessoires", $("rgb").checked ? RGB_USB : 0]
    ];
    var total = lignes.reduce(function (s, l) { return s + l[1]; }, 0);
    var ideal = total * MARGE;
    var conseil = TAILLES[TAILLES.length - 1];
    for (var i = 0; i < TAILLES.length; i++) { if (TAILLES[i] >= ideal) { conseil = TAILLES[i]; break; } }
    // On ne conseille jamais moins que le fabricant de la carte graphique
    var parFabricant = gpu.fab > conseil;
    if (parFabricant) conseil = gpu.fab;

    $("conso").textContent = total;
    $("conseil").textContent = conseil;
    var charge = Math.round(total / conseil * 100);
    $("jauge").style.width = Math.min(100, charge) + "%";
    $("jauge-texte").setAttribute("aria-label", "Charge estimée : " + charge + " % de l'alimentation conseillée");
    $("jauge-legende").textContent = "En pleine charge, l'alimentation conseillée travaillera à environ " + charge + " % de sa puissance.";
    $("fabricant").textContent = gpu.fab
      ? "Pour la " + gpu.nom + ", le fabricant conseille au moins " + gpu.fab + " W" +
        (parFabricant ? " : c'est cette valeur qui est retenue." : ".")
      : "";
    $("detail").innerHTML = lignes.filter(function (l) { return l[1] > 0; }).map(function (l) {
      return "<li><span>" + l[0] + "</span><span>" + l[1] + " W</span></li>";
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    remplir($("cpu"), PROCESSEURS, CPU, "Ryzen 7 7800X3D");
    remplir($("gpu"), CARTES_GRAPHIQUES, GPU, "RTX 4070");
    var form = $("alim-form");
    form.addEventListener("input", calculer);
    form.addEventListener("change", calculer);
    calculer();
  });
})();
