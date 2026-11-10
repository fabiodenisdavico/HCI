(() => {
  const scroller = document.querySelector('.home-project-scroll');
  const buttons = document.querySelectorAll('.home-project-arrow');
  if (!scroller || !buttons.length) return;
  const update = () => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    buttons.forEach(button => {
      const prev = button.dataset.direction === 'prev';
      button.disabled = prev ? scroller.scrollLeft <= 2 : scroller.scrollLeft >= max - 2;
    });
  };
  buttons.forEach(button => button.addEventListener('click', () => {
    const card = scroller.querySelector('.project-card');
    const gap = parseFloat(getComputedStyle(scroller.querySelector('.project-grid')).gap) || 0;
    const distance = card ? card.getBoundingClientRect().width + gap : scroller.clientWidth * .8;
    scroller.scrollBy({ left: distance * (button.dataset.direction === 'prev' ? -1 : 1), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
  scroller.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
