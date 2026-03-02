import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { createStore } from './src/data/reduxStore/store.jsx';
import App from './src/App.jsx';
import i18n from './src/locales/i18n.js';
import { StaticRouter } from 'react-router-dom';

// VITE_SERVER_URL 환경 변수에서 사이트 URL 가져오기
const getSiteUrl = () => {
  // Vite prerender는 Node.js 환경에서 실행되므로 process.env 사용
  // 빌드 시점에 Vite가 환경 변수를 주입함
  const serverUrl =
    process?.env?.VITE_SERVER_URL ||
    (typeof import.meta?.env?.VITE_SERVER_URL !== 'undefined' &&
    import.meta?.env?.VITE_SERVER_URL
      ? import.meta.env.VITE_SERVER_URL
      : null);
  if (!serverUrl) {
    throw new Error('VITE_SERVER_URL environment variable is required');
  }
  return serverUrl;
};

// 호스트명 추출 함수
const getHostname = url => {
  if (!url) {
    throw new Error('URL is required for hostname extraction');
  }
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }
};

export async function prerender(data) {
  const siteUrl = getSiteUrl();
  const hostname = getHostname(siteUrl);

  // 서버에서만 polyfill 설정 (window가 없을 때만)
  if (typeof window === 'undefined') {
    const globalScope = globalThis;

    // localStorage 폴리필
    const mockStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      length: 0,
      key: () => null,
    };

    // window 폴리필
    globalScope.window = {
      location: {
        href: `${siteUrl}${data.url}`,
        pathname: data.url,
        search: '',
        hash: '',
        protocol: 'https:',
        hostname: hostname,
        port: '',
        origin: siteUrl,
      },
      localStorage: mockStorage,
      sessionStorage: mockStorage,
      navigator: {
        userAgent: 'Mozilla/5.0 (Server Side Rendering)',
        language: 'ko',
        languages: ['ko', 'en'],
        platform: 'Server',
        cookieEnabled: true,
      },
      document: {
        getElementById: () => null,
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: tag => ({
          tagName: tag,
          setAttribute: () => {},
          getAttribute: () => null,
          appendChild: () => {},
          removeChild: () => {},
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
          },
        }),
        createTextNode: text => ({ textContent: text }),
        addEventListener: () => {},
        removeEventListener: () => {},
        documentElement: {
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
          },
        },
        head: {
          appendChild: () => {},
          removeChild: () => {},
        },
        body: {
          appendChild: () => {},
          removeChild: () => {},
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
          },
        },
        cookie: '',
        readyState: 'complete',
      },
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
      innerWidth: 1200,
      innerHeight: 800,
      outerWidth: 1200,
      outerHeight: 800,
      screen: {
        width: 1200,
        height: 800,
        availWidth: 1200,
        availHeight: 800,
      },
      history: {
        pushState: () => {},
        replaceState: () => {},
        back: () => {},
        forward: () => {},
        go: () => {},
        length: 1,
        state: null,
      },
      getComputedStyle: () => ({}),
      matchMedia: () => ({
        matches: false,
        addListener: () => {},
        removeListener: () => {},
      }),
      requestAnimationFrame: cb => setTimeout(cb, 16),
      cancelAnimationFrame: id => clearTimeout(id),
      setTimeout: setTimeout,
      clearTimeout: clearTimeout,
      setInterval: setInterval,
      clearInterval: clearInterval,
      console: console,
      alert: () => {},
      confirm: () => false,
      prompt: () => null,
    };

    // 안전하게 전역 객체들 설정
    globalScope.document = globalScope.window.document;
    globalScope.localStorage = mockStorage;
    globalScope.sessionStorage = mockStorage;

    try {
      if (!globalScope.navigator) {
        globalScope.navigator = globalScope.window.navigator;
      }
    } catch (e) {}

    try {
      if (!globalScope.location) {
        globalScope.location = globalScope.window.location;
      }
    } catch (e) {}

    try {
      if (!globalScope.history) {
        globalScope.history = globalScope.window.history;
      }
    } catch (e) {}

    globalScope.XMLHttpRequest =
      globalScope.XMLHttpRequest ||
      class MockXMLHttpRequest {
        open() {}
        send() {}
        setRequestHeader() {}
        addEventListener() {}
      };

    globalScope.fetch =
      globalScope.fetch ||
      (async () => ({
        ok: true,
        json: async () => ({}),
        text: async () => '',
        status: 200,
      }));
  }

  const segments = data.url.split('/');
  // 루트 경로(/)는 영어로, 나머지는 언어 코드에 따라
  const lang =
    data.url === '/'
      ? 'en'
      : ['ko', 'en', 'ja'].includes(segments[1])
      ? segments[1]
      : 'ko';

  await i18n.changeLanguage(lang);
  const store = createStore();
  const helmetContext = {};

  const html = renderToString(
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider context={helmetContext}>
          <StaticRouter location={data.url}>
            <App />
          </StaticRouter>
        </HelmetProvider>
      </I18nextProvider>
    </Provider>
  );

  let finalHtml = html;

  const { helmet } = helmetContext;

  // Helmet에서 정확한 정보 추출
  const title = helmet.title
    ? helmet.title.toString().replace(/<[^>]*>/g, '')
    : getDefaultTitle(lang);

  // 기본 SEO 정보
  const defaultDescription = getDefaultDescription(lang);
  const defaultKeywords = getDefaultKeywords(lang);

  return {
    html: finalHtml,
    links: new Set([
      '/',
      '/ko',
      '/ja',
      '/en',
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
      '/ko/mypage/chart/totalchart',
      '/ko/mypage/chart/subjectchart',
      '/ko/mypage/chart/questiontopicchart',
      '/en/mypage/chart/totalchart',
      '/en/mypage/chart/subjectchart',
      '/en/mypage/chart/questiontopicchart',
      '/ja/mypage/chart/totalchart',
      '/ja/mypage/chart/subjectchart',
      '/ja/mypage/chart/questiontopicchart',
    ]),
    head: {
      lang,
      title,
      // 수동으로 중요한 SEO 태그들 추가
      elements: new Set([
        // Meta description
        {
          type: 'meta',
          props: {
            name: 'description',
            content: defaultDescription,
          },
        },
        // Meta keywords
        {
          type: 'meta',
          props: {
            name: 'keywords',
            content: defaultKeywords,
          },
        },
        // Robots
        {
          type: 'meta',
          props: {
            name: 'robots',
            content:
              'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        },
        // Open Graph
        {
          type: 'meta',
          props: {
            property: 'og:title',
            content: title,
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:description',
            content: defaultDescription,
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:url',
            content: `${siteUrl}${data.url}`,
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:type',
            content: 'website',
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:image',
            content: `${siteUrl}/assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png`,
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:image:width',
            content: '512',
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:image:height',
            content: '512',
          },
        },
        {
          type: 'meta',
          props: {
            property: 'og:image:alt',
            content: 'Cosmos Tarot Logo',
          },
        },
        // Twitter Card
        {
          type: 'meta',
          props: {
            name: 'twitter:card',
            content: 'summary_large_image',
          },
        },
        {
          type: 'meta',
          props: {
            name: 'twitter:title',
            content: title,
          },
        },
        {
          type: 'meta',
          props: {
            name: 'twitter:description',
            content: defaultDescription,
          },
        },
        {
          type: 'meta',
          props: {
            name: 'twitter:image',
            content: `${siteUrl}/assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png`,
          },
        },
        {
          type: 'meta',
          props: {
            name: 'twitter:site',
            content: '@cosmos_tarot',
          },
        },
        // Canonical link
        {
          type: 'link',
          props: {
            rel: 'canonical',
            href: `${siteUrl}${data.url}`,
          },
        },
        // Hreflang links
        {
          type: 'link',
          props: {
            rel: 'alternate',
            hrefLang: 'ko',
            href: `${siteUrl}/ko${data.url
              .replace(/^\/[a-z]{2}/, '')
              .replace(/^\/ko/, '')}`,
          },
        },
        {
          type: 'link',
          props: {
            rel: 'alternate',
            hrefLang: 'en',
            href: `${siteUrl}/en${data.url
              .replace(/^\/[a-z]{2}/, '')
              .replace(/^\/en/, '')}`,
          },
        },
        {
          type: 'link',
          props: {
            rel: 'alternate',
            hrefLang: 'ja',
            href: `${siteUrl}/ja${data.url
              .replace(/^\/[a-z]{2}/, '')
              .replace(/^\/ja/, '')}`,
          },
        },
        {
          type: 'link',
          props: {
            rel: 'alternate',
            hrefLang: 'x-default',
            href: `${siteUrl}/en${data.url
              .replace(/^\/[a-z]{2}/, '')
              .replace(/^\/en/, '')}`,
          },
        },
        // Self-referential alternate link (현재 페이지를 가리키는 링크)
        {
          type: 'link',
          props: {
            rel: 'alternate',
            hrefLang: lang,
            href: `${siteUrl}${data.url}`,
          },
        },
      ]),
    },
  };
}

function getDefaultTitle(lang) {
  const titles = {
    ko: '코스모스 타로 - 마음을 읽는 AI 타로카드',
    en: 'Cosmos Tarot - AI Tarot Cards That Read Hearts',
    ja: 'コスモス タロット - 心を読むAIタロットカード',
  };
  return titles[lang] || titles.ko;
}

function getDefaultDescription(lang) {
  const descriptions = {
    ko: 'Cosmos Tarot는 타로 카드를 통해 당신의 내면과 타인의 진심을 더 깊이 이해할 수 있도록 도와주는 앱입니다. 고대부터 전해오는 타로의 지혜와 현대 심리학을 접목하여, 관계 속 진실과 거짓을 분별하는데 도움을 줍니다.',
    en: "Cosmos Tarot is an app that helps you gain deeper insights into your inner self and understand others' true intentions through tarot cards. By combining ancient tarot wisdom with modern psychology, it assists you in discerning truth from deception in relationships.",
    ja: 'Cosmos Tarot（コスモスタロット）は、タロットカードを通じてあなたの内面や他者の本心をより深く理解するためのアプリです。古代から伝わるタロットの叡智と現代心理学を組み合わせ、人間関係における真実と偽りを見分けるお手伝いをします。',
  };
  return descriptions[lang] || descriptions.ko;
}

function getDefaultKeywords(lang) {
  const keywords = {
    ko: '타로, 무료 타로, 타로 ai, 코스모스 타로, 타로 리딩, 온라인 타로, 타로 카드, 마음 읽기, 진실된 감정 이해하기, 연애 타로 리딩, 관계 타로, 심리 타로, 정확한 타로, 연애운, 재물운, 직업운, 미래 예측',
    en: "Tarot, Free Tarot, Tarot AI, Cosmos Tarot, tarot reading, online tarot, tarot cards, reading people's hearts, understanding people's true feelings, love tarot reading, relationship tarot, psychological tarot, accurate tarot, love fortune, financial fortune, career fortune, future prediction",
    ja: 'タロット, タロットカード, 無料タロット, タロットAI, コスモスタロット、タロットリーディング、オンラインタロット、心を読む、真の感情を理解する、恋愛タロットリーディング、関係タロット、心理タロット、正確なタロット、恋愛運、金運、職業運、未来予測',
  };
  return keywords[lang] || keywords.ko;
}
