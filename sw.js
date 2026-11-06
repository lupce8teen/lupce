// Lupce8Teen: keeps the app pages, Firebase code and fonts on the device so the apps open without internet.
// Data itself is kept and synced by Firebase (Firestore offline cache), not by this file.
const CACHE = 'lupce-v4';
const SHELL = ['admin.html', 'teacher.html', 'guardian.html', 'manifest-admin.json', 'manifest-teacher.json', 'manifest-guardian.json', 'icon-192.png', 'icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // never cache Firebase's live data and log-in traffic
  if (/googleapis\.com$|firebaseio\.com$|identitytoolkit|securetoken/.test(u.hostname)) return;
  const appFile = u.origin === location.origin;
  const library = u.hostname === 'www.gstatic.com' || u.hostname.endsWith('fonts.googleapis.com') || u.hostname.endsWith('fonts.gstatic.com');
  if (!appFile && !library) return;
  // app pages: newest from the internet when possible, otherwise the saved copy; libraries and fonts: saved copy first
  e.respondWith(appFile
    ? fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }))
    : caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; })));
});
