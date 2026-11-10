/* =========================================================
   Nicotch — arbres de diagnostic PC
   ---------------------------------------------------------
   Structure d'un problème :
     id, titre, icone, resume, debut (id de la première question)
     noeuds    : les questions  { q, aide, rep: [ { t, sous, ico, suite | res | aller } ] }
                 suite = question suivante, res = résultat, aller = autre problème
     resultats : { titre, intro, causes: [[texte, "forte"|"moyenne"|"faible"]],
                   controles: [{ t, comment, outils, niv (1 à 3), attendu, ok, ko }],
                   avert: [...], sauvegarde: true/false, pro: "...", fiches: [ids] }
   ========================================================= */
window.ND_DIAG = window.ND_DIAG || {};

window.ND_DIAG.pc = [
  /* ---------------------------------------------------- 1 */
  {
    id: "pc-demarre-pas",
    titre: "Le PC ne démarre plus",
    icone: "⚡",
    resume: "Rien ne se passe, ou le PC s'allume puis s'arrête aussitôt.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Quand vous appuyez sur le bouton de démarrage, que se passe-t-il ?",
        aide: "Observez bien : voyants, ventilateurs, bruits. Ne touchez à rien à l'intérieur pour l'instant.",
        rep: [
          { t: "Absolument rien", sous: "Aucun voyant, aucun ventilateur, aucun bruit", ico: "⛔", suite: "q2" },
          { t: "Les ventilateurs tournent une seconde puis tout s'arrête", ico: "🔁", res: "coupure" },
          { t: "Le PC émet des bips ou un voyant de diagnostic s'allume", sous: "Voyants marqués CPU, DRAM, VGA ou BOOT sur certaines cartes mères", ico: "🔔", res: "bips" },
          { t: "Les ventilateurs tournent mais l'écran reste noir", ico: "🖥️", aller: "pc-ecran-noir" }
        ]
      },
      q2: {
        q: "Quel type d'ordinateur ?",
        rep: [
          { t: "PC fixe (tour)", ico: "🖥️", suite: "q3" },
          { t: "PC portable", ico: "💻", res: "portable" }
        ]
      },
      q3: {
        q: "Avez-vous vérifié l'alimentation secteur ?",
        aide: "Prise testée avec un autre appareil (une lampe par exemple), câble bien enfoncé des deux côtés, interrupteur à l'arrière de l'alimentation sur « I ».",
        rep: [
          { t: "Oui, tout est vérifié et rien ne se passe", ico: "✅", res: "fixe" },
          { t: "Non, ou je ne suis pas sûr", ico: "❓", res: "secteur" }
        ]
      }
    },
    resultats: {
      secteur: {
        titre: "Commencez par l'alimentation électrique",
        intro: "Avant de soupçonner une pièce, il faut écarter les causes simples : elles sont fréquentes et ne coûtent rien.",
        causes: [
          ["Prise, multiprise ou parafoudre éteint ou défectueux", "forte"],
          ["Interrupteur de l'alimentation du PC sur « O »", "forte"],
          ["Câble d'alimentation abîmé ou mal enfoncé", "moyenne"]
        ],
        controles: [
          { t: "Tester la prise murale", comment: "Branchez une lampe ou un chargeur de téléphone sur la même prise.", outils: "Un autre appareil électrique", niv: 1, attendu: "L'appareil fonctionne : la prise est bonne.", ok: "Passez au contrôle suivant.", ko: "Changez de prise et réessayez le PC." },
          { t: "Brancher le PC directement au mur", comment: "Retirez temporairement la multiprise ou le parafoudre.", outils: "Aucun", niv: 1, attendu: "Le PC démarre s'il s'agissait de la multiprise.", ok: "Remplacez la multiprise.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier l'interrupteur et le câble", comment: "À l'arrière de la tour, l'interrupteur de l'alimentation doit être sur « I ». Échangez le câble avec celui de l'écran (ils sont souvent identiques).", outils: "Un câble d'alimentation de rechange", niv: 1, attendu: "Le PC réagit avec l'autre câble.", ok: "Le câble était en cause : remplacez-le.", ko: "Refaites le diagnostic en répondant « Oui, tout est vérifié »." }
        ],
        avert: ["Ne branchez jamais un câble abîmé ou dont la gaine est coupée."],
        fiches: ["pc-pas-de-courant"]
      },
      fixe: {
        titre: "PC fixe sans aucun signe de vie",
        intro: "Le courant arrive à la prise mais le PC ne réagit pas. Plusieurs causes sont possibles : on les écarte une par une, de la plus simple à la plus technique.",
        causes: [
          ["Bloc d'alimentation du PC défaillant", "forte"],
          ["Électricité résiduelle ou protection déclenchée", "moyenne"],
          ["Câble du bouton de démarrage débranché ou bouton défectueux", "moyenne"],
          ["Carte mère défaillante", "faible"]
        ],
        controles: [
          { t: "Vider l'électricité résiduelle", comment: "Débranchez le câble secteur, appuyez sur le bouton de démarrage pendant 15 à 30 secondes, attendez une minute puis rebranchez.", outils: "Aucun", niv: 1, attendu: "Le PC redémarre normalement.", ok: "Problème réglé. Si cela se reproduit souvent, surveillez l'alimentation.", ko: "Passez au contrôle suivant." },
          { t: "Débrancher tous les périphériques", comment: "Ne laissez que le câble secteur (retirez USB, imprimante, disques externes…). Un périphérique en court-circuit peut empêcher le démarrage.", outils: "Aucun", niv: 1, attendu: "Le PC démarre sans les périphériques.", ok: "Rebranchez-les un par un pour trouver le fautif.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier les connecteurs d'alimentation internes", comment: "PC éteint et débranché, ouvrez le panneau latéral. Vérifiez que le gros connecteur 24 broches de la carte mère et le connecteur 4/8 broches du processeur sont bien enfoncés. Touchez une partie métallique du boîtier avant de manipuler.", outils: "Tournevis cruciforme, lampe", niv: 2, attendu: "Un connecteur était mal enfoncé : le PC démarre une fois remis en place.", ok: "Refermez le boîtier.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le câble du bouton de démarrage", comment: "Le petit connecteur « POWER SW » relie le bouton de façade à la carte mère. Comparez sa position avec le manuel de votre carte mère.", outils: "Manuel de la carte mère (site du fabricant)", niv: 3, attendu: "Le connecteur était décalé ou débranché.", ok: "Remettez-le à la bonne place.", ko: "Passez au contrôle suivant." },
          { t: "Tester l'alimentation", comment: "Avec un testeur d'alimentation ATX ou une alimentation de remplacement compatible (puissance suffisante, mêmes connecteurs).", outils: "Testeur d'alimentation ATX ou alimentation de prêt", niv: 3, attendu: "Avec une autre alimentation, le PC démarre.", ok: "L'alimentation d'origine est très probablement en cause : remplacez-la par un modèle de qualité.", ko: "La carte mère est alors suspecte : faites vérifier le PC par un professionnel." }
        ],
        avert: [
          "N'ouvrez jamais le bloc d'alimentation : ses condensateurs peuvent rester chargés et provoquer une électrocution, même débranché.",
          "Odeur de brûlé, fumée ou bruit d'étincelle : débranchez immédiatement et ne réessayez pas."
        ],
        pro: "Si aucun contrôle ne donne de résultat, ou si vous n'êtes pas à l'aise pour ouvrir le PC, confiez-le à un réparateur.",
        fiches: ["pc-pas-de-courant", "pc-alim-securite"]
      },
      portable: {
        titre: "PC portable qui ne s'allume plus",
        intro: "Sur un portable, la cause la plus fréquente est le chargeur ou une batterie complètement vide. Plusieurs causes restent possibles.",
        causes: [
          ["Chargeur ou câble défectueux", "forte"],
          ["Batterie totalement déchargée ou usée", "forte"],
          ["Blocage électronique (électricité résiduelle)", "moyenne"],
          ["Connecteur de charge ou carte mère endommagés", "faible"]
        ],
        controles: [
          { t: "Vérifier le chargeur", comment: "Le voyant du chargeur (s'il en a un) doit s'allumer. Vérifiez les deux câbles et la prise murale.", outils: "Aucun", niv: 1, attendu: "Le voyant de charge du portable s'allume.", ok: "Laissez charger au moins 30 minutes avant de rallumer.", ko: "Testez un autre chargeur compatible (même tension et puissance suffisante) si vous en avez un." },
          { t: "Réinitialisation matérielle", comment: "Débranchez le chargeur. Si la batterie est amovible, retirez-la. Maintenez le bouton de démarrage 30 secondes, rebranchez le chargeur (sans la batterie si possible) et allumez.", outils: "Aucun", niv: 1, attendu: "Le portable démarre.", ok: "Remettez la batterie, puis testez.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier l'état de la batterie et du connecteur", comment: "Regardez si le portable est déformé (batterie gonflée) et si la prise de charge bouge ou semble abîmée.", outils: "Lampe", niv: 1, attendu: "Aucune déformation, connecteur ferme.", ok: "La cause est probablement électronique : faites diagnostiquer l'appareil.", ko: "Batterie gonflée ou connecteur abîmé : arrêtez d'utiliser le portable et consultez un professionnel." }
        ],
        avert: ["Une batterie gonflée présente un risque d'incendie : ne la percez pas, ne la chargez plus, faites-la remplacer."],
        pro: "Si le portable est encore sous garantie, contactez d'abord le fabricant.",
        fiches: ["portable-batterie"]
      },
      coupure: {
        titre: "Le PC démarre une seconde puis s'arrête",
        intro: "Ce comportement indique souvent que l'alimentation se met en protection, par exemple à cause d'un court-circuit ou d'un composant mal installé. La cause exacte demande des vérifications.",
        causes: [
          ["Protection de l'alimentation déclenchée (court-circuit, périphérique défectueux)", "forte"],
          ["Composant mal installé (après un montage ou une mise à niveau)", "moyenne"],
          ["Alimentation fatiguée ou insuffisante", "moyenne"],
          ["Carte mère ou processeur défaillant", "faible"]
        ],
        controles: [
          { t: "Débrancher tous les périphériques", comment: "Laissez seulement le câble secteur, puis essayez de démarrer.", outils: "Aucun", niv: 1, attendu: "Le PC reste allumé.", ok: "Rebranchez les périphériques un par un pour trouver le fautif.", ko: "Passez au contrôle suivant." },
          { t: "Annuler la dernière modification matérielle", comment: "Si vous avez ajouté ou changé une pièce récemment, remettez l'ancienne configuration (PC débranché).", outils: "Tournevis cruciforme", niv: 2, attendu: "Le PC démarre avec l'ancienne configuration.", ok: "La nouvelle pièce est incompatible, mal installée ou défectueuse.", ko: "Passez au contrôle suivant." },
          { t: "Tester en configuration minimale", comment: "PC débranché : gardez seulement carte mère, processeur avec son ventirad, une barrette de mémoire et l'alimentation. Débranchez disques et carte graphique si le processeur a une sortie vidéo intégrée.", outils: "Tournevis, bracelet antistatique conseillé", niv: 3, attendu: "Le PC reste allumé en configuration minimale.", ok: "Remettez les pièces une par une pour isoler la pièce fautive.", ko: "Alimentation ou carte mère suspectes : testez avec une autre alimentation ou consultez un professionnel." }
        ],
        avert: ["Si vous sentez une odeur de brûlé, arrêtez immédiatement et ne réessayez pas de démarrer."],
        pro: "La configuration minimale demande de l'expérience : en cas de doute, faites appel à un réparateur.",
        fiches: ["pc-pas-de-courant", "pc-alim-securite"]
      },
      bips: {
        titre: "Bips ou voyant de diagnostic au démarrage",
        intro: "La carte mère signale un problème matériel. La signification des bips et des voyants dépend du fabricant : il faut consulter le manuel de votre carte mère, pas une liste générique.",
        causes: [
          ["Mémoire vive (RAM) mal insérée ou défectueuse", "forte"],
          ["Carte graphique mal insérée ou non alimentée", "moyenne"],
          ["Problème processeur ou carte mère", "faible"]
        ],
        controles: [
          { t: "Noter le signal exact", comment: "Comptez les bips (longs/courts) ou notez quel voyant reste allumé (CPU, DRAM, VGA, BOOT).", outils: "Papier et crayon", niv: 1, attendu: "Vous avez un code précis.", ok: "Cherchez ce code dans le manuel de la carte mère (site du fabricant).", ko: "Si rien n'est clair, passez au contrôle suivant." },
          { t: "Réinsérer la mémoire vive", comment: "PC débranché, touchez le boîtier métallique, retirez les barrettes et réinsérez-les fermement jusqu'au clic. Essayez ensuite avec une seule barrette, dans l'emplacement recommandé par le manuel.", outils: "Tournevis cruciforme", niv: 2, attendu: "Les bips disparaissent.", ok: "Si une barrette seule fonctionne et pas l'autre, la barrette en question est suspecte.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier la carte graphique", comment: "PC débranché, vérifiez qu'elle est bien enfoncée et que ses câbles d'alimentation PCIe sont branchés.", outils: "Tournevis cruciforme", niv: 2, attendu: "Le voyant VGA s'éteint et l'image revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser le BIOS (CMOS)", comment: "Suivez la méthode indiquée dans le manuel de votre carte mère (bouton « Clear CMOS », cavalier ou retrait de la pile pendant quelques minutes, PC débranché).", outils: "Manuel de la carte mère", niv: 3, attendu: "Le PC démarre avec les réglages d'usine.", ok: "Refaites vos réglages BIOS un par un si nécessaire.", ko: "Faites tester la mémoire et la carte mère par un professionnel." }
        ],
        avert: ["Ne manipulez jamais les composants PC branché."],
        fiches: ["pc-bips-ram", "pc-pas-de-courant"]
      }
    }
  },

  /* ---------------------------------------------------- 2 */
  {
    id: "pc-ecran-noir",
    titre: "Le PC démarre mais l'écran reste noir",
    icone: "🖥️",
    resume: "Les ventilateurs tournent, mais aucune image n'apparaît.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Que montre l'écran ?",
        rep: [
          { t: "Un message « Aucun signal » / « No signal »", sous: "Ou l'écran se met en veille", ico: "📡", suite: "q2" },
          { t: "Rien du tout, l'écran semble éteint", sous: "Aucun voyant sur l'écran", ico: "⚫", res: "ecran-alim" },
          { t: "Le logo du fabricant ou de Windows apparaît, puis écran noir", ico: "🪟", suite: "q3" },
          { t: "C'est un PC portable : écran noir mais il semble allumé", ico: "💻", res: "portable" }
        ]
      },
      q2: {
        q: "Votre PC fixe possède-t-il une carte graphique dédiée ?",
        aide: "Regardez l'arrière de la tour : une carte graphique dédiée a ses prises vidéo (HDMI, DisplayPort) alignées à l'horizontale, plus bas que les prises de la carte mère.",
        rep: [
          { t: "Oui", ico: "🎮", res: "gpu" },
          { t: "Non, ou je ne sais pas", ico: "❓", res: "signal" }
        ]
      },
      q3: {
        q: "Voyez-vous le curseur de la souris sur l'écran noir ?",
        rep: [
          { t: "Oui, le curseur est visible", ico: "🖱️", res: "explorateur" },
          { t: "Non, tout est noir", ico: "⚫", res: "apres-logo" }
        ]
      }
    },
    resultats: {
      "ecran-alim": {
        titre: "L'écran lui-même ne s'allume pas",
        intro: "Si l'écran n'affiche ni voyant ni message, le problème peut venir de l'écran plutôt que du PC.",
        causes: [["Écran non alimenté ou éteint", "forte"], ["Câble d'alimentation de l'écran", "moyenne"], ["Écran en panne", "faible"]],
        controles: [
          { t: "Vérifier l'alimentation de l'écran", comment: "Câble secteur bien branché des deux côtés, bouton marche de l'écran, prise testée.", outils: "Aucun", niv: 1, attendu: "Le voyant de l'écran s'allume.", ok: "Refaites le diagnostic si l'image ne vient toujours pas.", ko: "Passez au contrôle suivant." },
          { t: "Tester l'écran avec un autre appareil", comment: "Branchez une console, un autre PC ou un portable sur cet écran.", outils: "Un autre appareil avec sortie vidéo", niv: 1, attendu: "L'écran affiche l'image de l'autre appareil.", ok: "L'écran fonctionne : le problème vient du PC ou du câble vidéo.", ko: "L'écran est probablement en cause (alimentation interne ou dalle)." }
        ],
        avert: ["N'ouvrez pas un écran : son alimentation interne présente un risque électrique."],
        fiches: ["ecran-pas-de-signal"]
      },
      gpu: {
        titre: "« Aucun signal » avec une carte graphique dédiée",
        intro: "Cas très fréquent : le câble vidéo est branché sur la carte mère au lieu de la carte graphique. D'autres causes sont possibles.",
        causes: [
          ["Câble branché sur la sortie vidéo de la carte mère", "forte"],
          ["Mauvaise source sélectionnée sur l'écran", "forte"],
          ["Câble vidéo ou port défectueux", "moyenne"],
          ["Carte graphique mal alimentée ou mal insérée", "moyenne"],
          ["Mémoire vive mal insérée", "faible"]
        ],
        controles: [
          { t: "Brancher le câble sur la carte graphique", comment: "Branchez l'écran sur une prise de la carte graphique (les prises horizontales, en bas), pas sur celles de la carte mère.", outils: "Aucun", niv: 1, attendu: "L'image apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Choisir la bonne source sur l'écran", comment: "Avec les boutons de l'écran, sélectionnez l'entrée correspondant au câble (HDMI 1, DisplayPort…).", outils: "Aucun", niv: 1, attendu: "L'image apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Changer de câble et de port", comment: "Essayez un autre câble et une autre sortie de la carte graphique.", outils: "Un câble HDMI ou DisplayPort de rechange", niv: 1, attendu: "L'image revient avec l'autre câble ou port.", ok: "Remplacez le câble ou évitez le port défectueux.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier l'alimentation de la carte graphique", comment: "PC éteint et débranché, vérifiez que les câbles PCIe (6 ou 8 broches) sont bien branchés sur la carte et qu'elle est bien enfoncée.", outils: "Tournevis cruciforme", niv: 2, attendu: "Après remise en place, l'image revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinsérer la mémoire vive", comment: "PC débranché, retirez et réinsérez les barrettes de RAM jusqu'au clic.", outils: "Tournevis cruciforme", niv: 2, attendu: "L'image revient.", ok: "Une barrette était mal insérée.", ko: "Faites tester la carte graphique sur un autre PC ou par un professionnel." }
        ],
        fiches: ["ecran-pas-de-signal", "pc-bips-ram"]
      },
      signal: {
        titre: "« Aucun signal » sans carte graphique dédiée",
        intro: "L'écran est allumé mais ne reçoit rien. Les vérifications de connexion passent avant tout le reste.",
        causes: [
          ["Mauvaise source sélectionnée sur l'écran", "forte"],
          ["Câble vidéo débranché ou défectueux", "forte"],
          ["Mémoire vive mal insérée", "moyenne"],
          ["Carte graphique dédiée présente sans le savoir", "moyenne"]
        ],
        controles: [
          { t: "Choisir la bonne source sur l'écran", comment: "Sélectionnez l'entrée qui correspond au câble branché.", outils: "Aucun", niv: 1, attendu: "L'image apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier toutes les prises vidéo du PC", comment: "S'il y a des prises vidéo plus bas à l'arrière, c'est qu'une carte graphique est présente : branchez-vous dessus.", outils: "Lampe", niv: 1, attendu: "L'image apparaît sur l'autre prise.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Changer de câble", comment: "Testez un autre câble vidéo, ou le même câble avec un autre appareil.", outils: "Câble de rechange", niv: 1, attendu: "L'image revient.", ok: "Le câble était défectueux.", ko: "Passez au contrôle suivant." },
          { t: "Réinsérer la mémoire vive", comment: "PC débranché, retirez et réinsérez les barrettes de RAM.", outils: "Tournevis cruciforme", niv: 2, attendu: "L'image revient.", ok: "Une barrette était mal insérée.", ko: "Consultez un professionnel." }
        ],
        fiches: ["ecran-pas-de-signal"]
      },
      explorateur: {
        titre: "Écran noir avec curseur après le démarrage de Windows",
        intro: "Windows démarre mais le bureau ne s'affiche pas. Souvent un problème logiciel (Explorateur Windows, pilote graphique). Plusieurs causes sont possibles.",
        causes: [["L'Explorateur Windows ne s'est pas lancé", "forte"], ["Pilote graphique en défaut", "moyenne"], ["Mise à jour ou logiciel récent problématique", "moyenne"], ["Logiciel malveillant", "faible"]],
        controles: [
          { t: "Réinitialiser le pilote graphique", comment: "Appuyez en même temps sur Windows + Ctrl + Maj + B. L'écran clignote brièvement.", outils: "Clavier", niv: 1, attendu: "Le bureau apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Relancer l'Explorateur Windows", comment: "Appuyez sur Ctrl + Alt + Suppr, ouvrez le Gestionnaire des tâches, puis « Exécuter une nouvelle tâche », tapez explorer.exe et validez.", outils: "Clavier", niv: 2, attendu: "Le bureau et la barre des tâches apparaissent.", ok: "Redémarrez ensuite le PC et vérifiez que cela tient.", ko: "Passez au contrôle suivant." },
          { t: "Désinstaller le dernier changement", comment: "Si le problème suit une mise à jour ou l'installation d'un logiciel, utilisez la restauration du système ou désinstallez la mise à jour depuis l'environnement de récupération Windows.", outils: "Aucun", niv: 2, attendu: "Windows redémarre normalement.", ok: "Évitez de réinstaller le logiciel en cause.", ko: "Démarrez en mode sans échec et réinstallez le pilote graphique depuis le site du fabricant." }
        ],
        sauvegarde: true,
        fiches: ["win-mode-sans-echec", "ecran-pas-de-signal"]
      },
      "apres-logo": {
        titre: "Écran noir après le logo de démarrage",
        intro: "Le PC démarre (le logo s'affiche) donc le matériel vidéo fonctionne au moins au démarrage. Le problème est souvent logiciel, mais ce n'est pas certain.",
        causes: [["Pilote graphique défaillant ou récent", "forte"], ["Affichage envoyé vers un autre écran", "moyenne"], ["Problème de démarrage de Windows", "moyenne"]],
        controles: [
          { t: "Réinitialiser le pilote graphique", comment: "Appuyez sur Windows + Ctrl + Maj + B.", outils: "Clavier", niv: 1, attendu: "L'image revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Changer le mode d'affichage", comment: "Appuyez sur Windows + P, puis sur la flèche du bas et Entrée, plusieurs fois avec une pause entre chaque essai (cela fait défiler les modes d'affichage).", outils: "Clavier", niv: 1, attendu: "L'image apparaît sur l'écran principal.", ok: "Réglez ensuite le mode « PC uniquement » ou « Dupliquer ».", ko: "Passez au contrôle suivant." },
          { t: "Démarrer en mode sans échec", comment: "Interrompez trois fois de suite le démarrage (bouton maintenu dès que le logo apparaît) : Windows ouvre l'environnement de récupération. Choisissez Dépannage > Options avancées > Paramètres de démarrage > Redémarrer, puis le mode sans échec.", outils: "Aucun", niv: 2, attendu: "Windows démarre en basse résolution.", ok: "Désinstallez le pilote graphique depuis le Gestionnaire de périphériques puis installez la dernière version depuis le site du fabricant (NVIDIA, AMD, Intel).", ko: "Utilisez la réparation du démarrage ou la restauration du système depuis le même menu." }
        ],
        sauvegarde: true,
        avert: ["Les arrêts forcés répétés sont sans danger pour le matériel, mais évitez-les pendant une mise à jour en cours."],
        fiches: ["win-mode-sans-echec"]
      },
      portable: {
        titre: "PC portable allumé mais écran noir",
        intro: "Il faut savoir si l'image est produite mais pas affichée (écran, rétroéclairage) ou si le portable ne produit pas d'image du tout.",
        causes: [["Luminosité au minimum ou écran désactivé", "forte"], ["Pilote graphique", "moyenne"], ["Dalle, rétroéclairage ou nappe d'écran défectueux", "moyenne"]],
        controles: [
          { t: "Augmenter la luminosité", comment: "Utilisez les touches de luminosité (souvent avec la touche Fn).", outils: "Clavier", niv: 1, attendu: "L'image apparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Regarder l'écran avec une lampe", comment: "Éclairez l'écran avec une lampe de poche de près : si vous distinguez une image très sombre, c'est le rétroéclairage qui ne fonctionne plus.", outils: "Lampe de poche", niv: 1, attendu: "Image visible très faiblement.", ok: "Rétroéclairage probablement en cause : réparation par un professionnel.", ko: "Passez au contrôle suivant." },
          { t: "Brancher un écran externe", comment: "Reliez le portable à une TV ou un écran en HDMI, puis appuyez sur Windows + P et choisissez « Dupliquer ».", outils: "Câble HDMI, écran ou TV", niv: 1, attendu: "L'image s'affiche sur l'écran externe.", ok: "La carte graphique fonctionne : la dalle ou la nappe est probablement en cause.", ko: "Essayez Windows + Ctrl + Maj + B puis une réinitialisation matérielle (débrancher, maintenir le bouton 30 secondes)." }
        ],
        sauvegarde: true,
        pro: "Le remplacement d'une dalle de portable demande du savoir-faire : faites appel à un réparateur si vous débutez.",
        fiches: ["ecran-pas-de-signal", "portable-batterie"]
      }
    }
  },

  /* ---------------------------------------------------- 3 */
  {
    id: "pc-lent",
    titre: "Le PC est très lent",
    icone: "🐢",
    resume: "Démarrage interminable, programmes qui rament, blocages.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Depuis quand le PC est-il lent ?",
        rep: [
          { t: "Depuis peu", sous: "Après une mise à jour, un nouveau logiciel…", ico: "🆕", suite: "q2" },
          { t: "Progressivement, depuis des mois", ico: "📉", suite: "q3" },
          { t: "Surtout au démarrage", ico: "⏳", res: "demarrage" },
          { t: "Surtout en jeu, avec un ventilateur très bruyant", ico: "🔥", aller: "pc-chauffe" }
        ]
      },
      q2: {
        q: "Voyez-vous des publicités inhabituelles, une page d'accueil changée ou des logiciels inconnus ?",
        rep: [
          { t: "Oui", ico: "⚠️", res: "malveillant" },
          { t: "Non", ico: "✅", res: "changement" }
        ]
      },
      q3: {
        q: "Windows est-il installé sur un disque dur (HDD) ou un SSD ?",
        aide: "Ouvrez le Gestionnaire des tâches (Ctrl + Maj + Échap), onglet Performance : le type « HDD » ou « SSD » est indiqué sous « Disque 0 ».",
        rep: [
          { t: "Disque dur (HDD)", ico: "💿", res: "hdd" },
          { t: "SSD, ou je ne sais pas", ico: "⚡", res: "general" }
        ]
      }
    },
    resultats: {
      general: {
        titre: "Lenteur générale progressive",
        intro: "Une lenteur qui s'installe avec le temps a souvent plusieurs causes cumulées. Le Gestionnaire des tâches permet d'y voir plus clair.",
        causes: [
          ["Trop de programmes lancés au démarrage", "forte"],
          ["Disque presque plein", "forte"],
          ["Mémoire vive (RAM) insuffisante pour l'usage", "moyenne"],
          ["Logiciel malveillant", "moyenne"],
          ["Disque en mauvaise santé ou surchauffe", "faible"]
        ],
        controles: [
          { t: "Observer le Gestionnaire des tâches", comment: "Ctrl + Maj + Échap, onglet Processus : triez par Processeur, Mémoire puis Disque.", outils: "Aucun", niv: 1, attendu: "Vous repérez un programme qui consomme beaucoup.", ok: "Fermez-le ou désinstallez-le s'il est inutile.", ko: "Si la Mémoire est souvent au-dessus de 90 %, la RAM est probablement insuffisante." },
          { t: "Réduire les programmes au démarrage", comment: "Gestionnaire des tâches, onglet « Applications de démarrage » : désactivez ce qui n'est pas indispensable (pas l'antivirus).", outils: "Aucun", niv: 1, attendu: "Démarrage plus rapide au prochain redémarrage.", ok: "Continuez avec le contrôle suivant pour gagner encore.", ko: "Passez au contrôle suivant." },
          { t: "Libérer de l'espace disque", comment: "Paramètres > Système > Stockage. Gardez une bonne marge d'espace libre (au moins 10 à 15 %). Utilisez les recommandations de nettoyage et désinstallez les logiciels inutiles.", outils: "Aucun", niv: 1, attendu: "Espace libre récupéré.", ok: "Le système respire mieux.", ko: "Passez au contrôle suivant." },
          { t: "Faire une analyse antivirus complète", comment: "Sécurité Windows > Protection contre les virus et menaces > Options d'analyse > Analyse complète.", outils: "Microsoft Defender (inclus dans Windows)", niv: 1, attendu: "Aucune menace, ou menaces supprimées.", ok: "Redémarrez et observez.", ko: "Voir la fiche « Logiciels malveillants »." },
          { t: "Vérifier la santé du disque", comment: "Un utilitaire gratuit comme CrystalDiskInfo affiche l'état SMART du disque (Bon / Prudence / Mauvais).", outils: "CrystalDiskInfo (gratuit)", niv: 2, attendu: "État « Bon ».", ok: "Le disque n'est pas en cause.", ko: "État « Prudence » ou « Mauvais » : sauvegardez vos données sans attendre et prévoyez le remplacement." }
        ],
        sauvegarde: true,
        fiches: ["win-lenteur", "win-malware", "stock-sante-disque"]
      },
      hdd: {
        titre: "Windows sur un disque dur mécanique",
        intro: "Avec Windows 10 et 11, un disque dur mécanique (HDD) est très souvent la principale cause de lenteur. Ce n'est pas forcément une panne.",
        causes: [["Disque dur mécanique trop lent pour Windows actuel", "forte"], ["Disque dur vieillissant", "moyenne"], ["Programmes au démarrage, disque plein", "moyenne"]],
        controles: [
          { t: "Vérifier l'utilisation du disque", comment: "Gestionnaire des tâches > Performance > Disque 0 : s'il est souvent à 100 %, le disque est le goulot d'étranglement.", outils: "Aucun", niv: 1, attendu: "Le disque est très sollicité.", ok: "Le passage à un SSD est l'amélioration la plus efficace.", ko: "Voir les autres causes (démarrage, espace disque)." },
          { t: "Vérifier la santé du disque", comment: "Avec CrystalDiskInfo : état SMART du disque.", outils: "CrystalDiskInfo (gratuit)", niv: 2, attendu: "État « Bon ».", ok: "Disque sain mais lent.", ko: "Sauvegardez immédiatement vos données." },
          { t: "Remplacer le disque dur par un SSD", comment: "Cloner l'ancien disque vers un SSD ou réinstaller Windows proprement. Vérifiez la compatibilité (SATA 2,5 pouces ou M.2).", outils: "SSD, câble ou boîtier USB, logiciel de clonage", niv: 3, attendu: "Démarrage et ouverture des programmes nettement plus rapides.", ok: "Gardez l'ancien disque comme stockage ou sauvegarde.", ko: "Faites-vous accompagner si le clonage échoue." }
        ],
        sauvegarde: true,
        avert: ["Avant tout clonage ou réinstallation : sauvegardez vos fichiers sur un autre support."],
        fiches: ["stock-sante-disque", "stock-sauvegarde", "win-lenteur"]
      },
      demarrage: {
        titre: "Démarrage très lent",
        intro: "Une fois démarré le PC fonctionne à peu près normalement. Le démarrage est souvent ralenti par des logiciels ou des mises à jour en attente.",
        causes: [["Trop d'applications de démarrage", "forte"], ["Mises à jour en attente", "moyenne"], ["Disque dur mécanique", "moyenne"]],
        controles: [
          { t: "Désactiver les applications de démarrage inutiles", comment: "Gestionnaire des tâches > Applications de démarrage. Regardez la colonne « Impact ».", outils: "Aucun", niv: 1, attendu: "Moins d'applications à fort impact.", ok: "Redémarrez et comparez.", ko: "Passez au contrôle suivant." },
          { t: "Terminer les mises à jour Windows", comment: "Paramètres > Windows Update : installez les mises à jour puis redémarrez.", outils: "Connexion Internet", niv: 1, attendu: "Plus de mise à jour en attente.", ok: "Redémarrez deux fois et comparez.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le type de disque", comment: "Gestionnaire des tâches > Performance : HDD ou SSD.", outils: "Aucun", niv: 1, attendu: "SSD : le démarrage devrait être rapide.", ok: "Avec un SSD, faites une analyse antivirus.", ko: "Avec un HDD, un passage au SSD est conseillé." }
        ],
        fiches: ["win-lenteur"]
      },
      malveillant: {
        titre: "Lenteur avec signes de logiciel indésirable",
        intro: "Publicités, page d'accueil modifiée ou logiciels inconnus sont des signes possibles de logiciel publicitaire ou malveillant. Une analyse est nécessaire pour le confirmer.",
        causes: [["Logiciel publicitaire ou indésirable installé", "forte"], ["Extension de navigateur malveillante", "forte"], ["Logiciel malveillant plus grave", "moyenne"]],
        controles: [
          { t: "Désinstaller les logiciels inconnus", comment: "Paramètres > Applications > Applications installées : triez par date d'installation et désinstallez ce que vous ne reconnaissez pas (en cas de doute, renseignez-vous avant).", outils: "Aucun", niv: 1, attendu: "Les logiciels suspects sont supprimés.", ok: "Passez au contrôle suivant.", ko: "Si la désinstallation échoue, notez le nom et passez au contrôle suivant." },
          { t: "Nettoyer le navigateur", comment: "Supprimez les extensions inconnues et utilisez l'option de réinitialisation des paramètres du navigateur.", outils: "Aucun", niv: 1, attendu: "Plus de publicités ni de redirection.", ok: "Passez au contrôle suivant.", ko: "Passez au contrôle suivant." },
          { t: "Analyse complète puis analyse hors ligne", comment: "Sécurité Windows > Options d'analyse : lancez une « Analyse complète », puis « Analyse Microsoft Defender hors ligne » (le PC redémarre pour analyser).", outils: "Microsoft Defender", niv: 1, attendu: "Menaces détectées et supprimées.", ok: "Changez ensuite vos mots de passe importants depuis un appareil sain.", ko: "Si le problème persiste, faites appel à un professionnel." }
        ],
        sauvegarde: true,
        avert: ["Ne communiquez jamais vos mots de passe à un site ou à une personne qui vous contacte en se présentant comme un « support technique »."],
        fiches: ["win-malware"]
      },
      changement: {
        titre: "Lenteur apparue après un changement récent",
        intro: "Si la lenteur suit de près une mise à jour, un pilote ou un logiciel, ce changement est un suspect sérieux, sans être une certitude.",
        causes: [["Logiciel récemment installé", "forte"], ["Mise à jour Windows ou pilote récent", "moyenne"], ["Mise à jour en cours en arrière-plan", "moyenne"]],
        controles: [
          { t: "Laisser finir les tâches en arrière-plan", comment: "Après une grosse mise à jour, Windows peut travailler en arrière-plan quelque temps. Laissez le PC allumé et branché.", outils: "Aucun", niv: 1, attendu: "Les performances reviennent.", ok: "Rien de plus à faire.", ko: "Passez au contrôle suivant." },
          { t: "Désinstaller le logiciel récent", comment: "Paramètres > Applications > Applications installées : triez par date.", outils: "Aucun", niv: 1, attendu: "Performances retrouvées.", ok: "Le logiciel était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Utiliser la restauration du système", comment: "Tapez « Créer un point de restauration » dans la recherche Windows, puis « Restauration du système » et choisissez une date antérieure au problème. Vos documents ne sont pas modifiés, mais les logiciels installés depuis peuvent être retirés.", outils: "Aucun", niv: 2, attendu: "Le PC retrouve son état antérieur.", ok: "Problème réglé.", ko: "Aucun point de restauration ? Désinstallez la dernière mise à jour dans Windows Update > Historique." }
        ],
        sauvegarde: true,
        fiches: ["win-lenteur", "win-mode-sans-echec"]
      }
    }
  },

  /* ---------------------------------------------------- 4 */
  {
    id: "pc-chauffe",
    titre: "Le PC chauffe ou s'éteint tout seul",
    icone: "🔥",
    resume: "Ventilateurs bruyants, arrêts brutaux, chaleur anormale.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Que se passe-t-il exactement ?",
        rep: [
          { t: "Le PC s'éteint ou redémarre d'un coup", sous: "Comme une coupure de courant", ico: "⛔", suite: "q2" },
          { t: "Il chauffe et le ventilateur est très bruyant, mais ne s'éteint pas", ico: "🌀", res: "poussiere" }
        ]
      },
      q2: {
        q: "Quand l'arrêt se produit-il ?",
        rep: [
          { t: "Surtout en jeu ou lors de tâches lourdes", ico: "🎮", res: "charge" },
          { t: "N'importe quand, même sans rien faire", ico: "🎲", res: "aleatoire" },
          { t: "C'est un portable posé sur un lit, un canapé ou les genoux", ico: "🛋️", res: "portable" }
        ]
      }
    },
    resultats: {
      poussiere: {
        titre: "PC qui chauffe et fait du bruit",
        intro: "Les ventilateurs accélèrent pour évacuer la chaleur. La poussière est la cause la plus fréquente, sans être la seule.",
        causes: [["Poussière dans les ventilateurs et radiateurs", "forte"], ["Mauvaise circulation d'air (emplacement)", "moyenne"], ["Pâte thermique sèche (PC de plusieurs années)", "moyenne"], ["Programme qui sollicite le processeur en permanence", "moyenne"]],
        controles: [
          { t: "Vérifier ce qui fait travailler le PC", comment: "Gestionnaire des tâches (Ctrl + Maj + Échap), triez par Processeur.", outils: "Aucun", niv: 1, attendu: "Le processeur est presque au repos quand vous ne faites rien.", ok: "Passez au contrôle suivant.", ko: "Un programme consomme beaucoup : fermez-le ou faites une analyse antivirus." },
          { t: "Améliorer l'emplacement", comment: "Laissez de l'espace autour des grilles d'aération, évitez les meubles fermés et la chaleur directe.", outils: "Aucun", niv: 1, attendu: "Le bruit diminue.", ok: "Gardez cet emplacement.", ko: "Passez au contrôle suivant." },
          { t: "Dépoussiérer", comment: "PC éteint et débranché, à l'extérieur si possible : soufflez la poussière avec une bombe d'air sec par petites impulsions. Bloquez les ventilateurs avec un doigt pour qu'ils ne tournent pas trop vite.", outils: "Bombe d'air sec, pinceau doux", niv: 2, attendu: "Radiateurs et grilles propres.", ok: "Mesurez les températures pour vérifier l'effet.", ko: "Passez au contrôle suivant." },
          { t: "Mesurer les températures", comment: "Un logiciel gratuit comme HWMonitor ou HWiNFO affiche les températures. Comparez avec la limite indiquée par le fabricant de votre processeur.", outils: "HWMonitor ou HWiNFO (gratuits)", niv: 2, attendu: "Températures raisonnables au repos et en charge.", ok: "Le refroidissement est correct.", ko: "Températures très élevées : le remplacement de la pâte thermique peut être nécessaire (niveau avancé)." }
        ],
        avert: ["N'utilisez pas d'aspirateur directement sur les composants : risque d'électricité statique.", "N'ouvrez jamais le bloc d'alimentation pour le dépoussiérer."],
        fiches: ["temp-depoussierage", "temp-surveiller"]
      },
      charge: {
        titre: "Arrêts brutaux en jeu ou sous forte charge",
        intro: "Sous forte charge, le PC consomme et chauffe le plus. Deux pistes principales : la surchauffe et l'alimentation. D'autres causes restent possibles.",
        causes: [["Surchauffe du processeur ou de la carte graphique", "forte"], ["Alimentation insuffisante ou fatiguée", "forte"], ["Overclocking ou réglages BIOS instables", "moyenne"], ["Pilote graphique", "faible"]],
        controles: [
          { t: "Surveiller les températures en jeu", comment: "Lancez HWMonitor ou HWiNFO, jouez quelques minutes, puis regardez les valeurs maximales.", outils: "HWMonitor ou HWiNFO", niv: 2, attendu: "Températures dans les limites du fabricant.", ok: "Piste surchauffe peu probable : passez au contrôle suivant.", ko: "Dépoussiérez et améliorez la ventilation (voir la fiche)." },
          { t: "Vérifier les ventilateurs", comment: "Panneau ouvert, PC allumé, regardez sans toucher : tous les ventilateurs (processeur, carte graphique, boîtier) doivent tourner.", outils: "Lampe", niv: 1, attendu: "Tous tournent.", ok: "Passez au contrôle suivant.", ko: "Un ventilateur arrêté doit être vérifié ou remplacé (PC éteint)." },
          { t: "Retirer l'overclocking", comment: "Remettez les réglages par défaut du BIOS (« Load Optimized Defaults ») et désactivez les logiciels d'overclocking.", outils: "Aucun", niv: 2, attendu: "Plus d'arrêt.", ok: "L'overclocking était instable.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier l'alimentation", comment: "Comparez la puissance de l'alimentation (étiquette) avec la recommandation du fabricant de la carte graphique. Une alimentation ancienne peut ne plus fournir sa puissance nominale.", outils: "Lampe, fiche technique de la carte graphique", niv: 2, attendu: "Puissance suffisante.", ok: "Faites tester l'alimentation par un professionnel si les arrêts continuent.", ko: "Puissance insuffisante : remplacez l'alimentation par un modèle adapté." }
        ],
        fiches: ["temp-depoussierage", "temp-surveiller", "pc-alim-securite"]
      },
      aleatoire: {
        titre: "Arrêts brutaux à n'importe quel moment",
        intro: "Sans lien avec la charge, la surchauffe est moins probable. L'alimentation électrique, la mémoire ou un pilote sont des pistes à vérifier.",
        causes: [["Problème d'alimentation (secteur ou bloc du PC)", "forte"], ["Mémoire vive instable", "moyenne"], ["Pilote ou mise à jour défectueux", "moyenne"]],
        controles: [
          { t: "Brancher le PC directement au mur", comment: "Sans multiprise ni rallonge, sur une autre prise.", outils: "Aucun", niv: 1, attendu: "Plus d'arrêt.", ok: "La multiprise ou la prise était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Consulter l'Observateur d'événements", comment: "Clic droit sur Démarrer > Observateur d'événements > Journaux Windows > Système. L'événement « Kernel-Power 41 » confirme un arrêt inattendu, mais n'en donne pas la cause : regardez les erreurs juste avant.", outils: "Aucun", niv: 2, attendu: "Une erreur répétée apparaît avant chaque arrêt.", ok: "Notez-la : elle oriente la recherche.", ko: "Passez au contrôle suivant." },
          { t: "Tester la mémoire vive", comment: "Tapez « Diagnostic de mémoire Windows » dans la recherche et lancez le test (le PC redémarre).", outils: "Outil intégré à Windows", niv: 1, attendu: "Aucune erreur détectée.", ok: "Passez au contrôle suivant.", ko: "Erreurs détectées : testez les barrettes une par une pour trouver la fautive." },
          { t: "Faire tester l'alimentation", comment: "Avec un testeur d'alimentation ou une alimentation de prêt.", outils: "Testeur ATX ou alimentation de prêt", niv: 3, attendu: "Les arrêts cessent avec l'autre alimentation.", ok: "Remplacez l'alimentation.", ko: "Consultez un professionnel." }
        ],
        sauvegarde: true,
        fiches: ["pc-alim-securite", "pc-bips-ram"]
      },
      portable: {
        titre: "Portable qui chauffe et s'éteint",
        intro: "Un portable aspire l'air par-dessous : posé sur un tissu, il étouffe. C'est une cause fréquente, mais la poussière ou une pâte thermique sèche sont aussi possibles.",
        causes: [["Aérations bouchées par la surface (lit, canapé)", "forte"], ["Poussière dans le ventilateur", "forte"], ["Pâte thermique sèche", "moyenne"]],
        controles: [
          { t: "Utiliser le portable sur une surface dure", comment: "Table, bureau ou support ventilé.", outils: "Aucun", niv: 1, attendu: "Plus d'arrêt.", ok: "Gardez cette habitude.", ko: "Passez au contrôle suivant." },
          { t: "Souffler dans les aérations", comment: "Portable éteint, chargeur débranché : soufflez par petites impulsions dans les grilles avec une bombe d'air sec.", outils: "Bombe d'air sec", niv: 1, attendu: "De la poussière sort, le ventilateur est plus discret ensuite.", ok: "Observez si les arrêts disparaissent.", ko: "Passez au contrôle suivant." },
          { t: "Nettoyage interne", comment: "Le démontage d'un portable varie selon les modèles : suivez le manuel de maintenance du fabricant ou confiez-le à un réparateur.", outils: "Tournevis de précision, spatule plastique", niv: 3, attendu: "Températures en baisse.", ok: "Problème réglé.", ko: "Faites diagnostiquer le portable." }
        ],
        avert: ["Ne laissez pas un portable chaud sur un lit ou un canapé sans surveillance."],
        fiches: ["temp-depoussierage", "portable-batterie"]
      }
    }
  },

  /* ---------------------------------------------------- 5 */
  {
    id: "pc-internet",
    titre: "Le PC n'a plus de connexion Internet",
    icone: "🌐",
    resume: "Wi-Fi ou câble : plus de pages web, plus de connexion.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Comment le PC est-il connecté ?",
        rep: [
          { t: "En Wi-Fi", ico: "📶", suite: "q2" },
          { t: "Par câble Ethernet", ico: "🔌", suite: "q3" }
        ]
      },
      q2: {
        q: "Les autres appareils (téléphone en Wi-Fi, TV…) ont-ils Internet avec la même box ?",
        rep: [
          { t: "Non, aucun appareil n'a Internet", ico: "❌", res: "box" },
          { t: "Oui, seul le PC n'a pas Internet", ico: "💻", suite: "q4" }
        ]
      },
      q3: {
        q: "Les autres appareils ont-ils Internet avec la même box ?",
        rep: [
          { t: "Non, aucun appareil n'a Internet", ico: "❌", res: "box" },
          { t: "Oui, seul le PC n'a pas Internet", ico: "💻", res: "ethernet" }
        ]
      },
      q4: {
        q: "Le PC voit-il votre réseau Wi-Fi dans la liste ?",
        aide: "Cliquez sur l'icône réseau en bas à droite de l'écran.",
        rep: [
          { t: "Non, aucun réseau ou pas d'icône Wi-Fi", ico: "🚫", res: "carte-wifi" },
          { t: "Oui, mais la connexion échoue ou « Aucun accès Internet »", ico: "⚠️", res: "connexion-wifi" }
        ]
      }
    },
    resultats: {
      box: {
        titre: "Aucun appareil n'a Internet : la box ou la ligne",
        intro: "Si aucun appareil ne fonctionne, le PC n'est très probablement pas en cause. Le problème se situe au niveau de la box ou de la ligne de l'opérateur.",
        causes: [["Box bloquée", "forte"], ["Incident chez l'opérateur", "moyenne"], ["Problème de câble ou de prise (fibre, ADSL)", "moyenne"]],
        controles: [
          { t: "Redémarrer la box", comment: "Débranchez l'alimentation de la box, attendez environ une minute, rebranchez puis patientez quelques minutes que tous les voyants se stabilisent.", outils: "Aucun", niv: 1, attendu: "Internet revient sur tous les appareils.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier les câbles de la box", comment: "Câble fibre ou téléphonique bien enclipsé, sans pli ; ne tordez jamais un câble fibre.", outils: "Lampe", niv: 1, attendu: "Câbles en place.", ok: "Passez au contrôle suivant.", ko: "Rebranchez correctement puis redémarrez la box." },
          { t: "Vérifier les incidents opérateur", comment: "Avec les données mobiles du téléphone, consultez l'espace client ou la page d'assistance de votre opérateur, ou appelez son service client.", outils: "Téléphone avec données mobiles", niv: 1, attendu: "Un incident est signalé.", ok: "Attendez le rétablissement.", ko: "Contactez le service client avec la description des voyants de la box." }
        ],
        fiches: ["reseau-box"]
      },
      "carte-wifi": {
        titre: "Le PC ne voit aucun réseau Wi-Fi",
        intro: "Si le PC ne voit aucun réseau alors que les autres appareils oui, le Wi-Fi du PC est probablement désactivé ou son pilote pose problème.",
        causes: [["Mode Avion activé ou Wi-Fi désactivé", "forte"], ["Pilote Wi-Fi défaillant", "moyenne"], ["Carte Wi-Fi désactivée ou défectueuse", "faible"]],
        controles: [
          { t: "Désactiver le mode Avion", comment: "Cliquez sur l'icône réseau : désactivez le mode Avion et activez le Wi-Fi. Sur certains portables, une touche ou un interrupteur Wi-Fi existe.", outils: "Aucun", niv: 1, attendu: "Les réseaux apparaissent.", ok: "Connectez-vous.", ko: "Passez au contrôle suivant." },
          { t: "Redémarrer complètement le PC", comment: "Maintenez la touche Maj en cliquant sur « Arrêter » (arrêt complet), puis rallumez.", outils: "Aucun", niv: 1, attendu: "Le Wi-Fi réapparaît.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le Gestionnaire de périphériques", comment: "Clic droit sur Démarrer > Gestionnaire de périphériques > Cartes réseau. Une carte avec une flèche est désactivée (clic droit > Activer). Un point d'exclamation indique un souci de pilote : installez le pilote depuis le site du fabricant du PC.", outils: "Aucun (une connexion par câble ou un autre PC pour télécharger le pilote)", niv: 2, attendu: "La carte Wi-Fi fonctionne.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser le réseau", comment: "Paramètres > Réseau et Internet > Paramètres réseau avancés > Réinitialisation du réseau. Le PC redémarre.", outils: "Aucun", niv: 2, attendu: "Le Wi-Fi refonctionne.", ok: "Reconnectez-vous à votre réseau.", ko: "Une clé Wi-Fi USB permet de tester si la carte interne est défectueuse." }
        ],
        avert: ["La réinitialisation du réseau efface les réseaux Wi-Fi enregistrés et certains réglages (VPN) : ayez la clé Wi-Fi de votre box sous la main."],
        fiches: ["reseau-wifi"]
      },
      "connexion-wifi": {
        titre: "Le réseau est visible mais la connexion échoue",
        intro: "Le PC voit le réseau mais n'obtient pas l'accès. La cause est souvent une mémoire de connexion corrompue, la clé Wi-Fi ou la qualité du signal.",
        causes: [["Profil Wi-Fi enregistré corrompu ou clé changée", "forte"], ["Signal trop faible (distance, murs)", "moyenne"], ["Problème d'adresse IP ou de DNS", "moyenne"]],
        controles: [
          { t: "Oublier le réseau puis se reconnecter", comment: "Paramètres > Réseau et Internet > Wi-Fi > Gérer les réseaux connus > votre réseau > Oublier. Reconnectez-vous avec la clé Wi-Fi inscrite sur la box.", outils: "Clé Wi-Fi de la box", niv: 1, attendu: "Connexion établie.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Se rapprocher de la box", comment: "Testez à côté de la box. Si votre box propose deux réseaux (2,4 GHz et 5 GHz), essayez l'autre.", outils: "Aucun", niv: 1, attendu: "Connexion stable près de la box.", ok: "Le signal était trop faible : répéteur ou câble Ethernet conseillés.", ko: "Passez au contrôle suivant." },
          { t: "Renouveler l'adresse IP", comment: "Tapez « cmd » dans la recherche, ouvrez l'Invite de commandes, puis tapez une à une : ipconfig /release, ipconfig /renew, ipconfig /flushdns.", outils: "Aucun", niv: 2, attendu: "La connexion fonctionne.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser le réseau", comment: "Paramètres > Réseau et Internet > Paramètres réseau avancés > Réinitialisation du réseau.", outils: "Aucun", niv: 2, attendu: "Connexion rétablie.", ok: "Reconnectez-vous à votre réseau.", ko: "Testez un câble Ethernet pour savoir si le problème est propre au Wi-Fi." }
        ],
        avert: ["Ne saisissez jamais votre clé Wi-Fi ou vos identifiants sur un site qui vous les demande pour « réparer » la connexion."],
        fiches: ["reseau-wifi", "reseau-box"]
      },
      ethernet: {
        titre: "Pas d'Internet par câble sur ce PC uniquement",
        intro: "Les autres appareils fonctionnent, le problème est donc entre la box et le PC : câble, port ou carte réseau.",
        causes: [["Câble Ethernet défectueux ou mal clipsé", "forte"], ["Port de la box ou du PC", "moyenne"], ["Pilote de la carte réseau", "moyenne"]],
        controles: [
          { t: "Vérifier les voyants du port réseau", comment: "À côté de la prise réseau du PC et de la box, de petits voyants doivent s'allumer ou clignoter.", outils: "Lampe", niv: 1, attendu: "Voyants allumés.", ok: "Le lien physique existe : passez au contrôle 3.", ko: "Passez au contrôle suivant." },
          { t: "Changer de câble et de port", comment: "Essayez un autre câble Ethernet et un autre port de la box.", outils: "Câble Ethernet de rechange", niv: 1, attendu: "Connexion rétablie.", ok: "Le câble ou le port était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier la carte réseau dans Windows", comment: "Gestionnaire de périphériques > Cartes réseau : la carte Ethernet doit être activée, sans point d'exclamation. Mettez à jour son pilote depuis le site du fabricant.", outils: "Aucun", niv: 2, attendu: "Carte reconnue et activée.", ok: "Passez au contrôle suivant si la connexion ne revient pas.", ko: "Installez le pilote depuis un autre appareil (clé USB)." },
          { t: "Réinitialiser le réseau", comment: "Paramètres > Réseau et Internet > Paramètres réseau avancés > Réinitialisation du réseau.", outils: "Aucun", niv: 2, attendu: "Connexion rétablie.", ok: "Problème réglé.", ko: "Une carte réseau USB permet de vérifier si la carte interne est défectueuse." }
        ],
        fiches: ["reseau-box"]
      }
    }
  },

  /* ---------------------------------------------------- 6 */
  {
    id: "pc-ecran-bleu",
    titre: "Le PC affiche un écran bleu",
    icone: "💙",
    resume: "Message « Votre PC a rencontré un problème » puis redémarrage.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Windows arrive-t-il encore à démarrer ?",
        aide: "Si possible, notez le « code d'arrêt » affiché en bas de l'écran bleu (par exemple MEMORY_MANAGEMENT). Il aide beaucoup au diagnostic.",
        rep: [
          { t: "Oui, l'écran bleu apparaît de temps en temps", ico: "🔄", suite: "q2" },
          { t: "Non, l'écran bleu revient à chaque démarrage", ico: "⛔", res: "boucle" }
        ]
      },
      q2: {
        q: "Avez-vous récemment installé un matériel, un pilote, un logiciel ou une mise à jour ?",
        rep: [
          { t: "Oui", ico: "🆕", res: "recent" },
          { t: "Non, ou je ne sais pas", ico: "❓", res: "aleatoire" }
        ]
      }
    },
    resultats: {
      aleatoire: {
        titre: "Écrans bleus occasionnels",
        intro: "Un écran bleu peut venir d'un pilote, de la mémoire, du disque, de fichiers Windows endommagés ou d'une surchauffe. Le code d'arrêt permet d'orienter la recherche mais ne désigne pas toujours une pièce précise.",
        causes: [["Pilote défectueux ou obsolète", "forte"], ["Mémoire vive instable", "moyenne"], ["Fichiers système Windows endommagés", "moyenne"], ["Disque en mauvaise santé", "moyenne"], ["Surchauffe", "faible"]],
        controles: [
          { t: "Noter et rechercher le code d'arrêt", comment: "Notez le code (ex. : IRQL_NOT_LESS_OR_EQUAL) et recherchez-le sur le site d'assistance de Microsoft.", outils: "Papier, ou photo avec le téléphone", niv: 1, attendu: "Le code oriente vers un type de problème (pilote, mémoire…).", ok: "Suivez la piste indiquée.", ko: "Continuez les contrôles dans l'ordre." },
          { t: "Mettre à jour Windows et les pilotes", comment: "Windows Update, puis pilotes graphiques et chipset depuis les sites des fabricants (NVIDIA, AMD, Intel, fabricant du PC).", outils: "Connexion Internet", niv: 1, attendu: "Plus d'écran bleu après les mises à jour.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réparer les fichiers système", comment: "Ouvrez « Invite de commandes » en tant qu'administrateur et tapez : sfc /scannow (attendez la fin), puis : DISM /Online /Cleanup-Image /RestoreHealth", outils: "Aucun", niv: 2, attendu: "Windows signale avoir réparé ou ne trouve aucune erreur.", ok: "Redémarrez et observez.", ko: "Passez au contrôle suivant." },
          { t: "Tester la mémoire et le disque", comment: "Lancez le « Diagnostic de mémoire Windows », puis vérifiez l'état du disque avec CrystalDiskInfo.", outils: "Outil Windows, CrystalDiskInfo (gratuit)", niv: 2, attendu: "Aucune erreur.", ok: "Vérifiez les températures (fiche Température).", ko: "La pièce signalée est suspecte : sauvegardez et faites-la vérifier." }
        ],
        sauvegarde: true,
        fiches: ["win-ecran-bleu", "pc-bips-ram", "stock-sante-disque"]
      },
      recent: {
        titre: "Écrans bleus après un changement récent",
        intro: "Quand l'écran bleu apparaît juste après un changement, celui-ci est le premier suspect, sans que ce soit certain.",
        causes: [["Nouveau pilote ou logiciel incompatible", "forte"], ["Nouvelle pièce mal installée ou incompatible", "moyenne"], ["Mise à jour Windows problématique", "moyenne"]],
        controles: [
          { t: "Annuler le changement matériel", comment: "PC débranché, retirez la nouvelle pièce ou remettez l'ancienne.", outils: "Tournevis", niv: 2, attendu: "Plus d'écran bleu.", ok: "La pièce est incompatible ou défectueuse.", ko: "Passez au contrôle suivant." },
          { t: "Revenir à l'ancien pilote ou désinstaller le logiciel", comment: "Gestionnaire de périphériques > clic droit sur le périphérique > Propriétés > Pilote > « Restaurer le pilote ». Ou désinstallez le logiciel récent.", outils: "Aucun", niv: 2, attendu: "Plus d'écran bleu.", ok: "Attendez une version corrigée avant de réinstaller.", ko: "Passez au contrôle suivant." },
          { t: "Restauration du système", comment: "Choisissez un point de restauration antérieur au changement.", outils: "Aucun", niv: 2, attendu: "Le PC est stable.", ok: "Problème réglé.", ko: "Suivez le parcours « écrans bleus occasionnels »." }
        ],
        sauvegarde: true,
        fiches: ["win-ecran-bleu", "win-mode-sans-echec"]
      },
      boucle: {
        titre: "Écran bleu à chaque démarrage",
        intro: "Windows ne parvient plus à démarrer. L'environnement de récupération de Windows offre plusieurs outils de réparation, à essayer du moins risqué au plus radical.",
        causes: [["Mise à jour ou pilote récent", "forte"], ["Fichiers de démarrage endommagés", "moyenne"], ["Disque ou mémoire défectueux", "moyenne"]],
        controles: [
          { t: "Ouvrir l'environnement de récupération", comment: "Interrompez trois fois de suite le démarrage (bouton maintenu dès que le logo apparaît). Windows affiche « Réparation automatique » puis « Options avancées ».", outils: "Aucun", niv: 2, attendu: "Écran bleu clair « Choisir une option ».", ok: "Passez au contrôle suivant.", ko: "Créez une clé USB d'installation Windows depuis un autre PC (outil officiel Microsoft) et démarrez dessus." },
          { t: "Réparation du démarrage", comment: "Dépannage > Options avancées > Outil de redémarrage système.", outils: "Aucun", niv: 2, attendu: "Windows redémarre normalement.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Désinstaller la dernière mise à jour", comment: "Dépannage > Options avancées > Désinstaller des mises à jour.", outils: "Aucun", niv: 2, attendu: "Windows démarre.", ok: "Mettez en pause les mises à jour quelques jours.", ko: "Passez au contrôle suivant." },
          { t: "Mode sans échec ou restauration du système", comment: "Paramètres de démarrage > mode sans échec pour désinstaller un pilote, ou « Restauration du système ».", outils: "Aucun", niv: 2, attendu: "Windows démarre.", ok: "Problème réglé.", ko: "Avant toute réinitialisation, récupérez vos données (voir fiche Sauvegarde)." },
          { t: "Réinitialiser ce PC (dernier recours)", comment: "Dépannage > Réinitialiser ce PC > « Conserver mes fichiers ». Les applications installées seront supprimées.", outils: "Aucun", niv: 3, attendu: "Windows réinstallé.", ok: "Réinstallez vos logiciels.", ko: "Faites tester le disque et la mémoire par un professionnel." }
        ],
        sauvegarde: true,
        avert: ["« Réinitialiser ce PC » supprime vos applications, et l'option « Supprimer tout » efface aussi vos fichiers personnels. Sauvegardez vos données avant."],
        fiches: ["win-ecran-bleu", "win-mode-sans-echec", "stock-sauvegarde"]
      }
    }
  },

  /* ---------------------------------------------------- 7 */
  {
    id: "pc-disque",
    titre: "Le SSD ou le disque dur n'est plus détecté",
    icone: "💾",
    resume: "Disque absent de l'Explorateur, du BIOS ou « no bootable device ».",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Quel disque n'est plus détecté ?",
        rep: [
          { t: "Le disque principal (Windows ne démarre plus)", sous: "Message du type « No bootable device » ou retour au BIOS", ico: "🛑", res: "principal" },
          { t: "Un second disque interne", ico: "💽", suite: "q2" },
          { t: "Un disque externe USB", ico: "🔌", res: "externe" }
        ]
      },
      q2: {
        q: "Le disque apparaît-il dans le BIOS / UEFI ?",
        aide: "Au démarrage, appuyez plusieurs fois sur la touche indiquée (souvent Suppr ou F2) : la liste des disques est généralement sur la page principale ou dans la section « Storage ».",
        rep: [
          { t: "Oui, il est visible dans le BIOS", ico: "✅", res: "windows" },
          { t: "Non, il n'apparaît pas", ico: "❌", res: "materiel" },
          { t: "Je ne sais pas comment vérifier", ico: "❓", res: "windows" }
        ]
      }
    },
    resultats: {
      windows: {
        titre: "Disque présent mais invisible dans Windows",
        intro: "Souvent, le disque fonctionne mais n'a pas de lettre de lecteur dans Windows. Attention : certaines options de l'outil Gestion des disques effacent les données.",
        causes: [["Lettre de lecteur manquante", "forte"], ["Disque neuf jamais initialisé", "moyenne"], ["Partition endommagée", "moyenne"]],
        controles: [
          { t: "Ouvrir la Gestion des disques", comment: "Clic droit sur Démarrer > Gestion des disques. Repérez votre disque par sa taille.", outils: "Aucun", niv: 1, attendu: "Le disque apparaît dans la liste du bas.", ok: "Passez au contrôle suivant.", ko: "Disque absent ici aussi : suivez le parcours « absent du BIOS »." },
          { t: "Attribuer une lettre de lecteur", comment: "Si la partition est « Sain » mais sans lettre : clic droit sur la partition > Modifier la lettre de lecteur > Ajouter. Cette action ne supprime rien.", outils: "Aucun", niv: 1, attendu: "Le disque apparaît dans l'Explorateur.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Disque « non initialisé » ou « non alloué »", comment: "Si le disque est NEUF : initialisez-le (GPT) puis créez un nouveau volume. Si le disque CONTENAIT des données, n'initialisez pas et ne formatez pas : faites appel à un spécialiste de la récupération de données.", outils: "Aucun", niv: 2, attendu: "Disque neuf utilisable.", ok: "Problème réglé.", ko: "Pour un disque avec données : arrêtez toute manipulation." }
        ],
        sauvegarde: true,
        avert: ["Initialiser, formater ou supprimer un volume efface les données. Ne le faites jamais sur un disque qui contient des fichiers importants."],
        fiches: ["stock-disque-invisible", "stock-sauvegarde"]
      },
      materiel: {
        titre: "Disque interne absent du BIOS",
        intro: "Si le BIOS ne voit pas le disque, la cause est matérielle : branchement, compatibilité ou disque défaillant.",
        causes: [["Câble SATA (données ou alimentation) débranché ou défectueux", "forte"], ["SSD M.2 mal inséré ou emplacement incompatible", "moyenne"], ["Port SATA désactivé quand un emplacement M.2 est utilisé (selon la carte mère)", "moyenne"], ["Disque défaillant", "moyenne"]],
        controles: [
          { t: "Vérifier les câbles SATA", comment: "PC éteint et débranché : vérifiez le câble de données et le câble d'alimentation du disque, essayez un autre câble et un autre port SATA.", outils: "Tournevis, câble SATA de rechange", niv: 2, attendu: "Le disque apparaît dans le BIOS.", ok: "Le câble ou le port était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le SSD M.2", comment: "PC débranché : le SSD doit être enfoncé à fond dans son emplacement et tenu par sa vis. Vérifiez dans le manuel que l'emplacement accepte ce type de SSD (SATA ou NVMe).", outils: "Petit tournevis, manuel de la carte mère", niv: 2, attendu: "Le SSD apparaît dans le BIOS.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Consulter le manuel de la carte mère", comment: "Sur certaines cartes mères, utiliser un emplacement M.2 désactive certains ports SATA. Le manuel l'indique.", outils: "Manuel de la carte mère", niv: 2, attendu: "Vous identifiez un conflit.", ok: "Déplacez le disque sur un port compatible.", ko: "Passez au contrôle suivant." },
          { t: "Tester le disque ailleurs", comment: "Avec un boîtier ou adaptateur USB, branchez le disque sur un autre PC.", outils: "Boîtier/adaptateur USB adapté", niv: 2, attendu: "Le disque est reconnu.", ok: "Le problème vient du PC (port, carte mère).", ko: "Le disque est probablement défaillant." }
        ],
        sauvegarde: true,
        avert: ["Si le disque dur émet des clics répétés, éteignez-le : continuer peut aggraver la perte de données. Contactez un spécialiste de la récupération."],
        fiches: ["stock-disque-invisible", "stock-sante-disque"]
      },
      principal: {
        titre: "Le disque système n'est plus trouvé au démarrage",
        intro: "Le PC ne trouve plus de système à démarrer. Plusieurs causes sont possibles, d'un simple ordre de démarrage modifié à une panne du disque.",
        causes: [["Clé USB ou disque externe branché qui perturbe le démarrage", "forte"], ["Ordre de démarrage modifié dans le BIOS", "moyenne"], ["Câble ou SSD mal connecté", "moyenne"], ["Démarrage de Windows endommagé ou disque défaillant", "moyenne"]],
        controles: [
          { t: "Débrancher clés USB et disques externes", comment: "Retirez tout support de stockage externe puis redémarrez.", outils: "Aucun", niv: 1, attendu: "Windows démarre.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le BIOS", comment: "Entrez dans le BIOS (Suppr ou F2) : le disque est-il listé ? Dans « Boot », le « Windows Boot Manager » doit être en premier.", outils: "Aucun", niv: 2, attendu: "Le disque est visible et en premier.", ok: "Enregistrez (F10) et redémarrez.", ko: "Disque absent : vérifiez les branchements (parcours « absent du BIOS »)." },
          { t: "Réparer le démarrage de Windows", comment: "Démarrez sur une clé USB d'installation Windows (créée sur un autre PC avec l'outil officiel Microsoft) > Réparer l'ordinateur > Dépannage > Outil de redémarrage système.", outils: "Clé USB 8 Go minimum, autre PC", niv: 3, attendu: "Windows redémarre.", ok: "Problème réglé.", ko: "Récupérez vos données avant toute réinstallation." }
        ],
        sauvegarde: true,
        avert: ["Ne lancez pas de réinstallation de Windows sur ce disque avant d'avoir récupéré vos fichiers importants."],
        fiches: ["stock-disque-invisible", "stock-sauvegarde", "win-mode-sans-echec"]
      },
      externe: {
        titre: "Disque externe USB non reconnu",
        intro: "Pour un disque externe, le câble et le port USB sont les premiers suspects. Le disque lui-même peut aussi être en cause.",
        causes: [["Câble USB défectueux", "forte"], ["Port USB ou alimentation insuffisante", "moyenne"], ["Lettre de lecteur manquante", "moyenne"], ["Disque défaillant", "moyenne"]],
        controles: [
          { t: "Changer de port et de câble", comment: "Branchez le disque directement à l'arrière du PC (pas sur un hub), avec un autre câble si possible.", outils: "Câble USB de rechange", niv: 1, attendu: "Le disque est reconnu.", ok: "Le câble ou le port était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier l'alimentation du disque", comment: "Les disques 3,5 pouces ont un adaptateur secteur : vérifiez-le. Écoutez si le disque tourne.", outils: "Aucun", niv: 1, attendu: "Le disque s'allume.", ok: "Passez au contrôle suivant.", ko: "L'adaptateur ou le boîtier est peut-être en cause." },
          { t: "Regarder dans la Gestion des disques", comment: "Clic droit sur Démarrer > Gestion des disques. Si le disque apparaît sans lettre, attribuez-en une (sans formater).", outils: "Aucun", niv: 1, attendu: "Le disque apparaît dans l'Explorateur.", ok: "Problème réglé.", ko: "Testez sur un autre ordinateur." }
        ],
        sauvegarde: true,
        avert: ["Si Windows propose de formater le disque, refusez s'il contient des données.", "Clics répétés : débranchez le disque et consultez un spécialiste de la récupération de données."],
        fiches: ["stock-disque-invisible", "stock-sauvegarde"]
      }
    }
  },

  /* ---------------------------------------------------- 8 */
  {
    id: "pc-boucle",
    titre: "Le PC redémarre en boucle",
    icone: "🔁",
    resume: "Il redémarre sans fin avant ou pendant le chargement de Windows.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "À quel moment le PC redémarre-t-il ?",
        rep: [
          { t: "Avant même le logo, après quelques secondes", ico: "⚡", res: "materiel" },
          { t: "Pendant le chargement de Windows", sous: "Logo, ronds qui tournent…", ico: "🪟", res: "windows" },
          { t: "Après une mise à jour de Windows", ico: "🔄", res: "maj" },
          { t: "Après avoir changé une pièce ou un réglage du BIOS", ico: "🔧", res: "modif" }
        ]
      }
    },
    resultats: {
      materiel: {
        titre: "Redémarrages avant le logo",
        intro: "Le PC n'arrive pas au bout de son autotest matériel. Mémoire, réglages BIOS et alimentation sont les pistes principales, sans certitude à ce stade.",
        causes: [["Mémoire vive mal insérée ou réglage mémoire instable", "forte"], ["Réglages BIOS instables", "moyenne"], ["Alimentation défaillante", "moyenne"], ["Carte mère ou processeur", "faible"]],
        controles: [
          { t: "Débrancher les périphériques", comment: "Ne laissez que clavier, souris et écran.", outils: "Aucun", niv: 1, attendu: "Le PC démarre.", ok: "Rebranchez un par un.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser le BIOS (CMOS)", comment: "Suivez la méthode du manuel de votre carte mère (bouton Clear CMOS, cavalier ou pile retirée quelques minutes, PC débranché).", outils: "Manuel de la carte mère", niv: 3, attendu: "Le PC démarre avec les réglages d'usine.", ok: "Évitez de réactiver l'overclocking.", ko: "Passez au contrôle suivant." },
          { t: "Tester la mémoire barrette par barrette", comment: "PC débranché, gardez une seule barrette dans l'emplacement recommandé par le manuel.", outils: "Tournevis", niv: 2, attendu: "Le PC démarre avec une barrette précise.", ok: "La barrette retirée est suspecte.", ko: "Faites tester l'alimentation et la carte mère." }
        ],
        avert: ["Ne manipulez pas les composants PC branché."],
        fiches: ["pc-bips-ram", "pc-alim-securite"]
      },
      windows: {
        titre: "Redémarrages pendant le chargement de Windows",
        intro: "Le matériel passe son autotest, mais Windows plante pendant son chargement. Un pilote ou des fichiers système sont souvent en cause.",
        causes: [["Pilote défaillant", "forte"], ["Fichiers de démarrage endommagés", "moyenne"], ["Disque défaillant", "moyenne"]],
        controles: [
          { t: "Ouvrir l'environnement de récupération", comment: "Après trois démarrages interrompus, Windows affiche la réparation automatique. Choisissez Options avancées.", outils: "Aucun", niv: 2, attendu: "Menu « Choisir une option ».", ok: "Passez au contrôle suivant.", ko: "Utilisez une clé USB d'installation Windows." },
          { t: "Afficher l'erreur au lieu de redémarrer", comment: "Dépannage > Options avancées > Paramètres de démarrage > Redémarrer, puis choisissez « Désactiver le redémarrage automatique en cas d'échec ». Notez le code d'erreur affiché.", outils: "Papier ou téléphone", niv: 2, attendu: "Un écran bleu avec un code apparaît.", ok: "Suivez le diagnostic « écran bleu ».", ko: "Passez au contrôle suivant." },
          { t: "Réparation du démarrage et mode sans échec", comment: "Essayez l'Outil de redémarrage système, puis le mode sans échec pour désinstaller un pilote récent.", outils: "Aucun", niv: 2, attendu: "Windows démarre.", ok: "Problème réglé.", ko: "Récupérez vos données puis envisagez une réinitialisation." }
        ],
        sauvegarde: true,
        fiches: ["win-mode-sans-echec", "win-ecran-bleu"]
      },
      maj: {
        titre: "Boucle de redémarrage après une mise à jour",
        intro: "Pendant une grosse mise à jour, plusieurs redémarrages sont normaux. Si la boucle continue longtemps, la mise à jour a peut-être échoué.",
        causes: [["Mise à jour encore en cours (normal)", "forte"], ["Mise à jour qui a échoué", "moyenne"], ["Pilote incompatible avec la mise à jour", "moyenne"]],
        controles: [
          { t: "Patienter", comment: "Si le message « Mise à jour en cours, ne pas éteindre » s'affiche, laissez le PC branché et patientez au moins 30 minutes à 1 heure.", outils: "Patience", niv: 1, attendu: "Windows finit par démarrer.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Désinstaller la dernière mise à jour", comment: "Environnement de récupération > Dépannage > Options avancées > Désinstaller des mises à jour > d'abord la dernière mise à jour qualité.", outils: "Aucun", niv: 2, attendu: "Windows démarre.", ok: "Mettez en pause les mises à jour une à deux semaines.", ko: "Essayez la restauration du système." }
        ],
        avert: ["N'éteignez pas le PC pendant qu'une mise à jour est clairement en cours d'installation."],
        sauvegarde: true,
        fiches: ["win-mode-sans-echec"]
      },
      modif: {
        titre: "Boucle après un changement de pièce ou de réglage",
        intro: "Le changement récent est le premier suspect. Revenir en arrière permet de le confirmer.",
        causes: [["Réglage BIOS instable (XMP/EXPO, overclocking)", "forte"], ["Pièce incompatible ou mal installée", "forte"], ["BIOS trop ancien pour un nouveau processeur", "moyenne"]],
        controles: [
          { t: "Revenir à l'ancienne configuration", comment: "Remettez l'ancienne pièce ou annulez le réglage modifié.", outils: "Tournevis", niv: 2, attendu: "Le PC démarre.", ok: "Vérifiez la compatibilité de la nouvelle pièce.", ko: "Passez au contrôle suivant." },
          { t: "Réinitialiser le BIOS", comment: "Méthode Clear CMOS du manuel, ou « Load Optimized Defaults » si vous accédez au BIOS. Désactivez XMP/EXPO pour tester.", outils: "Manuel de la carte mère", niv: 3, attendu: "Démarrage stable.", ok: "Réactivez les réglages un par un.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier la compatibilité", comment: "Consultez la liste de compatibilité (processeurs, mémoire) sur le site du fabricant de la carte mère : une mise à jour du BIOS est parfois nécessaire.", outils: "Site du fabricant", niv: 3, attendu: "Vous savez si la pièce est compatible.", ok: "Mettez à jour le BIOS en suivant strictement la procédure du fabricant.", ko: "Faites-vous aider par un professionnel." }
        ],
        avert: ["Une mise à jour du BIOS interrompue peut rendre la carte mère inutilisable : ne la faites qu'en suivant la procédure officielle, sans coupure de courant."],
        fiches: ["pc-bips-ram"]
      }
    }
  },

  /* ---------------------------------------------------- 9 */
  {
    id: "pc-son",
    titre: "Le PC ne produit plus de son",
    icone: "🔇",
    resume: "Plus de son dans les haut-parleurs, le casque ou la TV.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Par où le son devrait-il sortir ?",
        rep: [
          { t: "Haut-parleurs ou casque branchés en jack (prise ronde)", ico: "🎧", suite: "q2" },
          { t: "Haut-parleurs intégrés du portable", ico: "💻", suite: "q3" },
          { t: "Casque ou enceinte Bluetooth", ico: "🔵", res: "bluetooth" },
          { t: "Écran ou TV branché en HDMI / DisplayPort", ico: "📺", res: "hdmi" }
        ]
      },
      q2: {
        q: "Le casque ou les haut-parleurs fonctionnent-ils sur un autre appareil ?",
        aide: "Par exemple : testez le casque sur un téléphone.",
        rep: [
          { t: "Non, ils ne fonctionnent nulle part", ico: "❌", res: "accessoire" },
          { t: "Oui, ils fonctionnent ailleurs", ico: "✅", suite: "q3" },
          { t: "Je ne peux pas tester", ico: "❓", suite: "q3" }
        ]
      },
      q3: {
        q: "Le son manque-t-il partout, ou seulement dans certaines applications ?",
        rep: [
          { t: "Aucun son nulle part", ico: "🔇", res: "aucun" },
          { t: "Seulement dans certaines applications ou certains jeux", ico: "🎮", res: "appli" }
        ]
      }
    },
    resultats: {
      aucun: {
        titre: "Aucun son sur le PC",
        intro: "Le plus souvent, le son part simplement vers le mauvais périphérique de sortie. Un pilote audio peut aussi être en cause.",
        causes: [["Mauvais périphérique de sortie sélectionné", "forte"], ["Volume coupé (Windows ou haut-parleurs)", "forte"], ["Pilote audio défaillant", "moyenne"], ["Prise jack en façade non branchée en interne", "faible"]],
        controles: [
          { t: "Vérifier le volume", comment: "Icône haut-parleur en bas à droite : volume monté, pas de croix. Vérifiez aussi le bouton de volume des haut-parleurs.", outils: "Aucun", niv: 1, attendu: "Le son revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Choisir le bon périphérique de sortie", comment: "Cliquez sur l'icône son puis sur la flèche à côté du volume : sélectionnez vos haut-parleurs ou votre casque.", outils: "Aucun", niv: 1, attendu: "Le son revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier la prise jack", comment: "Sur un PC fixe, utilisez la prise verte à l'arrière (sortie principale) plutôt que celle de la façade.", outils: "Aucun", niv: 1, attendu: "Le son revient.", ok: "La prise de façade est peut-être mal reliée.", ko: "Passez au contrôle suivant." },
          { t: "Lancer l'utilitaire de résolution", comment: "Paramètres > Système > Son > en bas « Résoudre les problèmes de son courants ».", outils: "Aucun", niv: 1, attendu: "Windows corrige le problème.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinstaller le pilote audio", comment: "Gestionnaire de périphériques > Contrôleurs audio, vidéo et jeu > clic droit sur la carte son > Désinstaller l'appareil, puis redémarrez. Ou installez le pilote depuis le site du fabricant du PC ou de la carte mère.", outils: "Aucun", niv: 2, attendu: "Le son revient après redémarrage.", ok: "Problème réglé.", ko: "Testez un casque USB pour savoir si la sortie audio intégrée est en cause." }
        ],
        fiches: ["win-son"]
      },
      appli: {
        titre: "Pas de son dans certaines applications",
        intro: "Si le son fonctionne ailleurs, le matériel est bon. Le réglage se trouve dans Windows ou dans l'application.",
        causes: [["Application coupée dans le mélangeur de volume", "forte"], ["Sortie audio différente réglée dans l'application", "moyenne"], ["Application à mettre à jour", "faible"]],
        controles: [
          { t: "Ouvrir le mélangeur de volume", comment: "Clic droit sur l'icône son > Ouvrir le mélangeur de volume : vérifiez le volume et la sortie de l'application.", outils: "Aucun", niv: 1, attendu: "Le son de l'application revient.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier les réglages audio de l'application", comment: "Dans les options audio du jeu ou du logiciel, choisissez le bon périphérique de sortie (ou « Par défaut »).", outils: "Aucun", niv: 1, attendu: "Le son revient.", ok: "Problème réglé.", ko: "Redémarrez l'application, puis mettez-la à jour." }
        ],
        fiches: ["win-son"]
      },
      bluetooth: {
        titre: "Pas de son en Bluetooth",
        intro: "Les problèmes Bluetooth viennent souvent de l'appairage ou du profil utilisé.",
        causes: [["Appareil connecté à un autre appareil (téléphone)", "forte"], ["Appairage à refaire", "forte"], ["Mauvaise sortie sélectionnée", "moyenne"], ["Batterie faible", "moyenne"]],
        controles: [
          { t: "Vérifier la batterie et l'autre connexion", comment: "Chargez le casque et désactivez le Bluetooth de votre téléphone s'il est connecté au casque.", outils: "Aucun", niv: 1, attendu: "Le casque se connecte au PC.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Supprimer et réappairer", comment: "Paramètres > Bluetooth et appareils : supprimez l'appareil, mettez le casque en mode appairage puis ajoutez-le à nouveau.", outils: "Notice du casque", niv: 1, attendu: "Connexion réussie.", ok: "Passez au contrôle suivant si le son ne sort pas.", ko: "Redémarrez le PC et réessayez." },
          { t: "Choisir la bonne sortie", comment: "Dans la liste des sorties audio, choisissez la version « Stéréo » ou le nom simple du casque plutôt que « Mains libres » pour une meilleure qualité.", outils: "Aucun", niv: 1, attendu: "Le son sort normalement.", ok: "Problème réglé.", ko: "Mettez à jour le pilote Bluetooth depuis le site du fabricant du PC." }
        ],
        fiches: ["win-son"]
      },
      hdmi: {
        titre: "Pas de son via l'écran ou la TV",
        intro: "Beaucoup d'écrans d'ordinateur n'ont pas de haut-parleurs. Avec une TV, il faut surtout sélectionner la bonne sortie dans Windows.",
        causes: [["L'écran n'a pas de haut-parleurs intégrés", "forte"], ["Sortie HDMI non sélectionnée dans Windows", "forte"], ["Volume de la TV ou de l'écran coupé", "moyenne"], ["Pilote graphique (l'audio HDMI en dépend)", "faible"]],
        controles: [
          { t: "Vérifier que l'écran a des haut-parleurs", comment: "Consultez la fiche technique de l'écran.", outils: "Aucun", niv: 1, attendu: "L'écran a bien des haut-parleurs.", ok: "Passez au contrôle suivant.", ko: "Branchez un casque ou des haut-parleurs sur le PC ou sur la sortie audio de l'écran." },
          { t: "Sélectionner la sortie HDMI", comment: "Icône son > flèche à côté du volume > choisissez le nom de l'écran ou de la TV.", outils: "Aucun", niv: 1, attendu: "Le son sort par la TV.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinstaller le pilote graphique", comment: "Installez la dernière version depuis le site de NVIDIA, AMD ou Intel : il inclut le pilote audio HDMI.", outils: "Connexion Internet", niv: 2, attendu: "La sortie HDMI apparaît.", ok: "Problème réglé.", ko: "Testez avec un autre câble HDMI." }
        ],
        fiches: ["win-son"]
      },
      accessoire: {
        titre: "L'accessoire audio ne fonctionne nulle part",
        intro: "Si le casque ou les haut-parleurs ne marchent sur aucun appareil, ils sont probablement en cause, pas le PC.",
        causes: [["Câble ou prise du casque abîmé", "forte"], ["Haut-parleurs non alimentés", "moyenne"], ["Accessoire en panne", "moyenne"]],
        controles: [
          { t: "Vérifier l'alimentation des haut-parleurs", comment: "Prise secteur ou USB, bouton marche, voyant allumé.", outils: "Aucun", niv: 1, attendu: "Les haut-parleurs s'allument.", ok: "Retestez sur le PC.", ko: "Passez au contrôle suivant." },
          { t: "Inspecter le câble", comment: "Bougez délicatement le câble près de la prise pendant la lecture d'un son : un grésillement indique un fil abîmé.", outils: "Aucun", niv: 1, attendu: "Pas de coupure.", ok: "L'accessoire semble en panne : garantie ou remplacement.", ko: "Câble abîmé : remplacez le câble ou l'accessoire." }
        ],
        fiches: ["win-son"]
      }
    }
  },

  /* ---------------------------------------------------- 10 */
  {
    id: "pc-usb",
    titre: "Un périphérique USB ne fonctionne plus",
    icone: "🔌",
    resume: "Souris, clavier, clé ou manette non reconnus.",
    debut: "q1",
    noeuds: {
      q1: {
        q: "Le problème concerne :",
        rep: [
          { t: "Un seul périphérique, sur tous les ports", ico: "🖱️", suite: "q2" },
          { t: "Plusieurs périphériques, ou tous les ports USB", ico: "🧩", res: "ports" },
          { t: "Un périphérique branché sur un hub USB ou en façade", ico: "🔀", res: "hub" }
        ]
      },
      q2: {
        q: "Le périphérique fonctionne-t-il sur un autre ordinateur ?",
        rep: [
          { t: "Non, il ne fonctionne nulle part", ico: "❌", res: "peripherique" },
          { t: "Oui, il fonctionne ailleurs", ico: "✅", res: "pilote" },
          { t: "Je n'ai pas d'autre ordinateur", ico: "❓", res: "pilote" }
        ]
      }
    },
    resultats: {
      pilote: {
        titre: "Périphérique USB non reconnu par ce PC",
        intro: "Le périphérique fonctionne ailleurs (ou n'a pas pu être testé) : le pilote ou la gestion d'énergie de Windows sont des pistes fréquentes.",
        causes: [["Pilote absent ou corrompu", "forte"], ["Mise en veille sélective de l'USB par Windows", "moyenne"], ["Logiciel du fabricant manquant", "moyenne"]],
        controles: [
          { t: "Redémarrer complètement", comment: "Maintenez Maj en cliquant sur « Arrêter », attendez 10 secondes et rallumez.", outils: "Aucun", niv: 1, attendu: "Le périphérique fonctionne.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Réinstaller le périphérique", comment: "Gestionnaire de périphériques : repérez l'appareil (souvent avec un point d'exclamation ou « Périphérique inconnu »), clic droit > Désinstaller l'appareil, débranchez-le, redémarrez puis rebranchez.", outils: "Aucun", niv: 2, attendu: "Windows le réinstalle automatiquement.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Installer le pilote du fabricant", comment: "Téléchargez le pilote ou le logiciel sur le site officiel du fabricant du périphérique.", outils: "Connexion Internet", niv: 1, attendu: "Le périphérique est reconnu.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Désactiver la veille sélective USB", comment: "Panneau de configuration > Options d'alimentation > Modifier les paramètres du mode > Paramètres avancés > Paramètres USB > désactiver « Paramètre de suspension sélective USB » (si l'option est proposée).", outils: "Aucun", niv: 2, attendu: "Le périphérique ne se déconnecte plus.", ok: "Problème réglé.", ko: "Testez le périphérique sur un autre PC pour confirmer." }
        ],
        fiches: ["usb-peripherique"]
      },
      ports: {
        titre: "Plusieurs ports USB ne fonctionnent plus",
        intro: "Quand plusieurs ports lâchent en même temps, la cause est souvent logicielle (pilote du contrôleur USB) ou une protection après un court-circuit.",
        causes: [["Protection déclenchée par un périphérique défectueux", "moyenne"], ["Pilotes du contrôleur USB ou du chipset", "forte"], ["USB désactivé dans le BIOS", "faible"], ["Carte mère endommagée", "faible"]],
        controles: [
          { t: "Tout débrancher et faire un arrêt complet", comment: "Débranchez tous les périphériques USB, faites un arrêt complet (Maj + Arrêter), débranchez le PC 1 minute puis redémarrez. Rebranchez un périphérique à la fois.", outils: "Aucun", niv: 1, attendu: "Les ports refonctionnent.", ok: "Si un périphérique fait à nouveau tout planter, il est défectueux.", ko: "Passez au contrôle suivant." },
          { t: "Réinstaller les contrôleurs USB", comment: "Gestionnaire de périphériques > Contrôleurs de bus USB : désinstallez les « contrôleurs hôtes » un par un puis redémarrez (gardez un clavier PS/2 ou utilisez le pavé tactile d'un portable par précaution).", outils: "Aucun", niv: 2, attendu: "Windows réinstalle les contrôleurs au redémarrage.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Installer les pilotes chipset", comment: "Téléchargez les pilotes chipset depuis le site du fabricant de la carte mère ou du PC.", outils: "Connexion Internet", niv: 2, attendu: "Les ports refonctionnent.", ok: "Problème réglé.", ko: "Vérifiez dans le BIOS que l'USB est activé, puis consultez un professionnel." }
        ],
        fiches: ["usb-peripherique"]
      },
      hub: {
        titre: "Problème via un hub ou la façade",
        intro: "Les hubs non alimentés et les prises en façade fournissent parfois moins de courant ou ont un câble interne mal branché.",
        causes: [["Hub non alimenté qui manque de puissance", "forte"], ["Câble interne de la façade débranché", "moyenne"], ["Hub défectueux", "moyenne"]],
        controles: [
          { t: "Brancher directement à l'arrière du PC", comment: "Retirez le hub et branchez le périphérique sur un port à l'arrière (carte mère).", outils: "Aucun", niv: 1, attendu: "Le périphérique fonctionne.", ok: "Le hub ou la façade est en cause.", ko: "Suivez le parcours « un seul périphérique »." },
          { t: "Utiliser un hub alimenté", comment: "Pour les disques et appareils gourmands, préférez un hub avec son propre adaptateur secteur.", outils: "Hub USB alimenté", niv: 1, attendu: "Fonctionnement stable.", ok: "Problème réglé.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier le câble USB de façade", comment: "PC débranché, vérifiez le connecteur USB de façade sur la carte mère (voir manuel).", outils: "Tournevis, manuel de la carte mère", niv: 3, attendu: "Connecteur bien en place.", ok: "Les ports de façade refonctionnent.", ko: "Utilisez les ports arrière." }
        ],
        fiches: ["usb-peripherique"]
      },
      peripherique: {
        titre: "Le périphérique semble défectueux",
        intro: "S'il ne fonctionne sur aucun ordinateur, le périphérique ou son câble est très probablement en cause.",
        causes: [["Câble USB abîmé", "forte"], ["Périphérique en panne", "forte"], ["Piles ou batterie vides (sans fil)", "moyenne"]],
        controles: [
          { t: "Changer le câble", comment: "Si le câble est amovible, essayez-en un autre (certains câbles ne servent qu'à charger et ne transmettent pas les données).", outils: "Câble de rechange", niv: 1, attendu: "Le périphérique fonctionne.", ok: "Le câble était en cause.", ko: "Passez au contrôle suivant." },
          { t: "Vérifier piles, batterie et récepteur", comment: "Pour un périphérique sans fil : piles neuves, récepteur USB branché, appairage selon la notice.", outils: "Piles neuves", niv: 1, attendu: "Le périphérique répond.", ok: "Problème réglé.", ko: "Vérifiez la garantie ou remplacez le périphérique." }
        ],
        fiches: ["usb-peripherique"]
      }
    }
  }
];
