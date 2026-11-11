/* =========================================================
   Nicotch — liste des TÉLÉCHARGEMENTS (logiciels gratuits)
   ---------------------------------------------------------
   Règles :
   - on n'héberge AUCUN fichier : le lien va toujours vers la page
     OFFICIELLE de l'éditeur (version à jour, pas de virus) ;
   - uniquement des logiciels gratuits (ou avec une version gratuite
     complète pour un particulier) ;
   - pas de logo de marque : chaque logiciel a une icône maison.

   Champs d'un logiciel :
     nom        nom du logiciel
     categorie  "monitoring", "tests", "utilitaires" ou "essentiels"
     icone      icône maison (voir ICONES dans js/telechargements.js) :
                cpu, gpu, capteurs, temp, disque, stress, ram, chrono,
                usb, ventilo, camembert, corbeille, demarrage, pilote,
                archive, video, bouclier
     pourquoi   à quoi il sert, en une ou deux phrases
     lien       page officielle (doit commencer par https://)
     portable   true si une version sans installation existe
     attention  (facultatif) un conseil à l'installation
   ========================================================= */
window.ND_TELECHARGEMENTS = {
  MISE_A_JOUR: "novembre 2026",
  CATEGORIES: [
    { id: "monitoring", nom: "Monitoring : voir ce qu'il y a dans le PC", icone: "capteurs",
      intro: "Identifier les pièces, surveiller les températures et l'état des disques." },
    { id: "tests", nom: "Tests et benchmarks", icone: "stress",
      intro: "Vérifier la stabilité et les performances, par exemple après un montage ou un changement de pièce." },
    { id: "utilitaires", nom: "Utilitaires de dépannage", icone: "pilote",
      intro: "Clé USB d'installation, ventilateurs, nettoyage, démarrage de Windows, pilotes graphiques." },
    { id: "essentiels", nom: "Les indispensables du quotidien", icone: "bouclier",
      intro: "Les petits logiciels à installer sur tous les PC." }
  ],
  LOGICIELS: [
    /* ---------- Monitoring ---------- */
    { nom: "CPU-Z", categorie: "monitoring", icone: "cpu", portable: true,
      pourquoi: "Affiche le modèle exact du processeur, de la carte mère et de la RAM (fréquence, timings). Le réflexe avant d'acheter une pièce compatible.",
      lien: "https://www.cpuid.com/softwares/cpu-z.html" },
    { nom: "GPU-Z", categorie: "monitoring", icone: "gpu", portable: true,
      pourquoi: "Tout sur la carte graphique : modèle, mémoire, fréquences, température et version du pilote.",
      lien: "https://www.techpowerup.com/download/techpowerup-gpu-z/" },
    { nom: "HWiNFO", categorie: "monitoring", icone: "capteurs", portable: true,
      pourquoi: "Le plus complet : toutes les températures, tensions et vitesses de ventilateurs du PC, avec les valeurs maximales. Idéal pour traquer une surchauffe.",
      lien: "https://www.hwinfo.com/download/" },
    { nom: "HWMonitor", categorie: "monitoring", icone: "temp", portable: true,
      pourquoi: "Une version plus simple de HWiNFO : températures, tensions et ventilateurs sur une seule page, facile à lire.",
      lien: "https://www.cpuid.com/softwares/hwmonitor.html" },
    { nom: "Core Temp", categorie: "monitoring", icone: "temp",
      pourquoi: "Affiche la température de chaque cœur du processeur, même dans la barre des tâches.",
      attention: "L'installeur peut proposer un logiciel en plus : décochez la case avant de continuer.",
      lien: "https://www.alcpu.com/CoreTemp/" },
    { nom: "CrystalDiskInfo", categorie: "monitoring", icone: "disque", portable: true,
      pourquoi: "Lit l'état de santé (SMART) des SSD et disques durs : « Bon », « Prudence » ou « Mauvais ». Indispensable avant qu'un disque lâche.",
      lien: "https://crystalmark.info/en/software/crystaldiskinfo/" },

    /* ---------- Tests ---------- */
    { nom: "OCCT", categorie: "tests", icone: "stress",
      pourquoi: "Teste la stabilité du processeur, de la carte graphique, de la RAM et de l'alimentation. Gratuit pour un usage personnel.",
      lien: "https://www.ocbase.com/" },
    { nom: "MemTest86", categorie: "tests", icone: "ram",
      pourquoi: "Teste la RAM en profondeur au démarrage, depuis une clé USB. Le juge de paix en cas d'écrans bleus aléatoires.",
      lien: "https://www.memtest86.com/download.htm" },
    { nom: "CrystalDiskMark", categorie: "tests", icone: "chrono", portable: true,
      pourquoi: "Mesure la vitesse de lecture et d'écriture d'un SSD ou d'un disque. Pratique pour vérifier qu'un SSD NVMe donne bien ses performances.",
      lien: "https://crystalmark.info/en/software/crystaldiskmark/" },
    { nom: "Cinebench", categorie: "tests", icone: "chrono",
      pourquoi: "Le benchmark de référence pour comparer la puissance d'un processeur, et vérifier qu'il ne chauffe pas trop sous charge.",
      lien: "https://www.maxon.net/en/cinebench" },

    /* ---------- Utilitaires ---------- */
    { nom: "Rufus", categorie: "utilitaires", icone: "usb", portable: true,
      pourquoi: "Crée une clé USB d'installation de Windows ou de Linux en quelques clics, à partir d'un fichier ISO.",
      lien: "https://rufus.ie/fr/" },
    { nom: "Ventoy", categorie: "utilitaires", icone: "usb", portable: true,
      pourquoi: "Une seule clé USB pour plusieurs systèmes : il suffit d'y copier les fichiers ISO, et on choisit au démarrage. Le couteau suisse du réparateur.",
      lien: "https://www.ventoy.net/en/download.html" },
    { nom: "Fan Control", categorie: "utilitaires", icone: "ventilo", portable: true,
      pourquoi: "Règle la vitesse des ventilateurs selon les températures du processeur ou de la carte graphique, pour un PC plus silencieux.",
      lien: "https://getfancontrol.com/" },
    { nom: "WizTree", categorie: "utilitaires", icone: "camembert", portable: true,
      pourquoi: "Montre en quelques secondes ce qui remplit le disque, avec une carte des plus gros dossiers et fichiers.",
      lien: "https://diskanalyzer.com/" },
    { nom: "Revo Uninstaller Free", categorie: "utilitaires", icone: "corbeille",
      pourquoi: "Désinstalle un logiciel et supprime aussi les restes oubliés par la désinstallation de Windows.",
      lien: "https://www.revouninstaller.com/revo-uninstaller-free-download/" },
    { nom: "Autoruns", categorie: "utilitaires", icone: "demarrage", portable: true,
      pourquoi: "L'outil de Microsoft qui liste tout ce qui se lance au démarrage de Windows. Parfait pour un PC lent à démarrer.",
      attention: "Outil avancé : ne décochez que ce que vous connaissez.",
      lien: "https://learn.microsoft.com/fr-fr/sysinternals/downloads/autoruns" },
    { nom: "DDU (Display Driver Uninstaller)", categorie: "utilitaires", icone: "pilote", portable: true,
      pourquoi: "Supprime complètement les pilotes graphiques NVIDIA, AMD ou Intel. À utiliser avant de changer de carte graphique ou en cas de bugs d'affichage.",
      attention: "À lancer de préférence en mode sans échec, en suivant les consignes du site.",
      lien: "https://www.wagnardsoft.com/display-driver-uninstaller-DDU-" },

    /* ---------- Essentiels ---------- */
    { nom: "7-Zip", categorie: "essentiels", icone: "archive",
      pourquoi: "Ouvre et crée tous les fichiers compressés (ZIP, RAR, 7z…). Gratuit, léger et sans publicité.",
      lien: "https://www.7-zip.org/" },
    { nom: "VLC", categorie: "essentiels", icone: "video",
      pourquoi: "Lit toutes les vidéos et musiques sans rien installer d'autre.",
      lien: "https://www.videolan.org/vlc/" },
    { nom: "Malwarebytes Free", categorie: "essentiels", icone: "bouclier",
      pourquoi: "Un deuxième avis contre les virus et logiciels indésirables, en complément de l'antivirus de Windows. La version gratuite analyse et nettoie à la demande.",
      lien: "https://www.malwarebytes.com/mwb-download" }
  ]
};
