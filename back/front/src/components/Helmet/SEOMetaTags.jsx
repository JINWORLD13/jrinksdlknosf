// 개선된 SEOMetaTags.jsx (경로 문제 해결)
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

const SEOMetaTags = ({
  title = '',
  description = '',
  keywords = '',
  image = '',
  imageWidth = '512',
  imageHeight = '512',
  canonicalUrl = '',
  threeJSContent = false,
  structuredData = null,
}) => {
  const { t, i18n } = useTranslation();
  const isNative = Capacitor.isNativePlatform();
  const location = useLocation();
  const siteUrl = import.meta.env.VITE_SERVER_URL;

  // 기본 제목과 설명 설정 (SEO 핵심!)
  const defaultTitle = title?.length > 0 ? title : `${t('meta.title')}`;
  const defaultDescription =
    description?.length > 0 ? description : `${t('meta.description')}`;
  const defaultKeywords =
    keywords?.length > 0 ? keywords : `${t('meta.keywords')}`;

  // URL 경로에 따른 언어 설정
  const getLanguageFromPath = path => {
    const languageMap = { ko: 'ko_KR', en: 'en_US', ja: 'ja_JP' };
    const pathSegments = path.split('/')?.filter(segment => segment);
    const langCode = pathSegments[0];
    return languageMap[langCode] || 'ko_KR';
  };

  const currentLanguage = getLanguageFromPath(location.pathname);

  // AppSpot 체크
  let isAppSpot = false;
  if (typeof window !== 'undefined') {
    isAppSpot = window.location.hostname.includes('.appspot.com');
  }

  const getLocalizedCanonicalUrl = () => {
    if (canonicalUrl) return canonicalUrl;
    return `${siteUrl}${location.pathname || ''}`;
  };

  // 경로 관련 함수들 추가
  const getBasePath = () => {
    // 정적 렌더링시에는 모든 파일이 같은 레벨에 있음
    // react-spa-prerender는 모든 HTML을 루트 또는 얕은 폴더에 생성
    if (typeof window === 'undefined') {
      // 서버사이드에서는 절대경로 사용
      return '';
    }

    // react-spa-prerender 파일 구조:
    // /en -> dist/en.html (루트 레벨)
    // /en/etc -> dist/en/etc.html (1단계)
    // /en/etc/tarot/learning -> dist/en/etc/tarot/learning.html (3단계)
    const pathSegments = location.pathname
      .split('/')
      ?.filter(segment => segment);

    // 실제 파일 깊이 = pathSegments.length - 1
    // 왜냐하면 /en은 en.html로 루트에 생성되므로
    const actualDepth = Math.max(0, pathSegments.length - 1);
    return actualDepth > 0 ? '../'.repeat(actualDepth) : './';
  };

  const getAssetPath = path => {
    // 개발환경이나 루트 경로에서는 절대경로
    if (location.pathname === '/' || import.meta.env.DEV) {
      return path;
    }
    // 정적 렌더링된 하위 경로에서는 상대경로
    return `${getBasePath()}${path.startsWith('/') ? path.slice(1) : path}`;
  };

  // 구조화된 데이터 기본값 설정
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': ['WebSite', 'WebApplication'],
    name: `${t(`meta.name`)}`,
    url: siteUrl,
    description: defaultDescription,
    author: { '@type': 'Organization', name: 'JINWORLD' },
    inLanguage: i18n.language || 'ko',
    availableLanguage: ['ko', 'en', 'ja'],
    applicationCategory: 'Tarot AI Application',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      bestRating: '5',
      worstRating: '1',
      ratingCount: '1000',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KRW',
      price: '0',
      description: `${t(`meta.title`)}`,
    },
  };

  return (
    <Helmet
      htmlAttributes={{
        lang: i18n.language || 'ko',
      }}
      meta={[
        { 'http-equiv': 'content-language', content: i18n.language || 'ko' },
      ]}
    >
      {/* 필수 메타 태그들 */}
      <title>{defaultTitle}</title>

      {/* 로봇 크롤링 설정 */}
      {isAppSpot ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* 필수 설명 태그 */}
      <meta name="description" content={defaultDescription} />
      <meta name="keywords" content={defaultKeywords} />

      {/* 추가 SEO 메타 태그 */}
      <meta name="author" content="JINWORLD" />
      <meta name="generator" content="React" />
      <meta name="rating" content="general" />
      <meta name="revisit-after" content="7 days" />

      {/* 경로 관련 태그들 추가 (index.html에서 이동) */}
      <link
        rel="icon"
        type="image/x-icon"
        href={getAssetPath('/assets/favicon.ico')}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={getAssetPath(
          '/assets/cosmos_tarot_favicon/apple-icon-180x180.png'
        )}
      />
      {/* <link rel="manifest" href={getAssetPath('/manifest.webmanifest')} /> */}

      {/* 폰트 프리로드 */}
      <link
        rel="prefetch"
        href={getAssetPath('/assets/font/Dongle/Dongle-Regular.ttf')}
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />
      <link
        rel="prefetch"
        href={getAssetPath('/assets/font/Kosugi_Maru/KosugiMaru-Regular.ttf')}
        as="font"
        type="font/ttf"
        crossOrigin="anonymous"
      />

      {/* Three.js 전용 메타태그 */}
      {threeJSContent && (
        <>
          <meta name="content-type" content="interactive-3d" />
          <meta name="format-detection" content="telephone=no" />
        </>
      )}

      {/* Open Graph 태그 */}
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:locale" content={currentLanguage} />
      <meta property="og:site_name" content={t('meta.title')} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={getLocalizedCanonicalUrl()} />
      <meta
        property="og:image"
        content={
          image
            ? image.startsWith('http')
              ? image
              : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
            : `${siteUrl}/assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png`
        }
      />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content="Cosmos Tarot Logo" />

      {/* Twitter 카드 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      <meta
        name="twitter:image"
        content={
          image
            ? image.startsWith('http')
              ? image
              : `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`
            : `${siteUrl}/assets/cosmos_tarot_favicon/cosmos_tarot-512x512.png`
        }
      />
      <meta name="twitter:site" content="@cosmos_tarot" />

      {/* Canonical URL은 정적 HTML(inject-meta-tags.js)에서 처리하므로 제거 (중복 방지) */}
      {/* JavaScript 없이 크롤링할 때를 위해 정적 HTML에 canonical link가 이미 포함되어 있음 */}

      {/* 구조화된 데이터 (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>

      {/* 웹 전용 태그 */}
      {!isNative && (
        <>
          {/* 앱 관련 메타 태그 */}
          <meta name="application-name" content={t('meta.name')} />
          <meta name="theme-color" content="#800080" />
          <meta name="format-detection" content="telephone=no" />

          {/* iOS 앱 설정 */}
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-title" content={t('meta.name')} />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />

          {/* Microsoft 설정 */}
          <meta
            name="msapplication-window"
            content="width=device-width;height=device-height"
          />
          <meta name="msapplication-tooltip" content={t('meta.title')} />
        </>
      )}

      {/* 다국어 지원 태그 */}
      <link
        rel="alternate"
        hrefLang="ko"
        href={`${siteUrl}/ko${location.pathname
          .replace(/^\/[a-z]{2}/, '')
          .replace(/^\/ko/, '')}`}
      />
      <link
        rel="alternate"
        hrefLang="en"
        href={`${siteUrl}/en${location.pathname
          .replace(/^\/[a-z]{2}/, '')
          .replace(/^\/en/, '')}`}
      />
      <link
        rel="alternate"
        hrefLang="ja"
        href={`${siteUrl}/ja${location.pathname
          .replace(/^\/[a-z]{2}/, '')
          .replace(/^\/ja/, '')}`}
      />
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${siteUrl}/en${location.pathname
          .replace(/^\/[a-z]{2}/, '')
          .replace(/^\/en/, '')}`}
      />
    </Helmet>
  );
};

SEOMetaTags.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  imageWidth: PropTypes.string,
  imageHeight: PropTypes.string,
  canonicalUrl: PropTypes.string,
  threeJSContent: PropTypes.bool,
  structuredData: PropTypes.object,
};

export default SEOMetaTags;
// Cosmos Tarot는 타로 카드를 통해 당신의 내면과 타인의 진심을 더 깊이 이해할 수 있도록 도와주는 앱입니다. 고대부터 전해오는 타로의 지혜와 현대 심리학을 접목하여, 관계 속 진실과 거짓을 분별하는데 도움을 줍니다. 수만 번의 테스트를 거친 결과 평균 70%의 신뢰도를 보여주었으며, 여러분의 직관력을 높이고 더 현명한 선택을 하는데 든든한 조언자가 될 것입니다. Cosmos Tarot는 타로카드 스프레드 서비스(카드만 사용)와 타로카드 리딩 서비스(카드와 해석 서비스 사용)를 제공합니다. Cosmos Tarot는 앱 사용자들이 알고 싶어하는 사람들의 생각(지적인 측면, 사실적 내용)을 정확히 읽을 수는 없지만, 그들의 마음(감정적 측면, 정서적 내용)은 읽을 수 있습니다. 다만, 질문의 대상과 관련 인물/사물자는 서로 아는 경우에 한해서 서로에 대한 질문이 가능하다는 점 유의바랍니다. 마음을 기반으로, Cosmos Tarot는 미래의 감정을 읽고 다양한 분야에 대한 운세 리딩을 제공합니다. Cosmos Tarot는 리딩 결과를 바탕으로 메이저 카드와 마이너 카드별로 통계를 그래프로 분석해 제공합니다. 리딩 결과는 최대 3개월 동안 유지되며, 사용자가 원할 경우 마이페이지의 상담 기록 페이지에서 언제든지 삭제할 수 있습니다. 스피드타로, 보통타로, 심층타로, 진지타로 서비스를 이용할 수 있으며, 보통, 심층, 진지 타로에서만 이용권을 통해 타로 리딩 서비스를 이용할 수 있습니다. 추가로, 보통타로에는 광고 모드가 포함되어 있어 이용권으로 콘텐츠를 이용할지 광고 시청으로 콘텐츠를 이용할지 선택할 수 있습니다.
// 타로, 무료 타로, 타로 ai, 바보, 마법사, 여사제, 여제, 황제, 교황, 연인들, 전차, 힘, 은둔자, 운명의 수레바퀴, 정의, 매달린 사람, 죽음, 절제, 악마, 탑, 별, 달, 태양, 심판, 세계, 완드 에이스, 완드 2, 완드 3, 완드 4, 완드 5, 완드 6, 완드 7, 완드 8, 완드 9, 완드 10, 완드 페이지, 완드 나이트, 완드 퀸, 완드 킹, 컵 에이스, 컵 2, 컵 3, 컵 4, 컵 5, 컵 6, 컵 7, 컵 8, 컵 9, 컵 10, 컵 페이지, 컵 나이트, 컵 퀸, 컵 킹, 소드 에이스, 소드 2, 소드 3, 소드 4, 소드 5, 소드 6, 소드 7, 소드 8, 소드 9, 소드 10, 소드 페이지, 소드 나이트, 소드 퀸, 소드 킹, 펜타클 에이스, 펜타클 2, 펜타클 3, 펜타클 4, 펜타클 5, 펜타클 6, 펜타클 7, 펜타클 8, 펜타클 9, 펜타클 10, 펜타클 페이지, 펜타클 나이트, 펜타클 퀸, 펜타클 킹, 코스모스 타로, 타로 리딩, 온라인 타로, 타로 카드, 마음 읽기, 진실된 감정 이해하기, 거짓말 탐지기, 진실 탐지기, 기만 감지, 진실 검증, 정직성 테스트, 거짓말 탐지 테스트, 연애 타로 리딩, 관계 타로, 진실 탐지, 마음 읽기, 심리 타로, 마음 읽기 타로, 정확한 타로, 상세 타로 리딩, 전문 타로 리딩, 타로 분석, 무료 타로 리딩, 연애운, 재물운, 직업운, 미래 예측, 인생 안내, 타로 상담, 타로 해석, 점술, 점성술, 영적 안내, 관계 조언, 데일리 타로, 개인 안내, 영적 읽기, 라이프 코칭, 운명 읽기, 소울메이트 타로, 의사결정, 미래 통찰, 내면의 지혜, 감정 안내, 타로 카드 의미, 연애 궁합, 관계 분석, 진실 찾기, 직관적 읽기, 운명 카드, 미래 예언, 영적 조언자, 심령 읽기, 에너지 읽기, 오라 읽기, 차크라 읽기, 명상 가이드, 마음챙김 도구, 영적 발전, 개인 성장, 자아 발견, 전생 읽기, 업보 읽기, 엔젤 카드, 오라클 카드, 관계 상담, 인생 경로 읽기, 경력 안내, 사업 결정, 재정 조언, 연애 조언, 데이트 조언, 결혼 궁합, 관계 치유, 감정 치유, 영적 치유, 에너지 치유, 진정한 자아, 높은 자아, 내면의 진실, 영혼의 목적, 인생의 목적, 신성한 안내, 영적 여정, 신비로운 안내, 우주의 지혜, 보편적 진리, 성스러운 지식, 고대의 지혜, 현대 점술, 일일 안내, 주간 읽기, 월간 예측, 연간 예측, 예/아니오 타로, 선택 타로, 결정 타로, 과거 현재 미래, 영적 연결, 트윈 플레임 읽기, 카르마 관계, 영혼 연결, 관계 역학, 성격 읽기, 성격 분석, 행동 분석, 심리적 통찰, 감성 지능, 관계 심리학, 인간 행동, 대인 역학, 사회적 상호작용, 소통 가이드, 갈등 해결, 관계 개선, 개인 변화, 인생 변화, 영적 변화, 감정의 자유, 개인 역량 강화, 자기 이해, 내면의 평화, 정신적 명료함, 감정적 균형, 영적 균형, 인생 균형, 전체적 안내, 직관적 안내, 심령적 통찰, 영적 통찰, 신성한 통찰, 우주적 안내, 보편적 안내, 영혼 안내, 마음 안내, 정신 안내, 영 안내, 감정적 지혜, 인생 지혜, 관계 지혜, 실용적 조언, 실행 가능한 통찰, 실시간 안내, 즉석 읽기, 빠른 답변, 깊은 통찰, 심오한 이해, 진정한 연결, 진실된 읽기, 신뢰할 수 있는 안내, 신뢰할 수 있는 조언, 경험 많은 리더, 전문적 통찰, 전문가 안내, 전문 읽기, 개인화된 읽기, 맞춤 안내, 독특한 통찰, 개별 조언, 상황별 맞춤, 맥락 인식, 실생활 적용, 실용적 지혜, 일상 지원, 감정 지원, 영적 지원, 생활 지원, 결정 지원, 관계 지원, 개인 지원, 전문적 지원, 안내 시스템, 진실 시스템, 이해 시스템, 통찰 시스템, 지혜 시스템

// Cosmos Tarot(コスモスタロット)は、タロットカードを通じてあなたの内面や他者の本心をより深く理解するためのアプリです。古代から伝わるタロットの叡智と現代心理学を組み合わせ、人間関係における真実と偽りを見分けるお手伝いをします。数万回のテストで平均70%の信頼性を実証しており、直感力を高め、より賢明な選択をするための頼もしいアドバイザーとなることでしょう。Cosmos Tarot(コスモスタロット)はタロットカードスプレッドサービス（カードのみ使用）とタロットカードリーディングサービス（カードと解釈サービスを使用）を提供しています。Cosmos Tarot(コスモスタロット)はアプリユーザーが知りたい人の思考（知的側面、事実的内容）を正確に読み取ることはできませんが、その人の心（感情的側面、感情的内容）を読み取ることができます。ただし、質問の対象と関連人物/物が互いに知り合いである場合に限り、お互いについての質問が可能であることにご注意ください。心に基づいて、Cosmos Tarot(コスモスタロット)は未来の感情を読み取り、様々な分野における占いの結果を提供します。Cosmos Tarot(コスモスタロット)はリーディングの結果を統計的に分析し、メジャーカードとマイナーカードの両方についてグラフを提供します。リーディングの結果は最大3ヶ月間保存され、ユーザーが希望する場合はマイページの相談履歴ページからいつでも削除できます。サービスは速タロ、通常タロ、深層タロ、真剣タロで利用可能です。チケットを使用したタロットリーディングサービスは通常タロ、深層タロ、真剣タロでのみ利用可能です。さらに、通常タロには広告モードが含まれており、アプリユーザーはチケットを使用するか広告を視聴するかを選択してコンテンツにアクセスできます。
// タロット, タロットカード, 無料タロット, タロットAI , 2025年占い, 2025年運勢, 占い2025, しいたけ占い2025, 恋みくじ, 内心, 鈴蘭の剣, 鈴蘭の剣タロット, aiタロット, タロットカード意味一覧表, りゅうぎんタロット, 愚者, 魔術師, 女教皇, 女帝, 皇帝, 法王, 恋人たち, 戦車, 力, 隠者, 運命の輪, 正義, 吊るされた男, 死神, 節制, 悪魔, 塔, 星, 月, 太陽, 審判, 世界, ワンドのエース, ワンドの2, ワンドの3, ワンドの4, ワンドの5, ワンドの6, ワンドの7, ワンドの8, ワンドの9, ワンドの10, ワンドのペイジ, ワンドのナイト, ワンドのクイーン, ワンドのキング, カップのエース, カップの2, カップの3, カップの4, カップの5, カップの6, カップの7, カップの8, カップの9, カップの10, カップのペイジ, カップのナイト, カップのクイーン, カップのキング, ソードのエース, ソードの2, ソードの3, ソードの4, ソードの5, ソードの6, ソードの7, ソードの8, ソードの9, ソードの10, ソードのペイジ, ソードのナイト, ソードのクイーン, ソードのキング, ペンタクルのエース, ペンタクルの2, ペンタクルの3, ペンタクルの4, ペンタクルの5, ペンタクルの6, ペンタクルの7, ペンタクルの8, ペンタクルの9, ペンタクルの10, ペンタクルのペイジ, ペンタクルのナイト, ペンタクルのクイーン, ペンタクルのキング, 今日の占い, 今日の運勢, 占い今日, しいたけ占い今日, 今週の占い, 今週の運勢, 占い今週, しいたけ占い今週, タロットカード意味一覧表, 大晦日, コスモスタロット、タロットリーディング、オンラインタロット、心を読む、真の感情を理解する、嘘発見器、真実検出器、欺瞞検知、真実検証、正直さテスト、嘘発見テスト、恋愛タロットリーディング、関係タロット、真実検知、心読み、心理タロット、心読みタロット、正確なタロット、詳細タロットリーディング、プロフェッショナルタロットリーディング、タロット分析、無料タロットリーディング、恋愛運、金運、職業運、未来予測、人生ガイダンス、タロット相談、タロット解釈、占術、占い、スピリチュアルガイダンス、関係アドバイス、デイリータロット、個人ガイダンス、スピリチュアルリーディング、ライフコーチング、運命リーディング、ソウルメイトタロット、意思決定、未来洞察、内なる知恵、感情ガイダンス、タロットカードの意味、相性占い、関係分析、真実発見、直感的リーディング、運命カード、未来予言、スピリチュアルアドバイザー、サイキックリーディング、エネルギーリーディング、オーラリーディング、チャクラリーディング、瞑想ガイド、マインドフルネスツール、スピリチュアル開発、個人成長、自己発見、前世リーディング、カルマリーディング、エンジェルカード、オラクルカード、関係カウンセリング、人生経路リーディング、キャリアガイダンス、ビジネス決断、財務アドバイス、恋愛アドバイス、デートアドバイス、結婚相性、関係ヒーリング、感情ヒーリング、スピリチュアルヒーリング、エネルギーヒーリング、本来の自己、高次の自己、内なる真実、魂の目的、人生の目的、神聖なる導き、スピリチュアルな旅、神秘的ガイダンス、宇宙の知恵、普遍的真理、神聖な知識、古代の知恵、現代占術、日々のガイダンス、週間リーディング、月間予測、年間予測、イエス・ノータロット、選択タロット、決断タロット、過去現在未来、スピリチュアルコネクション、ツインフレームリーディング、カルマ関係、魂のつながり、関係性ダイナミクス、性格リーディング、性格分析、行動分析、心理的洞察、感情知性、関係心理学、人間行動、対人関係力学、社会的相互作用、コミュニケーションガイド、対立解決、関係改善、個人の変容、人生の変容、スピリチュアルな変容、感情の自由、個人の力の強化、自己理解、内なる平和、精神的明晰さ、感情的バランス、スピリチュアルバランス、人生のバランス、全体的ガイダンス、直感的ガイダンス、サイキック洞察、スピリチュアル洞察、神聖な洞察、宇宙的ガイダンス、普遍的ガイダンス、魂のガイダンス、心のガイダンス、精神のガイダンス、スピリットガイダンス、感情的知恵、人生の知恵、関係の知恵、実践的アドバイス、実行可能な洞察、リアルタイムガイダンス、即時リーディング、クイックアンサー、深い洞察、深い理解、真のつながり、本物のリーディング、信頼できるガイダンス、信頼できるアドバイス、経験豊富なリーダー、専門的洞察、専門家ガイダンス、専門リーディング、パーソナライズドリーディング、カスタムガイダンス、ユニークな洞察、個別アドバイス、状況別対応、文脈認識、実生活応用、実践的知恵、日常サポート、感情サポート、スピリチュアルサポート、生活サポート、決断サポート、関係サポート、個人サポート、専門的サポート、ガイダンスシステム、真実システム、理解システム、洞察システム、知恵システム

// Cosmos Tarot is an app that helps you gain deeper insights into your inner self and understand others' true intentions through tarot cards. By combining ancient tarot wisdom with modern psychology, it assists you in discerning truth from deception in relationships. With an average reliability rate of 70% based on tens of thousands of tests, this app will be your trusted companion in enhancing intuition and making wiser life choices. Cosmos Tarot offers tarot card spread services (using cards only) and tarot card reading services (using cards and interpretation services). While Cosmos Tarot cannot accurately read the thoughts (intellectual aspects, factual content) of people that app users want to know about, it can read their hearts (emotional aspects, emotional content). However, please note that questions about each other are only possible when the target of the question and the object of the target know each other. Based on the heart, Cosmos Tarot reads future emotions and provides fortune-telling readings in various fields. Cosmos Tarot analyzes the results of the readings statistically, providing graphs for both major and minor cards. The results of the readings are maintained for a maximum of 3 months and can be deleted at any time by the user from the consultation history page in My Page if desired. Services are available as Speedy, Normal, Deep , and Serious Tarot Mode. Tarot reading services through vouchers are only available in Normal, Deep, and Serious Tarot Mode. Additionally, Normal Tarot Mode includes an ad mode, allowing app users to decide whether to access content through vouchers or by watching advertisements.
// Tarot, Free Tarot, Tarot AI, Cosmos Tarot, tarot reading, online tarot, tarot cards, reading people's hearts, understanding people's true feelings, lie detector, truth detector, deception detection, truth verification, honesty test, lie detection test, love tarot reading, relationship tarot, truth detection, heart reading, psychological tarot, mind reading tarot, accurate tarot, detailed tarot reading, professional tarot reading, tarot analysis, free tarot reading, love fortune, financial fortune, career fortune, future prediction, life guidance, tarot consultation, tarot interpretation, divination, fortune telling, spiritual guidance, relationship advice, daily tarot, personal guidance, spiritual reading, life coaching, destiny reading, soul mate tarot, decision making, future insight, inner wisdom, emotional guidance, tarot card meanings, love compatibility, relationship analysis, truth finding, intuitive reading, destiny cards, future telling, spiritual advisor, psychic reading, energy reading, aura reading, chakra reading, meditation guide, mindfulness tool, spiritual development, personal growth, self discovery, past life reading, karmic reading, angel cards, oracle cards, relationship counseling, life path reading, career guidance, business decisions, financial advice, love advice, dating advice, marriage compatibility, relationship healing, emotional healing, spiritual healing, energy healing, authentic self, higher self, inner truth, soul purpose, life purpose, divine guidance, spiritual journey, mystical guidance, cosmic wisdom, universal truth, sacred knowledge, ancient wisdom, modern divination, daily guidance, weekly reading, monthly forecast, yearly prediction, yes no tarot, choice tarot, decision tarot, past present future, spiritual connection, twin flame reading, karmic relationship, soul connection, relationship dynamics, personality reading, character analysis, behavioral analysis, psychological insight, emotional intelligence, relationship psychology, human behavior, interpersonal dynamics, social interaction, communication guide, conflict resolution, relationship improvement, personal transformation, life transformation, spiritual transformation, emotional freedom, personal empowerment, self understanding, inner peace, mental clarity, emotional balance, spiritual balance, life balance, holistic guidance, intuitive guidance, psychic insight, spiritual insight, divine insight, cosmic guidance, universal guidance, soul guidance, heart guidance, mind guidance, spirit guidance, emotional wisdom, life wisdom, relationship wisdom, practical advice, actionable insight, real-time guidance, instant reading, quick answers, deep insight, profound understanding, genuine connection, authentic reading, reliable guidance, trustworthy advice, experienced reader, professional insight, expert guidance, specialized reading, personalized reading, custom guidance, unique insight, individual advice, situation specific, context aware, real life application, practical wisdom, daily support, emotional support, spiritual support, life support, decision support, relationship support, personal support, professional support, guidance system, truth system, understanding system, insight system, wisdom system
