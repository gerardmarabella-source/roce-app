/* ROCE · App de pedidos: cuenta de cliente (registro obligatorio para pedir con la app).
   Entrada con código por email (sin contraseña) y con Google.
   Habla directamente con la API de Supabase Auth (sin librerías); la clave "anon" es pública. */
(function () {
  'use strict';
  var B = window.ROCE_BACKEND, KEY = 'roce_app_session';
  var PROVIDERS = { google: true };      // proveedores sociales activados en Supabase → Authentication → Providers
  var UI = {
    es: { acct: 'Mi cuenta', login: 'Iniciar sesión', edit_s: 'Editar', login_h: 'Inicia sesión para pedir', login_p: 'Te enviamos un código a tu email. Sin contraseñas.', email: 'Tu email', send: 'Enviar código', code_h: 'Introduce el código', code_p: 'Te lo hemos enviado a', code: 'Código', enter: 'Entrar', other: 'Cambiar email', resend: 'Reenviar código',
      google: 'Continuar con Google', or: 'o', back_menu: 'Volver a la carta', orders_h: 'Mis pedidos', orders_none: 'Todavía no has hecho ningún pedido.', orders_err: 'No hemos podido cargar tus pedidos.', o_mesa: 'A mesa', o_pick: 'Recoger', o_paytable: 'Pago en mesa', o_st_paid: 'Recibido', o_st_preparing: 'En preparación', o_st_ready: 'Listo', o_st_served: 'Servido', o_st_cancelled: 'Anulado', o_refunded: 'Devuelto', o_refunded_part: 'Devuelto', help_h: '¿Necesitas ayuda?', help_p: 'Escríbenos y te ayudamos con tu pedido.', help_wa: 'WhatsApp', help_mail: 'Email', help_order: 'Ayuda con este pedido', help_msg: function (r) { return 'Hola, necesito ayuda con mi pedido ' + r; }, help_msg0: 'Hola, necesito ayuda con la app de ROCE.', guest: 'Continuar sin cuenta', guest_h: 'Continuar sin cuenta', guest_p: 'Solo necesitamos tu nombre para avisarte cuando tu pedido esté listo. No creamos ninguna cuenta ni te pedimos el email.', guest_name: 'Tu nombre', guest_go: 'Continuar', back: 'Volver', err_name: 'Escribe tu nombre.', err_guest: 'No hemos podido continuar sin cuenta. Inténtalo de nuevo o entra con tu email.', guest_tag: 'Pedido sin cuenta', prof_h: 'Completa tu perfil', prof_p: 'Cuéntanos un poco sobre ti para atenderte mejor y avisarte cuando tu pedido esté listo. Lo marcado con * es obligatorio.', name: 'Nombre', phone: 'Teléfono (opcional)', mkt: 'Quiero recibir novedades y ventajas de ROCE por email (puedes darte de baja cuando quieras).',
      save: 'Guardar', hello: 'Hola', sec_gen: 'General', sec_contact: 'Contacto', sec_comm: 'Comunicaciones', sec_bill: 'Facturación', sec_acct: 'Cuenta', last: 'Apellidos', birthday: 'Cumpleaños', gender: 'Género (para conocerte mejor)', g_m: 'Masculino', g_f: 'Femenino', g_o: 'Otro', g_n: 'Prefiero no decirlo', postal: 'Código postal', diet: 'Dieta', d_none: 'Ninguna', d_veg: 'Vegetariana', d_vegan: 'Vegana', d_pesc: 'Pescetariana', d_gf: 'Sin gluten', d_lf: 'Sin lactosa', d_keto: 'Keto', allergies: 'Alergias e intolerancias', email_ro: 'Email', mk_email: 'Quiero recibir novedades y ventajas de ROCE por email.', mk_wa: 'Quiero recibir novedades y ventajas de ROCE por WhatsApp.', heard: 'Cómo nos conociste', h_ig: 'Instagram', h_gg: 'Google', h_fr: 'Un amigo', h_walk: 'Pasaba por la puerta', h_ev: 'Un evento de ROCE', h_other: 'Otro', pick: 'Elige', bill_note: 'Solo si quieres factura con datos de empresa.', bill_name: 'Razón social', bill_tax: 'NIF / CIF', bill_addr: 'Dirección fiscal', bill_cp: 'Código postal', bill_city: 'Ciudad', err_phone: 'Escribe un teléfono válido.', del: 'Eliminar cuenta', del_h: '¿Eliminar tu cuenta?', del_p: 'Borraremos tu perfil y tu acceso. Tus pedidos se conservan sin datos personales (obligación fiscal). No se puede deshacer.', del_yes: 'Sí, eliminar', back: 'Volver', hello2: 'Hola', logout: 'Cerrar sesión', edit: 'Editar perfil', close: 'Cerrar', legal: 'Al continuar aceptas nuestra', privacy: 'política de privacidad', err_email: 'Escribe un email válido.', err_code: 'El código no es válido o ha caducado.', err_send: 'No hemos podido enviar el código. Inténtalo de nuevo en un minuto.', err_google: 'No hemos podido entrar con Google. Inténtalo de nuevo o usa el código por email.', err_name: 'Escribe tu nombre.', err_net: 'Sin conexión. Inténtalo de nuevo.', sent: 'Código enviado.', ok_in: 'Sesión iniciada.' },
    en: { acct: 'My account', login: 'Sign in', edit_s: 'Edit', login_h: 'Sign in to order', login_p: "We'll email you a code. No passwords.", email: 'Your email', send: 'Send code', code_h: 'Enter the code', code_p: 'We sent it to', code: 'Code', enter: 'Sign in', other: 'Change email', resend: 'Resend code',
      google: 'Continue with Google', or: 'or', back_menu: 'Back to the menu', orders_h: 'My orders', orders_none: "You haven't placed any orders yet.", orders_err: "We couldn't load your orders.", o_mesa: 'Table', o_pick: 'Pickup', o_paytable: 'Pay at the table', o_st_paid: 'Received', o_st_preparing: 'Preparing', o_st_ready: 'Ready', o_st_served: 'Served', o_st_cancelled: 'Cancelled', o_refunded: 'Refunded', o_refunded_part: 'Refunded', help_h: 'Need help?', help_p: 'Message us and we will help you with your order.', help_wa: 'WhatsApp', help_mail: 'Email', help_order: 'Help with this order', help_msg: function (r) { return 'Hi, I need help with my order ' + r; }, help_msg0: 'Hi, I need help with the ROCE app.', guest: 'Continue without an account', guest_h: 'Continue without an account', guest_p: "We only need your name to let you know when your order is ready. We don't create an account or ask for your email.", guest_name: 'Your name', guest_go: 'Continue', back: 'Back', err_name: 'Enter your name.', err_guest: "We couldn't continue without an account. Try again or sign in with your email.", guest_tag: 'Order without an account', prof_h: 'Complete your profile', prof_p: 'Tell us a bit about you so we can serve you better and let you know when your order is ready. Fields marked * are required.', name: 'Name', phone: 'Phone (optional)', mkt: 'I want to receive ROCE news and perks by email (unsubscribe any time).',
      save: 'Save', hello: 'Hi', sec_gen: 'General', sec_contact: 'Contact', sec_comm: 'Communications', sec_bill: 'Billing', sec_acct: 'Account', last: 'Last name', birthday: 'Birthday', gender: 'Gender (to know you better)', g_m: 'Male', g_f: 'Female', g_o: 'Other', g_n: 'Prefer not to say', postal: 'Postcode', diet: 'Diet', d_none: 'None', d_veg: 'Vegetarian', d_vegan: 'Vegan', d_pesc: 'Pescatarian', d_gf: 'Gluten-free', d_lf: 'Lactose-free', d_keto: 'Keto', allergies: 'Allergies and intolerances', email_ro: 'Email', mk_email: 'I want to receive ROCE news and perks by email.', mk_wa: 'I want to receive ROCE news and perks by WhatsApp.', heard: 'How did you find us', h_ig: 'Instagram', h_gg: 'Google', h_fr: 'A friend', h_walk: 'Walked past', h_ev: 'A ROCE event', h_other: 'Other', pick: 'Choose', bill_note: 'Only if you want an invoice with company details.', bill_name: 'Company name', bill_tax: 'Tax ID', bill_addr: 'Billing address', bill_cp: 'Postcode', bill_city: 'City', err_phone: 'Enter a valid phone number.', del: 'Delete account', del_h: 'Delete your account?', del_p: "We'll delete your profile and access. Your orders are kept without personal data (tax requirement). This can't be undone.", del_yes: 'Yes, delete', back: 'Back', hello2: 'Hi', logout: 'Sign out', edit: 'Edit profile', close: 'Close', legal: 'By continuing you accept our', privacy: 'privacy policy', err_email: 'Enter a valid email.', err_code: 'The code is invalid or has expired.', err_send: "We couldn't send the code. Try again in a minute.", err_google: "We couldn't sign you in with Google. Try again or use the email code.", err_name: 'Enter your name.', err_net: 'No connection. Try again.', sent: 'Code sent.', ok_in: 'Signed in.' }
  };
  var L = function () { return document.documentElement.lang === 'en' ? 'en' : 'es'; };
  var t = function (k) { return UI[L()][k]; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ── Sesión ── */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function store(s) { try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch (e) {} }
  function fromTokens(r) { return r && r.access_token ? { access_token: r.access_token, refresh_token: r.refresh_token, expires_at: Date.now() + ((r.expires_in || 3600) * 1000), user: r.user ? { id: r.user.id, email: r.user.email } : null, anon: !!(r.user && r.user.is_anonymous) } : null; }
  function api(path, body, token) {
    return fetch(B.url + path, { method: 'POST', headers: { apikey: B.anonKey, Authorization: 'Bearer ' + (token || B.anonKey), 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.text().then(function (x) { var j = {}; try { j = x ? JSON.parse(x) : {}; } catch (e) {} if (!r.ok) { var e = new Error(j.msg || j.message || j.error_description || ('http_' + r.status)); e.status = r.status; e.body = j; throw e; } return j; }); });
  }
  var S = load();
  function session() {
    if (!S) return Promise.resolve(null);
    if (S.expires_at - Date.now() > 60000) return Promise.resolve(S);
    return api('/auth/v1/token?grant_type=refresh_token', { refresh_token: S.refresh_token }).then(function (r) { S = fromTokens(r); store(S); return S; }).catch(function () { S = null; store(null); return null; });
  }
  function rest(method, path, body) {
    return session().then(function (s) {
      if (!s) throw new Error('no_session');
      return fetch(B.url + path, { method: method, headers: { apikey: B.anonKey, Authorization: 'Bearer ' + s.access_token, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: body ? JSON.stringify(body) : undefined })
        .then(function (r) { return r.text().then(function (x) { var j = null; try { j = x ? JSON.parse(x) : null; } catch (e) {} if (!r.ok) { var e = new Error((j && (j.message || j.msg)) || 'http_' + r.status); e.status = r.status; throw e; } return j; }); });
    });
  }
  var profile = null;
  function getProfile() { return rest('GET', '/rest/v1/app_customers?select=*&limit=1').then(function (a) { profile = a && a[0] || null; syncFilters(false); return profile; }); }
  /* Las alergias y la dieta del perfil se aplican solas a los filtros de la carta y de la Ayuda. */
  var DIETMAP = { vegetariana: 'veg', vegana: 'vegan', pescetariana: 'pesc', sin_gluten: 'gf', sin_lactosa: 'lf' };
  function syncFilters(force) {
    var C = window.CARTA_API; if (!C || !profile) return;
    var key = 'roce_profile_filters', done = false; try { done = sessionStorage.getItem(key) === '1'; } catch (e) {}
    if (done && !force) return;
    var cur = C.F(), al = (profile.allergies || []).slice(), diet = DIETMAP[profile.diet] ? [DIETMAP[profile.diet]] : [];
    if (!al.length && !diet.length) return;
    C.setF({ al: al, diet: diet, ing: cur.ing || { m: 'sin', k: [] } });
    try { sessionStorage.setItem(key, '1'); } catch (e) {}
  }

  /* ── Diálogo ── */
  var dlg = document.getElementById('apDlg'), box = document.getElementById('apDlgIn'), after = null, state = { email: '' };
  function show(h) { box.innerHTML = h; if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); } box.setAttribute('tabindex', '-1'); try { box.focus({ preventScroll: true }); } catch (e) {} }
  function msg(m, ok) { var e = document.getElementById('apAcMsg'); if (e) { e.textContent = m || ''; e.className = 'ap-msg' + (ok ? ' is-ok' : ''); } }
  function busy(b, on) { if (b) { b.disabled = !!on; } }
  var legal = function () { return '<p class="ap-legal">' + t('legal') + ' <a href="https://roce.es/privacidad.html" target="_blank" rel="noopener">' + t('privacy') + '</a>.</p>'; };

  /* ── Google Identity: botón oficial y sesión por ID token (no se pasa por la dirección de Supabase) ── */
  var GOOGLE_CLIENT_ID = '342743655164-drjos8bvobvaffasu0toefbopi72fh0h.apps.googleusercontent.com';
  var gsiP = null;
  function loadGsi() {
    if (window.google && window.google.accounts && window.google.accounts.id) return Promise.resolve();
    if (gsiP) return gsiP;
    gsiP = new Promise(function (res, rej) {
      var el = document.createElement('script'); el.src = 'https://accounts.google.com/gsi/client'; el.async = true; el.defer = true;
      el.onload = function () { res(); }; el.onerror = function () { gsiP = null; rej(new Error('gsi')); }; document.head.appendChild(el);
      setTimeout(function () { if (!(window.google && window.google.accounts)) { gsiP = null; rej(new Error('gsi_timeout')); } }, 6000);
    });
    return gsiP;
  }
  function randHex(n) { var a = new Uint8Array(n); crypto.getRandomValues(a); return [].map.call(a, function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function sha256Hex(txt) { return crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt)).then(function (h) { return [].map.call(new Uint8Array(h), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }); }
  function onGoogleCredential(cred, raw) {
    msg(t('ok_in'), true);
    api('/auth/v1/token?grant_type=id_token', { provider: 'google', id_token: cred, nonce: raw })
      .then(function (r) { S = fromTokens(r); store(S); return afterLogin(); })
      .catch(function () { msg(t('err_google')); });
  }
  function renderGoogle() {
    var host = document.getElementById('apGoogle'); if (!host) return;
    function fallback() {
            host.innerHTML = '<button type="button" class="ap-gbtn" data-acct="google"><svg class="ap-g" viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg><span>' + t('google') + '</span></button>'
    }
    loadGsi().then(function () {
      var raw = randHex(16);
      return sha256Hex(raw).then(function (hash) {
        window.google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, nonce: hash, callback: function (r) { if (r && r.credential) onGoogleCredential(r.credential, raw); }, auto_select: false, cancel_on_tap_outside: true, itp_support: true });
        var w = Math.max(200, Math.min(400, Math.round(host.getBoundingClientRect().width || 300)));
        window.google.accounts.id.renderButton(host, { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', logo_alignment: 'left', width: w, locale: L() });
      });
    }).catch(fallback);
  }

  function viewLogin() {
    var soc = '';
    if (PROVIDERS.google) soc += '<div class="ap-gwrap" id="apGoogle"></div>';
    show('<h2 class="ap-c-h">' + t('login_h') + '</h2><div class="cv-sheet-body"><div class="ap-narrow"><p>' + t('login_p') + '</p>' + (soc ? soc + '<p class="ap-or">' + t('or') + '</p>' : '') +
      '<section class="cv-fs"><h3>' + t('email') + '</h3><input class="ap-in ap-in-g" id="apAcEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off" placeholder="nombre@email.com" enterkeyhint="send" value="' + esc(state.email) + '"></section><p class="ap-msg" id="apAcMsg"></p>' + legal() + '</div></div>' +
      '<div class="cv-sheet-actions ap-c-act"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="send">' + t('send') + '</button></div>');
    if (PROVIDERS.google) renderGoogle();
    if (after) { var gb = box.querySelector('.ap-narrow'); if (gb) { var gp = document.createElement('p'); gp.className = 'ap-guest'; gp.innerHTML = '<button type="button" class="ap-link" data-acct="guest">' + esc(t('guest')) + '</button>'; gb.appendChild(gp); } }
  }
  /* Pedir sin cuenta: sesión anónima de Supabase (usuario sin email) + solo el nombre. El pedido y el pago funcionan igual que con cuenta. */
  function viewGuest() {
    show('<h2 class="ap-c-h">' + t('guest_h') + '</h2><div class="cv-sheet-body"><div class="ap-narrow"><p>' + t('guest_p') + '</p>' +
      '<section class="cv-fs"><h3>' + t('guest_name') + '</h3><input class="ap-in ap-in-g" id="apGuestName" autocomplete="given-name" maxlength="80" value="' + esc(state.gname || (profile && profile.name) || '') + '"></section><p class="ap-msg" id="apAcMsg"></p>' + legal() + '</div></div>' +
      '<div class="cv-sheet-actions ap-c-act"><button type="button" class="cv-ghost" data-acct="guestback">' + t('back') + '</button><button type="button" class="cv-solid" data-acct="guestgo">' + t('guest_go') + '</button></div>');
    var gi = document.getElementById('apGuestName'); if (gi) setTimeout(function () { gi.focus(); }, 50);
  }
  function guestGo(btn) {
    var name = ((document.getElementById('apGuestName') || {}).value || '').trim();
    if (name.length < 2) { msg(t('err_name')); return; }
    state.gname = name; busy(btn, true);
    var open = S && S.anon ? Promise.resolve() : api('/auth/v1/signup', { data: { app: 'roce-app', guest: true } }).then(function (r) { S = fromTokens(r); if (!S || !S.anon) throw new Error('no_guest'); store(S); });
    open.then(function () { return rest('POST', '/rest/v1/rpc/app_customer_save', { p_name: name, p_phone: '', p_lang: L(), p_marketing: false }); })
      .then(function () { return getProfile(); })
      .then(function () { if (dlg.open) dlg.close(); var cb = after; after = null; paintEntry(); if (cb) cb(); })
      .catch(function () { msg(t('err_guest')); busy(btn, false); });
  }
  function viewCode() {
    show('<h2>' + t('code_h') + '</h2><div class="cv-sheet-body"><p>' + t('code_p') + ' <b>' + esc(state.email) + '</b></p>' +
      '<section class="cv-fs"><h3>' + t('code') + '</h3><input class="ap-in ap-code" id="apAcCode" inputmode="numeric" autocomplete="one-time-code" maxlength="10" pattern="[0-9]*"></section><p class="ap-msg" id="apAcMsg"></p>' +
      '<p><button type="button" class="ap-link" data-acct="resend">' + t('resend') + '</button> · <button type="button" class="ap-link" data-acct="other">' + t('other') + '</button></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="verify">' + t('enter') + '</button></div>');
    var c = document.getElementById('apAcCode'); if (c) setTimeout(function () { c.focus(); }, 50);
  }
  var DIETS = [['', 'd_none'], ['vegetariana', 'd_veg'], ['vegana', 'd_vegan'], ['pescetariana', 'd_pesc'], ['sin_gluten', 'd_gf'], ['sin_lactosa', 'd_lf'], ['keto', 'd_keto']];
  var GENDERS = [['', 'pick'], ['masculino', 'g_m'], ['femenino', 'g_f'], ['otro', 'g_o'], ['no_decir', 'g_n']];
  var HEARD = [['', 'pick'], ['instagram', 'h_ig'], ['google', 'h_gg'], ['amigo', 'h_fr'], ['puerta', 'h_walk'], ['evento', 'h_ev'], ['otro', 'h_other']];
  var draft = null;
  function opts(list, cur) { return list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === (cur || '') ? ' selected' : '') + '>' + esc(t(o[1])) + '</option>'; }).join(''); }
  function fld(id, label, val, extra) { return '<section class="cv-fs"><h3>' + label + '</h3><input class="ap-in" id="' + id + '" value="' + esc(val || '') + '" ' + (extra || '') + '></section>'; }
  function readDraft() {
    var g = function (id) { var e = document.getElementById(id); return e ? e.value : ''; };
    if (!document.getElementById('apPfName')) return;
    draft = { name: g('apPfName'), last_name: g('apPfLast'), birthday: g('apPfBday'), gender: g('apPfGender'), postal_code: g('apPfCp'), diet: g('apPfDiet'), allergies: draft ? draft.allergies : [],
      phone: g('apPfPhone'), marketing_optin: !!document.getElementById('apPfMk').checked, marketing_whatsapp: !!document.getElementById('apPfWa').checked, heard_from: g('apPfHeard'),
      billing_name: g('apPfBn'), billing_tax_id: g('apPfBt'), billing_address: g('apPfBa'), billing_postal: g('apPfBc'), billing_city: g('apPfBy') };
  }
  function viewProfile() {
    var p = draft || profile || {}, al = (draft ? draft.allergies : (profile && profile.allergies)) || [];
    if (!draft) draft = { allergies: al.slice() };
    var D = window.CARTA, em = (S && S.user && S.user.email) || p.email || '';
    var alh = (D && D.allergens ? D.allergens : []).map(function (a) { return '<button type="button" class="cv-pick" data-pfal="' + a.n + '" aria-pressed="' + (draft.allergies.indexOf(a.n) !== -1) + '"><i class="cv-radio"></i><span>' + esc(a[L()] || a.es) + '</span><span class="cv-al">' + a.n + '</span></button>'; }).join('');
    show('<h2>' + (profile && profile.name ? t('edit') : t('prof_h')) + '</h2><div class="cv-sheet-body"><p>' + t('prof_p') + '</p>' +
      '<h3 class="ap-sech">' + t('sec_gen') + '</h3>' + fld('apPfName', t('name') + ' *', p.name, 'autocomplete="given-name" maxlength="80"') + fld('apPfLast', t('last'), p.last_name, 'autocomplete="family-name" maxlength="100"') +
      '<section class="cv-fs"><h3>' + t('birthday') + '</h3><input class="ap-in" id="apPfBday" type="date" value="' + esc(p.birthday || '') + '" max="' + new Date().toISOString().slice(0, 10) + '"></section>' +
      '<section class="cv-fs"><h3>' + t('gender') + '</h3><select class="ap-in" id="apPfGender">' + opts(GENDERS, p.gender) + '</select></section>' + fld('apPfCp', t('postal'), p.postal_code, 'inputmode="numeric" autocomplete="postal-code" maxlength="10"') +
      '<section class="cv-fs"><h3>' + t('diet') + '</h3><select class="ap-in" id="apPfDiet">' + opts(DIETS, p.diet) + '</select></section>' +
      '<section class="cv-fs"><h3>' + t('allergies') + '</h3>' + alh + '</section>' +
      '<h3 class="ap-sech">' + t('sec_contact') + '</h3>' + fld('apPfPhone', t('phone').replace(' (opcional)', '').replace(' (optional)', '') + ' *', p.phone, 'type="tel" inputmode="tel" autocomplete="tel" maxlength="30"') +
      '<section class="cv-fs"><h3>' + t('email_ro') + '</h3><input class="ap-in" value="' + esc(em) + '" disabled></section>' +
      '<h3 class="ap-sech">' + t('sec_comm') + '</h3><label class="ap-check"><input type="checkbox" id="apPfMk"' + (p.marketing_optin ? ' checked' : '') + '><span>' + t('mk_email') + '</span></label>' +
      '<label class="ap-check"><input type="checkbox" id="apPfWa"' + (p.marketing_whatsapp ? ' checked' : '') + '><span>' + t('mk_wa') + '</span></label>' +
      '<section class="cv-fs"><h3>' + t('heard') + '</h3><select class="ap-in" id="apPfHeard">' + opts(HEARD, p.heard_from) + '</select></section>' +
      '<h3 class="ap-sech">' + t('sec_bill') + '</h3><p>' + t('bill_note') + '</p>' + fld('apPfBn', t('bill_name'), p.billing_name, 'maxlength="120"') + fld('apPfBt', t('bill_tax'), p.billing_tax_id, 'maxlength="30" autocapitalize="characters"') + fld('apPfBa', t('bill_addr'), p.billing_address, 'maxlength="160"') + fld('apPfBc', t('bill_cp'), p.billing_postal, 'inputmode="numeric" maxlength="10"') + fld('apPfBy', t('bill_city'), p.billing_city, 'maxlength="80"') +
      (profile && profile.name ? '<h3 class="ap-sech">' + t('sec_acct') + '</h3><p><button type="button" class="ap-link ap-danger" data-acct="delete">' + t('del') + '</button></p>' : '') +
      '<p class="ap-msg" id="apAcMsg"></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="save">' + t('save') + '</button></div>');
  }
  function viewDelete() {
    show('<h2>' + t('del_h') + '</h2><div class="cv-sheet-body"><p>' + t('del_p') + '</p><p class="ap-msg" id="apAcMsg"></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="edit">' + t('back') + '</button><button type="button" class="cv-solid" data-acct="delete-yes">' + t('del_yes') + '</button></div>');
  }
  function viewAccount() {
    draft = null;
    var p = profile || {}, em = (S && S.anon) ? t('guest_tag') : ((S && S.user && S.user.email) || p.email || '');
    var ini = p.name ? String(p.name).trim().charAt(0).toUpperCase() : '·';
    show('<h2 class="ap-c-h">' + t('hello') + (p.name ? ', ' + esc(String(p.name).trim().split(/\s+/)[0]) : '') + '</h2><div class="cv-sheet-body">' +
      '<div class="ap-prof"><i class="ap-av" aria-hidden="true">' + esc(ini) + '</i><div class="ap-prof-t"><b>' + esc(p.name || '') + '</b><span>' + esc(em) + '</span></div><button type="button" class="ap-pill" data-acct="edit">' + t('edit_s') + '</button></div></div>' +
      '<div class="cv-sheet-actions ap-c-act"><button type="button" class="cv-ghost" data-acct="logout">' + t('logout') + '</button><button type="button" class="cv-solid" data-acct="close">' + t('back_menu') + '</button></div>');
    var bd = box.querySelector('.cv-sheet-body');
    if (bd) { var sec = document.createElement('section'); sec.className = 'ap-orders'; sec.innerHTML = '<h3 class="ap-orders-h">' + esc(t('orders_h')) + '</h3><div id="apOrders"><p class="ap-meta">…</p></div>'; bd.appendChild(sec); loadOrders(); }
  }
  /* Historial de pedidos de esta cuenta (solo los suyos: la base de datos filtra por usuario). */
  function money(c) { return (c / 100).toLocaleString(L() === 'en' ? 'en-GB' : 'es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: c % 100 ? 2 : 0 }); }
  var SUPPORT_WA = '34614073163', SUPPORT_MAIL = 'reservas@roce.es';
  function helpLinks(ref) {
    var msg = ref ? t('help_msg')(ref) : t('help_msg0');
    return '<a class="ap-help-btn" href="https://wa.me/' + SUPPORT_WA + '?text=' + encodeURIComponent(msg) + '" target="_blank" rel="noopener">' + esc(t('help_wa')) + '</a>' +
      '<a class="ap-help-btn" href="mailto:' + SUPPORT_MAIL + '?subject=' + encodeURIComponent(ref ? 'Pedido ' + ref : 'Ayuda con la app') + '&body=' + encodeURIComponent(msg) + '">' + esc(t('help_mail')) + '</a>';
  }
  function helpBlock() { return '<div class="ap-help"><h4>' + esc(t('help_h')) + '</h4><p class="ap-meta">' + esc(t('help_p')) + '</p><div class="ap-help-row">' + helpLinks('') + '</div></div>'; }
  function loadOrders() {
    rest('GET', '/rest/v1/app_orders?select=id,ref,mode,table_name,status,payment_status,total_cents,refunded_cents,created_at,paid_at,app_order_items(name,qty,variant,extras)&payment_status=in.(paid,table,refunded)&order=created_at.desc&limit=30')
      .then(function (rows) {
        var el = document.getElementById('apOrders'); if (!el) return;
        if (!rows || !rows.length) { el.innerHTML = '<p class="ap-meta">' + esc(t('orders_none')) + '</p>' + helpBlock(); return; }
        var fmt = new Intl.DateTimeFormat(L() === 'en' ? 'en-GB' : 'es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
        el.innerHTML = rows.map(function (o) {
          var items = (o.app_order_items || []).map(function (l) { return l.qty + '× ' + esc(l.name) + (l.variant ? ' (' + esc(l.variant) + ')' : ''); }).join(', ');
          var rf = Number(o.refunded_cents || 0), st = o.payment_status === 'refunded' ? t('o_refunded') : (rf > 0 ? t('o_refunded_part') + ' ' + money(rf) : (o.payment_status === 'table' ? t('o_paytable') : (t('o_st_' + o.status) || o.status)));
          var where = o.mode === 'mesa' ? t('o_mesa') + ' ' + esc(o.table_name || '') : t('o_pick');
          var chip = o.payment_status === 'refunded' || rf > 0 ? ' is-ref' : (o.payment_status === 'table' ? ' is-table' : '');
          return '<div class="ap-order"><p class="ap-order-top"><b>' + esc(o.ref) + '</b><span>' + money(o.total_cents) + '</span></p><p class="ap-meta">' + esc(fmt.format(new Date(o.paid_at || o.created_at))) + ' · ' + where + '</p><p class="ap-chips"><span class="ap-chip' + chip + '">' + esc(st) + '</span></p><p class="ap-order-items">' + items + '</p><p class="ap-order-help"><span>' + esc(t('help_order')) + ':</span> ' + helpLinks(o.ref) + '</p></div>';
        }).join('') + helpBlock();
      }).catch(function () { var el = document.getElementById('apOrders'); if (el) el.innerHTML = '<p class="ap-meta">' + esc(t('orders_err')) + '</p>' + helpBlock(); });
  }

  function afterLogin() {
    return getProfile().then(function (p) {
      if (!p || !p.name || (!p.phone && !(S && S.anon))) { draft = null; viewProfile(); return; }
      if (dlg.open) dlg.close(); var cb = after; after = null; paintEntry(); if (cb) cb();
    }).catch(function () { viewProfile(); });
  }

  document.addEventListener('click', function (e) {
    var pf = e.target.closest('[data-pfal]'); if (pf && dlg.contains(pf)) { readDraft(); var n = +pf.dataset.pfal, i = draft.allergies.indexOf(n); if (i === -1) draft.allergies.push(n); else draft.allergies.splice(i, 1); pf.setAttribute('aria-pressed', i === -1 ? 'true' : 'false'); return; }
    var el = e.target.closest('[data-acct]'); if (!el || el.disabled) return;
    var a = el.dataset.acct;
    if (a === 'close') { if (dlg.open) dlg.close(); after = null; }
    else if (a === 'guest') { viewGuest(); }
    else if (a === 'guestback') { viewLogin(); }
    else if (a === 'guestgo') { guestGo(el); }
    else if (a === 'send' || a === 'resend') {
      var em = a === 'send' ? ((document.getElementById('apAcEmail') || {}).value || '').trim().toLowerCase() : state.email;
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg(t('err_email')); return; }
      state.email = em; busy(el, true);
      api('/auth/v1/otp', { email: em, create_user: true, data: { app: 'roce-app' } }).then(function () { if (a === 'send') viewCode(); else msg(t('sent'), true); busy(el, false); })
        .catch(function (x) { msg(x.status === undefined ? t('err_net') : t('err_send')); busy(el, false); });
    }
    else if (a === 'other') viewLogin();
    else if (a === 'verify') {
      var c = ((document.getElementById('apAcCode') || {}).value || '').replace(/\D/g, ''); if (c.length < 6) { msg(t('err_code')); return; } busy(el, true);
      api('/auth/v1/verify', { type: 'email', email: state.email, token: c }).then(function (r) { S = fromTokens(r); store(S); busy(el, false); return afterLogin(); })
        .catch(function (x) { msg(x.status === undefined ? t('err_net') : t('err_code')); busy(el, false); });
    }
    else if (a === 'save') {
      readDraft(); var d = draft || {};
      if (!(d.name || '').trim()) { msg(t('err_name')); return; }
      if ((d.phone || '').replace(/\D/g, '').length < 9) { msg(t('err_phone')); return; }
      busy(el, true); d.lang = L();
      rest('POST', '/rest/v1/rpc/app_profile_save', { p: d })
        .then(function () { draft = null; return getProfile(); }).then(function (r) { syncFilters(true); return r; }).then(function () { busy(el, false); if (dlg.open) dlg.close(); var cb = after; after = null; paintEntry(); if (cb) cb(); })
        .catch(function (x) { msg(/phone/.test(x.message || '') ? t('err_phone') : /name/.test(x.message || '') ? t('err_name') : t('err_net')); busy(el, false); });
    }
    else if (a === 'delete') { viewDelete(); }
    else if (a === 'delete-yes') {
      busy(el, true);
      rest('POST', '/rest/v1/rpc/app_account_delete', {}).then(function () { S = null; profile = null; draft = null; store(null); if (dlg.open) dlg.close(); paintEntry(); })
        .catch(function () { msg(t('err_net')); busy(el, false); });
    }
    else if (a === 'edit') { draft = null; viewProfile(); }
    else if (a === 'logout') { S = null; profile = null; store(null); if (dlg.open) dlg.close(); paintEntry(); }
    else if (a === 'google') { location.href = B.url + '/auth/v1/authorize?provider=google' + '&redirect_to=' + encodeURIComponent(location.origin + '/'); }
  });

  /* ── Entrada en el menú (Entrar / Mi cuenta) ── */
  var ICON_USER = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.9-3.6 3.9-5.4 7.5-5.4s6.6 1.8 7.5 5.4"/></svg>';
  function paintEntry() {
    var b = document.getElementById('apAcctBtn');
    var label = S ? t('acct') + ((profile && profile.name) ? ' · ' + profile.name : '') : t('login');
    if (b) b.innerHTML = ICON_USER + '<span>' + esc(label) + '</span>';
    var h = document.getElementById('apHdrAcct');
    if (h) {
      var ini = S && profile && profile.name ? String(profile.name).trim().charAt(0).toUpperCase() : '';
      h.innerHTML = ini ? '<i class="ap-ini">' + esc(ini) + '</i>' : ICON_USER; h.setAttribute('aria-label', label); h.title = label; h.classList.toggle('is-in', !!S);
    }
  }
  function ensureEntry() {
    var row = document.querySelector('.cv-bar-row'), mb = document.getElementById('cvMenuBtn');
    if (row && mb && !document.getElementById('apHdrAcct')) {
      var hb = document.createElement('button'); hb.type = 'button'; hb.id = 'apHdrAcct'; hb.className = 'ap-hdr-acct'; row.insertBefore(hb, mb); paintEntry();
      hb.addEventListener('click', function () { open(); });
    }
    var body = document.getElementById('cvMenuBody'); if (!body || document.getElementById('apAcctBtn')) return;
    var b = document.createElement('button'); b.type = 'button'; b.id = 'apAcctBtn'; b.className = 'ap-acct'; body.appendChild(b); paintEntry();
    b.addEventListener('click', function () { var m = document.getElementById('cvMenuClose'); if (m) m.click(); open(); });
  }
  new MutationObserver(function () { ensureEntry(); }).observe(document.getElementById('cvMenuBody'), { childList: true });
  new MutationObserver(function () { paintEntry(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  ensureEntry();

  /* ── API pública para el resto de la app ── */
  function open() { if (S) { viewAccount(); getProfile().then(viewAccount).catch(function () {}); } else viewLogin(); }
  function requireLogin(cb) {
    session().then(function (s) {
      if (!s) { after = cb; state.email = ''; viewLogin(); return; }
      getProfile().then(function (p) { if (!p || !p.name || (!p.phone && !(S && S.anon))) { after = cb; draft = null; if (S && S.anon) viewGuest(); else viewProfile(); } else { paintEntry(); cb(); } }).catch(function () { after = cb; viewProfile(); });
    });
  }
  window.ROCE_ACCT = { open: open, require: requireLogin, session: session, rest: rest, loggedIn: function () { return !!S; }, allergies: function () { return (profile && profile.allergies) ? profile.allergies.slice() : []; } };
  if (S) getProfile().then(paintEntry).catch(function () {});
})();
