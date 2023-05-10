const staticCacheName = "warunge-simbahku-test-appdeployments"
const filesToCache = [
  "/",
  "/index.html",
  "/ws.js",
  "/dist/app.js",
  "/dist/router.js",
  "/dist/main.css"
]

self.addEventListener('install', async event => {
  self.skipWaiting()
  const precache = async()=>{
    const cache = await caches.open(staticCacheName)
    return cache.addAll(filesToCache)
  }
  event.waitUntil(precache())
})

//clears any old caches
self.addEventListener('activate', event => {
  const clearCaches = async () => {
    const keys = await caches.keys()
    const oldKeys = keys.filter(key => key !== staticCacheName)
    const promises = oldKeys.map(key => caches.delete(key))
    return Promise.all(promises)
  }
  event.waitUntil(clearCaches())
})

//intercepts request and responds with any cached responses.
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request)
    })
  )
})