/* ROCE · Pide: tutorial de la primera vez en la carta (desliza para cambiar de carta). Se enseña una sola vez por dispositivo. */
(function () {
  var KEY = 'roce_app_tour_swipe', MQ = window.matchMedia('(max-width: 767px)');
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  var shown = false, timer = 0, auto = 0;
  function lang() { return (document.documentElement.lang || 'es').slice(0, 2) === 'en' ? 'en' : 'es'; }
  var TX = {
    es: { h: 'Pasa la hoja', p: 'Desliza el dedo hacia los lados para cambiar de carta.', ok: 'Entendido', n: ['Kitchen', 'Fresh Juices', 'Bakery', 'Coffee & Matcha', 'Drinks'] },
    en: { h: 'Turn the page', p: 'Swipe left or right to switch between menus.', ok: 'Got it', n: ['Kitchen', 'Fresh Juices', 'Bakery', 'Coffee & Matcha', 'Drinks'] }
  };
  function done() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    clearTimeout(timer); clearTimeout(auto);
    var el = document.getElementById('apTour'); if (!el) return;
    el.classList.remove('is-on'); setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }
  function ready() {
    var pg = document.getElementById('pg-kitchen'), menu = document.getElementById('cvMenu');
    return MQ.matches && pg && !pg.hidden && menu && menu.hidden && !document.querySelector('dialog[open]');
  }
  function show() {
    if (shown || !ready()) return; shown = true;
    var x = TX[lang()], el = document.createElement('div'); el.id = 'apTour'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', x.h);
    el.innerHTML = '<div class="ap-tour-card"><div class="ap-tour-hand" aria-hidden="true"><svg viewBox="0 0 64 40" width="64" height="40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 20h44M18 12l-8 8 8 8M46 12l8 8-8 8"/></svg><i></i></div>' +
      '<div class="ap-tour-t"><b>' + x.h + '</b><span>' + x.p + '</span></div></div>' +
      '<button type="button" class="ap-tour-ok">' + x.ok + '</button>';
    document.body.appendChild(el);
    requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-on'); }); });
    el.addEventListener('click', done);
    ['touchstart', 'wheel'].forEach(function (ev) { window.addEventListener(ev, function once() { window.removeEventListener(ev, once); if (shown) done(); }, { passive: true }); });
    auto = setTimeout(done, 12000);
  }
  function check() { clearTimeout(timer); if (shown) return; timer = setTimeout(show, 1200); }
  document.addEventListener('carta:ready', check);
  var menu = document.getElementById('cvMenu'), st = document.getElementById('cvSections');
  if (menu) new MutationObserver(check).observe(menu, { attributes: true, attributeFilter: ['hidden'] });
  if (st) new MutationObserver(check).observe(st, { attributes: true, subtree: true, attributeFilter: ['hidden'] });
  check();
})();
