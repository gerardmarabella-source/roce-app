/* ROCE · App de pedidos: caché sencilla del cascarón de la app (la carta y los pedidos siempre van a la red cuando hay conexión). */
var V = 'roce-app-39';
var SHELL = ['/', '/carta.css', '/carta.js', '/chef.js', '/menu.js', '/order.js', '/account.js', '/order.css', '/i18n.js', '/config.js', '/manifest.webmanifest', '/assets/fonts/HelveticaNeue-Regular.woff2', '/assets/fonts/HelveticaNeue-Bold.woff2'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(V).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== V; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;           // Supabase y Redsys no se cachean
  e.respondWith(fetch(r).then(function (res) {
    var cp = res.clone(); caches.open(V).then(function (c) { c.put(r, cp); }); return res;
  }).catch(function () { return caches.match(r).then(function (m) { return m || caches.match('/'); }); }));
});
