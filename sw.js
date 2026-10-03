// 다이아몬드 크로니클 서비스워커: 항상 최신 index를 먼저 받고(네트워크 우선), 오프라인일 때만 저장본 사용
const CACHE = 'dc-v1';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './icon-192.png', './icon-512.png']).catch(()=>{}))); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // Firebase 등 외부 요청은 건드리지 않음
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
});
