/* Nicotch — formulaire de contact (envoi par Web3Forms, sans serveur)
   ---------------------------------------------------------------
   CLÉ : colle ici la clé « Access Key » reçue par e-mail de web3forms.com.
   Cette clé n'est pas un mot de passe : elle sert seulement à dire à Web3Forms
   vers quelle boîte mail envoyer les messages. Elle peut être visible. */
var ND_WEB3FORMS_CLE = "6138e47a-2718-41a5-8185-e2895999b4d3";

(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-contact");
    if (!form) return;
    var bouton = document.getElementById("c-envoyer");
    var statut = document.getElementById("c-statut");
    var message = document.getElementById("c-message");
    var compte = document.getElementById("c-compte");
    document.getElementById("cle-formulaire").value = ND_WEB3FORMS_CLE;

    function afficher(texte, type) {
      statut.textContent = texte;
      statut.className = "contact-statut " + (type || "");
      statut.hidden = false;
    }

    if (!ND_WEB3FORMS_CLE) {
      bouton.disabled = true;
      afficher("⏳ Le formulaire est en cours d'activation. Revenez très bientôt !", "");
    }

    message.addEventListener("input", function () { compte.textContent = message.value.length; });

    function valider() {
      var ok = true;
      ["c-nom", "c-mail", "c-message"].forEach(function (id) {
        var champ = document.getElementById(id);
        var bon = champ.value.trim() !== "" && champ.checkValidity();
        champ.setAttribute("aria-invalid", bon ? "false" : "true");
        if (!bon && ok) { champ.focus(); ok = false; }
      });
      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!ND_WEB3FORMS_CLE) return;
      if (!valider()) { afficher("Merci de remplir votre nom, un e-mail valide et votre message.", "erreur"); return; }
      if (form.botcheck.checked) return; // robot

      var donnees = {};
      new FormData(form).forEach(function (v, k) { donnees[k] = v; });
      donnees.subject = "[nicotch.fr] " + (donnees.subject || "Message");

      bouton.disabled = true;
      bouton.textContent = "⏳ Envoi en cours…";
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(donnees)
      })
        .then(function (r) { return r.json(); })
        .then(function (rep) {
          if (rep && rep.success) {
            form.reset();
            compte.textContent = "0";
            afficher("✅ Merci ! Votre message est bien parti. Je vous réponds dès que possible.", "ok");
          } else {
            throw new Error((rep && rep.message) || "refus");
          }
        })
        .catch(function () {
          afficher("❌ Le message n'a pas pu être envoyé. Vérifiez votre connexion et réessayez dans quelques minutes.", "erreur");
        })
        .then(function () {
          bouton.disabled = false;
          bouton.textContent = "✉️ Envoyer le message";
        });
    });
  });
})();
