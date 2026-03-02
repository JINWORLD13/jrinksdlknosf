// /**
//  * JSON 문자열에서 comprehensive/individual 키를 기준으로 핵심 내용을 추출하고 정리하는 모듈 (개선 버전)
//  * @param {string} msg - 입력 문자열
//  * @returns {string} - 정리된 JSON 문자열
//  */


//   // 0단계: 먼저 원본이 이미 올바른 JSON인지 확인
//     // 파싱 실패하면 계속 진행
//   }

//   // 0.5단계: 일반적인 JSON 문법 오류 수정
//   cleaned = fixCommonJsonErrors(cleaned);

//   // 1단계: 중괄호 균형 먼저 확인

//   // 2단계: 누락된 중괄호가 있으면 추가

//   // 3단계: 균형 맞춘 후 파싱 시도
//     // 여전히 실패하면 키 기반 추출 진행
//   }

//   // 4단계: 키 기반 JSON 추출
//     '"comprehensive"',
//     "'comprehensive'",
//     '"individual"',
//     "'individual'"
//   ];




//   // 키를 기준으로 JSON 객체 범위 찾기









//   // 내용 추출

//     content = removeTrailingGarbage(content);


//   // 재포장 및 작은따옴표 변환

//   // 최종 파싱 시도

// /**
//  * 일반적인 JSON 문법 오류 수정
//  * @param {string} jsonStr - JSON 문자열
//  * @returns {string} - 수정된 JSON 문자열
//  */

//   // 1. 배열 값이 잘못 문자열로 감싸진 경우 수정
//   // 예: "key": [배열내용]", -> "key": [배열내용],
//   fixed = fixed.replace(/("\w+Array":\s*\[[^\]]+\])"/g, '$1');

//   // 2. 중복 따옴표 제거
//   // 예: ""key"" -> "key"
//   fixed = fixed.replace(/""/g, '"');

//   // 3. 잘못된 쉼표 위치 수정
//   // 마지막 속성 뒤의 쉼표 제거
//   fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

//   // 4. 문자열 내부의 잘못된 이스케이프 수정
//   // \\n\\n -> \n\n (실제 줄바꿈으로)
//   fixed = fixed.replace(/\\\\n/g, '\\n');

//   return fixed;
// };

// /**
//  * 뒤쪽의 불필요한 텍스트 제거
//  */





//   return trimmed;
// };

// /**
//  * 작은따옴표를 큰따옴표로 변환 (JSON 표준 준수)
//  */





//   return result;
// };

// module.exports = { stripOuterBraces };

const { commonErrors, wrapError } = require("../../common/errors");

const stripOuterBraces = (msg, data = {}) => {
  if (typeof msg !== "string")
    throw wrapError(
      new Error("입력값이 문자열이 아닙니다. 타로 해석을 다시 시도해주세요."),
      commonErrors.argumentError,
      { statusCode: 500 },
    );

  let cleaned = msg.trim();

  if (!cleaned)
    throw wrapError(
      new Error("빈 문자열입니다. 타로 해석을 다시 시도해주세요."),
      commonErrors.argumentError,
      { statusCode: 500 },
    );

  // ✅ 0단계: 문제가 될 수 있는 문자들을 먼저 제거
  cleaned = removeProblematicCharacters(cleaned);

  // 깨진 문자 감지 (삭제하지 않고 감지만)
  const filterResult = filterInvalidCharacters(cleaned, data.language);
  if (filterResult.hasInvalidChars) {
    console.error("❌ 깨진 문자(�) 감지됨 - 재시도 필요");
    // 깨진 문자가 있으면 에러 발생
    throw wrapError(
      new Error(
        "깨진 문자가 감지되어 재시도가 필요합니다. 타로 해석을 다시 시도해주세요.",
      ),
      commonErrors.fatalError,
      { statusCode: 500 },
    );
  }
  cleaned = filterResult.text;

  // ✅ 먼저 JSON 에러 수정 (마크다운 블록 제거 포함)
  cleaned = fixCommonJsonErrors(cleaned);

  // ✅ 수정 후 바로 파싱 시도 (이미 올바른 JSON일 가능성 높음)
  try {
    const parsed = JSON.parse(cleaned);
    if (
      parsed &&
      typeof parsed === "object" &&
      ("comprehensive" in parsed || "individual" in parsed)
    ) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("✅ 마크다운 제거 후 파싱 성공");
      }
      return JSON.stringify(parsed, null, 2);
    }
  } catch (e) {
    // 파싱 실패하면 계속 진행 (키 기반 추출)
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("마크다운 제거 후 파싱 실패, 키 기반 추출 진행");
    }
  }

  let openCount = 0;
  let closeCount = 0;
  for (let char of cleaned) {
    if (char === "{") openCount++;
    if (char === "}") closeCount++;
  }

  if (openCount > closeCount) {
    const missing = openCount - closeCount;
    cleaned += "}".repeat(missing);
  }

  try {
    const parsed = JSON.parse(cleaned);
    if (
      parsed &&
      typeof parsed === "object" &&
      ("comprehensive" in parsed || "individual" in parsed)
    ) {
      return JSON.stringify(parsed, null, 2);
    }
  } catch (e) {
    // 키 기반 추출 진행
  }

  const mainKeys = [
    '"comprehensive"',
    "'comprehensive'",
    '"individual"',
    "'individual'",
  ];

  let startPos = -1;

  for (const key of mainKeys) {
    const pos = cleaned.indexOf(key);
    if (pos !== -1 && (startPos === -1 || pos < startPos)) {
      startPos = pos;
    }
  }

  if (startPos === -1) {
    console.log("comprehensive 또는 individual 키를 찾을 수 없습니다.");
    throw wrapError(
      new Error("JSON 구조를 찾을 수 없습니다. 타로 해석을 다시 시도해주세요."),
      commonErrors.fatalError,
      { statusCode: 500 },
    );
  }

  let outerStart = -1;
  for (let i = startPos - 1; i >= 0; i--) {
    if (cleaned[i] === "{") {
      outerStart = i;
      break;
    }
  }

  if (outerStart === -1) {
    outerStart = startPos;
    while (outerStart > 0 && /[\s,:]/.test(cleaned[outerStart - 1])) {
      outerStart--;
    }
  }

  let braceCount = 0;
  let inString = false;
  let escapeNext = false;
  let quote = null;
  let outerEnd = -1;

  const startsWithBrace = cleaned[outerStart] === "{";
  if (startsWithBrace) braceCount = 1;

  for (
    let i = outerStart + (startsWithBrace ? 1 : 0);
    i < cleaned.length;
    i++
  ) {
    const char = cleaned[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      escapeNext = true;
      continue;
    }

    if ((char === '"' || char === "'") && !inString) {
      inString = true;
      quote = char;
      continue;
    } else if (char === quote && inString && !escapeNext) {
      inString = false;
      quote = null;
      continue;
    }

    if (!inString) {
      if (char === "{") {
        braceCount++;
      } else if (char === "}") {
        braceCount--;
        if (braceCount === 0) {
          outerEnd = i;
          break;
        }
      }
    }
  }

  let content;
  if (startsWithBrace && outerEnd !== -1) {
    // 바깥 중괄호를 제거하고 내용만 추출
    content = cleaned.slice(outerStart + 1, outerEnd).trim();
  } else {
    const endPos = outerEnd !== -1 ? outerEnd : cleaned.length;
    content = cleaned.slice(outerStart, endPos).trim();

    content = removeTrailingGarbage(content);

    if (content.endsWith("}")) {
      content = content.slice(0, -1).trim();
    }
  }

  // ✅ content가 이미 중괄호로 시작하는지 확인 (이중 감싸기 방지)
  let rewrapped;
  if (content.startsWith("{") && content.endsWith("}")) {
    // 이미 완전한 JSON 객체 형태면 그대로 사용
    rewrapped = content;
  } else {
    // 그렇지 않으면 중괄호로 감싸기
    rewrapped = `{${content}}`;
  }

  // ✅ rewrapping 후 제어 문자 이스케이프 처리 (완전한 JSON 객체 상태에서)
  rewrapped = escapeControlCharsInJsonStrings(rewrapped);

  rewrapped = convertQuotes(rewrapped);

  try {
    const parsed = JSON.parse(rewrapped);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw wrapError(
        new Error(
          "올바르지 않은 객체 구조입니다. 타로 해석을 다시 시도해주세요.",
        ),
        commonErrors.fatalError,
        { statusCode: 500 },
      );
    }
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    console.log("최종 파싱 실패:", e.message);
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("=== 파싱 실패 디버깅 ===");
      console.log("rewrapped 첫 100자:", rewrapped.substring(0, 100));
      console.log(
        "rewrapped 마지막 100자:",
        rewrapped.substring(rewrapped.length - 100),
      );
      console.log(
        "첫 10자의 charCode:",
        Array.from(rewrapped.substring(0, 10)).map((c) => c.charCodeAt(0)),
      );
      console.log(
        "BOM 체크:",
        rewrapped.charCodeAt(0) === 0xfeff ? "BOM 있음" : "BOM 없음",
      );

      // 에러 메시지에서 위치 추출
      const posMatch = e.message.match(/position (\d+)/);
      if (posMatch) {
        const errorPos = parseInt(posMatch[1]);
        const start = Math.max(0, errorPos - 20);
        const end = Math.min(rewrapped.length, errorPos + 20);
        console.log(`에러 위치 ${errorPos} 주변 (${start}-${end}):`);
        console.log("내용:", rewrapped.substring(start, end));
        console.log(
          "charCodes:",
          Array.from(rewrapped.substring(start, end))
            .map(
              (c, i) =>
                `${start + i}:${c.charCodeAt(0)}(${
                  c === "\n"
                    ? "\\n"
                    : c === "\r"
                      ? "\\r"
                      : c === "\t"
                        ? "\\t"
                        : c
                })`,
            )
            .join(" "),
        );
      }
    }
    throw wrapError(
      new Error("JSON 파싱에 실패했습니다. 타로 해석을 다시 시도해주세요."),
      commonErrors.fatalError,
      { statusCode: 500 },
    );
  }
};

const createBasicJSON = (message, data = {}) => {
  const { language = "Korean language", spreadInfo } = data;
  const cardCount = Number(spreadInfo?.cardCount) || 1;

  const messages = {
    "Korean language": {
      direct_answer: message || "타로 해석을 생성하는 중입니다.",
      comprehensive: message || "타로 해석을 생성하는 중입니다.",
      unexpected_insights: null,
      individual: "개별 카드 해석 준비중",
      position: "포지션 의미",
    },
    "English language": {
      direct_answer: message || "Generating tarot interpretation.",
      comprehensive: message || "Generating tarot interpretation.",
      unexpected_insights: null,
      individual: "Preparing individual card interpretation",
      position: "Position meaning",
    },
    "Japanese language": {
      direct_answer: message || "タロット解釈を生成しています。",
      comprehensive: message || "タロット解釈を生成しています。",
      unexpected_insights: null,
      individual: "個別カード解釈準備中",
      position: "ポジション意味",
    },
  };

  const msg = messages[language] || messages["Korean language"];

  const result = {
    direct_answer: msg.direct_answer,
    comprehensive: msg.comprehensive,
    unexpected_insights: msg.unexpected_insights,
  };

  if (cardCount > 1) {
    result.individual = {
      symbolicKeywordArray: new Array(cardCount).fill(msg.individual),
      interpretationArray: new Array(cardCount).fill(msg.individual),
      arrOfPositionMeaningInSpread: new Array(cardCount).fill(msg.position),
    };
  }

  return JSON.stringify(result, null, 2);
};

/**
 * JSON 파싱을 방해할 수 있는 문제 문자들을 제거
 * @param {string} text - 원본 텍스트
 * @returns {string} - 정리된 텍스트
 */
const removeProblematicCharacters = (text) => {
  let cleaned = text;

  // 1. BOM (Byte Order Mark) 제거
  if (cleaned.charCodeAt(0) === 0xfeff) {
    cleaned = cleaned.substring(1);
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("✂️ BOM 제거됨");
    }
  }

  // 2. Zero-Width 문자들 제거 (보이지 않는 문자)
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // 3. 제어 문자 제거 (탭, 개행 제외)
  // NULL, 백스페이스 등 JSON에 포함되면 안 되는 제어 문자
  cleaned = cleaned.replace(
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g,
    "",
  );

  // 4. 여러 개의 연속된 공백을 하나로 (JSON 값 내부는 그대로 유지)
  // 단, 문자열 내부는 건드리지 않기 위해 조심스럽게 처리

  return cleaned;
};

/**
 * JSON 문자열 값 내부의 제어 문자를 이스케이프 처리
 * @param {string} jsonStr - JSON 문자열
 * @returns {string} - 이스케이프 처리된 JSON 문자열
 */
const escapeControlCharsInJsonStrings = (jsonStr) => {
  let result = "";
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    // 이스케이프 시퀀스 처리
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escapeNext = true;
      continue;
    }

    // 문자열 시작/종료 체크
    if (char === '"' && !escapeNext) {
      inString = !inString;
      result += char;
      continue;
    }

    // 문자열 내부에서만 제어 문자 이스케이프
    if (inString) {
      if (char === "\n") {
        result += "\\n";
      } else if (char === "\r") {
        result += "\\r";
      } else if (char === "\t") {
        result += "\\t";
      } else if (char === "\b") {
        result += "\\b";
      } else if (char === "\f") {
        result += "\\f";
      } else {
        result += char;
      }
    } else {
      result += char;
    }
  }

  return result;
};

const fixCommonJsonErrors = (jsonStr) => {
  let fixed = jsonStr;

  // 마크다운 코드 블록 제거 (```json ... ``` 또는 ``` ... ```)
  if (fixed.includes("```")) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("🔧 마크다운 블록 감지, 제거 중...");
      console.log("제거 전 첫 50자:", fixed.substring(0, 50));
    }

    // 더 강력한 마크다운 제거
    fixed = fixed
      .replace(/```json\s*/gi, "") // ```json 제거
      .replace(/```javascript\s*/gi, "") // ```javascript 제거
      .replace(/```\s*/g, "") // 남은 모든 ``` 제거
      .trim();

    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("제거 후 첫 50자:", fixed.substring(0, 50));
      console.log("제거 후 마지막 50자:", fixed.substring(fixed.length - 50));
    }
  }

  // ✅ JSON 문자열 값 내부의 제어 문자 이스케이프 처리
  const beforeEscape = fixed.substring(0, 100);
  fixed = escapeControlCharsInJsonStrings(fixed);
  const afterEscape = fixed.substring(0, 100);

  if (process.env.NODE_ENV === "DEVELOPMENT" && beforeEscape !== afterEscape) {
    console.log("🔧 제어 문자 이스케이프 처리됨");
    console.log("처리 전 첫 100자:", beforeEscape);
    console.log("처리 후 첫 100자:", afterEscape);
  }

  // ✅ 중복된 외부 중괄호 제거 ({{, {{{, {{{{ 등)
  fixed = removeDuplicateBraces(fixed);

  fixed = fixed.replace(/("\w+Array":\s*\[[^\]]+\])"/g, "$1");
  fixed = fixed.replace(/""/g, '"');
  fixed = fixed.replace(/,(\s*[}\]])/g, "$1");
  fixed = fixed.replace(/\\\\n/g, "\\n");

  return fixed;
};

/**
 * 중복된 외부 중괄호를 제거
 * JSON 파싱 기반 접근: 파싱될 때까지 바깥 중괄호 제거
 * 어떤 중복 패턴이든 처리 가능: {{, {{{, {{{{, 비대칭 등
 */
const removeDuplicateBraces = (text) => {
  let cleaned = text.trim();
  let attempts = 0;
  const maxAttempts = 10; // 무한 루프 방지

  while (attempts < maxAttempts) {
    // 1단계: 현재 상태로 파싱 시도
    try {
      const parsed = JSON.parse(cleaned);
      // 파싱 성공! 그대로 반환
      if (attempts > 0 && process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(`✅ 중복 제거 성공 (${attempts}회 시도)`);
      }
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      // 파싱 실패, 계속 진행
    }

    // 2단계: 시작과 끝 중괄호 체크
    const firstChar = cleaned[0];
    const lastChar = cleaned[cleaned.length - 1];

    // 중괄호로 시작하고 끝나지 않으면 더 이상 제거 불가
    if (firstChar !== "{" || lastChar !== "}") {
      if (process.env.NODE_ENV === "DEVELOPMENT" && attempts > 0) {
        console.log(`⚠️ 중복 제거 중단: 중괄호 형식 아님 (${attempts}회 시도)`);
      }
      return cleaned; // 원본 반환
    }

    // 3단계: 바깥 중괄호 하나 제거해보기
    const candidate = cleaned.substring(1, cleaned.length - 1).trim();

    // 제거 후 빈 문자열이면 중단
    if (!candidate) {
      return cleaned;
    }

    // 4단계: 제거한 결과로 다시 시도
    if (attempts === 0 && process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(`🔧 중복 중괄호 제거 시도 중...`);
    }

    cleaned = candidate;
    attempts++;
  }

  // 최대 시도 횟수 초과
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(`⚠️ 최대 시도 횟수 초과 (${maxAttempts}회)`);
  }
  return cleaned;
};

const removeTrailingGarbage = (content) => {
  let trimmed = content;

  while (trimmed.length > 0) {
    const lastChar = trimmed[trimmed.length - 1];

    if (/[}\]"']/.test(lastChar)) {
      break;
    }

    if (/[\s,]/.test(lastChar)) {
      trimmed = trimmed.slice(0, -1);
      continue;
    }

    trimmed = trimmed.slice(0, -1);
  }

  return trimmed;
};

const convertQuotes = (str) => {
  let result = "";
  let inString = false;
  let currentQuote = null;
  let escapeNext = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }

    if (char === "\\") {
      result += char;
      escapeNext = true;
      continue;
    }

    if ((char === '"' || char === "'") && !inString) {
      inString = true;
      currentQuote = char;
      result += '"';
    } else if (char === currentQuote && inString) {
      inString = false;
      currentQuote = null;
      result += '"';
    } else {
      result += char;
    }
  }

  return result;
};

const safeJSONParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.log("safeJSONParse 실패:", error.message);
    return null;
  }
};

const isValidJSONString = (str) => {
  try {
    const parsed = JSON.parse(str);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed);
  } catch (error) {
    return false;
  }
};

const debugJSONInfo = (str) => {
  console.log("=== JSON 디버그 정보 ===");
  console.log("길이:", str.length);
  console.log("첫 50자:", str.substring(0, 50));
  console.log("마지막 50자:", str.substring(str.length - 50));
  console.log("첫 번째 {:", str.indexOf("{"));
  console.log("마지막 }:", str.lastIndexOf("}"));

  const braceCount = (str.match(/{/g) || []).length;
  const closeBraceCount = (str.match(/}/g) || []).length;
  console.log("{ 개수:", braceCount);
  console.log("} 개수:", closeBraceCount);
  console.log("======================");
};

/**
 * 언어별로 유효하지 않은 문자를 감지하는 함수 (삭제하지 않고 감지만)
 * @param {string} text - 검사할 텍스트
 * @param {string} language - 언어 타입
 * @returns {Object} - { text: string, hasInvalidChars: boolean }
 */
const filterInvalidCharacters = (text, language = "Korean language") => {
  if (!text || typeof text !== "string") {
    return { text, hasInvalidChars: false };
  }

  // 1. 깨진 문자 (U+FFFD replacement character) 감지
  const hasReplacementChar = /\uFFFD/.test(text);

  if (hasReplacementChar) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error("깨진 문자(�) 발견:", text.substring(0, 100));
    }
    return { text, hasInvalidChars: true };
  }

  // 2. 언어별 심각한 인코딩 오류 감지 (제어 문자 등)
  // 정상적인 텍스트는 그대로 통과
  const hasControlChars =
    /[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/.test(text);

  if (hasControlChars) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error("제어 문자 발견");
    }
    return { text, hasInvalidChars: true };
  }

  // 정상 텍스트는 그대로 반환
  return { text, hasInvalidChars: false };
};

module.exports = {
  stripOuterBraces,
  safeJSONParse,
  isValidJSONString,
  debugJSONInfo,
  filterInvalidCharacters,
};
