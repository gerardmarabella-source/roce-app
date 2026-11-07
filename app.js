/* ROCE · App de pedidos (PWA). Fase 1 · base: carta, carrito, modo Mesa/Recoger.
   Pendiente (siguientes pasos): registro, cobro con Redsys, envío del pedido, pantalla de cocina. */
(function () {
  'use strict';
  var D = window.CARTA, LS = 'roce_app_v1';

  /* ── Textos ── */
  var UI = {
    es: {
      mesa: 'A mesa', mesa_s: 'Te lo llevamos', mesa_n: 'Escanea el QR de tu mesa', recoger: 'Recoger', recoger_s: 'Pasa a por él',
      where_mesa: 'Mesa', where_rec: 'Para recoger', add: 'Añadir', off: 'No disponible', from: 'Desde las', until: 'Hasta las',
      view: 'Ver pedido', your: 'Tu pedido', extras: 'Extras', choose: 'Elige', note: 'Nota para cocina', note_ph: 'Alergias, sin cebolla…',
      total: 'Total', pay: 'Continuar al pago', soon: 'El pago llega en el siguiente paso', empty: 'Todavía no has añadido nada.', close: 'Cerrar',
      al: 'Alérgenos', del: 'Quitar', info_mesa: 'Pedido a la mesa', info_rec: 'Pedido para recoger en el local', add_for: 'Añadir', one: 'plato', many: 'platos',
      kcal_t: 'Valores por ración', pend: 'Consulta alérgenos al equipo'
    },
    en: {
      mesa: 'At table', mesa_s: 'We bring it to you', mesa_n: "Scan your table's QR", recoger: 'Pick up', recoger_s: 'Come and get it',
      where_mesa: 'Table', where_rec: 'Pick up', add: 'Add', off: 'Unavailable', from: 'From', until: 'Until',
      view: 'View order', your: 'Your order', extras: 'Extras', choose: 'Choose', note: 'Note for the kitchen', note_ph: 'Allergies, no onion…',
      total: 'Total', pay: 'Continue to payment', soon: 'Payment arrives in the next step', empty: "You haven't added anything yet.", close: 'Close',
      al: 'Allergens', del: 'Remove', info_mesa: 'Order to your table', info_rec: 'Order to pick up at the venue', add_for: 'Add', one: 'item', many: 'items',
      kcal_t: 'Per serving', pend: 'Ask the team about allergens'
    }
  };

  /* ── Estado ── */
  var S = { lang: 'es', mode: 'recoger', mesa: '', cart: [], tab: '' };
  try { var sv = JSON.parse(localStorage.getItem(LS) || '{}'); S.lang = sv.lang === 'en' ? 'en' : 'es'; S.cart = Array.isArray(sv.cart) ? sv.cart : []; S.mesa = sv.mesa || ''; S.mode = sv.mode || 'recoger'; } catch (e) {}
  var q = new URLSearchParams(location.search);
  if (q.get('m')) { S.mesa = String(q.get('m')).slice(0, 40); S.mode = 'mesa'; history.replaceState(null, '', '/'); }
  if (!S.mesa && S.mode === 'mesa') S.mode = 'recoger';
  function save() { try { localStorage.setItem(LS, JSON.stringify({ lang: S.lang, cart: S.cart, mesa: S.mesa, mode: S.mode })); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  var t = function (k) { return UI[S.lang][k]; };
  var tx = function (o) { return o && typeof o === 'object' ? (o[S.lang] || o.es || '') : (o || ''); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return new Intl.NumberFormat(S.lang === 'en' ? 'en-GB' : 'es-ES', { style: 'currency', currency: 'EUR' }).format(n); };
  var cents = function (n) { return Math.round(n * 100); };

  /* ── Horarios (hora de Madrid) ── */
  var RULES = { 'Tostadas': { to: '12:00' }, 'Sándwiches': { from: '12:00' }, 'Starters': { from: '12:00' }, 'Pokes': { from: '12:00' }, 'Platos ROCE': { from: '12:00' }, 'Acompañamientos': { from: '12:00' }, 'Extras': { from: '12:00' } };
  function nowHM() {
    var p = {}; new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Madrid' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return p.hour + ':' + p.minute;
  }
  function blockState(b) {
    var r = RULES[b.title.es], n = nowHM();
    if (!r) return { ok: true, label: '' };
    if (r.from && n < r.from) return { ok: false, label: t('from') + ' ' + r.from };
    if (r.to && n >= r.to) return { ok: false, label: t('until') + ' ' + r.to + ' (' + t('off').toLowerCase() + ')' };
    return { ok: true, label: r.to ? t('until') + ' ' + r.to : '' };
  }

  /* ── Carta plana: los bloques de Kitchen, Coffee & Matcha y Fresh Juices ── */
  var CATS = [];
  D.sections.forEach(function (s) {
    if (s.soon) return;
    s.groups.forEach(function (g) { g.blocks.forEach(function (b, i) { CATS.push({ id: 'c' + CATS.length, block: b, sec: s.id }); }); });
  });
  S.tab = S.tab || (CATS[0] && CATS[0].id);
  function extraPrice(p) { return typeof p === 'number' ? p : parseFloat(String(p).replace('+', '').replace(',', '.')) || 0; }

  /* ── Pintado ── */
  function als(arr, pend) {
    if (!arr || !arr.length) return pend ? '<span class="ap-als" title="' + esc(t('pend')) + '"></span>' : '';
    return '<span class="ap-als" aria-label="' + esc(t('al')) + '">' + arr.map(function (n) { return '<span class="ap-al" title="' + esc(tx(D.allergens[n - 1])) + '">' + n + '</span>'; }).join('') + '</span>';
  }
  function nutHtml(n) {
    var l = S.lang === 'en' ? ['Kcal', 'P', 'C', 'F'] : ['Kcal', 'P', 'C', 'G'];
    return '<div class="ap-i-nut" title="' + esc(t('kcal_t')) + '"><span><b>' + l[0] + '</b>' + n[0] + '</span><span><b>' + l[1] + '</b>' + n[1] + ' g</span><span><b>' + l[2] + '</b>' + n[2] + ' g</span><span><b>' + l[3] + '</b>' + n[3] + ' g</span></div>';
  }
  function render() {
    document.documentElement.lang = S.lang;
    [].forEach.call(document.querySelectorAll('#apLang button'), function (b) { b.classList.toggle('is-on', b.dataset.l === S.lang); });
    $('apWhere').textContent = S.mode === 'mesa' ? t('where_mesa') + ' ' + S.mesa : t('where_rec');
    $('apMode').innerHTML =
      '<button type="button" data-mode="mesa"' + (S.mesa ? '' : ' disabled') + (S.mode === 'mesa' ? ' class="is-on"' : '') + '><b>' + t('mesa') + '</b><span>' + (S.mesa ? t('where_mesa') + ' ' + esc(S.mesa) : t('mesa_n')) + '</span></button>' +
      '<button type="button" data-mode="recoger"' + (S.mode === 'recoger' ? ' class="is-on"' : '') + '><b>' + t('recoger') + '</b><span>' + t('recoger_s') + '</span></button>';
    $('apTabs').innerHTML = CATS.map(function (c) { return '<button type="button" data-tab="' + c.id + '"' + (c.id === S.tab ? ' class="is-on"' : '') + '>' + esc(tx(c.block.title)) + '</button>'; }).join('');
    $('apMain').innerHTML = CATS.map(function (c) {
      var b = c.block, st = blockState(b);
      return '<section class="ap-cat" id="' + c.id + '"><h2>' + esc(tx(b.title)) + '</h2>' +
        (b.note ? '<p class="ap-note">' + esc(tx(b.note)) + '</p>' : '') + (st.label ? '<span class="ap-closed">' + esc(st.label) + '</span>' : '') +
        '<ul class="ap-items">' + b.items.map(function (it, i) {
          var off = !st.ok;
          return '<li class="ap-item' + (off ? ' is-off' : '') + '"><button type="button" class="ap-i-body" data-open="' + c.id + ':' + i + '"><div class="ap-i-name">' +
            (it.code && it.code !== it.name ? '<em>' + esc(it.code) + '</em>' : '') + esc(it.name) + (it.note ? ' <small>' + esc(tx(it.note)) + '</small>' : '') + als(it.al, b.alPending) + '</div>' +
            (it.es ? '<p class="ap-i-desc">' + esc(tx({ es: it.es, en: it.en })) + '</p>' : '') + (it.nut ? nutHtml(it.nut) : '') +
            '<div class="ap-i-price">' + money(it.price) + '</div></button>' +
            '<button type="button" class="ap-add" data-open="' + c.id + ':' + i + '" aria-label="' + esc(t('add') + ' ' + it.name) + '">' + (off ? esc(t('off')) : '+') + '</button></li>';
        }).join('') + '</ul></section>';
    }).join('');
    cartBar();
  }
  function cartTotals() { var n = 0, c = 0; S.cart.forEach(function (l) { n += l.qty; c += l.qty * l.unit; }); return { n: n, cents: c }; }
  function cartBar() {
    var c = cartTotals(); $('apCartBar').hidden = !c.n;
    $('apCartQty').textContent = c.n; $('apCartLbl').textContent = t('view'); $('apCartTot').textContent = money(c.cents / 100);
  }

  /* ── Hoja de plato ── */
  var cur = null;
  function openSheet(html) { var c = $('apSheetCard'); c.innerHTML = html; $('apSheet').hidden = false; document.body.style.overflow = 'hidden'; c.scrollTop = 0; c.focus({ preventScroll: true }); }
  function closeSheet() { $('apSheet').hidden = true; document.body.style.overflow = ''; cur = null; }
  function openItem(cid, i) {
    var c = CATS.filter(function (x) { return x.id === cid; })[0], b = c.block, it = b.items[i], st = blockState(b);
    cur = { cat: c, it: it, qty: 1, variant: it.variants ? 0 : -1, extras: [], note: '', ok: st.ok };
    paintItem();
  }
  function itemUnit() { var u = cents(cur.it.price); (cur.cat.block.extras ? cur.cat.block.extras.list : []).forEach(function (e, k) { if (cur.extras.indexOf(k) !== -1) u += cents(extraPrice(e[1])); }); return u; }
  function paintItem() {
    var it = cur.it, b = cur.cat.block, h = '<h3>' + esc(it.name) + '</h3>' + (it.es ? '<p class="ap-i-desc">' + esc(tx({ es: it.es, en: it.en })) + '</p>' : '') + als(it.al, b.alPending) + (it.nut ? nutHtml(it.nut) : '');
    if (it.variants) {
      h += '<div class="ap-sec"><h4>' + t('choose') + '</h4>' + it.variants.map(function (v, k) {
        return '<label class="ap-opt"><span><input type="radio" name="v" value="' + k + '"' + (cur.variant === k ? ' checked' : '') + '>' + esc(v.name) + '</span></label>';
      }).join('') + '</div>';
    }
    if (b.extras) {
      h += '<div class="ap-sec"><h4>' + esc(tx(b.extras.title)) + '</h4>' + b.extras.list.map(function (e, k) {
        return '<label class="ap-opt"><span><input type="checkbox" name="x" value="' + k + '"' + (cur.extras.indexOf(k) !== -1 ? ' checked' : '') + '>' + esc(tx(e[0])) + '</span><em>+' + money(extraPrice(e[1])) + '</em></label>';
      }).join('') + '</div>';
    }
    h += '<div class="ap-sec"><h4>' + t('note') + '</h4><textarea class="ap-note-in" id="apNote" maxlength="200" placeholder="' + esc(t('note_ph')) + '">' + esc(cur.note) + '</textarea></div>';
    h += '<div class="ap-qty"><button type="button" data-q="-1" aria-label="-">−</button><b>' + cur.qty + '</b><button type="button" data-q="1" aria-label="+">+</button></div>';
    h += '<button type="button" class="ap-cta" data-addcart' + (cur.ok ? '' : ' disabled') + '>' + (cur.ok ? t('add_for') + ' · ' + money(itemUnit() * cur.qty / 100) : t('off')) + '</button><button type="button" class="ap-ghost" data-close>' + t('close') + '</button>';
    var sc = $('apSheetCard').scrollTop; openSheet(h); $('apSheetCard').scrollTop = sc;
  }
  function addToCart() {
    var it = cur.it, b = cur.cat.block, key = [b.title.es, it.name, cur.variant, cur.extras.slice().sort().join('+'), cur.note].join('|');
    var parts = []; if (cur.variant >= 0) parts.push(it.variants[cur.variant].name);
    cur.extras.forEach(function (k) { parts.push('+ ' + tx(b.extras.list[k][0])); });
    var found = S.cart.filter(function (l) { return l.key === key; })[0];
    if (found) found.qty += cur.qty; else S.cart.push({ key: key, name: it.name, code: it.code || '', cat: b.title.es, variant: cur.variant >= 0 ? it.variants[cur.variant].name : '', extras: cur.extras.map(function (k) { return b.extras.list[k][0].es; }), unit: itemUnit(), qty: cur.qty, note: cur.note, detail: parts.join(' · ') });
    save(); closeSheet(); cartBar();
  }

  /* ── Carrito ── */
  function openCart() {
    var c = cartTotals(), h = '<h3>' + t('your') + '</h3><p class="ap-i-desc">' + (S.mode === 'mesa' ? t('where_mesa') + ' ' + esc(S.mesa) + ' · ' + t('info_mesa') : t('info_rec')) + '</p>';
    if (!S.cart.length) h += '<div class="ap-empty">' + t('empty') + '</div>';
    else {
      h += S.cart.map(function (l, i) {
        return '<div class="ap-line"><div class="ap-line-b"><b>' + esc(l.name) + '</b>' + (l.detail ? '<p>' + esc(l.detail) + '</p>' : '') + (l.note ? '<p>“' + esc(l.note) + '”</p>' : '') + '</div><div class="ap-line-r"><div>' + money(l.unit * l.qty / 100) + '</div><div class="ap-qty"><button type="button" data-cq="' + i + ':-1" aria-label="-">−</button><b>' + l.qty + '</b><button type="button" data-cq="' + i + ':1" aria-label="+">+</button></div></div></div>';
      }).join('');
      h += '<div class="ap-total"><span>' + t('total') + '</span><span>' + money(c.cents / 100) + '</span></div>';
      h += '<p class="ap-info">' + t('soon') + '</p><button type="button" class="ap-cta" disabled>' + t('pay') + '</button>';
    }
    h += '<button type="button" class="ap-ghost" data-close>' + t('close') + '</button>';
    openSheet(h);
  }

  /* ── Eventos ── */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-open],[data-tab],[data-mode],[data-q],[data-cq],[data-addcart],[data-close],[data-l]'); if (!el) return;
    if (el.dataset.open) { var p = el.dataset.open.split(':'); openItem(p[0], +p[1]); }
    else if (el.dataset.tab) { S.tab = el.dataset.tab; [].forEach.call(document.querySelectorAll('#apTabs button'), function (b) { b.classList.toggle('is-on', b.dataset.tab === S.tab); }); var s = $(S.tab); if (s) window.scrollTo({ top: s.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' }); }
    else if (el.dataset.mode) { if (el.disabled) return; S.mode = el.dataset.mode; save(); render(); }
    else if (el.dataset.q) { if (cur) { cur.note = ($('apNote') || {}).value || cur.note; cur.qty = Math.max(1, Math.min(20, cur.qty + (+el.dataset.q))); paintItem(); } }
    else if (el.dataset.cq) { var a = el.dataset.cq.split(':'), l = S.cart[+a[0]]; l.qty += +a[1]; if (l.qty < 1) S.cart.splice(+a[0], 1); save(); cartBar(); openCart(); }
    else if (el.dataset.addcart !== undefined) { if (cur) { cur.note = ($('apNote') || {}).value || ''; addToCart(); } }
    else if (el.dataset.close !== undefined) closeSheet();
    else if (el.dataset.l) { S.lang = el.dataset.l; save(); render(); }
  });
  document.addEventListener('change', function (e) {
    if (!cur) return;
    if (e.target.name === 'v') { cur.note = ($('apNote') || {}).value || cur.note; cur.variant = +e.target.value; paintItem(); }
    if (e.target.name === 'x') { cur.note = ($('apNote') || {}).value || cur.note; var k = +e.target.value, ix = cur.extras.indexOf(k); if (ix === -1) cur.extras.push(k); else cur.extras.splice(ix, 1); paintItem(); }
  });
  $('apCartOpen').addEventListener('click', openCart);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('apSheet').hidden) closeSheet(); });
  window.addEventListener('scroll', function () {
    var best = null; CATS.forEach(function (c) { var r = $(c.id).getBoundingClientRect(); if (r.top - 140 <= 0) best = c.id; });
    if (best && best !== S.tab) { S.tab = best; [].forEach.call(document.querySelectorAll('#apTabs button'), function (b) { var on = b.dataset.tab === S.tab; b.classList.toggle('is-on', on); if (on && b.scrollIntoView) b.parentNode.scrollLeft = b.offsetLeft - 20; }); }
  }, { passive: true });

  render();
  window.ROCE_APP = { state: S };
})();
