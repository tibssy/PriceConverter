const staticCacheName = 'site-static';
const assets = [
  'index.html',
  'js/app.js',
  'js/onr.js',
  'js/index.js',
  'js/stfilter.js',
  'js/database.js',
  'js/tools/localforage.js',
  'js/tools/opencv.js',
  'js/tools/math.js',
  'img/frame.png',
  'css/index.css',
  'css/bootstrap.min.css',
  'css/bootstrap.min.css.map',
  'data/data.json',
];

self.addEventListener("install", evt => {
  //console.log("service worker has been installed");
  evt.waitUntil(
    caches.open(staticCacheName).then(cache => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

self.addEventListener("activate", evt => {
  //console.log("service worker has been activated");
});

self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});
