/**
 * 국가 코드 감지 유틸리티
 * 브라우저 timezone, locale, 언어 정보를 기반으로 국가 코드를 감지합니다.
 */

/**
 * 언어 코드에서 국가 코드 추론 (기본값)
 * @param {string} language - 언어 코드 (ko, en, ja 등)
 * @returns {string} 국가 코드 (KR, US, JP 등)
 */
export const getCountryFromLanguage = language => {
  // 언어 코드를 소문자로 정규화하고 locale 형식 처리 (예: "zh-CN" -> "zh")
  const normalizedLang = language.toLowerCase().split('-')[0].split('_')[0];

  const languageToCountry = {
    ko: 'KR',
    en: 'US',
    ja: 'JP',
    zh: 'CN', // 중국어 (기본값: 중국 본토)
    'zh-cn': 'CN', // 중국어 (중국 본토)
    'zh-tw': 'TW', // 중국어 (대만)
    'zh-hk': 'HK', // 중국어 (홍콩)
    'zh-mo': 'MO', // 중국어 (마카오)
    'zh-hant': 'TW', // 중국어 번체 (대만)
    'zh-hans': 'CN', // 중국어 간체 (중국 본토)
    ms: 'MY', // 말레이어 (기본값: 말레이시아)
    'ms-my': 'MY', // 말레이어 (말레이시아)
    'ms-sg': 'SG', // 말레이어 (싱가포르)
    'ms-bn': 'BN', // 말레이어 (브루나이)
    tl: 'PH', // 타갈로그어 (필리핀)
    'tl-ph': 'PH', // 타갈로그어 (필리핀)
    fil: 'PH', // 필리핀어
    'fil-ph': 'PH', // 필리핀어 (필리핀)
    th: 'TH', // 태국어
    vi: 'VN', // 베트남어
    id: 'ID', // 인도네시아어
    hi: 'IN', // 힌디어
    ar: 'SA', // 아랍어 (기본값: 사우디아라비아)
  };
  return (
    languageToCountry[normalizedLang] ||
    languageToCountry[language.toLowerCase()] ||
    'US'
  );
};

/**
 * 브라우저 timezone과 locale에서 국가 코드 감지
 * @returns {string|null} 국가 코드 또는 null
 */
export const detectCountryFromBrowser = () => {
  try {
    // 1. 브라우저 locale에서 국가 코드 추출 (가장 정확함)
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    // locale 예: "ko-KR", "en-US", "zh-CN", "zh-TW", "ms-MY", "tl-PH", "zh-Hant-TW" 등
    if (locale.includes('-')) {
      const parts = locale.split('-');
      // locale 형식: "언어-국가" 또는 "언어-스크립트-국가"
      // 예: "zh-CN", "zh-Hant-TW", "ms-MY", "en-US"

      // 마지막 부분이 2자리면 국가 코드로 간주
      const lastPart = parts[parts.length - 1];
      if (lastPart && lastPart.length === 2) {
        return lastPart.toUpperCase();
      }

      // 특수 케이스: 언어 코드만으로 국가 추론 (국가 코드가 없는 경우)
      const languageCode = parts[0].toLowerCase();
      const languageCountryMap = {
        zh: 'CN', // 중국어 기본값
        ms: 'MY', // 말레이어 기본값
        tl: 'PH', // 타갈로그어 기본값
        fil: 'PH', // 필리핀어
        th: 'TH', // 태국어
        vi: 'VN', // 베트남어
        id: 'ID', // 인도네시아어
      };
      if (languageCountryMap[languageCode]) {
        return languageCountryMap[languageCode];
      }
    }

    // 2. 타임존에서 국가 추론 (보조 수단, 주요 타임존만)
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // 주요 timezone과 국가 코드 매핑 (자주 사용되는 것만)
    const timezoneToCountry = {
      // 아시아 (주요 국가만)
      'Asia/Seoul': 'KR',
      'Asia/Tokyo': 'JP',
      'Asia/Shanghai': 'CN',
      'Asia/Beijing': 'CN',
      'Asia/Hong_Kong': 'HK',
      'Asia/Taipei': 'TW',
      'Asia/Singapore': 'SG',
      'Asia/Bangkok': 'TH',
      'Asia/Jakarta': 'ID',
      'Asia/Manila': 'PH',
      'Asia/Kuala_Lumpur': 'MY',
      'Asia/Ho_Chi_Minh': 'VN',
      'Asia/Dubai': 'AE',
      'Asia/Riyadh': 'SA',
      'Asia/Kolkata': 'IN',
      'Asia/Delhi': 'IN',
      'Asia/Mumbai': 'IN',
      'Asia/Pyongyang': 'KP',

      // 유럽 (주요 국가만)
      'Europe/London': 'GB',
      'Europe/Paris': 'FR',
      'Europe/Berlin': 'DE',
      'Europe/Rome': 'IT',
      'Europe/Madrid': 'ES',
      'Europe/Amsterdam': 'NL',
      'Europe/Brussels': 'BE',
      'Europe/Vienna': 'AT',
      'Europe/Zurich': 'CH',
      'Europe/Stockholm': 'SE',
      'Europe/Oslo': 'NO',
      'Europe/Copenhagen': 'DK',
      'Europe/Helsinki': 'FI',
      'Europe/Warsaw': 'PL',
      'Europe/Prague': 'CZ',
      'Europe/Budapest': 'HU',
      'Europe/Athens': 'GR',
      'Europe/Lisbon': 'PT',
      'Europe/Dublin': 'IE',
      'Europe/Istanbul': 'TR',
      'Europe/Moscow': 'RU',

      // 아메리카 (주요 국가만)
      'America/New_York': 'US',
      'America/Chicago': 'US',
      'America/Denver': 'US',
      'America/Los_Angeles': 'US',
      'America/Toronto': 'CA',
      'America/Vancouver': 'CA',
      'America/Mexico_City': 'MX',
      'America/Sao_Paulo': 'BR',
      'America/Buenos_Aires': 'AR',

      // 오세아니아
      'Australia/Sydney': 'AU',
      'Australia/Melbourne': 'AU',
      'Pacific/Auckland': 'NZ',

      // 아프리카 (주요 국가만)
      'Africa/Cairo': 'EG',
      'Africa/Johannesburg': 'ZA',
      'Africa/Lagos': 'NG',
      'Africa/Nairobi': 'KE',
    };

    // timezone 매핑에서 직접 찾기
    if (timezoneToCountry[timeZone]) {
      return timezoneToCountry[timeZone];
    }

    // 3. timezone에서 도시 이름으로 국가 추론 (보조 수단)
    const timezoneParts = timeZone.split('/');
    if (timezoneParts.length > 1) {
      const city = timezoneParts[1];

      // 주요 도시별 국가 코드 매핑 (주요 도시만)
      const cityToCountry = {
        // 아시아 (주요 도시만)
        Seoul: 'KR',
        Tokyo: 'JP',
        Shanghai: 'CN',
        Beijing: 'CN',
        Hong_Kong: 'HK',
        Taipei: 'TW',
        Singapore: 'SG',
        Bangkok: 'TH',
        Jakarta: 'ID',
        Manila: 'PH',
        Kuala_Lumpur: 'MY',
        Ho_Chi_Minh: 'VN',
        Dubai: 'AE',
        Riyadh: 'SA',
        Kolkata: 'IN',
        Delhi: 'IN',
        Mumbai: 'IN',
        Pyongyang: 'KP',

        // 유럽 (주요 도시만)
        London: 'GB',
        Paris: 'FR',
        Berlin: 'DE',
        Rome: 'IT',
        Madrid: 'ES',
        Amsterdam: 'NL',
        Brussels: 'BE',
        Vienna: 'AT',
        Zurich: 'CH',
        Stockholm: 'SE',
        Oslo: 'NO',
        Copenhagen: 'DK',
        Helsinki: 'FI',
        Warsaw: 'PL',
        Prague: 'CZ',
        Budapest: 'HU',
        Athens: 'GR',
        Lisbon: 'PT',
        Dublin: 'IE',
        Istanbul: 'TR',
        Moscow: 'RU',

        // 아메리카 (주요 도시만)
        New_York: 'US',
        Chicago: 'US',
        Los_Angeles: 'US',
        Toronto: 'CA',
        Vancouver: 'CA',
        Mexico_City: 'MX',
        Sao_Paulo: 'BR',
        Buenos_Aires: 'AR',

        // 오세아니아
        Sydney: 'AU',
        Melbourne: 'AU',
        Auckland: 'NZ',

        // 아프리카 (주요 도시만)
        Cairo: 'EG',
        Johannesburg: 'ZA',
        Lagos: 'NG',
        Nairobi: 'KE',
      };

      if (cityToCountry[city]) {
        return cityToCountry[city];
      }
    }

    return null; // 감지 실패
  } catch (error) {
    console.warn('Country detection failed:', error);
    return null;
  }
};

/**
 * 국가 코드를 가져오는 통합 함수
 * 우선순위: userInfo.country > 브라우저 감지 > 언어 추론
 *
 * @param {Object} options - 옵션 객체
 * @param {string} [options.userCountry] - userInfo에서 가져온 국가 코드
 * @param {string} [options.language] - 언어 코드 (ko, en, ja 등)
 * @param {string} [options.defaultCountry='US'] - 기본 국가 코드
 * @returns {string} 국가 코드
 */
export const getCountryCode = ({
  userCountry = null,
  language = null,
  defaultCountry = 'US',
} = {}) => {
  // 1. userInfo에서 가져온 국가 코드 우선 사용 (빈 문자열이나 undefined는 제외)
  if (
    userCountry &&
    typeof userCountry === 'string' &&
    userCountry.trim().length > 0
  ) {
    return userCountry.trim().toUpperCase();
  }

  // 2. 브라우저 감지
  const detectedCountry = detectCountryFromBrowser();
  if (detectedCountry) {
    return detectedCountry;
  }

  // 3. 언어에서 추론
  if (language && typeof language === 'string' && language.trim().length > 0) {
    return getCountryFromLanguage(language.trim());
  }

  // 4. 기본값
  return defaultCountry;
};
