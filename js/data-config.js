/* =========================================================
   Nicotch — données de la page CONFIG PC
   ---------------------------------------------------------
   PIECES : toutes les pièces, avec les mesures qui servent à
            vérifier la compatibilité.
   GAMMES : les 4 configs. Pour chaque composant, une liste de
            pièces : la PREMIÈRE est la pièce conseillée, les
            suivantes sont les alternatives.

   POUR AJOUTER TON LIEN AMAZON sur une pièce : remplis  lien: ""
   avec ton lien (https://amzn.to/...). Le bouton « Voir le prix »
   apparaît tout seul.

   ⚠️ Ne pas écrire de prix (règles Amazon). Les budgets des gammes
   sont indicatifs : penser à mettre à jour MISE_A_JOUR.
   perf = performance moyenne indicative dans les jeux récents (sans FSR/DLSS).

   Champs utiles pour la compatibilité :
     cpu      socket ("AM4"/"AM5"), w (watts), ventirad (true = livré avec)
     cm       socket, ddr ("DDR4"/"DDR5"), format ("mATX"/"ATX")
     ram      ddr, go, barrettes
     gpu      w (watts), fab (alim conseillée par le fabricant),
              longueur (mm, valeur haute des modèles courants)
     alim     w
     refroid  type ("origine"/"tour"/"aio"), hauteur (mm, ventirad tour),
              radiateur (mm, AIO), ventilos
     boitier  formats, gpuMax (mm), ventiradMax (mm),
              radiateurs (tailles acceptées, mm), ventilos (inclus)
   ========================================================= */
window.ND_CONFIG = {
  MISE_A_JOUR: "novembre 2026",

  PIECES: {
    /* ---------- Processeurs ---------- */
    "r5-5600":   { type: "cpu", nom: "AMD Ryzen 5 5600", socket: "AM4", w: 76, ventirad: true, lien: "",
                   pourquoi: "6 cœurs, très bon en jeu en 1080p et livré avec son ventirad. Le meilleur rapport qualité-prix du moment." },
    "r5-7500f":  { type: "cpu", nom: "AMD Ryzen 5 7500F", socket: "AM5", w: 88, ventirad: false, lien: "",
                   pourquoi: "Plateforme AM5 récente, évolutive (DDR5). Plus cher à l'achat, mais on pourra changer de processeur plus tard." },
    "r5-9600x":  { type: "cpu", nom: "AMD Ryzen 5 9600X", socket: "AM5", w: 88, ventirad: false, lien: "",
                   pourquoi: "Génération Ryzen 9000 : rapide en jeu, sobre en consommation, sur une plateforme AM5 évolutive." },
    "r7-9800x3d":{ type: "cpu", nom: "AMD Ryzen 7 9800X3D", socket: "AM5", w: 162, ventirad: false, lien: "",
                   pourquoi: "Le processeur de référence pour le jeu grâce à son cache 3D V-Cache." },

    /* ---------- Cartes mères ---------- */
    "b550m-vdh": { type: "cm", nom: "MSI B550M PRO-VDH WIFI", socket: "AM4", ddr: "DDR4", format: "mATX", lien: "",
                   pourquoi: "Format micro-ATX (indispensable pour le Montech Air 100 Lite), Wi-Fi intégré, 2 ports M.2." },
    "b550m-ds3h": { type: "cm", nom: "Gigabyte B550M DS3H AC R2", socket: "AM4", ddr: "DDR4", format: "mATX", lien: "https://link.amazon/B0id2maR9",
                   pourquoi: "Micro-ATX (parfaite pour le Montech Air 100 Lite), Wi-Fi intégré et 2 ports M.2 : la base idéale d'un Ryzen 5 5600." },
    "b550-gx":   { type: "cm", nom: "Gigabyte B550 GAMING X V2", socket: "AM4", ddr: "DDR4", format: "ATX", lien: "",
                   pourquoi: "Carte ATX fiable pour Ryzen 5000, bon étage d'alimentation, 2 ports M.2." },
    "b650-gp":   { type: "cm", nom: "MSI B650 GAMING PLUS WIFI", socket: "AM5", ddr: "DDR5", format: "ATX", lien: "",
                   pourquoi: "Carte AM5 abordable avec Wi-Fi, compatible Ryzen 7000 et 9000." },
    "b850-gp":   { type: "cm", nom: "MSI B850 GAMING PLUS WIFI", socket: "AM5", ddr: "DDR5", format: "ATX", lien: "",
                   pourquoi: "Chipset récent B850 : Wi-Fi 7, PCIe 5.0 pour le SSD, prête pour les futurs Ryzen." },
    "b850-tom":  { type: "cm", nom: "MSI MAG B850 TOMAHAWK WIFI", socket: "AM5", ddr: "DDR5", format: "ATX", lien: "",
                   pourquoi: "Étage d'alimentation robuste et bien refroidi, à la hauteur d'un 9800X3D." },

    /* ---------- Mémoire ---------- */
    "ddr4-16":   { type: "ram", nom: "16 Go DDR4-3200 (2 × 8 Go) — ex. Corsair Vengeance LPX", ddr: "DDR4", go: 16, barrettes: 2, lien: "",
                   pourquoi: "2 barrettes pour le double canal. 16 Go suffisent pour la plupart des jeux en 1080p." },
    "ddr4-32":   { type: "ram", nom: "32 Go DDR4-3200 (2 × 16 Go) — ex. Corsair Vengeance LPX", ddr: "DDR4", go: 32, barrettes: 2, lien: "",
                   pourquoi: "Plus confortable pour les gros jeux récents et le multitâche (Discord, navigateur…)." },
    "ddr5-16":   { type: "ram", nom: "16 Go DDR5-6000 CL30 (2 × 8 Go) — ex. Kingston FURY Beast", ddr: "DDR5", go: 16, barrettes: 2, lien: "",
                   pourquoi: "La vitesse idéale pour les Ryzen AM5 (6000 MHz)." },
    "ddr5-16-viper": { type: "ram", nom: "16 Go DDR5-5600 CL40 (2 × 8 Go) — Patriot Viper Venom", ddr: "DDR5", go: 16, barrettes: 2, lien: "https://link.amazon/B08kjo04g",
                   pourquoi: "Kit DDR5 abordable en 2 barrettes (double canal) : le bon choix pour démarrer sur AM5 sans exploser le budget." },
    "ddr5-32":   { type: "ram", nom: "32 Go DDR5-6000 CL30 (2 × 16 Go) — ex. Kingston FURY Beast", ddr: "DDR5", go: 32, barrettes: 2, lien: "",
                   pourquoi: "La quantité et la vitesse idéales pour un PC de jeu AM5." },

    /* ---------- Cartes graphiques ---------- */
    "rx7600":    { type: "gpu", nom: "AMD Radeon RX 7600 8 Go", marque: "AMD", w: 165, fab: 550, longueur: 270, lien: "",
                   pourquoi: "Très bonne carte pour le 1080p en réglages moyens à élevés." },
    "rtx5050":   { type: "gpu", nom: "NVIDIA GeForce RTX 5050 8 Go", marque: "NVIDIA", w: 130, fab: 550, longueur: 250, lien: "",
                   pourquoi: "L'alternative NVIDIA : DLSS 4 et faible consommation." },
    "rx9060xt8": { type: "gpu", nom: "AMD Radeon RX 9060 XT 8 Go", marque: "AMD", w: 150, fab: 450, longueur: 280, lien: "",
                   pourquoi: "Architecture RDNA 4 récente, FSR 4 : excellente en 1080p réglages élevés." },
    "rtx5060":   { type: "gpu", nom: "NVIDIA GeForce RTX 5060 8 Go — ex. Gigabyte WINDFORCE MAX OC", marque: "NVIDIA", w: 145, fab: 550, longueur: 250, lien: "https://link.amazon/B043xqeQd",
                   pourquoi: "L'alternative NVIDIA : DLSS 4 et génération d'images." },
    "rx9070":    { type: "gpu", nom: "AMD Radeon RX 9070 16 Go", marque: "AMD", w: 220, fab: 650, longueur: 330, lien: "",
                   pourquoi: "16 Go de mémoire vidéo : parfaite pour le 1440p, sobre en consommation." },
    "rtx5070":   { type: "gpu", nom: "NVIDIA GeForce RTX 5070 12 Go", marque: "NVIDIA", w: 250, fab: 650, longueur: 330, lien: "",
                   pourquoi: "Si vous tenez aux fonctions NVIDIA (DLSS 4, ray tracing, streaming NVENC)." },
    "rx9070xt":  { type: "gpu", nom: "AMD Radeon RX 9070 XT 16 Go", marque: "AMD", w: 304, fab: 750, longueur: 340, lien: "",
                   pourquoi: "La plus rapide des Radeon actuelles : 1440p très élevé et 4K." },
    "rtx5070ti": { type: "gpu", nom: "NVIDIA GeForce RTX 5070 Ti 16 Go", marque: "NVIDIA", w: 300, fab: 750, longueur: 340, lien: "",
                   pourquoi: "L'alternative NVIDIA pour la 4K avec DLSS 4." },
    "rtx5080":   { type: "gpu", nom: "NVIDIA GeForce RTX 5080 16 Go", marque: "NVIDIA", w: 360, fab: 850, longueur: 350, lien: "",
                   pourquoi: "Pour viser la 4K sans compromis (beaucoup plus chère)." },

    /* ---------- Stockage ---------- */
    "ssd-1to":   { type: "ssd", nom: "SSD NVMe 1 To — ex. Crucial P3 Plus", lien: "",
                   pourquoi: "NVMe PCIe 4.0 : Windows et les jeux se lancent en quelques secondes." },
    "ssd-2to":   { type: "ssd", nom: "SSD NVMe 2 To — ex. Samsung 990 EVO Plus", lien: "",
                   pourquoi: "2 To, car les jeux récents dépassent souvent 100 Go chacun." },
    "ssd-2to-p": { type: "ssd", nom: "SSD NVMe 2 To — ex. WD_BLACK SN850X", lien: "",
                   pourquoi: "Un SSD haut de gamme, rapide et endurant." },

    /* ---------- Alimentations ---------- */
    "alim-550":  { type: "alim", nom: "Alimentation 550 W 80 PLUS Bronze — ex. Corsair CX550", w: 550, lien: "",
                   pourquoi: "Une alimentation de marque : c'est elle qui protège tous les autres composants." },
    "alim-650":  { type: "alim", nom: "Alimentation 650 W 80 PLUS Gold — ex. Corsair RM650e", w: 650, lien: "",
                   pourquoi: "Certifiée Gold (meilleur rendement), modulaire, avec de la marge pour une future carte graphique." },
    "alim-650-seasonic": { type: "alim", nom: "Seasonic CORE BC-650 — 650 W 80 PLUS Bronze, ATX 3.1", w: 650, lien: "https://link.amazon/B03KSdJwX",
                   pourquoi: "Seasonic, l'un des fabricants d'alimentations les plus réputés : norme ATX 3.1 récente et 650 W, de quoi garder de la marge." },
    "alim-750":  { type: "alim", nom: "Alimentation 750 W 80 PLUS Gold — ex. Corsair RM750e", w: 750, lien: "",
                   pourquoi: "Gold, modulaire, avec connecteur 12V-2x6 pour les cartes graphiques récentes." },
    "alim-750-nzxt": { type: "alim", nom: "NZXT C750 Bronze — 750 W, ATX 3.1, non modulaire", w: 750, lien: "https://link.amazon/B02Pehwvv",
                   pourquoi: "750 W à la norme ATX 3.1 récente : de quoi alimenter une RX 9070 ou une RTX 5070 avec de la marge. Non modulaire : prévoir un peu de rangement des câbles." },
    "alim-850":  { type: "alim", nom: "Alimentation 850 W 80 PLUS Gold — ex. Corsair RM850e", w: 850, lien: "",
                   pourquoi: "Assez de puissance même pour une RTX 5080, avec connecteur 12V-2x6." },

    /* ---------- Refroidissement ---------- */
    "ventirad-origine": { type: "refroid", nom: "Ventirad d'origine (livré avec le processeur)", type2: "origine", ventilos: 0, lien: "",
                   pourquoi: "Suffisant pour un Ryzen 5 5600 en usage normal." },
    "ventirad-tour": { type: "refroid", nom: "Ventirad tour — Thermalright Assassin X 120 Refined SE", type2: "tour", hauteur: 148, ventilos: 1, lien: "",
                   pourquoi: "Plus silencieux et plus efficace que le ventirad d'origine, pour un petit prix." },
    "aio-240-v3": { type: "refroid", nom: "Watercooling AIO 240 mm — Thermalright Aqua Elite 240 V3", type2: "aio", radiateur: 240, ventilos: 2, lien: "",
                   pourquoi: "Excellent rapport qualité-prix, largement suffisant pour un Ryzen 5 9600X." },
    "aio-240-fw": { type: "refroid", nom: "Watercooling AIO 240 mm — Thermalright Frozen Warframe 240 ARGB", type2: "aio", radiateur: 240, ventilos: 2, lien: "",
                   pourquoi: "Très efficace et silencieux : un 9800X3D chauffe peu, un 240 mm suffit largement." },

    "aio-240-sama": { type: "refroid", nom: "Watercooling AIO 240 mm — SAMA L50 ARGB (miroir infini)", type2: "aio", radiateur: 240, ventilos: 2, lien: "https://link.amazon/B0dtHdwOP",
                   pourquoi: "AIO 240 mm abordable avec un effet miroir infini ARGB sur la pompe : largement suffisant pour un Ryzen 5 9600X." },

    "aio-360-sama": { type: "refroid", nom: "Watercooling AIO 360 mm — SAMA L50 ARGB blanc (miroir infini)", type2: "aio", radiateur: 360, ventilos: 3, lien: "https://link.amazon/B0icmso1j",
                   pourquoi: "Radiateur 360 mm pour plus de marge et de silence. En blanc, il s'accorde parfaitement avec le NZXT H7 Flow blanc." },

    "aio-240-sudokoo": { type: "refroid", nom: "Watercooling AIO 240 mm — Sudokoo ENERGLO 240 blanc (écran de température)", type2: "aio", radiateur: 240, ventilos: 2, lien: "https://link.amazon/B00I9fHfn",
                   pourquoi: "AIO 240 mm blanc avec un petit écran qui affiche la température du processeur directement sur la pompe." },

    /* ---------- Boîtiers ---------- */
    "air100lite": { type: "boitier", nom: "Montech AIR 100 Lite (micro-ATX)", formats: ["mATX"], gpuMax: 330, ventiradMax: 161, radiateurs: [240, 280], ventilos: 2, lien: "",
                   pourquoi: "Compact, façade en grille bien ventilée, 2 ventilateurs inclus." },
    "nox-zeta":  { type: "boitier", nom: "NOX Infinity Zeta ARGB (micro-ATX)", formats: ["mATX"], gpuMax: 310, ventiradMax: 160, radiateurs: [240, 280], ventilos: 1, lien: "https://link.amazon/B08hUiawA",
                   pourquoi: "Mini-tour compacte avec vitre et ventilateur ARGB. Un seul ventilateur inclus : en ajouter 2 en façade (environ 10 €) pour bien refroidir." },
    "cc560":     { type: "boitier", nom: "DeepCool CC560 V2 (ATX)", formats: ["mATX", "ATX"], gpuMax: 370, ventiradMax: 163, radiateurs: [240, 280, 360], ventilos: 4, lien: "",
                   pourquoi: "Plus grand, avec 4 ventilateurs inclus : idéal si vous trouvez une bonne offre." },
    "air903base":{ type: "boitier", nom: "Montech AIR 903 Base", formats: ["mATX", "ATX"], gpuMax: 400, ventiradMax: 180, radiateurs: [240, 280, 360], ventilos: 3, lien: "",
                   pourquoi: "Spacieux, 3 ventilateurs de 140 mm inclus, il suivra vos futures évolutions." },
    "pop2air":   { type: "boitier", nom: "Fractal Design Pop 2 Air", formats: ["mATX", "ATX"], gpuMax: 416, ventiradMax: 170, radiateurs: [240, 360], ventilos: 3, lien: "",
                   pourquoi: "Très bien ventilé (3 ventilateurs en façade), radiateur 240 mm sur le dessus." },
    "4000d":     { type: "boitier", nom: "Corsair 4000D Airflow", formats: ["mATX", "ATX"], gpuMax: 360, ventiradMax: 170, radiateurs: [240, 280, 360], ventilos: 2, lien: "",
                   pourquoi: "Une valeur sûre : sobre, bien ventilé, montage facile." },
    "h7flow":    { type: "boitier", nom: "NZXT H7 Flow (ATX, blanc)", formats: ["mATX", "ATX"], gpuMax: 400, ventiradMax: 185, radiateurs: [240, 280, 360], ventilos: 2, lien: "https://link.amazon/B03TB1a9U",
                   pourquoi: "Façade en grille pour un très bon flux d'air, place pour les plus grosses cartes graphiques (400 mm) et un montage très propre, câbles cachés." },
    "y6":        { type: "boitier", nom: "MUSETEX Y6", formats: ["mATX", "ATX"], gpuMax: 400, ventiradMax: 176, radiateurs: [240, 280, 360], ventilos: 6, lien: "",
                   pourquoi: "Très spacieux (cartes graphiques jusqu'à 400 mm), 6 ventilateurs ARGB inclus, radiateur 240 mm sur le dessus." },
    "nn8":       { type: "boitier", nom: "MUSETEX NN8", formats: ["mATX", "ATX"], gpuMax: 325, ventiradMax: 160, radiateurs: [], ventilos: 6, lien: "",
                   pourquoi: "Petit prix et 6 ventilateurs ARGB inclus. Réservé aux cartes graphiques compactes (325 mm max)." }
  },

  GAMMES: [
    { id: "entree", emoji: "🟢", nom: "Entrée de gamme", budget: "~800 €", prix: "800 €", perf: "1080p élevé ~60 fps",
      usage: "Bureautique, études, jeux légers (Fortnite, LoL, Minecraft), 1080p en réglages moyens.",
      composants: {
        cpu: ["r5-5600"], cm: ["b550m-ds3h", "b550m-vdh"], ram: ["ddr4-16"], gpu: ["rx7600", "rtx5050"],
        ssd: ["ssd-1to"], alim: ["alim-550"], refroid: ["ventirad-origine"], boitier: ["nox-zeta", "air100lite", "cc560"]
      } },
    { id: "milieu-bas", emoji: "🔵", nom: "Milieu bas", budget: "~1 100 €", prix: "1 100 €", perf: "1080p élevé ~85 fps",
      usage: "Jeu en 1080p en réglages élevés.",
      composants: {
        cpu: ["r5-5600", "r5-7500f"], cm: ["b550-gx", "b650-gp"], ram: ["ddr4-16", "ddr4-32", "ddr5-16-viper", "ddr5-32"],
        gpu: ["rx9060xt8", "rtx5060"], ssd: ["ssd-1to"], alim: ["alim-650-seasonic", "alim-650"], refroid: ["ventirad-tour"], boitier: ["air903base", "nn8"]
      } },
    { id: "milieu-haut", emoji: "🟣", nom: "Milieu haut", budget: "~1 700 €", prix: "1 700 €", perf: "1440p élevé ~100 fps",
      usage: "Jeu en 1440p, streaming.",
      composants: {
        cpu: ["r5-9600x"], cm: ["b850-gp"], ram: ["ddr5-32"], gpu: ["rx9070", "rtx5070"],
        ssd: ["ssd-2to"], alim: ["alim-750-nzxt", "alim-750"], refroid: ["aio-240-sama", "aio-240-sudokoo", "aio-240-v3"], boitier: ["pop2air", "4000d"]
      } },
    { id: "haut", emoji: "🔴", nom: "Haut de gamme", budget: "~2 800 € et plus", prix: "2 800 €", perf: "1440p ultra ~120 fps",
      usage: "Jeu en 1440p très élevé et en 4K, création vidéo.",
      composants: {
        cpu: ["r7-9800x3d"], cm: ["b850-tom"], ram: ["ddr5-32"], gpu: ["rx9070xt", "rtx5070ti", "rtx5080"],
        ssd: ["ssd-2to-p"], alim: ["alim-850"], refroid: ["aio-240-fw", "aio-360-sama", "aio-240-sama"], boitier: ["h7flow", "y6", "4000d"]
      } }
  ]
};
