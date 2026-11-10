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
    if (event.key !== "Escape" || !menu.classList.contains("open")) return;
    menu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.focus();
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}

const filterButtons=document.querySelectorAll('.filter-btn');const projectCards=document.querySelectorAll('.project-grid .project-card');const count=document.getElementById('filter-count');filterButtons.forEach(button=>button.addEventListener('click',()=>{const category=button.dataset.filter;let visible=0;filterButtons.forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});projectCards.forEach(card=>{const show=category==='all'||card.dataset.category===category;card.hidden=!show;if(show)visible++;});if(count)count.textContent=visible+' '+(visible===1?'progetto disponibile':'progetti disponibili');}));
