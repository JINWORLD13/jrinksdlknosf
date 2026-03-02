const checkViolationInGoogleInAppRefund = (res, userInfo) => {
  const limitedCountOfViolations = 3;
  const violations = structuredClone(userInfo?.violationsInDetail) || [];

  // 1. 전체 위반 횟수 체크
  if (violations.length >= limitedCountOfViolations) {
    // 2. 그 중에서 GoogleInAppRefund 위반 횟수 체크
    const googleRefundViolations = violations?.filter(
      elem => elem[0] === "GoogleInAppRefund"
    );

    if (googleRefundViolations.length >= limitedCountOfViolations) {
      res.status(500).json({ 
        success: false, 
        message: "violated in GoogleInAppRefund" 
      });
      return true; // 위반 발견
    }
  }
  
  return false; // 위반 없음
};

module.exports = {
  checkViolationInGoogleInAppRefund,
};