(() => {
  // 外觀 (account menu → 外觀 ›). Opens a submenu beside the account menu, like 語言, with two rows:
  //   主題   'minimal'  Minimalism (default)  the plain business look in app-business-v2.css
  //          'aurora'   Aurora                theme-aurora.css: white with faint colour, frosted panels
  //   Gina   '1'   Thought   thinking-orbs animation
  //          '3'   Buddy     code-drawn face (gina-face.js); click it on the home page to say hi
  //          'cs'  Host      the original customer-service illustration; eyes follow the pointer (gina-gaze.js)
  // Every choice applies immediately and is remembered per browser.
  const KEY = 'gina-hero-style';
  const THEME_KEY = 'gina-theme';
  const AVATARS = { '1': 'Thought', '3': 'Buddy', 'cs': 'Host' };
  const THEMES = { minimal: 'Minimalism', aurora: 'Aurora' };
  const body = document.body;
  const face = document.querySelector('.hero-orb3');
  const menu = document.getElementById('avatar-menu');
  const current = document.getElementById('avatar-current');

  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* storage blocked: still applies */ } };
  let avatarNow = '1', themeNow = 'minimal';
  const label = () => { if (current) current.textContent = `${THEMES[themeNow]} · ${AVATARS[avatarNow]}`; };

  const apply = (avatar, { greet = false } = {}) => {
    if (!AVATARS[avatar]) avatar = '1';
    avatarNow = avatar;
    body.classList.remove('hero-style-2');
    body.classList.toggle('hero-style-3', avatar === '3');
    body.classList.toggle('hero-style-cs', avatar === 'cs');
    document.querySelectorAll('[data-avatar-choice]').forEach(item => item.setAttribute('aria-checked', String(item.dataset.avatarChoice === avatar)));
    label();
    if (greet && avatar === '3' && window.GinaFace) requestAnimationFrame(() => setTimeout(window.GinaFace.greet, 160));
  };
  const applyTheme = theme => {
    if (!THEMES[theme]) theme = 'minimal';
    themeNow = theme;
    body.classList.toggle('theme-aurora', theme === 'aurora');
    document.querySelectorAll('[data-theme-choice]').forEach(item => item.setAttribute('aria-checked', String(item.dataset.themeChoice === theme)));
    label();
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
    if (item) {
      write(KEY, item.dataset.avatarChoice);
      apply(item.dataset.avatarChoice, { greet: true });
      close();
      return;
    }
    const theme = e.target.closest('[data-theme-choice]');
    if (theme) {
      write(THEME_KEY, theme.dataset.themeChoice);
      applyTheme(theme.dataset.themeChoice);
      close();
    }
  });

  // Arrow keys move between all cards in the submenu (themes first, then Gina).
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

  applyTheme(read(THEME_KEY));
  apply(read(KEY));
})();
