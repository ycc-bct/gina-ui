// Replay the original GIF frames with a typing-responsive timeline.
(() => {
  const host = document.querySelector('.hero-avatar');
  const input = document.querySelector('#input');
  if (!host || !input) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let glowTimer;
  const clearGlow = () => {
    clearTimeout(glowTimer);
    host.classList.remove('is-typing');
  };
  input.addEventListener('input', () => {
    if (document.hidden || !host.getClientRects().length || !input.value) return clearGlow();
    clearTimeout(glowTimer);
    host.classList.add('is-typing');
    glowTimer = setTimeout(clearGlow, 900);
  });
  new MutationObserver(clearGlow).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', clearGlow);
  const sprite = new Image();
  sprite.src = 'assets/gina-breath-frames.png';
  Promise.all([
    sprite.decode(),
    fetch('assets/gina-breath-frames.json').then(response => {
      if (!response.ok) throw new Error('Animation frames unavailable');
      return response.json();
    }),
  ]).then(([, frames]) => {
    const canvas = document.createElement('canvas');
    canvas.width = frames.width;
    canvas.height = frames.height;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Gina');
    canvas.style.cssText = 'display:block;width:100%;height:100%';
    const context = canvas.getContext('2d');
    if (!context) return;
    host.replaceChildren(canvas);
    let frame = 0, elapsed = 0, previous = 0, speed = 1, energy = 0, raf = 0;
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(sprite,
        (frame % frames.columns) * frames.width,
        Math.floor(frame / frames.columns) * frames.height,
        frames.width, frames.height, 0, 0, canvas.width, canvas.height);
    };
    const visible = () => !document.hidden && host.getClientRects().length > 0;
    function tick(now) {
      raf = 0;
      if (!visible() || reducedMotion.matches) { previous = 0; return; }
      const delta = previous ? Math.min(now - previous, 100) : 0;
      previous = now;
      energy *= Math.exp(-delta / 900);
      speed += (1 + energy - speed) * (1 - Math.exp(-delta / 180));
      elapsed += delta * speed;
      let changed = false;
      while (elapsed >= frames.durations[frame]) {
        elapsed -= frames.durations[frame];
        frame = (frame + 1) % frames.durations.length;
        changed = true;
      }
      if (changed) draw();
      raf = requestAnimationFrame(tick);
    }
    function resume() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      previous = 0;
      energy = 0;
      speed = 1;
      if (reducedMotion.matches) { frame = 0; draw(); }
      else if (visible()) raf = requestAnimationFrame(tick);
    }
    input.addEventListener('input', () => {
      if (visible() && !reducedMotion.matches) energy = Math.min(2.5, energy + .85);
    });
    new MutationObserver(resume).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', resume);
    reducedMotion.addEventListener('change', resume);
    draw();
    resume();
  }).catch(() => { /* Keep the original GIF if frame assets fail to load. */ });
})();
