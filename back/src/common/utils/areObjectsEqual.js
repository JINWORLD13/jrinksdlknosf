// 일반적인 JSON 직렬화 가능한 데이터(객체, 배열, 숫자, 문자열, 불리언, null) 비교에는 충분히 잘 동작합니다.
// 특수 객체나 함수, Date 등은 별도 처리가 필요합니다.
// null과 undefined는 다르게 취급합니다.
// 함수, Symbol, Map, Set, Date, RegExp 등 특수 객체는 제대로 비교하지 못합니다.
// NaN 값은 서로 다르다고 판단합니다.
// 프로토타입 체인, getter/setter 등은 무시합니다.
// strict equality(===)로 비교하므로, 1과 '1'은 다르다고 나옵니다.

const areObjectsEqual = (obj1, obj2) => {
  // 1. 키 배열 가져오기
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // 2. 키 개수 비교
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 3. 키 정렬 (순서 무시)
  keys1.sort();
  keys2.sort();

  // 4. 키 동일성 확인
  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) {
      return false;
    }
  }

  // 5. 값 비교
  for (const key of keys1) {
    const val1 = obj1[key];
    const val2 = obj2[key];

    // 배열일 경우
    if (Array.isArray(val1) && Array.isArray(val2)) {
      if (val1.length !== val2.length) {
        return false;
      }
      for (let i = 0; i < val1.length; i++) {
        if (
          typeof val1[i] === "object" &&
          val1[i] !== null &&
          typeof val2[i] === "object" &&
          val2[i] !== null
        ) {
          if (!areObjectsEqual(val1[i], val2[i])) {
            return false;
          }
        } else if (val1[i] !== val2[i]) {
          return false;
        }
      }
    }
    // 객체일 경우
    else if (
      typeof val1 === "object" &&
      val1 !== null &&
      typeof val2 === "object" &&
      val2 !== null
    ) {
      if (!areObjectsEqual(val1, val2)) {
        return false;
      }
    }
    // 기본 타입일 경우
    else if (val1 !== val2) {
      return false;
    }
  }

  return true;
};

module.exports = areObjectsEqual;
