(() => {
  // Gina Avatar (account menu → Gina Avatar ›). Opens a submenu beside the account menu, like 語言.
  // The choice applies immediately and is remembered per browser.
  //   '1'   Thought   thinking-orbs animation
  //   '3'   Buddy     code-drawn face (gina-face.js); click it on the home page to say hi
  //   'cs'  Host      the original customer-service illustration; eyes follow the pointer (gina-gaze.js)
  // All three share one home layout: avatar on top, two-line greeting below.
  const KEY = 'gina-hero-style';
  const AVATARS = { '1': 'Thought', '3': 'Buddy', 'cs': 'Host' };
  const body = document.body;
  const face = document.querySelector('.hero-orb3');
  const menu = document.getElementById('avatar-menu');
  const current = document.getElementById('avatar-current');

  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = value => { try { localStorage.setItem(KEY, value); } catch { /* storage blocked: still applies */ } };

  const apply = (avatar, { greet = false } = {}) => {
    if (!AVATARS[avatar]) avatar = '1';
    body.classList.remove('hero-style-2');
    body.classList.toggle('hero-style-3', avatar === '3');
    body.classList.toggle('hero-style-cs', avatar === 'cs');
    document.querySelectorAll('[data-avatar-choice]').forEach(item => item.setAttribute('aria-checked', String(item.dataset.avatarChoice === avatar)));
    if (current) current.textContent = AVATARS[avatar];
    if (greet && avatar === '3' && window.GinaFace) requestAnimationFrame(() => setTimeout(window.GinaFace.greet, 160));
  };

  // The face says hi on click / Enter; the other avatars are decorative.
  if (face) {
    face.setAttribute('role', 'button');
    face.setAttribute('tabindex', '0');
    face.setAttribute('aria-label', 'Gina，點一下打招呼');
    face.setAttribute('title', '點一下打招呼');
  }

  // Small live thumbnails in the submenu.
  const orbThumb = document.getElementById('av-thumb-orb');
  if (orbThumb && window.mountGinaOrb) window.mountGinaOrb(orbThumb, 50);
  const faceThumb = document.getElementById('av-thumb-face');
  if (faceThumb && window.GinaFace) window.GinaFace.mini(faceThumb);

  const close = () => {
    if (typeof setAvatarMenu === 'function') setAvatarMenu(false);
    if (typeof closePops === 'function') closePops();
  };

  document.addEventListener('click', e => {
    const item = e.target.closest('[data-avatar-choice]');
    if (!item) return;
    write(item.dataset.avatarChoice);
    apply(item.dataset.avatarChoice, { greet: true });
    close();
  });

  // Arrow keys move between the three cards inside the submenu.
  if (menu) {
    menu.addEventListener('keydown', e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      const items = [...menu.querySelectorAll('[role="menuitemradio"]')];
      const i = items.indexOf(document.activeElement);
      const forward = e.key === 'ArrowRight' || e.key === 'ArrowDown';
      const next = items[i < 0 ? 0 : (i + (forward ? 1 : items.length - 1)) % items.length];
      e.preventDefault(); next.focus();
    });
  }

  apply(read());
})();
