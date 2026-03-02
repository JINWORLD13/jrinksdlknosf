export const isBot = () => {
  const userAgent = navigator.userAgent.toLowerCase();
    const botPatterns = [
      'bot',
      'robot',
      'robots',
      // 검색엔진 봇
      'googlebot',        // 구글 검색
      'bingbot',         // 빙 검색
      'yandexbot',       // 얀덱스
      'naverbot',        // 네이버
      'daumoa',          // 다음
      'baiduspider',     // 바이두
      
      // 구글 관련 봇
      'mediapartners-google', // 구글 애드센스
      'adsbot-google',       // 구글 애드워즈
      'apis-google',         // 구글 API
      'feedfetcher-google',  // 구글 피드
  
      // 소셜 미디어 봇
      'facebookexternalhit',  // 페이스북
      'twitterbot',           // 트위터
      'linkedinbot',          // 링크드인
      
      // 기타 분석 봇
      'ahrefsbot',           // Ahrefs
      'mj12bot',             // Majestic
      'seznambot',           // Seznam
      'semrushbot',          // SEMrush
      'dotbot',              // OpenSiteExplorer
      'applebot',            // 애플
      'slurp'                // Yahoo
    ];
    return botPatterns.some(bot => userAgent.includes(bot));
  };