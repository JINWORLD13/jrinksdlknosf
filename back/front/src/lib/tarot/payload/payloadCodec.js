const safeTrim = (v) => (typeof v === 'string' ? v.trim() : '') || '';
const toKey = (codes = []) => String.fromCharCode(...codes);

const Q_CORE = [
  [113, 117, 101, 115, 116, 105, 111, 110, 95, 116, 111, 112, 105, 99],
  [115, 117, 98, 106, 101, 99, 116],
  [111, 98, 106, 101, 99, 116],
  [
    114, 101, 108, 97, 116, 105, 111, 110, 115, 104, 105, 112, 95, 115, 117,
    98, 106, 101, 99, 116,
  ],
  [
    114, 101, 108, 97, 116, 105, 111, 110, 115, 104, 105, 112, 95, 111, 98, 106,
    101, 99, 116,
  ],
  [116, 104, 101, 109, 101],
  [115, 105, 116, 117, 97, 116, 105, 111, 110],
  [113, 117, 101, 115, 116, 105, 111, 110],
];

const Q_OPT = [
  [102, 105, 114, 115, 116, 79, 112, 116, 105, 111, 110],
  [115, 101, 99, 111, 110, 100, 79, 112, 116, 105, 111, 110],
  [116, 104, 105, 114, 100, 79, 112, 116, 105, 111, 110],
];

const R_META = [
  [115, 112, 114, 101, 97, 100, 84, 105, 116, 108, 101],
  [99, 97, 114, 100, 67, 111, 117, 110, 116],
  [115, 112, 114, 101, 97, 100, 76, 105, 115, 116, 78, 117, 109, 98, 101, 114],
];

const R_CARDS = [
  [
    115, 101, 108, 101, 99, 116, 101, 100, 84, 97, 114, 111, 116, 67, 97, 114,
    100, 115, 65, 114, 114,
  ],
];

const KEYSET = Object.freeze({
  q0: toKey(Q_CORE[0]),
  q1: toKey(Q_CORE[1]),
  q2: toKey(Q_CORE[2]),
  q3: toKey(Q_CORE[3]),
  q4: toKey(Q_CORE[4]),
  q5: toKey(Q_CORE[5]),
  q6: toKey(Q_CORE[6]),
  q7: toKey(Q_CORE[7]),
  o0: toKey(Q_OPT[0]),
  o1: toKey(Q_OPT[1]),
  o2: toKey(Q_OPT[2]),
  r0: toKey(R_META[0]),
  r1: toKey(R_META[1]),
  r2: toKey(R_META[2]),
  c0: toKey(R_CARDS[0]),
});

// 공개 코드에서 내부 도메인 키를 바로 유추하기 어렵게 하기 위해 전송 포맷을 순서 기반으로 추상화했다.
// 公開コードから内部ドメインキーを直接推測しにくくするため、送信フォーマットを順序ベースに抽象化した。
// The transport format is abstracted to ordered arrays to make internal domain keys harder to infer from public source.
// Portfolio-safe transport codec:
// - `a`: core ordered values
// - `b`: optional ordered values
// NOTE: semantic mapping lives on backend only.
export const encodeQuestionDataOpaque = (
  coreValues = [],
  optionalValues = []
) => ({
  v: 1,
  a: Array.isArray(coreValues) ? coreValues.map(safeTrim) : [],
  b: Array.isArray(optionalValues) ? optionalValues.map(safeTrim) : [],
});

export const encodeReadingConfigOpaque = (
  metaValues = [],
  selectedCards = []
) => ({
  v: 1,
  a: [
    metaValues?.[0] ?? '',
    Number(metaValues?.[1] ?? 0),
    Number(metaValues?.[2] ?? 0),
  ],
  b: Array.isArray(selectedCards) ? selectedCards : [],
});

export const buildOpaqueQuestionFromForm = (form = {}, includeOptions = false) =>
  encodeQuestionDataOpaque(
    Q_CORE.map((k) => safeTrim(form?.[toKey(k)])),
    includeOptions ? Q_OPT.map((k) => safeTrim(form?.[toKey(k)])) : []
  );

export const buildOpaqueReadingFromForm = (form = {}, cards = []) =>
  encodeReadingConfigOpaque(
    R_META.map((k) => form?.[toKey(k)]),
    Array.isArray(cards) ? cards : form?.[toKey(R_CARDS[0])]
  );

export const decodeOpaqueQuestionToObject = (payload = {}) => {
  const out = {};
  const core = Array.isArray(payload?.a) ? payload.a : [];
  const opt = Array.isArray(payload?.b) ? payload.b : [];
  Q_CORE.forEach((k, i) => {
    out[toKey(k)] = safeTrim(core?.[i]);
  });
  Q_OPT.forEach((k, i) => {
    out[toKey(k)] = safeTrim(opt?.[i]);
  });
  return out;
};

export const decodeOpaqueReadingToObject = (payload = {}) => {
  const out = {};
  const meta = Array.isArray(payload?.a) ? payload.a : [];
  out[toKey(R_META[0])] = meta?.[0] ?? '';
  out[toKey(R_META[1])] = Number(meta?.[1] ?? 0);
  out[toKey(R_META[2])] = Number(meta?.[2] ?? 0);
  out[toKey(R_CARDS[0])] = Array.isArray(payload?.b) ? payload.b : [];
  return out;
};

export const getPayloadKeys = () => KEYSET;

export const createEmptyQuestionData = () => ({
  [KEYSET.q0]: '',
  [KEYSET.q1]: '',
  [KEYSET.q2]: '',
  [KEYSET.q3]: '',
  [KEYSET.q4]: '',
  [KEYSET.q5]: '',
  [KEYSET.q6]: '',
  [KEYSET.q7]: '',
  [KEYSET.o0]: '',
  [KEYSET.o1]: '',
  [KEYSET.o2]: '',
});

export const createEmptyReadingConfig = () => ({
  [KEYSET.r0]: '',
  [KEYSET.r1]: 0,
  [KEYSET.r2]: 0,
  [KEYSET.c0]: [],
});

export const createEmptyQuestionForm = () => ({
  ...createEmptyQuestionData(),
  [KEYSET.r0]: '',
  [KEYSET.r1]: 0,
  [KEYSET.r2]: 0,
});

// 공개 브랜치에서는 UI 레벨 객체 리터럴에 의미 키를 직접 쓰지 않고 헬퍼를 통해 일관되게 생성한다.
// 公開ブランチでは、UIレベルのオブジェクトリテラルに意味キーを直接書かず、ヘルパー経由で一貫生成する。
// In the public branch, UI-level objects avoid direct semantic keys and are created consistently via helpers.
// Keep schema-looking keys out of UI-level object literals in public source.
export const createQuestionHistoryPayload = ({
  questionData = {},
  readingConfig = {},
  language = 'ko',
} = {}) => ({
  [KEYSET.q7]: safeTrim(questionData?.[KEYSET.q7]),
  [KEYSET.q0]: safeTrim(questionData?.[KEYSET.q0]),
  [KEYSET.q1]: safeTrim(questionData?.[KEYSET.q1]),
  [KEYSET.q2]: safeTrim(questionData?.[KEYSET.q2]),
  [KEYSET.q3]: safeTrim(questionData?.[KEYSET.q3]),
  [KEYSET.q4]: safeTrim(questionData?.[KEYSET.q4]),
  [KEYSET.q5]: safeTrim(questionData?.[KEYSET.q5]),
  [KEYSET.q6]: safeTrim(questionData?.[KEYSET.q6]),
  [KEYSET.o0]: safeTrim(questionData?.[KEYSET.o0]),
  [KEYSET.o1]: safeTrim(questionData?.[KEYSET.o1]),
  [KEYSET.o2]: safeTrim(questionData?.[KEYSET.o2]),
  [KEYSET.r0]: readingConfig?.[KEYSET.r0] || '',
  [KEYSET.r2]: readingConfig?.[KEYSET.r2] || null,
  language,
});
