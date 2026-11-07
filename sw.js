// Lupce8Teen: the apps now live in their own folders (admin/, teacher/, guardian/), each with its own helper.
// This old shared helper removes its saved copies and switches itself off.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => /^lupce-v\d+$/.test(k)).map(k => caches.delete(k)))).then(() => self.registration.unregister())); });
