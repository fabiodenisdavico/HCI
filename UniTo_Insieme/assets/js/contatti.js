(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("mainNav");
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  document.getElementById("year").textContent = new Date().getFullYear();

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  function setError(field, message) {
    var wrapper = field.closest(".field");
    wrapper.classList.toggle("has-error", Boolean(message));
    wrapper.querySelector(".error-text").textContent = message || "";
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;
    var valid = true;

    if (name.value.trim().length < 2) {
      setError(name, "Inserisci il tuo nome.");
      valid = false;
    } else {
      setError(name, "");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError(email, "Inserisci un indirizzo email valido.");
      valid = false;
    } else {
      setError(email, "");
    }

    if (message.value.trim().length < 10) {
      setError(message, "Scrivi almeno 10 caratteri.");
      valid = false;
    } else {
      setError(message, "");
    }

    return valid;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.classList.remove("is-visible");

    if (!validate()) {
      return;
    }

    // Nessun invio reale: il modulo non è ancora collegato a un servizio.
    status.textContent =
      "Il modulo non è ancora attivo: il messaggio non è stato inviato né salvato.";
    status.classList.add("is-visible");
    form.reset();
  });
})();
