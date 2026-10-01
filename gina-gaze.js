// One frame per pointer update; no idle animation loop or tracking on touch.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let pointer = null;
  let blinkTimer = 0;
  let blinkEndTimer = 0;
  let windowActive = true;

  function stopBlinking() {
    clearTimeout(blinkTimer);
    clearTimeout(blinkEndTimer);
    document.querySelectorAll('.gina-eyes.is-blinking').forEach(eyes => eyes.classList.remove('is-blinking'));
  }

  function scheduleBlink() {
    stopBlinking();
    if (reducedMotion.matches || document.hidden || !windowActive) return;
    blinkTimer = setTimeout(() => {
      document.querySelectorAll('.gina-eyes').forEach(eyes => {
        const box = eyes.getBoundingClientRect();
        if (box.width && box.height && box.bottom > 0 && box.top < window.innerHeight) {
          eyes.classList.add('is-blinking');
        }
      });
      blinkEndTimer = setTimeout(scheduleBlink, 220);
    }, 3500 + Math.random() * 3000);
  }

  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    pointer = null;
    document.querySelectorAll('.gina-pupils').forEach(eyes => eyes.removeAttribute('transform'));
  }

  function paint() {
    frame = 0;
    if (!pointer || reducedMotion.matches || document.hidden) return;
    document.querySelectorAll('.gina-eyes').forEach(eyes => {
      const box = eyes.getBoundingClientRect();
      if (!box.width || !box.height || box.bottom < 0 || box.top > window.innerHeight) return;
      const dx = pointer.x - (box.left + box.width * .5);
      const dy = pointer.y - (box.top + box.height * .5);
      const distance = Math.hypot(dx, dy);
      const strength = Math.min(distance / 240, 1);
      const x = distance ? dx / distance * strength * 16 : 0;
      const y = distance ? dy / distance * strength * 12 : 0;
      eyes.querySelector('.gina-pupils').setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
    });
  }

  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || reducedMotion.matches) return;
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  document.addEventListener('pointerout', event => { if (!event.relatedTarget) reset(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
    scheduleBlink();
  });
  window.addEventListener('blur', () => { windowActive = false; reset(); stopBlinking(); });
  window.addEventListener('focus', () => { windowActive = true; scheduleBlink(); });
  reducedMotion.addEventListener('change', () => { reset(); scheduleBlink(); });
  window.addEventListener('pagehide', () => { reset(); stopBlinking(); });
  scheduleBlink();
})();
