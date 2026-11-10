/* Animazioni progressive: non impediscono mai la lettura se JS o IntersectionObserver non sono disponibili. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const selectors = [
    'main > section:not(.hero) h2',
    'main > section:not(.hero) .project-card',
    'main > section:not(.hero) .step-card',
    'main > section:not(.hero) .impact-card',
    'main > section:not(.hero) .voices-card',
    'main > section:not(.hero) .closing-box',
    'main .faq-item', 'main .team-card',
    'main .project-detail', 'main .contact-card'
  ];
  const targets = [...new Set(document.querySelectorAll(selectors.join(',')))];
  if (!targets.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px 35px 0px' });
  targets.forEach((el) => {
    el.classList.add('motion-reveal');
    observer.observe(el);
  });
  document.documentElement.classList.add('motion-ready');
  // Gli elementi già visibili non devono sparire durante il caricamento.
  requestAnimationFrame(() => {
    targets.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * .92) el.classList.add('motion-visible');
    });
  });
})();
