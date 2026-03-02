/**
 * 원본 에러를 도메인 에러 이름으로 감싸서 반환합니다.
 * Error.name, Error.stack에 직접 할당하지 않고 defineProperty를 사용해 readonly 이슈를 피합니다.
 * @param {Error} originalError - 원본 에러
 * @param {string} errorName - commonErrors 상수 (에러 식별자)
 * @param {{ statusCode?: number }} [options] - statusCode 등 추가 속성
 * @returns {Error}
 */
function wrapError(originalError, errorName, options = {}) {
  const message = originalError?.message ?? String(originalError);
  const e = new Error(message);
  Object.defineProperty(e, "name", {
    value: errorName,
    configurable: true,
    enumerable: false,
  });
  if (originalError?.stack) {
    Object.defineProperty(e, "stack", {
      value: originalError.stack,
      configurable: true,
      enumerable: false,
    });
  }
  if (options.statusCode !== undefined) {
    e.statusCode = options.statusCode;
  } else if (originalError?.statusCode !== undefined) {
    e.statusCode = originalError.statusCode;
  }
  return e;
}

module.exports = { wrapError };
