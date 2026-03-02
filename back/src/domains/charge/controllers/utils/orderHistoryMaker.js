//! 결과물 모습
// {
//   1: [
//     2,
//     "listPrice-NA",
//     "salePercentage-NA",
//     "originalPrice-NA",
//     "ORDER123",
//     "2023-07-22T12:34:56Z",
//     "browswerLanguage-NA",
//     "currencyCode-NA",
//     "paymentKey-NA",
//     "method-NA",
//   ],
//   3: [
//     1,
//     "listPrice-NA",
//     "salePercentage-NA",
//     "originalPrice-NA",
//     "ORDER123",
//     "2023-07-22T12:34:56Z",
//     "browswerLanguage-NA",
//     "currencyCode-NA",
//     "paymentKey-NA",
//     "method-NA",
//   ],
// };
//? 광고 제거 이용권은 해당 안됨.

const localTimeToUTC = require("../../../../common/utils/localTimeToUTC");

/**
 * 패키지 ID에 따른 keyToMultiplier 객체를 반환하는 함수
 * @param {string} packageId - 패키지 ID (elem?.id)
 * @returns {Object|null} keyToMultiplier 객체 또는 null
 */
const getPackageKeyMultiplier = (packageId) => {
  // 기본 키 구조
  const defaultKeys = [1, 2, 3, 4, 5, 6, 10];

  // 패키지별 설정
  const packageConfigs = {
    [process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE]: {
      1: 4,
      2: 4,
      3: 4,
      4: 4,
      5: 4,
      6: 4,
      10: 4,
    },
    [process.env.COSMOS_PRODUCT_PACKAGE_1]: { targetKey: 1, quantity: 10 },
    [process.env.COSMOS_PRODUCT_PACKAGE_2]: { targetKey: 2, quantity: 10 },
    [process.env.COSMOS_PRODUCT_PACKAGE_3]: { targetKey: 3, quantity: 10 },
    [process.env.COSMOS_PRODUCT_PACKAGE_4]: { targetKey: 4, quantity: 10 },
    [process.env.COSMOS_PRODUCT_PACKAGE_5]: { targetKey: 5, quantity: 10 },
    [process.env.COSMOS_PRODUCT_PACKAGE_6]: { targetKey: 6, quantity: 10 },
    [process.env.COSMOS_PRODUCT_PACKAGE_10]: { targetKey: 10, quantity: 10 },
  };

  const config = packageConfigs[packageId];

  if (!config) {
    return null;
  }

  // newbie 패키지는 이미 완성된 객체를 반환
  if (packageId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE) {
    return config;
  }

  // 다른 패키지들은 targetKey만 quantity개, 나머지는 0
  const keyToMultiplier = {};
  defaultKeys.forEach((key) => {
    keyToMultiplier[key] = key === config.targetKey ? config.quantity : 0;
  });

  return keyToMultiplier;
};

/**
 * lastId와 elem.id를 검증하고 keyToMultiplier를 반환하는 함수
 * @param {string} lastId - URL에서 추출한 마지막 ID
 * @param {string} elemId - elem?.id
 * @returns {Object|null} keyToMultiplier 객체 또는 null
 */
const getKeyMultiplierByLastId = (lastId, elemId) => {
  // lastId와 elemId 매핑 테이블
  const idMappings = {
    newbie: process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE,
    1: process.env.COSMOS_PRODUCT_PACKAGE_1,
    2: process.env.COSMOS_PRODUCT_PACKAGE_2,
    3: process.env.COSMOS_PRODUCT_PACKAGE_3,
    4: process.env.COSMOS_PRODUCT_PACKAGE_4,
    5: process.env.COSMOS_PRODUCT_PACKAGE_5,
    6: process.env.COSMOS_PRODUCT_PACKAGE_6,
    10: process.env.COSMOS_PRODUCT_PACKAGE_10,
  };

  // lastId에 해당하는 예상 패키지 ID
  const expectedPackageId = idMappings[lastId];

  // elemId가 예상 패키지 ID와 일치하는지 확인
  if (expectedPackageId && elemId === expectedPackageId) {
    return getPackageKeyMultiplier(elemId);
  }

  return null;
};

// 중복되는 keys 배열을 상수로 빼내기
const VOUCHER_KEYS = [1, 2, 3, 4, 5, 6, 10];

// 중복되는 배열 생성 로직을 함수로 만들기
const createVoucherArray = (
  quantity,
  productId,
  orderId,
  purchaseDate,
  purchaseToken,
  packageName,
  expiryDate = ""
) => {
  return [
    quantity,
    "NA",
    "NA",
    productId,
    orderId,
    purchaseDate,
    "NA",
    "NA",
    purchaseToken,
    packageName,
    expiryDate,
  ];
};

const orderHistoryMaker = ({
  products = [], // (인앱결제) [{"id":"cosmos_vouchers_1"}] 이렇게 나옴
  quantity = 0,
  productId = "",
  orderId = "",
  purchaseDate = new Date(),
  purchaseToken = "",
  packageName = "",
  zd = 0, // 현 노드 실행 환경의 타임존 기준 UTC offset(단위: 시간)
}) => {
  return {
    ...products.reduce((acc, elem) => {
      const idArr = elem?.id?.split("_");
      //! "cosmos_vouchers_ads_remover_3d"이면 걸러짐
      if (idArr?.includes("ads") && idArr?.includes("remover")) return;
      const lastId = idArr[idArr.length - 1];
      const num = Number(lastId);
      const isIntegerStr = Number.isInteger(num) && !isNaN(num);
      if (quantity > 0 && isIntegerStr && !idArr.includes("package")) {
        //& cosmos_vouchers_1인 끝에 번호인 productId만 가능...
        acc[`${lastId}`] = [
          elem?.quantity || quantity,
          "NA",
          "NA",
          productId,
          orderId,
          purchaseDate,
          "NA",
          "NA",
          purchaseToken,
          packageName,
        ];
      } else if (quantity > 0 && idArr.includes("package")) {
        //& 패키지용으로 씀
        if (
          lastId === "expired" &&
          elem?.id === process.env.COSMOS_PRODUCT_EVENT_PACKAGE
        ) {
          //? 단기 이벤트
          // 각 key에 곱할 계수를 객체로 관리
          const keyToMultiplier = {
            1: 10,
            2: 10,
            3: 20,
            4: 10,
            5: 10,
            6: 10,
            10: 20,
          };
          VOUCHER_KEYS.forEach((key) => {
            const multiplier = keyToMultiplier[key];
            if (multiplier > 0) {
              const newQuantity = (elem?.quantity ?? quantity) * multiplier;
              // 기존 값이 있으면 수량을 합산
              if (acc[key]) {
                acc[key] = createVoucherArray(
                  acc[key][0] + newQuantity, // 기존 수량 + 새 수량
                  productId,
                  orderId,
                  purchaseDate,
                  purchaseToken,
                  packageName,
                  localTimeToUTC(zd, 2025, 8, 26, 0, 0, 0) // 만료일(처음 구매했던 시각의 브라우저 세팅 기준)
                );
              } else {
                acc[key] = createVoucherArray(
                  newQuantity,
                  productId,
                  orderId,
                  purchaseDate,
                  purchaseToken,
                  packageName,
                  localTimeToUTC(zd, 2025, 8, 26, 0, 0, 0) // 만료일(처음 구매했던 시각의 브라우저 세팅 기준)
                );
              }
            }
          });
        } else if (elem?.id.includes(process.env.COSMOS_PRODUCT_PACKAGE)) {
          const keyToMultiplier = getKeyMultiplierByLastId(lastId, elem?.id);
          if (keyToMultiplier) {
            // keyToMultiplier를 사용하는 로직

            VOUCHER_KEYS.forEach((key) => {
              const multiplier = keyToMultiplier[key];
              if (multiplier > 0) {
                const newQuantity = (elem?.quantity ?? quantity) * multiplier;
                // 기존 값이 있으면 수량을 합산
                if (acc[key]) {
                  acc[key] = createVoucherArray(
                    acc[key][0] + newQuantity, // 기존 수량 + 새 수량
                    productId,
                    orderId,
                    purchaseDate,
                    purchaseToken,
                    packageName
                  );
                } else {
                  acc[key] = createVoucherArray(
                    newQuantity,
                    productId,
                    orderId,
                    purchaseDate,
                    purchaseToken,
                    packageName
                  );
                }
              }
            });
          }
          //? 단기 이벤트
          // 각 key에 곱할 계수를 객체로 관리
        }
      }
      return acc;
    }, {}),
  };
};

module.exports = orderHistoryMaker;
