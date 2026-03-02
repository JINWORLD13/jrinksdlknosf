const wrapError = require("./wrapError");

/**
 * 에러 이름과 옵션을 받아 새로운 포장된 에러를 생성합니다.
 * エラー名とオプションを受け取り、新しくラップされたエラーを生成します。
 * Creates a new wrapped error from an error name and options.
 *
 * @param {string} errorName - 에러 이름 (commonErrors 상수) / エラー名 (commonErrors 定数) / Error name (commonErrors constant)
 * @param {Object} [options={}] - 추가 옵션 (statusCode 등) / 追加オプション (statusCode など) / Additional options (statusCode etc.)
 * @returns {Error} 포장된 에러 객체 / ラップされたエラーオブジェクト / Wrapped error object
 */
function createError(errorName, options = {}) {
  const e = new Error(errorName);
  return wrapError(e, errorName, options);
}

module.exports = createError;
