/* ROCE · Pide · Navegación por secciones dentro de cada carta: píldoras fijas bajo la cabecera que saltan a cada bloque y se iluminan solas al hacer scroll
   (como las pestañas de Honest Greens). Se reconstruyen al cambiar de hoja o de idioma. */
(function () {
  var top = document.getElementById('top'), stage = document.getElementById('cvSections');
  if (!top || !stage) return;
  var nav = document.createElement('nav'); nav.id = 'uxChips'; nav.className = 'ux-chips'; nav.setAttribute('aria-label', 'Secciones'); nav.hidden = true; top.appendChild(nav);
  var raf = 0, ticking = false, manual = 0;
  function cats() { var p = stage.querySelector('.cv-paper:not([hidden])'); return p ? [].slice.call(p.querySelectorAll('.cv-cat:not(.is-hidden)')) : []; }
  function build() {
    var cs = cats(), sig = cs.map(function (c) { return c.id; }).join('|');
    if (nav.dataset.sig === sig && nav.dataset.lang === document.documentElement.lang) { spy(); return; }
    nav.dataset.sig = sig; nav.dataset.lang = document.documentElement.lang; nav.textContent = '';
    cs.forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.dataset.go = c.id; b.textContent = c.querySelector('h3').textContent; nav.appendChild(b); });
    nav.hidden = cs.length < 2; spy();
    try { window.dispatchEvent(new Event('resize')); } catch (e) { /* la cabecera cambió de alto */ }
  }
  function spy() {
    var cs = cats(), line = top.offsetHeight + 24, id = '';
    cs.forEach(function (c) { if (c.getBoundingClientRect().top <= line) id = c.id; });
    if (!id && cs[0]) id = cs[0].id;
    [].forEach.call(nav.children, function (b) {
      var on = b.dataset.go === id; if (b.classList.contains('is-on') !== on) b.classList.toggle('is-on', on);
      if (on && !manual) { var l = b.offsetLeft - (nav.clientWidth - b.offsetWidth) / 2; nav.scrollTo({ left: l, behavior: 'smooth' }); }
    });
  }
  nav.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-go]'); if (!b) return;
    var c = document.getElementById(b.dataset.go); if (!c) return;
    if (c.classList.contains('is-closed')) { c.classList.remove('is-closed'); var h = c.querySelector('.cv-cat-h'); if (h) h.setAttribute('aria-expanded', 'true'); }
    manual = 1; clearTimeout(manual.t); [].forEach.call(nav.children, function (x) { x.classList.toggle('is-on', x === b); });
    c.scrollIntoView({ behavior: 'smooth', block: 'start' }); setTimeout(function () { manual = 0; }, 900);
  });
  window.addEventListener('scroll', function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; spy(); }); }, { passive: true });
  new MutationObserver(function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(build); }).observe(stage, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  build();
})();
