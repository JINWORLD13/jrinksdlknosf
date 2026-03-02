const extractDaysFromProductId = require("./extractDaysFromProductId");
const { isAdsFreePassProduct } = require("./extractDaysFromOrderName");

/**
 * 광고제거 이용권 또는 보통타로 무료 이용권 구매 가능 여부 확인
 * @param {Object} userInfo - 사용자 정보
 * @param {string} productId - 구매하려는 상품 ID
 * @param {string} orderName - 주문 이름 (선택사항)
 * @returns {Object} { allowed: boolean, reason: string }
 */
const checkAdsFreePassPurchaseAllowed = (userInfo, productId, orderName = null) => {
  // 사용자 정보가 없으면 구매 불가
  if (!userInfo) {
    return {
      allowed: false,
      reason: "User information not found",
    };
  }

  // productId와 orderName 모두 없으면 구매 불가
  if (!productId && !orderName) {
    return {
      allowed: false,
      reason: "Product ID or order name not provided",
    };
  }

  // productId 또는 orderName에서 광고제거/무료 이용권 여부 확인
  const isAdsRemoverOrFreePass = isAdsFreePassProduct(productId, orderName);

  // 광고제거 또는 보통타로 무료 이용권이 아니면 구매 허용
  if (!isAdsRemoverOrFreePass) {
    return {
      allowed: true,
      reason: "Not an ads remover or free pass product",
    };
  }

  // 사용자가 이미 유효한 adsFreePass를 가지고 있는지 확인
  const adsFreePass = userInfo?.adsFreePass;
  if (
    adsFreePass &&
    adsFreePass?.name &&
    adsFreePass?.orderId &&
    adsFreePass?.expired
  ) {
    // 만료일 확인
    const expiredDate = new Date(adsFreePass.expired);
    const currentDate = new Date();

    // 만료일이 미래이면 구매 불가
    if (expiredDate > currentDate) {
      return {
        allowed: false,
        reason: "User already has an active ads free pass or free voucher",
      };
    }
  }

  // 구매 허용
  return {
    allowed: true,
    reason: "No active ads free pass or free voucher found",
  };
};

/**
 * 같은 일수의 광고제거와 보통타로 무료 이용권을 같은 아이템으로 취급하는지 확인
 * @param {string} productId1 - 첫 번째 상품 ID
 * @param {string} productId2 - 두 번째 상품 ID
 * @returns {boolean} 같은 아이템인지 여부
 */
const isSameAdsFreePassProduct = (productId1, productId2) => {
  if (!productId1 || !productId2) {
    return false;
  }

  const days1 = extractDaysFromProductId(productId1);
  const days2 = extractDaysFromProductId(productId2);

  // 둘 다 일수를 추출할 수 있고, 일수가 같으면 같은 아이템
  if (days1 !== null && days2 !== null && days1 === days2) {
    // 둘 다 광고제거 또는 보통타로 무료 이용권인지 확인
    const productId1Lower = productId1.toLowerCase();
    const productId2Lower = productId2.toLowerCase();

    const isProduct1AdsFree =
      (productId1Lower.includes("ads") &&
        productId1Lower.includes("remover")) ||
      (productId1Lower.includes("normal") &&
        (productId1Lower.includes("tarot") ||
          productId1Lower.includes("free"))) ||
      productId1Lower.includes("free_pass");

    const isProduct2AdsFree =
      (productId2Lower.includes("ads") &&
        productId2Lower.includes("remover")) ||
      (productId2Lower.includes("normal") &&
        (productId2Lower.includes("tarot") ||
          productId2Lower.includes("free"))) ||
      productId2Lower.includes("free_pass");

    return isProduct1AdsFree && isProduct2AdsFree;
  }

  return false;
};

module.exports = {
  checkAdsFreePassPurchaseAllowed,
  isSameAdsFreePassProduct,
  extractDaysFromProductId,
};

