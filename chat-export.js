/* 匯出對話: the 匯出 button on the chat header (and 匯出對話 in a chat's ⋯ menu in the sidebar) opens a small panel
   with two formats. Only finished messages are exported (an AI reply counts once it has its time stamp);
   replies still being written, attachments and chart source files are left out.
     .txt  plain text: [time] speaker, then the message
     .md   Markdown: headings per message, lists, tables, quotes and bold kept */
(() => {
  const head = document.getElementById('chat-head');
  const btn = document.getElementById('ch-export');
  const panel = document.getElementById('export-pop');
  const thread = document.getElementById('thread');
  if (!head || !btn || !panel || !thread) return;

  const pad = n => String(n).padStart(2, '0');
  const stamp = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const clock = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const title = () => (document.getElementById('ch-title-text')?.textContent || '對話').trim();
  const defaultSpeaker = () => {
    const key = document.body.classList.contains('specialist') ? document.body.dataset.agent : null;
    return key && typeof AGENT_META !== 'undefined' && AGENT_META[key] ? AGENT_META[key].name : 'Gina';
  };

  // Finished messages in reading order: {who, time, el}.
  function messages() {
    const out = [];
    let speaker = null;
    [...thread.children].forEach(el => {
      if (el.classList.contains('msg-user')) {
        speaker = null;
        out.push({ who: '你', time: el.querySelector('.msg-time')?.textContent.trim() || '', el: el.querySelector('.bubble-user') });
      } else if (el.classList.contains('msg-ai')) {
        const named = el.querySelector('.ai-speaker b')?.textContent.trim();
        if (named) speaker = named;
        const time = el.querySelector('.ai-time')?.textContent.trim();
        const bubble = el.querySelector('.bubble-ai');
        if (!time || !bubble) return; // still being written
        out.push({ who: speaker || defaultSpeaker(), time, el: bubble });
      }
    });
    return out;
  }

  // ---- Markdown from the reply HTML (the tags the prototype uses) ----
  const inline = node => [...node.childNodes].map(n => {
    if (n.nodeType === 3) return n.textContent.replace(/\s+/g, ' ');
    if (n.nodeType !== 1) return '';
    const t = n.tagName.toLowerCase(), s = inline(n);
    if (t === 'b' || t === 'strong') return s.trim() ? `**${s.trim()}**` : '';
    if (t === 'i' || t === 'em') return s.trim() ? `*${s.trim()}*` : '';
    if (t === 'code') return '`' + n.textContent + '`';
    if (t === 'a') return n.getAttribute('href') ? `[${s}](${n.getAttribute('href')})` : s;
    if (t === 'br') return '\n';
    if (t === 'button' || t === 'svg') return '';
    return s;
  }).join('');
  const cell = n => inline(n).trim().replace(/\|/g, '\\|');
  function blocks(node) {
    const out = [];
    let line = '';
    const flush = () => { if (line.trim()) out.push(line.trim()); line = ''; };
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) { line += n.textContent.replace(/\s+/g, ' '); return; }
      if (n.nodeType !== 1) return;
      const t = n.tagName.toLowerCase();
      if (/^h[1-6]$/.test(t)) { flush(); out.push('#### ' + inline(n).trim()); }
      else if (t === 'p') { flush(); const s = inline(n).trim(); if (s) out.push(s); }
      else if (t === 'ul' || t === 'ol') {
        flush();
        out.push([...n.children].filter(li => li.tagName === 'LI').map((li, i) => `${t === 'ol' ? `${i + 1}.` : '-'} ${inline(li).trim()}`).join('\n'));
      }
      else if (t === 'blockquote') { flush(); out.push(blocks(n).split('\n').map(l => '> ' + l).join('\n')); }
      else if (t === 'table') {
        flush();
        const rows = [...n.querySelectorAll('tr')].map(tr => [...tr.children].map(cell));
        if (rows.length) out.push([`| ${rows[0].join(' | ')} |`, `| ${rows[0].map(() => '---').join(' | ')} |`, ...rows.slice(1).map(r => `| ${r.join(' | ')} |`)].join('\n'));
      }
      else if (t === 'pre') { flush(); out.push('```\n' + n.textContent.trim() + '\n```'); }
      else if (['div', 'section', 'article', 'figure'].includes(t)) { flush(); const s = blocks(n); if (s) out.push(s); }
      else if (t === 'button' || t === 'svg' || t === 'details') { /* controls, not content */ }
      else line += inline(n);
    });
    flush();
    return out.join('\n\n');
  }

  function build(format) {
    const now = new Date();
    const list = messages();
    if (format === 'md') {
      return [`# ${title()}`, `_匯出時間：${stamp(now)} ${clock(now)}_`,
        ...list.map(m => `### ${m.who}${m.time ? ` · ${m.time}` : ''}\n\n${m.el.classList.contains('bubble-user') ? m.el.textContent.trim() : blocks(m.el)}`)].join('\n\n') + '\n';
    }
    return [title(), `匯出時間：${stamp(now)} ${clock(now)}`, '',
      ...list.map(m => `[${m.time}] ${m.who}\n${(m.el.innerText || m.el.textContent).trim()}\n`)].join('\n');
  }

  function download(format) {
    const name = `${title().replace(/[\\/:*?"<>|]/g, '_')}_${stamp(new Date())}.${format}`;
    const blob = new Blob([build(format)], { type: format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    close();
    if (typeof toast === 'function') toast(`已匯出 ${name}`);
  }

  // ---- Panel: under the 匯出 button, right-aligned; fixed so the header's fade mask never clips it ----
  function place() {
    const r = btn.getBoundingClientRect();
    panel.style.top = `${r.bottom + 8}px`;
    panel.style.left = `${Math.max(12, Math.min(r.right - panel.offsetWidth, innerWidth - panel.offsetWidth - 12))}px`;
  }
  function open() {
    if (typeof closePops === 'function') closePops();
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('active');
    place();
    panel.querySelector('[data-export]').focus({ preventScroll: true });
  }
  function close(focusBtn = false) {
    if (panel.hidden) return;
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('active');
    if (focusBtn) btn.focus();
  }

  btn.addEventListener('click', e => { e.stopPropagation(); panel.hidden ? open() : close(); });
  panel.addEventListener('click', e => {
    e.stopPropagation();
    const f = e.target.closest('[data-export]');
    if (f) download(f.dataset.export);
  });
  document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) { e.stopPropagation(); close(true); } }, true);
  addEventListener('resize', () => { if (!panel.hidden) place(); });
  // The header hides when the chat closes; the panel goes with it.
  new MutationObserver(() => { if (head.hidden) close(); }).observe(head, { attributes: true, attributeFilter: ['hidden'] });

  // From a chat's ⋯ menu in the sidebar: open that chat, then the same panel.
  window.ChatExport = {
    openFor(key) {
      if (!key) return;
      const [kind, x, y] = key.split(':');
      const sel = kind === 'g' ? `.sidebar [data-hist="${x}"]`
        : kind === 'a' ? `.sidebar [data-agent-history="${y}"][data-agent-key="${x}"], #agent-recents-list [data-agent-history="${y}"][data-agent-key="${x}"]`
        : `.sidebar [data-new-chat="${x}"]`;
      const row = document.querySelector(sel);
      const isOpen = row && row.classList.contains('active') && document.body.classList.contains('chatting');
      if (row && !isOpen) row.click();
      setTimeout(() => { if (!head.hidden) open(); }, isOpen ? 0 : 120);
    }
  };
})();
