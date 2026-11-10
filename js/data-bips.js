/* =========================================================
   Nicotch — données du décodeur de bips BIOS
   motif : C = bip court, L = bip long, | = petite pause entre deux séries
   boucle : true si le motif se répète en continu
   niv : "ok" (normal), "moyen" (à vérifier), "fort" (le PC ne démarrera pas)
   Pour ajouter un code : copier une ligne et l'adapter.
   ========================================================= */
(function () {
  "use strict";

  var RAM = "pc-bips-ram";

  window.ND = window.ND || {};
  window.ND.BIPS = {
    familles: [
      {
        id: "uefi", nom: "Carte mère récente (UEFI)", ico: "🆕",
        sous: "ASUS, MSI, Gigabyte, ASRock… à partir de 2012 environ",
        note: "Codes donnés par les manuels ASUS. Les autres marques récentes utilisent des codes très proches, mais vérifiez le manuel de votre carte mère.",
        codes: [
          { motif: "C", niv: "ok", sens: "Démarrage normal", cause: "Le test de démarrage (POST) est réussi : la carte graphique est détectée.", faire: ["Rien à faire si l'image s'affiche.", "Si l'écran reste noir : vérifiez le câble vidéo et que l'écran est branché sur la carte graphique, pas sur la carte mère."] },
          { motif: "L C C", boucle: true, niv: "fort", sens: "Aucune mémoire (RAM) détectée", cause: "Barrette absente, mal enfoncée, sale ou défectueuse.", faire: ["Débranchez le PC, puis retirez et remettez chaque barrette jusqu'au double « clic ».", "Essayez une seule barrette, dans le slot conseillé par le manuel (souvent A2).", "Nettoyez les contacts dorés avec une gomme blanche si besoin."], fiche: RAM },
          { motif: "L C C C", niv: "fort", sens: "Aucune carte graphique détectée", cause: "Carte graphique mal enfoncée, alimentation PCIe non branchée, ou processeur sans puce graphique.", faire: ["Vérifiez que la carte graphique est bien clipsée dans son slot.", "Vérifiez les câbles d'alimentation PCIe (6 ou 8 broches).", "Si votre processeur a une puce graphique, essayez l'écran sur la sortie vidéo de la carte mère."] },
          { motif: "L C C C C", niv: "fort", sens: "Composant matériel défaillant", cause: "Une pièce ne répond pas correctement (processeur, carte mère, périphérique…).", faire: ["Débranchez tout ce qui n'est pas indispensable (disques, USB, cartes d'extension).", "Redémarrez avec le minimum : carte mère, processeur, une barrette, la carte graphique.", "Rebranchez ensuite les éléments un par un pour trouver le coupable."] }
        ]
      },
      {
        id: "ami", nom: "AMI (ancien BIOS)", ico: "🅰️",
        sous: "American Megatrends : écran de démarrage « AMIBIOS », PC des années 90 à 2010",
        note: "Codes classiques AMI. Selon la version, le sens d'un code peut varier légèrement.",
        codes: [
          { motif: "C", niv: "ok", sens: "Démarrage normal (sur la plupart des PC)", cause: "Si le PC démarre ensuite, tout va bien. S'il reste bloqué : erreur de rafraîchissement de la mémoire.", faire: ["PC bloqué : retirez et remettez les barrettes de RAM."], fiche: RAM },
          { motif: "C C", niv: "fort", sens: "Erreur de parité mémoire", cause: "Mémoire (RAM) défectueuse ou mal enfoncée.", faire: ["Remettez les barrettes en place.", "Testez-les une par une."], fiche: RAM },
          { motif: "C C C", niv: "fort", sens: "Échec des 64 premiers Ko de mémoire", cause: "Mémoire (RAM) défectueuse.", faire: ["Testez les barrettes une par une.", "Essayez un autre slot."], fiche: RAM },
          { motif: "C C C C", niv: "fort", sens: "Horloge système (timer) en panne", cause: "Problème sur la carte mère.", faire: ["Réinitialisez le BIOS (pile CMOS retirée 5 minutes, PC débranché).", "Si le code revient : carte mère probablement à remplacer."] },
          { motif: "C C C C C", niv: "fort", sens: "Erreur du processeur", cause: "Processeur mal installé, broches abîmées ou processeur défectueux.", faire: ["Vérifiez le montage du ventirad et du processeur.", "Regardez si des broches sont tordues (socket ou processeur)."] },
          { motif: "C C C C C C", niv: "fort", sens: "Contrôleur clavier / Gate A20", cause: "Clavier ou carte mère.", faire: ["Débranchez le clavier et redémarrez.", "Essayez un autre clavier."] },
          { motif: "C C C C C C C", niv: "fort", sens: "Exception du processeur (mode virtuel)", cause: "Processeur ou carte mère.", faire: ["Vérifiez l'installation du processeur.", "Réinitialisez le BIOS."] },
          { motif: "C C C C C C C C", niv: "fort", sens: "Erreur de mémoire vidéo", cause: "Carte graphique défectueuse ou mal enfoncée.", faire: ["Remettez la carte graphique en place.", "Essayez une autre carte graphique si possible."] },
          { motif: "C C C C C C C C C", niv: "fort", sens: "Erreur de somme de contrôle du BIOS", cause: "Puce du BIOS corrompue.", faire: ["Réinitialisez le BIOS.", "Si la carte le permet, utilisez la fonction de récupération ou le BIOS de secours."] },
          { motif: "C C C C C C C C C C", niv: "moyen", sens: "Erreur du registre CMOS", cause: "Pile CMOS ou carte mère.", faire: ["Remplacez la pile CMOS (souvent une CR2032).", "Réinitialisez le BIOS."] },
          { motif: "C C C C C C C C C C C", niv: "moyen", sens: "Erreur de mémoire cache", cause: "Mémoire cache du processeur ou de la carte mère.", faire: ["Désactivez le cache externe dans le BIOS si l'option existe.", "Vérifiez le processeur."] },
          { motif: "L C C", niv: "fort", sens: "Carte graphique non détectée", cause: "Carte graphique absente, mal enfoncée ou défectueuse.", faire: ["Remettez la carte graphique en place.", "Vérifiez son alimentation."] },
          { motif: "L C C C", niv: "fort", sens: "Erreur mémoire (RAM ou mémoire vidéo)", cause: "Barrette de RAM ou mémoire de la carte graphique.", faire: ["Testez les barrettes une par une.", "Remettez la carte graphique en place."], fiche: RAM },
          { motif: "L C C C C C C C C", niv: "fort", sens: "Échec du test d'affichage", cause: "Carte graphique ou écran.", faire: ["Vérifiez le câble et l'écran.", "Remettez la carte graphique en place."] }
        ]
      },
      {
        id: "award", nom: "Award / Phoenix-Award", ico: "🅿️",
        sous: "Écran « Award Modular BIOS » ou « Phoenix - AwardBIOS », anciennes cartes Gigabyte",
        note: "Codes Award les plus courants. Lisez aussi le message affiché à l'écran s'il y en a un.",
        codes: [
          { motif: "C", niv: "ok", sens: "Démarrage normal", cause: "Aucune erreur détectée.", faire: ["Rien à faire si l'image s'affiche."] },
          { motif: "C C", niv: "moyen", sens: "Erreur non bloquante (souvent les réglages CMOS)", cause: "Le détail s'affiche à l'écran.", faire: ["Lisez le message à l'écran.", "Entrez dans le BIOS et chargez les réglages par défaut (« Load Optimized Defaults »).", "Si l'heure se dérègle : remplacez la pile CMOS."] },
          { motif: "L", niv: "fort", sens: "Erreur de mémoire (RAM)", cause: "Barrette mal enfoncée ou défectueuse.", faire: ["Remettez les barrettes en place.", "Testez-les une par une."], fiche: RAM },
          { motif: "L", boucle: true, niv: "fort", sens: "Mémoire non détectée", cause: "Barrette absente ou mal enfoncée.", faire: ["Retirez et remettez chaque barrette jusqu'au « clic ».", "Essayez un autre slot."], fiche: RAM },
          { motif: "L C", niv: "fort", sens: "Erreur de carte mère (ou de mémoire)", cause: "Carte mère ou RAM.", faire: ["Testez avec une seule barrette.", "Réinitialisez le BIOS."] },
          { motif: "L C C", niv: "fort", sens: "Erreur de carte graphique", cause: "Carte graphique mal enfoncée ou défectueuse, ou écran.", faire: ["Remettez la carte graphique en place.", "Vérifiez le câble de l'écran."] },
          { motif: "L C C C", niv: "fort", sens: "Clavier ou carte graphique", cause: "Selon la version du BIOS : contrôleur clavier ou carte graphique.", faire: ["Débranchez et rebranchez le clavier.", "Remettez la carte graphique en place."] },
          { motif: "L C C C C C C C C C", niv: "fort", sens: "Erreur de la puce du BIOS", cause: "BIOS corrompu (mise à jour ratée…).", faire: ["Réinitialisez le BIOS.", "Utilisez la fonction de récupération du BIOS si la carte en a une."] },
          { motif: "C", boucle: true, niv: "fort", sens: "Problème d'alimentation", cause: "Alimentation insuffisante ou défectueuse.", faire: ["Vérifiez les câbles ATX 24 broches et CPU 4/8 broches.", "Testez avec une autre alimentation si possible."] }
        ]
      },
      {
        id: "dell", nom: "Dell (portables)", ico: "💻",
        sous: "Inspiron, XPS, Vostro, Latitude, Precision : comptez les bips de chaque série",
        note: "Codes officiels Dell pour les portables. La série de bips se répète (elle peut aussi apparaître en clignotements de voyant).",
        codes: [
          { motif: "C", boucle: true, niv: "fort", sens: "Panne de la ROM du BIOS", cause: "BIOS corrompu ou erreur de ROM.", faire: ["Lancez le diagnostic Dell avant démarrage (touche F12 > Diagnostics).", "Tentez une récupération du BIOS (voir le site Dell)."] },
          { motif: "C C", boucle: true, niv: "fort", sens: "Aucune mémoire (RAM) détectée", cause: "Barrette absente ou mal enfoncée.", faire: ["Retirez et remettez les barrettes.", "Essayez une seule barrette."], fiche: RAM },
          { motif: "C C C", boucle: true, niv: "fort", sens: "Erreur du chipset", cause: "Carte mère (horloge, contrôleur clavier…).", faire: ["Lancez le diagnostic Dell avant démarrage.", "Si l'erreur persiste : réparation de la carte mère."] },
          { motif: "C C C C", boucle: true, niv: "fort", sens: "Erreur de lecture/écriture de la mémoire", cause: "Barrette de RAM défectueuse.", faire: ["Testez les barrettes une par une.", "Remplacez la barrette fautive."], fiche: RAM },
          { motif: "C C C C C", boucle: true, niv: "moyen", sens: "Panne d'alimentation de l'horloge (pile CMOS)", cause: "Pile CMOS vide.", faire: ["Réinitialisez le BIOS.", "Remplacez la pile CMOS."] },
          { motif: "C C C C C C", boucle: true, niv: "fort", sens: "Panne de la carte ou de la puce graphique", cause: "Partie vidéo défectueuse.", faire: ["Lancez le diagnostic Dell avant démarrage.", "Branchez un écran externe pour comparer."] },
          { motif: "C C C C C C C", boucle: true, niv: "fort", sens: "Panne du processeur", cause: "Processeur défectueux.", faire: ["Lancez le diagnostic Dell avant démarrage.", "Contactez le support Dell."] },
          { motif: "C C C C C C C C", boucle: true, niv: "fort", sens: "Panne de l'écran (LCD)", cause: "Dalle ou nappe de l'écran (anciens modèles).", faire: ["Branchez un écran externe : s'il affiche, la dalle ou la nappe est en cause."] }
        ]
      },
      {
        id: "mac", nom: "Mac (Apple)", ico: "🍎",
        sous: "Mac Intel avec bips au démarrage",
        note: "Codes Apple des Mac Intel.",
        codes: [
          { motif: "C", boucle: true, niv: "fort", sens: "Aucune mémoire (RAM) installée", cause: "Un bip toutes les 5 secondes : la RAM est absente ou non détectée.", faire: ["Vérifiez que les barrettes sont bien en place (modèles à RAM amovible)."] },
          { motif: "C C C", boucle: true, niv: "fort", sens: "Mémoire défectueuse", cause: "Trois bips, pause, trois bips : la RAM a échoué au test.", faire: ["Remettez ou remplacez les barrettes (modèles à RAM amovible).", "Sinon : réparation chez Apple ou un réparateur."] },
          { motif: "L L L | C C | L L L", niv: "fort", sens: "Erreur de la ROM EFI / mode de récupération", cause: "Le micrologiciel du Mac est en cours de récupération ou endommagé.", faire: ["Attendez la fin de la récupération si elle est en cours.", "Sinon : contactez Apple."] }
        ]
      }
    ],

    voyants: [
      { nom: "CPU", couleur: "#F21B24", sens: "Processeur non détecté ou défaillant.", faire: "Vérifiez le câble CPU 4/8 broches, le montage du processeur et le ventirad." },
      { nom: "DRAM", couleur: "#F2B45A", sens: "Mémoire (RAM) non détectée ou défaillante.", faire: "Remettez les barrettes en place, essayez-en une seule dans le slot conseillé." },
      { nom: "VGA", couleur: "#FFFFFF", sens: "Carte graphique non détectée.", faire: "Remettez la carte graphique en place et vérifiez ses câbles PCIe." },
      { nom: "BOOT", couleur: "#16C47F", sens: "Aucun disque de démarrage trouvé.", faire: "Vérifiez le disque (câble, slot M.2) et l'ordre de démarrage dans le BIOS." }
    ]
  };
})();
