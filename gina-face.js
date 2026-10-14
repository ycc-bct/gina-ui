/* Gina face sphere (home Style 3), drawn in SVG so it is crisp at any size, transparent everywhere,
   recolourable for dark mode, and interactive:
     idle      eyes wander between a few spots, blink every few seconds (sometimes twice), body breathes
     pointer   eyes follow the mouse anywhere on the page; drift back to wandering after a short pause
     typing    eyes look down at the composer while you type
     hover     sphere grows a touch, eyes open a little wider
     click     bounce + sparks + happy curved eyes for a moment   (window.GinaFace.greet())
   Respects prefers-reduced-motion: no wandering, breathing, blinking or sparks; pointer follow stays. */
(() => {
  const host = document.querySelector('.hero-orb3');
  if (!host) return;
  const sparkLayer = host.querySelector('.spark-layer');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const input = document.getElementById('input');

  // ---------- Drawing (viewBox 120 x 120, sphere r = 46 at 60,60) ----------
  const NS = 'http://www.w3.org/2000/svg';
  // SVG markup with id prefix p, so several faces (home + Appearance preview) can live on one page.
  const faceMarkup = (p, cls = 'face-svg') => `
    <svg class="${cls}" viewBox="0 0 120 120" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="${p}-body" cx="42%" cy="36%" r="70%">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset=".55" stop-color="#f4f6ff"/>
          <stop offset=".82" stop-color="#e3e8fc"/>
          <stop offset="1" stop-color="#d3daf7"/>
        </radialGradient>
        <radialGradient id="${p}-tint-blue" cx="10%" cy="45%" r="60%">
          <stop offset="0" stop-color="#9db4ff" stop-opacity=".55"/>
          <stop offset="1" stop-color="#9db4ff" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="${p}-tint-lilac" cx="88%" cy="78%" r="60%">
          <stop offset="0" stop-color="#cbb6ff" stop-opacity=".6"/>
          <stop offset="1" stop-color="#cbb6ff" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${p}-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#a9bcff"/>
          <stop offset=".5" stop-color="#c3c9ff"/>
          <stop offset="1" stop-color="#d4bdff"/>
        </linearGradient>
        <filter id="${p}-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2"/></filter>
        <filter id="${p}-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
        <clipPath id="${p}-clip"><circle cx="60" cy="60" r="46"/></clipPath>
      </defs>
      <g class="face-body">
        <circle class="face-halo" cx="60" cy="60" r="47" fill="none" stroke="url(#${p}-rim)" stroke-width="5" opacity=".55" filter="url(#${p}-glow)"/>
        <circle cx="60" cy="60" r="46" fill="url(#${p}-body)"/>
        <g clip-path="url(#${p}-clip)">
          <circle cx="60" cy="60" r="46" fill="url(#${p}-tint-blue)"/>
          <circle cx="60" cy="60" r="46" fill="url(#${p}-tint-lilac)"/>
          <ellipse cx="44" cy="34" rx="17" ry="10" fill="#ffffff" opacity=".85" filter="url(#${p}-soft)" transform="rotate(-24 44 34)"/>
        </g>
        <circle cx="60" cy="60" r="45.4" fill="none" stroke="url(#${p}-rim)" stroke-width="1.4" opacity=".9"/>
        <g class="face-eyes">
          <g class="face-eye" data-side="l">
            <ellipse class="eye-ball" cx="46" cy="66" rx="6.2" ry="7.8" fill="#4a5ba8"/>
            <circle class="eye-glint" cx="48.2" cy="62.6" r="2" fill="#ffffff"/>
            <path class="eye-happy" d="M39.5 67.5 Q46 59.5 52.5 67.5" fill="none" stroke="#4a5ba8" stroke-width="3" stroke-linecap="round"/>
          </g>
          <g class="face-eye" data-side="r">
            <ellipse class="eye-ball" cx="74" cy="66" rx="6.2" ry="7.8" fill="#4a5ba8"/>
            <circle class="eye-glint" cx="76.2" cy="62.6" r="2" fill="#ffffff"/>
            <path class="eye-happy" d="M67.5 67.5 Q74 59.5 80.5 67.5" fill="none" stroke="#4a5ba8" stroke-width="3" stroke-linecap="round"/>
          </g>
        </g>
      </g>
    </svg>`;
  host.insertAdjacentHTML('afterbegin', faceMarkup('gf'));
  const svg = host.querySelector('.face-svg');
  const eyesGroup = svg.querySelector('.face-eyes');
  const eyes = [...svg.querySelectorAll('.face-eye')];

  // ---------- State ----------
  const MAX_X = 7, MAX_Y = 5;          // how far the eyes can travel inside the sphere (viewBox units)
  let look = { x: 0, y: 0 };          // current eye offset
  let target = { x: 0, y: 0 };        // where the eyes are heading
  let lidScale = 1;                   // 1 open, ~0.08 closed (blink), ~0.55 squint
  let lidTarget = 1;
  let widen = 1;                      // hover makes eyes a touch taller
  let mode = 'wander';                // wander | pointer | typing
  let lastPointer = 0, lastTyping = 0;
  let nextWander = 0, nextBlink = 0;
  let blinkUntil = 0, squintUntil = 0, happyUntil = 0;

  const visible = () => document.body.classList.contains('hero-style-3') && !document.body.classList.contains('chatting') && !document.body.classList.contains('specialist');
  const rand = (a, b) => a + Math.random() * (b - a);

  // Where the eyes should look to face a point on screen.
  const lookAtPoint = (px, py) => {
    const r = host.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = px - cx, dy = py - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const reach = Math.min(1, dist / 220);           // nearby points move the eyes less
    return { x: dx / dist * MAX_X * reach, y: dy / dist * MAX_Y * reach };
  };

  // ---------- Inputs ----------
  document.addEventListener('pointermove', e => {
    if (!visible()) return;
    lastPointer = performance.now();
    if (performance.now() - lastTyping > 1200) { mode = 'pointer'; target = lookAtPoint(e.clientX, e.clientY); }
  }, { passive: true });

  if (input) {
    const watchComposer = () => {
      if (!visible()) return;
      lastTyping = performance.now(); mode = 'typing';
      const r = input.getBoundingClientRect();
      target = lookAtPoint(r.left + Math.min(r.width * .35, 160), r.top + r.height / 2);
    };
    input.addEventListener('input', watchComposer);
    input.addEventListener('focus', watchComposer);
  }

  host.addEventListener('pointerenter', () => { widen = 1.12; host.classList.add('is-hover'); });
  host.addEventListener('pointerleave', () => { widen = 1; host.classList.remove('is-hover'); });

  // ---------- Sparks + greet ----------
  const COLORS = ['#5b7cff', '#8a6cff', '#3fb8f5', '#a98bff', '#7aa2ff'];
  const sparks = () => {
    if (!sparkLayer || reduceMotion.matches) return;
    const count = 14;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - .5) * .5;
      const dist = 52 + Math.random() * 30;
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      s.style.setProperty('--size', `${9 + Math.random() * 9}px`);
      s.style.setProperty('--delay', `${Math.random() * 60}ms`);
      s.style.setProperty('--spin', `${(Math.random() - .5) * 180}deg`);
      s.style.background = COLORS[i % COLORS.length];
      s.addEventListener('animationend', () => s.remove());
      sparkLayer.appendChild(s);
    }
  };
  const greet = () => {
    host.classList.remove('is-poked'); void host.offsetWidth; host.classList.add('is-poked');
    happyUntil = performance.now() + 950;
    sparks();
  };
  host.addEventListener('click', greet);
  host.addEventListener('keydown', e => {
    if ((e.key !== 'Enter' && e.key !== ' ') || e.shiftKey) return;
    e.preventDefault(); greet();
  });

  // ---------- Loop ----------
  const WANDER_SPOTS = [[0, 0], [0, 0], [-1, 0], [1, 0], [-.7, -.5], [.7, -.5], [0, .4]];
  const tick = now => {
    requestAnimationFrame(tick);
    if (!visible()) return;
    const still = reduceMotion.matches;

    // Who decides where to look: typing beats pointer beats wandering.
    if (mode === 'typing' && now - lastTyping > 2200) mode = 'pointer';
    if (mode === 'pointer' && now - lastPointer > 2800) { mode = 'wander'; nextWander = now; }
    if (mode === 'wander') {
      if (still) target = { x: 0, y: 0 };
      else if (now >= nextWander) {
        const [sx, sy] = WANDER_SPOTS[Math.floor(Math.random() * WANDER_SPOTS.length)];
        target = { x: sx * MAX_X, y: sy * MAX_Y };
        nextWander = now + rand(1400, 3200);
        if (Math.random() < .12) squintUntil = now + 600; // a thoughtful half-close now and then
      }
    }

    // Blinks: every 2.5–5.5 s, sometimes a double blink.
    if (!still && now >= nextBlink) {
      blinkUntil = now + 150;
      nextBlink = now + (Math.random() < .2 ? 260 : rand(2500, 5500));
    }
    lidTarget = now < blinkUntil ? .08 : now < squintUntil ? .55 : 1;

    // Ease toward targets (eyes snappy, lids quick).
    const ease = mode === 'pointer' ? .22 : .09;
    look.x += (target.x - look.x) * ease;
    look.y += (target.y - look.y) * ease;
    lidScale += (lidTarget - lidScale) * .45;

    const happy = now < happyUntil;
    svg.classList.toggle('is-happy', happy);
    eyesGroup.setAttribute('transform', `translate(${look.x.toFixed(2)} ${look.y.toFixed(2)})`);
    const sy = happy ? 1 : lidScale * widen;
    eyes.forEach(eye => {
      const ball = eye.querySelector('.eye-ball');
      const cy = +ball.getAttribute('cy');
      eye.querySelector('.eye-ball').setAttribute('transform', `translate(0 ${cy}) scale(1 ${sy.toFixed(3)}) translate(0 ${-cy})`);
      eye.querySelector('.eye-glint').setAttribute('opacity', sy < .4 ? 0 : 1);
    });
  };
  requestAnimationFrame(tick);

  // A small, non-interactive copy for previews (blinks on its own via CSS).
  const mini = container => { container.insertAdjacentHTML('afterbegin', faceMarkup('gfm' + Math.random().toString(36).slice(2, 7), 'face-svg face-mini')); };

  window.GinaFace = { greet, mini };
})();
