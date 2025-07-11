const cacheName = 'todo-cache-v1';
const assets = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/1.mp4',
  '/1.jpg',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css'
];

// Install
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Fetch
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
