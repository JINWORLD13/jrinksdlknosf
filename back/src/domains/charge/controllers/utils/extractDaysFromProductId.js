/**
 * productId에서 일수 추출
 * @param {string} productId - 상품 ID (예: "cosmos_vouchers_ads_remover_3d", "normal_tarot_free_3d")
 * @returns {number|null} 일수 또는 null
 */
const extractDaysFromProductId = (productId) => {
  if (!productId || typeof productId !== "string") {
    return null;
  }

  const productIdSplitArr = productId.split("_");
  
  // 광고제거 이용권: "cosmos_vouchers_ads_remover_3d" -> 3
  if (
    productIdSplitArr.includes("ads") &&
    productIdSplitArr.includes("remover")
  ) {
    const lastPart = productIdSplitArr[productIdSplitArr.length - 1];
    const date = lastPart.split("d")[0];
    const days = Number(date);
    return isNaN(days) ? null : days;
  }

  // 보통타로 무료 이용권: "normal_tarot_free_3d" 또는 유사한 패턴
  if (
    productIdSplitArr.includes("normal") &&
    (productIdSplitArr.includes("tarot") || productIdSplitArr.includes("free"))
  ) {
    // 마지막 부분에서 일수 추출
    const lastPart = productIdSplitArr[productIdSplitArr.length - 1];
    const date = lastPart.split("d")[0];
    const days = Number(date);
    return isNaN(days) ? null : days;
  }

  // 다른 패턴도 지원 (예: "free_pass_7d")
  const lastPart = productIdSplitArr[productIdSplitArr.length - 1];
  if (lastPart && lastPart.endsWith("d")) {
    const date = lastPart.split("d")[0];
    const days = Number(date);
    if (!isNaN(days)) {
      return days;
    }
  }

  return null;
};

module.exports = extractDaysFromProductId;






