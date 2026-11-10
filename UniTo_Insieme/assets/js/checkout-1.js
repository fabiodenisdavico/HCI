(function () {
  "use strict";

  var KEY = "unito-contributo";
  var form = document.getElementById("contributionForm");
  var amount = document.getElementById("amount");
  var presets = document.querySelectorAll("[data-amount]");
  var warning = document.getElementById("formWarning");

  var yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  /* Importi suggeriti */
  function syncPresets() {
    presets.forEach(function (button) {
      var active = button.dataset.amount === amount.value.trim();
      button.setAttribute("aria-pressed", String(active));
    });
  }

  presets.forEach(function (button) {
    button.addEventListener("click", function () {
      amount.value = button.dataset.amount;
      clearError(amount);
      syncPresets();
      amount.focus();
    });
  });

  amount.addEventListener("input", syncPresets);
  ["amount", "firstName", "lastName", "email"].forEach(function (id) {
    var field = document.getElementById(id);
    field.addEventListener("input", function () { clearError(field); if (warning) warning.hidden = true; });
  });

  /* Errori */
  function setError(field, message) {
    var box = document.getElementById(field.id + "-error");
    field.setAttribute("aria-invalid", "true");
    if (box) { box.textContent = message; box.hidden = false; }
  }

  function clearError(field) {
    var box = document.getElementById(field.id + "-error");
    field.removeAttribute("aria-invalid");
    if (box) { box.textContent = ""; box.hidden = true; }
  }

  /* Dati salvati in precedenza */
  try {
    var saved = JSON.parse(sessionStorage.getItem(KEY) || "null");
    if (saved) {
      ["amount", "firstName", "lastName", "email"].forEach(function (id) {
        if (typeof saved[id] === "string") {
          document.getElementById(id).value = saved[id];
        }
      });
    }
  } catch (error) {
    /* storage non disponibile: si parte da zero */
  }

  syncPresets();

  /* Invio */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var firstName = document.getElementById("firstName");
    var lastName = document.getElementById("lastName");
    var email = document.getElementById("email");
    var firstInvalid = null;

    [amount, firstName, lastName, email].forEach(clearError);
    if (warning) warning.hidden = true;
    var errors = 0;

    function fail(field, message) {
      setError(field, message);
      errors++;
      if (!firstInvalid) {
        firstInvalid = field;
      }
    }

    var raw = amount.value.trim().replace(",", ".");
    var value = Number(raw);

    if (!/^\d+(\.\d{1,2})?$/.test(raw) || value < 1 || value > 10000) {
      fail(amount, "Inserisci un importo tra 1 e 10.000 euro, con al massimo due decimali.");
    }

    if (!firstName.value.trim()) {
      fail(firstName, "Inserisci il tuo nome.");
    }

    if (!lastName.value.trim()) {
      fail(lastName, "Inserisci il tuo cognome.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      fail(email, "Inserisci un indirizzo email valido.");
    }

    if (firstInvalid) {
      if (warning) { warning.textContent = "Controlla " + errors + (errors === 1 ? " campo evidenziato" : " campi evidenziati") + " e correggi gli errori prima di continuare."; warning.hidden = false; }
      firstInvalid.focus();
      return;
    }

    var data = {
      amount: value.toFixed(2),
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim()
    };

    try {
      sessionStorage.removeItem("unito-demo-confirmed-signature");
      sessionStorage.setItem(KEY, JSON.stringify(data));
    } catch (error) {
      // Fallback per browser che bloccano sessionStorage (es. anteprime locali).
      window.location.href = "checkout-2.html?progetto=" + encodeURIComponent(new URLSearchParams(location.search).get("progetto") || "archivi") + "&d=" + encodeURIComponent(JSON.stringify(data));
      return;
    }

    var project = new URLSearchParams(location.search).get("progetto") || "archivi";
    try { project = sessionStorage.getItem("unito-demo-project") || project; } catch (e) {}
    window.location.href = "checkout-2.html?progetto=" + encodeURIComponent(project);
  });
})();
