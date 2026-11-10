/* =========================================================
   Nicotch — arbres de diagnostic CONSOLES
   ---------------------------------------------------------
   Même structure que data-pc.js, avec deux ajouts :
   • un texte peut être un objet adapté au modèle :
       { ps5: "...", ps: "...", xbox: "...", switch: "...", def: "..." }
     (le modèle exact est prioritaire, puis la famille, puis "def")
   • "only": [...] limite une réponse ou un contrôle à certains modèles/familles.
   Modèles : ps4, ps5 (famille ps) · xone, xseries (famille xbox) · switch (famille switch)
   ========================================================= */
window.ND_DIAG = window.ND_DIAG || {};

window.ND_DIAG.plateformes = [
  {
    id: "playstation", nom: "PlayStation", icone: "🎮", famille: "ps",
    support: { nom: "Assistance PlayStation", url: "https://www.playstation.com/fr-fr/support/" },
    modeles: [
      { id: "ps4", nom: "PS4", detail: "PS4, PS4 Slim, PS4 Pro" },
      { id: "ps5", nom: "PS5", detail: "PS5, PS5 Slim, PS5 Pro, éditions Digital" }
    ]
  },
  {
    id: "xbox", nom: "Xbox", icone: "🟢", famille: "xbox",
    support: { nom: "Assistance Xbox", url: "https://support.xbox.com/fr-FR/" },
    modeles: [
      { id: "xone", nom: "Xbox One", detail: "Xbox One, One S, One X" },
      { id: "xseries", nom: "Xbox Series", detail: "Xbox Series X, Xbox Series S" }
    ]
  },
  {
    id: "nintendo", nom: "Nintendo", icone: "🔴", famille: "switch",
    support: { nom: "Assistance Nintendo", url: "https://www.nintendo.com/fr-fr/Assistance/" },
    modeles: [
      { id: "switch", nom: "Nintendo Switch", detail: "Switch, Switch OLED, Switch Lite" }
    ]
  }
];

/* Textes réutilisés (procédures officielles résumées) */
var ND_TXT = {
  redemarrageComplet: {
    ps: "Éteignez complètement la console (pas en mode repos : maintenez le bouton d'alimentation jusqu'au bip), débranchez le câble d'alimentation quelques minutes, puis rebranchez et rallumez.",
    xbox: "Maintenez le bouton Xbox de la console environ 10 secondes jusqu'à l'arrêt complet, débranchez le câble d'alimentation, patientez au moins 10 secondes (plus longtemps ne pose aucun problème), rebranchez et rallumez.",
    "switch": "Maintenez le bouton POWER environ 12 secondes pour forcer l'arrêt, puis appuyez une fois dessus pour rallumer."
  },
  modeSansEchec: "Mode sans échec PlayStation : console éteinte, maintenez le bouton d'alimentation jusqu'au deuxième bip (environ 7 secondes), branchez la manette avec un câble USB puis appuyez sur la touche PS.",
  depannageXbox: {
    xone: "Outil de dépannage au démarrage : console éteinte et débranchée 30 secondes, rebranchez-la, maintenez les boutons Couplage et Éjecter puis appuyez sur le bouton Xbox ; gardez Couplage et Éjecter enfoncés 10 à 15 secondes jusqu'à deux bips. (Modèle sans lecteur : la procédure diffère, consultez l'assistance Xbox.)",
    xseries: "Outil de dépannage au démarrage : console éteinte et débranchée 30 secondes, rebranchez-la, maintenez Couplage et Éjecter (Series S : seulement Couplage) puis appuyez sur le bouton Xbox ; gardez-les enfoncés 10 à 15 secondes jusqu'à deux bips."
  },
  maintenanceSwitch: "Mode maintenance : console éteinte, maintenez les boutons Volume + et Volume − enfoncés puis appuyez sur POWER, jusqu'à l'apparition du menu."
};

window.ND_DIAG.consoles = [
  /* ---------------------------------------------------- 1 */
  {
    id: "c-allume-pas",
    titre: "La console ne s'allume plus",
    icone: "⚡",
    resume: "Aucune réaction, ou un voyant mais rien ne démarre.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Que se passe-t-il quand vous appuyez sur le bouton d'alimentation ?",
        rep: [
          { t: "Rien du tout", sous: "Aucun voyant, aucun son", ico: "⛔", suite: "q2" },
          { t: "Un voyant s'allume ou clignote, mais rien ne démarre", ico: "💡", res: "voyant" },
          { t: "Elle s'allume puis s'éteint aussitôt", ico: "🔁", res: "allume-eteint" }
        ]
      },
      q2: {
        q: {
          "switch": "Avez-vous laissé la console en charge au moins 30 minutes avec le chargeur officiel, branché sur une prise murale ?",
          def: "Avez-vous essayé une autre prise murale (sans multiprise) et vérifié que le câble est enfoncé à fond des deux côtés ?"
        },
        rep: [
          { t: "Oui, et toujours rien", ico: "✅", res: "aucune-vie" },
          { t: "Non, pas encore", ico: "❓", res: "secteur" }
        ]
      }
    },
    resultats: {
      secteur: {
        titre: "Vérifiez d'abord l'alimentation",
        intro: "Les causes simples sont fréquentes : prise, multiprise, câble mal enfoncé ou batterie vide.",
        causes: [
          ["Prise ou multiprise sans courant", "forte"],
          [{ "switch": "Batterie complètement vide", def: "Câble d'alimentation mal enfoncé à l'arrière de la console" }, "forte"],
          [{ "switch": "Chargeur non officiel ou défectueux", def: "Câble d'alimentation défectueux" }, "moyenne"]
        ],
        controles: [
          { t: "Brancher directement sur une prise murale", comment: "Testez la prise avec un autre appareil et retirez la multiprise.", outils: "Un autre appareil électrique", niv: 1, attendu: "La console réagit.", ok: "La multiprise ou la prise était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le câble", comment: { xone: "Xbox One d'origine : le bloc d'alimentation externe a un voyant. Éteint = pas de courant ; orange = veille (normal) ; blanc = la console est allumée. Vérifiez les deux branchements du bloc.", "switch": "Utilisez le chargeur officiel Nintendo (ou celui du dock) branché au mur, et laissez charger au moins 30 minutes, idéalement une heure.", def: "Enfoncez fermement le câble à l'arrière de la console et dans la prise. Si possible, testez un câble d'alimentation compatible de rechange." }, outils: { "switch": "Chargeur officiel", def: "Câble de rechange si disponible" }, niv: 1, attendu: "La console s'allume.", ok: "Problème réglé.", ko: "Refaites le diagnostic en répondant « Oui, et toujours rien »." }
        ],
        fiches: ["co-ps-allumage", "co-xbox-allumage", "co-switch-allumage"]
      },
      "aucune-vie": {
        titre: "La console ne donne aucun signe de vie",
        intro: "Le courant arrive mais la console ne réagit pas. Une procédure de réinitialisation officielle peut débloquer la situation ; sinon, une panne interne est possible et relève du service après-vente.",
        causes: [
          ["Blocage électronique (à réinitialiser)", "moyenne"],
          [{ "switch": "Batterie profondément déchargée", def: "Câble d'alimentation défectueux" }, "moyenne"],
          ["Alimentation interne ou carte mère défaillante", "moyenne"]
        ],
        controles: [
          { t: "Redémarrage complet / réinitialisation", comment: ND_TXT.redemarrageComplet, outils: "Aucun", niv: 1, attendu: "La console redémarre.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Charger plus longtemps puis forcer le redémarrage", only: ["switch"], comment: "Laissez charger une heure avec le chargeur officiel branché au mur, puis maintenez POWER 12 secondes et rappuyez une fois.", outils: "Chargeur officiel", niv: 1, attendu: "Le logo apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Tester un autre câble d'alimentation", only: ["ps", "xseries"], comment: "Ces consoles utilisent un câble secteur standard : testez un câble compatible en bon état.", outils: "Câble secteur compatible", niv: 1, attendu: "La console s'allume.", ok: "Le câble était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Contacter l'assistance officielle", comment: "Vérifiez la garantie et suivez la procédure de réparation du fabricant (lien en bas du rapport).", outils: "Preuve d'achat si possible", niv: 1, attendu: "Prise en charge par le service après-vente.", ok: "Suivez leurs instructions.", ko: "Faites appel à un réparateur qualifié." }
        ],
        avert: ["N'ouvrez pas la console : l'alimentation interne présente un risque électrique et l'ouverture peut annuler la garantie."],
        pro: "Une console qui ne réagit plus du tout après ces contrôles doit être examinée par le service après-vente ou un réparateur qualifié.",
        fiches: ["co-ps-allumage", "co-xbox-allumage", "co-switch-allumage"]
      },
      voyant: {
        titre: "Voyant allumé mais la console ne démarre pas",
        intro: "La console reçoit du courant mais ne termine pas son démarrage, ou démarre sans afficher d'image. Plusieurs causes sont possibles.",
        causes: [["Console bloquée en mode repos ou démarrage interrompu", "forte"], ["Démarrage normal mais pas d'image (problème vidéo)", "moyenne"], ["Logiciel système endommagé", "moyenne"]],
        controles: [
          { t: "Redémarrage complet", comment: ND_TXT.redemarrageComplet, outils: "Aucun", niv: 1, attendu: "La console démarre normalement.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Démarrer en mode sans échec", only: ["ps"], comment: ND_TXT.modeSansEchec + " Choisissez d'abord « Redémarrer la console ».", outils: "Manette et câble USB", niv: 2, attendu: "La console redémarre normalement.", ok: "Problème réglé.", ko: "Dans le même menu, essayez « Reconstruire la base de données » (sans perte de données)." },
          { t: "Outil de dépannage au démarrage", only: ["xbox"], comment: ND_TXT.depannageXbox, outils: "Aucun", niv: 2, attendu: "Un menu de dépannage apparaît à l'écran.", ok: "Choisissez « Redémarrer cette Xbox » ou une mise à jour hors ligne selon l'assistance Xbox.", ko: "Si aucun menu n'apparaît, vérifiez l'affichage (parcours « Absence d'image »)." },
          { t: "Mode maintenance", only: ["switch"], comment: ND_TXT.maintenanceSwitch + " Choisissez d'abord « Mettre à jour la console » si une connexion est disponible.", outils: "Aucun", niv: 2, attendu: "La console redémarre normalement.", ok: "Problème réglé.", ko: "Contactez l'assistance Nintendo avant toute initialisation." }
        ],
        avert: ["Dans ces menus, les options « Initialiser » / « Réinitialiser » effacent les données de la console. Ne les utilisez qu'en dernier recours, après avoir vérifié vos sauvegardes en ligne."],
        fiches: ["co-ps-mode-sans-echec", "co-xbox-allumage", "co-switch-allumage"]
      },
      "allume-eteint": {
        titre: "La console s'allume puis s'éteint aussitôt",
        intro: "Une coupure immédiate peut venir d'une protection (surchauffe, alimentation) ou d'un problème électrique. La cause précise ne peut pas être déterminée sans contrôle.",
        causes: [["Protection contre la surchauffe (aérations bouchées)", "moyenne"], ["Problème d'alimentation (prise, câble)", "moyenne"], ["Panne interne", "moyenne"]],
        controles: [
          { t: "Dégager la console et la laisser refroidir", comment: "Placez-la dans un endroit aéré, loin d'une source de chaleur, et attendez qu'elle soit froide.", outils: "Aucun", niv: 1, attendu: "Elle reste allumée.", ok: "Améliorez la ventilation (voir la fiche Surchauffe).", ko: "Passez au contrôle suivant." },
          { t: "Prise murale directe et redémarrage complet", comment: ND_TXT.redemarrageComplet, outils: "Aucun", niv: 1, attendu: "Elle reste allumée.", ok: "Problème réglé.", ko: "Contactez l'assistance officielle." }
        ],
        avert: ["Odeur de brûlé ou bruit anormal : débranchez immédiatement la console et ne réessayez pas."],
        pro: "Si la coupure se répète, faites examiner la console par le service après-vente.",
        fiches: ["co-surchauffe"]
      }
    }
  },

  /* ---------------------------------------------------- 2 */
  {
    id: "c-pas-image",
    titre: "Absence d'image",
    icone: "📺",
    resume: "La console semble allumée mais la TV n'affiche rien.",
    debut: "q1",
    noeuds: {
      q1: {
        q: {
          "switch": "Où l'image manque-t-elle ?",
          def: "La console semble-t-elle allumée (voyant, ventilateur, son du menu) ?"
        },
        rep: [
          { t: "Oui, elle semble allumée", only: ["ps", "xbox"], ico: "✅", suite: "q2" },
          { t: "Non, elle ne semble pas allumée", only: ["ps", "xbox"], ico: "⛔", aller: "c-allume-pas" },
          { t: "Sur la TV, la console étant dans le dock", only: ["switch"], ico: "📺", suite: "q2" },
          { t: "Sur l'écran de la console (mode portable)", only: ["switch"], ico: "📱", res: "ecran-switch" }
        ]
      },
      q2: {
        q: "Avez-vous déjà essayé un autre câble HDMI et une autre entrée HDMI de la TV ?",
        rep: [
          { t: "Oui, toujours pas d'image", ico: "✅", res: "reglage-video" },
          { t: "Non, pas encore", ico: "❓", res: "hdmi" }
        ]
      }
    },
    resultats: {
      hdmi: {
        titre: "Vérifier la chaîne HDMI",
        intro: "La plupart des absences d'image viennent de la source de la TV, du câble ou d'un appareil intermédiaire (barre de son, ampli).",
        causes: [["Mauvaise source sélectionnée sur la TV", "forte"], ["Câble HDMI défectueux ou inadapté", "forte"], ["Appareil intermédiaire (barre de son, ampli, répartiteur)", "moyenne"], [{ "switch": "Branchements du dock dans le mauvais ordre", def: "Port HDMI de la TV" }, "moyenne"]],
        controles: [
          { t: "Choisir la bonne source sur la TV", comment: "Avec la télécommande (bouton Source ou Input), sélectionnez l'entrée HDMI où est branchée la console.", outils: "Télécommande", niv: 1, attendu: "L'image apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Brancher en direct", comment: "Retirez barre de son, ampli ou répartiteur : branchez la console directement sur la TV.", outils: "Aucun", niv: 1, attendu: "L'image apparaît.", ok: "L'appareil intermédiaire est en cause (réglages ou compatibilité).", ko: "Passez au contrôle suivant." },
          { t: "Changer de câble et d'entrée HDMI", comment: { ps5: "Utilisez de préférence le câble HDMI fourni avec la PS5, surtout pour la 4K ou le 120 Hz.", xseries: "Utilisez de préférence le câble HDMI fourni avec la console, surtout pour la 4K ou le 120 Hz.", def: "Testez un autre câble HDMI en bon état et une autre entrée de la TV." }, outils: "Câble HDMI de rechange", niv: 1, attendu: "L'image apparaît.", ok: "Le câble ou l'entrée était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Rebrancher le dock dans l'ordre", only: ["switch"], comment: "Débranchez tous les câbles du dock et retirez la console. Branchez ensuite : 1) l'adaptateur secteur au dock puis au mur, 2) le câble HDMI entre le dock et la TV, 3) placez la console dans le dock. Utilisez l'adaptateur secteur officiel.", outils: "Adaptateur secteur officiel", niv: 1, attendu: "Le voyant du dock s'allume et l'image apparaît.", ok: "Problème réglé.", ko: "La Switch Lite ne peut pas afficher sur une TV. Sinon, passez au parcours « Toujours pas d'image »." },
          { t: "Tester sur une autre TV", comment: "Si possible, branchez la console sur une autre TV ou un écran.", outils: "Autre TV ou écran", niv: 1, attendu: "L'image apparaît sur l'autre TV.", ok: "La TV ou ses réglages sont en cause.", ko: "Refaites le diagnostic en répondant « Oui, toujours pas d'image »." }
        ],
        fiches: ["co-pas-image"]
      },
      "reglage-video": {
        titre: "Toujours pas d'image après les vérifications HDMI",
        intro: "La console envoie peut-être un format vidéo que la TV n'accepte pas. Chaque fabricant prévoit une procédure officielle pour revenir à une résolution basique. Un port HDMI endommagé reste possible.",
        causes: [["Résolution ou format vidéo non compatible avec la TV", "forte"], ["Port HDMI de la console endommagé", "moyenne"], ["Panne interne de la sortie vidéo", "faible"]],
        controles: [
          { t: "Changer la sortie vidéo en mode sans échec", only: ["ps"], comment: ND_TXT.modeSansEchec + " Choisissez « Changer la sortie vidéo » / « Changer la résolution » puis une résolution plus basse.", outils: "Manette et câble USB", niv: 2, attendu: "L'image réapparaît après le redémarrage.", ok: "Réglez ensuite la résolution dans les paramètres.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser l'affichage (basse résolution)", only: ["xbox"], comment: { xone: "Console éteinte : maintenez le bouton Xbox et le bouton Éjecter de la console jusqu'au deuxième bip (environ 10 secondes). La console démarre en basse résolution. Sur un modèle sans lecteur, la procédure diffère : consultez l'assistance Xbox.", xseries: "Console éteinte : maintenez le bouton Xbox et le bouton Éjecter (Series S : bouton Couplage) jusqu'au deuxième bip (environ 10 secondes). La console démarre en basse résolution." }, outils: "Aucun", niv: 1, attendu: "L'image apparaît en basse résolution.", ok: "Réglez ensuite l'affichage dans Paramètres > Général > Options TV et affichage.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser le dock", only: ["switch"], comment: "Débranchez tous les câbles du dock pendant au moins 30 secondes, puis rebranchez dans l'ordre (secteur, HDMI, console). Testez le dock avec la console allumée en mode portable avant de la poser dedans.", outils: "Aucun", niv: 1, attendu: "L'image apparaît sur la TV.", ok: "Problème réglé.", ko: "Si l'écran de la console fonctionne mais jamais la TV, le dock ou le port de la console peuvent être en cause." },
          { t: "Inspecter le port HDMI", comment: { "switch": "Regardez le port USB-C de la console et le connecteur du dock avec une lampe : broches tordues ou débris ?", def: "Avec une lampe, regardez le port HDMI de la console : broches tordues, connecteur enfoncé ou abîmé ?" }, outils: "Lampe", niv: 1, attendu: "Port intact.", ok: "Contactez l'assistance officielle.", ko: "Port endommagé : ne forcez pas, faites réparer par le service après-vente ou un réparateur qualifié (soudure nécessaire)." }
        ],
        pro: "Le remplacement d'un port HDMI nécessite de la micro-soudure : faites appel à un professionnel.",
        fiches: ["co-pas-image", "co-ps-mode-sans-echec"]
      },
      "ecran-switch": {
        titre: "Écran de la Switch noir en mode portable",
        intro: "La console peut être déchargée, bloquée ou avoir un problème d'écran. Plusieurs causes sont possibles.",
        causes: [["Batterie vide", "forte"], ["Console figée", "moyenne"], ["Luminosité au minimum", "faible"], ["Écran ou nappe défectueux", "moyenne"]],
        controles: [
          { t: "Charger la console", comment: "Branchez le chargeur officiel au moins 30 minutes, idéalement une heure.", outils: "Chargeur officiel", niv: 1, attendu: "Un logo de batterie ou l'écran d'accueil apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Forcer le redémarrage", comment: "Maintenez POWER environ 12 secondes, puis appuyez une fois.", outils: "Aucun", niv: 1, attendu: "Le logo Nintendo Switch apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Tester sur la TV (sauf Switch Lite)", comment: "Placez la console dans le dock branché à la TV.", outils: "Dock et TV", niv: 1, attendu: "L'image apparaît sur la TV.", ok: "La console fonctionne : l'écran ou sa nappe est probablement en cause. Contactez l'assistance.", ko: "Contactez l'assistance Nintendo." }
        ],
        fiches: ["co-switch-allumage"]
      }
    }
  },

  /* ---------------------------------------------------- 3 */
  {
    id: "c-surchauffe",
    titre: "Surchauffe ou arrêt intempestif",
    icone: "🔥",
    resume: "Message de température, ventilateur bruyant, arrêts brutaux.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Que constatez-vous ?",
        rep: [
          { t: "Un message d'avertissement de température s'affiche", ico: "🌡️", res: "chaleur" },
          { t: "La console s'éteint sans prévenir", ico: "⛔", res: "arret" },
          { t: "Le ventilateur est très bruyant", ico: "🌀", res: "bruit" }
        ]
      }
    },
    resultats: {
      chaleur: {
        titre: "Avertissement de température",
        intro: "La console signale qu'elle chauffe trop. Dans la grande majorité des cas, l'emplacement et la poussière sont en cause.",
        causes: [["Aérations bouchées ou console dans un meuble fermé", "forte"], ["Poussière accumulée dans les grilles", "forte"], ["Pièce très chaude", "moyenne"], ["Ventilateur ou dissipation interne défaillants", "faible"]],
        controles: [
          { t: "Dégager les aérations", comment: { "switch": "En mode portable, ne couvrez pas les grilles (coque, couverture, coussin). Dans le dock, laissez de l'espace autour et derrière.", def: "Laissez au moins une dizaine de centimètres libres autour de la console. Évitez les meubles fermés, les tapis et la proximité d'un radiateur ou d'autres appareils chauds." }, outils: "Aucun", niv: 1, attendu: "Plus de message.", ok: "Gardez cet emplacement.", ko: "Passez au contrôle suivant." },
          { t: "Dépoussiérer l'extérieur", comment: { ps5: "Console éteinte et débranchée : aspirez la poussière des grilles extérieures. Sony explique aussi comment retirer les caches et nettoyer les récupérateurs de poussière : suivez uniquement cette procédure officielle.", def: "Console éteinte et débranchée : soufflez la poussière des grilles extérieures avec une bombe d'air sec, par petites impulsions, ou aspirez doucement l'extérieur des grilles." }, outils: "Bombe d'air sec ou aspirateur avec embout brosse", niv: 1, attendu: "Grilles propres.", ok: "Observez si le message revient.", ko: "Passez au contrôle suivant." },
          { t: "Mettre à jour le logiciel système", comment: "Les mises à jour améliorent parfois la gestion des ventilateurs.", outils: "Connexion Internet", niv: 1, attendu: "Console à jour.", ok: "Observez le comportement.", ko: "Si le message persiste, contactez l'assistance officielle." }
        ],
        avert: ["N'ouvrez pas la console pour la nettoyer à l'intérieur (au-delà des caches prévus par le fabricant) : risque électrique et perte de garantie.", "PS5 : ne touchez jamais au dissipateur ni au métal liquide du processeur."],
        fiches: ["co-surchauffe"]
      },
      arret: {
        titre: "Arrêts sans prévenir",
        intro: "Un arrêt brutal peut être une protection contre la surchauffe, un problème d'alimentation électrique ou une panne. Il faut écarter les causes simples d'abord.",
        causes: [["Surchauffe (arrêt de protection)", "forte"], ["Prise, multiprise ou câble", "moyenne"], ["Problème logiciel", "moyenne"], ["Panne interne", "faible"]],
        controles: [
          { t: "Améliorer la ventilation", comment: "Console dans un endroit dégagé, grilles dépoussiérées (voir fiche Surchauffe).", outils: "Bombe d'air sec", niv: 1, attendu: "Plus d'arrêt.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Brancher directement au mur", comment: { "switch": "Utilisez l'adaptateur secteur officiel branché directement au mur.", def: "Sans multiprise ni rallonge, câble bien enfoncé." }, outils: "Aucun", niv: 1, attendu: "Plus d'arrêt.", ok: "La multiprise ou la prise était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Mettre à jour la console et redémarrer", comment: ND_TXT.redemarrageComplet, outils: "Connexion Internet", niv: 1, attendu: "Plus d'arrêt.", ok: "Problème réglé.", ko: "Contactez l'assistance officielle." }
        ],
        pro: "Des arrêts répétés malgré une bonne ventilation justifient un passage au service après-vente.",
        fiches: ["co-surchauffe"]
      },
      bruit: {
        titre: "Ventilateur très bruyant",
        intro: "Le ventilateur accélère quand la console chauffe. Un bruit fort mais régulier est souvent dû à la poussière ou à l'emplacement. Un bruit de frottement est plus inquiétant.",
        causes: [["Poussière et emplacement mal ventilé", "forte"], ["Jeu très exigeant (normal dans une certaine mesure)", "moyenne"], ["Ventilateur usé (bruit de frottement)", "faible"]],
        controles: [
          { t: "Dégager et dépoussiérer", comment: "Emplacement aéré, grilles nettoyées (console éteinte et débranchée).", outils: "Bombe d'air sec", niv: 1, attendu: "Bruit réduit.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Écouter le type de bruit", comment: "Souffle fort = ventilation normale à pleine vitesse. Frottement, cliquetis ou grincement = possible problème mécanique.", outils: "Aucun", niv: 1, attendu: "Simple souffle.", ok: "Surveillez la température et l'emplacement.", ko: "Bruit mécanique : contactez le service après-vente." }
        ],
        fiches: ["co-surchauffe"]
      }
    }
  },

  /* ---------------------------------------------------- 4 */
  {
    id: "c-lecteur",
    titre: { "switch": "Lecteur de cartouches qui ne fonctionne plus", def: "Lecteur de disque qui ne fonctionne plus" },
    icone: "💿",
    resume: { "switch": "Cartouche de jeu non reconnue.", def: "Disque non lu, refusé ou bloqué." },
    debut: "q1",
    noeuds: {
      q1: {
        q: { "switch": "Que se passe-t-il avec la cartouche ?", def: "Que se passe-t-il avec le lecteur ?" },
        rep: [
          { t: "Ma console n'a pas de lecteur de disque", sous: "Édition Digital / numérique, Xbox Series S…", only: ["ps5", "xbox"], ico: "🚫", res: "sans-lecteur" },
          { t: "Le disque n'est pas reconnu ou affiche une erreur", only: ["ps", "xbox"], ico: "❓", suite: "q2" },
          { t: "Le lecteur n'accepte pas ou n'éjecte pas le disque", only: ["ps", "xbox"], ico: "⏏️", res: "ejection" },
          { t: "Le lecteur fait un bruit anormal", only: ["ps", "xbox"], ico: "🔊", res: "bruit-lecteur" },
          { t: "La cartouche n'est pas reconnue", only: ["switch"], ico: "🎴", res: "cartouche" }
        ]
      },
      q2: {
        q: "Le problème touche-t-il un seul disque ou tous les disques ?",
        rep: [
          { t: "Un seul disque", ico: "1️⃣", res: "un-disque" },
          { t: "Tous les disques", ico: "🔁", res: "tous-disques" }
        ]
      }
    },
    resultats: {
      "sans-lecteur": {
        titre: "Console sans lecteur de disque",
        intro: "Certaines consoles sont vendues sans lecteur : ce n'est pas une panne.",
        causes: [["Modèle numérique sans lecteur intégré", "forte"]],
        controles: [
          { t: "Identifier votre modèle", comment: { ps5: "La PS5 Digital Edition d'origine n'a pas de lecteur et ne peut pas en recevoir. Les PS5 Slim Digital et PS5 Pro peuvent accueillir le lecteur détachable officiel de Sony : vérifiez la compatibilité sur le site PlayStation.", xseries: "La Xbox Series S n'a pas de lecteur de disque : les jeux s'installent uniquement par téléchargement.", xone: "La Xbox One S All-Digital n'a pas de lecteur de disque.", def: "Vérifiez le modèle exact sur l'étiquette ou dans les paramètres de la console." }, outils: "Aucun", niv: 1, attendu: "Vous savez si votre modèle a un lecteur.", ok: "Utilisez les versions numériques des jeux.", ko: "Si votre modèle devrait avoir un lecteur, refaites le diagnostic." }
        ],
        fiches: ["co-lecteur"]
      },
      "un-disque": {
        titre: "Un seul disque n'est pas lu",
        intro: "Si les autres disques fonctionnent, le lecteur est probablement bon : le disque lui-même est le premier suspect.",
        causes: [["Disque sale ou rayé", "forte"], ["Disque incompatible avec la console", "moyenne"], ["Disque fissuré ou défectueux", "moyenne"]],
        controles: [
          { t: "Nettoyer le disque", comment: "Avec un chiffon microfibre propre et sec, essuyez en lignes droites du centre vers l'extérieur (pas en cercle).", outils: "Chiffon microfibre", niv: 1, attendu: "Le disque est lu.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier la compatibilité", comment: { ps5: "La PS5 lit la plupart des jeux PS4 mais pas les jeux PS3 sur disque.", xseries: "La Xbox Series X lit de nombreux jeux Xbox One et une partie des jeux rétrocompatibles : vérifiez la liste officielle.", xone: "Vérifiez que le jeu figure dans la liste de rétrocompatibilité officielle.", ps4: "La PS4 ne lit pas les jeux PS3 ni PS5 sur disque.", def: "Vérifiez que le jeu est bien compatible avec votre console." }, outils: "Aucun", niv: 1, attendu: "Le jeu est compatible.", ok: "Passez au contrôle suivant.", ko: "Le jeu n'est pas compatible avec cette console." },
          { t: "Examiner le disque", comment: "Regardez le disque à la lumière : fissure ou rayure profonde ?", outils: "Lampe", niv: 1, attendu: "Pas de dommage visible.", ok: "Essayez le disque sur une autre console.", ko: "Disque endommagé : n'insérez pas un disque fissuré, il peut se briser dans le lecteur." }
        ],
        fiches: ["co-lecteur"]
      },
      "tous-disques": {
        titre: "Aucun disque n'est lu",
        intro: "Quand tous les disques échouent, le logiciel système ou le lecteur sont en cause. Les solutions logicielles officielles passent en premier.",
        causes: [["Logiciel système ou cache", "moyenne"], ["Lecteur (lentille) encrassé ou défectueux", "moyenne"], ["Console inclinée ou déplacée pendant la lecture", "faible"]],
        controles: [
          { t: "Mettre à jour et redémarrer complètement", comment: ND_TXT.redemarrageComplet, outils: "Connexion Internet", niv: 1, attendu: "Les disques sont lus.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Reconstruire la base de données", only: ["ps"], comment: ND_TXT.modeSansEchec + " Choisissez « Reconstruire la base de données » (vos données ne sont pas effacées, mais l'opération peut être longue).", outils: "Manette et câble USB", niv: 2, attendu: "Les disques sont lus.", ok: "Problème réglé.", ko: "Contactez l'assistance PlayStation." },
          { t: "Effacer le stockage persistant Blu-ray", only: ["xbox"], comment: "Paramètres > Appareils et connexions > Blu-ray > Stockage persistant > Effacer le stockage persistant. Puis redémarrez complètement.", outils: "Aucun", niv: 1, attendu: "Les disques sont lus.", ok: "Problème réglé.", ko: "Contactez l'assistance Xbox." },
          { t: "Vérifier la position de la console", comment: "La console doit être stable, sur une surface plane, et ne pas être déplacée pendant la lecture.", outils: "Aucun", niv: 1, attendu: "Lecture correcte.", ok: "Problème réglé.", ko: "Contactez l'assistance officielle : le lecteur doit être examiné." }
        ],
        avert: ["N'ouvrez pas le lecteur et n'utilisez pas de disque de nettoyage non recommandé par le fabricant."],
        fiches: ["co-lecteur", "co-ps-mode-sans-echec"]
      },
      ejection: {
        titre: "Le disque n'entre pas ou ne sort pas",
        intro: "Un disque coincé ne doit jamais être retiré de force. Les fabricants prévoient des procédures officielles.",
        causes: [["Blocage logiciel", "moyenne"], ["Mécanisme d'éjection bloqué", "moyenne"], ["Disque déjà présent dans le lecteur", "faible"]],
        controles: [
          { t: "Éjecter depuis le menu ou le bouton", comment: { ps: "Utilisez le bouton d'éjection de la console ou l'option d'éjection du menu (sélectionnez le jeu puis Options/Éjecter).", xbox: "Appuyez sur le bouton Éjecter de la console, ou utilisez l'option d'éjection dans le menu.", def: "Utilisez le bouton d'éjection." }, outils: "Aucun", niv: 1, attendu: "Le disque sort.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Redémarrage complet", comment: ND_TXT.redemarrageComplet, outils: "Aucun", niv: 1, attendu: "Le disque peut être éjecté.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Procédure d'éjection manuelle officielle", comment: "Certains modèles disposent d'une éjection manuelle : suivez uniquement la procédure décrite par le fabricant pour votre modèle exact (lien d'assistance en bas du rapport).", outils: "Selon la procédure officielle", niv: 2, attendu: "Le disque est retiré sans dommage.", ok: "Vérifiez ensuite qu'un autre disque est accepté.", ko: "Contactez l'assistance officielle." }
        ],
        avert: ["Ne glissez jamais d'objet (couteau, carte) dans la fente du lecteur."],
        fiches: ["co-lecteur"]
      },
      "bruit-lecteur": {
        titre: "Bruit anormal du lecteur",
        intro: "Un léger bruit de rotation est normal. Un raclement ou des claquements répétés peuvent indiquer un problème mécanique ou un disque abîmé.",
        causes: [["Disque voilé ou mal équilibré", "moyenne"], ["Console inclinée ou instable", "moyenne"], ["Mécanisme du lecteur usé", "moyenne"]],
        controles: [
          { t: "Tester avec un autre disque", comment: "Le bruit apparaît-il avec tous les disques ?", outils: "Un autre disque", niv: 1, attendu: "Bruit seulement avec un disque.", ok: "Ce disque est probablement voilé.", ko: "Passez au contrôle suivant." },
          { t: "Stabiliser la console", comment: "Placez-la sur une surface plane et stable, loin des vibrations.", outils: "Aucun", niv: 1, attendu: "Bruit normal.", ok: "Problème réglé.", ko: "Arrêtez d'utiliser le lecteur et contactez l'assistance (un raclement peut rayer les disques)." }
        ],
        fiches: ["co-lecteur"]
      },
      cartouche: {
        titre: "Cartouche non reconnue",
        intro: "La cartouche ou son emplacement peuvent être en cause, ou un simple blocage logiciel.",
        causes: [["Cartouche mal insérée", "forte"], ["Contacts de la cartouche sales", "moyenne"], ["Logiciel système à mettre à jour", "moyenne"], ["Lecteur de cartouches défectueux", "faible"]],
        controles: [
          { t: "Réinsérer la cartouche", comment: "Retirez-la, puis réinsérez-la à fond, étiquette vers l'avant, console sur l'écran d'accueil.", outils: "Aucun", niv: 1, attendu: "L'icône du jeu apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Redémarrer la console", comment: "Maintenez POWER 3 secondes > Options d'alimentation > Redémarrer.", outils: "Aucun", niv: 1, attendu: "La cartouche est lue.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Tester une autre cartouche", comment: "Une autre cartouche fonctionne-t-elle ?", outils: "Autre jeu", niv: 1, attendu: "L'autre cartouche fonctionne.", ok: "La première cartouche est suspecte : vérifiez ses contacts (sans souffler dessus).", ko: "Mettez la console à jour puis contactez l'assistance Nintendo." }
        ],
        avert: ["Ne soufflez pas dans la fente ni sur la cartouche : l'humidité peut abîmer les contacts."],
        fiches: ["co-lecteur"]
      }
    }
  },

  /* ---------------------------------------------------- 5 */
  {
    id: "c-internet",
    titre: "Problème de connexion Internet",
    icone: "🌐",
    resume: "Connexion impossible, lente ou coupée en ligne.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Les autres appareils (téléphone, PC) ont-ils Internet avec la même box ?",
        rep: [
          { t: "Non, aucun appareil n'a Internet", ico: "❌", res: "box" },
          { t: "Oui, seule la console a un problème", ico: "🎮", suite: "q2" },
          { t: "La connexion marche, mais un jeu en ligne ne fonctionne pas", ico: "🕹️", res: "service" }
        ]
      },
      q2: {
        q: "Comment la console est-elle connectée ?",
        rep: [
          { t: "En Wi-Fi", ico: "📶", res: "wifi" },
          { t: "Par câble Ethernet", ico: "🔌", res: "cable" }
        ]
      }
    },
    resultats: {
      box: {
        titre: "Problème de box ou de ligne",
        intro: "Si aucun appareil n'a Internet, la console n'est très probablement pas en cause.",
        causes: [["Box bloquée", "forte"], ["Incident chez l'opérateur", "moyenne"]],
        controles: [
          { t: "Redémarrer la box", comment: "Débranchez son alimentation environ une minute, rebranchez et patientez jusqu'à ce que les voyants se stabilisent.", outils: "Aucun", niv: 1, attendu: "Internet revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier les incidents opérateur", comment: "Avec les données mobiles de votre téléphone, consultez l'assistance de votre opérateur ou appelez son service client.", outils: "Téléphone", niv: 1, attendu: "Information sur un incident.", ok: "Attendez le rétablissement.", ko: "Contactez le service client." }
        ],
        fiches: ["reseau-box"]
      },
      wifi: {
        titre: "Console en Wi-Fi sans connexion",
        intro: "Le Wi-Fi des consoles est sensible à la distance et aux obstacles. Le test de connexion intégré aide à localiser le problème.",
        causes: [["Signal Wi-Fi trop faible", "forte"], ["Clé Wi-Fi changée ou mal saisie", "moyenne"], ["Blocage temporaire de la console ou de la box", "moyenne"]],
        controles: [
          { t: "Lancer le test de connexion", comment: { ps5: "Paramètres > Réseau > État de la connexion > Tester la connexion Internet.", ps4: "Paramètres > Réseau > Tester la connexion Internet.", xbox: "Paramètres > Général > Paramètres réseau > Tester la connexion réseau.", "switch": "Paramètres de la console > Internet > Tester la connexion." }, outils: "Aucun", niv: 1, attendu: "Le test indique où se situe l'échec.", ok: "Notez le résultat (et le code d'erreur éventuel).", ko: "Passez au contrôle suivant." },
          { t: "Redémarrer box et console", comment: {
              ps: ND_TXT.redemarrageComplet.ps + " Redémarrez aussi la box.",
              xbox: ND_TXT.redemarrageComplet.xbox + " Redémarrez aussi la box.",
              "switch": ND_TXT.redemarrageComplet["switch"] + " Redémarrez aussi la box."
            }, outils: "Aucun", niv: 1, attendu: "Connexion rétablie.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Reconfigurer le Wi-Fi", comment: "Supprimez le réseau enregistré dans la console, puis reconnectez-vous en saisissant la clé Wi-Fi inscrite sur la box.", outils: "Clé Wi-Fi de la box", niv: 1, attendu: "Connexion réussie.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Rapprocher la console ou passer au câble", comment: { "switch": "Rapprochez la console de la box. La Switch OLED a un port réseau sur son dock ; les autres modèles nécessitent un adaptateur réseau USB compatible (la Switch Lite ne peut pas utiliser de câble).", def: "Rapprochez la console de la box ou, idéalement, reliez-la par un câble Ethernet : c'est plus stable pour jouer en ligne." }, outils: "Câble Ethernet", niv: 1, attendu: "Connexion stable.", ok: "Le signal Wi-Fi était insuffisant.", ko: "Contactez l'assistance officielle avec le code d'erreur." }
        ],
        avert: ["Ne communiquez jamais vos identifiants de compte à un site ou une personne qui prétend réparer votre connexion."],
        fiches: ["co-internet", "reseau-wifi"]
      },
      cable: {
        titre: "Console en câble sans connexion",
        intro: "Avec un câble, le câble lui-même et le port de la box sont les premiers suspects.",
        causes: [["Câble Ethernet défectueux ou mal clipsé", "forte"], ["Port de la box", "moyenne"], ["Réglages réseau de la console", "moyenne"]],
        controles: [
          { t: "Vérifier câble et port", comment: "Câble bien clipsé des deux côtés ; essayez un autre câble et un autre port de la box.", outils: "Câble Ethernet de rechange", niv: 1, attendu: "Connexion rétablie.", ok: "Le câble ou le port était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Lancer le test de connexion", comment: { ps5: "Paramètres > Réseau > État de la connexion > Tester la connexion Internet.", ps4: "Paramètres > Réseau > Tester la connexion Internet.", xbox: "Paramètres > Général > Paramètres réseau > Tester la connexion réseau.", "switch": "Paramètres de la console > Internet > Tester la connexion." }, outils: "Aucun", niv: 1, attendu: "Le test réussit.", ok: "Problème réglé.", ko: "Notez le code d'erreur et passez au contrôle suivant." },
          { t: "Reconfigurer la connexion en automatique", comment: "Dans les paramètres réseau de la console, refaites la configuration de la connexion filaire en mode automatique (adresse IP et DNS automatiques).", outils: "Aucun", niv: 1, attendu: "Connexion réussie.", ok: "Problème réglé.", ko: "Redémarrez la box et contactez l'assistance avec le code d'erreur." }
        ],
        fiches: ["co-internet", "reseau-box"]
      },
      service: {
        titre: "Internet fonctionne mais pas le jeu en ligne",
        intro: "Si la connexion est bonne, le problème peut venir du service en ligne, de l'abonnement ou de la configuration réseau (NAT).",
        causes: [["Panne ou maintenance du service en ligne", "forte"], ["Abonnement de jeu en ligne expiré", "moyenne"], ["Type de NAT restrictif", "moyenne"], ["Serveurs du jeu indisponibles", "moyenne"]],
        controles: [
          { t: "Vérifier l'état des services", comment: { ps: "Consultez la page « État du service PSN » sur le site PlayStation.", xbox: "Consultez la page « État de Xbox » sur le site d'assistance Xbox.", "switch": "Consultez la page d'état des services réseau sur le site d'assistance Nintendo." }, outils: "Téléphone ou PC", niv: 1, attendu: "Une panne est signalée.", ok: "Attendez le rétablissement.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier l'abonnement", comment: { ps: "Le jeu en ligne de nombreux titres nécessite un abonnement PlayStation Plus actif.", xbox: "Le jeu en ligne de nombreux titres nécessite un abonnement Game Pass adapté actif.", "switch": "Le jeu en ligne de nombreux titres nécessite un abonnement Nintendo Switch Online actif." }, outils: "Aucun", niv: 1, attendu: "Abonnement actif.", ok: "Passez au contrôle suivant.", ko: "Renouvelez l'abonnement si vous le souhaitez." },
          { t: "Regarder le type de NAT", comment: "Le test de connexion de la console indique le type de NAT. Un NAT strict peut gêner le jeu en ligne : l'UPnP de la box ou une connexion par câble peuvent aider. Consultez la documentation de votre box avant de modifier ses réglages.", outils: "Accès à l'interface de la box", niv: 2, attendu: "NAT ouvert ou modéré.", ok: "Vérifiez les serveurs du jeu (site ou réseaux de l'éditeur).", ko: "Contactez l'assistance de votre opérateur ou de la console." }
        ],
        fiches: ["co-internet"]
      }
    }
  },

  /* ---------------------------------------------------- 6 */
  {
    id: "c-bloque",
    titre: "La console se bloque ou redémarre",
    icone: "🧊",
    resume: "Écran figé, plantages, redémarrages inattendus.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Quand le blocage se produit-il ?",
        rep: [
          { t: "Dans un seul jeu", ico: "🎮", res: "un-jeu" },
          { t: "Dans les menus et dans plusieurs jeux", ico: "📋", res: "systeme" },
          { t: "Depuis une coupure de courant ou un arrêt forcé", ico: "⚡", res: "coupure" },
          { t: "La console s'éteint d'un coup, surtout en jeu", ico: "🔥", aller: "c-surchauffe" }
        ]
      }
    },
    resultats: {
      "un-jeu": {
        titre: "Blocages dans un seul jeu",
        intro: "Si un seul jeu plante, la console est probablement saine : le jeu ou ses données sont les premiers suspects.",
        causes: [["Jeu pas à jour (bug corrigé depuis)", "forte"], ["Données du jeu endommagées", "moyenne"], ["Espace de stockage presque plein", "moyenne"]],
        controles: [
          { t: "Mettre à jour le jeu", comment: "Vérifiez les mises à jour du jeu depuis son menu d'options.", outils: "Connexion Internet", niv: 1, attendu: "Le jeu ne plante plus.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Libérer de l'espace de stockage", comment: "Supprimez des jeux ou captures inutilisés (les sauvegardes peuvent être conservées).", outils: "Aucun", niv: 1, attendu: "Espace libre suffisant.", ok: "Observez le comportement.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier ou réinstaller le jeu", comment: { "switch": "Paramètres de la console > Gestion des données > Gérer les logiciels > le jeu > Vérifier l'intégrité des données.", def: "Supprimez puis réinstallez le jeu. Vérifiez d'abord que vos sauvegardes sont sur le cloud ou qu'elles sont conservées sur la console." }, outils: "Connexion Internet", niv: 1, attendu: "Le jeu fonctionne.", ok: "Problème réglé.", ko: "Consultez le support de l'éditeur du jeu." }
        ],
        fiches: ["co-blocages"]
      },
      systeme: {
        titre: "Blocages généralisés",
        intro: "Quand la console plante partout, le logiciel système, le stockage ou la chaleur sont en cause le plus souvent. Plusieurs causes sont possibles.",
        causes: [["Logiciel système pas à jour", "forte"], ["Stockage plein ou base de données endommagée", "moyenne"], ["Surchauffe", "moyenne"], ["Carte microSD ou stockage externe défectueux", "moyenne"]],
        controles: [
          { t: "Mettre à jour le logiciel système", comment: "Installez la dernière mise à jour depuis les paramètres de la console.", outils: "Connexion Internet", niv: 1, attendu: "Plus de blocage.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Redémarrage complet", comment: ND_TXT.redemarrageComplet, outils: "Aucun", niv: 1, attendu: "Plus de blocage.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Retirer le stockage externe", comment: { "switch": "Éteignez la console et retirez la carte microSD, puis testez.", def: "Débranchez le disque externe éventuel, puis testez." }, outils: "Aucun", niv: 1, attendu: "Plus de blocage sans le stockage externe.", ok: "Le stockage externe est suspect : sauvegardez-le et remplacez-le.", ko: "Passez au contrôle suivant." },
          { t: "Reconstruire la base de données", only: ["ps"], comment: ND_TXT.modeSansEchec + " Choisissez « Reconstruire la base de données » (sans suppression de vos jeux ni sauvegardes).", outils: "Manette et câble USB", niv: 2, attendu: "Console plus stable.", ok: "Problème réglé.", ko: "Contactez l'assistance PlayStation avant toute initialisation." },
          { t: "Réinitialiser en conservant les jeux", only: ["xbox"], comment: "Paramètres > Système > Infos sur la console > Réinitialiser la console > « Réinitialiser et conserver mes jeux et applications ».", outils: "Aucun", niv: 2, attendu: "Console plus stable.", ok: "Problème réglé.", ko: "Contactez l'assistance Xbox avant une réinitialisation complète." },
          { t: "Initialiser sans effacer les sauvegardes", only: ["switch"], comment: ND_TXT.maintenanceSwitch + " Choisissez « Initialiser la console sans effacer les données de sauvegarde ». Lisez attentivement les avertissements à l'écran : les logiciels devront être retéléchargés.", outils: "Connexion Internet", niv: 2, attendu: "Console plus stable.", ok: "Retéléchargez vos jeux.", ko: "Contactez l'assistance Nintendo." }
        ],
        sauvegarde: true,
        avert: ["Avant toute réinitialisation, vérifiez que vos sauvegardes sont synchronisées en ligne (si votre abonnement le permet) ou copiées sur un support externe."],
        fiches: ["co-blocages", "co-ps-mode-sans-echec", "co-surchauffe"]
      },
      coupure: {
        titre: "Problèmes après une coupure de courant",
        intro: "Une coupure pendant le fonctionnement peut endommager des données de la console. Les outils de réparation officiels sont à essayer en premier.",
        causes: [["Données système ou base de données endommagées", "forte"], ["Mise à jour interrompue", "moyenne"], ["Dommage électrique (plus rare)", "faible"]],
        controles: [
          { t: "Redémarrage complet", comment: ND_TXT.redemarrageComplet, outils: "Aucun", niv: 1, attendu: "La console fonctionne.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Outils de réparation officiels", comment: { ps: ND_TXT.modeSansEchec + " Essayez « Reconstruire la base de données ».", xone: ND_TXT.depannageXbox.xone, xseries: ND_TXT.depannageXbox.xseries, "switch": ND_TXT.maintenanceSwitch + " Choisissez « Mettre à jour la console »." }, outils: { ps: "Manette et câble USB", def: "Aucun" }, niv: 2, attendu: "La console fonctionne.", ok: "Problème réglé.", ko: "Contactez l'assistance officielle." }
        ],
        avert: ["Évitez de débrancher la console en fonctionnement. Un parafoudre peut la protéger des surtensions."],
        fiches: ["co-blocages", "co-ps-mode-sans-echec"]
      }
    }
  },

  /* ---------------------------------------------------- 7 */
  {
    id: "c-manette",
    titre: "La manette ne se connecte plus",
    icone: "🕹️",
    resume: "Manette éteinte, non reconnue, déconnexions ou stick qui dérive.",
    debut: "q1",
    noeuds: {
      q1: {
        q: { "switch": "Quel est le problème avec la manette (Joy-Con ou manette Pro) ?", def: "Quel est le problème avec la manette ?" },
        rep: [
          { t: "Elle ne s'allume pas", sous: "Aucun voyant", ico: "🔋", res: "alimentation" },
          { t: "Elle s'allume mais ne se connecte pas", ico: "🔗", res: "appairage" },
          { t: "Elle se déconnecte souvent", ico: "📉", res: "deconnexions" },
          { t: "Un stick bouge tout seul (dérive / « drift »)", ico: "🎯", res: "derive" }
        ]
      }
    },
    resultats: {
      alimentation: {
        titre: "La manette ne s'allume pas",
        intro: "Batterie vide, piles usées ou câble de charge défectueux sont les causes les plus courantes.",
        causes: [[{ xbox: "Piles usées ou batterie rechargeable vide", def: "Batterie vide" }, "forte"], ["Câble de charge défectueux (ou câble de charge seulement)", "moyenne"], ["Manette bloquée", "moyenne"], ["Batterie usée ou manette en panne", "moyenne"]],
        controles: [
          { t: { xbox: "Changer les piles", def: "Charger la manette" }, comment: { ps: "Branchez la manette à la console allumée ou à un chargeur USB avec un câble qui transmet les données, pendant au moins 30 minutes.", xbox: "Mettez des piles neuves (ou rechargez la batterie). Vérifiez le sens des piles.", "switch": "Fixez les Joy-Con à la console posée dans le dock ou branchée au chargeur. Pour la manette Pro, chargez-la avec un câble USB-C." }, outils: { xbox: "Piles neuves", def: "Câble USB adapté" }, niv: 1, attendu: "Un voyant s'allume.", ok: "Laissez charger complètement.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser la manette", comment: { ps: "Manette éteinte : dans le petit trou au dos (près de la gâchette L2), appuyez quelques secondes avec un trombone déplié. Puis reliez-la à la console en USB et appuyez sur la touche PS.", xbox: "Maintenez le bouton Xbox de la manette environ 6 secondes pour l'éteindre, puis rallumez-la.", "switch": "Appuyez une fois sur le bouton SYNC de la manette, puis réessayez de la recharger ou de la fixer à la console." }, outils: { ps: "Trombone déplié", def: "Aucun" }, niv: 1, attendu: "La manette s'allume.", ok: "Problème réglé.", ko: "Contactez l'assistance officielle (garantie)." }
        ],
        fiches: ["co-manette"]
      },
      appairage: {
        titre: "La manette s'allume mais ne se connecte pas",
        intro: "Il faut souvent refaire l'appairage entre la manette et la console.",
        causes: [["Manette appairée à un autre appareil", "forte"], ["Appairage perdu après une mise à jour ou un changement de console", "moyenne"], ["Manette à mettre à jour", "moyenne"]],
        controles: [
          { t: "Refaire l'appairage", comment: { ps: "Reliez la manette à la console avec un câble USB qui transmet les données, puis appuyez sur la touche PS.", xbox: "Appuyez brièvement sur le bouton Couplage de la console, puis maintenez le bouton Couplage de la manette jusqu'à ce que le bouton Xbox clignote rapidement. Il devient fixe une fois connecté. (Vous pouvez aussi la relier en USB.)", "switch": "Fixez les Joy-Con sur la console : ils s'appairent automatiquement. Ou, depuis l'écran d'accueil : Manettes > Changer style/ordre, puis appuyez sur L + R de la manette." }, outils: { ps: "Câble USB", def: "Aucun" }, niv: 1, attendu: "La manette se connecte.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser la manette", comment: { ps: "Trou de réinitialisation au dos (près de L2) : appuyez quelques secondes avec un trombone, puis reconnectez en USB.", xbox: "Éteignez la manette (bouton Xbox 6 secondes), retirez les piles quelques secondes, puis recommencez l'appairage.", "switch": "Appuyez une fois sur SYNC, puis recommencez l'appairage." }, outils: { ps: "Trombone", def: "Aucun" }, niv: 1, attendu: "La manette se connecte.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Mettre à jour la manette", comment: { ps: "La mise à jour de la manette est proposée par la console une fois la manette branchée (PS5 : Paramètres > Accessoires).", xbox: "Paramètres > Appareils et connexions > Accessoires > la manette > Mettre à jour.", "switch": "Paramètres de la console > Manettes et accessoires > Mettre à jour les manettes." }, outils: "Connexion Internet", niv: 1, attendu: "Manette à jour.", ok: "Retentez l'appairage.", ko: "Testez une autre manette : si elle fonctionne, la première est probablement défectueuse." }
        ],
        fiches: ["co-manette"]
      },
      deconnexions: {
        titre: "Déconnexions fréquentes",
        intro: "Les manettes sans fil sont sensibles à la distance, aux obstacles et aux interférences.",
        causes: [["Batterie faible", "forte"], ["Distance ou obstacles", "moyenne"], ["Interférences (autres appareils sans fil)", "moyenne"], ["Manette à mettre à jour", "moyenne"]],
        controles: [
          { t: "Charger et se rapprocher", comment: "Manette chargée, sans obstacle (meuble métallique, console enfermée) entre elle et la console.", outils: "Aucun", niv: 1, attendu: "Connexion stable.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Éloigner les sources d'interférences", comment: "Éloignez la console des autres appareils sans fil (box, micro-ondes, enceintes Bluetooth).", outils: "Aucun", niv: 1, attendu: "Moins de déconnexions.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Mettre à jour la manette", comment: "Depuis les paramètres d'accessoires de la console.", outils: "Connexion Internet", niv: 1, attendu: "Connexion stable.", ok: "Problème réglé.", ko: "Testez avec un câble : si le problème disparaît, la partie sans fil de la manette peut être en cause." }
        ],
        fiches: ["co-manette"]
      },
      derive: {
        titre: "Stick qui bouge tout seul",
        intro: "La dérive des sticks est souvent liée à l'usure ou à la poussière. Certaines consoles proposent un étalonnage.",
        causes: [["Usure du mécanisme du stick", "forte"], ["Poussière sous le stick", "moyenne"], ["Calibrage décalé", "moyenne"]],
        controles: [
          { t: "Étalonner les sticks", only: ["switch"], comment: "Paramètres de la console > Manettes et accessoires > Calibrer les sticks.", outils: "Aucun", niv: 1, attendu: "Plus de dérive.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Mettre à jour la manette", comment: "Depuis les paramètres d'accessoires de la console.", outils: "Connexion Internet", niv: 1, attendu: "Plus de dérive.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Souffler autour du stick", comment: "Manette éteinte : soufflez quelques impulsions d'air sec autour de la base du stick en le faisant tourner.", outils: "Bombe d'air sec", niv: 1, attendu: "Dérive réduite.", ok: "Problème réglé.", ko: "Vérifiez la garantie et contactez l'assistance officielle ou un réparateur." }
        ],
        avert: ["Le remplacement d'un stick demande souvent de la soudure : faites-le faire par un professionnel si vous n'êtes pas équipé."],
        fiches: ["co-manette"]
      }
    }
  }
];
