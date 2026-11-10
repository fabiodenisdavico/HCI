'use strict';
(() => {
  const carousel = document.querySelector('.featured-carousel');
  if (!carousel) return;
  const slides = [...carousel.querySelectorAll('.carousel-slide')];
  const dots = [...carousel.querySelectorAll('.carousel-dot')];
  let current = 0;
  let timer;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
      slide.tabIndex = active ? 0 : -1;
      dots[i].classList.toggle('is-active', active);
      if (active) dots[i].setAttribute('aria-current', 'true');
      else dots[i].removeAttribute('aria-current');
    });
  }
  function stop() { window.clearInterval(timer); }
  function start() {
    stop();
    // Nessun cambio automatico: la slide resta stabile finché non interviene l’utente.
  }
  carousel.querySelector('.carousel-side-prev').addEventListener('click', () => { show(current - 1); start(); });
  carousel.querySelector('.carousel-side-next').addEventListener('click', () => { show(current + 1); start(); });
  let touchStartX = null;
  carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; stop(); }, { passive: true });
  carousel.addEventListener('touchend', e => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) > 45) { show(current + (delta < 0 ? 1 : -1)); carousel.dataset.swiped = 'true'; }
    touchStartX = null; start();
  }, { passive: true });
  carousel.addEventListener('click', e => { if (carousel.dataset.swiped === 'true' && e.target.closest('.carousel-slide')) { e.preventDefault(); carousel.dataset.swiped = ''; } }, true);
  carousel.addEventListener('keydown', e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); show(current + (e.key === 'ArrowRight' ? 1 : -1)); start(); } });
  dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', e => { if (!carousel.contains(e.relatedTarget)) start(); });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  show(0);
  // La prima slide è già attiva nell’HTML: nessuna modifica visiva al caricamento.
})();
