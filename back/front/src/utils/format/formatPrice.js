export const formatPrice = (priceMicros, currencyCode, browserLanguage) => {
  if (!priceMicros || !currencyCode) return 'Price not available';

  const priceInUnits = priceMicros / 1000000;

  if (currencyCode === 'KRW') {
    // KRW의 경우 소수점 이하를 정확히 표시
    const wholePart = Math.floor(priceInUnits);
    const fractionalPart = priceInUnits - wholePart;

    if (fractionalPart === 0) {
      // 정수인 경우
      return new Intl.NumberFormat(browserLanguage, {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(wholePart);
    } else {
      // 소수점이 있는 경우
      return `${new Intl.NumberFormat(browserLanguage, {
        style: 'currency',
        currency: 'KRW',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(wholePart)}.${(fractionalPart * 100)
        .toFixed(0)
        .padStart(2, '0')}`;
    }
  } else {
    // 다른 통화의 경우 기존 방식대로 처리
    return new Intl.NumberFormat(browserLanguage, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(priceInUnits);
  }
};
