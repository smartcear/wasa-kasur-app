/* =========================================================
   WASA KASUR — PRODUCTION PWA SERVICE WORKER
   Version: 2.8.1.0
   Project: wasa-app-ksr
   ========================================================= */

const CACHE_VERSION = 'wasa-kasur-v2.8.1.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const APP_SHELL = [
  './',
  './admin-panel.html',
  './officer-app.html',
  './manifest.json',
  './privacy-policy.html'
];

/* ---------------------------------------------------------
   INSTALL
   Cache the local application shell.
   --------------------------------------------------------- */

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(async cache => {
      for (const file of APP_SHELL) {
        try {
          const response = await fetch(file, {
            cache: 'no-store'
          });

          if (response.ok) {
            await cache.put(file, response.clone());
          }
        } catch (error) {
          console.warn(
            '[WASA SW] Could not cache:',
            file,
            error
          );
        }
      }
    }).then(() => self.skipWaiting())
  );
});


/* ---------------------------------------------------------
   ACTIVATE
   Remove old WASA caches.
   --------------------------------------------------------- */

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            return (
              name.startsWith('wasa-kasur-') &&
              name !== STATIC_CACHE &&
              name !== RUNTIME_CACHE
            );
          })
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});


/* ---------------------------------------------------------
   MESSAGE
   Allows the application to request immediate activation
   or cache clearing.
   --------------------------------------------------------- */

self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_WASA_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('wasa-kasur-'))
            .map(name => caches.delete(name))
        );
      })
    );
  }
});


/* ---------------------------------------------------------
   FETCH
   Important:
   Firebase, Firestore, Auth, Storage and Cloudinary data
   must NOT be blindly cached by this Service Worker.
   --------------------------------------------------------- */

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  /*
    Only handle same-origin requests.
    Firebase / Cloudinary / external APIs are left alone.
  */
  if (url.origin !== self.location.origin) {
    return;
  }

  /*
    Never cache Firebase or API-like paths if they happen
    to be proxied through the same origin.
  */
  const pathname = url.pathname.toLowerCase();

  if (
    pathname.includes('/firestore') ||
    pathname.includes('/firebase') ||
    pathname.includes('/cloudinary') ||
    pathname.includes('/api/')
  ) {
    return;
  }


  /* -------------------------------------------------------
     HTML NAVIGATION
     Network first.
     If internet is unavailable, use cached application.
     ------------------------------------------------------- */

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.ok) {
            const responseCopy = response.clone();

            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseCopy).catch(() => {});
            });
          }

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);

          if (cached) {
            return cached;
          }

          const requestedPath = pathname;

          if (requestedPath.endsWith('admin-panel.html')) {
            const adminPage = await caches.match(
              './admin-panel.html'
            );

            if (adminPage) {
              return adminPage;
            }
          }

          if (requestedPath.endsWith('officer-app.html')) {
            const officerPage = await caches.match(
              './officer-app.html'
            );

            if (officerPage) {
              return officerPage;
            }
          }

          const officerFallback = await caches.match(
            './officer-app.html'
          );

          if (officerFallback) {
            return officerFallback;
          }

          return new Response(
            `
            <!doctype html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport"
                    content="width=device-width,initial-scale=1">
              <title>WASA Kasur</title>
            </head>
            <body>
              <h2>WASA Kasur</h2>
              <p>
                Internet connection required for first launch.
              </p>
            </body>
            </html>
            `,
            {
              headers: {
                'Content-Type': 'text/html; charset=utf-8'
              }
            }
          );
        })
    );

    return;
  }


  /* -------------------------------------------------------
     STATIC FILES
     Cache first.
     ------------------------------------------------------- */

  const isStaticAsset =
    pathname.endsWith('.js') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.woff') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.json');


  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then(response => {
          if (
            response &&
            response.ok &&
            response.type !== 'opaque'
          ) {
            const responseCopy = response.clone();

            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(request, responseCopy).catch(() => {});
            });
          }

          return response;
        });
      })
    );
  }
});


/* ---------------------------------------------------------
   UNHANDLED ERRORS
   --------------------------------------------------------- */

self.addEventListener('error', event => {
  console.warn('[WASA SW] Error:', event.error || event.message);
});

self.addEventListener('unhandledrejection', event => {
  console.warn(
    '[WASA SW] Unhandled promise rejection:',
    event.reason
  );
});