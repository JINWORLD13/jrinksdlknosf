const chargeRouter = require("express").Router();
const { chargeController } = require("../../domains/charge/controllers/index");
const checkTokenWithRefresh = require("../middlewares/checkTokenWithRefresh");

chargeRouter.post(
  "/toss/prepare",
  checkTokenWithRefresh,
  chargeController.postPrePaymentForToss
);
chargeRouter.get(
  "/toss/prepare",
  checkTokenWithRefresh,
  chargeController.getPrePaymentForToss
);
chargeRouter.delete(
  "/toss/prepare",
  checkTokenWithRefresh,
  chargeController.deletePrePaymentForTossByOrderId
);
chargeRouter.delete(
  "/toss/prepare/by-key",
  checkTokenWithRefresh,
  chargeController.deletePrePaymentForTossByPaymentKey
);
chargeRouter.put(
  "/toss/prepare",
  checkTokenWithRefresh,
  chargeController.putPrePaymentForToss
);
chargeRouter.post(
  "/toss/confirm",
  checkTokenWithRefresh,
  chargeController.postConfirmForToss
);
//! toss 젠체/부분환불
chargeRouter.post(
  "/toss/refund",
  checkTokenWithRefresh,
  chargeController.postPartialCancelForToss
);

//! toss 가상계좌 입금 및 환불 상태 알림 (웹훅)
chargeRouter.post("/hook/toss/payment", chargeController.postWebHookForToss);

//& 인앱결제(구글플레이스토어)
chargeRouter.post(
  "/mobile/verify",
  checkTokenWithRefresh,
  chargeController.postChargeForGooglePayStore
);
//& 인앱결제 환불처리(푸시 구독 방식-웹훅 -구글에서 여기로 요청 오는데 시간이 8분 소요)(구글플레이스토어)
//! 사용자 검증할 필요 없을듯. 어차피 지연되고, 그 사이에 사용자 로그아웃 하면 큰일.
//~ 엔드포인트 url 설정은, gcp pub/sub의 구독에서 수정버튼 누르거나 생성버튼 누르면 나오는 푸시 + 엔드포인트url에 설정.
chargeRouter.post(
  "/hook/google/subscription",
  chargeController.postRefundForGooglePlayStore
);

// db에 해당 productId 몇개 있는지 알리는 것
chargeRouter.get(
  "/purchase-limit",
  checkTokenWithRefresh,
  chargeController.getPurchaseLimit
);

// 초심자 패키지 orderId 조회
chargeRouter.get(
  "/beginner-package-order-ids",
  checkTokenWithRefresh,
  chargeController.getBeginnerPackageOrderIds
);

module.exports = chargeRouter;
