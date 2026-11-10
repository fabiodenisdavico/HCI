"use strict";

const menuToggle = document.querySelector(".toggle");
const menu = document.querySelector("#menu");
const header = document.querySelector(".top");

if (menuToggle && menu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") !== "true";

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menu.classList.toggle("open", isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.classList.contains("open")) {
      return;
    }

    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  });
}

if (header) {
  const updateHeaderOnScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateHeaderOnScroll, { passive: true });
  updateHeaderOnScroll();
}
