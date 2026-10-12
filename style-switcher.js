(() => {
  const sphere = document.querySelector('.hero-avatar');
  if (!sphere) return;

  const isStyle2 = location.pathname.endsWith('/index-studio-v3.html');
  const targetFile = isStyle2 ? 'index-business-v2.html' : 'index-studio-v3.html';
  const targetLabel = isStyle2 ? 'Style 1' : 'Style 2';

  sphere.setAttribute('role', 'button');
  sphere.setAttribute('tabindex', '0');
  sphere.setAttribute('aria-label', `切換至 ${targetLabel}`);
  sphere.setAttribute('title', `切換至 ${targetLabel}`);

  const prototypeUrl = file => {
    if (location.hostname !== 'htmlpreview.github.io') return file;
    const source = location.search.slice(1);
    const base = source.slice(0, source.lastIndexOf('/') + 1);
    return `https://htmlpreview.github.io/?${base}${file}`;
  };

  const switchStyle = () => {
    sessionStorage.setItem('gina-style-toast', targetLabel);
    location.href = prototypeUrl(targetFile);
  };

  sphere.addEventListener('click', switchStyle);
  sphere.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    switchStyle();
  });

  const pendingLabel = sessionStorage.getItem('gina-style-toast');
  if (pendingLabel) {
    sessionStorage.removeItem('gina-style-toast');
    requestAnimationFrame(() => toast(pendingLabel));
  }
})();
