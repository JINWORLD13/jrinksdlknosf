const extractDaysFromProductId = require("./extractDaysFromProductId");

/**
 * orderName에서 일수 추출
 * @param {string} orderName - 주문 이름 (예: "Normal Tarot 3-Day Free Pass", "Normal Tarot 7-Day Free Pass")
 * @returns {number|null} 일수 또는 null
 */
const extractDaysFromOrderName = (orderName) => {
  if (!orderName || typeof orderName !== "string") {
    return null;
  }

  // "Normal Tarot X-Day Free Pass" 형식에서 일수 추출
  const match = orderName.match(/(\d+)-Day/i);
  if (match && match[1]) {
    const days = Number(match[1]);
    return isNaN(days) ? null : days;
  }

  return null;
};

/**
 * productId 또는 orderName에서 일수 추출
 * @param {string} productId - 상품 ID (선택사항)
 * @param {string} orderName - 주문 이름 (선택사항)
 * @returns {number|null} 일수 또는 null
 */
const extractDays = (productId = null, orderName = null) => {
  // productId에서 먼저 추출 시도
  if (productId) {
    const days = extractDaysFromProductId(productId);
    if (days !== null) {
      return days;
    }
  }

  // orderName에서 추출 시도
  if (orderName) {
    const days = extractDaysFromOrderName(orderName);
    if (days !== null) {
      return days;
    }
  }

  return null;
};

/**
 * 광고제거 또는 보통타로 무료 이용권인지 확인
 * @param {string} productId - 상품 ID (선택사항)
 * @param {string} orderName - 주문 이름 (선택사항)
 * @returns {boolean} 광고제거 또는 무료 이용권인지 여부
 */
const isAdsFreePassProduct = (productId = null, orderName = null) => {
  const productIdLower = (productId || "").toLowerCase();
  const orderNameLower = (orderName || "").toLowerCase();

  const isAdsRemover =
    productIdLower.includes("ads") && productIdLower.includes("remover");
  const isNormalTarotFree =
    (productIdLower.includes("normal") &&
      (productIdLower.includes("tarot") || productIdLower.includes("free"))) ||
    productIdLower.includes("free_pass") ||
    orderNameLower.includes("normal tarot") ||
    orderNameLower.includes("free pass");

  return isAdsRemover || isNormalTarotFree;
};

module.exports = {
  extractDaysFromOrderName,
  extractDays,
  isAdsFreePassProduct,
};






