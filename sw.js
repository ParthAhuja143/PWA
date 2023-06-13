const CACHE_VERSION = "v1.2"
const STATIC_CACHE_NAME = `pwa-static-cache_${CACHE_VERSION}`;

const staticCacheMap = [
    '/',
    '/offline.html',
    '/js/app.js',
    '/css/app.css',
    '/img/dish.png',
]

self.addEventListener('install', function(event) {
    console.log('[Service Worker] Installing Service Worker')
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then((cache) => {
            console.log('[Service Worker] Adding cache')
            return cache.addAll(staticCacheMap)
        })
    )
});

self.addEventListener('activate', function(event){
    console.log('[Service Worker] Activating Service Worker')
    event.waitUntil(
        // delete older cache
        caches.keys().then(cacheNames => {
            cacheNames.filter(cacheName => {
                return cacheName.startsWith('pwa-') && cacheName !== STATIC_CACHE_NAME
            })
            .map(cacheName => {
                console.log('[Service Worker] Deleting cache with name: ', cacheName)
                return caches.delete(cacheName);
            })
        })
    )
})

self.addEventListener('fetch', function(event) {
    /** 
    * @title hijacking requests
    *
    * @code event.respondWith(
        fetch('/img/dish.png')
    );
    **/

    /**
    * @title hijacking with catch
    *
    * @code event.respondWith(
        fetch(event.request)
        .then((res) => {
            if(res.status === 404){
                return new Response('NOT FOUND');
            }
            return res;
        })
        .catch((error) => {
            return new Response('TOTALLY FAILED')
        })
    )
    **/

    if ((event.request.url.indexOf('chrome-extension') === 0)) return; 

    event.respondWith(

        caches.match(event.request).then((cacheResponse) => {
            if(cacheResponse) {
                console.log("[Service Worker] Cache Hit for: ", event.request.url)
                return cacheResponse;
            }
            else{
                return fetch(event.request)
                /**
                 * The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. Instead, it will resolve normally (with ok status set to false), and it will only reject on network failure or if anything prevented the request from completing.
                 * So we are safe to assume that catch is only called when there is a network error and the request is not cached
                 */
                .catch((error) => {
                    return caches.open(STATIC_CACHE_NAME).then(function (cache) {
                        console.log('[Service Worker] No response, redirecting to offline page');
                        if (
                          event.request.headers.get('accept').includes('text/html') !== -1
                        ) {
                          return caches.match('/offline.html');
                        }
                      });
                })
            };
           })
    )
});

self.addEventListener("message", function(event){
    if(event.data.action === 'skipWaiting'){
        self.skipWaiting();
    }
})