const workboxVersion = '6.6.0';
importScripts(`https://storage.googleapis.com/workbox-cdn/releases/${workboxVersion}/workbox-sw.js`);

const CACHE_PREFIX = "GMusic";

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX
});

self.skipWaiting();
workbox.core.clientsClaim();

// 清空过期缓存
workbox.precaching.cleanupOutdatedCaches();

// 缓存资源
workbox.routing.registerRoute(
    /\.(?:png|jpg|jpeg|gif|bmp|webp|svg|ico|mp3|lrc|m4a)$/,
    new workbox.strategies.CacheFirst({
        cacheName: `${CACHE_PREFIX}-resource`,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 *30 // 30day
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// 缓存 js / css / json 资源
workbox.routing.registerRoute(
    /\/?(?!sw\.js)(\.css|\.js|\.json)/,
    new workbox.strategies.StaleWhileRevalidate({
        cacheName: `${CACHE_PREFIX}-static-libs`,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 *1 //1day
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);

// CDN资源
workbox.routing.registerRoute(
    /^https:\/\/[a-z0-9-]+\.music\.126\.net/,
    new workbox.strategies.CacheFirst({
        cacheName: `${CACHE_PREFIX}-static-libs`,
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30 //30day
            }),
            new workbox.cacheableResponse.CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    })
);