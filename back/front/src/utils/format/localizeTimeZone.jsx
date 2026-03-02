const timezoneMap = {
  ko: {
    // 아시아
    'Asia/Seoul': '한국 시간 기준',
    'Asia/Tokyo': '일본 시간 기준',
    'Asia/Singapore': '싱가포르 시간 기준',
    'Asia/Kuala_Lumpur': '말레이시아 쿠알라룸푸르 시간 기준',
    'Asia/Kolkata': '인도 뉴델리 시간 기준',

    // 북미
    'America/New_York': '미국 뉴욕 시간 기준',
    'America/Chicago': '미국 시카고 시간 기준',
    'America/Los_Angeles': '미국 로스앤젤레스 시간 기준',
    'America/Anchorage': '미국 알레스카 시간 기준',
    'America/Denver': '미국 덴버 시간 기준',
    'America/Phoenix': '미국 애리조나주 시간 기준',
    'Pacific/Honolulu': '미국 하와이 시간 기준',

    // 유럽
    'Europe/Paris': '프랑스 파리 시간 기준',
    'Europe/London': '영국 런던 시간 기준',
    'Europe/Berlin': '독일 베를린 시간 기준',
    'Europe/Rome': '이탈리아 로마 시간 기준',
    'Europe/Madrid': '스페인 마드리드 시간 기준',
  },
  ja: {
    // アジア
    'Asia/Seoul': '韓国時間基準',
    'Asia/Tokyo': '日本時間基準',
    'Asia/Singapore': 'シンガポール時間基準',
    'Asia/Kuala_Lumpur': 'マレーシア・クアラルンプール時間基準',
    'Asia/Kolkata': 'インド・ニューデリー時間基準',

    // 北米
    'America/New_York': 'アメリカ・ニューヨーク時間基準',
    'America/Chicago': 'アメリカ・シカゴ時間基準',
    'America/Los_Angeles': 'アメリカ・ロサンゼルス時間基準',
    'America/Anchorage': 'アメリカ・アラスカ時間基準',
    'America/Denver': 'アメリカ・デンバー時間基準',
    'America/Phoenix': 'アメリカ・アリゾナ州時間基準',
    'Pacific/Honolulu': 'アメリカ・ハワイ時間基準',

    // ヨーロッパ
    'Europe/Paris': 'フランス・パリ時間基準',
    'Europe/London': 'イギリス・ロンドン時間基準',
    'Europe/Berlin': 'ドイツ・ベルリン時間基準',
    'Europe/Rome': 'イタリア・ローマ時間基準',
    'Europe/Madrid': 'スペイン・マドリード時間基準',
  },
  en: {
    // Asia
    'Asia/Seoul': 'Korea Standard Time',
    'Asia/Tokyo': 'Japan Standard Time',
    'Asia/Singapore': 'Singapore Time',
    'Asia/Kuala_Lumpur': 'Malaysia Time',
    'Asia/Kolkata': 'India Standard Time',

    // North America
    'America/New_York': 'Eastern Time',
    'America/Chicago': 'Central Time',
    'America/Los_Angeles': 'Pacific Time',
    'America/Anchorage': 'Alaska Time',
    'America/Denver': 'Mountain Time',
    'America/Phoenix': 'Arizona Time',
    'Pacific/Honolulu': 'Hawaii Time',

    // Europe
    'Europe/Paris': 'European Paris Time',
    'Europe/London': 'European London Time',
    'Europe/Berlin': 'European Berlin Time',
    'Europe/Rome': 'European Rome Time',
    'Europe/Madrid': 'European Madrid Time',
  },
};

/**
 * 사용자의 타임존을 현지화된 문자열로 변환합니다.
 * @param {string} language - 사용할 언어 코드 ('ko', 'ja', 또는 'en')
 * @param {string} [timezone] - 변환할 타임존 (기본값: 현재 시스템의 타임존)
 * @returns {string} - 현지화된 타임존 문자열
 */
export function localizeTimeZone(
  language,
  timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
) {
  // 지원되는 언어가 아닌 경우 또는 en인 경우 timezone 그대로 반환
  if (!timezoneMap[language]) {
    return timezone;
  }

  return timezoneMap[language][timezone] || timezone;
}

// 사용 예시:
