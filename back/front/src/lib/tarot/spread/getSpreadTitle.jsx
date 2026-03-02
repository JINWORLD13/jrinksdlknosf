// 스프레드 타이틀 다국어 설정 객체
const SPREAD_TITLES = {
  100: {
    en: 'Single Card(General)',
    ko: '싱글 카드(일반 리딩)',
    ja: 'シングルカード(一般リーディング)',
  },
  200: {
    en: 'Two Cards(General)',
    ko: '두 장의 카드(일반 리딩)',
    ja: 'ツーカード(一般リーディング)',
  },
  201: {
    en: 'Binary choice(Two Cards)',
    ko: '양자택일(두 장의 카드)',
    ja: '二者択一(ツーカード)',
  },
  300: {
    en: 'Three Cards(General)',
    ko: '세 장의 카드(일반 리딩)',
    ja: 'スリーカード(一般リーディング)',
  },
  301: {
    en: 'Past, Present, Future(Three Cards)',
    ko: '과거, 현재, 미래(세 장의 카드)',
    ja: '過去、現在、未来(スリーカード)',
  },
  302: {
    en: 'Problem solving(Three Cards)',
    ko: '문제 해결(세 장의 카드)',
    ja: '問題解決(スリーカード)',
  },
  303: {
    en: 'Morning, Daytime, Evening(Three Cards)',
    ko: '아침, 낮, 저녁(세 장의 카드)',
    ja: '朝、昼、夕方(スリーカード)',
  },
  304: {
    en: 'Three-way choice(Three Cards)',
    ko: '삼자택일(세 장의 카드)',
    ja: '三者択一(スリーカード)',
  },
  400: {
    en: 'Four Cards(General)',
    ko: '네 장의 카드(일반 리딩)',
    ja: 'フォーカード(一般リーディング)',
  },
  501: {
    en: 'Relationship Analysis(Five Cards)',
    ko: '관계 분석(다섯 장의 카드)',
    ja: '関係分析(ファイブカード)',
  },
  600: {
    en: '6-day flow(Six Cards)',
    ko: '6일간 흐름(여섯 장의 카드)',
    ja: '六日間の流れ(シックスカード)',
  },
  601: {
    en: '6-week flow(Six Cards)',
    ko: '6주간 흐름(여섯 장의 카드)',
    ja: '六週間の流れ(シックスカード)',
  },
  602: {
    en: '6-month flow(Six Cards)',
    ko: '6개월 흐름(여섯 장의 카드)',
    ja: '六ヶ月の流れ(シックスカード)',
  },
  1000: {
    en: 'Celtic Cross(Ten Cards)',
    ko: '켈틱 크로스(열 장의 카드)',
    ja: 'ケルティッククロス(テンカード)',
  },
};

/**
 * 스프레드 번호와 언어 코드에 따른 스프레드 제목을 반환하는 함수
 * @param {Object} spreadInfo - 스프레드 정보 객체
 * @param {string} language - 언어 코드 ('en', 'ko', 'ja')
 * @returns {string} 해당 언어의 스프레드 제목
 */
export function getSpreadTitle(spreadInfo, language) {
  const spreadNumber = spreadInfo.spreadListNumber;
  const titles = SPREAD_TITLES[spreadNumber];

  if (!titles) {
    return ''; // 또는 기본값 설정
  }

  return titles[language] || titles['en']; // 해당 언어가 없을 경우 영어를 기본값으로
}

// 사용 예시
