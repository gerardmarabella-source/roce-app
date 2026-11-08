/* ROCE · App de pedidos (sobre la carta). Fase 1 · base: modo Mesa/Recoger, carrito y opciones de plato.
   Pendiente: registro, cobro con Redsys, envío del pedido, pantalla de cocina. */
(function () {
  'use strict';
  var D = window.CARTA, LS = 'roce_app_v1';
  var UI = {
    es: { mesa: 'A mesa', mesa_s: 'Te lo llevamos', recoger: 'Recoger', recoger_s: 'Pasa a por él', mesa_n: 'Escanea el QR de tu mesa', where: 'Mesa', pick: 'Recoger', view: 'Ver pedido', your: 'Tu pedido', how: '¿Cómo lo quieres?',
      choose: 'Elige', pick_h: 'Elige {n} sabores', pick_left: 'Faltan {k}', extras: 'Extras', note: 'Nota para cocina', note_ph: 'Alergias, alguna petición…', note_ph_toast: 'Alergias, sin rúcula, bien tostada…', note_ph_acai: 'Alergias, sin granola, fruta aparte…', note_ph_sand: 'Alergias, sin rúcula, salsa aparte…', note_ph_start: 'Alergias, sin cebolla, salsa aparte…', note_ph_bowl: 'Alergias, sin cebolla, aliño aparte…', note_ph_side: 'Alergias, sin sal…', note_bar: 'Nota para barra', note_ph_bakery: 'Calentar, para llevar, alergias…', note_ph_coffee: 'Leche de avena, sin azúcar, bien caliente…', note_ph_fresh: 'Sin hielo, sin azúcar, alergias…', note_ph_drinks: 'Sin hielo, con limón…', add: 'Añadir', off: 'No disponible', close: 'Cerrar', total: 'Total', pay: 'Continuar al pago', soon: 'El pago llega en el siguiente paso.', empty: 'Todavía no has añadido nada.',
      paying: 'Preparando el pago…', ok_h: 'Pedido recibido', ok_p: 'Gracias. Tu pedido ya está en cocina.', ok_wait: 'Estamos confirmando tu pago…', ok_ref: 'Pedido', ok_table: 'Te lo llevamos a la mesa', ok_pick: 'Pasa a recogerlo cuando te avisemos', ko_h: 'Pago no completado', ko_p: 'No se ha cobrado nada. Tu pedido sigue en el carrito para que lo intentes de nuevo.',
      e_closed: 'ya no está disponible ahora:', e_unav: 'no está disponible:', e_table: 'No reconocemos esta mesa. Escanea de nuevo el QR de tu mesa o elige recoger.', e_pend: 'Tienes demasiados pedidos sin pagar. Espera unos minutos.', e_gen: 'No hemos podido preparar el pago. Inténtalo de nuevo.', e_net: 'Sin conexión. Inténtalo de nuevo.', e_dis: 'El pago online no está disponible ahora mismo. Pide en barra, por favor.',
      warn_h: 'Cuidado: alérgenos', warn_contains: 'contiene', warn_p: 'Son alérgenos que has marcado en tu perfil o en los filtros de la carta.', warn_team: 'Si lo pides, avisa también a nuestro equipo de tu alergia. ¿Quieres añadirlo igualmente?', warn_back: 'Volver', warn_ok: 'Añadir igualmente',
      pair_ing: 'Ingredientes', pair_al: 'Alérgenos',
      pair_h: '¿Algo para acompañar?', pair_p: 'Esto le pega a tu', pair_no: 'No, gracias', pair_done: 'Listo',
      from: 'Desde las', until: 'Hasta las', party: '¿Cuántos sois?', scan: 'Escanear el QR de la mesa', scan_t: 'Escanea el QR de tu mesa', scan_p: 'Apunta la cámara al código QR que hay en tu mesa.', scan_deny: 'No hemos podido abrir la cámara. Comprueba el permiso del navegador o escanea el QR con la cámara de tu móvil.', scan_bad: 'Ese código no es de una mesa de ROCE. Prueba con otro.', scan_chk: 'Comprobando la mesa…', scan_ok: 'Mesa reconocida', scan_other: 'Escanear otra mesa', prot: 'Más proteína', side: 'Acompañamientos', na: 'No disponible ahora', avail: 'Disponible', with_: 'Con', done: 'Hecho', to_table: 'Pedido a la mesa', to_pick: 'Pedido para recoger en el local' },
    en: { mesa: 'At table', mesa_s: 'We bring it to you', recoger: 'Pick up', recoger_s: 'Come and get it', mesa_n: "Scan your table's QR", where: 'Table', pick: 'Pick up', view: 'View order', your: 'Your order', how: 'How do you want it?',
      choose: 'Choose', pick_h: 'Choose {n} flavours', pick_left: '{k} to go', extras: 'Extras', note: 'Note for the kitchen', note_ph: 'Allergies, any request…', note_ph_toast: 'Allergies, no rocket, well toasted…', note_ph_acai: 'Allergies, no granola, fruit on the side…', note_ph_sand: 'Allergies, no rocket, sauce on the side…', note_ph_start: 'Allergies, no onion, sauce on the side…', note_ph_bowl: 'Allergies, no onion, dressing on the side…', note_ph_side: 'Allergies, no salt…', note_bar: 'Note for the bar', note_ph_bakery: 'Warm it up, to go, allergies…', note_ph_coffee: 'Oat milk, no sugar, extra hot…', note_ph_fresh: 'No ice, no sugar, allergies…', note_ph_drinks: 'No ice, with lemon…', add: 'Add', off: 'Unavailable', close: 'Close', total: 'Total', pay: 'Continue to payment', soon: 'Payment arrives in the next step.', empty: "You haven't added anything yet.",
      paying: 'Preparing payment…', ok_h: 'Order received', ok_p: 'Thank you. Your order is in the kitchen.', ok_wait: 'Confirming your payment…', ok_ref: 'Order', ok_table: "We'll bring it to your table", ok_pick: "Come and pick it up when we let you know", ko_h: 'Payment not completed', ko_p: 'Nothing was charged. Your order is still in the cart so you can try again.',
      e_closed: 'is no longer available right now:', e_unav: 'is not available:', e_table: "We don't recognise this table. Scan your table's QR again or choose pick up.", e_pend: 'You have too many unpaid orders. Wait a few minutes.', e_gen: "We couldn't prepare the payment. Try again.", e_net: 'No connection. Try again.', e_dis: 'Online payment is not available right now. Please order at the counter.',
      warn_h: 'Careful: allergens', warn_contains: 'contains', warn_p: 'These are allergens you marked in your profile or in the menu filters.', warn_team: 'If you order it, please also tell our team about your allergy. Do you still want to add it?', warn_back: 'Back', warn_ok: 'Add anyway',
      pair_ing: 'Ingredients', pair_al: 'Allergens',
      pair_h: 'Something to go with it?', pair_p: 'These go well with your', pair_no: 'No, thanks', pair_done: 'Done',
      from: 'From', until: 'Until', party: 'How many of you?', scan: 'Scan the table QR', scan_t: 'Scan your table QR', scan_p: 'Point the camera at the QR code on your table.', scan_deny: "We couldn't open the camera. Check the browser permission or scan the QR with your phone camera.", scan_bad: "That code isn't a ROCE table. Try another one.", scan_chk: 'Checking the table…', scan_ok: 'Table recognised', scan_other: 'Scan another table', prot: 'More protein', side: 'Sides', na: 'Not available now', avail: 'Available', with_: 'With', done: 'Done', to_table: 'Order to your table', to_pick: 'Order to pick up at the venue' }
  };
  var S = { mode: 'recoger', mesa: '', mesaName: '', cart: [], party: 2 };
  var B = window.ROCE_BACKEND;
  try { var sv = JSON.parse(localStorage.getItem(LS) || '{}'); S.cart = Array.isArray(sv.cart) ? sv.cart : []; S.mesa = sv.mesa || ''; S.mesaName = sv.mesaName || ''; S.party = Math.max(1, Math.min(20, +sv.party || 2)); S.mode = sv.mode || 'recoger'; } catch (e) {}
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
  var RULES = { 'Tostadas': { to: '12:00' }, 'Starters': { from: '12:00' }, 'Pokes': { from: '12:00' }, 'Platos ROCE': { from: '12:00' }, 'Acompañamientos': { from: '12:00' } };
  var bk = function (b) { return b.key || b.title.es; };      // los extras de proteína se piden todo el día
  function nowHM() { var p = {}; new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Europe/Madrid' }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; }); return p.hour + ':' + p.minute; }
  function open(b) { var r = RULES[bk(b)], n = nowHM(); return !r || !((r.from && n < r.from) || (r.to && n >= r.to)); }
  function hoursLabel(b) { var r = RULES[bk(b)]; return !r ? '' : r.from ? t('from') + ' ' + r.from : t('until') + ' ' + r.to; }

  /* Agotados: lo que el equipo apaga desde el panel (app_menu_items.active) */
  var soldOut = {};
  var itemKey = function (b, it) { return bk(b) + '|' + (it.code || it.name); };
  function loadAvail() {
    fetch(B.url + '/rest/v1/app_menu_items?select=key,active', { headers: { apikey: B.anonKey, Authorization: 'Bearer ' + B.anonKey } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rows) { if (!rows) return; soldOut = {}; rows.forEach(function (x) { if (x.active === false) soldOut[x.key] = true; }); mark(); })
      .catch(function () {});
  }
  window.ROCE_AVAIL = {
    item: function (b, it) { return open(b) && !soldOut[itemKey(b, it)]; },
    meal: function () { return nowHM() < '12:00' ? 'breakfast' : 'lunch'; },
    /* Todos los complementos disponibles ahora para un plato (con sus datos nutricionales): acompañamientos y más proteína. */
    addons: function (b) {
      var out = [];
      addonsFor(b).forEach(function (g) {
        var ab = addonBlock(g); if (!ab || !open(ab)) return;
        ab.items.forEach(function (p, k) { if (!soldOut[itemKey(ab, p)]) out.push({ grp: g.id, k: k, name: p.name, price: p.price, it: p, blk: ab }); });
      });
      return out;
    },
    suggest: function (b, okFn, o) {
      var out = [];
      addonsFor(b).forEach(function (g) {
        var ab = addonBlock(g); if (!ab || !open(ab)) return;
        if (g.id === 'prot' && !(o.protein || o.hungry)) return;
        if (g.id === 'side' && !o.hungry) return;
        for (var k = 0; k < ab.items.length; k++) { var p = ab.items[k]; if (soldOut[itemKey(ab, p)] || !okFn(p, ab)) continue; out.push({ grp: g.id, k: k, name: p.name, price: p.price }); break; }
      });
      return out;
    }
  };
  function secOf(b) { var f = ''; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (x) { if (x === b) f = s.id; }); }); }); return f; }
  /* Complementos que se ofrecen (plegados) al pedir un plato: primero acompañamientos, luego más proteína. */
  var ADDON = [
    { id: 'side', key: 'Acompañamientos', label: 'side', forCats: ['Sándwiches', 'Pokes', 'Platos ROCE'] },
    { id: 'prot', key: 'Extras', label: 'prot', forCats: ['Tostadas', 'Sándwiches', 'Pokes', 'Platos ROCE'] }
  ];
  function addonBlock(g) { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (gr) { gr.blocks.forEach(function (x) { if (bk(x) === g.key) f = x; }); }); }); return f; }
  function addonsFor(b) { return ADDON.filter(function (g) { var ab = addonBlock(g); return ab && ab !== b && g.forCats.indexOf(bk(b)) !== -1; }); }
  function protBlock() { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (x) { if (x.key === 'Extras') f = x; }); }); }); return f; }
  /* Carta a la que pertenece un bloque: kitchen, bakery, coffee, fresh o drinks. */
  function sectionIdOf(b) { var f = ''; D.sections.forEach(function (s) { s.groups.forEach(function (g) { if (g.blocks.indexOf(b) !== -1) f = s.id; }); }); return f; }
  /* El texto de ayuda de la nota cambia según el producto: no se le sugiere «sin cebolla» a un café. */
  function noteTexts(b) {
    var k = sectionIdOf(b);
    if (k === 'coffee' || k === 'fresh' || k === 'drinks') return { title: t('note_bar'), ph: t('note_ph_' + k) };
    if (k === 'bakery') return { title: t('note'), ph: t('note_ph_bakery') };
    /* Cocina: cada producto con su ejemplo (a un açaí no se le sugiere «sin cebolla») */
    var BK = { 'Tostadas': 'toast', 'Açaí & Yogur': 'acai', 'Sándwiches': 'sand', 'Starters': 'start', 'Pokes': 'bowl', 'Platos ROCE': 'bowl', 'Acompañamientos': 'side' };
    var kb = b && b.title && BK[b.title.es];
    return { title: t('note'), ph: t(kb ? 'note_ph_' + kb : 'note_ph') };
  }
  function blockOf(id) { var f = null; D.sections.forEach(function (s) { s.groups.forEach(function (g) { g.blocks.forEach(function (b) { if (b._id === id) f = b; }); }); }); return f; }

  /* Marca los platos fuera de horario cada vez que la carta se pinta */
  var userOpen = {};
  document.addEventListener('click', function (e) { var t0 = e.target.closest('[data-toggle]'); if (t0) userOpen[t0.dataset.toggle] = true; }, true);
  function mark() {
    [].forEach.call(document.querySelectorAll('.cv-cat'), function (sec) {
      var b = blockOf(sec.id); if (!b) return; var ok = open(b);
      if (!ok && !userOpen[sec.id]) { sec.classList.add('is-closed'); var hh = sec.querySelector('.cv-cat-h'); if (hh) hh.setAttribute('aria-expanded', 'false'); }
      [].forEach.call(sec.querySelectorAll('.cv-item'), function (li) {
        var mm = /^it-(.+)-(\d+)$/.exec(li.id || ''), it = mm && b.items[+mm[2]], sold = !!(it && soldOut[itemKey(b, it)]);
        if (ok && !sold) { li.removeAttribute('data-off'); li.removeAttribute('data-sold'); } else { li.setAttribute('data-off', ''); if (sold) li.setAttribute('data-sold', ''); else li.removeAttribute('data-sold'); }
      });
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
  function show(html) { $('apDlgIn').innerHTML = html; if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); } var bx = $('apDlgIn'); bx.setAttribute('tabindex', '-1'); try { bx.focus({ preventScroll: true }); } catch (e) {} var b = dlg.querySelector('.cv-sheet-body'); if (b) b.scrollTop = 0; }
  function hide() { if (dlg.open) dlg.close(); view = ''; cur = null; }
  dlg.addEventListener('click', function (e) { if (e.target === dlg) hide(); });

  function openMode() {
    view = 'mode';
    var mesaOpt = S.mesa
      ? '<button type="button" class="cv-pick" data-mode="mesa" aria-pressed="' + (S.mode === 'mesa') + '"><i class="cv-radio"></i><span>' + t('mesa') + ' · ' + t('where') + ' ' + esc(mesaLabel()) + '</span></button><button type="button" class="ap-scanbtn" data-scan>' + t('scan_other') + '</button>'
      : '<button type="button" class="cv-pick" data-scan><i class="cv-radio"></i><span>' + t('mesa') + ' · ' + t('scan') + '</span></button>';
    show('<h2>' + t('how') + '</h2><div class="cv-sheet-body">' + mesaOpt +
      '<button type="button" class="cv-pick" data-mode="recoger" aria-pressed="' + (S.mode === 'recoger') + '"><i class="cv-radio"></i><span>' + t('recoger') + ' · ' + t('recoger_s') + '</span></button></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-solid" data-close>' + t('done') + '</button></div>');
  }

  /* ── Escáner de QR de la mesa (cámara) ── */
  var scan = { stream: null, iv: 0, on: false, lib: null };
  function loadJsQR() {
    if (window.jsQR) return Promise.resolve();
    if (scan.lib) return scan.lib;
    scan.lib = new Promise(function (res, rej) { var s = document.createElement('script'); s.src = '/assets/js/jsQR.js?v=1'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
    return scan.lib;
  }
  function codeFromText(txt) {
    txt = String(txt || '').trim();
    try {
      var u = new URL(txt), m = u.pathname.match(/^\/mesa\/([A-Za-z0-9_-]{1,40})\/?$/);
      if (m) return m[1];
      var q = u.searchParams.get('m'); if (q) return q.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 40);
    } catch (e) { /* no es una dirección */ }
    return /^[A-Za-z0-9_-]{6,40}$/.test(txt) ? txt : '';
  }
  function stopScan() {
    scan.on = false; if (scan.iv) clearInterval(scan.iv); scan.iv = 0;
    if (scan.stream) { scan.stream.getTracks().forEach(function (tr) { tr.stop(); }); scan.stream = null; }
  }
  dlg.addEventListener('close', stopScan);
  function scanMsg(txt, ok) { var e = document.getElementById('apScanMsg'); if (e) { e.textContent = txt || ''; e.className = 'ap-msg' + (ok ? ' is-ok' : ''); } }
  function openScan() {
    view = 'scan';
    show('<h2>' + t('scan_t') + '</h2><div class="cv-sheet-body"><div class="ap-scan"><video id="apVid" playsinline muted autoplay></video><i class="ap-scan-frame"></i></div><p>' + t('scan_p') + '</p><p class="ap-msg" id="apScanMsg"></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-solid" data-close>' + t('close') + '</button></div>');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { scanMsg(t('scan_deny')); return; }
    Promise.all([loadJsQR(), navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })]).then(function (r) {
      if (view !== 'scan' || !dlg.open) { r[1].getTracks().forEach(function (tr) { tr.stop(); }); return; }
      scan.stream = r[1]; scan.on = true;
      var v = document.getElementById('apVid'); v.srcObject = r[1]; v.setAttribute('playsinline', ''); v.play().catch(function () {});
      var cv = document.createElement('canvas'), cx = cv.getContext('2d', { willReadFrequently: true });
      scan.iv = setInterval(function () {
        if (!scan.on || v.readyState < 2 || !v.videoWidth) return;
        var w = Math.min(640, v.videoWidth), h = Math.round(v.videoHeight * w / v.videoWidth); cv.width = w; cv.height = h;
        cx.drawImage(v, 0, 0, w, h);
        var res = window.jsQR(cx.getImageData(0, 0, w, h).data, w, h, { inversionAttempts: 'dontInvert' });
        if (!res || !res.data) return;
        var code = codeFromText(res.data);
        if (!code) { scanMsg(t('scan_bad')); return; }
        scan.on = false; scanMsg(t('scan_chk'), true);
        S.mesa = code; S.mesaName = ''; S.mode = 'mesa'; save();
        resolveTable().then(function (ok) {
          if (ok === false) { scan.on = true; scanMsg(t('scan_bad')); return; }
          stopScan(); paintMode(); toast(t('scan_ok') + ' · ' + t('where') + ' ' + mesaLabel()); hide();
        });
      }, 150);
    }).catch(function () { scanMsg(t('scan_deny')); });
  }
  /* Plato */
  /* Platos de «elige N» (El Trío): el cliente reparte N unidades entre los sabores (variants); la variante que viaja al servidor es el reparto, p. ej. «2× Pollo + 1× Costilla». */
  function mixDefault(it) { if (!it.pick || !it.variants) return null; var m = it.variants.map(function () { return 0; }); for (var i = 0; i < it.pick; i++) m[i % m.length]++; return m; }
  function mixSum() { return cur.mix ? cur.mix.reduce(function (a, b) { return a + b; }, 0) : 0; }
  function mixStr() { return cur.it.variants.map(function (v, k) { return cur.mix[k] ? cur.mix[k] + '× ' + v.name : ''; }).filter(Boolean).join(' + '); }
  function curVar() { return cur.it.pick ? mixStr() : (cur.variant >= 0 ? cur.it.variants[cur.variant].name : ''); }
  function soldTxt() { return L() === 'en' ? 'Sold out for today' : 'Agotado por hoy'; }
  function openItem(li) {
    var m = /^it-(.+)-(\d+)$/.exec(li.id || ''); if (!m) return; var b = blockOf(m[1]); if (!b) return; var it = b.items[+m[2]];
    cur = { b: b, it: it, qty: 1, variant: it.variants && !it.pick ? 0 : -1, mix: mixDefault(it), extras: [], sel: { side: [], prot: [] }, openG: { side: false, prot: false }, note: '', ok: open(b) && !soldOut[itemKey(b, it)], sold: !!soldOut[itemKey(b, it)] }; view = 'item'; paintItem();
  }
  function unit() { var u = cents(cur.it.price); if (cur.b.extras) cur.b.extras.list.forEach(function (e, k) { if (cur.extras.indexOf(k) !== -1) u += cents(extraPrice(e[1])); }); return u; }
  function protTotal() { var s = 0; ADDON.forEach(function (g) { var ab = addonBlock(g); if (ab) (cur.sel[g.id] || []).forEach(function (k) { s += cents(ab.items[k].price); }); }); return s; }
  function keepNote() { var n = $('apNote'); if (n) cur.note = n.value; }
  function paintItem() {
    var it = cur.it, b = cur.b, h = '<h2>' + esc(it.name) + '</h2><div class="cv-sheet-body">' + (it.img ? '<img class="ap-photo" src="' + esc(it.img) + '" alt="' + esc(it.name) + '">' : '') + (cur.ok ? '' : '<p class="ap-na">' + esc(cur.sold ? soldTxt() : t('avail') + ' ' + hoursLabel(b).toLowerCase()) + '</p>') + (it.es ? '<p>' + esc(tx({ es: it.es, en: it.en })) + '</p>' : '');
    if (it.variants && it.pick) h += '<section class="cv-fs ap-mix"><h3>' + esc(t('pick_h').replace('{n}', it.pick)) + ' · ' + mixSum() + '/' + it.pick + '</h3>' + it.variants.map(function (v, k) { return '<div class="ap-mix-row"><div><b>' + esc(v.name) + '</b><span>' + esc(tx({ es: v.es, en: v.en })) + '</span></div><div class="ap-qty"><button type="button" data-mx="' + k + ':-1" aria-label="-"' + (cur.mix[k] ? '' : ' disabled') + '>−</button><b>' + cur.mix[k] + '</b><button type="button" data-mx="' + k + ':1" aria-label="+"' + (mixSum() >= it.pick ? ' disabled' : '') + '>+</button></div></div>'; }).join('') + '</section>';
    else if (it.variants) h += '<section class="cv-fs"><h3>' + t('choose') + '</h3>' + it.variants.map(function (v, k) { return '<button type="button" class="cv-pick" data-v="' + k + '" aria-pressed="' + (cur.variant === k) + '"><i class="cv-radio"></i><span>' + esc(v.name) + '</span></button>'; }).join('') + '</section>';
    if (cur.ok && b.extras) h += '<section class="cv-fs"><h3>' + esc(tx(b.extras.title)) + '</h3>' + b.extras.list.map(function (e, k) { var p = extraPrice(e[1]); return '<button type="button" class="cv-pick" data-x="' + k + '" aria-pressed="' + (cur.extras.indexOf(k) !== -1) + '"><i class="cv-radio"></i><span>' + esc(tx(e[0])) + '</span>' + (p ? '<span class="ap-pick-price">+' + money(cents(p)) + '</span>' : '') + '</button>'; }).join('') + '</section>';
    (cur.ok ? addonsFor(b) : []).forEach(function (g) {
      var ab = addonBlock(g), sel = cur.sel[g.id], opn = cur.openG[g.id];
      if (!open(ab)) { h += '<section class="cv-fs"><div class="ap-fold is-na"><span>' + t(g.label) + '</span><em>' + esc(t('avail')) + ' ' + esc(hoursLabel(ab).toLowerCase()) + '</em></div></section>'; return; }
      h += '<section class="cv-fs"><button type="button" class="ap-fold" data-fold="' + g.id + '" aria-expanded="' + opn + '"><span>' + t(g.label) + (sel.length ? '<b class="cnt">' + sel.length + '</b>' : '') + '</span><i></i></button>';
      if (opn) h += '<div class="ap-fold-body">' + ab.items.map(function (p, k) { var off = soldOut[itemKey(ab, p)]; return '<button type="button" class="cv-pick" data-pr="' + g.id + ':' + k + '" aria-pressed="' + (sel.indexOf(k) !== -1) + '"' + (off ? ' disabled' : '') + '><i class="cv-radio"></i><span>' + esc(p.name) + (off ? ' · ' + (L() === 'en' ? 'sold out' : 'agotado') : '') + '</span><span class="ap-pick-price">+' + money(cents(p.price)) + '</span></button>'; }).join('') + '</div>';
      h += '</section>';
    });
    var nt = noteTexts(b);
    h += '<section class="cv-fs"><h3>' + nt.title + '</h3><textarea class="ap-note" id="apNote" maxlength="200" placeholder="' + esc(nt.ph) + '">' + esc(cur.note) + '</textarea></section>';
    h += '<div class="ap-qty"><button type="button" data-q="-1" aria-label="-">−</button><b>' + cur.qty + '</b><button type="button" data-q="1" aria-label="+">+</button></div></div>';
    h += '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-close>' + t('close') + '</button><button type="button" class="cv-solid" data-addcart' + (cur.ok && (!it.pick || mixSum() === it.pick) ? '' : ' disabled') + '>' + (!cur.ok ? (cur.sold ? soldTxt() : t('off')) : (it.pick && mixSum() !== it.pick ? t('pick_left').replace('{k}', it.pick - mixSum()) : t('add') + ' · ' + money((unit() + protTotal()) * cur.qty))) + '</button></div>';
    var sc = (dlg.querySelector('.cv-sheet-body') || {}).scrollTop || 0; show(h); var bd = dlg.querySelector('.cv-sheet-body'); if (bd) bd.scrollTop = sc;
  }
  function addToCart() {
    keepNote(); var it = cur.it, b = cur.b, key = [bk(b), it.name, curVar(), cur.extras.slice().sort().join('+'), cur.sel.side.slice().sort().join('+'), cur.sel.prot.slice().sort().join('+'), cur.note].join('|'), parts = [];
    if (curVar()) parts.push(curVar()); cur.extras.forEach(function (k) { parts.push('+ ' + tx(b.extras.list[k][0])); });
    var f = S.cart.filter(function (l) { return l.key === key; })[0];
    if (f) f.qty += cur.qty; else S.cart.push({ key: key, item: bk(b) + '|' + (it.code || it.name), name: it.name, variant: curVar(), extras: cur.extras.map(function (k) { return b.extras.list[k][0].es; }), unit: unit(), qty: cur.qty, note: cur.note, detail: parts.join(' · ') });
    ADDON.forEach(function (g) {
      var ab = addonBlock(g); if (!ab || !open(ab)) return;
      cur.sel[g.id].forEach(function (k) {
        var p = ab.items[k], k2 = [bk(ab), p.name, 'con', it.name, curVar()].join('|'), f2 = S.cart.filter(function (l) { return l.key === k2; })[0];
        if (f2) f2.qty += cur.qty; else S.cart.push({ key: k2, item: bk(ab) + '|' + (p.code || p.name), name: p.name, variant: '', extras: [], unit: cents(p.price), qty: cur.qty, note: '', detail: t('with_') + ' ' + it.name });
      });
    });
    save(); hide(); paintBar();
    offerPair(b, it);
  }

  /* ── Para acompañar: al añadir comida se ofrece café, bebida o bakery que le pega (y se deja fuera lo que no le pega) ──
     Cada plato tiene su lista según la hora: por la mañana café y zumo; a mediodía bebidas frescas y, para terminar, café solo o infusión.
     Lo que no aparece en la lista es porque no pega: café con leche o mocca con platos salados de comida, zumos o smoothies con el açaí
     (ya lleva fruta), bakery con tostadas o açaí (ya son pan o dulce). Se ofrece SIEMPRE que se añade un plato (venta cruzada): «No, gracias» solo cierra esa sugerencia. */
  var DRINK_BLOCKS = ['Cafés', 'Matcha & Tés', 'Smoothies', 'Zumos naturales'];
  var WHY = {
    'flat white': { es: 'Con leche, suave: le pega a lo salado', en: 'Milky and smooth: great with savoury' },
    'cortado': { es: 'Un café corto con un toque de leche', en: 'A short coffee with a touch of milk' },
    'latte': { es: 'Cremoso, para acompañar el desayuno', en: 'Creamy, a classic with breakfast' },
    'americano': { es: 'Ligero, no pelea con el sabor', en: 'Light, it does not compete with the flavour' },
    'espresso': { es: 'Para terminar', en: 'To finish' },
    'matcha': { es: 'Ligero y vegetal', en: 'Light and green' },
    'matcha latte': { es: 'Suave y con leche', en: 'Smooth and creamy' },
    'iced matcha latte': { es: 'Fresco, para la comida', en: 'Cool, perfect with lunch' },
    'té verde': { es: 'Limpia el paladar', en: 'Cleanses the palate' },
    'rooibos': { es: 'Dulce y sin cafeína', en: 'Naturally sweet, caffeine-free' },
    'digestivo': { es: 'Para terminar, ayuda a la digestión', en: 'To finish, helps digestion' },
    'vitality': { es: 'Zumo fresco y equilibrado', en: 'Fresh, balanced juice' },
    'depure': { es: 'Fresco y depurativo', en: 'Fresh and cleansing' },
    'immunity': { es: 'Cítrico y fresco, para compartir mesa', en: 'Citrusy and fresh' },
    'anti-inflammatory': { es: 'Fresco, va con platos con fuerza', en: 'Fresh, stands up to bold flavours' },
    'probiotic': { es: 'Fresco y ligero', en: 'Fresh and light' }
  };
  var CAFE = 'Cafés|', TEA = 'Matcha & Tés|', JUICE = 'Zumos naturales|';
  var PAIR = {
    'Tostadas': { bf: [CAFE + 'Flat white', CAFE + 'Cortado', JUICE + 'Vitality', TEA + 'Matcha latte'] },
    'Açaí & Yogur': { bf: [CAFE + 'Americano', TEA + 'Matcha', TEA + 'Té verde', TEA + 'Rooibos'], lunch: [CAFE + 'Americano', TEA + 'Matcha', TEA + 'Té verde', TEA + 'Rooibos'] },
    'Sándwiches': { bf: [CAFE + 'Latte', CAFE + 'Cortado', CAFE + 'Americano', JUICE + 'Vitality'], lunch: [JUICE + 'Vitality', TEA + 'Iced matcha latte', TEA + 'Té verde', CAFE + 'Espresso'], sweet: true },
    'Starters': { lunch: [JUICE + 'Immunity', TEA + 'Iced matcha latte', TEA + 'Té verde'] },
    'Pokes': { lunch: [JUICE + 'Depure', JUICE + 'Probiotic', TEA + 'Té verde', CAFE + 'Espresso'], sweet: true },
    'Platos ROCE': { lunch: [JUICE + 'Anti-inflammatory', TEA + 'Té verde', CAFE + 'Espresso', TEA + 'Digestivo'], sweet: true }
  };
  /* Bebidas con leche por defecto (la carta no lleva sus alérgenos): se tratan como «leche» al sugerir, para no ofrecerlas a quien es alérgico. */
  var MILKY = ['Flat white', 'Cortado', 'Latte', 'Mocca latte', 'Matcha latte', 'Iced matcha latte'];
  function pairAl(it) { return (it.al || []).concat(MILKY.indexOf(it.name) !== -1 && (it.al || []).indexOf(7) === -1 ? [7] : []); }
  function findItem(key) {
    var a = key.split('|'), f = null;
    D.sections.forEach(function (sec) { (sec.groups || []).forEach(function (g) { g.blocks.forEach(function (blk) { if (bk(blk) === a[0]) blk.items.forEach(function (x) { if (x.name === a[1]) f = { b: blk, it: x }; }); }); }); });
    return f;
  }
  function bakeryPick() {
    var f = null; D.sections.forEach(function (sec) { if (sec.id !== 'bakery') return; (sec.groups || []).forEach(function (g) { g.blocks.forEach(function (blk) { blk.items.forEach(function (x) { if (!f && !soldOut[itemKey(blk, x)]) f = { b: blk, it: x, bakery: true }; }); }); }); });
    return f;
  }
  var pairList = [], pairFood = '';
  function offerPair(b, it) {
    var rule = PAIR[bk(b)]; if (!rule) return;
    var list = rule[nowHM() < '12:00' ? 'bf' : 'lunch'];
    if (!list) return;
    var out = [];
    list.forEach(function (k) {
      var f = findItem(k); if (!f || soldOut[itemKey(f.b, f.it)] || allergenHits(pairAl(f.it)).length) return;
      var w = WHY[f.it.name.toLowerCase()] || null;
      out.push({ b: f.b, it: f.it, why: w, done: false });
    });
    var bp = rule.sweet && nowHM() >= '12:00' ? bakeryPick() : null;
    out = out.slice(0, bp ? 3 : 4);
    if (bp) out.push({ b: bp.b, it: bp.it, why: { es: 'Algo dulce para acabar', en: 'Something sweet to finish' }, done: false });
    if (!out.length) return;
    pairList = out; pairFood = it.name; view = 'pair'; paintPair();
  }
  function paintPair() {
    var h = '<h2>' + esc(t('pair_h')) + '</h2><div class="cv-sheet-body"><p>' + esc(t('pair_p')) + ' ' + esc(pairFood) + '.</p><div class="ap-pair">';
    pairList.forEach(function (x, i) {
      var desc = x.it.es ? tx({ es: x.it.es, en: x.it.en }) : '', als = (x.it.al || []).length ? (t('pair_al') + ': ' + allergenNames(x.it.al)) : '';
      h += '<div class="ap-pair-row' + (x.done ? ' is-done' : '') + '">' +
        '<div class="ap-pair-t"><b>' + esc(x.it.name) + '</b>' + (x.why ? '<em>' + esc(tx(x.why)) + '</em>' : '') +
        (desc || als ? '<details class="ap-pair-det" data-pairdet="' + i + '"' + (x.open ? ' open' : '') + '><summary>' + esc(t('pair_ing')) + '</summary>' + (desc ? '<p>' + esc(desc) + '</p>' : '') + (als ? '<p class="ap-pair-al">' + esc(als) + '</p>' : '') + '</details>' : '') +
        '</div><button type="button" class="ap-pair-add" data-pair="' + i + '"' + (x.done ? ' disabled' : '') + ' aria-label="' + esc(t('add')) + ' ' + esc(x.it.name) + '"><span class="ap-pair-p">' + (x.done ? '✓' : money(cents(x.it.price)) + ' <i>+</i>') + '</span></button></div>';
    });
    h += '</div></div><div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-pairno>' + esc(t('pair_no')) + '</button><button type="button" class="cv-solid" data-close>' + esc(pairList.some(function (x) { return x.done; }) ? t('pair_done') : t('close')) + '</button></div>';
    show(h);
  }
  dlg.addEventListener('toggle', function (e) { var d = e.target; if (d && d.dataset && d.dataset.pairdet !== undefined && pairList[+d.dataset.pairdet]) pairList[+d.dataset.pairdet].open = d.open; }, true);
  function addPair(i) {
    var x = pairList[i]; if (!x || x.done) return;
    var ph = allergenHits(pairAl(x.it)); if (ph.length && !addPair.ok) { warnAllergens(x.it.name, ph, function () { paintPair(); }, function () { addPair.ok = true; addPair(i); addPair.ok = false; }); return; }
    var key = [bk(x.b), x.it.name, -1, '', '', '', ''].join('|'), f = S.cart.filter(function (l) { return l.key === key; })[0];
    if (f) f.qty += 1; else S.cart.push({ key: key, item: bk(x.b) + '|' + (x.it.code || x.it.name), name: x.it.name, variant: '', extras: [], unit: cents(x.it.price), qty: 1, note: '', detail: t('with_') + ' ' + pairFood });
    x.done = true; save(); paintBar(); paintPair();
  }

  /* ── Aviso de alérgenos: si el plato (o algo que se le añade) contiene un alérgeno que el cliente tiene marcado en su perfil o en los
     filtros de la carta, se avisa antes de añadirlo y hay que confirmarlo. No sustituye al aviso al equipo. ── */
  function userAllergies() {
    var a = (window.ROCE_ACCT && window.ROCE_ACCT.allergies ? window.ROCE_ACCT.allergies() : []).slice();
    try { var f = window.CARTA_API && window.CARTA_API.F(); ((f && f.al) || []).forEach(function (n) { if (a.indexOf(n) === -1) a.push(n); }); } catch (e) {}
    return a;
  }
  function allergenHits(als) { var u = userAllergies(); return (als || []).filter(function (n) { return u.indexOf(n) !== -1; }); }
  function allergenNames(ns) { return ns.map(function (n) { var a = D.allergens.filter(function (x) { return x.n === n; })[0]; return a ? tx(a) : String(n); }).join(', '); }
  function uniq(a) { return a.filter(function (x, i) { return a.indexOf(x) === i; }); }
  function itemAllergenHits() {
    var it = cur.it, als = (cur.variant >= 0 && it.variants && it.variants[cur.variant] && it.variants[cur.variant].al) ? it.variants[cur.variant].al : (it.al || []);
    if (it.pick && cur.mix) { als = []; it.variants.forEach(function (v, k) { if (cur.mix[k]) als = als.concat(v.al || []); }); }
    var hits = allergenHits(als);
    ADDON.forEach(function (g) { var ab = addonBlock(g); if (!ab || !open(ab)) return; (cur.sel[g.id] || []).forEach(function (k) { hits = hits.concat(allergenHits(ab.items[k].al)); }); });
    return uniq(hits).sort(function (a, b) { return a - b; });
  }
  var warnBack = null, warnGo = null;
  function warnAllergens(dish, hits, back, go) {
    warnBack = back; warnGo = go; view = 'warn';
    show('<h2>⚠ ' + esc(t('warn_h')) + '</h2><div class="cv-sheet-body"><div class="ap-warn"><p><b>' + esc(dish) + '</b> ' + esc(t('warn_contains')) + ' <b>' + esc(allergenNames(hits)) + '</b>. ' + esc(t('warn_p')) + '</p><p>' + esc(t('warn_team')) + '</p></div></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-warnback>' + esc(t('warn_back')) + '</button><button type="button" class="cv-solid" data-warnok>' + esc(t('warn_ok')) + '</button></div>');
  }

  /* Pedido */
  function totals() { var n = 0, c = 0; S.cart.forEach(function (l) { n += l.qty; c += l.qty * l.unit; }); return { n: n, c: c }; }
  function paintBar() { var s = totals(); $('apCartBar').hidden = !s.n; document.body.classList.toggle('ap-has-cart', !!s.n); $('apCartQty').textContent = s.n; $('apCartLbl').textContent = t('view'); $('apCartTot').textContent = money(s.c); }
  function openCart() {
    view = 'cart'; var s = totals(), h = '<h2>' + t('your') + '</h2><div class="cv-sheet-body"><p>' + (S.mode === 'mesa' ? t('where') + ' ' + esc(mesaLabel()) + ' · ' + t('to_table') : t('to_pick')) + '</p>';
    if (S.mode === 'mesa' && S.cart.length) h += '<div class="ap-party"><span>' + t('party') + '</span><div class="ap-qty"><button type="button" data-party="-1" aria-label="-">−</button><b>' + S.party + '</b><button type="button" data-party="1" aria-label="+">+</button></div></div>';
    if (!S.cart.length) h += '<p>' + t('empty') + '</p>';
    else h += S.cart.map(function (l, i) { return '<div class="ap-line"><div class="ap-line-b"><b>' + esc(l.name) + '</b>' + (l.detail ? '<span>' + esc(l.detail) + '</span>' : '') + (l.note ? '<span>“' + esc(l.note) + '”</span>' : '') + '</div><div class="ap-line-r"><div>' + money(l.unit * l.qty) + '</div><div class="ap-qty"><button type="button" data-cq="' + i + ':-1" aria-label="-">−</button><b>' + l.qty + '</b><button type="button" data-cq="' + i + ':1" aria-label="+">+</button></div></div></div>'; }).join('') +
      '<div class="ap-total"><span>' + t('total') + '</span><span>' + money(s.c) + '</span></div>';
    h += '</div><div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-close>' + t('close') + '</button>' + (S.cart.length ? '<button type="button" class="cv-solid" data-pay>' + t('pay') + '</button>' : '') + '</div>';
    show(h);
  }

  /* Eventos */
  var toastT = null;
  function toast(msg) {
    var d = document.getElementById('apToast'); if (!d) { d = document.createElement('div'); d.id = 'apToast'; d.className = 'ap-toast'; d.setAttribute('role', 'status'); document.body.appendChild(d); }
    d.textContent = msg; d.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { d.classList.remove('is-on'); }, 2600);
  }
  $('cvSections').addEventListener('click', function (e) {
    var li = e.target.closest('.cv-item'); if (!li) return;
    /* Fuera de horario o agotado: se deja abrir para ver la foto y los ingredientes; el botón de añadir sale desactivado. */
    openItem(li);
  });
  $('apModeBtn').addEventListener('click', openMode);
  $('apCartOpen').addEventListener('click', openCart);
  dlg.addEventListener('click', function (e) {
    var el = e.target.closest('[data-close],[data-mode],[data-v],[data-mx],[data-x],[data-q],[data-cq],[data-addcart],[data-pay],[data-fold],[data-pr],[data-party],[data-scan],[data-pair],[data-pairno],[data-warnback],[data-warnok]'); if (!el || el.disabled) return;
    if (el.hasAttribute('data-close')) hide();
    else if (el.dataset.mode) { S.mode = el.dataset.mode; save(); paintMode(); openMode(); }
    else if (el.dataset.v !== undefined && cur) { keepNote(); cur.variant = +el.dataset.v; paintItem(); }
    else if (el.dataset.mx !== undefined && cur) { keepNote(); var mm2 = el.dataset.mx.split(':'), k3 = +mm2[0], d3 = +mm2[1], n3 = cur.mix[k3] + d3; if (n3 >= 0 && mixSum() + d3 <= cur.it.pick) cur.mix[k3] = n3; paintItem(); }
    else if (el.dataset.x !== undefined && cur) { keepNote(); var k = +el.dataset.x, i = cur.extras.indexOf(k); if (i === -1) cur.extras.push(k); else cur.extras.splice(i, 1); paintItem(); }
    else if (el.dataset.q && cur) { keepNote(); cur.qty = Math.max(1, Math.min(20, cur.qty + (+el.dataset.q))); paintItem(); }
    else if (el.dataset.cq) { var a = el.dataset.cq.split(':'), l = S.cart[+a[0]]; l.qty += +a[1]; if (l.qty < 1) S.cart.splice(+a[0], 1); save(); paintBar(); openCart(); }
    else if (el.dataset.pair !== undefined) addPair(+el.dataset.pair);
    else if (el.hasAttribute('data-pairno')) { hide(); }
    else if (el.hasAttribute('data-addcart') && cur) { keepNote(); var hh = itemAllergenHits(); if (hh.length) warnAllergens(cur.it.name, hh, function () { paintItem(); }, addToCart); else addToCart(); }
    else if (el.hasAttribute('data-warnback')) { var wb = warnBack; warnBack = warnGo = null; if (wb) wb(); else hide(); }
    else if (el.hasAttribute('data-warnok')) { var wg = warnGo; warnBack = warnGo = null; if (wg) wg(); }
    else if (el.hasAttribute('data-scan')) { openScan(); }
    else if (el.dataset.party) { S.party = Math.max(1, Math.min(20, S.party + (+el.dataset.party))); save(); openCart(); }
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
    window.ROCE_ACCT.rest('POST', '/rest/v1/rpc/app_create_order', { p_mode: S.mode, p_code: S.mode === 'mesa' ? S.mesa : '', p_notes: '', p_items: items, p_party: S.mode === 'mesa' ? S.party : null })
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
    if (!S.mesa) return Promise.resolve(null);
    return fetch(B.url + '/rest/v1/rpc/app_resolve_table', { method: 'POST', headers: { apikey: B.anonKey, Authorization: 'Bearer ' + B.anonKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_code: S.mesa }) })
      .then(function (r) { return r.ok ? r.json() : undefined; })
      .then(function (j) {
        if (j === undefined) return null;                  // sin conexión o error: se deja como está
        var ok = !!(j && j.name);
        if (ok) { S.mesaName = j.name; } else { S.mesa = ''; S.mesaName = ''; if (S.mode === 'mesa') S.mode = 'recoger'; }
        save(); paintMode(); return ok;
      }).catch(function () { return null; });
  }

  paintMode(); paintBar(); mark(); loadAvail(); resolveTable(); setTimeout(handleReturn, 400);
  window.ROCE_APP = { state: S, openItemById: function (id, preset) {
    var li = document.getElementById(id); if (!li || li.hasAttribute('data-off')) return;
    openItem(li); if (!cur) return;
    String(preset || '').split(',').forEach(function (x) { var p = x.split(':'); if (cur.sel[p[0]] && p[1] !== undefined) { cur.sel[p[0]].push(+p[1]); cur.openG[p[0]] = true; } });
    paintItem();
  } };
})();
