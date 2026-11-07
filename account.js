/* ROCE · App de pedidos: cuenta de cliente (registro obligatorio para pedir con la app).
   Entrada con código por email (sin contraseña) y con Google.
   Habla directamente con la API de Supabase Auth (sin librerías); la clave "anon" es pública. */
(function () {
  'use strict';
  var B = window.ROCE_BACKEND, KEY = 'roce_app_session';
  var PROVIDERS = { google: true };      // proveedores sociales activados en Supabase → Authentication → Providers
  var UI = {
    es: { acct: 'Mi cuenta', login: 'Entrar', login_h: 'Entra para pedir', login_p: 'Te enviamos un código a tu email. Sin contraseñas.', email: 'Tu email', send: 'Enviar código', code_h: 'Introduce el código', code_p: 'Te lo hemos enviado a', code: 'Código', enter: 'Entrar', other: 'Cambiar email', resend: 'Reenviar código',
      google: 'Continuar con Google', or: 'o', prof_h: 'Completa tu perfil', prof_p: 'Solo necesitamos tu nombre para avisarte cuando tu pedido esté listo.', name: 'Nombre', phone: 'Teléfono (opcional)', mkt: 'Quiero recibir novedades y ventajas de ROCE por email (puedes darte de baja cuando quieras).',
      save: 'Guardar', hello: 'Hola', logout: 'Cerrar sesión', edit: 'Editar perfil', close: 'Cerrar', legal: 'Al continuar aceptas nuestra', privacy: 'política de privacidad', err_email: 'Escribe un email válido.', err_code: 'El código no es válido o ha caducado.', err_send: 'No hemos podido enviar el código. Inténtalo de nuevo en un minuto.', err_name: 'Escribe tu nombre.', err_net: 'Sin conexión. Inténtalo de nuevo.', sent: 'Código enviado.', ok_in: 'Sesión iniciada.' },
    en: { acct: 'My account', login: 'Sign in', login_h: 'Sign in to order', login_p: "We'll email you a code. No passwords.", email: 'Your email', send: 'Send code', code_h: 'Enter the code', code_p: 'We sent it to', code: 'Code', enter: 'Sign in', other: 'Change email', resend: 'Resend code',
      google: 'Continue with Google', or: 'or', prof_h: 'Complete your profile', prof_p: 'We only need your name to tell you when your order is ready.', name: 'Name', phone: 'Phone (optional)', mkt: 'I want to receive ROCE news and perks by email (unsubscribe any time).',
      save: 'Save', hello: 'Hi', logout: 'Sign out', edit: 'Edit profile', close: 'Close', legal: 'By continuing you accept our', privacy: 'privacy policy', err_email: 'Enter a valid email.', err_code: 'The code is invalid or has expired.', err_send: "We couldn't send the code. Try again in a minute.", err_name: 'Enter your name.', err_net: 'No connection. Try again.', sent: 'Code sent.', ok_in: 'Signed in.' }
  };
  var L = function () { return document.documentElement.lang === 'en' ? 'en' : 'es'; };
  var t = function (k) { return UI[L()][k]; };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ── Sesión ── */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function store(s) { try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch (e) {} }
  function fromTokens(r) { return r && r.access_token ? { access_token: r.access_token, refresh_token: r.refresh_token, expires_at: Date.now() + ((r.expires_in || 3600) * 1000), user: r.user ? { id: r.user.id, email: r.user.email } : null } : null; }
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
  function getProfile() { return rest('GET', '/rest/v1/app_customers?select=name,phone,marketing_optin,email&limit=1').then(function (a) { profile = a && a[0] || null; return profile; }); }

  /* ── Diálogo ── */
  var dlg = document.getElementById('apDlg'), box = document.getElementById('apDlgIn'), after = null, state = { email: '' };
  function show(h) { box.innerHTML = h; if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); } }
  function msg(m, ok) { var e = document.getElementById('apAcMsg'); if (e) { e.textContent = m || ''; e.className = 'ap-msg' + (ok ? ' is-ok' : ''); } }
  function busy(b, on) { if (b) { b.disabled = !!on; } }
  var legal = function () { return '<p class="ap-legal">' + t('legal') + ' <a href="https://roce.es/privacidad.html" target="_blank" rel="noopener">' + t('privacy') + '</a>.</p>'; };

  function viewLogin() {
    var soc = '';
    if (PROVIDERS.google) soc += '<button type="button" class="cv-ghost ap-soc" data-acct="google">' + t('google') + '</button>';
    show('<h2>' + t('login_h') + '</h2><div class="cv-sheet-body"><p>' + t('login_p') + '</p>' + (soc ? soc + '<p class="ap-or">' + t('or') + '</p>' : '') +
      '<section class="cv-fs"><h3>' + t('email') + '</h3><input class="ap-in" id="apAcEmail" type="email" inputmode="email" autocomplete="email" autocapitalize="off" value="' + esc(state.email) + '"></section><p class="ap-msg" id="apAcMsg"></p>' + legal() + '</div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="send">' + t('send') + '</button></div>');
  }
  function viewCode() {
    show('<h2>' + t('code_h') + '</h2><div class="cv-sheet-body"><p>' + t('code_p') + ' <b>' + esc(state.email) + '</b></p>' +
      '<section class="cv-fs"><h3>' + t('code') + '</h3><input class="ap-in ap-code" id="apAcCode" inputmode="numeric" autocomplete="one-time-code" maxlength="10" pattern="[0-9]*"></section><p class="ap-msg" id="apAcMsg"></p>' +
      '<p><button type="button" class="ap-link" data-acct="resend">' + t('resend') + '</button> · <button type="button" class="ap-link" data-acct="other">' + t('other') + '</button></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="verify">' + t('enter') + '</button></div>');
    var c = document.getElementById('apAcCode'); if (c) setTimeout(function () { c.focus(); }, 50);
  }
  function viewProfile() {
    var p = profile || {};
    show('<h2>' + t('prof_h') + '</h2><div class="cv-sheet-body"><p>' + t('prof_p') + '</p>' +
      '<section class="cv-fs"><h3>' + t('name') + '</h3><input class="ap-in" id="apAcName" autocomplete="given-name" maxlength="80" value="' + esc(p.name || '') + '"></section>' +
      '<section class="cv-fs"><h3>' + t('phone') + '</h3><input class="ap-in" id="apAcPhone" type="tel" inputmode="tel" autocomplete="tel" maxlength="30" value="' + esc(p.phone || '') + '"></section>' +
      '<label class="ap-check"><input type="checkbox" id="apAcMkt"' + (p.marketing_optin ? ' checked' : '') + '><span>' + t('mkt') + '</span></label><p class="ap-msg" id="apAcMsg"></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="close">' + t('close') + '</button><button type="button" class="cv-solid" data-acct="save">' + t('save') + '</button></div>');
  }
  function viewAccount() {
    var p = profile || {}, em = (S && S.user && S.user.email) || p.email || '';
    show('<h2>' + t('hello') + (p.name ? ', ' + esc(p.name) : '') + '</h2><div class="cv-sheet-body"><p>' + esc(em) + '</p>' +
      '<p><button type="button" class="ap-link" data-acct="edit">' + t('edit') + '</button></p></div>' +
      '<div class="cv-sheet-actions"><button type="button" class="cv-ghost" data-acct="logout">' + t('logout') + '</button><button type="button" class="cv-solid" data-acct="close">' + t('close') + '</button></div>');
  }

  function afterLogin() {
    return getProfile().then(function (p) {
      if (!p || !p.name) { viewProfile(); return; }
      if (dlg.open) dlg.close(); var cb = after; after = null; paintEntry(); if (cb) cb();
    }).catch(function () { viewProfile(); });
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-acct]'); if (!el || el.disabled) return;
    var a = el.dataset.acct;
    if (a === 'close') { if (dlg.open) dlg.close(); after = null; }
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
      var n = ((document.getElementById('apAcName') || {}).value || '').trim(); if (!n) { msg(t('err_name')); return; } busy(el, true);
      rest('POST', '/rest/v1/rpc/app_customer_save', { p_name: n, p_phone: ((document.getElementById('apAcPhone') || {}).value || '').trim(), p_lang: L(), p_marketing: !!(document.getElementById('apAcMkt') || {}).checked })
        .then(function () { return getProfile(); }).then(function () { busy(el, false); if (dlg.open) dlg.close(); var cb = after; after = null; paintEntry(); if (cb) cb(); })
        .catch(function () { msg(t('err_net')); busy(el, false); });
    }
    else if (a === 'edit') { viewProfile(); }
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
      getProfile().then(function (p) { if (!p || !p.name) { after = cb; viewProfile(); } else { paintEntry(); cb(); } }).catch(function () { after = cb; viewProfile(); });
    });
  }
  window.ROCE_ACCT = { open: open, require: requireLogin, session: session, rest: rest, loggedIn: function () { return !!S; } };
  if (S) getProfile().then(paintEntry).catch(function () {});
})();
