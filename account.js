/* ROCE · App de pedidos: cuenta de cliente (registro obligatorio para pedir con la app).
   Entrada con código por email (sin contraseña) y con Google.
   Habla directamente con la API de Supabase Auth (sin librerías); la clave "anon" es pública. */
(function () {
  'use strict';
  var B = window.ROCE_BACKEND, KEY = 'roce_app_session';
  var PROVIDERS = { google: true };      // proveedores sociales activados en Supabase → Authentication → Providers
  var UI = {
    es: { acct: 'Mi cuenta', login: 'Entrar', login_h: 'Entra para pedir', login_p: 'Te enviamos un código a tu email. Sin contraseñas.', email: 'Tu email', send: 'Enviar código', code_h: 'Introduce el código', code_p: 'Te lo hemos enviado a', code: 'Código', enter: 'Entrar', other: 'Cambiar email', resend: 'Reenviar código',
      google: 'Continuar con Google', or: 'o', guest: 'Continuar sin cuenta', guest_h: 'Continuar sin cuenta', guest_p: 'Solo necesitamos tu nombre para avisarte cuando tu pedido esté listo. No creamos ninguna cuenta ni te pedimos el email.', guest_name: 'Tu nombre', guest_go: 'Continuar', back: 'Volver', err_name: 'Escribe tu nombre.', err_guest: 'No hemos podido continuar sin cuenta. Inténtalo de nuevo o entra con tu email.', guest_tag: 'Pedido sin cuenta', prof_h: 'Completa tu perfil', prof_p: 'Cuéntanos un poco sobre ti para atenderte mejor y avisarte cuando tu pedido esté listo. Lo marcado con * es obligatorio.', name: 'Nombre', phone: 'Teléfono (opcional)', mkt: 'Quiero recibir novedades y ventajas de ROCE por email (puedes darte de baja cuando quieras).',
      save: 'Guardar', hello: 'Hola', sec_gen: 'General', sec_contact: 'Contacto', sec_comm: 'Comunicaciones', sec_bill: 'Facturación', last: 'Apellidos', birthday: 'Cumpleaños', gender: 'Género (para conocerte mejor)', g_m: 'Masculino', g_f: 'Femenino', g_o: 'Otro', g_n: 'Prefiero no decirlo', postal: 'Código postal', diet: 'Dieta', d_none: 'Ninguna', d_veg: 'Vegetariana', d_vegan: 'Vegana', d_pesc: 'Pescetariana', d_gf: 'Sin gluten', d_lf: 'Sin lactosa', d_keto: 'Keto', allergies: 'Alergias e intolerancias', email_ro: 'Email', mk_email: 'Quiero recibir novedades y ventajas de ROCE por email.', mk_wa: 'Quiero recibir novedades y ventajas de ROCE por WhatsApp.', heard: 'Cómo nos conociste', h_ig: 'Instagram', h_gg: 'Google', h_fr: 'Un amigo', h_walk: 'Pasaba por la puerta', h_ev: 'Un evento de ROCE', h_other: 'Otro', pick: 'Elige', bill_note: 'Solo si quieres factura con datos de empresa.', bill_name: 'Razón social', bill_tax: 'NIF / CIF', bill_addr: 'Dirección fiscal', bill_cp: 'Código postal', bill_city: 'Ciudad', err_phone: 'Escribe un teléfono válido.', del: 'Eliminar cuenta', del_h: '¿Eliminar tu cuenta?', del_p: 'Borraremos tu perfil y tu acceso. Tus pedidos se conservan sin datos personales (obligación fiscal). No se puede deshacer.', del_yes: 'Sí, eliminar', back: 'Volver', hello2: 'Hola', logout: 'Cerrar sesión', edit: 'Editar perfil', close: 'Cerrar', legal: 'Al continuar aceptas nuestra', privacy: 'política de privacidad', err_email: 'Escribe un email válido.', err_code: 'El código no es válido o ha caducado.', err_send: 'No hemos podido enviar el código. Inténtalo de nuevo en un minuto.', err_google: 'No hemos podido entrar con Google. Inténtalo de nuevo o usa el código por email.', err_name: 'Escribe tu nombre.', err_net: 'Sin conexión. Inténtalo de nuevo.', sent: 'Código enviado.', ok_in: 'Sesión iniciada.' },
    en: { acct: 'My account', login: 'Sign in', login_h: 'Sign in to order', login_p: "We'll email you a code. No passwords.", email: 'Your email', send: 'Send code', code_h: 'Enter the code', code_p: 'We sent it to', code: 'Code', enter: 'Sign in', other: 'Change email', resend: 'Resend code',
      google: 'Continue with Google', or: 'or', guest: 'Continue without an account', guest_h: 'Continue without an account', guest_p: "We only need your name to let you know when your order is ready. We don't create an account or ask for your email.", guest_name: 'Your name', guest_go: 'Continue', back: 'Back', err_name: 'Enter your name.', err_guest: "We couldn't continue without an account. Try again or sign in with your email.", guest_tag: 'Order without an account', prof_h: 'Complete your profile', prof_p: 'Tell us a bit about you so we can serve you better and let you know when your order is ready. Fields marked * are required.', name: 'Name', phone: 'Phone (optional)', mkt: 'I want to receive ROCE news and perks by email (unsubscribe any time).',
      save: 'Save', hello: 'Hi', sec_gen: 'General', sec_contact: 'Contact', sec_comm: 'Communications', sec_bill: 'Billing', last: 'Last name', birthday: 'Birthday', gender: 'Gender (to know you better)', g_m: 'Male', g_f: 'Female', g_o: 'Other', g_n: 'Prefer not to say', postal: 'Postcode', diet: 'Diet', d_none: 'None', d_veg: 'Vegetarian', d_vegan: 'Vegan', d_pesc: 'Pescatarian', d_gf: 'Gluten-free', d_lf: 'Lactose-free', d_keto: 'Keto', allergies: 'Allergies and intolerances', email_ro: 'Email', mk_email: 'I want to receive ROCE news and perks by email.', mk_wa: 'I want to receive ROCE news and perks by WhatsApp.', heard: 'How did you find us', h_ig: 'Instagram', h_gg: 'Google', h_fr: 'A friend', h_walk: 'Walked past', h_ev: 'A ROCE event', h_other: 'Other', pick: 'Choose', bill_note: 'Only if you want an invoice with company details.', bill_name: 'Company name', bill_tax: 'Tax ID', bill_addr: 'Billing address', bill_cp: 'Postcode', bill_city: 'City', err_phone: 'Enter a valid phone number.', del: 'Delete account', del_h: 'Delete your account?', del_p: "We'll delete your profile and access. Your orders are kept without personal data (tax requirement). This can't be undone.", del_yes: 'Yes, delete', back: 'Back', hello2: 'Hi', logout: 'Sign out', edit: 'Edit profile', close: 'Close', legal: 'By continuing you accept our', privacy: 'privacy policy', err_email: 'Enter a valid email.', err_code: 'The code is invalid or has expired.', err_send: "We couldn't send the code. Try again in a minute.", err_google: "We couldn't sign you in with Google. Try again or use the email code.", err_name: 'Enter your name.', err_net: 'No connection. Try again.', sent: 'Code sent.', ok_in: 'Signed in.' }
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
    show('<h2>' + t('login_h') + '</h2><div class="cv-sheet-body"><p>' + t('login_p') + '</p>' + (soc ? soc + '<p class="ap-or">' + t('or') + '</p>' : '') +
      '<section class="cv-fs"><h3>' + t('email') + '</h3><input class="ap-in" id="apAcEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off" value="' + esc(state.email) + '"></section><p class="ap-msg" id="apAcMsg"></p>' + legal() + '</div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="send">' + t('send') + '</button></div>');
    if (PROVIDERS.google) renderGoogle();
    if (after) { var gb = box.querySelector('.cv-sheet-body'); if (gb) { var gp = document.createElement('p'); gp.className = 'ap-guest'; gp.innerHTML = '<button type="button" class="ap-link" data-acct="guest">' + esc(t('guest')) + '</button>'; gb.appendChild(gp); } }
  }
  /* Pedir sin cuenta: sesión anónima de Supabase (usuario sin email) + solo el nombre. El pedido y el pago funcionan igual que con cuenta. */
  function viewGuest() {
    show('<h2>' + t('guest_h') + '</h2><div class="cv-sheet-body"><p>' + t('guest_p') + '</p>' +
      '<section class="cv-fs"><h3>' + t('guest_name') + '</h3><input class="ap-in" id="apGuestName" autocomplete="given-name" maxlength="80" value="' + esc(state.gname || (profile && profile.name) || '') + '"></section><p class="ap-msg" id="apAcMsg"></p>' + legal() + '</div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="guestback">' + t('back') + '</button><button type="button" class="cv-solid" data-acct="guestgo">' + t('guest_go') + '</button></div>');
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
    show('<h2>' + t('hello') + (p.name ? ', ' + esc(p.name) : '') + '</h2><div class="cv-sheet-body"><p>' + esc(em) + '</p>' +
      '<p><button type="button" class="ap-link" data-acct="edit">' + t('edit') + '</button></p><p><button type="button" class="ap-link" data-acct="delete">' + t('del') + '</button></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="logout">' + t('logout') + '</button><button type="button" class="cv-solid" data-acct="close">' + t('close') + '</button></div>');
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
  function paintEntry() {
    var b = document.getElementById('apAcctBtn'); if (!b) return;
    b.textContent = S ? t('acct') + ((profile && profile.name) ? ' · ' + profile.name : '') : t('login');
  }
  function ensureEntry() {
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
  window.ROCE_ACCT = { open: open, require: requireLogin, session: session, rest: rest, loggedIn: function () { return !!S; } };
  if (S) getProfile().then(paintEntry).catch(function () {});
})();
