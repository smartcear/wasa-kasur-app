const CACHE_VERSION='wasa-kasur-v2.8.1.0';
const STATIC_CACHE=`${CACHE_VERSION}-static`;
const RUNTIME_CACHE=`${CACHE_VERSION}-runtime`;
const SHELL=['./','./admin-panel.html','./officer-app.html','./manifest.json','./privacy-policy.html'];

self.addEventListener('install',e=>e.waitUntil(
  caches.open(STATIC_CACHE).then(async c=>{
    for(const f of SHELL){try{const r=await fetch(f,{cache:'no-store'});if(r.ok)await c.put(f,r.clone());}catch(err){console.warn('[WASA SW]',f,err)}}
  }).then(()=>self.skipWaiting())
));

self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('wasa-kasur-')&&n!==STATIC_CACHE&&n!==RUNTIME_CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())
));

self.addEventListener('message',e=>{
  if(e.data?.type==='SKIP_WAITING')self.skipWaiting();
  if(e.data?.type==='CLEAR_WASA_CACHE')e.waitUntil(caches.keys().then(ns=>Promise.all(ns.filter(n=>n.startsWith('wasa-kasur-')).map(n=>caches.delete(n)))));
});

self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==self.location.origin)return;
  const p=u.pathname.toLowerCase();
  if(p.includes('/firestore')||p.includes('/firebase')||p.includes('/cloudinary')||p.includes('/api/'))return;

  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{
      if(res.ok){const c=res.clone();caches.open(RUNTIME_CACHE).then(x=>x.put(r,c).catch(()=>{}))}
      return res;
    }).catch(async()=>{
      return await caches.match(r) ||
        (p.endsWith('admin-panel.html')&&await caches.match('./admin-panel.html')) ||
        (p.endsWith('officer-app.html')&&await caches.match('./officer-app.html')) ||
        await caches.match('./officer-app.html') ||
        new Response('<h2>WASA Kasur</h2><p>Internet connection required for first launch.</p>',{headers:{'Content-Type':'text/html'}});
    }));return;
  }

  const asset=/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff|woff2|json)$/i.test(p);
  if(asset)e.respondWith(caches.match(r).then(c=>c||fetch(r).then(res=>{
    if(res.ok&&res.type!=='opaque'){const x=res.clone();caches.open(RUNTIME_CACHE).then(y=>y.put(r,x).catch(()=>{}))}
    return res;
  })));
});
