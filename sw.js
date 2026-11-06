const PREFIX='anglicka-liga-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'v3';
const ASSETS=['./', './index.html', './style.css', './content.js', './engine.js', './art.js', './app.js', './manifest.webmanifest', './icon.svg', './apple-touch-icon.png', './src/content/english-course.js', './src/content/english-school.js', './src/core/curriculum.js', './src/core/progress.js', './src/core/random.js', './src/core/scoring.js', './src/exercises/counting.js', './src/exercises/grammar.js', './src/exercises/matching.js', './src/exercises/positions.js', './src/exercises/vocabulary.js'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith(caches.open(CACHE).then(async cache=>{
  const cached=await cache.match(event.request);if(cached)return cached;
  try{return await fetch(event.request);}
  catch{if(event.request.mode==='navigate'){const index=await cache.match('./index.html');if(index)return index;}return Response.error();}
 }));
});
