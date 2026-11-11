/* =========================================================
   Nicotch — liste des BONS PLANS (liens affiliés)
   ---------------------------------------------------------
   POUR AJOUTER UN PRODUIT (Claude peut le faire pour toi) :
   1. Sur Amazon, connecté à ton compte Partenaires, ouvre la page
      du produit et copie le lien « Texte » de la barre SiteStripe
      (il ressemble à https://amzn.to/xxxxxxx).
   2. Copie le MODÈLE ci-dessous entre les crochets de PRODUITS.
      Attention aux virgules entre deux produits.

   Champs :
     titre       nom du produit (court)
     categorie   une des catégories ci-dessous : "outils", "entretien",
                 "gpu", "cpu", "cm", "ram", "stockage", "alim", "refroidissement", "boitiers",
                 "ecrans", "claviers", "souris", "audio", "manettes"
     pourquoi    une ou deux phrases : pourquoi TU le conseilles
     lien        le lien Amazon complet (doit commencer par https://)
     icone       un emoji
     date        date d'ajout "AAAA-MM-JJ" (la plus récente sert de
                 date « Sélection mise à jour le… » en haut de la page)

     marchand    (facultatif) "AliExpress"… si ce n'est pas Amazon
     affilie     (facultatif) false si le lien n'est PAS un lien affilié
                 (pas de badge « Lien affilié »)
     note        (facultatif) un conseil d'achat affiché sur la carte
     promo       (facultatif) date de FIN de la promo "AAAA-MM-JJ" :
                 le badge « 🔥 Promo » s'affiche jusqu'à cette date incluse,
                 puis disparaît tout seul. Ex. promo: "2026-11-30"

   ⚠️ Ne pas écrire de prix : Amazon interdit les prix affichés à la
   main (ils doivent avoir moins de 24 h). Le bouton renvoie au prix réel.

   MODÈLE À COPIER :
   {
     titre: "Kit de tournevis de précision",
     categorie: "outils",
     pourquoi: "Embouts cruciformes, Torx et triangle : de quoi ouvrir un PC portable, une manette ou une console.",
     lien: "https://amzn.to/XXXXXXX",
     icone: "🪛",
     date: "2026-11-10"
   }
   ========================================================= */
window.ND_BONS_PLANS = {
  /* 3 familles, chacune avec ses catégories.
     outil = (facultatif) lien vers une page du site, affiché sous le titre de la catégorie */
  FAMILLES: [
    { id: "reparation", nom: "Réparation", icone: "🔧", categories: [
      { id: "outils", nom: "Outils du réparateur" },
      { id: "entretien", nom: "Pâte thermique et nettoyage",
        outil: { texte: "PC ou console qui chauffe ? Suivez la fiche dépoussiérage", lien: "fiches.html?fiche=temp-depoussierage" } }
    ]},
    { id: "composants", nom: "Composants", icone: "🖥️", categories: [
      { id: "gpu", nom: "Cartes graphiques",
        outil: { texte: "Votre alimentation va-t-elle suivre ? Vérifiez avec le calculateur", lien: "alimentation.html" } },
      { id: "cpu", nom: "Processeurs" },
      { id: "cm", nom: "Cartes mères" },
      { id: "ram", nom: "Mémoire RAM" },
      { id: "stockage", nom: "Stockage (SSD et disques durs)" },
      { id: "alim", nom: "Alimentations",
        outil: { texte: "Pas sûr de la puissance ? Utilisez le calculateur d'alimentation", lien: "alimentation.html" } },
      { id: "refroidissement", nom: "Refroidissement" },
      { id: "boitiers", nom: "Boîtiers" }
    ]},
    { id: "peripheriques", nom: "Périphériques et jeu", icone: "🎮", categories: [
      { id: "ecrans", nom: "Écrans" },
      { id: "claviers", nom: "Claviers" },
      { id: "souris", nom: "Souris" },
      { id: "audio", nom: "Casques et audio" },
      { id: "manettes", nom: "Manettes et accessoires console" }
    ]}
  ],
  PRODUITS: [
    {
      titre: "D.RECT — bombe d'air sec 400 ml",
      categorie: "entretien",
      pourquoi: "La solution pas chère pour un dépoussiérage de temps en temps : clavier, ventilateurs, ports. Astuce : tenez la bombe bien droite et soufflez par petites pressions, sinon elle projette du gaz liquide glacé.",
      lien: "https://link.amazon/B00GKg3V8",
      icone: "💨",
      date: "2026-11-10"
    },
    {
      titre: "Souffleur électrique à air comprimé (100 000 tr/min)",
      categorie: "entretien",
      pourquoi: "Pour dépoussiérer PC et consoles sans racheter des bombes d'air sec : rechargeable et beaucoup plus puissant. Astuce de réparateur : bloquez les ventilateurs avec un doigt pendant le soufflage, sinon ils tournent trop vite et s'abîment.",
      lien: "https://link.amazon/B04InSo4V",
      icone: "💨",
      date: "2026-11-10"
    },
    {
      titre: "ARCTIC MX-7 (4 g) — pâte thermique",
      categorie: "entretien",
      pourquoi: "La pâte thermique sèche avec les années : PC qui chauffe, ventilateur qui hurle, console qui s'éteint. La changer fait souvent gagner 10 à 20 °C. Non conductrice, donc sans risque de court-circuit, et 4 g suffisent pour plusieurs applications.",
      lien: "https://link.amazon/B09NQbdKf",
      icone: "💉",
      date: "2026-11-10"
    },
    {
      titre: "STREBITO — kit de tournevis de précision électronique (PC, consoles)",
      categorie: "outils",
      pourquoi: "Le kit complet pour aller plus loin : un grand choix d'embouts et des outils d'ouverture pour démonter PC portables, consoles et manettes sans abîmer les plastiques.",
      lien: "https://link.amazon/B0h253edX",
      icone: "🧰",
      date: "2026-11-10"
    },
    {
      titre: "JOREST — kit de 40 tournevis de précision",
      categorie: "outils",
      pourquoi: "L'outil n°1 du réparateur : cruciformes, Torx, triangle et Pentalobe pour ouvrir PC portables, manettes, consoles et smartphones. C'est celui à avoir avant toute réparation.",
      lien: "https://link.amazon/B0iQykIQS",
      icone: "🪛",
      date: "2026-11-10"
    },
    {
      titre: "HyperX Cloud III — casque gaming filaire (PC, PS5, Xbox Series)",
      categorie: "audio",
      pourquoi: "Un casque réputé pour son confort sur de longues sessions, avec un micro clair et détachable. Il fonctionne sur PC et sur consoles : un seul casque pour tout.",
      lien: "https://link.amazon/B0e9CfKKz",
      icone: "🎧",
      date: "2026-11-10"
    },
    {
      titre: "Royal Kludge C68FR HE — clavier à switchs magnétiques, AZERTY",
      categorie: "claviers",
      pourquoi: "Switchs magnétiques à effet Hall : on règle la profondeur d'activation de chaque touche, idéal pour les jeux compétitifs. Format compact (65 %) qui garde les flèches, et surtout en AZERTY français.",
      lien: "https://link.amazon/B0aiv3lzy",
      icone: "⌨️",
      date: "2026-11-10"
    },
    {
      titre: "Geeky GK61 — clavier mécanique 60 %, hot-swap",
      categorie: "claviers",
      pourquoi: "Un clavier mécanique compact (60 %, sans pavé numérique ni flèches dédiées) qui laisse plein de place à la souris. Hot-swap : on change les switchs sans souder. Vérifiez la disposition (AZERTY ou QWERTY) avant de commander.",
      lien: "https://link.amazon/B01bQaCrp",
      icone: "⌨️",
      date: "2026-11-10"
    },
    {
      titre: "Samsung Odyssey OLED G8 (G81SF) — écran 27\" 4K OLED, 240 Hz",
      categorie: "ecrans",
      pourquoi: "Le très haut de gamme : dalle OLED aux noirs parfaits, 4K ultra fine et 240 Hz. À associer à une grosse carte graphique (RX 9070 XT, RTX 5080) avec FSR ou DLSS activé pour en profiter en jeu.",
      lien: "https://link.amazon/B0amtkM2o",
      icone: "🖥️",
      date: "2026-11-10"
    },
    {
      titre: "MSI PRO MP273Q E14 — écran 27\" WQHD (1440p), 144 Hz, IPS",
      categorie: "ecrans",
      pourquoi: "Le complément idéal des configs 1440p (Milieu haut et Haut de gamme) : 27 pouces, image bien plus fine que le Full HD, 144 Hz pour la fluidité et haut-parleurs intégrés. Aussi très confortable pour travailler.",
      lien: "https://link.amazon/B06d878IK",
      icone: "🖥️",
      date: "2026-11-10"
    },
    {
      titre: "Dell 24 SE2426H — écran 24\" Full HD, 144 Hz, IPS",
      categorie: "ecrans",
      pourquoi: "Le bon écran pour une config d'entrée ou milieu de gamme : Full HD, 144 Hz pour des jeux fluides, dalle IPS aux belles couleurs. Une marque fiable pour un prix raisonnable.",
      lien: "https://link.amazon/B077oj3Tr",
      icone: "🖥️",
      date: "2026-11-10"
    },
    {
      titre: "Ocypus Delta EH10 Pro — hub ventilateurs PWM + ARGB, 10 ports",
      categorie: "refroidissement",
      pourquoi: "Quand la carte mère n'a pas assez de prises pour les ventilateurs et l'éclairage : ce hub branche jusqu'à 10 ventilateurs (4 broches PWM) et LED ARGB (5 V, 3 broches) sur une seule prise, pilotés ensemble.",
      lien: "https://link.amazon/B06ImOeIm",
      icone: "🔌",
      date: "2026-11-10"
    },
    {
      titre: "Sudokoo ENERGLO 240 — watercooling AIO 240 mm blanc, écran LCD",
      categorie: "refroidissement",
      pourquoi: "Un watercooling 240 mm blanc avec un écran sur la pompe qui affiche la température du processeur : pratique pour surveiller son PC d'un coup d'œil.",
      lien: "https://link.amazon/B00I9fHfn",
      icone: "❄️",
      date: "2026-11-10"
    },
    {
      titre: "SAMA L50 — watercooling AIO 360 mm ARGB, miroir infini, blanc",
      categorie: "refroidissement",
      pourquoi: "La version 360 mm : 3 ventilateurs pour plus de marge et moins de bruit, idéale pour un processeur haut de gamme. En blanc, parfaite dans un boîtier blanc. Vérifiez que votre boîtier accepte un radiateur de 360 mm.",
      lien: "https://link.amazon/B0icmso1j",
      icone: "❄️",
      date: "2026-11-10"
    },
    {
      titre: "SAMA L50 — watercooling AIO 240 mm ARGB, miroir infini",
      categorie: "refroidissement",
      pourquoi: "Un watercooling tout-en-un 240 mm à petit prix, avec un effet miroir infini ARGB sur la pompe. Suffisant pour un processeur de milieu de gamme comme le Ryzen 5 9600X.",
      lien: "https://link.amazon/B0dtHdwOP",
      icone: "❄️",
      date: "2026-11-10"
    },
    {
      titre: "NZXT H7 Flow — boîtier moyen tour ATX Airflow, blanc",
      categorie: "boitiers",
      pourquoi: "Façade en grille pour un excellent flux d'air, de la place pour les cartes graphiques les plus longues et un vrai espace pour cacher les câbles : un montage propre, même pour un premier PC.",
      lien: "https://link.amazon/B03TB1a9U",
      icone: "📦",
      date: "2026-11-10"
    },
    {
      titre: "NOX Infinity Zeta ARGB — mini-tour micro-ATX / ITX",
      categorie: "boitiers",
      pourquoi: "Un boîtier compact et pas cher avec vitre et ventilateur ARGB, pour une carte mère micro-ATX. Cartes graphiques jusqu'à 310 mm. Un seul ventilateur fourni : ajoutez-en 2 en façade.",
      lien: "https://link.amazon/B08hUiawA",
      icone: "📦",
      date: "2026-11-10"
    },
    {
      titre: "NZXT C750 Bronze — 750 W, ATX 3.1, non modulaire",
      categorie: "alim",
      pourquoi: "750 W à la norme ATX 3.1 : la bonne puissance pour une RX 9070 ou une RTX 5070. Non modulaire, donc tous les câbles sont fixés : prévoir un peu de place pour les ranger derrière la carte mère.",
      lien: "https://link.amazon/B02Pehwvv",
      icone: "⚡",
      date: "2026-11-10"
    },
    {
      titre: "Seasonic CORE BC-650 — 650 W, ATX 3.1, 80 PLUS Bronze",
      categorie: "alim",
      pourquoi: "Seasonic est l'un des fabricants d'alimentations les plus réputés. 650 W, c'est la bonne puissance pour un PC gamer milieu de gamme (RTX 5060, RX 9060 XT), avec de la marge.",
      lien: "https://link.amazon/B03KSdJwX",
      icone: "⚡",
      date: "2026-11-10"
    },
    {
      titre: "PNY CS1030 500 Go — SSD M.2 NVMe PCIe Gen3",
      categorie: "stockage",
      pourquoi: "Un petit SSD NVMe à prix serré, environ 3 fois plus rapide qu'un SSD SATA : parfait pour un PC bureautique ou pour un disque dédié à Windows. Pour les jeux, visez plutôt 1 To.",
      lien: "https://link.amazon/B0h3zegeE",
      icone: "💾",
      date: "2026-11-10"
    },
    {
      titre: "Fanxiang S101Q 1 To — SSD 2,5\" SATA III",
      categorie: "stockage",
      pourquoi: "Le moyen le moins cher de redonner vie à un vieux PC ou portable : on remplace le disque dur par ce SSD, et Windows démarre en quelques secondes au lieu de plusieurs minutes.",
      lien: "https://link.amazon/B09r6PFvu",
      icone: "💾",
      date: "2026-11-10"
    },
    {
      titre: "Patriot Viper Venom DDR5 16 Go (2 × 8 Go) 5600 MHz CL40",
      categorie: "ram",
      pourquoi: "Un kit DDR5 abordable en 2 barrettes pour profiter du double canal : idéal pour démarrer sur un Ryzen AM5 sans exploser le budget.",
      lien: "https://link.amazon/B08kjo04g",
      icone: "📏",
      date: "2026-11-10"
    },
    {
      titre: "Gigabyte B550M DS3H AC R2",
      categorie: "cm",
      pourquoi: "Carte mère micro-ATX pour Ryzen 5000 avec Wi-Fi intégré et 2 ports M.2 : simple, fiable et parfaite pour un premier PC gamer.",
      lien: "https://link.amazon/B0id2maR9",
      icone: "🟩",
      date: "2026-11-10"
    },
    {
      titre: "ASUS B650E Max WiFi (AM5)",
      categorie: "cm",
      pourquoi: "Carte mère AM5 pour Ryzen 7000, 8000 et 9000, avec Wi-Fi intégré et puce B650E (PCIe 5.0 pour la carte graphique et le SSD). Une base solide pour un PC gamer milieu ou haut de gamme, qui pourra évoluer.",
      lien: "https://link.amazon/B00f2noIs",
      icone: "🟦",
      date: "2026-11-11"
    },
    {
      titre: "Gigabyte GeForce RTX 5060 WINDFORCE MAX OC 8G",
      categorie: "gpu",
      pourquoi: "Double ventilateur WINDFORCE, compacte : elle rentre dans presque tous les boîtiers. DLSS 4 et faible consommation, idéale pour jouer en 1080p.",
      lien: "https://link.amazon/B043xqeQd",
      icone: "🎮",
      date: "2026-11-10"
    },
    {
      titre: "Gigabyte GeForce RTX 5070 GAMING OC 12G",
      categorie: "gpu",
      pourquoi: "Triple ventilateur WINDFORCE, silencieuse et bien refroidie : parfaite pour jouer en 1440p avec DLSS 4. Elle mesure 32,7 cm : vérifiez la place dans le boîtier, et prévoyez une alimentation de 750 W (recommandation Gigabyte).",
      lien: "https://link.amazon/B0bbzddju",
      icone: "🎮",
      date: "2026-11-11"
    },
    {
      titre: "ASUS Prime Radeon RX 9070 XT OC 16 Go",
      categorie: "gpu",
      pourquoi: "16 Go de mémoire et de quoi jouer en 1440p ultra, voire en 4K avec FSR 4. Triple ventilateur, 31,2 cm de long, 3 prises PCIe 8 broches : prévoyez une alimentation de 750 W (recommandation ASUS).",
      lien: "https://link.amazon/B0eUGTRtj",
      icone: "🎮",
      date: "2026-11-11"
    },
    {
      titre: "NZXT H3 Flow — boîtier micro-ATX blanc",
      categorie: "boitiers",
      pourquoi: "Compact, façade en mesh pour une très bonne ventilation et un câble management soigné, typique de NZXT. Parfait pour un PC micro-ATX discret.",
      lien: "https://link.amazon/B0132bRgX",
      icone: "🗄️",
      date: "2026-11-11"
    },
    {
      titre: "MSI MAG PANO M110R — boîtier micro-ATX panoramique",
      categorie: "boitiers",
      pourquoi: "Vitre panoramique sans montant d'angle pour bien voir les composants, en noir ou blanc. Idéal pour un petit PC gamer « vitrine ».",
      lien: "https://link.amazon/B0iKEgSqI",
      icone: "🗄️",
      date: "2026-11-11"
    },
    {
      titre: "Ocypus Delta L24 ARGB V2 — watercooling AIO 240 mm",
      categorie: "refroidissement",
      pourquoi: "Un AIO 240 mm abordable avec éclairage ARGB, largement suffisant pour un Ryzen 5 ou un Ryzen 7 en jeu. Vérifiez que le boîtier accepte un radiateur de 240 mm.",
      lien: "https://link.amazon/B0eXEKrFP",
      icone: "❄️",
      date: "2026-11-11"
    },
    {
      titre: "Lenovo Legion 27Q-10 — 27 pouces QHD IPS 240 Hz",
      categorie: "ecrans",
      pourquoi: "Le combo idéal pour le jeu : 1440p net, dalle IPS aux belles couleurs et 240 Hz ultra-fluide. À associer à une carte graphique solide (RTX 5070, RX 9070).",
      lien: "https://link.amazon/B02CEEqf6",
      icone: "🖥️",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 5600 (AM4)",
      categorie: "cpu",
      pourquoi: "6 cœurs, le roi du rapport qualité-prix pour un PC gamer sur AM4 avec de la DDR4. Parfait pour une config d'entrée de gamme.",
      lien: "https://fr.aliexpress.com/item/1005012297111635.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 5600XT (AM4)",
      categorie: "cpu",
      pourquoi: "Une version un peu plus rapide du Ryzen 5 5600 : 6 cœurs pour jouer sur AM4, idéal pour remplacer un vieux processeur sans changer de carte mère.",
      lien: "https://fr.aliexpress.com/item/1005012527631728.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 7 5700X (AM4)",
      categorie: "cpu",
      pourquoi: "8 cœurs pour seulement 65 W : le meilleur choix sur AM4 pour jouer et streamer ou faire du montage en même temps.",
      lien: "https://fr.aliexpress.com/item/1005012736871363.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 7500F (AM5)",
      categorie: "cpu",
      pourquoi: "6 cœurs sur la plateforme AM5 et la DDR5, au meilleur prix. Il n'a pas de partie graphique : une carte graphique est obligatoire.",
      lien: "https://fr.aliexpress.com/item/1005012028251728.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 9600X (AM5)",
      categorie: "cpu",
      pourquoi: "6 cœurs Zen 5, l'architecture la plus récente d'AMD : rapide en jeu et peu gourmand. Une base moderne pour un PC milieu de gamme.",
      lien: "https://fr.aliexpress.com/item/1005010131425503.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 7 7800X3D (AM5)",
      categorie: "cpu",
      pourquoi: "8 cœurs avec le cache 3D V-Cache : l'un des meilleurs processeurs pour le jeu, encore très performant face aux modèles plus récents.",
      lien: "https://fr.aliexpress.com/item/1005011718202289.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 7 9800X3D (AM5)",
      categorie: "cpu",
      pourquoi: "Le processeur de jeu le plus rapide du moment : 8 cœurs Zen 5 avec 3D V-Cache. Pour un PC haut de gamme sans compromis.",
      lien: "https://fr.aliexpress.com/item/1005012304257514.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "CUSU DDR4 3200 MHz 16 Go (2 × 8 Go), 1,35 V",
      categorie: "ram",
      pourquoi: "Un kit DDR4 2 × 8 Go à petit prix pour un PC AM4 : le double canal fait gagner des fps par rapport à une seule barrette.",
      lien: "https://fr.aliexpress.com/item/1005007871648778.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🧩",
      date: "2026-11-11"
    },
    {
      titre: "Netac DDR4 3200 MHz 16 Go (2 × 8 Go)",
      categorie: "ram",
      pourquoi: "Kit DDR4 2 × 8 Go d'une marque de stockage reconnue, pour un PC AM4 ou pour redonner du souffle à un ancien PC.",
      lien: "https://fr.aliexpress.com/item/1005012072371593.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🧩",
      date: "2026-11-11"
    },
    {
      titre: "Netac SSD SATA 2,5 pouces — 512 Go / 1 To",
      categorie: "stockage",
      pourquoi: "Le moyen le plus simple de rajeunir un vieux PC ou un portable qui a encore un disque dur : il se branche à la place du disque, et Windows démarre en quelques secondes.",
      lien: "https://fr.aliexpress.com/item/1005013053675228.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "💾",
      date: "2026-11-11"
    },
    {
      titre: "Netac SSD NVMe M.2 — 512 Go / 1 To",
      categorie: "stockage",
      pourquoi: "Un SSD NVMe abordable pour un PC récent : il se visse directement sur la carte mère et il est bien plus rapide qu'un SSD SATA.",
      lien: "https://fr.aliexpress.com/item/1005013010664715.html",
      marchand: "AliExpress",
      affilie: false,
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "💾",
      date: "2026-11-11"
    }
  ]
};
