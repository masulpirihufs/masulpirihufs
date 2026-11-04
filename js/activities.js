// Highlight the session nearest the viewport center, as the timeline scrolls.
(() => {
  const items = [...document.querySelectorAll('.session-item')];
  if (!items.length) return;
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const center = window.innerHeight / 2;
    const nearest = items.reduce((best, item) => {
      const rect = item.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - center);
      return distance < best.distance ? { item, distance } : best;
    }, { item: items[0], distance: Infinity }).item;
    items.forEach(item => {
      const current = item === nearest;
      item.classList.toggle('is-current', current);
      if (current) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
})();
