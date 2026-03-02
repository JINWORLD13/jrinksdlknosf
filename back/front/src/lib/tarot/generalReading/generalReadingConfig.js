/**
 * 제너럴 리딩: 미리 준비된 질문(연애/직장/금전/인간관계/운세) + 미리 작성한 해석 저장 후 보여주기
 * 유튜브 10만 조회수형 주제 기준
 *
 * 75세트 = 질문 15 × 스프레드 5 (time_3, solution_3, relationship_5, cross_4, insight_3)
 * - 상세해석: generalReadingInterpretations READINGS_BY_QUESTION_AND_SPREAD (75개 고유)
 * - 직접 답변: generalReading75Data DIRECT_ANSWER_BY_QUESTION_AND_SPREAD (75개 고유)
 * - 추가 통찰: generalReading75Data ADDITIONAL_INSIGHTS_BY_QUESTION_AND_SPREAD (75개 고유)
 */

import { READINGS_BY_QUESTION_AND_SPREAD } from './generalReadingInterpretations';
import { DIRECT_ANSWER_BY_QUESTION_AND_SPREAD, ADDITIONAL_INSIGHTS_BY_QUESTION_AND_SPREAD } from './generalReading75Data';

/** 미리 준비된 질문 목록 — 테마별 3개씩 (연애·직장·금전·인간관계·운세) */
export const GENERAL_READING_QUESTIONS = {
  en: [
    { id: 'love_1', text: "My ex's true feelings about me — What do they really think?" },
    { id: 'love_2', text: 'Is the person I\'m seeing now my true match?' },
    { id: 'love_3', text: 'How will this situationship or relationship unfold?' },
    { id: 'career_1', text: 'When to change jobs or get promoted — and in what direction?' },
    { id: 'career_2', text: 'How do my boss and coworkers really see me?' },
    { id: 'career_3', text: 'My work luck — what fortune awaits me at work?' },
    { id: 'money_1', text: 'When and how will money come in?' },
    { id: 'money_2', text: 'How should I invest or save right now?' },
    { id: 'money_3', text: 'My money luck — how to avoid unnecessary spending?' },
    { id: 'relationship_1', text: 'What do people around me really think of me?' },
    { id: 'relationship_2', text: 'Who should I avoid in my relationships? What to watch out for?' },
    { id: 'relationship_3', text: 'Who are my true friends and allies?' },
    { id: 'fortune_1', text: 'My fortune this month and this year overall' },
    { id: 'fortune_2', text: 'Hidden opportunities for me right now' },
    { id: 'fortune_3', text: 'What to avoid and what to be careful about' },
  ],
  ko: [
    { id: 'love_1', text: '전 애인의 나에 대한 속마음' },
    { id: 'love_2', text: '지금 만나는 사람, 진짜 인연일까?' },
    { id: 'love_3', text: '썸·연애 앞으로 전개와 결말' },
    { id: 'career_1', text: '이직·승진 시기와 나에게 맞는 방향' },
    { id: 'career_2', text: '상사·동료가 나를 어떻게 보는지' },
    { id: 'career_3', text: '내 일운·직장에서의 행운' },
    { id: 'money_1', text: '돈 들어올 시기·방법' },
    { id: 'money_2', text: '지금 투자·저축 어떻게 할까' },
    { id: 'money_3', text: '금전운 전반·불필요한 지출 피하기' },
    { id: 'relationship_1', text: '주변 사람들이 나를 어떻게 생각하는지' },
    { id: 'relationship_2', text: '인간관계에서 피해야 할 사람·주의점' },
    { id: 'relationship_3', text: '진짜 친구·내 편은 누구?' },
    { id: 'fortune_1', text: '이번 달·올해 전체 운세' },
    { id: 'fortune_2', text: '지금 시기 나에게 숨은 기회' },
    { id: 'fortune_3', text: '피해야 할 일·조심할 점' },
  ],
  ja: [
    { id: 'love_1', text: '元恋人の本音 — 私のことをどう思っている？' },
    { id: 'love_2', text: '今付き合っている人、本当の運命の人？' },
    { id: 'love_3', text: '付き合い・恋愛のこれからの展開と結末' },
    { id: 'career_1', text: '転職・昇進の時期と自分に合う方向' },
    { id: 'career_2', text: '上司・同僚は私をどう見ている？' },
    { id: 'career_3', text: '仕事運・職場での幸運' },
    { id: 'money_1', text: 'お金が入る時期・方法' },
    { id: 'money_2', text: '今、投資・貯金はどうする？' },
    { id: 'money_3', text: '金運全般・無駄遣いを避けるには' },
    { id: 'relationship_1', text: '周りの人は私をどう思っている？' },
    { id: 'relationship_2', text: '人間関係で避けるべき人・注意点' },
    { id: 'relationship_3', text: '本当の友達・味方は誰？' },
    { id: 'fortune_1', text: '今月・今年の全体運勢' },
    { id: 'fortune_2', text: '今の時期、私に隠れたチャンス' },
    { id: 'fortune_3', text: '避けるべきこと・注意すること' },
  ],
};

/**
 * 질문당 5가지 스프레드 — 사용자가 선택 가능
 * - time_3: 과거·현재·미래 3장
 * - solution_3: 문제·원인·해결 3장
 * - relationship_5: 관계 5장 (그 사람의 마음/미련/속마음/영향/전망)
 * - cross_4: 크로스 4장 (현재 상황/도전/과거 영향/앞으로의 방향)
 * - insight_3: 통찰 3장 (겉으로 보이는 것/숨은 요인/카드의 조언)
 */
export const SPREAD_OPTIONS = [
  {
    id: 'time_3',
    name: { ko: '과거·현재·미래 3장', en: 'Past·Present·Future (3)', ja: '過去・現在・未来 3枚' },
    positions: {
      ko: ['과거', '현재', '미래'],
      en: ['Past', 'Present', 'Future'],
      ja: ['過去', '現在', '未来'],
    },
  },
  {
    id: 'solution_3',
    name: { ko: '문제·원인·해결 3장', en: 'Problem·Cause·Solution (3)', ja: '問題・原因・解決 3枚' },
    positions: {
      ko: ['현재의 문제', '원인', '해결·조언'],
      en: ['Current problem', 'Cause', 'Solution / Advice'],
      ja: ['現在の問題', '原因', '解決・アドバイス'],
    },
  },
  {
    id: 'relationship_5',
    name: { ko: '관계 5장', en: 'Relationship (5)', ja: '関係 5枚' },
    positions: {
      ko: ['그 사람의 마음', '과거에 대한 미련', '숨은 속마음', '주변의 영향', '앞으로의 전망'],
      en: ['Their state of mind', 'Lingering about the past', 'Hidden feelings', 'Outside influence', 'Outlook'],
      ja: ['その人の心', '過去への未練', '隠れた本音', '周囲の影響', 'これからの見通し'],
    },
  },
  {
    id: 'cross_4',
    name: { ko: '크로스 4장', en: 'Cross (4)', ja: 'クロス 4枚' },
    positions: {
      ko: ['현재 상황', '도전·장애물', '과거의 영향', '앞으로의 방향'],
      en: ['Current situation', 'Challenge / Obstacle', 'Past influence', 'Future direction'],
      ja: ['現在の状況', '挑戦・障害', '過去の影響', 'これからの方向'],
    },
  },
  {
    id: 'insight_3',
    name: { ko: '통찰 3장', en: 'Insight (3)', ja: '洞察 3枚' },
    positions: {
      ko: ['겉으로 보이는 것', '숨은 요인', '카드가 주는 조언'],
      en: ['What shows on the surface', 'Hidden factor', 'Advice from the cards'],
      ja: ['表に見えること', '隠れた要因', 'カードからの助言'],
    },
  },
];

/** 질문당 선택 가능한 5가지 스프레드 ID 목록 */
export const QUESTION_SPREAD_IDS = SPREAD_OPTIONS.map((s) => s.id);

/** 질문별 추천 스프레드 (기본 선택용) */
export const RECOMMENDED_SPREAD_BY_QUESTION = {
  love_1: 'relationship_5',
  love_2: 'time_3',       
  love_3: 'time_3',
  career_1: 'solution_3',
  career_2: 'relationship_5',
  career_3: 'time_3',
  money_1: 'time_3',
  money_2: 'solution_3',
  money_3: 'time_3',
  relationship_1: 'relationship_5',
  relationship_2: 'solution_3',
  relationship_3: 'time_3',
  fortune_1: 'time_3',
  fortune_2: 'time_3',
  fortune_3: 'solution_3',
};

/**
 * 제너럴 리딩 스프레드 ID → SpreadRendererMain spreadListNumber
 * - time_3 → 301 (ThreeCardsTime), solution_3 → 302 (ThreeCardsSolution)
 * - relationship_5 → 501 (FiveCardsRelationship), cross_4 → 400 (FourCards)
 * - insight_3 → 302 (ThreeCardsSolution 레이아웃)
 */
export const GENERAL_READING_SPREAD_LIST_NUMBER = {
  time_3: 301,
  solution_3: 302,
  relationship_5: 501,
  cross_4: 400,
  insight_3: 302,
};

/**
 * 75세트 미리 준비된 카드 (정/역) — 해석 내용에 맞게 직접 선정, 하드코딩
 * 키 형식: questionId_spreadId (예: love_1_time_3)
 * 값: ["Card Name (normal_direction|reversed)", ...]
 */
export const PREPARED_CARDS_BY_SPREAD = {
  // ── love_1: 전 애인의 속마음 ──
  love_1_time_3: ['Six of Cups (normal_direction)', 'The Moon (reversed)', 'Two of Swords (normal_direction)'],
  love_1_solution_3: ['Five of Cups (reversed)', 'Three of Swords (normal_direction)', 'The Star (normal_direction)'],
  love_1_relationship_5: ['The Moon (normal_direction)', 'Six of Cups (normal_direction)', 'Knight of Cups (reversed)', 'The Hermit (normal_direction)', 'Eight of Cups (reversed)'],
  love_1_cross_4: ['Four of Cups (normal_direction)', 'The High Priestess (reversed)', 'Three of Swords (normal_direction)', 'Page of Cups (normal_direction)'],
  love_1_insight_3: ['Seven of Cups (normal_direction)', 'Five of Cups (reversed)', 'The Hanged Man (normal_direction)'],

  // ── love_2: 지금 만나는 사람, 진짜 인연일까 ──
  love_2_time_3: ['The Lovers (normal_direction)', 'Two of Cups (normal_direction)', 'Ace of Cups (normal_direction)'],
  love_2_solution_3: ['Nine of Cups (reversed)', 'Wheel of Fortune (normal_direction)', 'Temperance (normal_direction)'],
  love_2_relationship_5: ['The Lovers (reversed)', 'Two of Cups (normal_direction)', 'Page of Cups (normal_direction)', 'The Empress (normal_direction)', 'Ten of Cups (normal_direction)'],
  love_2_cross_4: ['Two of Cups (reversed)', 'The Star (normal_direction)', 'Six of Cups (normal_direction)', 'The World (normal_direction)'],
  love_2_insight_3: ['The Empress (normal_direction)', 'Knight of Cups (normal_direction)', 'Temperance (normal_direction)'],

  // ── love_3: 썸·연애 전개와 결말 ──
  love_3_time_3: ['Page of Cups (normal_direction)', 'Wheel of Fortune (reversed)', 'The Chariot (normal_direction)'],
  love_3_solution_3: ['Seven of Cups (normal_direction)', 'Two of Wands (reversed)', 'Ace of Wands (normal_direction)'],
  love_3_relationship_5: ['Knight of Cups (normal_direction)', 'The Moon (reversed)', 'Page of Wands (normal_direction)', 'Six of Swords (normal_direction)', 'The Sun (normal_direction)'],
  love_3_cross_4: ['Eight of Cups (reversed)', 'The Hanged Man (normal_direction)', 'Two of Cups (normal_direction)', 'Three of Wands (normal_direction)'],
  love_3_insight_3: ['The Moon (normal_direction)', 'Ace of Cups (reversed)', 'Strength (normal_direction)'],

  // ── career_1: 이직·승진 시기와 방향 ──
  career_1_time_3: ['Four of Pentacles (reversed)', 'Eight of Pentacles (normal_direction)', 'Three of Wands (normal_direction)'],
  career_1_solution_3: ['Five of Wands (normal_direction)', 'Seven of Pentacles (reversed)', 'Ace of Pentacles (normal_direction)'],
  career_1_relationship_5: ['Eight of Pentacles (normal_direction)', 'Five of Wands (reversed)', 'The Emperor (normal_direction)', 'Six of Wands (normal_direction)', 'The World (normal_direction)'],
  career_1_cross_4: ['Four of Pentacles (normal_direction)', 'Knight of Swords (reversed)', 'Seven of Pentacles (normal_direction)', 'Ace of Wands (normal_direction)'],
  career_1_insight_3: ['Nine of Pentacles (normal_direction)', 'The Hermit (reversed)', 'Eight of Wands (normal_direction)'],

  // ── career_2: 상사·동료가 나를 어떻게 보는지 ──
  career_2_time_3: ['Three of Pentacles (normal_direction)', 'Six of Wands (reversed)', 'Page of Pentacles (normal_direction)'],
  career_2_solution_3: ['Knight of Pentacles (reversed)', 'The Hierophant (normal_direction)', 'Three of Wands (normal_direction)'],
  career_2_relationship_5: ['Three of Pentacles (reversed)', 'Page of Pentacles (normal_direction)', 'Six of Wands (normal_direction)', 'The Emperor (reversed)', 'Knight of Pentacles (normal_direction)'],
  career_2_cross_4: ['Six of Wands (reversed)', 'Nine of Pentacles (normal_direction)', 'Three of Pentacles (normal_direction)', 'Eight of Pentacles (normal_direction)'],
  career_2_insight_3: ['Page of Pentacles (normal_direction)', 'Seven of Pentacles (reversed)', 'The Magician (normal_direction)'],

  // ── career_3: 일운·직장에서의 행운 ──
  career_3_time_3: ['Seven of Pentacles (normal_direction)', 'Wheel of Fortune (normal_direction)', 'Nine of Pentacles (normal_direction)'],
  career_3_solution_3: ['Four of Pentacles (normal_direction)', 'Ten of Wands (reversed)', 'Ace of Pentacles (normal_direction)'],
  career_3_relationship_5: ['Seven of Pentacles (normal_direction)', 'Eight of Pentacles (normal_direction)', 'Six of Wands (reversed)', 'The Star (normal_direction)', 'Ten of Pentacles (normal_direction)'],
  career_3_cross_4: ['Nine of Pentacles (reversed)', 'Seven of Pentacles (normal_direction)', 'Eight of Pentacles (normal_direction)', 'The Star (normal_direction)'],
  career_3_insight_3: ['Eight of Pentacles (normal_direction)', 'Wheel of Fortune (reversed)', 'Six of Wands (normal_direction)'],

  // ── money_1: 돈 들어올 시기·방법 ──
  money_1_time_3: ['Nine of Pentacles (normal_direction)', 'Ace of Pentacles (reversed)', 'Ten of Pentacles (normal_direction)'],
  money_1_solution_3: ['Four of Pentacles (reversed)', 'Seven of Pentacles (normal_direction)', 'Ace of Pentacles (normal_direction)'],
  money_1_relationship_5: ['Nine of Pentacles (normal_direction)', 'Six of Pentacles (normal_direction)', 'Four of Pentacles (reversed)', 'Ace of Pentacles (normal_direction)', 'Ten of Pentacles (normal_direction)'],
  money_1_cross_4: ['Seven of Pentacles (normal_direction)', 'Five of Pentacles (reversed)', 'Six of Pentacles (normal_direction)', 'Ace of Pentacles (normal_direction)'],
  money_1_insight_3: ['Four of Pentacles (normal_direction)', 'Page of Pentacles (reversed)', 'Knight of Pentacles (normal_direction)'],

  // ── money_2: 투자·저축 방향 ──
  money_2_time_3: ['Two of Pentacles (reversed)', 'The Hermit (normal_direction)', 'Seven of Pentacles (normal_direction)'],
  money_2_solution_3: ['Seven of Cups (normal_direction)', 'Four of Pentacles (normal_direction)', 'Temperance (normal_direction)'],
  money_2_relationship_5: ['Two of Pentacles (reversed)', 'Seven of Cups (normal_direction)', 'The Hermit (normal_direction)', 'Four of Pentacles (normal_direction)', 'Seven of Pentacles (normal_direction)'],
  money_2_cross_4: ['Seven of Cups (reversed)', 'The Emperor (normal_direction)', 'Two of Pentacles (normal_direction)', 'Seven of Pentacles (normal_direction)'],
  money_2_insight_3: ['Five of Pentacles (reversed)', 'Four of Pentacles (normal_direction)', 'Temperance (normal_direction)'],

  // ── money_3: 지출·낭비 정리 ──
  money_3_time_3: ['Five of Pentacles (reversed)', 'The Devil (reversed)', 'Four of Pentacles (normal_direction)'],
  money_3_solution_3: ['The Devil (normal_direction)', 'Seven of Swords (reversed)', 'Temperance (normal_direction)'],
  money_3_relationship_5: ['Five of Pentacles (reversed)', 'The Devil (normal_direction)', 'Seven of Swords (normal_direction)', 'Six of Pentacles (reversed)', 'Four of Pentacles (normal_direction)'],
  money_3_cross_4: ['The Moon (reversed)', 'The Devil (reversed)', 'Five of Pentacles (normal_direction)', 'Temperance (normal_direction)'],
  money_3_insight_3: ['Seven of Swords (normal_direction)', 'The Devil (reversed)', 'Four of Pentacles (normal_direction)'],

  // ── relationship_1: 주변에서 나를 어떻게 보나 ──
  relationship_1_time_3: ['The Empress (normal_direction)', 'Six of Cups (normal_direction)', 'The Star (normal_direction)'],
  relationship_1_solution_3: ['The High Priestess (normal_direction)', 'Four of Cups (reversed)', 'Three of Cups (normal_direction)'],
  relationship_1_relationship_5: ['The Empress (normal_direction)', 'Six of Cups (normal_direction)', 'The High Priestess (normal_direction)', 'Two of Cups (reversed)', 'Three of Cups (normal_direction)'],
  relationship_1_cross_4: ['The Star (normal_direction)', 'The High Priestess (reversed)', 'Six of Cups (normal_direction)', 'Ace of Cups (normal_direction)'],
  relationship_1_insight_3: ['The Empress (normal_direction)', 'The Hermit (reversed)', 'Three of Cups (normal_direction)'],

  // ── relationship_2: 거리두기 할 사람 ──
  relationship_2_time_3: ['Five of Swords (reversed)', 'The Devil (normal_direction)', 'Queen of Swords (normal_direction)'],
  relationship_2_solution_3: ['Ten of Wands (normal_direction)', 'Five of Swords (normal_direction)', 'Queen of Swords (normal_direction)'],
  relationship_2_relationship_5: ['Five of Swords (normal_direction)', 'The Devil (reversed)', 'Ten of Wands (normal_direction)', 'Seven of Swords (normal_direction)', 'Queen of Swords (normal_direction)'],
  relationship_2_cross_4: ['The Devil (normal_direction)', 'Five of Swords (reversed)', 'Ten of Wands (reversed)', 'King of Swords (normal_direction)'],
  relationship_2_insight_3: ['Seven of Swords (normal_direction)', 'Ten of Wands (reversed)', 'Queen of Swords (normal_direction)'],

  // ── relationship_3: 진짜 친구·내 편 ──
  relationship_3_time_3: ['Three of Cups (normal_direction)', 'Six of Cups (reversed)', 'Ten of Cups (normal_direction)'],
  relationship_3_solution_3: ['Five of Cups (reversed)', 'Three of Cups (normal_direction)', 'Two of Cups (normal_direction)'],
  relationship_3_relationship_5: ['Three of Cups (normal_direction)', 'Five of Cups (reversed)', 'Two of Cups (normal_direction)', 'The Sun (normal_direction)', 'Ten of Cups (normal_direction)'],
  relationship_3_cross_4: ['Six of Cups (reversed)', 'King of Cups (normal_direction)', 'Three of Cups (normal_direction)', 'The Sun (normal_direction)'],
  relationship_3_insight_3: ['Two of Cups (normal_direction)', 'The Hermit (reversed)', 'Three of Cups (normal_direction)'],

  // ── fortune_1: 올해 운세 ──
  fortune_1_time_3: ['The World (reversed)', 'Temperance (normal_direction)', 'The Sun (normal_direction)'],
  fortune_1_solution_3: ['Four of Wands (reversed)', 'Judgement (normal_direction)', 'The Star (normal_direction)'],
  fortune_1_relationship_5: ['The World (reversed)', 'Eight of Pentacles (normal_direction)', 'Temperance (normal_direction)', 'Wheel of Fortune (normal_direction)', 'The Sun (normal_direction)'],
  fortune_1_cross_4: ['Temperance (normal_direction)', 'Five of Wands (reversed)', 'Seven of Pentacles (normal_direction)', 'The Sun (normal_direction)'],
  fortune_1_insight_3: ['The Star (normal_direction)', 'Seven of Pentacles (reversed)', 'The Sun (normal_direction)'],

  // ── fortune_2: 숨은 기회 ──
  fortune_2_time_3: ['Ace of Wands (normal_direction)', 'Page of Pentacles (normal_direction)', 'The Magician (normal_direction)'],
  fortune_2_solution_3: ['The Hermit (reversed)', 'Ace of Pentacles (normal_direction)', 'The Magician (normal_direction)'],
  fortune_2_relationship_5: ['Ace of Wands (normal_direction)', 'The Fool (normal_direction)', 'Page of Pentacles (normal_direction)', 'Three of Wands (normal_direction)', 'The Magician (normal_direction)'],
  fortune_2_cross_4: ['Page of Wands (normal_direction)', 'The Fool (reversed)', 'Ace of Pentacles (normal_direction)', 'Three of Wands (normal_direction)'],
  fortune_2_insight_3: ['The Fool (normal_direction)', 'Ace of Wands (reversed)', 'The Magician (normal_direction)'],

  // ── fortune_3: 조심할 점 ──
  fortune_3_time_3: ['Ten of Wands (normal_direction)', 'The Moon (reversed)', 'Four of Swords (normal_direction)'],
  fortune_3_solution_3: ['Nine of Swords (normal_direction)', 'The Tower (reversed)', 'Four of Swords (normal_direction)'],
  fortune_3_relationship_5: ['Ten of Wands (normal_direction)', 'Nine of Swords (normal_direction)', 'The Moon (normal_direction)', 'Five of Swords (reversed)', 'Four of Swords (normal_direction)'],
  fortune_3_cross_4: ['Nine of Swords (reversed)', 'The Tower (reversed)', 'The Moon (normal_direction)', 'Four of Swords (normal_direction)'],
  fortune_3_insight_3: ['The Moon (normal_direction)', 'Nine of Swords (reversed)', 'Temperance (normal_direction)'],
};

/**
 * (질문, 스프레드)에 해당하는 미리 준비된 카드 배열 반환
 * @param {string} questionId  예: 'love_1'
 * @param {string} spreadId   예: 'time_3'
 * @returns {string[]}
 */
export function getPreparedCards(questionId, spreadId) {
  if (!questionId || !spreadId) return [];
  const key = `${questionId}_${spreadId}`;
  return PREPARED_CARDS_BY_SPREAD[key] ?? [];
}

/** 포지션 1~5 의미 (제너럴 리딩 5장 스프레드) */
export const GENERAL_READING_POSITIONS = {
  en: [
    'Current energy / What is present now',
    'Challenge or obstacle to be aware of',
    'Advice from the cards',
    'Hidden influence or underlying factor',
    'Possible outcome or direction',
  ],
  ko: [
    '현재의 에너지 / 지금 있는 것',
    '인식해야 할 도전이나 장애물',
    '카드가 주는 조언',
    '숨은 영향이나 밑바닥 요인',
    '가능한 결과나 방향',
  ],
  ja: [
    '現在のエネルギー / 今あるもの',
    '意識すべき挑戦や障害',
    'カードからの助言',
    '隠れた影響や土台にある要因',
    'あり得る結果や方向性',
  ],
};

/**
 * 언어 코드 정규화 (English language → en, Korean language → ko 등)
 * @param {string} language
 * @returns {'en'|'ko'|'ja'}
 */
export function normalizeLanguage(language) {
  if (!language) return 'ko';
  const l = String(language).toLowerCase();
  if (l.includes('korean') || l === 'ko') return 'ko';
  if (l.includes('japanese') || l === 'ja') return 'ja';
  return 'en';
}

/**
 * @param {string} language
 * @returns {Array<{ id: string, text: string }>}
 */
export function getQuestionsForLanguage(language) {
  const lang = normalizeLanguage(language);
  return GENERAL_READING_QUESTIONS[lang] || GENERAL_READING_QUESTIONS.ko;
}

/**
 * 미리 저장해 둔 제너럴 리딩 해석 반환
 * @param {string} questionId - love_1~3 | career_1~3 | money_1~3 | relationship_1~3 | fortune_1~3
 * @param {string} [spreadIdOrLanguage] - spreadId(time_3|solution_3|relationship_5|cross_4|insight_3) 또는 language(2인자 호출 시)
 * @param {string} [language] - 언어 (3인자 호출 시 필수)
 * @returns {string | string[]} 신 형식이면 포지션별 본문 배열, 구 형식이면 ①②③ 블록 문자열 (없으면 '' 또는 [])
 */
export function getStoredReading(questionId, spreadIdOrLanguage, language) {
  const isTwoArgs = arguments.length === 2;
  const effectiveSpreadId = isTwoArgs ? RECOMMENDED_SPREAD_BY_QUESTION[questionId] : spreadIdOrLanguage;
  const lang = normalizeLanguage(isTwoArgs ? spreadIdOrLanguage : language);
  if (!effectiveSpreadId) return '';

  const from75 = READINGS_BY_QUESTION_AND_SPREAD[questionId]?.[effectiveSpreadId];
  if (from75) {
    const arr = from75[lang] ?? from75.ko ?? from75.en;
    if (Array.isArray(arr) && arr.length > 0) return arr;
  }
  return [];
}

/**
 * 보통타로 스키마용 — 직접적인 답변 문자열 반환 (질문·스프레드/카드셋별 매칭, 75세트 각각 따로 작성)
 * 75세트: generalReading75Data DIRECT_ANSWER_BY_QUESTION_AND_SPREAD. 없으면 빈 문자열.
 * @param {string} questionId
 * @param {string} [spreadId] - 있으면 해당 카드셋용 직접 답변, 없으면 질문 기본값
 * @param {string} language
 * @returns {string}
 */
export function getStoredDirectAnswer(questionId, spreadIdOrLanguage, language) {
  const hasSpread = typeof language === 'string';
  const spreadId = hasSpread ? spreadIdOrLanguage : null;
  const lang = normalizeLanguage(hasSpread ? language : spreadIdOrLanguage);
  const from75 = spreadId && DIRECT_ANSWER_BY_QUESTION_AND_SPREAD[questionId]?.[spreadId];
  if (from75) {
    const text = from75[lang] ?? from75.ko ?? from75.en ?? '';
    if (text) return text;
  }
  return '';
}

/**
 * 보통타로 스키마용 — 추가 통찰 배열 반환 (최대 2개, 카드셋별 매칭)
 * 해당 스프레드에 전용 데이터가 있고 비어 있지 않으면 사용, 없거나 빈 배열이면 질문별 기본값 사용(75세트 모두 내용 채움).
 * @param {string} questionId
 * @param {string} spreadId
 * @param {string} language
 * @returns {string[]}
 */
export function getStoredAdditionalInsights(questionId, spreadId, language) {
  const lang = normalizeLanguage(language);
  const from75 = ADDITIONAL_INSIGHTS_BY_QUESTION_AND_SPREAD[questionId]?.[spreadId];
  if (from75) {
    const arr = from75[lang] ?? from75.ko ?? from75.en ?? [];
    const list = Array.isArray(arr) ? arr.slice(0, 2).filter(Boolean) : [];
    if (list.length > 0) return list;
  }
  return [];
}

/**
 * 스프레드 ID에 해당하는 포지션 라벨 배열 반환
 * @param {string} spreadId - time_3 | solution_3 | relationship_5 | cross_4 | insight_3
 * @param {string} language
 * @returns {string[]}
 */
export function getPositionLabelsForSpread(spreadId, language) {
  const lang = normalizeLanguage(language);
  const spread = SPREAD_OPTIONS.find((s) => s.id === spreadId);
  if (spread && spread.positions && spread.positions[lang]) return spread.positions[lang];
  return getPositionLabelsForLanguage(language);
}

/**
 * @param {string} language
 * @returns {string[]}
 */
export function getPositionLabelsForLanguage(language) {
  const lang = normalizeLanguage(language);
  return GENERAL_READING_POSITIONS[lang] || GENERAL_READING_POSITIONS.ko;
}

// ========== 그림 카드 UI용 목데이터 & 이미지 사양 ==========

/**
 * 제너럴 리딩 그림 카드 이미지 사양 (GPT 등으로 제작 시 참고)
 * - 사이즈: 400 × 533 px (비율 3:4, 카드형)
 * - 확장자: .png 또는 .webp
 * - 파일명: { questionId }.png (예: love_1.png, career_2.png)
 * - 배치 경로: public/assets/images/generalReading/ (또는 프로젝트 정책에 맞게)
 */
export const GENERAL_READING_IMAGE_SPEC = {
  widthPx: 400,
  heightPx: 533,
  ratio: '3:4',
  // 현재 프로젝트는 public에 SVG 목업 에셋을 포함해 바로 렌더링 가능하도록 함
  // (추후 실제 이미지(.png/.webp)로 교체해도 되도록 extensions는 유지)
  extension: '.svg',
  extensions: ['.svg', '.png', '.webp'],
  filenamePattern: '{questionId}.svg',
  exampleFilenames: ['love_1.svg', 'career_2.svg', 'fortune_3.svg'],
};

/** 목업용 플레이스홀더 이미지 URL (실제 이미지 준비 전까지 사용) */
const PLACEHOLDER_BASE = 'https://placehold.co';
const PLACEHOLDER_SIZE = '400x533';
const PLACEHOLDER_BG = '6366f1';
const PLACEHOLDER_FG = 'e9d5ff';

// 로컬 에셋 경로 (public/assets/images/*)
// v2: 미니멀/직관 카드 이미지 세트 (질문 카드)
const GENERAL_READING_QUESTION_IMAGE_DIR = '/assets/images/generalReadingV2/questions';
// v2: 미니멀/직관 스프레드 도식
const GENERAL_READING_SPREAD_IMAGE_DIR = '/assets/images/generalReadingV2/spreads';

/**
 * 제너럴 리딩 질문 카드 이미지 URL
 * - questionId가 있으면 로컬 에셋 경로 반환 (없으면 img onError에서 placeholder로 폴백)
 * @param {string} [questionId] - love_1, career_2 등
 * @returns {string} 로컬 SVG 경로 또는(인자 없/빈값 시) 플레이스홀더 URL
 */
export function getGeneralReadingCardImageUrl(questionId) {
  const id = typeof questionId === 'string' ? questionId.trim() : '';
  if (!id) {
    return `${PLACEHOLDER_BASE}/${PLACEHOLDER_SIZE}/${PLACEHOLDER_BG}/${PLACEHOLDER_FG}?text=card`;
  }
  return `${GENERAL_READING_QUESTION_IMAGE_DIR}/${id}.svg`;
}

/**
 * 스프레드 레이아웃 이미지 URL
 * - spreadId가 있으면 로컬 에셋 경로 반환 (없으면 img onError에서 placeholder로 폴백)
 * @param {string} [spreadId] - time_3 | solution_3 | relationship_5 | cross_4 | insight_3
 * @returns {string} 로컬 SVG 경로 또는(인자 없/빈값 시) 플레이스홀더 URL
 */
export function getSpreadImageUrl(spreadId) {
  const id = typeof spreadId === 'string' ? spreadId.trim() : '';
  if (!id) {
    return `${PLACEHOLDER_BASE}/400x200/${PLACEHOLDER_BG}/${PLACEHOLDER_FG}?text=spread`;
  }
  return `${GENERAL_READING_SPREAD_IMAGE_DIR}/${id}.svg`;
}

export default {
  GENERAL_READING_QUESTIONS,
  GENERAL_READING_POSITIONS,
  RECOMMENDED_SPREAD_BY_QUESTION,
  SPREAD_OPTIONS,
  QUESTION_SPREAD_IDS,
  GENERAL_READING_IMAGE_SPEC,
  normalizeLanguage,
  getQuestionsForLanguage,
  getPositionLabelsForLanguage,
  getPositionLabelsForSpread,
  getStoredReading,
  getGeneralReadingCardImageUrl,
  getSpreadImageUrl,
};
