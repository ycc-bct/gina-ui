(() => {
  // Clicking the home sphere switches between two home styles on the same page:
  //   Style 1: small animated orb beside a one-line greeting
  //   Style 2: AI video sphere above a two-line greeting with a blue gradient phrase
  // The choice is remembered per browser (localStorage).
  const KEY = 'gina-hero-style';
  const body = document.body;
  const spheres = [...document.querySelectorAll('.hero-avatar, .hero-orb2')];
  const video = document.querySelector('.hero-orb2 video');
  if (!spheres.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = value => { try { localStorage.setItem(KEY, value); } catch { /* storage blocked: still switches */ } };

  const apply = style => {
    const isStyle2 = style === '2';
    body.classList.toggle('hero-style-2', isStyle2);
    const label = `切換至 ${isStyle2 ? 'Style 1' : 'Style 2'}`;
    spheres.forEach(sphere => {
      sphere.setAttribute('role', 'button');
      sphere.setAttribute('tabindex', '0');
      sphere.setAttribute('aria-label', label);
      sphere.setAttribute('title', label);
    });
    if (!video) return;
    if (isStyle2 && !reduceMotion.matches) playVideo();
    else video.pause();
  };

  // The video starts hidden (Style 1), so it may not be ready the moment Style 2 shows.
  // Try now, and again once it can play, as long as Style 2 is still on.
  const playVideo = () => {
    video.play().catch(() => {});
    if (video.readyState < 3) {
      video.addEventListener('canplay', () => {
        if (body.classList.contains('hero-style-2')) video.play().catch(() => {});
      }, { once: true });
    }
  };
  if (video) {
    // autoplay is on in the markup so the first frame decodes; Style 1 pauses it right away.
    video.addEventListener('play', () => {
      if (!body.classList.contains('hero-style-2') || reduceMotion.matches) video.pause();
    });
  }

  const switchStyle = () => {
    const next = body.classList.contains('hero-style-2') ? '1' : '2';
    write(next);
    apply(next);
    if (typeof toast === 'function') toast(`Style ${next}`);
  };

  spheres.forEach(sphere => {
    sphere.addEventListener('click', switchStyle);
    sphere.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      switchStyle();
    });
  });

  apply(read() === '2' ? '2' : '1');
})();
