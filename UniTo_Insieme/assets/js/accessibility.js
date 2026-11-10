"use strict";
// Shared progressive enhancement for keyboard and mobile navigation.
document.querySelectorAll('.footer-year').forEach(el => { el.textContent = new Date().getFullYear(); });
document.querySelectorAll('header .toggle, header .menu-toggle').forEach(toggle => {
  const nav = document.getElementById(toggle.getAttribute('aria-controls'));
  if (!nav) return;
  const close = (restoreFocus = false) => {
    nav.classList.remove('open', 'is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) toggle.focus();
  };
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      event.preventDefault(); close(true);
    }
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
  document.addEventListener('pointerdown', event => {
    if (!nav.contains(event.target) && !toggle.contains(event.target)) close();
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) close(); });
});
