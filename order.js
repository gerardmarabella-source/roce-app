/* ROCE · App de pedidos (sobre la carta). Fase 1 · base: modo Mesa/Recoger, carrito y opciones de plato.
   Pendiente: registro, cobro con Redsys, envío del pedido, pantalla de cocina. */
(function () {
  'use strict';
  var D = window.CARTA, LS = 'roce_app_v1';
  var UI = {
    es: { mesa: 'A mesa', mesa_s: 'Te lo llevamos', recoger: 'Recoger', recoger_s: 'Pasa a por él', mesa_n: 'Escanea el QR de tu mesa', where: 'Mesa', pick: 'Recoger', view: 'Ver pedido', your: 'Tu pedido', how: '¿Cómo lo quieres?',
      choose: 'Elige', extras: 'Extras', note: 'Nota para cocina', note_ph: 'Alergias, sin cebolla…', add: 'Añadir', off: 'No disponible', close: 'Cerrar', total: 'Total', pay: 'Continuar al pago', soon: 'El pago llega en el siguiente paso.', empty: 'Todavía no has añadido nada.',
      from: 'Desde las', until: 'Hasta las', done: 'Hecho', to_table: 'Pedido a la mesa', to_pick: 'Pedido para recoger en el local' },
    en: { mesa: 'At table', mesa_s: 'We bring it to you', recoger: 'Pick up', recoger_s: 'Come and get it', mesa_n: "Scan your table's QR", where: 'Table', pick: 'Pick up', view: 'View order', your: 'Your order', how: 'How do you want it?',
      choose: 'Choose', extras: 'Extras', note: 'Note for the kitchen', note_ph: 'Allergies, no onion…', add: 'Add', off: 'Unavailable', close: 'Close', total: 'Total', pay: 'Continue to payment', soon: 'Payment arrives in the next step.', empty: "You haven't added anything yet.",
      from: 'From', until: 'Until', done: 'Done', to_table: 'Order to your table', to_pick: 'Order to pick up at the venue' }
  };
  var S = { mode: 'recoger', mesa: '', cart: [] };
  try { var sv = JSON.parse(localStorage.getItem(LS) || '{}'); S.cart = Array.isArray(sv.cart) ? sv.cart : []; S.mesa = sv.mesa || ''; S.mode = sv.mode || 'recoger'; } catch (e) {}
  var q = new URLSearchParams(location.search);
  if (q.get('m')) { S.mesa = String(q.get('m')).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40); S.mode = S.mesa ? 'mesa' : 'recoger'; history.replaceState(null, '', '/' + location.hash); }
  if (!S.mesa && S.mode === 'mesa') S.mode = 'recoger';
  function save() { try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var L = function () { return document.documentElement.lang === 'en' ? 'en' : 'es'; };
  var t = function (k) { return UI[L()][k]; };
  var tx = function (o) { return o && typeof o === 'object' ? (o[L()] || o.es || '') : (o || ''); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (c) { return new Intl.NumberFormat(L() === 'en' ? 'en-GB' : 'es-ES', { style: 'currency', currency: 'EUR' }).format(c / 100); };
  var cents = function (n) { return Math.round(n * 100); };
  var extraPrice = function (p) { return typeof p === 'number' ? p : parseFloat(String(p).replace('+', '').replace(',', '.')) || 0; };

  /* Horarios por categoría (hora de Madrid) */
  var RULES = { 'Tostadas': { to: '12:00' }, 'Sándwiches': { from: '12:00' }, 'Starters': { from: '12:00' }, 'Pokes': { from: '12:00' }, 'Platos ROCE': { from: '12:00' }, 'Acompañamientos': { from: '12:00' }, 'Extras': { from: '12:00' } };
  function nowHM() { var p = {}; new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Madrid' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); return p.hour + ':' + p.minute; }
  function open(b) { var r = RULES[b.title.es], n = nowHM(); return !r || !((r.from && n < r.from) || (r.to && n >= r.to)); }
  function hoursLabel(b) { var r = RULES[b.title.es]; return !r ? '' : r.from ? t('from') + ' ' + r.from : t('until') + ' ' + r.to; }

  function blockOf(id) { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (b) { if (b._id === id) f = b; }); }); }); return f; }

  /* Marca los platos fuera de horario cada vez que la carta se pinta */
  function mark() {
    [].forEach.call(document.querySelectorAll('.cv-cat'), function (sec) {
      var b = blockOf(sec.id); if (!b) return; var ok = open(b);
      [].forEach.call(sec.querySelectorAll('.cv-item'), function (li) { if (ok) li.removeAttribute('data-off'); else li.setAttribute('data-off', ''); });
      var h = sec.querySelector('.ap-hours'), lab = hoursLabel(b);
      if (lab && !h) { h = document.createElement('span'); h.className = 'ap-hours'; var hd = sec.querySelector('.cv-cat-h'); if (hd) hd.parentNode.insertBefore(h, hd.nextSibling); }
      if (h) { h.textContent = lab + (ok ? '' : ' · ' + t('off').toLowerCase()); }
    });
  }
  new MutationObserver(function () { mark(); }).observe($('cvSections'), { childList: true });

  /* Modo (mesa / recoger) en la barra */
  function paintMode() { $('apModeBtn').textContent = S.mode === 'mesa' ? t('where') + ' ' + S.mesa : t('pick'); }
  new MutationObserver(function () { paintMode(); paintBar(); mark(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* Diálogo común */
  var dlg = $('apDlg'), cur = null, view = '';
  function show(html) { $('apDlgIn').innerHTML = html; if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); } var b = dlg.querySelector('.cv-sheet-body'); if (b) b.scrollTop = 0; }
  function hide() { if (dlg.open) dlg.close(); view = ''; cur = null; }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) hide(); });

  function openMode() {
    view = 'mode';
    show('<h2>' + t('how') + '</h2><div class="cv-sheet-body"><button type="button" class="cv-pick" data-mode="mesa" aria-pressed="' + (S.mode === 'mesa') + '"' + (S.mesa ? '' : ' disabled') + '><i class="cv-radio"></i><span>' + t('mesa') + ' · ' + (S.mesa ? t('where') + ' ' + esc(S.mesa) : t('mesa_n')) + '</span></button>' +
      '<button type="button" class="cv-pick" data-mode="recoger" aria-pressed="' + (S.mode === 'recoger') + '"><i class="cv-radio"></i><span>' + t('recoger') + ' · ' + t('recoger_s') + '</span></button></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-solid" data-close>' + t('done') + '</button></div>');
  }

  /* Plato */
  function openItem(li) {
    var m = /^it-(.+)-(\d+)$/.exec(li.id || ''); if (!m) return; var b = blockOf(m[1]); if (!b) return; var it = b.items[+m[2]];
    cur = { b: b, it: it, qty: 1, variant: it.variants ? 0 : -1, extras: [], note: '', ok: open(b) }; view = 'item'; paintItem();
  }
  function unit() { var u = cents(cur.it.price); if (cur.b.extras) cur.b.extras.list.forEach(function (e, k) { if (cur.extras.indexOf(k) !== -1) u += cents(extraPrice(e[1])); }); return u; }
  function keepNote() { var n = $('apNote'); if (n) cur.note = n.value; }
  function paintItem() {
    var it = cur.it, b = cur.b, h = '<h2>' + esc(it.name) + '</h2><div class="cv-sheet-body">' + (it.es ? '<p>' + esc(tx({ es: it.es, en: it.en })) + '</p>' : '');
    if (it.variants) h += '<section class="cv-fs"><h3>' + t('choose') + '</h3>' + it.variants.map(function (v, k) { return '<button type="button" class="cv-pick" data-v="' + k + '" aria-pressed="' + (cur.variant === k) + '"><i class="cv-radio"></i><span>' + esc(v.name) + '</span></button>'; }).join('') + '</section>';
    if (b.extras) h += '<section class="cv-fs"><h3>' + esc(tx(b.extras.title)) + '</h3>' + b.extras.list.map(function (e, k) { var p = extraPrice(e[1]); return '<button type="button" class="cv-pick" data-x="' + k + '" aria-pressed="' + (cur.extras.indexOf(k) !== -1) + '"><i class="cv-radio"></i><span>' + esc(tx(e[0])) + '</span>' + (p ? '<span class="ap-pick-price">+' + money(cents(p)) + '</span>' : '') + '</button>'; }).join('') + '</section>';
    h += '<section class="cv-fs"><h3>' + t('note') + '</h3><textarea class="ap-note" id="apNote" maxlength="200" placeholder="' + esc(t('note_ph')) + '">' + esc(cur.note) + '</textarea></section>';
    h += '<div class="ap-qty"><button type="button" data-q="-1" aria-label="-">−</button><b>' + cur.qty + '</b><button type="button" data-q="1" aria-label="+">+</button></div></div>';
    h += '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-close>' + t('close') + '</button><button type="button" class="cv-solid" data-addcart' + (cur.ok ? '' : ' disabled') + '>' + (cur.ok ? t('add') + ' · ' + money(unit() * cur.qty) : t('off')) + '</button></div>';
    var sc = (dlg.querySelector('.cv-sheet-body') || {}).scrollTop || 0; show(h); var bd = dlg.querySelector('.cv-sheet-body'); if (bd) bd.scrollTop = sc;
  }
  function addToCart() {
    keepNote(); var it = cur.it, b = cur.b, key = [b.title.es, it.name, cur.variant, cur.extras.slice().sort().join('+'), cur.note].join('|'), parts = [];
    if (cur.variant >= 0) parts.push(it.variants[cur.variant].name); cur.extras.forEach(function (k) { parts.push('+ ' + tx(b.extras.list[k][0])); });
    var f = S.cart.filter(function (l) { return l.key === key; })[0];
    if (f) f.qty += cur.qty; else S.cart.push({ key: key, item: b.title.es + '|' + (it.code || it.name), name: it.name, variant: cur.variant >= 0 ? it.variants[cur.variant].name : '', extras: cur.extras.map(function (k) { return b.extras.list[k][0].es; }), unit: unit(), qty: cur.qty, note: cur.note, detail: parts.join(' · ') });
    save(); hide(); paintBar();
  }

  /* Pedido */
  function totals() { var n = 0, c = 0; S.cart.forEach(function (l) { n += l.qty; c += l.qty * l.unit; }); return { n: n, c: c }; }
  function paintBar() { var s = totals(); $('apCartBar').hidden = !s.n; document.body.classList.toggle('ap-has-cart', !!s.n); $('apCartQty').textContent = s.n; $('apCartLbl').textContent = t('view'); $('apCartTot').textContent = money(s.c); }
  function openCart() {
    view = 'cart'; var s = totals(), h = '<h2>' + t('your') + '</h2><div class="cv-sheet-body"><p>' + (S.mode === 'mesa' ? t('where') + ' ' + esc(S.mesa) + ' · ' + t('to_table') : t('to_pick')) + '</p>';
    if (!S.cart.length) h += '<p>' + t('empty') + '</p>';
    else h += S.cart.map(function (l, i) { return '<div class="ap-line"><div class="ap-line-b"><b>' + esc(l.name) + '</b>' + (l.detail ? '<span>' + esc(l.detail) + '</span>' : '') + (l.note ? '<span>“' + esc(l.note) + '”</span>' : '') + '</div><div class="ap-line-r"><div>' + money(l.unit * l.qty) + '</div><div class="ap-qty"><button type="button" data-cq="' + i + ':-1" aria-label="-">−</button><b>' + l.qty + '</b><button type="button" data-cq="' + i + ':1" aria-label="+">+</button></div></div></div>'; }).join('') +
      '<div class="ap-total"><span>' + t('total') + '</span><span>' + money(s.c) + '</span></div><p class="ap-info">' + t('soon') + '</p>';
    h += '</div><div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-close>' + t('close') + '</button>' + (S.cart.length ? '<button type="button" class="cv-solid" data-pay>' + t('pay') + '</button>' : '') + '</div>';
    show(h);
  }

  /* Eventos */
  $('cvSections').addEventListener('click', function (e) { var li = e.target.closest('.cv-item'); if (li) openItem(li); });
  $('apModeBtn').addEventListener('click', openMode);
  $('apCartOpen').addEventListener('click', openCart);
  dlg.addEventListener('click', function (e) {
    var el = e.target.closest('[data-close],[data-mode],[data-v],[data-x],[data-q],[data-cq],[data-addcart],[data-pay]'); if (!el || el.disabled) return;
    if (el.hasAttribute('data-close')) hide();
    else if (el.dataset.mode) { S.mode = el.dataset.mode; save(); paintMode(); openMode(); }
    else if (el.dataset.v !== undefined && cur) { keepNote(); cur.variant = +el.dataset.v; paintItem(); }
    else if (el.dataset.x !== undefined && cur) { keepNote(); var k = +el.dataset.x, i = cur.extras.indexOf(k); if (i === -1) cur.extras.push(k); else cur.extras.splice(i, 1); paintItem(); }
    else if (el.dataset.q && cur) { keepNote(); cur.qty = Math.max(1, Math.min(20, cur.qty + (+el.dataset.q))); paintItem(); }
    else if (el.dataset.cq) { var a = el.dataset.cq.split(':'), l = S.cart[+a[0]]; l.qty += +a[1]; if (l.qty < 1) S.cart.splice(+a[0], 1); save(); paintBar(); openCart(); }
    else if (el.hasAttribute('data-addcart') && cur) addToCart();
    else if (el.hasAttribute('data-pay')) { if (window.ROCE_ACCT) window.ROCE_ACCT.require(function () { openCart(); }); }
  });

  paintMode(); paintBar(); mark();
  window.ROCE_APP = { state: S };
})();
