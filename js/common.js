/* =========================================================
   Nicotch — éléments communs à toutes les pages
   (en-tête, menu mobile, pied de page, petites fonctions utiles)
   Pour modifier le menu ou le pied de page : c'est ici, une seule fois.
   ========================================================= */
(function () {
  "use strict";

  // pages : liste des pages sur lesquelles ce lien apparaît comme « actif »
  var MENU = [
    { href: "index.html", label: "Accueil", pages: ["index.html"] },
    { href: "reparation.html", label: "Diagnostic & Réparation", pages: ["reparation.html", "diagnostic.html"] },
    { href: "fiches.html", label: "Fiches de dépannage", pages: ["fiches.html"] },
    { href: "outils.html", label: "Boîte à outils", pages: ["outils.html", "alimentation.html", "bips.html", "config-pc.html", "telechargements.html"] },
    { href: "jeux.html", label: "Rétro Games", pages: ["jeux.html", "jouer.html"] },
    { href: "contact.html", label: "Contact", pages: ["contact.html"] }
  ];

  function pageCourante() {
    var chemin = location.pathname.split("/").pop() || "index.html";
    if (chemin.indexOf(".") === -1) chemin += ".html"; // Netlify « jolies URL »
    var type = new URLSearchParams(location.search).get("type");
    return { page: chemin, type: type };
  }

  function construireEntete() {
    var cible = document.getElementById("entete");
    if (!cible) return;
    var pc = pageCourante();
    var liens = MENU.map(function (m) {
      var actif = m.pages.indexOf(pc.page) !== -1;
      return '<li><a href="' + m.href + '"' + (actif ? ' aria-current="page"' : "") + ">" + m.label + "</a></li>";
    }).join("");

    cible.className = "entete";
    // Logo « Nicotch » (fond transparent, proportions conservées : 3,35 pour 1)
    cible.innerHTML =
      '<div class="conteneur">' +
        '<a class="marque" href="index.html" title="Accueil Nicotch">' +
          '<picture><source type="image/webp" srcset="assets/logos/nicotch-400.webp 400w, assets/logos/nicotch-800.webp 800w" sizes="(max-width: 1199px) 170px, 230px">' +
          '<img class="logo-nicotch" src="assets/logos/nicotch-400.png" srcset="assets/logos/nicotch-400.png 400w, assets/logos/nicotch-800.png 800w" sizes="(max-width: 1199px) 170px, 230px" width="230" height="69" alt="Nicotch – accueil"></picture>' +
        "</a>" +
        '<button class="nav-bouton" type="button" aria-expanded="false" aria-controls="nav-principale" aria-label="Ouvrir le menu">☰ Menu</button>' +
        '<nav class="nav" id="nav-principale" aria-label="Menu principal"><ul>' + liens +
          '<li><a class="nav-cta" href="reparation.html#choisir">Lancer un diagnostic</a></li>' +
        "</ul></nav>" +
      "</div>";

    var bouton = cible.querySelector(".nav-bouton");
    var nav = cible.querySelector(".nav");
    function fermer() {
      nav.classList.remove("ouvert");
      bouton.setAttribute("aria-expanded", "false");
      bouton.textContent = "☰ Menu";
      bouton.setAttribute("aria-label", "Ouvrir le menu");
    }
    bouton.addEventListener("click", function () {
      var ouvert = nav.classList.toggle("ouvert");
      bouton.setAttribute("aria-expanded", ouvert ? "true" : "false");
      bouton.textContent = ouvert ? "✕ Fermer" : "☰ Menu";
      bouton.setAttribute("aria-label", ouvert ? "Fermer le menu" : "Ouvrir le menu");
      if (ouvert) { var premier = nav.querySelector("a"); if (premier) premier.focus(); }
    });
    // Fermeture après sélection d'un lien et avec la touche Échap
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) fermer(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("ouvert")) { fermer(); bouton.focus(); }
    });
  }

  function construirePied() {
    var cible = document.getElementById("pied");
    if (!cible) return;
    cible.className = "pied";
    cible.innerHTML =
      '<div class="conteneur">' +
        '<div class="grille-pied">' +
          "<div>" +
            '<div class="pied-marque"><img src="assets/logos/nicotch-400.webp" width="180" height="54" alt="Nicotch" loading="lazy"></div>' +
            "<p>Diagnostic gratuit des pannes de PC et de consoles, et petits jeux rétro à découvrir. Les diagnostics indiquent des <strong>causes possibles</strong>, jamais un résultat certain.</p>" +
          "</div>" +
          "<div><h2>Diagnostic & Réparation</h2><ul>" +
            '<li><a href="diagnostic.html?type=pc">Diagnostic PC</a></li>' +
            '<li><a href="diagnostic.html?type=console">Diagnostic console</a></li>' +
            '<li><a href="bips.html">Décodeur de bips BIOS</a></li>' +
            '<li><a href="fiches.html">Fiches de dépannage</a></li>' +
            '<li><a href="historique.html">Historique local</a></li>' +
          "</ul></div>" +
          "<div><h2>Outils, jeux et infos</h2><ul>" +
            '<li><a href="outils.html">Boîte à outils</a></li>' +
            '<li><a href="alimentation.html">Calculateur d\'alimentation</a></li>' +
            '<li><a href="config-pc.html">Config PC</a></li>' +
            '<li><a href="telechargements.html">Téléchargements</a></li>' +
            '<li><a href="bons-plans.html">Bons plans</a></li>' +
            '<li><a href="jeux.html">Nicotch Rétro Games</a></li>' +
            '<li><a href="a-propos.html">À propos et sécurité</a></li>' +
            '<li><a href="a-propos.html#confidentialite">Confidentialité</a></li>' +
            '<li><a href="a-propos.html#avertissement">Avertissement</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
            '<li><a href="mentions-legales.html">Mentions légales</a></li>' +
          "</ul></div>" +
        "</div>" +
        '<div class="pied-partenaire"><span>Partenaire</span>' +
          '<img src="assets/logos/alarian-blanc-400.webp" width="150" height="78" alt="Alarian Solutions – Responsable Administratif Opérationnel" loading="lazy">' +
        "</div>" +
        '<div class="pied-bas"><span>© <span id="annee"></span> Nicotch. Aucun compte, aucun cookie.</span>' +
        "<span>En cas de doute ou de risque électrique, faites appel à un professionnel.</span></div>" +
      "</div>";
    var annee = document.getElementById("annee");
    if (annee) annee.textContent = new Date().getFullYear();

    // Compteur de visites rétro (chiffres fournis par GoatCounter).
    // Il reste caché tant que GoatCounter ne répond pas (option non activée, bloqueur de pub…).
    var zone = cible.querySelector(".pied-bas");
    if (zone && window.fetch) {
      var compteur = document.createElement("p");
      compteur.className = "compteur-retro cache";
      compteur.setAttribute("aria-live", "polite");
      zone.insertAdjacentElement("beforebegin", compteur);
      fetch("https://nicotch.goatcounter.com/counter/TOTAL.json")
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (d) {
          var n = String(d.count || "").replace(/\D/g, "");
          if (!n) return;
          var chiffres = ("000000" + n).slice(-Math.max(6, n.length));
          compteur.innerHTML = '<span class="compteur-titre">🕹️ VISITEURS</span> ' +
            chiffres.split("").map(function (c) { return '<span class="compteur-chiffre">' + c + "</span>"; }).join("");
          compteur.setAttribute("aria-label", Number(n).toLocaleString("fr-FR") + " visites");
          compteur.classList.remove("cache");
        })
        .catch(function () { /* compteur indisponible : on n'affiche rien */ });
    }
  }

  /* ---------- Fonctions partagées ---------- */
  var ND = window.ND = window.ND || {};

  // Échappe le texte pour l'insérer sans risque dans le HTML
  ND.esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  // Stockage du navigateur (localStorage) protégé contre les erreurs
  // (navigation privée, stockage bloqué…) : le site fonctionne même sans.
  ND.stock = {
    lire: function (cle, defaut) {
      try { var v = localStorage.getItem(cle); return v ? JSON.parse(v) : defaut; }
      catch (e) { return defaut; }
    },
    ecrire: function (cle, valeur) {
      try { localStorage.setItem(cle, JSON.stringify(valeur)); return true; }
      catch (e) { return false; }
    },
    supprimer: function (cle) {
      try { localStorage.removeItem(cle); return true; } catch (e) { return false; }
    }
  };

  /* ---------- Événement promo (Black Friday…) ----------
     S'affiche tout seul entre les dates debut et fin (incluses),
     sur l'accueil (ruban sur la carte Bons plans) et sur la page Bons plans.
     Pour le prochain événement : changer nom, emoji, debut et fin. */
  ND.EVENEMENT = { nom: "Black Friday Week", emoji: "🔥", debut: "2026-11-19", fin: "2026-11-30",
                   texte: "du 19 au 30 novembre" };
  ND.aujourdhui = function () {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  ND.evenementActif = function () {
    var e = ND.EVENEMENT, j = ND.aujourdhui();
    return !!(e && j >= e.debut && j <= e.fin);
  };

  ND.NIVEAUX = { 1: "Facile", 2: "Intermédiaire", 3: "Avancé" };
  ND.CLE_HISTO = "nicotch-diag-historique";

  ND.dateCourte = function (iso) {
    try { return new Date(iso).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" }); }
    catch (e) { return iso; }
  };

  ND.dateFr = function (iso) {
    try {
      return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" });
    } catch (e) { return iso; }
  };

  document.addEventListener("DOMContentLoaded", function () {
    construireEntete();
    construirePied();
    // Ruban « Black Friday » sur la carte Bons plans de l'accueil
    var carteBP = document.querySelector('.grille-espaces a[href="bons-plans.html"]');
    if (carteBP && ND.evenementActif()) {
      var carte = carteBP.closest(".espace");
      var ruban = document.createElement("span");
      ruban.className = "ruban-promo";
      ruban.textContent = ND.EVENEMENT.emoji + " " + ND.EVENEMENT.nom;
      carte.classList.add("espace-promo");
      carte.insertBefore(ruban, carte.firstChild);
    }
  });
})();
