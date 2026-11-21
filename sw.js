/* ROCE · App de pedidos: caché sencilla del cascarón de la app (la carta y los pedidos siempre van a la red cuando hay conexión). */
var V = 'roce-app-137';
var SHELL = ['/', '/carta.css', '/carta.js', '/chef.js', '/menu.js', '/order.js', '/account.js', '/tour.js', '/sheet-drag.js', '/ux.js', '/order.css', '/i18n.js', '/config.js', '/manifest.webmanifest', '/assets/fonts/HelveticaNeue-Regular.woff2?v=2', '/assets/fonts/HelveticaNeue-Bold.woff2?v=2'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
/* Estrategias: la página (HTML) va a la red con 2,5 s de margen y, si tarda o no hay cobertura, sale de la caché; los archivos con ?v= (versionados) y las fotos/tipografías salen de la caché al instante
   y se refrescan por detrás; Supabase y Redsys nunca se cachean. */
function fromNet(r) { return fetch(r).then(function (res) { if (res && res.status === 200) { var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); } return res; }); }
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  if (r.mode === 'navigate' || u.pathname === '/' || /\.html$/.test(u.pathname)) {
    e.respondWith(new Promise(function (ok) {
      var done = false, t = setTimeout(function () { caches.match(r).then(function (m) { if (m && !done) { done = true; ok(m); } }); }, 2500);
      fromNet(r).then(function (res) { clearTimeout(t); if (!done) { done = true; ok(res); } }).catch(function () { clearTimeout(t); caches.match(r).then(function (m) { if (!done) { done = true; ok(m || caches.match('/')); } }); });
    }));
    return;
  }
  e.respondWith(caches.match(r).then(function (m) {
    var net = fromNet(r).catch(function () { return m; });
    if (m) { e.waitUntil(net.catch(function () {})); return m; }
    return net.then(function (res) { return res || caches.match('/'); });
  }));
});
