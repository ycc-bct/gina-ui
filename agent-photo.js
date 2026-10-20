/* Agent photos: anyone can set their own photo for an Agent; it is private to them (this browser only in
   the prototype; per user on the server in production). Click the Agent home avatar → file picker → crop → 套用;
   once a photo is set, the click opens 更換照片 / 恢復預設圖示 instead.
   The photo then replaces the Agent's icon everywhere it shows: sidebar, Recents, Agent home, the new-chat blank state, chat speaker
   labels and the chat header. */
(() => {
  const KEY = k => `gina-agent-photo:${k}`;
  const read = k => { try { return localStorage.getItem(KEY(k)); } catch { return null; } };
  const write = (k, v) => { try { v ? localStorage.setItem(KEY(k), v) : localStorage.removeItem(KEY(k)); return true; } catch { return false; } };
  const agents = () => (typeof AGENTS !== 'undefined' ? AGENTS : []);
  const nameOf = k => (agents().find(a => a.key === k) || {}).name || k;

  // Agent avatar style for everyone at once (account menu → Agent 頭像): 'icon' (default) or 'person'.
  // 人物 uses each Agent's portrait; an Agent without one gets a letter avatar on its colour.
  // Non-person Agents (翻譯) keep their icon. Precedence: your own photo > the chosen style.
  const STYLE_KEY = 'gina-agent-style';
  const PORTRAITS = Object.fromEntries(['tony', 'matt', 'phil', 'seth', 'sapphire', 'francis', 'maria', 'nick']
    .map(k => [k, `assets/agents/${k}.webp?v=host`])); // same flat style as the Host avatar
  const NON_PERSON = new Set(['translate']);
  // Switched off for now: everyone sees icons, whatever was saved before. Flip to true with the menu item in the HTML.
  const AGENT_STYLE_ENABLED = false;
  const readStyle = () => { if (!AGENT_STYLE_ENABLED) return 'icon'; try { return localStorage.getItem(STYLE_KEY) === 'person' ? 'person' : 'icon'; } catch { return 'icon'; } };
  const letterAvatar = a => 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="${a.bg}"/><text x="20" y="26.6" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="19" font-weight="600" fill="${a.fg}">${a.name.charAt(0)}</text></svg>`);
  const portraitOf = a => PORTRAITS[a.key] || letterAvatar(a);
  const rule = (k, url) => `.side-agents [data-agent="${k}"] > .i, .hist-agent[data-agent-key="${k}"], .sp-ico[data-agent-key="${k}"], .agent-blank-icon[data-agent-key="${k}"],
body.specialist[data-agent="${k}"] .spec-big { background: center / cover no-repeat url("${url}") !important; color: transparent !important; }
body.specialist[data-agent="${k}"] .spec-big > .i:first-child { opacity: 0; }`;

  // Two generated stylesheets, style first and photos after, so a photo always wins.
  const presetEl = document.createElement('style');
  presetEl.id = 'agent-style';
  const styleEl = document.createElement('style');
  styleEl.id = 'agent-photos';
  document.head.append(presetEl, styleEl);
  function sync() {
    const style = readStyle();
    document.body.classList.toggle('agent-style-person', style === 'person');
    presetEl.textContent = style === 'person'
      ? agents().filter(a => !NON_PERSON.has(a.key)).map(a => rule(a.key, portraitOf(a))).join('\n')
      : '';
    styleEl.textContent = agents().map(a => { const url = read(a.key); return url ? rule(a.key, url) : ''; }).join('\n');
    const current = document.getElementById('agent-style-current');
    if (current) current.textContent = style === 'person' ? '人物' : '圖示';
    document.querySelectorAll('[data-agent-style]').forEach(c => c.setAttribute('aria-checked', String(c.dataset.agentStyle === style)));
  }

  // Previews in the Agent 頭像 cards: three Agents side by side in each style.
  const SAMPLE = ['tony', 'matt', 'seth'];
  document.querySelectorAll('[data-style-preview]').forEach(box => {
    const person = box.dataset.stylePreview === 'person';
    box.innerHTML = SAMPLE.map(k => agents().find(a => a.key === k)).filter(Boolean).map(a => person
      ? `<span class="as-chip" style="background-image:url('${portraitOf(a)}')"></span>`
      : `<span class="as-chip" style="background:${a.bg};color:${a.fg}">${typeof svg === 'function' ? svg(a.icon) : ''}</span>`).join('');
  });

  // ---------- Crop dialog ----------
  const dialog = document.getElementById('photo-crop');
  const frame = document.getElementById('crop-frame');
  const img = document.getElementById('crop-img');
  const zoom = document.getElementById('crop-zoom');
  const input = document.getElementById('agent-photo-input');
  const FRAME = 240, OUT = 256;
  let natural = { w: 1, h: 1 }, pos = { x: 0, y: 0 }, base = 1, agentKey = null;

  const size = () => ({ w: natural.w * base * +zoom.value, h: natural.h * base * +zoom.value });
  const clamp = () => {
    const { w, h } = size();
    pos.x = Math.min(0, Math.max(FRAME - w, pos.x));
    pos.y = Math.min(0, Math.max(FRAME - h, pos.y));
  };
  const paint = () => {
    const { w, h } = size();
    clamp();
    img.style.width = w + 'px';
    img.style.height = h + 'px';
    img.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
  };

  function openCrop(file) {
    if (!file || !file.type.startsWith('image/')) { if (typeof toast === 'function') toast('請選擇圖片檔'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      img.onload = () => {
        natural = { w: img.naturalWidth, h: img.naturalHeight };
        base = FRAME / Math.min(natural.w, natural.h); // cover the frame at zoom 1
        zoom.value = 1;
        const { w, h } = size();
        pos = { x: (FRAME - w) / 2, y: (FRAME - h) / 2 };
        paint();
        dialog.showModal();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // Drag to pan; the slider zooms around the frame centre.
  let drag = null;
  frame.addEventListener('pointerdown', e => { drag = { x: e.clientX - pos.x, y: e.clientY - pos.y }; frame.setPointerCapture(e.pointerId); frame.classList.add('is-dragging'); });
  frame.addEventListener('pointermove', e => { if (!drag) return; pos = { x: e.clientX - drag.x, y: e.clientY - drag.y }; paint(); });
  const endDrag = () => { drag = null; frame.classList.remove('is-dragging'); };
  frame.addEventListener('pointerup', endDrag);
  frame.addEventListener('pointercancel', endDrag);
  let lastZoom = 1;
  zoom.addEventListener('input', () => {
    const ratio = +zoom.value / lastZoom;
    pos = { x: FRAME / 2 - (FRAME / 2 - pos.x) * ratio, y: FRAME / 2 - (FRAME / 2 - pos.y) * ratio };
    lastZoom = +zoom.value;
    paint();
  });
  zoom.addEventListener('pointerdown', () => { lastZoom = +zoom.value; });
  zoom.addEventListener('focus', () => { lastZoom = +zoom.value; });

  function apply() {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = OUT;
    const ctx = canvas.getContext('2d');
    const f = OUT / FRAME, { w, h } = size();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, OUT, OUT);
    ctx.drawImage(img, pos.x * f, pos.y * f, w * f, h * f);
    const saved = write(agentKey, canvas.toDataURL('image/jpeg', 0.88));
    dialog.close();
    sync();
    if (typeof toast === 'function') toast(saved ? `已更換 ${nameOf(agentKey)} 的照片（只有你看得到）` : '無法儲存照片：瀏覽器封鎖了本機儲存');
  }

  // ---------- Wiring ----------
  input.addEventListener('change', e => { openCrop(e.target.files[0]); e.target.value = ''; });
  // Clicking the Agent home avatar: no photo yet → file picker straight away;
  // already has your photo → a small menu (更換照片 / 恢復預設圖示), left-aligned under the avatar.
  const menu = document.getElementById('pop-agent-photo');
  document.addEventListener('click', e => {
    const avatar = e.target.closest('.spec-big');
    if (avatar) {
      agentKey = document.body.dataset.agent;
      if (NON_PERSON.has(agentKey)) return; // tools (翻譯) keep their icon: no photo

      if (!read(agentKey)) { input.click(); return; }
      e.stopPropagation();
      const wasOpen = menu.classList.contains('open');
      if (typeof closePops === 'function') closePops();
      if (wasOpen) return;
      menu.classList.add('open');
      avatar.classList.add('active');
      const r = avatar.getBoundingClientRect();
      menu.style.right = 'auto';
      menu.style.left = Math.max(12, r.left) + 'px';
      menu.style.top = (r.bottom + 10) + 'px';
      menu.querySelector('[role="menuitem"]').focus({ preventScroll: true });
      return;
    }
    const a = e.target.closest('[data-action]');
    if (!a) return;
    switch (a.dataset.action) {
      case 'agent-photo-change': if (typeof closePops === 'function') closePops(); input.click(); break;
      case 'agent-photo-reset': {
        if (typeof closePops === 'function') closePops();
        write(agentKey, null); sync();
        if (typeof toast === 'function') toast(`已恢復 ${nameOf(agentKey)} 的預設頭像`);
        break;
      }
      case 'photo-crop-cancel': dialog.close(); break;
      case 'photo-crop-apply': apply(); break;
    }
  }, true);
  // Agent 頭像 cards: apply to every Agent at once, then close the menus.
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-agent-style]');
    if (!card) return;
    try { localStorage.setItem(STYLE_KEY, card.dataset.agentStyle); } catch { /* storage blocked: still applies this session */ }
    if (card.dataset.agentStyle === 'person') document.body.classList.add('agent-style-person');
    sync();
    if (typeof setAgentStyleMenu === 'function') setAgentStyleMenu(false);
    if (typeof closePops === 'function') closePops();
  });

  const styleMenu = document.getElementById('agent-style-menu');
  if (styleMenu) styleMenu.addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const cards = [...styleMenu.querySelectorAll('[data-agent-style]')];
    const i = cards.indexOf(document.activeElement);
    e.preventDefault(); cards[(i + 1 + cards.length) % cards.length].focus();
  });

  // The avatar is a div[role=button]: open its menu with Enter / Space too.
  document.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('spec-big')) { e.preventDefault(); e.target.click(); }
  });

  window.AgentPhoto = { sync };
  // Loaded after the page script, so AGENTS already exists.
  sync();
})();
