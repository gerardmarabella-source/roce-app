/* ROCE · App de pedidos (sobre la carta). Fase 1 · base: modo Mesa/Recoger, carrito y opciones de plato.
   Pendiente: registro, cobro con Redsys, envío del pedido, pantalla de cocina. */
(function () {
  'use strict';
  var D = window.CARTA, LS = 'roce_app_v1';
  var UI = {
    es: { mesa: 'A mesa', mesa_s: 'Te lo llevamos', recoger: 'Recoger', recoger_s: 'Pasa a por él', mesa_n: 'Escanea el QR de tu mesa', where: 'Mesa', pick: 'Recoger', view: 'Ver pedido', your: 'Tu pedido', how: '¿Cómo lo quieres?',
      choose: 'Elige', extras: 'Extras', note: 'Nota para cocina', note_ph: 'Alergias, sin cebolla…', add: 'Añadir', off: 'No disponible', close: 'Cerrar', total: 'Total', pay: 'Continuar al pago', soon: 'El pago llega en el siguiente paso.', empty: 'Todavía no has añadido nada.',
      paying: 'Preparando el pago…', ok_h: 'Pedido recibido', ok_p: 'Gracias. Tu pedido ya está en cocina.', ok_wait: 'Estamos confirmando tu pago…', ok_ref: 'Pedido', ok_table: 'Te lo llevamos a la mesa', ok_pick: 'Pasa a recogerlo cuando te avisemos', ko_h: 'Pago no completado', ko_p: 'No se ha cobrado nada. Tu pedido sigue en el carrito para que lo intentes de nuevo.',
      e_closed: 'ya no está disponible ahora:', e_unav: 'no está disponible:', e_table: 'No reconocemos esta mesa. Escanea de nuevo el QR de tu mesa o elige recoger.', e_pend: 'Tienes demasiados pedidos sin pagar. Espera unos minutos.', e_gen: 'No hemos podido preparar el pago. Inténtalo de nuevo.', e_net: 'Sin conexión. Inténtalo de nuevo.', e_dis: 'El pago online no está disponible ahora mismo. Pide en barra, por favor.',
      from: 'Desde las', until: 'Hasta las', prot: 'Más proteína', side: 'Acompañamientos', na: 'No disponible ahora', avail: 'Disponible', with_: 'Con', done: 'Hecho', to_table: 'Pedido a la mesa', to_pick: 'Pedido para recoger en el local' },
    en: { mesa: 'At table', mesa_s: 'We bring it to you', recoger: 'Pick up', recoger_s: 'Come and get it', mesa_n: "Scan your table's QR", where: 'Table', pick: 'Pick up', view: 'View order', your: 'Your order', how: 'How do you want it?',
      choose: 'Choose', extras: 'Extras', note: 'Note for the kitchen', note_ph: 'Allergies, no onion…', add: 'Add', off: 'Unavailable', close: 'Close', total: 'Total', pay: 'Continue to payment', soon: 'Payment arrives in the next step.', empty: "You haven't added anything yet.",
      paying: 'Preparing payment…', ok_h: 'Order received', ok_p: 'Thank you. Your order is in the kitchen.', ok_wait: 'Confirming your payment…', ok_ref: 'Order', ok_table: "We'll bring it to your table", ok_pick: "Come and pick it up when we let you know", ko_h: 'Payment not completed', ko_p: 'Nothing was charged. Your order is still in the cart so you can try again.',
      e_closed: 'is no longer available right now:', e_unav: 'is not available:', e_table: "We don't recognise this table. Scan your table's QR again or choose pick up.", e_pend: 'You have too many unpaid orders. Wait a few minutes.', e_gen: "We couldn't prepare the payment. Try again.", e_net: 'No connection. Try again.', e_dis: 'Online payment is not available right now. Please order at the counter.',
      from: 'From', until: 'Until', prot: 'More protein', side: 'Sides', na: 'Not available now', avail: 'Available', with_: 'With', done: 'Done', to_table: 'Order to your table', to_pick: 'Order to pick up at the venue' }
  };
  var S = { mode: 'recoger', mesa: '', mesaName: '', cart: [] };
  var B = window.ROCE_BACKEND;
  try { var sv = JSON.parse(localStorage.getItem(LS) || '{}'); S.cart = Array.isArray(sv.cart) ? sv.cart : []; S.mesa = sv.mesa || ''; S.mesaName = sv.mesaName || ''; S.mode = sv.mode || 'recoger'; } catch (e) {}
  var q = new URLSearchParams(location.search);
  if (q.get('m')) { S.mesa = String(q.get('m')).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40); S.mesaName = ''; S.mode = S.mesa ? 'mesa' : 'recoger'; history.replaceState(null, '', '/' + location.hash); }
  var ret = q.get('pago') ? { st: q.get('pago'), ref: String(q.get('ref') || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 12) } : null;
  if (ret) history.replaceState(null, '', '/' + location.hash);
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
  var RULES = { 'Tostadas': { to: '12:00' }, 'Sándwiches': { from: '12:00' }, 'Starters': { from: '12:00' }, 'Pokes': { from: '12:00' }, 'Platos ROCE': { from: '12:00' }, 'Acompañamientos': { from: '12:00' } };
  var bk = function (b) { return b.key || b.title.es; };      // los extras de proteína se piden todo el día
  function nowHM() { var p = {}; new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Madrid' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); return p.hour + ':' + p.minute; }
  function open(b) { var r = RULES[bk(b)], n = nowHM(); return !r || !((r.from && n < r.from) || (r.to && n >= r.to)); }
  function hoursLabel(b) { var r = RULES[bk(b)]; return !r ? '' : r.from ? t('from') + ' ' + r.from : t('until') + ' ' + r.to; }

  function secOf(b) { var f = ''; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (x) { if (x === b) f = s.id; }); }); }); return f; }
  /* Complementos que se ofrecen (plegados) al pedir un plato: primero acompañamientos, luego más proteína. */
  var ADDON = [
    { id: 'side', key: 'Acompañamientos', label: 'side', forCats: ['Sándwiches', 'Pokes', 'Platos ROCE'] },
    { id: 'prot', key: 'Extras', label: 'prot', forCats: ['Tostadas', 'Sándwiches', 'Pokes', 'Platos ROCE'] }
  ];
  function addonBlock(g) { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (gr) { gr.blocks.forEach(function (x) { if (bk(x) === g.key) f = x; }); }); }); return f; }
  function addonsFor(b) { return ADDON.filter(function (g) { var ab = addonBlock(g); return ab && ab !== b && g.forCats.indexOf(bk(b)) !== -1; }); }
  function protBlock() { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (x) { if (x.key === 'Extras') f = x; }); }); }); return f; }
  function blockOf(id) { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (b) { if (b._id === id) f = b; }); }); }); return f; }

  /* Marca los platos fuera de horario cada vez que la carta se pinta */
  var userOpen = {};
  document.addEventListener('click', function (e) { var t0 = e.target.closest('[data-toggle]'); if (t0) userOpen[t0.dataset.toggle] = true; }, true);
  function mark() {
    [].forEach.call(document.querySelectorAll('.cv-cat'), function (sec) {
      var b = blockOf(sec.id); if (!b) return; var ok = open(b);
      if (!ok && !userOpen[sec.id]) { sec.classList.add('is-closed'); var hh = sec.querySelector('.cv-cat-h'); if (hh) hh.setAttribute('aria-expanded', 'false'); }
      [].forEach.call(sec.querySelectorAll('.cv-item'), function (li) { if (ok) li.removeAttribute('data-off'); else li.setAttribute('data-off', ''); });
      sec.classList.toggle('is-na', !ok);
      var h = sec.querySelector('.ap-hours'), lab = hoursLabel(b), hd = sec.querySelector('.cv-cat-h');
      if (lab && !h) { h = document.createElement('span'); h.className = 'ap-hours'; }
      if (h) {
        h.classList.toggle('is-na', !ok); h.textContent = t('avail') + ' ' + lab.toLowerCase();
        if (hd) { if (!ok) sec.insertBefore(h, sec.firstChild); else hd.parentNode.insertBefore(h, hd.nextSibling); }
      }
    });
  }
  new MutationObserver(function () { mark(); }).observe($('cvSections'), { childList: true });

  /* Modo (mesa / recoger) en la barra */
  var mesaLabel = function () { return S.mesaName || S.mesa; };
  function paintMode() { $('apModeBtn').textContent = S.mode === 'mesa' ? t('where') + ' ' + mesaLabel() : t('pick'); }
  new MutationObserver(function () { paintMode(); paintBar(); mark(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  /* Diálogo común */
  var dlg = $('apDlg'), cur = null, view = '';
  function show(html) { $('apDlgIn').innerHTML = html; if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); } var b = dlg.querySelector('.cv-sheet-body'); if (b) b.scrollTop = 0; }
  function hide() { if (dlg.open) dlg.close(); view = ''; cur = null; }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) hide(); });

  function openMode() {
    view = 'mode';
    show('<h2>' + t('how') + '</h2><div class="cv-sheet-body"><button type="button" class="cv-pick" data-mode="mesa" aria-pressed="' + (S.mode === 'mesa') + '"' + (S.mesa ? '' : ' disabled') + '><i class="cv-radio"></i><span>' + t('mesa') + ' · ' + (S.mesa ? t('where') + ' ' + esc(mesaLabel()) : t('mesa_n')) + '</span></button>' +
      '<button type="button" class="cv-pick" data-mode="recoger" aria-pressed="' + (S.mode === 'recoger') + '"><i class="cv-radio"></i><span>' + t('recoger') + ' · ' + t('recoger_s') + '</span></button></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-solid" data-close>' + t('done') + '</button></div>');
  }

  /* Plato */
  function openItem(li) {
    var m = /^it-(.+)-(\d+)$/.exec(li.id || ''); if (!m) return; var b = blockOf(m[1]); if (!b) return; var it = b.items[+m[2]];
    cur = { b: b, it: it, qty: 1, variant: it.variants ? 0 : -1, extras: [], sel: { side: [], prot: [] }, openG: { side: false, prot: false }, note: '', ok: open(b) }; view = 'item'; paintItem();
  }
  function unit() { var u = cents(cur.it.price); if (cur.b.extras) cur.b.extras.list.forEach(function (e, k) { if (cur.extras.indexOf(k) !== -1) u += cents(extraPrice(e[1])); }); return u; }
  function protTotal() { var s = 0; ADDON.forEach(function (g) { var ab = addonBlock(g); if (ab) (cur.sel[g.id] || []).forEach(function (k) { s += cents(ab.items[k].price); }); }); return s; }
  function keepNote() { var n = $('apNote'); if (n) cur.note = n.value; }
  function paintItem() {
    var it = cur.it, b = cur.b, h = '<h2>' + esc(it.name) + '</h2><div class="cv-sheet-body">' + (it.es ? '<p>' + esc(tx({ es: it.es, en: it.en })) + '</p>' : '');
    if (it.variants) h += '<section class="cv-fs"><h3>' + t('choose') + '</h3>' + it.variants.map(function (v, k) { return '<button type="button" class="cv-pick" data-v="' + k + '" aria-pressed="' + (cur.variant === k) + '"><i class="cv-radio"></i><span>' + esc(v.name) + '</span></button>'; }).join('') + '</section>';
    if (b.extras) h += '<section class="cv-fs"><h3>' + esc(tx(b.extras.title)) + '</h3>' + b.extras.list.map(function (e, k) { var p = extraPrice(e[1]); return '<button type="button" class="cv-pick" data-x="' + k + '" aria-pressed="' + (cur.extras.indexOf(k) !== -1) + '"><i class="cv-radio"></i><span>' + esc(tx(e[0])) + '</span>' + (p ? '<span class="ap-pick-price">+' + money(cents(p)) + '</span>' : '') + '</button>'; }).join('') + '</section>';
    addonsFor(b).forEach(function (g) {
      var ab = addonBlock(g), sel = cur.sel[g.id], opn = cur.openG[g.id];
      if (!open(ab)) { h += '<section class="cv-fs"><div class="ap-fold is-na"><span>' + t(g.label) + '</span><em>' + esc(t('avail')) + ' ' + esc(hoursLabel(ab).toLowerCase()) + '</em></div></section>'; return; }
      h += '<section class="cv-fs"><button type="button" class="ap-fold" data-fold="' + g.id + '" aria-expanded="' + opn + '"><span>' + t(g.label) + (sel.length ? ' · ' + sel.length : '') + '</span><i></i></button>';
      if (opn) h += ab.items.map(function (p, k) { return '<button type="button" class="cv-pick" data-pr="' + g.id + ':' + k + '" aria-pressed="' + (sel.indexOf(k) !== -1) + '"><i class="cv-radio"></i><span>' + esc(p.name) + '</span><span class="ap-pick-price">+' + money(cents(p.price)) + '</span></button>'; }).join('');
      h += '</section>';
    });
    h += '<section class="cv-fs"><h3>' + t('note') + '</h3><textarea class="ap-note" id="apNote" maxlength="200" placeholder="' + esc(t('note_ph')) + '">' + esc(cur.note) + '</textarea></section>';
    h += '<div class="ap-qty"><button type="button" data-q="-1" aria-label="-">−</button><b>' + cur.qty + '</b><button type="button" data-q="1" aria-label="+">+</button></div></div>';
    h += '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-close>' + t('close') + '</button><button type="button" class="cv-solid" data-addcart' + (cur.ok ? '' : ' disabled') + '>' + (cur.ok ? t('add') + ' · ' + money((unit() + protTotal()) * cur.qty) : t('off')) + '</button></div>';
    var sc = (dlg.querySelector('.cv-sheet-body') || {}).scrollTop || 0; show(h); var bd = dlg.querySelector('.cv-sheet-body'); if (bd) bd.scrollTop = sc;
  }
  function addToCart() {
    keepNote(); var it = cur.it, b = cur.b, key = [bk(b), it.name, cur.variant, cur.extras.slice().sort().join('+'), cur.sel.side.slice().sort().join('+'), cur.sel.prot.slice().sort().join('+'), cur.note].join('|'), parts = [];
    if (cur.variant >= 0) parts.push(it.variants[cur.variant].name); cur.extras.forEach(function (k) { parts.push('+ ' + tx(b.extras.list[k][0])); });
    var f = S.cart.filter(function (l) { return l.key === key; })[0];
    if (f) f.qty += cur.qty; else S.cart.push({ key: key, item: bk(b) + '|' + (it.code || it.name), name: it.name, variant: cur.variant >= 0 ? it.variants[cur.variant].name : '', extras: cur.extras.map(function (k) { return b.extras.list[k][0].es; }), unit: unit(), qty: cur.qty, note: cur.note, detail: parts.join(' · ') });
    ADDON.forEach(function (g) {
      var ab = addonBlock(g); if (!ab || !open(ab)) return;
      cur.sel[g.id].forEach(function (k) {
        var p = ab.items[k], k2 = [bk(ab), p.name, 'con', it.name, cur.variant].join('|'), f2 = S.cart.filter(function (l) { return l.key === k2; })[0];
        if (f2) f2.qty += cur.qty; else S.cart.push({ key: k2, item: bk(ab) + '|' + (p.code || p.name), name: p.name, variant: '', extras: [], unit: cents(p.price), qty: cur.qty, note: '', detail: t('with_') + ' ' + it.name });
      });
    });
    save(); hide(); paintBar();
  }

  /* Pedido */
  function totals() { var n = 0, c = 0; S.cart.forEach(function (l) { n += l.qty; c += l.qty * l.unit; }); return { n: n, c: c }; }
  function paintBar() { var s = totals(); $('apCartBar').hidden = !s.n; document.body.classList.toggle('ap-has-cart', !!s.n); $('apCartQty').textContent = s.n; $('apCartLbl').textContent = t('view'); $('apCartTot').textContent = money(s.c); }
  function openCart() {
    view = 'cart'; var s = totals(), h = '<h2>' + t('your') + '</h2><div class="cv-sheet-body"><p>' + (S.mode === 'mesa' ? t('where') + ' ' + esc(mesaLabel()) + ' · ' + t('to_table') : t('to_pick')) + '</p>';
    if (!S.cart.length) h += '<p>' + t('empty') + '</p>';
    else h += S.cart.map(function (l, i) { return '<div class="ap-line"><div class="ap-line-b"><b>' + esc(l.name) + '</b>' + (l.detail ? '<span>' + esc(l.detail) + '</span>' : '') + (l.note ? '<span>“' + esc(l.note) + '”</span>' : '') + '</div><div class="ap-line-r"><div>' + money(l.unit * l.qty) + '</div><div class="ap-qty"><button type="button" data-cq="' + i + ':-1" aria-label="-">−</button><b>' + l.qty + '</b><button type="button" data-cq="' + i + ':1" aria-label="+">+</button></div></div></div>'; }).join('') +
      '<div class="ap-total"><span>' + t('total') + '</span><span>' + money(s.c) + '</span></div>';
    h += '</div><div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-close>' + t('close') + '</button>' + (S.cart.length ? '<button type="button" class="cv-solid" data-pay>' + t('pay') + '</button>' : '') + '</div>';
    show(h);
  }

  /* Eventos */
  $('cvSections').addEventListener('click', function (e) { var li = e.target.closest('.cv-item'); if (li) openItem(li); });
  $('apModeBtn').addEventListener('click', openMode);
  $('apCartOpen').addEventListener('click', openCart);
  dlg.addEventListener('click', function (e) {
    var el = e.target.closest('[data-close],[data-mode],[data-v],[data-x],[data-q],[data-cq],[data-addcart],[data-pay],[data-fold],[data-pr]'); if (!el || el.disabled) return;
    if (el.hasAttribute('data-close')) hide();
    else if (el.dataset.mode) { S.mode = el.dataset.mode; save(); paintMode(); openMode(); }
    else if (el.dataset.v !== undefined && cur) { keepNote(); cur.variant = +el.dataset.v; paintItem(); }
    else if (el.dataset.x !== undefined && cur) { keepNote(); var k = +el.dataset.x, i = cur.extras.indexOf(k); if (i === -1) cur.extras.push(k); else cur.extras.splice(i, 1); paintItem(); }
    else if (el.dataset.q && cur) { keepNote(); cur.qty = Math.max(1, Math.min(20, cur.qty + (+el.dataset.q))); paintItem(); }
    else if (el.dataset.cq) { var a = el.dataset.cq.split(':'), l = S.cart[+a[0]]; l.qty += +a[1]; if (l.qty < 1) S.cart.splice(+a[0], 1); save(); paintBar(); openCart(); }
    else if (el.hasAttribute('data-addcart') && cur) addToCart();
    else if (el.hasAttribute('data-fold') && cur) { keepNote(); cur.openG[el.dataset.fold] = !cur.openG[el.dataset.fold]; paintItem(); }
    else if (el.dataset.pr !== undefined && cur) { keepNote(); var pp = el.dataset.pr.split(':'), arr = cur.sel[pp[0]], kp = +pp[1], ip = arr.indexOf(kp); if (ip === -1) arr.push(kp); else arr.splice(ip, 1); paintItem(); }
    else if (el.hasAttribute('data-pay')) { if (window.ROCE_ACCT) window.ROCE_ACCT.require(function () { startCheckout(); }); }
  });


  /* ── Cobro: crear el pedido (la base de datos calcula el total) → firmar con Redsys → ir al banco ── */
  var paying = false;
  function showMsg(h, p, ghost) { view = 'msg'; show('<h2>' + h + '</h2><div class="cv-sheet-body"><p>' + p + '</p></div><div class="cv-sheet-actions"><button type="button" class="cv-solid" data-close>' + t('close') + '</button></div>'); }
  function errText(x) {
    var m = String((x && x.message) || '');
    if (/item_closed:(.*)/.test(m)) return RegExp.$1 + ' ' + t('e_closed').replace(/:$/, '.');
    if (/item_unavailable|bad_variant|bad_extra/.test(m)) return t('e_unav') + ' ' + m.split(':').slice(1).join(':');
    if (/bad_table/.test(m)) return t('e_table');
    if (/too_many_pending/.test(m)) return t('e_pend');
    if (x && x.status === undefined && /fetch|network|Failed/i.test(m)) return t('e_net');
    return t('e_gen');
  }
  function payApp(orderId) {
    return window.ROCE_ACCT.session().then(function (s) {
      if (!s) throw new Error('no_session');
      return fetch(B.url + '/functions/v1/redsys', { method: 'POST', headers: { apikey: B.anonKey, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'pay_app', order_id: orderId, lang: L() }) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok) { var e = new Error(j.error || 'pay_failed'); e.status = r.status; throw e; } return j; }); });
    });
  }
  function postToBank(p) {
    var f = document.createElement('form'); f.method = 'POST'; f.action = p.url; f.style.display = 'none';
    ['Ds_SignatureVersion', 'Ds_MerchantParameters', 'Ds_Signature'].forEach(function (k) { var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = p[k]; f.appendChild(i); });
    document.body.appendChild(f); f.submit();
  }
  /* El cobro está listo (SQL y función ya en producción) pero Redsys está en modo REAL: el cobro solo se activa en el móvil de quien abre
     la app con ?pay=1 (queda recordado); con ?pay=0 se apaga. Para abrirlo a todos, pon PAY_LIVE = true cuando haya pantalla de cocina. */
  var PAY_LIVE = false;
  try { if (q.get('pay') === '1') localStorage.setItem('roce_app_testpay', '1'); if (q.get('pay') === '0') localStorage.removeItem('roce_app_testpay'); } catch (e) {}
  var PAY_TEST = false; try { PAY_TEST = localStorage.getItem('roce_app_testpay') === '1'; } catch (e) {}
  function startCheckout() {
    if (!PAY_LIVE && !PAY_TEST) { showMsg(t('your'), t('soon')); return; }
    if (paying || !S.cart.length) return;
    paying = true; view = 'msg'; show('<h2>' + t('paying') + '</h2><div class="cv-sheet-body"><p>&nbsp;</p></div>');
    var items = S.cart.map(function (l) { return { key: l.item, qty: l.qty, variant: l.variant || '', extras: l.extras || [], note: l.note || '' }; });
    window.ROCE_ACCT.rest('POST', '/rest/v1/rpc/app_create_order', { p_mode: S.mode, p_code: S.mode === 'mesa' ? S.mesa : '', p_notes: '', p_items: items })
      .then(function (r) {
        try { localStorage.setItem('roce_app_pending', JSON.stringify({ ref: r.ref, id: r.id, at: Date.now() })); } catch (e) {}
        return payApp(r.id);
      })
      .then(function (p) { postToBank(p); })
      .catch(function (x) { paying = false; showMsg(t('your'), (x && x.message === 'disabled') || (x && x.status === 503) ? t('e_dis') : errText(x)); });
  }
  /* Vuelta del banco: ?pago=ok|ko&ref=… */
  function handleReturn() {
    if (!ret) return;
    if (ret.st !== 'ok') { showMsg(t('ko_h'), t('ko_p')); return; }
    S.cart = []; save(); paintBar();
    var tries = 0, shown = false;
    function paint(o) {
      var paid = o && o.payment_status === 'paid';
      var where = o && o.mode === 'mesa' ? t('ok_table') + (o.table_name ? ' · ' + t('where') + ' ' + esc(o.table_name) : '') : t('ok_pick');
      view = 'msg';
      show('<h2>' + t('ok_h') + '</h2><div class="cv-sheet-body"><p><b>' + t('ok_ref') + ' ' + esc(ret.ref) + '</b></p><p>' + (paid ? t('ok_p') + '</p><p>' + where : t('ok_wait')) + '</p></div><div class="cv-sheet-actions"><button type="button" class="cv-solid" data-close>' + t('close') + '</button></div>');
      shown = true;
    }
    function poll() {
      window.ROCE_ACCT.rest('GET', '/rest/v1/app_orders?select=ref,mode,table_name,status,payment_status&ref=eq.' + encodeURIComponent(ret.ref) + '&limit=1').then(function (a) {
        var o = a && a[0]; paint(o);
        if ((!o || o.payment_status !== 'paid') && ++tries < 12) setTimeout(poll, 2500);
      }).catch(function () { if (!shown) paint(null); if (++tries < 12) setTimeout(poll, 2500); });
    }
    poll();
  }
  /* El QR trae un código; se resuelve al nombre real de la mesa (si no existe, se ignora el QR). */
  function resolveTable() {
    if (!S.mesa) return;
    fetch(B.url + '/rest/v1/rpc/app_resolve_table', { method: 'POST', headers: { apikey: B.anonKey, Authorization: 'Bearer ' + B.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_code: S.mesa }) })
      .then(function (r) { return r.ok ? r.json() : undefined; })
      .then(function (j) {
        if (j === undefined) return;                       // sin conexión o error: se deja como está
        if (j && j.name) { S.mesaName = j.name; } else { S.mesa = ''; S.mesaName = ''; if (S.mode === 'mesa') S.mode = 'recoger'; }
        save(); paintMode();
      }).catch(function () {});
  }

  paintMode(); paintBar(); mark(); resolveTable(); setTimeout(handleReturn, 400);
  window.ROCE_APP = { state: S };
})();
