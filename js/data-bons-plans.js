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
      { id: "manettes", nom: "Manettes et accessoires console" },
      { id: "fauteuils", nom: "Fauteuils gaming" }
    ]}
  ],
  PRODUITS: [
    {
      titre: "ASUS Radeon RX 9070 GRE 12 Go",
      categorie: "gpu",
      pourquoi: "La petite sœur de la RX 9070 : 12 Go de mémoire et l'architecture RDNA 4 avec le FSR 4, pour jouer en 1440p dans de très bonnes conditions. Une alimentation de 650 W de qualité suffit.",
      lien: "https://link.amazon/B066XbUHv",
      note: "Vérifiez le modèle exact (Prime, TUF…) et sa longueur sur la fiche avant de commander.",
      icone: "🎮",
      date: "2026-11-25",
      promo: "2026-11-30"
    },
    {
      titre: "AMD Ryzen 7 9850X3D (AM5)",
      categorie: "cpu",
      pourquoi: "Le successeur du 9800X3D : 8 cœurs Zen 5 avec 3D V-Cache, et une fréquence encore plus haute. Pour un PC de jeu haut de gamme sans compromis.",
      lien: "https://link.amazon/B08NLQv2M",
      note: "Livré sans ventirad : prévoyez un bon ventirad double tour ou un watercooling 240 mm.",
      icone: "🧠",
      date: "2026-11-25",
      promo: "2026-11-30"
    },
    {
      titre: "Juhor DDR5 6000 MHz CL38 32 Go (2 × 16 Go)",
      categorie: "ram",
      pourquoi: "32 Go de DDR5 à 6000 MHz, la vitesse idéale pour les Ryzen AM5, en 2 barrettes pour profiter du double canal. Un kit très abordable pour un PC de jeu.",
      lien: "https://s.click.aliexpress.com/e/_c4p7enR7",
      marchand: "AliExpress",
      note: "Activez le profil EXPO ou XMP dans le BIOS pour obtenir les 6000 MHz.",
      icone: "🧠",
      date: "2026-11-25",
      promo: "2026-11-30"
    },
    {
      titre: "Juhor DDR5 6000 MHz CL38 16 Go (1 × 16 Go)",
      categorie: "ram",
      pourquoi: "Une barrette DDR5 6000 MHz pour compléter une première barrette identique. Seule, elle fonctionne en simple canal : pour jouer, mieux vaut 2 barrettes.",
      lien: "https://s.click.aliexpress.com/e/_c3aVmE65",
      marchand: "AliExpress",
      icone: "🧠",
      date: "2026-11-25",
      promo: "2026-11-30"
    },
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
      lien: "https://link.amazon/B04H3vM6r",
      icone: "⌨️",
      date: "2026-11-10",
      promo: "2026-11-30"
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
      lien: "https://link.amazon/B0aqVjeGg",
      icone: "💾",
      date: "2026-11-10",
      promo: "2026-11-30"
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
      lien: "https://link.amazon/B09ACfE7k",
      icone: "🗄️",
      date: "2026-11-11",
      promo: "2026-11-30"
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
      lien: "https://link.amazon/B0gSoCXaW",
      icone: "❄️",
      date: "2026-11-11",
      promo: "2026-11-30"
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
      lien: "https://s.click.aliexpress.com/e/_c2u0P0CF",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 5600XT (AM4)",
      categorie: "cpu",
      pourquoi: "Une version un peu plus rapide du Ryzen 5 5600 : 6 cœurs pour jouer sur AM4, idéal pour remplacer un vieux processeur sans changer de carte mère.",
      lien: "https://s.click.aliexpress.com/e/_c3io2Hlt",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 7 5700X (AM4)",
      categorie: "cpu",
      pourquoi: "8 cœurs pour seulement 65 W : le meilleur choix sur AM4 pour jouer et streamer ou faire du montage en même temps.",
      lien: "https://s.click.aliexpress.com/e/_c31GvvFN",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 7500F (AM5)",
      categorie: "cpu",
      pourquoi: "6 cœurs sur la plateforme AM5 et la DDR5, au meilleur prix. Il n'a pas de partie graphique : une carte graphique est obligatoire.",
      lien: "https://s.click.aliexpress.com/e/_c37RwN0n",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "AMD Ryzen 5 9600X (AM5)",
      categorie: "cpu",
      pourquoi: "6 cœurs Zen 5, l'architecture la plus récente d'AMD : rapide en jeu et peu gourmand. Une base moderne pour un PC milieu de gamme.",
      lien: "https://link.amazon/B05gJK1s4",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11",
      promo: "2026-11-30"
    },
    {
      titre: "AMD Ryzen 7 7800X3D (AM5)",
      categorie: "cpu",
      pourquoi: "8 cœurs avec le cache 3D V-Cache : l'un des meilleurs processeurs pour le jeu, encore très performant face aux modèles plus récents.",
      lien: "https://link.amazon/B0gUZZA81",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11",
      promo: "2026-11-30"
    },
    {
      titre: "AMD Ryzen 7 9800X3D (AM5)",
      categorie: "cpu",
      pourquoi: "Le processeur de jeu le plus rapide du moment : 8 cœurs Zen 5 avec 3D V-Cache. Pour un PC haut de gamme sans compromis.",
      lien: "https://s.click.aliexpress.com/e/_c3BCvyt9",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress, souvent en version « tray » (sans boîte ni ventirad) : choisissez un vendeur bien noté et vérifiez la mention « neuf ».",
      icone: "🧠",
      date: "2026-11-11"
    },
    {
      titre: "CUSU DDR4 3200 MHz 16 Go (2 × 8 Go), 1,35 V",
      categorie: "ram",
      pourquoi: "Un kit DDR4 2 × 8 Go à petit prix pour un PC AM4 : le double canal fait gagner des fps par rapport à une seule barrette.",
      lien: "https://s.click.aliexpress.com/e/_c4r5AKEn",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🧩",
      date: "2026-11-11"
    },
    {
      titre: "Netac DDR4 3200 MHz CL16 16 Go (2 × 8 Go), noir ou blanc",
      categorie: "ram",
      pourquoi: "Kit DDR4 2 × 8 Go d'une marque de stockage reconnue, pour un PC AM4 ou pour redonner du souffle à un ancien PC.",
      lien: "https://link.amazon/B0dwENgko",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🧩",
      date: "2026-11-11",
      promo: "2026-11-30"
    },
    {
      titre: "Rapoo VT7 Max — souris gaming sans fil",
      categorie: "souris",
      pourquoi: "Une souris gaming sans fil très légère, avec un capteur haut de gamme et plusieurs modes de connexion (sans fil 2,4 GHz, Bluetooth, câble). Un excellent rapport qualité-prix pour jouer.",
      lien: "https://link.amazon/B08ELh8ws",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🖱️",
      date: "2026-11-12",
      promo: "2026-11-30"
    },
    {
      titre: "Rapoo VT3 Max — souris gaming sans fil",
      categorie: "souris",
      pourquoi: "La petite sœur de la VT7 Max : sans fil, légère et précise, à un prix encore plus doux. Idéale pour débuter dans le jeu PC.",
      lien: "https://s.click.aliexpress.com/e/_c4tCUaAr",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🖱️",
      date: "2026-11-12"
    },
    {
      titre: "inphic A9 — souris sans fil rechargeable",
      categorie: "souris",
      pourquoi: "Une souris sans fil rechargeable et silencieuse, à tout petit prix. Parfaite pour le bureau, un portable ou un PC de dépannage.",
      lien: "https://link.amazon/B0eRIoZtJ",
      icone: "🖱️",
      date: "2026-11-12"
    },
    {
      titre: "EasySMX X05 Pro — manette sans fil",
      categorie: "manettes",
      pourquoi: "Une manette sans fil qui fonctionne sur PC, Switch et téléphone, avec vibrations et bonne prise en main. Parfaite pour les jeux Nicotch Rétro Games 😉",
      lien: "https://link.amazon/B0aOciWgA",
      icone: "🎮",
      date: "2026-11-12"
    },
    {
      titre: "EasySMX D10 — manette PC",
      categorie: "manettes",
      pourquoi: "Une manette PC à petit prix, reconnue directement par Windows (il suffit de la brancher). Idéale pour jouer sur PC ou dans le navigateur.",
      lien: "https://link.amazon/A03yIbtTq",
      icone: "🎮",
      date: "2026-11-12"
    },
    {
      titre: "HyperX Cloud III S Wireless — casque gaming sans fil",
      categorie: "audio",
      pourquoi: "La version sans fil du Cloud III : le même confort et un bon son, avec une grosse autonomie et le Bluetooth. Pour jouer sans fil qui traîne.",
      lien: "https://link.amazon/B0d5cGYkn",
      icone: "🎧",
      date: "2026-11-12"
    },
    {
      titre: "SteelSeries Apex 3 — clavier gaming",
      categorie: "claviers",
      pourquoi: "Un clavier gaming silencieux, rétroéclairé et résistant aux éclaboussures, avec repose-poignets. Solide et fiable, idéal pour un premier PC gamer.",
      lien: "https://link.amazon/B034oUCTQ",
      icone: "⌨️",
      date: "2026-11-12"
    },
    {
      titre: "The G-Lab Keyz Hydrogen — clavier gaming",
      categorie: "claviers",
      pourquoi: "Un clavier gaming rétroéclairé à tout petit prix, parfait pour débuter ou équiper un PC de dépannage.",
      lien: "https://link.amazon/B0gGnrHBy",
      icone: "⌨️",
      date: "2026-11-12"
    },
    {
      titre: "ASUS Dual Radeon RX 7600 EVO OC 8 Go",
      categorie: "gpu",
      pourquoi: "Pour jouer en 1080p à petit prix. Compacte (22,9 cm), elle rentre dans presque tous les boîtiers ; ASUS conseille une alimentation de 550 W.",
      lien: "https://link.amazon/B07qMbb0p",
      icone: "🎮",
      date: "2026-11-12"
    },
    {
      titre: "Gigabyte Radeon RX 9060 XT GAMING OC 8 Go",
      categorie: "gpu",
      pourquoi: "Très bon choix pour le 1080p élevé avec le FSR 4, et sobre : une seule prise 8 broches et 450 W conseillés par Gigabyte. Elle mesure 28,1 cm : vérifiez la place dans le boîtier.",
      lien: "https://link.amazon/B0dEeEfxO",
      icone: "🎮",
      date: "2026-11-12"
    },
    {
      titre: "SOYO B550M — carte mère AM4 micro-ATX",
      categorie: "cm",
      pourquoi: "Une carte mère B550 micro-ATX à prix cassé pour les Ryzen 5000 et la DDR4. Une marque moins connue, mais suffisante pour un PC gamer d'entrée de gamme.",
      lien: "https://s.click.aliexpress.com/e/_c4OxXzzp",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : vérifiez dans la fiche que le BIOS est à jour pour votre processeur (Ryzen 5000), et choisissez un vendeur bien noté.",
      icone: "🟩",
      date: "2026-11-12"
    },
    {
      titre: "AMD Ryzen 5 9600X (AM5) — version boîte",
      categorie: "cpu",
      pourquoi: "Le même Ryzen 5 9600X, en version boîte vendue en France : la garantie constructeur et les retours sont plus simples qu'en import. Le bon choix si vous préférez la tranquillité.",
      lien: "https://link.amazon/B03K0zeiX",
      icone: "🧠",
      date: "2026-11-12",
      promo: "2026-11-30"
    },
    {
      titre: "Juhor DDR4 3200 MHz 16 Go (2 × 8 Go), blanc",
      categorie: "ram",
      pourquoi: "Un kit DDR4 2 × 8 Go blanc à petit prix, parfait pour un PC AM4 au look tout blanc.",
      lien: "https://s.click.aliexpress.com/e/_c36BFdH1",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "🧩",
      date: "2026-11-12"
    },
    {
      titre: "Patriot Viper Venom DDR5 6000 MHz CL30 16 Go (1 × 16 Go)",
      categorie: "ram",
      pourquoi: "De la DDR5 rapide (6000 MHz CL30), la vitesse idéale pour les Ryzen 7000 et 9000.",
      lien: "https://link.amazon/B06QVP4sw",
      note: "Une seule barrette : pour profiter du double canal (plus de fps), prenez-en deux identiques.",
      icone: "🧩",
      date: "2026-11-12"
    },
    {
      titre: "Patriot Viper Venom RGB DDR5 6000 MHz CL30 16 Go (1 × 16 Go)",
      categorie: "ram",
      pourquoi: "La même DDR5 rapide (6000 MHz CL30), avec un éclairage RGB pour un PC qui brille.",
      lien: "https://link.amazon/B0hEfMPLS",
      note: "Une seule barrette : pour profiter du double canal (plus de fps), prenez-en deux identiques.",
      icone: "🧩",
      date: "2026-11-12"
    },
    {
      titre: "Lexar DDR5 6000 MHz CL38 16 Go (1 × 16 Go)",
      categorie: "ram",
      pourquoi: "Une DDR5 6000 MHz à prix doux pour un PC AM5. Un peu moins réactive que la CL30, mais très bon rapport qualité-prix.",
      lien: "https://link.amazon/B01Fi6GvU",
      note: "Une seule barrette : pour profiter du double canal (plus de fps), prenez-en deux identiques.",
      icone: "🧩",
      date: "2026-11-12"
    },
    {
      titre: "Netac SSD SATA 2,5 pouces — 512 Go",
      categorie: "stockage",
      pourquoi: "Le moyen le plus simple de rajeunir un vieux PC ou un portable qui a encore un disque dur : il se branche à la place du disque, et Windows démarre en quelques secondes.",
      lien: "https://s.click.aliexpress.com/e/_c3zKX3S3",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "💾",
      date: "2026-11-12"
    },
    {
      titre: "Netac SSD SATA 2,5 pouces — 1 To",
      categorie: "stockage",
      pourquoi: "La même chose avec plus de place : 1 To pour Windows, les logiciels et quelques jeux.",
      lien: "https://s.click.aliexpress.com/e/_c2wwtGj1",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "💾",
      date: "2026-11-12"
    },
    {
      titre: "Netac SSD NVMe M.2 — 500 Go",
      categorie: "stockage",
      pourquoi: "Un SSD NVMe abordable pour un PC récent : il se visse directement sur la carte mère et il est bien plus rapide qu'un SSD SATA.",
      lien: "https://s.click.aliexpress.com/e/_c30o4uwr",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "💾",
      date: "2026-11-12"
    },
    {
      titre: "Netac SSD NVMe M.2 — 1 To",
      categorie: "stockage",
      pourquoi: "Le bon compromis pour un PC gamer : 1 To en NVMe pour Windows et vos jeux.",
      lien: "https://s.click.aliexpress.com/e/_c4MbDxND",
      marchand: "AliExpress",
      note: "Vendu sur AliExpress : délais de livraison plus longs. Choisissez un vendeur bien noté, et l'entrepôt France ou Europe quand c'est proposé.",
      icone: "💾",
      date: "2026-11-12"
    },
    {
      titre: "Logitech G502 HERO — souris gaming filaire",
      categorie: "souris",
      pourquoi: "Un grand classique des souris gaming : capteur HERO très précis, 11 boutons programmables et poids réglable. Solide et confortable pour les grandes mains.",
      lien: "https://link.amazon/B0eWWKKFu",
      icone: "🖱️",
      date: "2026-11-12",
      promo: "2026-11-30"
    },
    {
      titre: "Troisième main de soudure — loupe et 4 bras flexibles",
      categorie: "outils",
      pourquoi: "Indispensable pour souder : les 4 bras et leurs pinces tiennent la carte et les fils, la loupe aide pour les petits composants. Parfait pour réparer une prise, un câble ou une manette.",
      lien: "https://link.amazon/B044tkLtq",
      icone: "🔧",
      date: "2026-11-12"
    },
    {
      titre: "Cooler Master Elite Gold 850 — alimentation 850 W, 80 PLUS Gold",
      categorie: "alim",
      pourquoi: "850 W certifiés Gold, de quoi alimenter sereinement un PC haut de gamme (RTX 5070 Ti, RX 9070 XT) avec de la marge. Câbles modulaires pour un montage plus propre.",
      lien: "https://link.amazon/B0izG685R",
      icone: "⚡",
      date: "2026-11-12"
    },
    {
      titre: "8BitDo Ultimate 2C Wireless — manette sans fil",
      categorie: "manettes",
      pourquoi: "Une manette sans fil très appréciée sur PC, avec des joysticks à effet Hall qui ne dérivent pas avec le temps. Parfaite pour les jeux rétro de Nicotch 🕹️",
      lien: "https://link.amazon/B0bsVJ5PE",
      icone: "🎮",
      date: "2026-11-12"
    },
    {
      titre: "Intel Core Ultra 7 270K Plus — 24 cœurs, jusqu'à 5,5 GHz (LGA 1851)",
      categorie: "cpu",
      pourquoi: "Le nouveau processeur Intel pour le jeu et le multitâche : 24 cœurs (8 performants + 16 efficaces), jusqu'à 5,5 GHz. Débloqué pour l'overclocking, il demande une carte mère LGA 1851 (Z890 ou B860) et un bon refroidissement (pas de ventirad fourni).",
      lien: "https://link.amazon/B0635NJFJ",
      icone: "🧠",
      date: "2026-11-15"
    },
    {
      titre: "Thermaltake Toughpower GT 750 W — 80 PLUS Gold, ATX 3.1, modulaire",
      categorie: "alim",
      pourquoi: "750 W certifiés Gold à la norme ATX 3.1, avec le câble 12V-2x6 pour les cartes graphiques récentes. Entièrement modulaire : on ne branche que les câbles utiles, pour un montage propre. Idéal pour une RTX 5070 ou une RX 9070.",
      lien: "https://link.amazon/B0dkt1MpN",
      icone: "⚡",
      date: "2026-11-15"
    },
    {
      titre: "NZXT H5 Flow — boîtier moyen tour ATX compact, noir",
      categorie: "boitiers",
      pourquoi: "Le petit frère du H7 Flow : plus compact, mais avec une façade en grille pour un très bon flux d'air et un rangement des câbles soigné. Un excellent choix pour un premier montage ATX.",
      lien: "https://link.amazon/B0fgV2dgf",
      icone: "📦",
      date: "2026-11-15"
    },
    {
      titre: "NZXT H7 Flow — boîtier moyen tour ATX Airflow, noir",
      categorie: "boitiers",
      pourquoi: "La version noire du H7 Flow : beaucoup de place pour les grandes cartes graphiques et les radiateurs de watercooling, un flux d'air excellent et un vrai espace pour cacher les câbles.",
      lien: "https://link.amazon/B0cBELwIB",
      icone: "📦",
      date: "2026-11-15"
    },
    {
      titre: "AOC 24G4ZRE — 24 pouces Full HD Fast IPS 260 Hz",
      categorie: "ecrans",
      pourquoi: "Un écran rapide pour les jeux compétitifs : 260 Hz, 1 ms et dalle Fast IPS, compatible FreeSync et G-Sync. En 1080p, même une carte graphique de milieu de gamme (RTX 5060, RX 9060 XT) peut viser des FPS très élevés.",
      lien: "https://link.amazon/B0fkywAZi",
      icone: "🖥️",
      date: "2026-11-15"
    },
    {
      titre: "Acer Nitro 27 pouces — QHD IPS 240 Hz, 1 ms",
      categorie: "ecrans",
      pourquoi: "Le 1440p à 240 Hz pour un jeu net et très fluide, avec une dalle IPS aux belles couleurs, compatible FreeSync et G-Sync. À associer à une carte graphique solide (RTX 5070, RX 9070).",
      lien: "https://link.amazon/B0ezrEEzc",
      icone: "🖥️",
      date: "2026-11-15"
    },
    {
      titre: "MSI MAG 272QP — 27 pouces QD-OLED QHD 240 Hz",
      categorie: "ecrans",
      pourquoi: "Une dalle QD-OLED aux noirs parfaits et aux couleurs éclatantes, en 1440p à 240 Hz avec un temps de réponse de 0,03 ms. Le grand saut visuel pour un PC gamer, à un prix plus accessible que les OLED 4K.",
      lien: "https://link.amazon/B04IgV7j1",
      icone: "🖥️",
      date: "2026-11-15"
    },
    {
      titre: "ASUS Prime B550M-A WiFi II — carte mère AM4 micro-ATX",
      categorie: "cm",
      pourquoi: "Une carte mère AM4 fiable et abordable pour un Ryzen 5000 (5600, 5700X), avec le Wi-Fi intégré et la RAM DDR4. Format micro-ATX : elle rentre dans les petits boîtiers.",
      lien: "https://link.amazon/B01LgPu1Q",
      icone: "🧩",
      date: "2026-11-16"
    },
    {
      titre: "ASUS ROG Strix B550-A Gaming — carte mère AM4 ATX",
      categorie: "cm",
      pourquoi: "Une carte AM4 haut de gamme au format ATX : étage d'alimentation solide, bon refroidissement et un look blanc et argent. Idéale pour un Ryzen 7 5700X ou un 5800X3D en DDR4.",
      lien: "https://link.amazon/B01u590gp",
      icone: "🧩",
      date: "2026-11-16",
      promo: "2026-11-30"
    },
    {
      titre: "Gigabyte B650M D3HP WiFi — carte mère AM5 micro-ATX",
      categorie: "cm",
      pourquoi: "L'entrée sur la plateforme AM5 (Ryzen 7000 et 9000) à petit prix : DDR5, Wi-Fi intégré, format micro-ATX. Parfaite pour un Ryzen 5 7500F ou 9600X.",
      lien: "https://link.amazon/B0hWObA0t",
      icone: "🧩",
      date: "2026-11-16"
    },
    {
      titre: "ASUS TUF Gaming B850-E WiFi — carte mère AM5 ATX",
      categorie: "cm",
      pourquoi: "Chipset B850 récent, construction robuste typique de la gamme TUF et Wi-Fi intégré. Un excellent choix pour un Ryzen 5 9600X ou un Ryzen 7 9800X3D.",
      lien: "https://link.amazon/B0fJ2Kf8D",
      icone: "🧩",
      date: "2026-11-16"
    },
    {
      titre: "ASUS Prime X870-P — carte mère AM5 ATX",
      categorie: "cm",
      pourquoi: "Le chipset X870 : PCIe 5.0 pour la carte graphique et le SSD, et USB4 ultra-rapide. Une base très complète pour un PC haut de gamme sous Ryzen 9000.",
      lien: "https://link.amazon/B07FK9Rr7",
      icone: "🧩",
      date: "2026-11-16"
    },
    {
      titre: "ASUS TUF Gaming B850M — carte mère AM5 micro-ATX, blanche",
      categorie: "cm",
      pourquoi: "Une carte AM5 compacte et entièrement blanche, pour un montage tout blanc réussi (boîtier NZXT H3 Flow ou MSI PANO). Chipset B850 récent et DDR5.",
      lien: "https://link.amazon/B04aaTIYS",
      icone: "🧩",
      date: "2026-11-16"
    },
    {
      titre: "Fikwot SSD SATA 2,5 pouces — 1 To",
      categorie: "stockage",
      pourquoi: "Un SSD SATA 1 To pour redonner vie à un vieux PC ou un portable : démarrage de Windows en quelques secondes au lieu de plusieurs minutes avec un disque dur.",
      lien: "https://link.amazon/B01K0Gsai",
      icone: "💾",
      date: "2026-11-16"
    },
    {
      titre: "Corsair CX — 550, 650 ou 750 W, 80 PLUS Bronze",
      categorie: "alim",
      pourquoi: "Une alimentation de marque fiable pour un PC de jeu d'entrée ou de milieu de gamme. Choisissez la puissance sur la page : 550 W pour une RX 7600 ou une RTX 5060, 650 à 750 W pour une carte plus puissante.",
      lien: "https://link.amazon/B0bBLOEPX",
      icone: "⚡",
      date: "2026-11-16",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair RM850e — 850 W, 80 PLUS Gold, modulaire",
      categorie: "alim",
      pourquoi: "850 W certifiés Gold, entièrement modulaire, avec le câble 12V-2x6 pour les cartes graphiques récentes. Silencieuse et fiable, pour un PC haut de gamme (RTX 5070 Ti, RX 9070 XT).",
      lien: "https://link.amazon/B01QbguMS",
      icone: "⚡",
      date: "2026-11-16",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair RM1000x — 1000 W, 80 PLUS Gold, modulaire",
      categorie: "alim",
      pourquoi: "Une alimentation très haut de gamme, garantie longue durée, pour les configs les plus gourmandes (RTX 5080, RTX 5090) ou pour garder une énorme marge d'évolution.",
      lien: "https://link.amazon/B02uJW8KN",
      icone: "⚡",
      date: "2026-11-16"
    },
    {
      titre: "Corsair 3500X — boîtier moyen tour ATX, blanc",
      categorie: "boitiers",
      pourquoi: "Un boîtier vitré panoramique (façade et côté en verre) pour bien montrer les composants. Spacieux et facile à monter : idéal pour un PC blanc avec des ventilateurs RGB.",
      lien: "https://link.amazon/B0emQqFRW",
      icone: "📦",
      date: "2026-11-16"
    },
    {
      titre: "Corsair 4500X — boîtier double chambre ATX, blanc",
      categorie: "boitiers",
      pourquoi: "Double chambre : l'alimentation et les câbles sont cachés derrière, la vitrine panoramique ne montre que le beau. Pour un montage très propre.",
      lien: "https://link.amazon/B03a7sx15",
      icone: "📦",
      date: "2026-11-16"
    },
    {
      titre: "Corsair Frame 4000X — boîtier modulaire ATX, blanc",
      categorie: "boitiers",
      pourquoi: "Un boîtier modulaire : on peut déplacer les panneaux et les supports de ventilateurs selon son matériel. Excellent flux d'air et beaucoup de place pour les grandes cartes graphiques.",
      lien: "https://link.amazon/B0eYUXoJp",
      icone: "📦",
      date: "2026-11-16"
    },
    {
      titre: "Corsair Warthog — boîtier style militaire, noir ou vert",
      categorie: "boitiers",
      pourquoi: "Un look « matériel militaire » unique, héritier du mythique Vengeance C70, pensé pour un flux d'air maximal. Pour un PC qui ne ressemble à aucun autre.",
      lien: "https://link.amazon/B03rBfBYn",
      icone: "📦",
      date: "2026-11-16"
    },
    {
      titre: "Mars Gaming MC-REV — boîtier ATX double vitre, blanc",
      categorie: "boitiers",
      pourquoi: "Double vitre trempée et 3 ventilateurs ARGB inclus : un boîtier blanc lumineux à petit prix pour un premier montage.",
      lien: "https://link.amazon/B0aNddref",
      icone: "📦",
      date: "2026-11-16"
    },
    {
      titre: "ARCTIC Xtender — boîtier E-ATX vitré",
      categorie: "boitiers",
      pourquoi: "Un grand boîtier vitré qui accepte les cartes mères E-ATX, avec un support vertical pour la carte graphique et son câble riser inclus : de quoi mettre la carte graphique en vitrine.",
      lien: "https://link.amazon/B08UhQfV5",
      icone: "📦",
      date: "2026-11-16"
    },
    {
      titre: "Thermalright Assassin King 120 SE — ventirad tour",
      categorie: "refroidissement",
      pourquoi: "Un ventirad tour à 4 caloducs très efficace pour son petit prix : bien plus silencieux que le ventirad d'origine. Suffisant pour un Ryzen 5 en jeu.",
      lien: "https://link.amazon/B0cu4l6wK",
      icone: "❄️",
      date: "2026-11-16"
    },
    {
      titre: "Corsair Nautilus 360 LCD — watercooling AIO 360 mm avec écran",
      categorie: "refroidissement",
      pourquoi: "Radiateur 360 mm pour refroidir les processeurs les plus puissants en silence, et un écran LCD sur la pompe (température, image, GIF). Vérifiez que le boîtier accepte un radiateur 360 mm.",
      lien: "https://link.amazon/B0h8Yulk3",
      icone: "❄️",
      date: "2026-11-16"
    },
    {
      titre: "Gigabyte — écran 24 pouces IPS 175 Hz",
      categorie: "ecrans",
      pourquoi: "Un premier écran gaming abordable : dalle IPS aux couleurs fidèles et 175 Hz pour une image bien plus fluide qu'un écran classique à 60 Hz.",
      lien: "https://link.amazon/B0fTEGVnU",
      icone: "🖥️",
      date: "2026-11-16"
    },
    {
      titre: "Samsung — écran 27 pouces IPS 300 Hz",
      categorie: "ecrans",
      pourquoi: "Un écran très rapide pour les jeux compétitifs (FPS, Valorant, CS2) : 300 Hz sur une dalle IPS de 27 pouces.",
      lien: "https://link.amazon/B06FCJXTt",
      icone: "🖥️",
      date: "2026-11-16"
    },
    {
      titre: "AOC — écran 27 pouces QHD 260 Hz VA incurvé",
      categorie: "ecrans",
      pourquoi: "Une dalle VA incurvée avec un bon contraste et des noirs profonds, en 1440p à 260 Hz. Un écran immersif pour les jeux de course et d'aventure.",
      lien: "https://link.amazon/B0hA8tpbV",
      icone: "🖥️",
      date: "2026-11-16"
    },
    {
      titre: "Gigabyte — écran 27 pouces QHD OLED 280 Hz, blanc (ICE)",
      categorie: "ecrans",
      pourquoi: "Noirs parfaits et couleurs éclatantes grâce à l'OLED, en 1440p à 280 Hz. La version ICE blanche s'accorde avec un setup tout blanc.",
      lien: "https://link.amazon/B0ah63cBg",
      icone: "🖥️",
      date: "2026-11-16"
    },
    {
      titre: "LG — écran 34 pouces ultra-large 21:9, 160 Hz",
      categorie: "ecrans",
      pourquoi: "Le format 21:9 élargit le champ de vision dans les jeux de course et de simulation, et donne beaucoup de place pour travailler avec plusieurs fenêtres côte à côte.",
      lien: "https://link.amazon/B072Eci1M",
      icone: "🖥️",
      date: "2026-11-16"
    },
    {
      titre: "Gigabyte — écran 49 pouces OLED 32:9, 144 Hz",
      categorie: "ecrans",
      pourquoi: "L'équivalent de deux écrans 27 pouces en un seul, en OLED : immersion totale en simulation de course ou de vol. Demande une carte graphique puissante.",
      lien: "https://link.amazon/B0a7KfEFz",
      icone: "🖥️",
      date: "2026-11-16"
    },
    {
      titre: "Cherry Xtrfy M64 Wireless — souris gaming sans fil, bleue",
      categorie: "souris",
      pourquoi: "Une souris sans fil légère et ergonomique, au capteur précis, signée Cherry Xtrfy, une marque reconnue chez les joueurs compétitifs.",
      lien: "https://link.amazon/B0cSuNMZk",
      icone: "🖱️",
      date: "2026-11-16",
      promo: "2026-11-30"
    },
    {
      titre: "Logitech G413 TKL — clavier mécanique sans pavé numérique",
      categorie: "claviers",
      pourquoi: "Un clavier mécanique solide et sobre, au format TKL (sans pavé numérique) pour laisser plus de place à la souris.",
      lien: "https://link.amazon/B04pZNpUK",
      icone: "⌨️",
      date: "2026-11-16",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair Clipper Pro Mini 60 — clavier à switchs magnétiques (Hall)",
      categorie: "claviers",
      pourquoi: "Un clavier compact 60 % à switchs magnétiques : on règle la profondeur d'appui de chaque touche, ultra-réactif pour les jeux compétitifs.",
      lien: "https://link.amazon/B0iePffOt",
      icone: "⌨️",
      date: "2026-11-16"
    },
    {
      titre: "Logitech G Pro X SE — casque gaming",
      categorie: "audio",
      pourquoi: "Le casque de la gamme Pro de Logitech, pensé pour l'esport : confortable sur de longues sessions, avec un son clair pour repérer les pas de l'adversaire.",
      lien: "https://link.amazon/B03M8soMf",
      icone: "🎧",
      date: "2026-11-16",
      promo: "2026-11-30"
    },
    {
      titre: "Philips Fidelio X2 — casque hi-fi ouvert",
      categorie: "audio",
      pourquoi: "Un casque hi-fi ouvert réputé pour son son ample et naturel, parfait pour la musique et les jeux solo. Il n'a pas de micro : prévoir un micro séparé pour jouer en ligne.",
      lien: "https://link.amazon/B0jggSo2D",
      icone: "🎧",
      date: "2026-11-16"
    },
    {
      titre: "ASUS Prime B660M-A D4-CSM — carte mère Intel LGA 1700 micro-ATX",
      categorie: "cm",
      pourquoi: "Pour un processeur Intel de 12e, 13e ou 14e génération (Core i3, i5, i7) avec de la RAM DDR4 : idéal pour monter un PC économique ou réutiliser sa RAM DDR4. Format micro-ATX.",
      lien: "https://link.amazon/B0hUCyCi3",
      icone: "🧩",
      date: "2026-11-18"
    },
    {
      titre: "Corsair 3200D RS ARGB — boîtier moyen tour ATX, 3 ventilateurs ARGB",
      categorie: "boitiers",
      pourquoi: "Un boîtier aéré avec 3 ventilateurs RS120 ARGB déjà installés en façade. Il accepte les cartes graphiques jusqu'à 400 mm et un radiateur de 360 mm : une base facile et lumineuse pour un premier montage.",
      lien: "https://link.amazon/B02Wfa3wY",
      icone: "📦",
      date: "2026-11-18"
    },
    {
      titre: "NZXT Kraken Plus 240 RGB — watercooling AIO 240 mm avec écran",
      categorie: "refroidissement",
      pourquoi: "Un watercooling 240 mm avec 2 ventilateurs RGB et un petit écran LCD de 1,54 pouce sur la pompe (température, image). Compatible AM5, AM4, LGA 1851 et LGA 1700, kit de montage inclus.",
      lien: "https://link.amazon/B0frogBnk",
      icone: "❄️",
      date: "2026-11-18"
    },
    {
      titre: "Gigabyte B850 EAGLE WiFi — carte mère AM5 ATX",
      categorie: "cm",
      pourquoi: "Chipset B850 récent, Wi-Fi intégré et DDR5 : une base solide et abordable pour un Ryzen 7000 ou 9000.",
      lien: "https://link.amazon/B07oDuCha",
      icone: "🧩",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Gigabyte AORUS B850 ELITE WiFi ICE — carte mère AM5 ATX, blanche",
      categorie: "cm",
      pourquoi: "La version blanche de la gamme AORUS : très bien équipée, avec un bon étage d'alimentation pour un Ryzen 7 9800X3D, idéale pour un PC tout blanc.",
      lien: "https://link.amazon/B03LwRC6g",
      icone: "🧩",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Netac DDR4 3200 MHz 32 Go (2 × 16 Go), blanc",
      categorie: "ram",
      pourquoi: "32 Go pour jouer et faire du multitâche sans manquer de mémoire, en DDR4 pour une carte mère AM4 ou Intel compatible. Version blanche.",
      lien: "https://link.amazon/B07pShO1q",
      icone: "🧠",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Barrette DDR5 SO-DIMM 24 Go 5600 MHz — pour PC portable",
      categorie: "ram",
      pourquoi: "Pour ajouter de la mémoire à un PC portable ou un mini-PC récent en DDR5. Vérifiez d'abord que votre modèle accepte la DDR5 SO-DIMM et cette capacité.",
      lien: "https://link.amazon/B0iMkQkRq",
      icone: "🧠",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Adaptateur DDR5",
      categorie: "ram",
      pourquoi: "Un adaptateur pour barrette DDR5. Vérifiez sur la fiche Amazon qu'il correspond bien à votre usage avant de commander.",
      lien: "https://link.amazon/B0cepbQUk",
      icone: "🧠",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Biwin SSD SATA 2,5 pouces — 512 Go",
      categorie: "stockage",
      pourquoi: "Un SSD SATA à petit prix pour remplacer le disque dur d'un vieux PC ou d'un portable : Windows démarre en quelques secondes.",
      lien: "https://link.amazon/B06pRsP0P",
      icone: "💾",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Biwin SSD NVMe M.2 Gen3 — 1 To",
      categorie: "stockage",
      pourquoi: "Un SSD NVMe rapide et abordable pour le système et les jeux, compatible avec presque toutes les cartes mères ayant un port M.2.",
      lien: "https://link.amazon/B06rQlzId",
      icone: "💾",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Netac SSD NVMe M.2 Gen4 — 1 To",
      categorie: "stockage",
      pourquoi: "Un SSD PCIe 4.0 encore plus rapide pour des chargements de jeux très courts, sur une carte mère avec un port M.2 Gen4.",
      lien: "https://link.amazon/B0jemG8tQ",
      icone: "💾",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Acer SSD NVMe M.2 Gen4 — 1 To",
      categorie: "stockage",
      pourquoi: "Un SSD PCIe 4.0 de marque pour le système et les jeux. Pensez à un petit dissipateur si votre carte mère n'en a pas sur le port M.2.",
      lien: "https://link.amazon/B0jbUaDvO",
      icone: "💾",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "SAMA G1000 — alimentation 1000 W",
      categorie: "alim",
      pourquoi: "1000 W pour une config haut de gamme avec une grosse carte graphique, et de la marge pour les évolutions futures.",
      lien: "https://link.amazon/B0iTKZCBX",
      icone: "⚡",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "SAMA P1000 / P1200 — alimentation 1000 ou 1200 W",
      categorie: "alim",
      pourquoi: "Une alimentation très puissante pour les configs les plus gourmandes : choisissez la puissance sur la page.",
      lien: "https://link.amazon/B0dpCbi2y",
      icone: "⚡",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair RM1000x SHIFT — 1000 W, modulaire, connecteurs sur le côté",
      categorie: "alim",
      pourquoi: "Les câbles se branchent sur le côté de l'alimentation : beaucoup plus simple à câbler proprement dans un boîtier double chambre.",
      lien: "https://link.amazon/B00uvFueV",
      icone: "⚡",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "MSI MAG FORGE 112R — boîtier moyen tour ATX, ventilateurs ARGB",
      categorie: "boitiers",
      pourquoi: "Un boîtier vitré abordable, livré avec des ventilateurs ARGB : une bonne base lumineuse pour un premier montage.",
      lien: "https://link.amazon/B0hjeESk4",
      icone: "📦",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "MSI MPG GUNGNIR 110R — boîtier moyen tour ATX, blanc",
      categorie: "boitiers",
      pourquoi: "Un boîtier blanc spacieux avec un très bon flux d'air et des ventilateurs ARGB inclus, pour un PC gamer tout blanc.",
      lien: "https://link.amazon/B0ck50pI3",
      icone: "📦",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Cooler Master NR200P MAX — boîtier Mini-ITX avec alimentation et watercooling",
      categorie: "boitiers",
      pourquoi: "Un PC compact tout-en-un : le boîtier Mini-ITX est livré avec son alimentation SFX 850 W et un watercooling 280 mm déjà installés. Pour un petit PC très puissant.",
      lien: "https://link.amazon/B0gvyqEXq",
      icone: "📦",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "SAMA A60E — ventirad tour",
      categorie: "refroidissement",
      pourquoi: "Un ventirad tour abordable, bien plus silencieux que le ventirad d'origine.",
      lien: "https://link.amazon/B0dDnoi12",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Thermalright Phantom Spirit 120 RGB — ventirad double tour",
      categorie: "refroidissement",
      pourquoi: "Un des ventirads les plus efficaces pour son prix, avec éclairage RGB : il tient tête à beaucoup de watercoolings 240 mm.",
      lien: "https://link.amazon/B0fcxhYrY",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Ocypus Delta L36 — watercooling AIO 360 mm",
      categorie: "refroidissement",
      pourquoi: "Le grand frère du L24 : radiateur 360 mm pour refroidir les processeurs les plus puissants en silence. Vérifiez que le boîtier accepte un radiateur 360 mm.",
      lien: "https://link.amazon/B09Y5TTBJ",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Ocypus Iota — watercooling AIO 240 ou 360 mm",
      categorie: "refroidissement",
      pourquoi: "Un watercooling abordable, en 240 ou 360 mm selon la place dans votre boîtier.",
      lien: "https://link.amazon/B03qdO1fp",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "SAMA Q60 — watercooling AIO avec écran LCD",
      categorie: "refroidissement",
      pourquoi: "Un watercooling avec un écran LCD sur la pompe pour afficher la température ou une image.",
      lien: "https://link.amazon/B0alclThh",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Ocypus — contrôleur ventilateurs 10 ports aRGB",
      categorie: "refroidissement",
      pourquoi: "Pour brancher et piloter jusqu'à 10 ventilateurs et leurs éclairages depuis un seul connecteur de la carte mère.",
      lien: "https://link.amazon/B0es1VafE",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Ocypus — kit ventilateurs 360 mm",
      categorie: "refroidissement",
      pourquoi: "Un kit de ventilateurs au format 360 mm pour améliorer le flux d'air du boîtier ou d'un radiateur.",
      lien: "https://link.amazon/B04RGfQrl",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Ocypus — écran 5,5 pouces pour boîtier",
      categorie: "refroidissement",
      pourquoi: "Un petit écran à installer dans le boîtier pour afficher en direct les températures et l'usage du processeur et de la carte graphique.",
      lien: "https://link.amazon/B02acfcd4",
      icone: "❄️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Philips — écran 24 pouces IPS 240 Hz, blanc",
      categorie: "ecrans",
      pourquoi: "Un écran rapide pour les jeux compétitifs, avec un design blanc pour un setup assorti.",
      lien: "https://link.amazon/B0ccm2X1p",
      icone: "🖥️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "AOC — écran 24 pouces IPS 240 Hz",
      categorie: "ecrans",
      pourquoi: "240 Hz et une dalle IPS aux couleurs fidèles : idéal pour les FPS en 1080p.",
      lien: "https://link.amazon/B08jnzAMr",
      icone: "🖥️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "MSI — écran 27 pouces QHD QD-OLED 280 Hz, blanc",
      categorie: "ecrans",
      pourquoi: "Noirs parfaits et couleurs éclatantes en 1440p à 280 Hz, dans une version blanche.",
      lien: "https://link.amazon/B03nNSY7Z",
      icone: "🖥️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "MSI FORGE GK320 — clavier gaming",
      categorie: "claviers",
      pourquoi: "Un clavier gaming d'entrée de gamme rétroéclairé, parfait pour débuter.",
      lien: "https://link.amazon/B0gtZ544q",
      icone: "⌨️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "MSI FORGE GK600 TKL — clavier gaming sans pavé numérique",
      categorie: "claviers",
      pourquoi: "Un clavier compact au format TKL : plus de place pour la souris sur le bureau.",
      lien: "https://link.amazon/B03xkSl2o",
      icone: "⌨️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Razer Huntsman Mini — clavier 60 %, switchs optiques Clicky",
      categorie: "claviers",
      pourquoi: "Un clavier ultra-compact à switchs optiques très réactifs, avec un clic franc et sonore.",
      lien: "https://link.amazon/B0iRzsDzY",
      icone: "⌨️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair K65 PLUS Wireless — clavier compact sans fil",
      categorie: "claviers",
      pourquoi: "Un clavier compact sans fil, utilisable en 2,4 GHz pour jouer ou en Bluetooth, avec une grande autonomie.",
      lien: "https://link.amazon/B0bxjzHj9",
      icone: "⌨️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Razer Viper V3 HyperSpeed — souris gaming sans fil",
      categorie: "souris",
      pourquoi: "Une souris sans fil légère, pensée pour les jeux compétitifs, avec un capteur très précis.",
      lien: "https://link.amazon/B09NDt8Dx",
      icone: "🖱️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "ASUS ROG Keris II Ace — souris gaming sans fil, blanche",
      categorie: "souris",
      pourquoi: "Une souris sans fil ultra-légère pour l'esport, en version blanche.",
      lien: "https://link.amazon/B0had3dgR",
      icone: "🖱️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Cooler Master — tapis de souris XXL",
      categorie: "souris",
      pourquoi: "Un grand tapis qui accueille le clavier et la souris, pour une glisse régulière et un bureau protégé.",
      lien: "https://link.amazon/B0cnhUkDW",
      icone: "🖱️",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "HyperX Cloud Alpha — casque gaming filaire",
      categorie: "audio",
      pourquoi: "Un classique réputé pour son son et son confort, avec un micro détachable. Compatible PC et consoles.",
      lien: "https://link.amazon/B04GdgfxN",
      icone: "🎧",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair TC100 RELAXED — fauteuil gaming",
      categorie: "fauteuils",
      pourquoi: "Un fauteuil gaming d'entrée de gamme, avec une assise large et confortable pour les longues sessions.",
      lien: "https://link.amazon/B0g0373W0",
      icone: "🪑",
      date: "2026-11-19",
      promo: "2026-11-30"
    },
    {
      titre: "Corsair TC500 LUXE — fauteuil gaming",
      categorie: "fauteuils",
      pourquoi: "Un fauteuil haut de gamme avec de nombreux réglages, pour bien tenir le dos pendant les longues sessions de jeu ou de travail.",
      lien: "https://link.amazon/B02xFMWRs",
      icone: "🪑",
      date: "2026-11-19",
      promo: "2026-11-30"
    }
  ]
};
