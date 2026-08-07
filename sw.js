const CACHE = 'controle-pix-v1';
const ARQUIVOS = ['./index.html','./manifest.json','./icon-192.png','./icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).then((resp) => {
        const clone = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return resp;
      });
    })
  );
});