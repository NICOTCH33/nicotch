/* =========================================================
   Nicotch — bibliothèque des fiches de dépannage
   Chaque fiche : id, titre, cats (une ou plusieurs catégories), icone,
   symptome, causes, verifs (vérifications préalables), etapes,
   niveau (1 Facile, 2 Intermédiaire, 3 Avancé), precautions,
   diag (lien vers un diagnostic interactif, facultatif).
   ========================================================= */
window.ND_CATEGORIES = [
  { id: "alim", nom: "Démarrage et alimentation", icone: "⚡" },
  { id: "ecran", nom: "Écran et affichage", icone: "🖥️" },
  { id: "windows", nom: "Windows et logiciels", icone: "🪟" },
  { id: "stockage", nom: "Stockage et sauvegarde", icone: "💾" },
  { id: "reseau", nom: "Réseau et Internet", icone: "🌐" },
  { id: "temp", nom: "Température et ventilation", icone: "🌡️" },
  { id: "ps", nom: "PlayStation", icone: "🎮" },
  { id: "xbox", nom: "Xbox", icone: "🟢" },
  { id: "nintendo", nom: "Nintendo", icone: "🔴" }
];

window.ND_FICHES = [
  /* ---------- Démarrage et alimentation ---------- */
  {
    id: "pc-pas-de-courant", titre: "PC fixe qui ne s'allume plus", cats: ["alim"], icone: "⚡", niveau: 2,
    symptome: "Rien ne se passe à l'appui sur le bouton : aucun voyant, aucun ventilateur.",
    causes: ["Prise, multiprise ou câble secteur", "Interrupteur de l'alimentation sur « O »", "Bloc d'alimentation défaillant", "Câble du bouton de façade débranché", "Carte mère défaillante (plus rare)"],
    verifs: ["Tester la prise avec un autre appareil", "Brancher sans multiprise", "Vérifier l'interrupteur « I/O » à l'arrière de la tour"],
    etapes: ["Débrancher le PC, appuyer 15 à 30 secondes sur le bouton de démarrage, attendre une minute, rebrancher.", "Débrancher tous les périphériques USB et réessayer.", "PC débranché : vérifier les connecteurs 24 broches (carte mère) et 4/8 broches (processeur).", "Vérifier le branchement du câble « POWER SW » selon le manuel de la carte mère.", "Tester l'alimentation avec un testeur ATX ou une alimentation de prêt."],
    precautions: ["Ne jamais ouvrir le bloc d'alimentation : ses condensateurs restent dangereux même débranché.", "Odeur de brûlé ou fumée : débrancher et ne plus réessayer."],
    diag: { type: "pc", id: "pc-demarre-pas" }
  },
  {
    id: "pc-alim-securite", titre: "Alimentation de PC : tester et remplacer en sécurité", cats: ["alim"], icone: "🔋", niveau: 3,
    symptome: "Arrêts brutaux, PC qui ne démarre plus ou démarre une seconde puis s'arrête.",
    causes: ["Alimentation vieillissante", "Puissance insuffisante pour la carte graphique", "Protection déclenchée par un court-circuit"],
    verifs: ["Lire la puissance (W) sur l'étiquette de l'alimentation", "Comparer avec la recommandation du fabricant de la carte graphique", "Noter l'âge du PC"],
    etapes: ["Tester avec un testeur d'alimentation ATX (voyants de tension).", "Ou essayer une alimentation de prêt compatible (même connectique, puissance suffisante).", "En cas de remplacement : photographier les branchements avant de démonter.", "Choisir un modèle de marque reconnue avec certification d'efficacité.", "Rebrancher tous les câbles (carte mère, processeur, carte graphique, disques) et vérifier avant de refermer."],
    precautions: ["Toujours travailler PC débranché.", "Ne jamais ouvrir le boîtier de l'alimentation.", "Ne pas mélanger les câbles modulaires de deux alimentations différentes : les brochages peuvent différer et détruire du matériel."]
  },
  {
    id: "portable-batterie", titre: "PC portable : chargeur, batterie et réinitialisation", cats: ["alim"], icone: "💻", niveau: 1,
    symptome: "Le portable ne s'allume plus, ne charge plus ou s'éteint dès qu'on débranche le chargeur.",
    causes: ["Chargeur ou câble défectueux", "Batterie usée ou totalement vide", "Blocage électronique", "Connecteur de charge abîmé"],
    verifs: ["Voyant du chargeur allumé ?", "Voyant de charge du portable ?", "Le portable est-il déformé (batterie gonflée) ?"],
    etapes: ["Laisser charger 30 minutes avec le chargeur d'origine branché au mur.", "Réinitialisation matérielle : chargeur débranché (et batterie retirée si amovible), maintenir le bouton 30 secondes.", "Rebrancher le chargeur et rallumer.", "Si possible, tester un chargeur compatible (même tension, puissance suffisante).", "Vérifier l'état de la batterie : sous Windows, la commande « powercfg /batteryreport » crée un rapport d'usure."],
    precautions: ["Une batterie gonflée présente un risque d'incendie : ne plus l'utiliser ni la charger, la faire remplacer.", "Utiliser des chargeurs de qualité adaptés au modèle."],
    diag: { type: "pc", id: "pc-demarre-pas" }
  },
  {
    id: "pc-bips-ram", titre: "Bips au démarrage et mémoire vive (RAM)", cats: ["alim"], icone: "🔔", niveau: 2,
    symptome: "Le PC émet des bips, affiche un voyant DRAM ou redémarre avant le logo.",
    causes: ["Barrette de RAM mal insérée", "Barrette défectueuse", "Réglage mémoire instable (XMP/EXPO)", "Emplacement incorrect"],
    verifs: ["Noter le nombre de bips ou le voyant allumé", "Consulter le manuel de la carte mère pour leur signification"],
    etapes: ["PC débranché, toucher le boîtier métallique pour se décharger.", "Retirer les barrettes et les réinsérer fermement jusqu'au clic.", "Tester avec une seule barrette dans l'emplacement recommandé par le manuel.", "Tester chaque barrette séparément.", "Si le PC démarre : lancer le « Diagnostic de mémoire Windows ».", "Réinitialiser le BIOS si un réglage mémoire a été modifié."],
    precautions: ["Ne jamais manipuler la RAM PC branché.", "Tenir les barrettes par les bords, sans toucher les contacts dorés."],
    diag: { type: "pc", id: "pc-demarre-pas" }
  },

  /* ---------- Écran et affichage ---------- */
  {
    id: "ecran-pas-de-signal", titre: "« Aucun signal » à l'écran", cats: ["ecran"], icone: "📡", niveau: 1,
    symptome: "L'écran est allumé mais affiche « Aucun signal » ou se met en veille.",
    causes: ["Câble branché sur la carte mère au lieu de la carte graphique", "Mauvaise source sur l'écran", "Câble ou port défectueux", "RAM ou carte graphique mal insérée"],
    verifs: ["Le PC est-il vraiment allumé (ventilateurs, voyants) ?", "L'écran fonctionne-t-il avec un autre appareil ?"],
    etapes: ["Brancher l'écran sur la carte graphique dédiée si elle existe (prises horizontales en bas).", "Sélectionner la bonne entrée sur l'écran (HDMI 1, DisplayPort…).", "Essayer un autre câble et un autre port.", "PC débranché : vérifier l'alimentation PCIe de la carte graphique et réinsérer la RAM.", "Tester sur un autre écran ou une TV."],
    precautions: ["Ne pas ouvrir l'écran : son alimentation interne est dangereuse."],
    diag: { type: "pc", id: "pc-ecran-noir" }
  },
  {
    id: "ecran-noir-windows", titre: "Écran noir après le démarrage de Windows", cats: ["ecran", "windows"], icone: "🪟", niveau: 2,
    symptome: "Le logo s'affiche, puis l'écran reste noir (avec ou sans curseur).",
    causes: ["Pilote graphique", "Affichage envoyé vers un autre écran", "Explorateur Windows bloqué"],
    verifs: ["Le curseur de la souris est-il visible ?", "Un second écran ou une TV est-il branché ?"],
    etapes: ["Appuyer sur Windows + Ctrl + Maj + B (réinitialise le pilote graphique).", "Appuyer sur Windows + P pour changer de mode d'affichage.", "Ctrl + Alt + Suppr > Gestionnaire des tâches > Exécuter une nouvelle tâche > explorer.exe.", "Démarrer en mode sans échec et réinstaller le pilote graphique depuis le site du fabricant."],
    precautions: ["Ne pas forcer l'arrêt pendant une mise à jour en cours."],
    diag: { type: "pc", id: "pc-ecran-noir" }
  },

  /* ---------- Windows et logiciels ---------- */
  {
    id: "win-lenteur", titre: "Accélérer un PC Windows lent", cats: ["windows"], icone: "🐢", niveau: 1,
    symptome: "Démarrage long, programmes lents à s'ouvrir, blocages.",
    causes: ["Trop d'applications au démarrage", "Disque presque plein", "RAM insuffisante", "Disque dur mécanique (HDD)", "Logiciel indésirable"],
    verifs: ["Ouvrir le Gestionnaire des tâches (Ctrl + Maj + Échap) et observer Processeur, Mémoire, Disque", "Vérifier l'espace libre dans Paramètres > Système > Stockage"],
    etapes: ["Désactiver les applications de démarrage inutiles (Gestionnaire des tâches > Applications de démarrage).", "Désinstaller les logiciels inutiles.", "Libérer de l'espace disque (garder au moins 10 à 15 % libre).", "Installer les mises à jour Windows puis redémarrer.", "Lancer une analyse antivirus complète.", "Si Windows est sur un disque dur mécanique, envisager un passage au SSD."],
    precautions: ["Ne pas installer de logiciels « d'optimisation » ou « nettoyeurs de registre » trouvés au hasard : certains sont indésirables.", "Sauvegarder vos fichiers avant tout changement de disque."],
    diag: { type: "pc", id: "pc-lent" }
  },
  {
    id: "win-malware", titre: "Supprimer un logiciel publicitaire ou malveillant", cats: ["windows"], icone: "🛡️", niveau: 1,
    symptome: "Publicités envahissantes, page d'accueil modifiée, logiciels inconnus, PC lent.",
    causes: ["Logiciel gratuit installé avec des « bonus » indésirables", "Extension de navigateur malveillante", "Pièce jointe ou téléchargement douteux"],
    verifs: ["Lister les logiciels installés récemment", "Vérifier les extensions du navigateur"],
    etapes: ["Désinstaller les logiciels inconnus (Paramètres > Applications, tri par date).", "Supprimer les extensions inconnues et réinitialiser le navigateur.", "Sécurité Windows : lancer une analyse complète.", "Puis lancer l'« Analyse Microsoft Defender hors ligne ».", "Changer ensuite vos mots de passe importants depuis un appareil sain et activer la double authentification."],
    precautions: ["Ne jamais rappeler un numéro affiché dans une fenêtre d'alerte « virus » : c'est une arnaque au faux support technique.", "Ne jamais donner vos mots de passe ni l'accès à distance à un inconnu."],
    diag: { type: "pc", id: "pc-lent" }
  },
  {
    id: "win-ecran-bleu", titre: "Écran bleu (BSOD) : comprendre et corriger", cats: ["windows"], icone: "💙", niveau: 2,
    symptome: "« Votre PC a rencontré un problème et doit redémarrer », avec un code d'arrêt.",
    causes: ["Pilote défectueux", "Mémoire vive instable", "Fichiers système endommagés", "Disque défaillant", "Surchauffe"],
    verifs: ["Noter ou photographier le code d'arrêt", "Se rappeler du dernier changement (matériel, pilote, mise à jour)"],
    etapes: ["Rechercher le code d'arrêt sur le site d'assistance de Microsoft.", "Annuler le dernier changement (pilote, logiciel, pièce).", "Mettre à jour Windows et les pilotes depuis les sites des fabricants.", "Invite de commandes en administrateur : sfc /scannow puis DISM /Online /Cleanup-Image /RestoreHealth.", "Tester la mémoire (Diagnostic de mémoire Windows) et l'état du disque (CrystalDiskInfo)."],
    precautions: ["Sauvegarder vos fichiers dès que possible : un écran bleu répété peut annoncer une panne de disque."],
    diag: { type: "pc", id: "pc-ecran-bleu" }
  },
  {
    id: "win-mode-sans-echec", titre: "Accéder au mode sans échec et à la récupération Windows", cats: ["windows"], icone: "🧰", niveau: 2,
    symptome: "Windows ne démarre plus correctement, écran noir ou boucle de redémarrage.",
    causes: ["Pilote ou mise à jour problématique", "Fichiers de démarrage endommagés"],
    verifs: ["Débrancher clés USB et disques externes"],
    etapes: ["Si Windows démarre : Paramètres > Système > Récupération > Démarrage avancé > Redémarrer maintenant.", "Si Windows ne démarre pas : interrompre le démarrage trois fois de suite (bouton maintenu dès le logo) pour ouvrir la réparation automatique.", "Choisir Dépannage > Options avancées.", "Outils disponibles : Outil de redémarrage système, Désinstaller des mises à jour, Restauration du système, Paramètres de démarrage (mode sans échec).", "En dernier recours seulement : Réinitialiser ce PC en conservant vos fichiers."],
    precautions: ["« Réinitialiser ce PC » supprime les applications ; l'option « Supprimer tout » efface aussi vos fichiers.", "Sauvegarder vos données avant toute réinitialisation."],
    diag: { type: "pc", id: "pc-boucle" }
  },
  {
    id: "win-son", titre: "Plus de son sous Windows", cats: ["windows"], icone: "🔇", niveau: 1,
    symptome: "Aucun son dans les haut-parleurs, le casque, l'écran ou en Bluetooth.",
    causes: ["Mauvaise sortie audio sélectionnée", "Volume coupé", "Pilote audio", "Accessoire défectueux"],
    verifs: ["Tester le casque ou les haut-parleurs sur un autre appareil", "Vérifier le volume des haut-parleurs eux-mêmes"],
    etapes: ["Icône son > choisir le bon périphérique de sortie.", "Vérifier le mélangeur de volume (clic droit sur l'icône son).", "Sur un PC fixe : utiliser la prise verte à l'arrière.", "Paramètres > Système > Son > Résoudre les problèmes de son courants.", "Réinstaller le pilote audio (Gestionnaire de périphériques ou site du fabricant)."],
    precautions: ["Baissez le volume avant de remettre un casque sur les oreilles après les tests."],
    diag: { type: "pc", id: "pc-son" }
  },
  {
    id: "usb-peripherique", titre: "Périphérique USB non reconnu", cats: ["windows"], icone: "🔌", niveau: 1,
    symptome: "Souris, clavier, clé ou manette USB ne répond pas ou « Périphérique USB non reconnu ».",
    causes: ["Câble ou périphérique défectueux", "Pilote", "Hub non alimenté", "Veille sélective USB"],
    verifs: ["Tester sur un autre port, à l'arrière du PC", "Tester sur un autre ordinateur"],
    etapes: ["Faire un arrêt complet (Maj + Arrêter) puis rallumer.", "Gestionnaire de périphériques : désinstaller le périphérique, le débrancher, redémarrer, le rebrancher.", "Installer le pilote ou le logiciel du fabricant.", "Désactiver la suspension sélective USB dans les options d'alimentation.", "Installer les pilotes chipset de la carte mère si plusieurs ports ne marchent plus."],
    precautions: ["Si un périphérique fait planter tous les ports dès qu'on le branche, ne plus l'utiliser : il peut être en court-circuit."],
    diag: { type: "pc", id: "pc-usb" }
  },

  /* ---------- Stockage et sauvegarde ---------- */
  {
    id: "stock-sauvegarde", titre: "Sauvegarder ses données avant une réparation", cats: ["stockage"], icone: "🗂️", niveau: 1,
    symptome: "Avant une manipulation risquée (réinitialisation, changement de disque, réparation).",
    causes: ["Toute intervention sur le système ou le disque peut entraîner une perte de données"],
    verifs: ["Repérer où sont vos fichiers importants (Documents, Images, Bureau, sauvegardes de jeux)", "Prévoir un support avec assez d'espace"],
    etapes: ["Copier vos dossiers importants sur un disque externe ou une clé USB.", "Ou utiliser un service de stockage en ligne.", "Vérifier que les copies s'ouvrent correctement.", "Noter vos licences de logiciels et identifiants de comptes (dans un gestionnaire de mots de passe, pas sur un papier qui traîne).", "Idéalement, garder deux copies sur deux supports différents."],
    precautions: ["Si le disque fait des clics ou n'est plus reconnu, ne multipliez pas les tentatives : contactez un spécialiste de la récupération de données."]
  },
  {
    id: "stock-sante-disque", titre: "Vérifier la santé d'un SSD ou d'un disque dur", cats: ["stockage"], icone: "🩺", niveau: 2,
    symptome: "Lenteurs, écrans bleus, fichiers corrompus, bruits du disque.",
    causes: ["Usure normale", "Secteurs défectueux", "Surchauffe du SSD"],
    verifs: ["Écouter le disque (clics, grattements)", "Repérer les messages d'erreur de lecture"],
    etapes: ["Installer un utilitaire gratuit comme CrystalDiskInfo.", "Lire l'état SMART : « Bon », « Prudence » ou « Mauvais ».", "En cas de « Prudence » ou « Mauvais » : sauvegarder immédiatement.", "Prévoir le remplacement du disque.", "Consulter aussi l'outil du fabricant du disque s'il en propose un."],
    precautions: ["Un disque qui émet des clics doit être éteint : chaque démarrage peut aggraver les dommages."],
    diag: { type: "pc", id: "pc-disque" }
  },
  {
    id: "stock-disque-invisible", titre: "Disque non détecté : BIOS et Gestion des disques", cats: ["stockage"], icone: "💾", niveau: 2,
    symptome: "Le disque n'apparaît plus dans l'Explorateur ou le BIOS.",
    causes: ["Lettre de lecteur manquante", "Câble SATA débranché", "SSD M.2 mal inséré ou emplacement incompatible", "Disque défaillant"],
    verifs: ["Le disque est-il visible dans le BIOS ?", "Apparaît-il dans la Gestion des disques (clic droit sur Démarrer) ?"],
    etapes: ["Dans la Gestion des disques, attribuer une lettre si la partition est saine (aucune donnée effacée).", "PC débranché : vérifier câbles SATA données et alimentation, ou la fixation du SSD M.2.", "Lire le manuel de la carte mère : certains emplacements M.2 désactivent des ports SATA.", "Tester le disque sur un autre PC avec un boîtier USB."],
    precautions: ["Ne jamais initialiser ni formater un disque qui contient des données que vous voulez garder."],
    diag: { type: "pc", id: "pc-disque" }
  },

  /* ---------- Réseau et Internet ---------- */
  {
    id: "reseau-box", titre: "Plus d'Internet : box et ligne", cats: ["reseau"], icone: "📶", niveau: 1,
    symptome: "Aucun appareil n'a Internet, ou un seul appareil en câble.",
    causes: ["Box bloquée", "Incident opérateur", "Câble ou port défectueux"],
    verifs: ["Les autres appareils ont-ils Internet ?", "État des voyants de la box"],
    etapes: ["Redémarrer la box : débrancher l'alimentation environ une minute, rebrancher, patienter.", "Vérifier les câbles (fibre, téléphone, Ethernet) sans les plier.", "Changer de câble Ethernet et de port.", "Consulter l'assistance de l'opérateur depuis un téléphone en données mobiles."],
    precautions: ["Ne jamais tordre un câble fibre optique.", "Ne pas réinitialiser la box aux paramètres d'usine sans savoir reconfigurer votre connexion."],
    diag: { type: "pc", id: "pc-internet" }
  },
  {
    id: "reseau-wifi", titre: "Problèmes de Wi-Fi", cats: ["reseau"], icone: "📡", niveau: 1,
    symptome: "Le PC ne voit pas le réseau, ne s'y connecte pas ou perd la connexion.",
    causes: ["Mode Avion", "Signal faible", "Profil Wi-Fi corrompu", "Pilote Wi-Fi"],
    verifs: ["Le téléphone capte-t-il bien le Wi-Fi au même endroit ?", "La clé Wi-Fi de la box est-elle à portée de main ?"],
    etapes: ["Désactiver le mode Avion et activer le Wi-Fi.", "Oublier le réseau puis s'y reconnecter.", "Se rapprocher de la box, essayer l'autre bande (2,4 / 5 GHz).", "Invite de commandes : ipconfig /release, ipconfig /renew, ipconfig /flushdns.", "Paramètres > Réseau et Internet > Paramètres réseau avancés > Réinitialisation du réseau."],
    precautions: ["La réinitialisation du réseau efface les réseaux Wi-Fi enregistrés."],
    diag: { type: "pc", id: "pc-internet" }
  },

  /* ---------- Température et ventilation ---------- */
  {
    id: "temp-depoussierage", titre: "Dépoussiérer un PC en sécurité", cats: ["temp"], icone: "🌀", niveau: 2,
    symptome: "Ventilateurs bruyants, PC qui chauffe ou s'éteint en charge.",
    causes: ["Poussière dans les radiateurs, filtres et ventilateurs"],
    verifs: ["PC éteint, débranché, et si possible à l'extérieur ou près d'une fenêtre"],
    etapes: ["Débrancher le PC et appuyer sur le bouton pour vider l'électricité résiduelle.", "Ouvrir le panneau latéral, retirer et rincer les filtres anti-poussière s'ils sont amovibles (bien sécher).", "Souffler par petites impulsions avec une bombe d'air sec, bombe tenue droite.", "Bloquer chaque ventilateur avec un doigt pendant le soufflage.", "Nettoyer les grilles extérieures, puis refermer."],
    precautions: ["Pas d'aspirateur directement sur les composants (électricité statique).", "Ne pas souffler dans le bloc d'alimentation en l'ouvrant : seulement par ses grilles extérieures.", "Sur un portable, préférer les grilles extérieures ou un professionnel."],
    diag: { type: "pc", id: "pc-chauffe" }
  },
  {
    id: "temp-surveiller", titre: "Surveiller les températures du PC", cats: ["temp"], icone: "🌡️", niveau: 2,
    symptome: "Arrêts en jeu, lenteurs sous charge, ventilateurs au maximum.",
    causes: ["Refroidissement insuffisant", "Pâte thermique sèche", "Ventilateur arrêté"],
    verifs: ["Tous les ventilateurs tournent-ils ?", "Le PC est-il dans un endroit aéré ?"],
    etapes: ["Installer HWMonitor ou HWiNFO (gratuits).", "Relever les températures au repos puis après 10 minutes de jeu.", "Comparer avec la température maximale indiquée par le fabricant du processeur ou de la carte graphique.", "Si c'est trop chaud : dépoussiérer, améliorer le flux d'air, vérifier les ventilateurs.", "Remplacement de la pâte thermique : réservé aux personnes à l'aise avec le démontage."],
    precautions: ["Ne pas désactiver les protections thermiques du BIOS."],
    diag: { type: "pc", id: "pc-chauffe" }
  },

  /* ---------- PlayStation ---------- */
  {
    id: "co-ps-allumage", titre: "PS4 / PS5 qui ne s'allume plus", cats: ["ps", "alim"], icone: "🎮", niveau: 1,
    symptome: "Aucune réaction au bouton d'alimentation, ou voyant sans démarrage.",
    causes: ["Prise ou câble d'alimentation", "Console en mode repos bloquée", "Panne interne"],
    verifs: ["Tester une autre prise murale sans multiprise", "Câble enfoncé à fond à l'arrière"],
    etapes: ["Débrancher la console quelques minutes, puis rebrancher.", "Essayer un câble d'alimentation compatible en bon état.", "Maintenir le bouton d'alimentation jusqu'au deuxième bip pour accéder au mode sans échec.", "Si rien ne fonctionne : contacter l'assistance PlayStation."],
    precautions: ["Ne pas ouvrir la console : risque électrique et perte de garantie."],
    diag: { type: "console", id: "c-allume-pas", plateforme: "playstation" }
  },
  {
    id: "co-ps-mode-sans-echec", titre: "Utiliser le mode sans échec PlayStation", cats: ["ps"], icone: "🧰", niveau: 2,
    symptome: "PS4/PS5 bloquée, pas d'image, disques non lus, plantages.",
    causes: ["Logiciel système ou base de données endommagés", "Résolution vidéo incompatible"],
    verifs: ["Avoir un câble USB qui transmet les données pour la manette"],
    etapes: ["Éteindre complètement la console (voyant éteint).", "Maintenir le bouton d'alimentation : relâcher au deuxième bip (environ 7 secondes).", "Brancher la manette en USB et appuyer sur la touche PS.", "Commencer par « Redémarrer la console », puis selon le cas « Changer la sortie vidéo / la résolution » ou « Reconstruire la base de données ».", "Consulter la page officielle PlayStation sur le mode sans échec pour le détail de chaque option."],
    precautions: ["Les options « Initialiser » effacent les données de la console : vérifier vos sauvegardes avant.", "Ne jamais couper le courant pendant une opération en mode sans échec."],
    diag: { type: "console", id: "c-bloque", plateforme: "playstation" }
  },

  /* ---------- Xbox ---------- */
  {
    id: "co-xbox-allumage", titre: "Xbox qui ne démarre plus", cats: ["xbox", "alim"], icone: "🟢", niveau: 1,
    symptome: "Aucune réaction, ou démarrage incomplet.",
    causes: ["Prise ou câble", "Bloc d'alimentation externe (Xbox One d'origine)", "Blocage logiciel"],
    verifs: ["Prise murale directe", "Xbox One d'origine : voyant du bloc d'alimentation (éteint, orange ou blanc)"],
    etapes: ["Redémarrage complet : bouton Xbox de la console environ 10 secondes, débrancher, patienter au moins 10 secondes, rebrancher.", "Essayer un autre câble compatible si possible.", "Utiliser l'outil de dépannage au démarrage (boutons Couplage + Éjecter, ou Couplage seul sur Series S, puis bouton Xbox).", "Contacter l'assistance Xbox si rien ne change."],
    precautions: ["Ne pas ouvrir la console ni le bloc d'alimentation."],
    diag: { type: "console", id: "c-allume-pas", plateforme: "xbox" }
  },

  /* ---------- Nintendo ---------- */
  {
    id: "co-switch-allumage", titre: "Nintendo Switch qui ne s'allume plus", cats: ["nintendo", "alim"], icone: "🔴", niveau: 1,
    symptome: "Écran noir, aucune réaction au bouton POWER.",
    causes: ["Batterie complètement vide", "Console figée", "Chargeur non officiel ou défectueux"],
    verifs: ["Utiliser l'adaptateur secteur officiel branché au mur"],
    etapes: ["Laisser charger au moins 30 minutes, idéalement une heure.", "Maintenir POWER environ 12 secondes pour forcer l'arrêt, puis appuyer une fois.", "Essayer le mode maintenance (Volume + et − maintenus, puis POWER).", "Contacter l'assistance Nintendo si rien ne fonctionne."],
    precautions: ["Ne pas utiliser de chargeur bas de gamme non compatible.", "Ne pas ouvrir la console (batterie lithium)."],
    diag: { type: "console", id: "c-allume-pas", plateforme: "nintendo" }
  },

  /* ---------- Fiches communes aux consoles ---------- */
  {
    id: "co-pas-image", titre: "Console : pas d'image sur la TV", cats: ["ps", "xbox", "nintendo", "ecran"], icone: "📺", niveau: 1,
    symptome: "La console est allumée mais la TV n'affiche rien.",
    causes: ["Mauvaise source TV", "Câble HDMI", "Appareil intermédiaire (barre de son)", "Format vidéo incompatible", "Port HDMI endommagé"],
    verifs: ["Source de la TV", "Branchement direct sans barre de son", "Autre câble et autre entrée HDMI"],
    etapes: ["PlayStation : mode sans échec > Changer la sortie vidéo / la résolution.", "Xbox : console éteinte, maintenir Xbox + Éjecter (Series S : Couplage) jusqu'au deuxième bip pour démarrer en basse résolution.", "Switch : débrancher le dock 30 secondes, rebrancher dans l'ordre secteur > HDMI > console. La Switch Lite ne sort pas sur TV.", "Inspecter le port HDMI de la console avec une lampe."],
    precautions: ["Port HDMI abîmé : réparation par un professionnel (micro-soudure)."],
    diag: { type: "console", id: "c-pas-image" }
  },
  {
    id: "co-surchauffe", titre: "Console qui chauffe ou fait du bruit", cats: ["ps", "xbox", "nintendo", "temp"], icone: "🔥", niveau: 1,
    symptome: "Message de température, ventilateur bruyant, arrêts.",
    causes: ["Meuble fermé ou aérations bouchées", "Poussière", "Pièce chaude"],
    verifs: ["Espace libre autour de la console", "Pas de source de chaleur à proximité"],
    etapes: ["Installer la console dans un endroit dégagé.", "Console éteinte et débranchée : dépoussiérer les grilles extérieures (bombe d'air sec ou aspirateur avec brosse).", "PS5 : suivre la procédure officielle Sony pour retirer les caches et aspirer les récupérateurs de poussière.", "Switch : retirer la coque de protection en jeu, laisser le dock aéré.", "Mettre à jour le logiciel système."],
    precautions: ["Ne pas ouvrir la console au-delà de ce que le fabricant autorise.", "PS5 : ne jamais toucher au dissipateur ni au métal liquide."],
    diag: { type: "console", id: "c-surchauffe" }
  },
  {
    id: "co-lecteur", titre: "Disque ou cartouche non lu", cats: ["ps", "xbox", "nintendo"], icone: "💿", niveau: 1,
    symptome: "Jeu non reconnu, message d'erreur, disque bloqué.",
    causes: ["Disque sale ou rayé", "Jeu incompatible", "Logiciel système", "Lecteur défectueux", "Modèle sans lecteur"],
    verifs: ["Tester un autre jeu", "Vérifier la compatibilité du jeu avec la console"],
    etapes: ["Nettoyer le disque avec une microfibre, du centre vers l'extérieur.", "Mettre à jour et redémarrer complètement la console.", "PlayStation : reconstruire la base de données en mode sans échec.", "Xbox : effacer le stockage persistant Blu-ray dans les paramètres.", "Switch : réinsérer la cartouche, tester une autre cartouche, mettre à jour.", "Disque coincé : suivre uniquement la procédure officielle d'éjection."],
    precautions: ["Ne jamais introduire d'objet dans la fente du lecteur.", "Ne pas insérer un disque fissuré."],
    diag: { type: "console", id: "c-lecteur" }
  },
  {
    id: "co-internet", titre: "Console : problèmes de connexion", cats: ["ps", "xbox", "nintendo", "reseau"], icone: "🌐", niveau: 1,
    symptome: "Connexion impossible, lente, ou jeu en ligne qui ne fonctionne pas.",
    causes: ["Box", "Wi-Fi trop faible", "Panne du service en ligne", "Abonnement expiré", "NAT restrictif"],
    verifs: ["Les autres appareils ont-ils Internet ?", "La page d'état du service en ligne signale-t-elle une panne ?"],
    etapes: ["Lancer le test de connexion intégré de la console.", "Redémarrer la box et la console.", "Supprimer puis reconfigurer le Wi-Fi.", "Rapprocher la console de la box ou passer en câble Ethernet.", "Vérifier l'abonnement nécessaire au jeu en ligne."],
    precautions: ["Ne jamais communiquer vos identifiants à une personne qui prétend réparer votre compte."],
    diag: { type: "console", id: "c-internet" }
  },
  {
    id: "co-blocages", titre: "Console qui plante ou redémarre", cats: ["ps", "xbox", "nintendo"], icone: "🧊", niveau: 2,
    symptome: "Écran figé, retours au menu, redémarrages inattendus.",
    causes: ["Jeu ou logiciel système pas à jour", "Stockage plein", "Données endommagées", "Surchauffe", "Carte microSD défectueuse (Switch)"],
    verifs: ["Le problème touche-t-il un seul jeu ou tous ?", "Espace de stockage disponible"],
    etapes: ["Mettre à jour le jeu et la console.", "Libérer de l'espace de stockage.", "Redémarrage complet.", "PlayStation : reconstruire la base de données. Xbox : réinitialiser en conservant jeux et applications. Switch : retirer la microSD, puis mode maintenance si nécessaire.", "Contacter l'assistance avant toute initialisation complète."],
    precautions: ["Vérifier que vos sauvegardes sont synchronisées avant toute réinitialisation."],
    diag: { type: "console", id: "c-bloque" }
  },
  {
    id: "co-manette", titre: "Manette qui ne se connecte plus", cats: ["ps", "xbox", "nintendo"], icone: "🕹️", niveau: 1,
    symptome: "Manette éteinte, non reconnue, déconnexions ou stick qui dérive.",
    causes: ["Batterie ou piles vides", "Appairage perdu", "Câble de charge seulement (sans données)", "Usure du stick"],
    verifs: ["Charger la manette avec un câble qui transmet les données", "Tester une autre manette"],
    etapes: ["PlayStation : brancher en USB et appuyer sur PS ; réinitialiser via le petit trou au dos (près de L2).", "Xbox : bouton Couplage de la console, puis bouton Couplage de la manette jusqu'au clignotement rapide.", "Switch : fixer les Joy-Con à la console, ou Manettes > Changer style/ordre ; bouton SYNC pour réinitialiser.", "Mettre à jour la manette depuis les paramètres de la console.", "Dérive : étalonner (Switch), souffler autour du stick, puis garantie ou réparation."],
    precautions: ["Le remplacement d'un stick nécessite souvent de la soudure."],
    diag: { type: "console", id: "c-manette" }
  }
];
