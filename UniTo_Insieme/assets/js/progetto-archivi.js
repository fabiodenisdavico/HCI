(function () {
  "use strict";

  var header = document.getElementById("siteHeader");
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("mainNav");

  document.getElementById("year").textContent = new Date().getFullYear();

  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  function closeMenu() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      toggle.focus();
    }
  });
})();
