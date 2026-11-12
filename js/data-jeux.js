/* =========================================================
   Nicotch — catalogue des JEUX
   ---------------------------------------------------------
   POUR AJOUTER UN JEU (Claude peut le faire pour toi) :
   1. Crée un dossier dans « jeux/ » avec un nom simple, sans espace
      ni accent, par exemple :  jeux/space-runner/
   2. Mets dedans les fichiers du jeu. La page principale doit
      s'appeler  index.html  ->  jeux/space-runner/index.html
   3. (Facultatif) Ajoute une image d'aperçu dans le même dossier :
      jeux/space-runner/apercu.png   (format paysage, ex. 800 × 450)
   4. Ajoute une fiche ci-dessous, entre les crochets [ ], en copiant
      le modèle. Attention aux virgules entre deux fiches.

   Champs :
     id          nom du dossier (identique au dossier dans jeux/)
     titre       nom du jeu affiché
     description une ou deux phrases
     genre       ex. "Arcade", "Réflexion", "Action", "Adresse"
     icone       un emoji, utilisé s'il n'y a pas d'image d'aperçu
     apercu      chemin de l'image (ou "" si aucune)
     commandes   comment on joue (clavier, souris, tactile)
     mobile      true si le jeu se joue au doigt sur téléphone, sinon false
     format      "paysage" (16/9, par défaut) ou "portrait" (9/16) : forme de la zone de jeu
     date        date d'ajout au format "AAAA-MM-JJ" (sert à trier, le plus récent d'abord)
     affiche     (facultatif) affiche verticale ou carrée du jeu, affichée sur sa page
     scores      true si le jeu envoie son score au tableau des scores en ligne
     varianteScores (facultatif) classement affiché par défaut (ex. piste « normal »)
     variantesScores (facultatif) onglets du classement : [[id, nom], …]
     scoreInverse   (facultatif) true si le plus PETIT score gagne (ex. nombre de coups)
     uniteScore     (facultatif) unité affichée après le score (ex. « coups »)
     manette     true si le jeu se joue aussi à la manette
     trilogie    1, 2 ou 3 : place du jeu dans la trilogie Last Track (bloc spécial)
     bientot     true = jeu annoncé mais pas encore jouable (carte « Bientôt disponible »,
                 sans bouton Jouer). Supprimer cette ligne le jour de la sortie.

   MODÈLE À COPIER :
   {
     id: "space-runner",
     titre: "Space Runner",
     description: "Pilote ton vaisseau et évite les astéroïdes le plus longtemps possible.",
     genre: "Arcade",
     icone: "🚀",
     apercu: "jeux/space-runner/apercu.png",
     commandes: "Flèches gauche/droite pour bouger, Espace pour tirer.",
     mobile: false,
     format: "paysage",
     date: "2026-10-26"
   }
   ========================================================= */
window.ND_JEUX = [
  {
    id: "last-track",
    scores: true,
    titre: "Last Track",
    description: "Un dernier titre maudit transforme la ville en zombies. Choisis ton perso dans la bande, balance vinyles, CD et K7, et déclenche ta Fury pour nettoyer les rues.",
    genre: "Action / Plateformes",
    icone: "🎸",
    apercu: "jeux/last-track/apercu.webp",
    affiche: "jeux/last-track/affiche.webp",
    commandes: "Clavier : Q/D ou flèches pour bouger, Espace ou Z pour sauter, clic gauche, X, K ou Ctrl pour tirer, E ou Tab pour changer d'arme, G pour lancer une K7, F pour la Fury, P ou Échap pour la pause. Manette : stick gauche, A pour sauter, X pour tirer, Y pour la Fury, Start pour la pause. Touche T dans le jeu pour voir toutes les commandes. Sur téléphone : boutons à l'écran (tourne ton téléphone à l'horizontale), touche l'écran pour continuer après une mort ou une scène.",
    mobile: true,
    manette: true,
    format: "paysage",
    trilogie: 1,
    date: "2026-11-07"
  },
  {
    id: "space-run-86",
    scores: true,
    titre: "Space Run 86",
    description: "La bande décolle ! Pilote le vaisseau de ton perso (la guitare volante de Cédric…), affronte les vagues d'ennemis en mode Aventure ou Infini, et bats ton record sur 86.0 FM.",
    genre: "Shoot'em up",
    icone: "🚀",
    apercu: "jeux/space-run-86/apercu.webp",
    affiche: "jeux/space-run-86/affiche.webp",
    commandes: "Flèches ou ZQSD pour bouger, Espace pour tirer, B pour la Fury, P pour la pause, O pour les options, M pour le son. Au menu : Gauche/Droite pour choisir le pilote, Haut/Bas pour le mode, Entrée pour décoller. Sur téléphone (à l'horizontale) : glisse ton doigt pour piloter, le tir est automatique ; bouton FURY en bas à droite.",
    mobile: true,
    manette: true,
    format: "paysage",
    trilogie: 2,
    date: "2026-11-07"
  },
  {
    id: "cover-track",
    scores: true,
    titre: "Cover Track",
    description: "Infiltre le label Tricatel zone par zone, du Hall jusqu'au Bureau du Patron. Choisis ton perso, vise et tire vinyles, CD et K7, et bats les 5 boss.",
    genre: "Action / Tir",
    icone: "💿",
    apercu: "jeux/cover-track/apercu.webp",
    affiche: "jeux/cover-track/affiche.webp",
    commandes: "Clavier + souris : ZQSD pour bouger, souris pour viser, clic gauche pour tirer, clic droit pour lancer une K7, molette pour la munition, Espace ou F pour la Fury. Clavier seul : flèches, J pour tirer, Tab ou 1-2-3 pour la munition. Manette : stick gauche pour bouger, stick droit pour viser, gâchettes pour tirer et lancer, Y pour la Fury. Touche C au menu pour voir les commandes. Sur téléphone (à l'horizontale) : pouce gauche pour bouger, pouce droit pour viser (pousse à fond pour tirer), boutons K7, ARME, FURY et pause en haut à droite.",
    mobile: true,
    manette: true,
    format: "paysage",
    trilogie: 3,
    date: "2026-11-07"
  },
  {
    id: "run-82",
    scores: true,
    varianteScores: "normal",
    variantesScores: [["easy", "Plage"], ["normal", "Campagne"], ["hard", "Montagne"], ["neon", "Nuit néon"]],
    titre: "Nicotch Run 82",
    description: "Course arcade néon façon années 80 : file sur l'autoroute en sportive rouge, frôle les voitures pour remplir ton turbo, enchaîne les combos et bats ton meilleur tour sur chaque circuit, jusqu'à Nuit Néon.",
    genre: "Course",
    icone: "🏎️",
    apercu: "jeux/run-82/apercu.webp",
    affiche: "jeux/run-82/affiche.webp",
    commandes: "Flèches ou ZQSD pour conduire, Espace ou S pour freiner, Maj ou E pour le turbo (quand la jauge est pleine), P ou Échap pour la pause. Manette : stick ou croix pour diriger, RT ou A pour accélérer, LT ou B pour freiner, X, Y ou RB pour le turbo, Start pour la pause. Sur téléphone : boutons tactiles à l'écran.",
    mobile: true,
    manette: true,
    format: "paysage",
    date: "2026-11-06"
  },
  {
    id: "sauve-la-princesse",
    scores: true,
    scoreInverse: true,
    uniteScore: "coups",
    varianteScores: "normal",
    variantesScores: [["facile", "Facile"], ["normal", "Normal"], ["difficile", "Difficile"]],
    titre: "Sauve la Princesse !",
    description: "Un chevalier, une grotte, un dragon… Choisis ton chemin, trouve l'armure, l'épée et le bouclier, réussis les épreuves, combats au tour par tour les voleurs, spectres et trolls, et affronte le dragon pour sauver la princesse.",
    genre: "Aventure",
    icone: "🐉",
    apercu: "",
    affiche: "jeux/sauve-la-princesse/affiche.webp",
    commandes: "Tout se joue à la souris : clique sur les entrées de la salle et sur les boutons de combat. Au clavier : flèches (ou G, H, D, B) pour choisir un chemin, Entrée pour valider. En combat : A pour attaquer, P pour parer, B pour une potion, F pour fuir. C pour la carte, M pour le son, F pour passer une épreuve. Cliquer une fois sur la page pour lancer le jeu. Sur téléphone (à l'horizontale) : tout se joue au doigt, avec un clavier à l'écran pour écrire le nom de ton chevalier.",
    mobile: true,
    format: "paysage",
    date: "2026-11-07"
  }
];
