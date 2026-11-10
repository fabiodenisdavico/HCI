(function () {
  "use strict";

  var KEY = "unito-contributo";
  var summary = document.getElementById("summary");
  var empty = document.getElementById("emptyState");
  var confirmBtn = document.getElementById("confirmBtn");

  var yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();



  /* Lettura dei dati del passaggio 1 */
  var data = null;
  try {
    data = JSON.parse(sessionStorage.getItem(KEY) || "null");
  } catch (e) {
    data = null;
  }

  if (!data) {
    try { data = JSON.parse(new URLSearchParams(location.search).get("d") || "null"); } catch (e) {}
  }
  if (!data || !Number.isFinite(Number(data.amount)) || Number(data.amount) < 1 || Number(data.amount) > 10000 || !data.firstName || !data.lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) {
    summary.hidden = true;
    empty.hidden = false;
    return;
  }

  var formatted = Number(data.amount).toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  document.getElementById("sumName").textContent = data.firstName + " " + data.lastName;
  document.getElementById("sumEmail").textContent = data.email;
  document.getElementById("sumAmount").textContent = formatted + " €";
  document.getElementById("sumTotal").textContent = formatted + " €";

  confirmBtn.addEventListener("click", function () {
    try { sessionStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
    var project = new URLSearchParams(location.search).get("progetto") || "archivi";
    window.location.href = "conferma.html?progetto=" + encodeURIComponent(project) + "&d=" + encodeURIComponent(JSON.stringify(data));
  });
})();
