/* Nicotch — page Linux : petit questionnaire « Quel Linux pour moi ? » */
(function () {
  "use strict";
  var DISTRIB = {
    "mint-xfce": { nom: "Linux Mint (édition Xfce)", ancre: "#d-mint",
      pourquoi: "Légère et rapide, elle redonne vie aux vieux PC tout en gardant un bureau qui ressemble à Windows." },
    "mint": { nom: "Linux Mint (édition Cinnamon)", ancre: "#d-mint",
      pourquoi: "Le plus simple pour quitter Windows : tout est à sa place, stable et facile à prendre en main." },
    "bazzite": { nom: "Bazzite", ancre: "#d-bazzite",
      pourquoi: "Fait pour jouer : Steam, pilotes et réglages pour le jeu sont déjà prêts. Vérifie tes jeux sur ProtonDB." },
    "fedora": { nom: "Fedora", ancre: "#d-fedora",
      pourquoi: "Moderne et toujours à jour : parfaite pour apprendre Linux en profondeur." },
    "ubuntu": { nom: "Ubuntu", ancre: "#d-ubuntu",
      pourquoi: "Le Linux le plus connu, avec énormément d'aide en français." }
  };

  function choisir(pc, usage, style) {
    if (pc === "vieux") return { id: "mint-xfce", note: usage === "jeu" ? "Pour jouer, un PC aussi ancien sera limité : privilégie les jeux légers ou rétro." : "" };
    if (usage === "jeu") return { id: pc === "recent" ? "bazzite" : "mint", note: pc === "recent" ? "Tu préfères une distribution 100 % en français ? Regarde aussi GLF OS, juste en dessous de Bazzite 🇫🇷" : "Sur un PC de 4 à 8 ans, Linux Mint + Steam est plus sûr que Bazzite." };
    if (usage === "apprendre") return { id: style === "windows" ? "mint" : "fedora", note: "" };
    return { id: style === "windows" ? "mint" : "ubuntu", note: "" };
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("linux-quiz");
    if (!form) return;
    var res = document.getElementById("quiz-resultat");
    var err = document.getElementById("quiz-erreur");
    var esc = window.ND.esc;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var pc = form.pc.value, usage = form.usage.value, style = form.style.value;
      if (!pc || !usage || !style) { err.hidden = false; res.hidden = true; return; }
      err.hidden = true;
      var c = choisir(pc, usage, style), d = DISTRIB[c.id];
      var nicotch = c.id === "bazzite" || c.id.indexOf("mint") === 0;
      res.innerHTML = '<p class="surtitre">Mon conseil</p><h3>🐧 ' + esc(d.nom) + "</h3><p>" + esc(d.pourquoi) + "</p>" +
        (c.note ? '<p class="texte-doux">💡 ' + esc(c.note) + "</p>" : "") +
        (nicotch ? '<p><span class="badge-teste">✅ Je l\'utilise moi-même</span></p>' : "") +
        '<div class="plan-actions"><a class="btn btn-rouge" href="' + d.ancre + '">Voir la fiche</a><a class="btn btn-contour" href="#installer">🔧 Comment l\'installer</a></div>';
      res.hidden = false;
      res.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  });
})();
