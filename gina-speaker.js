/* Gina's avatar in chat comes alive on her latest reply, in the style chosen under 外觀 → Gina:
     Thought  the live orb (mountGinaOrb)
     Buddy    the small face that blinks (GinaFace.mini)
     Host     the illustration with the blinking eye overlay; gina-gaze.js also turns the pupils toward the pointer
   Earlier Gina replies keep the still picture (CSS background on .sp-gina), so only one avatar moves at a time.
   prefers-reduced-motion is handled by each piece (the orb shows one frame, the blinks stop). */
(() => {
  const thread = document.getElementById('thread');
  if (!thread) return;
  const body = document.body;
  const styleNow = () => body.classList.contains('hero-style-3') ? 'buddy' : body.classList.contains('hero-style-cs') ? 'host' : 'thought';
  const hostMarkup = () => document.querySelector('#avatar-menu .av-thumb-cs')?.innerHTML || '';

  function liven(el, style) {
    el.classList.add('is-live');
    el.dataset.live = style;
    if (style === 'thought' && window.mountGinaOrb) {
      const box = document.createElement('span');
      box.className = 'sp-live-orb';
      el.replaceChildren(box);
      window.mountGinaOrb(box, 26);
    } else if (style === 'buddy' && window.GinaFace) {
      el.replaceChildren();
      window.GinaFace.mini(el);
    } else {
      el.innerHTML = hostMarkup();
    }
  }
  function still(el) {
    el.classList.remove('is-live');
    delete el.dataset.live;
    el.replaceChildren();
  }

  // Keep exactly one live avatar: the last Gina speaker in the open chat, in the current style.
  let busy = false;
  function sync() {
    if (busy) return;
    busy = true;
    const all = [...thread.querySelectorAll('.sp-gina')];
    const last = all[all.length - 1];
    const style = styleNow();
    all.forEach(el => { if (el !== last && el.classList.contains('is-live')) still(el); });
    if (last && last.dataset.live !== style) liven(last, style);
    busy = false;
  }

  new MutationObserver(records => {
    // Ignore changes made inside the avatars themselves (orb canvas, face SVG).
    if (records.every(r => r.target.closest && r.target.closest('.sp-gina'))) return;
    sync();
  }).observe(thread, { childList: true, subtree: true });
  new MutationObserver(sync).observe(body, { attributes: true, attributeFilter: ['class'] });
  sync();
})();
