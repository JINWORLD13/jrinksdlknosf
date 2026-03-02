/**
 * SEO 메타 태그 자동 주입 스크립트
 *
 * FLOW 구동 흐름:
 *
 * 1. 데이터 준비
 *    - seoData.js에서 경로별 SEO 데이터 로드
 *    - getSeoData() → 언어별 기본 이미지, 크기, 로케일 설정
 *    - getLanguageFromPath() → URL에서 언어 코드 추출 (ko/en/ja)
 *
 * 2. 메타 태그 생성
 *    - generateMetaTags() → 제목, 설명, 키워드, 이미지 정보 조합
 *    - Open Graph, Twitter Card 태그 생성
 *    - Hreflang 다국어 링크 생성
 *
 * 3. HTML 파일 처리
 *    - processHtmlFile() → 기존 메타 태그 제거 (중복 방지)
 *    - 새 메타 태그 삽입
 *    - HTML lang 속성 업데이트
 *
 * 4. 배치 처리
 *    - injectMetaTags() → 모든 언어별 경로 순회 처리
 *    - routes.forEach() → 각 경로별 HTML 파일 처리
 *    - 루트 index.html도 영어 기본으로 처리
 *
 * 실행 순서:
 *    injectMetaTags() → routes.forEach() → processHtmlFile() → generateMetaTags() → getSeoData()
 *
 * 목적: 빌드 후 정적 HTML 파일들에 SEO 최적화된 메타 태그 자동 주입
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadEnv } from 'vite';
import { seoData } from '../src/data/seoData/seoData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// VITE_SERVER_URL 환경 변수 로드 (.env 파일에서 읽기)
const env = loadEnv(
  process.env.NODE_ENV || 'production',
  path.resolve(__dirname, '..'),
  'VITE_'
);
const SITE_URL = env.VITE_SERVER_URL;

function getSeoData(urlPath) {
  // seoData.jsx에서 경로에 맞는 SEO 데이터 찾기
  const data = seoData[urlPath] || seoData['/en'];

  // 기본값 설정 (image, imageWidth, imageHeight, ogLocale가 없는 경우)
  const lang = getLanguageFromPath(urlPath);
  const defaultImage =
    lang === 'ko'
      ? '/assets/images/home/preview-ko.png'
      : lang === 'ja'
      ? '/assets/images/home/preview-ja.png'
      : '/assets/images/home/preview-en.png';

  const defaultImageWidth = lang === 'ja' ? '1920' : '1920';
  const defaultImageHeight = lang === 'en' ? '876' : '876';
  const defaultOgLocale =
    lang === 'ko' ? 'ko_KR' : lang === 'ja' ? 'ja_JP' : 'en_US';

  return {
    title: data.title || 'COSMOS TAROT',
    description:
      data.description ||
      'Warm tarot consultation when your mind feels complicated',
    keywords:
      data.keywords || 'tarot cards, mind reading, comfort, fortune, healing',
    image: data.image || defaultImage,
    imageWidth: data.imageWidth || defaultImageWidth,
    imageHeight: data.imageHeight || defaultImageHeight,
    ogLocale: data.ogLocale || defaultOgLocale,
  };
}

function getLanguageFromPath(urlPath) {
  if (urlPath.startsWith('/ko')) return 'ko';
  if (urlPath.startsWith('/ja')) return 'ja';
  return 'en';
}

function generateMetaTags(urlPath) {
  const seo = getSeoData(urlPath);
  const lang = getLanguageFromPath(urlPath);

  // URL 정규화: trailing slash 추가 (일관성 유지)
  const normalizedPath = urlPath.endsWith('/') ? urlPath : `${urlPath}/`;
  const fullUrl = `${SITE_URL}${normalizedPath}`;
  const imageUrl = `${SITE_URL}${seo.image}`;

  // 경로에서 베이스 경로 추출 (언어 제외)
  const basePath = urlPath.replace(/^\/(ko|en|ja)/, '') || '/';
  // basePath도 trailing slash 추가
  const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`;

  return `
    <title>${seo.title}</title>
    <meta name="title" content="${seo.title}" />
    <meta name="description" content="${seo.description}" />
    <meta name="keywords" content="${seo.keywords}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <meta name="author" content="Cosmos Tarot" />
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
    <link rel="apple-touch-icon" href="/assets/cosmos_tarot_favicon/apple-icon-180x180.png" />
    <!-- Canonical URL (SEO 중복 콘텐츠 방지) -->
    <link rel="canonical" href="${fullUrl}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${fullUrl}" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:width" content="${seo.imageWidth}" />
    <meta property="og:image:height" content="${seo.imageHeight}" />
    <meta property="og:image:alt" content="${seo.title}" />
    <meta property="og:locale" content="${seo.ogLocale}" />
    <meta property="og:site_name" content="Cosmos Tarot" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="${fullUrl}" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${seo.title}" />
    <meta name="twitter:site" content="@cosmos_tarot" />

    <!-- Alternate Languages는 React Helmet(SEOMetaTags.jsx)에서 처리하므로 제거 (중복 방지) -->`;
}

// SEO를 위한 기본 body 콘텐츠 생성 (JavaScript 없이도 크롤러가 볼 수 있도록)
// CSS로 숨겨서 화면에는 보이지 않지만 SEO에는 적용되도록 함
function generateBodyContent(urlPath) {
  const seo = getSeoData(urlPath);
  const lang = getLanguageFromPath(urlPath);

  // 홈페이지(/ko, /en, /ja)에만 기본 콘텐츠 주입
  if (
    urlPath === '/ko' ||
    urlPath === '/en' ||
    urlPath === '/ja' ||
    urlPath === '/'
  ) {
    const additionalText =
      lang === 'ko'
        ? '코스모스 타로는 삶의 질문에 대한 따뜻한 동반자로, 가장 필요할 때 생각 깊은 안내를 제공합니다. 타로 카드 읽기의 원리를 탐구하고 다양한 타로 스프레드에 대해 알아보세요. 타로가 어떻게 관계, 직업, 개인적 성장에 대한 통찰을 제공할 수 있는지 발견하세요. 마음이 복잡할 때 찾는 따뜻한 공간, 코스모스 타로와 함께 당신만의 타로 여정을 시작해보세요. AI 기반의 정확한 해석과 심리학적 접근을 통해 깊이 있는 통찰을 얻을 수 있습니다.'
        : lang === 'ja'
        ? 'コスモスタロットは、人生の質問に対する優しい相棒として、最も必要な時に思いやりあるガイダンスを提供します。タロットカードリーディングの原則を探求し、さまざまなタロットスプレッドについて学びましょう。タロットがどのように関係、キャリア、個人的成長への洞察を提供できるかを発見してください。心が複雑な時に見つける温かい空間、コスモス タロットと一緒にあなただけのタロットの旅を始めてみてください。AIベースの正確な解釈と心理学的アプローチを通じて、深い洞察を得ることができます。'
        : "Cosmos Tarot serves as your gentle companion for life's questions, offering thoughtful guidance when you need it most. Explore the principles of tarot card reading and learn about different tarot spreads. Discover how tarot can provide insights into your relationships, career, and personal growth. When your mind feels heavy, find comfort in tarot's gentle wisdom. Start your own tarot journey with Cosmos Tarot and gain deep insights through AI-based accurate interpretation and psychological approaches.";

    // 더 많은 내부 링크 추가 (SEO 개선)
    const linksHtml =
      lang === 'ko'
        ? '<nav><h2>더 알아보기</h2><ul><li><a href="/ko/tarot/principle">타로 카드 원리</a></li><li><a href="/ko/etc/tarot/learning">타로 학습 가이드</a></li><li><a href="/ko/etc/tarot/explanation">타로 카드 설명</a></li><li><a href="/ko/etc">추가 자료</a></li><li><a href="/ko/mypage">마이페이지</a></li></ul></nav>'
        : lang === 'ja'
        ? '<nav><h2>詳細情報</h2><ul><li><a href="/ja/tarot/principle">タロットカードの原理</a></li><li><a href="/ja/etc/tarot/learning">タロット学習ガイド</a></li><li><a href="/ja/etc/tarot/explanation">タロットカード説明</a></li><li><a href="/ja/etc">追加リソース</a></li><li><a href="/ja/mypage">マイページ</a></li></ul></nav>'
        : '<nav><h2>Learn More</h2><ul><li><a href="/en/tarot/principle">Tarot Card Principles</a></li><li><a href="/en/etc/tarot/learning">Tarot Learning Guide</a></li><li><a href="/en/etc/tarot/explanation">Tarot Card Explanation</a></li><li><a href="/en/etc">Additional Resources</a></li><li><a href="/en/mypage">My Page</a></li></ul></nav>';

    // SEO를 위한 구조화된 콘텐츠 (H1, H2, H3, 섹션 포함)
    const structuredContent =
      lang === 'ko'
        ? `<main><h1>${seo.title}</h1><section><h2>코스모스 타로 소개</h2><p>${seo.description}</p><p>${additionalText}</p></section><section><h2>타로 서비스 특징</h2><h3>24시간 언제든 이용 가능</h3><p>스마트폰, 태블릿, 컴퓨터 어디서든 부드럽게 움직이는 캐릭터 친구를 만날 수 있어요.</p><h3>AI 기반 정확한 해석</h3><p>최신 AI 기술을 활용하여 각 카드의 의미를 정확하게 해석하고, 맞춤형 조언을 제공합니다.</p><h3>개인화된 경험</h3><p>당신만의 타로 여정을 기록하고 관리할 수 있는 마이페이지 기능을 제공합니다.</p></section>${linksHtml}</main>`
        : lang === 'ja'
        ? `<main><h1>${seo.title}</h1><section><h2>コスモス タロット紹介</h2><p>${seo.description}</p><p>${additionalText}</p></section><section><h2>タロットサービスの特徴</h2><h3>24時間いつでも利用可能</h3><p>スマートフォン、タブレット、コンピューターどこででも滑らかに動くキャラクター友達に会えます。</p><h3>AIベースの正確な解釈</h3><p>最新のAI技術を活用して、各カードの意味を正確に解釈し、カスタマイズされたアドバイスを提供します。</p><h3>パーソナライズされた体験</h3><p>あなただけのタロットの旅を記録し、管理できるマイページ機能を提供します。</p></section>${linksHtml}</main>`
        : `<main><h1>${seo.title}</h1><section><h2>About Cosmos Tarot</h2><p>${seo.description}</p><p>${additionalText}</p></section><section><h2>Tarot Service Features</h2><h3>Available 24 Hours</h3><p>You can meet smoothly moving character friends anywhere on your smartphone, tablet, or computer.</p><h3>AI-Based Accurate Interpretation</h3><p>We use the latest AI technology to accurately interpret the meaning of each card and provide personalized advice.</p><h3>Personalized Experience</h3><p>We provide a My Page feature where you can record and manage your own tarot journey.</p></section>${linksHtml}</main>`;

    return '';
  }

  return '';
}

function processHtmlFile(htmlPath, urlPath, viteAssets) {
  if (!fs.existsSync(htmlPath)) {
    console.warn(`File not found: ${htmlPath}`);
    return;
  }

  // 파일 읽기(읽기)
  let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const lang = getLanguageFromPath(urlPath);

  // 중요: 캐시된 Vite 자산 태그 사용 (모든 HTML 파일에 동일한 해시된 파일명 보장)
  const { scriptTags, linkTags, otherHeadTags } = viteAssets;

  // 메타 태그 생성
  const metaTags = generateMetaTags(urlPath);

  // 기존 타이틀 제거 (중복 방지)
  htmlContent = htmlContent.replace(/<title>.*?<\/title>/i, '');

  // 기존 메타 태그들 제거 (주입할 것과 중복 방지)
  htmlContent = htmlContent.replace(
    /<meta\s+(?:name|property)=["'](title|description|keywords|robots|author|og:|twitter:)[^>]*>/gi,
    ''
  );
  htmlContent = htmlContent.replace(
    /<link\s+rel=["'](canonical|alternate|icon|apple-touch-icon)["'][^>]*>/gi,
    ''
  );

  // 중요: 기존 스크립트/링크 태그 제거 (중복 방지 및 새로 주입)
  // 닫는 태그가 있는 경우와 없는 경우 모두 처리
  htmlContent = htmlContent.replace(
    /<script[^>]*src=["'][^"']*assets\/[^"']*["'][^>]*><\/script>/gi,
    ''
  );
  htmlContent = htmlContent.replace(
    /<script[^>]*src=["'][^"']*assets\/[^"']*["'][^>]*>/gi,
    ''
  );
  htmlContent = htmlContent.replace(
    /<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*assets\/[^"']*["'][^>]*>/gi,
    ''
  );
  htmlContent = htmlContent.replace(
    /<link[^>]*rel=["']manifest["'][^>]*>/gi,
    ''
  );
  // registerSW 스크립트 태그 제거 (닫는 태그 포함/미포함 모두 처리)
  htmlContent = htmlContent.replace(
    /<script[^>]*id=["']vite-plugin-pwa:register-sw["'][^>]*><\/script>/gi,
    ''
  );
  htmlContent = htmlContent.replace(
    /<script[^>]*id=["']vite-plugin-pwa:register-sw["'][^>]*>/gi,
    ''
  );

  // 공백만 있는 줄 완전히 제거
  // 공백/탭만 있는 줄들을 제거
  htmlContent = htmlContent.replace(/^\s+$/gm, '');
  // 모든 빈 줄 제거 (연속된 줄바꿈을 하나로 통합, 반복 실행하여 완전히 제거)
  while (htmlContent.includes('\n\n')) {
    htmlContent = htmlContent.replace(/\n\s*\n/g, '\n');
  }

  // </head> 직전에 메타 태그와 보존된 스크립트/링크 태그 삽입
  const preservedTags = [...linkTags, ...otherHeadTags, ...scriptTags].join(
    '\n    '
  );
  if (preservedTags) {
    htmlContent = htmlContent.replace(
      '</head>',
      `${metaTags}\n    ${preservedTags}\n  </head>`
    );
  } else {
    htmlContent = htmlContent.replace('</head>', `${metaTags}\n  </head>`);
    console.warn(
      `No script/link tags found for ${htmlPath}. Make sure Vite build completed successfully.`
    );
  }

  // html lang 속성 변경
  htmlContent = htmlContent.replace(/<html[^>]*>/i, `<html lang="${lang}">`);

  // 파일 저장(쓰기)
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
}

// 중요: Vite가 생성한 원본 index.html에서 스크립트/링크 태그를 한 번만 추출하여 캐시
// 모든 HTML 파일에 동일한 해시된 파일명이 반영되도록 보장
// react-spa-prerender가 index.html을 덮어쓸 수 있으므로 백업 파일도 확인
function extractViteAssets(distPath) {
  // 1순위: 백업 파일 확인 (vite build 직후 백업된 원본)
  const backupIndexPath = path.join(distPath, 'index.html.vite-backup');
  // 2순위: 현재 index.html (react-spa-prerender가 수정했을 수 있음)
  const rootIndexPath = path.join(distPath, 'index.html');

  let rootHtmlContent = null;
  let sourceFile = '';

  if (fs.existsSync(backupIndexPath)) {
    rootHtmlContent = fs.readFileSync(backupIndexPath, 'utf-8');
    sourceFile = 'backup file (index.html.vite-backup)';
  } else if (fs.existsSync(rootIndexPath)) {
    rootHtmlContent = fs.readFileSync(rootIndexPath, 'utf-8');
    sourceFile = 'index.html';
  }

  if (!rootHtmlContent) {
    console.warn(
      'Original index.html not found. Make sure Vite build completed successfully.'
    );
    return {
      scriptTags: [],
      linkTags: [],
      otherHeadTags: [],
    };
  }

  console.log(`Reading Vite assets from: ${sourceFile}`);
  const scriptTags = [];
  const linkTags = [];
  const otherHeadTags = [];

  // 스크립트 태그 추출 (Vite가 생성한 해시된 스크립트만, 닫는 태그 포함)
  // Vite는 <script ...></script> 형식으로 생성하므로 닫는 태그까지 포함
  const scriptRegex =
    /<script[^>]*src=["'][^"']*assets\/[^"']*["'][^>]*><\/script>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptRegex.exec(rootHtmlContent)) !== null) {
    scriptTags.push(scriptMatch[0]);
  }

  // CSS 링크 태그 추출 (Vite가 생성한 해시된 CSS만)
  const linkRegex =
    /<link[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*assets\/[^"']*["'][^>]*>/gi;
  let linkMatch;
  while ((linkMatch = linkRegex.exec(rootHtmlContent)) !== null) {
    linkTags.push(linkMatch[0]);
  }

  // manifest.webmanifest와 registerSW.js 태그 추출
  const manifestRegex = /<link[^>]*rel=["']manifest["'][^>]*>/gi;
  let manifestMatch;
  while ((manifestMatch = manifestRegex.exec(rootHtmlContent)) !== null) {
    otherHeadTags.push(manifestMatch[0]);
  }

  // registerSW.js 태그 추출 (닫는 태그 포함)
  const registerSWRegex =
    /<script[^>]*id=["']vite-plugin-pwa:register-sw["'][^>]*><\/script>/gi;
  let registerSWMatch;
  while ((registerSWMatch = registerSWRegex.exec(rootHtmlContent)) !== null) {
    otherHeadTags.push(registerSWMatch[0]);
  }
  // 닫는 태그가 없는 경우도 처리 (닫는 태그가 있는 경우는 이미 위에서 추출됨)
  const registerSWRegexNoClose =
    /<script[^>]*id=["']vite-plugin-pwa:register-sw["'][^>]*>(?!<\/script>)/gi;
  let registerSWMatchNoClose;
  while (
    (registerSWMatchNoClose = registerSWRegexNoClose.exec(rootHtmlContent)) !==
    null
  ) {
    // 닫는 태그 추가
    otherHeadTags.push(registerSWMatchNoClose[0] + '</script>');
  }

  // 추출된 태그 로그 출력
  console.log('Extracted Vite assets:');
  if (scriptTags.length > 0) {
    scriptTags.forEach(tag => {
      const match = tag.match(/src=["']([^"']+)["']/);
      if (match) console.log(`   JS: ${match[1]}`);
    });
  } else {
    console.warn('   No JS files found!');
  }
  if (linkTags.length > 0) {
    linkTags.forEach(tag => {
      const match = tag.match(/href=["']([^"']+)["']/);
      if (match) console.log(`   CSS: ${match[1]}`);
    });
  } else {
    console.warn('   No CSS files found!');
  }
  if (otherHeadTags.length > 0) {
    console.log(
      `   Other: ${otherHeadTags.length} tag(s) (manifest, registerSW)`
    );
  }
  console.log('');

  return {
    scriptTags,
    linkTags,
    otherHeadTags,
  };
}

// 1단계: 언어별 HTML 파일들 (ko.html, ja.html, en.html) 처리 (혹시 모르니까)
// 2단계: routes 처리
// 3단계: 루트 index.html 처리
// 4단계: 불필요한 언어 HTML 파일 삭제
function injectMetaTags() {
  const distPath = path.resolve(__dirname, '../dist');

  console.log('Starting meta tags injection...\n');

  // 중요: Vite가 생성한 원본 index.html에서 스크립트/링크 태그를 한 번만 추출
  const viteAssets = extractViteAssets(distPath);

  // 언어별 루트 파일들 (ko/index.html, en/index.html, ja/index.html) 우선 처리
  // "/" 접근 시 리다이렉트되는 중요 파일들이므로 확실하게 먼저 처리
  const languageFiles = ['ko', 'en', 'ja'];
  languageFiles.forEach(lang => {
    const htmlPath = path.join(distPath, lang, 'index.html');
    if (fs.existsSync(htmlPath)) {
      processHtmlFile(htmlPath, `/${lang}`, viteAssets);
      console.log(`Processed (priority): ${lang}/index.html`);
    }
  });

  // 처리할 경로 목록 (.rsp.json의 routes + 루트 경로들)
  const routes = [
    '/ko',
    '/en',
    '/ja',
    '/ko/tarot/principle',
    '/en/tarot/principle',
    '/ja/tarot/principle',
    '/ko/etc/tarot/learning',
    '/ko/etc/tarot/explanation',
    '/en/etc/tarot/learning',
    '/en/etc/tarot/explanation',
    '/ja/etc/tarot/learning',
    '/ja/etc/tarot/explanation',
    '/ko/etc',
    '/en/etc',
    '/ja/etc',
  ];

  // 각 경로별 HTML 파일 처리
  routes.forEach(route => {
    // 경로를 파일 시스템 경로로 변환
    const relativePath = route.slice(1); // 앞의 / 제거
    let htmlPath;

    // 루트 언어 경로 (/ko, /en, /ja)인 경우
    if (
      relativePath === 'ko' ||
      relativePath === 'en' ||
      relativePath === 'ja'
    ) {
      htmlPath = path.join(distPath, relativePath, 'index.html');
      // → dist/ko/index.html 경로로 고정됨
      // → dist/en/index.html 경로로 고정됨
      // → dist/ja/index.html 경로로 고정됨

      // 디렉토리가 없으면 생성
      const dir = path.join(distPath, relativePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 루트 index.html을 복사 (아직 없는 경우)
      const rootIndexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(htmlPath) && fs.existsSync(rootIndexPath)) {
        fs.copyFileSync(rootIndexPath, htmlPath);
      }
    } else {
      // 서브 경로인 경우
      htmlPath = path.join(distPath, relativePath + '.html');
    }

    processHtmlFile(htmlPath, route, viteAssets);
    console.log(`Processed: ${route}`);
  });

  // 루트 index.html 처리 (영어 기본)
  const rootIndexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(rootIndexPath)) {
    processHtmlFile(rootIndexPath, '/en', viteAssets);
    console.log(`Processed: / (root, defaults to English)`);
  }

  console.log('\nAll meta tags injected successfully!');

  // 불필요한 언어 HTML 파일 삭제 (ko.html, ja.html, en.html)
  // server.js는 ko/index.html, ja/index.html, en/index.html을 사용함
  console.log('\nCleaning up unnecessary files...\n');
  const unnecessaryFiles = ['ko.html', 'ja.html', 'en.html'];
  unnecessaryFiles.forEach(filename => {
    const filePath = path.join(distPath, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Removed unnecessary file: ${filename}`);
    }
  });

  console.log('\nBuild optimization completed!');
}

// 스크립트 실행
injectMetaTags();
