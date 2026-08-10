const CACHE = 'controle-pix-v1';
const CACHEARQUIVOS = ['./index.html', './dados_pix.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CACHEARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // NÃO cacheia o manifest.json nem o index.html — sempre busca a versão nova
  if (url.pathname.endsWith('manifest.json') || url.pathname.endsWith('index.html')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request))
  );
});