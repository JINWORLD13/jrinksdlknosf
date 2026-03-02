import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

const days = 1; // 1일
// 빌드 시 vite.config.js의 injectBuildVersionPlugin으로 자동 교체됨
const version = __BUILD_VERSION__;

//! Workbox가 자동으로 오래된 precache 버전 정리 (배포 시 자동 캐시 무효화)
cleanupOutdatedCaches();

//! WB_MANIFEST 플레이스홀더는 빌드 시 Workbox가 자동으로 파일 목록으로 주입
//! revision 값이 변경되면 자동으로 새로운 파일을 다운로드하고 캐시 업데이트
precacheAndRoute(self.__WB_MANIFEST);

//! ========================================
//! Helper: 같은 origin만 캐싱하도록 필터링
//! ========================================
/**
 * 요청이 같은 origin인지 확인
 * 외부 도메인(GoDaddy parking, Google 광고 등)은 캐싱하지 않음
 */
function isSameOrigin(url) {
  try {
    const requestUrl = new URL(url, self.location.href);
    return requestUrl.origin === self.location.origin;
  } catch (e) {
    // URL 파싱 실패 시 false 반환 (캐싱하지 않음)
    return false;
  }
}

//! ========================================
//! Runtime Caching Strategies (최적화됨)
//! ========================================
//! 캐시 엔트리 수 대폭 감소로 메모리 사용량 절감
//! purgeOnQuotaError로 메모리 부족 시 자동 정리
//! 같은 origin만 캐싱하여 CSP 위반 방지

// HTML - NetworkFirst (항상 최신 버전 확인) - 50→20
registerRoute(
  ({ request, url }) =>
    request.destination === 'document' && isSameOrigin(url.href),
  new NetworkFirst({
    cacheName: `html-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20, // 60% 감소
        maxAgeSeconds: days * 24 * 60 * 60,
        purgeOnQuotaError: true, // 메모리 부족 시 자동 정리
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거 (실패한 요청 캐싱 방지)
      }),
    ],
  })
);

// CSS - CacheFirst (해시로 버전 관리됨) - 100→50
registerRoute(
  ({ request, url }) =>
    request.destination === 'style' && isSameOrigin(url.href),
  new CacheFirst({
    cacheName: `css-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // 50% 감소
        maxAgeSeconds: days * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거
      }),
    ],
  })
);

// JavaScript - CacheFirst (sw.js 제외, 해시로 버전 관리됨) - 100→50
registerRoute(
  ({ request, url }) =>
    request.destination === 'script' &&
    !url.pathname.endsWith('/sw.js') &&
    isSameOrigin(url.href),
  new CacheFirst({
    cacheName: `js-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50, // 50% 감소
        maxAgeSeconds: days * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거
      }),
    ],
  })
);

// Images - CacheFirst - 200→100
registerRoute(
  ({ request, url }) =>
    request.destination === 'image' && isSameOrigin(url.href),
  new CacheFirst({
    cacheName: `images-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100, // 50% 감소
        maxAgeSeconds: days * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거
      }),
    ],
  })
);

// Fonts - CacheFirst
registerRoute(
  ({ request, url }) =>
    request.destination === 'font' && isSameOrigin(url.href),
  new CacheFirst({
    cacheName: `fonts-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1년
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거
      }),
    ],
  })
);

// 3D Models (GLTF, GLB, BIN) - CacheFirst - 50→20
registerRoute(
  ({ url }) => /\.(?:gltf|glb|bin)$/i.test(url.pathname) && isSameOrigin(url.href),
  new CacheFirst({
    cacheName: `models-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20, // 60% 감소
        maxAgeSeconds: days * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거
      }),
    ],
  })
);

// Manifest - StaleWhileRevalidate
registerRoute(
  ({ url }) =>
    /\.(?:webmanifest|json)$/i.test(url.pathname) && isSameOrigin(url.href),
  new StaleWhileRevalidate({
    cacheName: `manifest-${version}`,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: days * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
      new CacheableResponsePlugin({
        statuses: [200], // status 0 제거
      }),
    ],
  })
);

//! ========================================
//! Runtime Cache Names (오래된 캐시 정리용)
//! ========================================
const RUNTIME_CACHE_NAMES = [
  `html-${version}`,
  `css-${version}`,
  `js-${version}`,
  `images-${version}`,
  `fonts-${version}`,
  `models-${version}`,
  `manifest-${version}`,
];

//! ========================================
//! 주기적 메모리 정리 (5분마다)
//! ========================================
const CACHE_SIZE_LIMIT_MB = 100; // 100MB 제한
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5분

/**
 * 캐시 크기를 확인하고 임계값 초과 시 오래된 엔트리 삭제
 */
async function periodicCacheCleanup() {
  try {
    // 저장소 사용량 확인
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const usageMB = (estimate.usage || 0) / (1024 * 1024);
      const quotaMB = (estimate.quota || 0) / (1024 * 1024);
      const usagePercent = (usageMB / quotaMB) * 100;

      console.log(
        `[SW ${version}] Storage: ${usageMB.toFixed(2)}MB / ${quotaMB.toFixed(
          2
        )}MB (${usagePercent.toFixed(1)}%)`
      );

      // 80% 초과 시 캐시 정리
      if (usagePercent > 80 || usageMB > CACHE_SIZE_LIMIT_MB) {
        console.log(`[SW ${version}] Storage limit exceeded, cleaning up...`);
        await cleanupOldCacheEntries();
      }
    }
  } catch (error) {
    console.error(`[SW ${version}] Periodic cleanup error:`, error);
  }
}

/**
 * 오래된 캐시 엔트리를 정리
 */
async function cleanupOldCacheEntries() {
  const cacheNames = await caches.keys();

  for (const cacheName of cacheNames) {
    // precache는 건드리지 않음
    if (cacheName.startsWith('workbox-precache')) continue;

    const cache = await caches.open(cacheName);
    const keys = await cache.keys();

    // 캐시가 큰 경우 오래된 것부터 삭제 (50% 정리)
    if (keys.length > 50) {
      const deleteCount = Math.floor(keys.length * 0.5);
      for (let i = 0; i < deleteCount; i++) {
        await cache.delete(keys[i]);
      }
      console.log(
        `[SW ${version}] Cleaned up ${deleteCount} entries from ${cacheName}`
      );
    }
  }
}

// 5분마다 메모리 정리 실행
setInterval(periodicCacheCleanup, CLEANUP_INTERVAL_MS);

// 최초 1분 후 한번 실행
setTimeout(periodicCacheCleanup, 60000);

//! ========================================
//! Service Worker Lifecycle
//! ========================================

// Install: 새로운 SW 설치 시
self.addEventListener('install', event => {
  console.log(`[SW ${version}] Installing...`);
  self.skipWaiting();
  console.log(`[SW ${version}] Installing... skipWaiting called`);
});

// Activate: SW 활성화 시 오래된 캐시 삭제 (개선됨)
self.addEventListener('activate', event => {
  console.log(`[SW ${version}] Activating...`);

  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        let deletedCount = 0;

        // 모든 캐시를 검사하고 오래된 것 삭제
        await Promise.all(
          cacheNames.map(async cacheName => {
            // Workbox precache 중 현재 버전이 아닌 것 삭제
            if (cacheName.startsWith('workbox-precache')) {
              // 현재 버전의 precache가 아니면 삭제 (Workbox가 자동 관리)
              // cleanupOutdatedCaches()가 처리하므로 여기서는 스킵
              return;
            }

            // 런타임 캐시 중 현재 버전이 아닌 것 삭제
            const isCurrentCache = RUNTIME_CACHE_NAMES.includes(cacheName);
            if (!isCurrentCache) {
              console.log(`[SW ${version}] Deleting old cache: ${cacheName}`);
              await caches.delete(cacheName);
              deletedCount++;
            }
          })
        );

        console.log(
          `[SW ${version}] Activated successfully (deleted ${deletedCount} old caches)`
        );

        event.waitUntil(self.clients.claim());
        console.log(`[SW ${version}] Clients claimed.`);
      } catch (error) {
        console.error(`[SW ${version}] Activation error:`, error);
      }
    })()
  );
});

// Message: 클라이언트로부터 메시지 수신 처리
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`[SW ${version}] Received SKIP_WAITING message`);
    self.skipWaiting();
  }

  // 수동 캐시 정리 요청
  if (event.data && event.data.type === 'CLEANUP_CACHE') {
    console.log(`[SW ${version}] Manual cache cleanup requested`);
    event.waitUntil(cleanupOldCacheEntries());
  }

  // 캐시 상태 확인 요청
  if (event.data && event.data.type === 'CHECK_CACHE_STATUS') {
    event.waitUntil(
      (async () => {
        try {
          const estimate = await navigator.storage.estimate();
          const usageMB = (estimate.usage || 0) / (1024 * 1024);
          const quotaMB = (estimate.quota || 0) / (1024 * 1024);

          // 클라이언트에게 응답 전송
          const clients = await self.clients.matchAll();
          clients.forEach(client => {
            client.postMessage({
              type: 'CACHE_STATUS',
              usage: usageMB,
              quota: quotaMB,
              percent: (usageMB / quotaMB) * 100,
            });
          });
        } catch (error) {
          console.error(`[SW ${version}] Cache status check error:`, error);
        }
      })()
    );
  }
});

//! ========================================
//! 에러 핸들링
//! ========================================
self.addEventListener('error', event => {
  console.error(`[SW ${version}] Error:`, event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error(`[SW ${version}] Unhandled rejection:`, event.reason);
});

console.log(`[SW ${version}] Loaded successfully`);
