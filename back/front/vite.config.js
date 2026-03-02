import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import viteImagemin from 'vite-plugin-imagemin';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// 현재 파일 경로에서 디렉토리 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 빌드 시간 타임스탬프 생성
const BUILD_VERSION = `v${Date.now()}`;

// sw.js에 BUILD_VERSION을 주입하는 Vite 플러그인
const injectBuildVersionPlugin = () => ({
  name: 'inject-build-version',
  writeBundle() {
    const swPath = path.resolve(__dirname, 'dist/sw.js');
    if (fs.existsSync(swPath)) {
      let swContent = fs.readFileSync(swPath, 'utf-8');
      // __BUILD_VERSION__ 플레이스홀더를 실제 버전으로 교체
      swContent = swContent.replace(/__BUILD_VERSION__/g, `"${BUILD_VERSION}"`);
      fs.writeFileSync(swPath, swContent, 'utf-8');
      console.log(
        `Service Worker updated with BUILD_VERSION: ${BUILD_VERSION}`
      );
    }
  },
});

export default defineConfig(({ mode }) => ({
  base: '/', // 절대 경로의 루트를 명시적으로 설정
  define: {
    __BUILD_VERSION__: JSON.stringify(BUILD_VERSION),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern', // 또는 "modern-compiler"
      },
    },
  },
  plugins: [
    react(),
    injectBuildVersionPlugin(), // BUILD_VERSION을 sw.js에 주입
    VitePWA({
      registerType: 'autoUpdate', // 자동 업데이트 설정 (사용자 확인 없이 즉시 업데이트)
      // includeAssets: ['**/*'], // 모든 파일을 캐싱 대상으로 포함(없으면, workbox.globPatterns에서 결정)
      devOptions: {
        enabled: false,
        type: 'module', // 개발 환경에서도 모듈로 처리
      },
      workbox: {
        cleanupOutdatedCaches: true, // 오래된 캐시 자동 정리
        skipWaiting: false, // sw.js에서 수동 제어
        clientsClaim: false, // sw.js에서 수동 제어
      },
      manifest: {
        name: 'Cosmos Tarot',
        short_name: 'Cosmos Tarot',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        lang: 'en',
        scope: '/',
        description:
          'Read the hearts of the person you would like to know about',
        theme_color: '#000000',
        icons: [
          {
            src: 'assets/cosmos_tarot_favicon/android-icon-36x36.png',
            sizes: '36x36',
            type: 'image/png',
            density: '0.75',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/android-icon-48x48.png',
            sizes: '48x48',
            type: 'image/png',
            density: '1.0',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/android-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
            density: '1.5',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/android-icon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
            density: '2.0',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/android-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
            density: '3.0',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/android-icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            density: '4.0',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'assets/cosmos_tarot_favicon/cosmos_tarot-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        id: 'com.cosmostarot.cosmostarot',
      },
      //? injecdtManifest 사용시 활성
      /**
       * injectManifest'로 설정하면 사용자가 직접 작성한 Service Worker 파일을 사용
       * injectManifest 전략을 사용하면 개발자가 직접 작성한 서비스 워커 파일을 기반으로 Workbox가 필요한 매니페스트(캐싱할 파일 목록)를 주입
       * Workbox는 swSrc에 지정된 파일을 읽고, 내부에 self.__WB_MANIFEST 자리 표시자를 찾아 실제 캐싱할 파일 목록으로 대체한 후, swDest에 지정된 경로에 새로운 서비스 워커 파일을 생성
       */
      strategies: 'injectManifest',
      // 소스 코드의 루트 디렉토리를 지정
      //! 브라우저가 Service Worker를 등록하려면 sw.js가 웹 서버에서 접근 가능한 경로(예: /sw.js)에 있어야 합니다. Vite에서는 정적 자산을 public 폴더에 배치하는 것이 일반적
      srcDir: 'public',
      // 빌드 후 생성할 서비스 워커 파일명을 지정.
      filename: 'sw.js',
      // injectManifest 전략을 사용할 때 swSrc와 swDest는 injectManifest 옵션 내부에 설정하는 것이 맞습니다.
      injectManifest: {
        // 서비스 워커 소스 파일의 경로를 지정
        swSrc: 'public/sw.js',
        // 빌드 후 생성될 서비스 워커 파일의 경로를 지정
        swDest: 'dist/sw.js',
        // 빌드 디렉토리 명시
        globDirectory: 'dist',
        // Workbox에서 사용하는 모듈 로더 설정
        injectionPoint: 'self.__WB_MANIFEST',
        // Workbox 모듈을 번들링에 포함
        additionalManifestEntries: [],
        // sw.js와 HTML은 precache에서 제외 (항상 네트워크에서 최신 버전 가져오기)
        globPatterns: [
          '**/*.{webmanifest,js,css,png,jpg,jpeg,svg,ttf,gltf,glb,bin}',
        ],
        globIgnores: [
          '**/sw.js',
          '**/sw.mjs',
          '**/*.html', // HTML 파일은 항상 NetworkFirst로 최신 버전 가져오기
          // manifest.icons에 정의된 파일들은 자동으로 precache되므로 제외
          '**/cosmos_tarot_favicon/**',
        ],
        maximumFileSizeToCacheInBytes: 9 * 1024 * 1024,
        // rollupFormat을 'iife'로 설정하여 일반 스크립트 형식으로 빌드
        rollupFormat: 'iife',
      },
    }),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 7,
        interlaced: false,
      },
      optipng: {
        optimizationLevel: 7,
      },
      mozjpeg: {
        quality: 60,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
          },
          {
            name: 'removeEmptyAttrs',
            active: false,
          },
        ],
      },
    }),
  ],
  build: {
    minify: 'esbuild', // 코드 압축 활성화
    // sourcemap: false, // 프로덕션에서 소스 맵 비활성화
    // outDir: 'dist', // 명시적으로 빌드 결과물의 위치를 변경하는 옵션
    rollupOptions: {
      output: {
        entryFileNames: 'assets/index-[hash].js', // 엔트리 JS에 해시
        chunkFileNames: 'assets/chunk-[hash].js', // 청크 JS에 해시
        // Three.js 관련 패키지를 별도 청크로 분리하여 초기 로딩 속도 개선
        manualChunks: {
          three: [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
            'three-stdlib',
          ],
        },
        assetFileNames: assetInfo => {
          const fileName = assetInfo?.names?.[0] || assetInfo?.name;
          const fileNameArr = fileName.split('.');
          const extension = fileNameArr[fileNameArr.length - 1];
          const baseName = fileNameArr[0];

          //! ========================================
          //! 해시 일관성: 모든 파일에 해시 적용
          //! SW precache의 revision으로 자동 캐시 무효화
          //! ========================================

          // 폰트 파일 - 해시 없이 그대로 (코드에서 직접 참조)
          if (fileName === 'KosugiMaru-Regular.ttf') {
            return 'assets/font/Kosugi_Maru/[name].[ext]';
          }
          if (fileName === 'Dongle-Regular.ttf') {
            return 'assets/font/Dongle/[name].[ext]';
          }

          // 타로 카드 뒷면 - 해시 추가
          if (baseName === 'tarot_card_back') {
            return 'assets/images/[name].[ext]';
          }

          // 타로 카드 덱 이미지들 (숫자로 시작하는 jpg) - 해시 없이 그대로
          const numPrefix = Number(baseName.split('_')[0]);
          if (
            !isNaN(numPrefix) &&
            extension === 'jpg' &&
            fileName !== 'universe.jpg'
          ) {
            return 'assets/images/deck/[name].[ext]';
          }

          // durumagi 이미지 - 해시 추가
          if (baseName.slice(0, 8) === 'durumagi') {
            return 'assets/images/[name].[ext]';
          }

          // universe 이미지 - 해시 추가
          if (baseName === 'universe') {
            return 'assets/images/[name].[ext]';
          }

          // 기타 모든 파일 - 해시 추가 (일관성 보장)
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
  },
}));