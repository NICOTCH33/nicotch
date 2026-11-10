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
                 "gpu", "cpu", "ram", "stockage", "alim", "refroidissement",
                 "ecrans", "clavier-souris", "audio", "manettes"
     pourquoi    une ou deux phrases : pourquoi TU le conseilles
     lien        le lien Amazon complet (doit commencer par https://)
     icone       un emoji
     date        date d'ajout "AAAA-MM-JJ" (la plus récente sert de
                 date « Sélection mise à jour le… » en haut de la page)

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
      { id: "ram", nom: "Mémoire RAM" },
      { id: "stockage", nom: "Stockage (SSD et disques durs)" },
      { id: "alim", nom: "Alimentations",
        outil: { texte: "Pas sûr de la puissance ? Utilisez le calculateur d'alimentation", lien: "alimentation.html" } },
      { id: "refroidissement", nom: "Refroidissement" }
    ]},
    { id: "peripheriques", nom: "Périphériques et jeu", icone: "🎮", categories: [
      { id: "ecrans", nom: "Écrans" },
      { id: "clavier-souris", nom: "Claviers et souris" },
      { id: "audio", nom: "Casques et audio" },
      { id: "manettes", nom: "Manettes et accessoires console" }
    ]}
  ],
  PRODUITS: [
  ]
};
