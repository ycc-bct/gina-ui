/* Preserve the v2 interactions; only move the existing composer on the home screen. */
(() => {
  const main = document.querySelector('.main');
  const home = document.querySelector('.hero');
  const bottom = document.querySelector('.bottom');
  const cards = home.querySelector('.today');
  const host = document.querySelector('.hero-avatar');
  const video = document.createElement('video');
  video.src = 'assets/orb/gina-studio-orb.mp4';
  video.poster = 'assets/orb/gina-studio-orb-poster.jpg';
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.setAttribute('aria-label', 'Gina');
  host.replaceChildren(video);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => {
    const atHome = !document.body.classList.contains('chatting') && !document.body.classList.contains('specialist');
    if (atHome && bottom.parentElement !== home) home.insertBefore(bottom, cards);
    if (!atHome && bottom.parentElement !== main) main.append(bottom);
    if (atHome && !document.hidden && !reduced.matches) video.play().catch(() => {});
    else video.pause();
  };
  let idle;
  document.getElementById('input').addEventListener('input', () => {
    if (reduced.matches) return;
    video.playbackRate = 1.7;
    clearTimeout(idle);
    idle = setTimeout(() => { video.playbackRate = 1; }, 700);
  });
  new MutationObserver(sync).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  sync();
})();
