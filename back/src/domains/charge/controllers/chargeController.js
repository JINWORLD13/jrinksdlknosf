const { sanitizeObject, buildResponse } = require("../../../common/utils/util");
const AppError = require("../../../common/errors/AppError");
const commonErrors = require("../../../common/errors/commonErrors");
const { chargeService } = require("../services");
const { chargeRepository } = require("../repositories/index");
const { userService } = require("../../user/services");
const { violationService } = require("../../violation/services");
const axios = require("axios");
const { consoleForReceipt } = require("../../../common/utils/console");
const {
  verifyPurchaseWithGooglePlay,
} = require("../../../api/middlewares/verifyPurchaseWithGooglePlay");
const orderHistoryMaker = require("./utils/orderHistoryMaker");
const orderVouchersArrMaker = require("./utils/orderVouchersArrMaker");
const orderNameMaker = require("./utils/orderNameMaker");
const updatedVouchersInDetailMaker = require("./utils/updatedVouchersInDetailMaker");
const updatedVouchersMaker = require("./utils/updatedVouchersMaker");
const adsFreePassExpiredDateMaker = require("./utils/adsFreePassExpiredDateMaker");
const {
  checkAdsFreePassPurchaseAllowed,
  isSameAdsFreePassProduct,
  extractDaysFromProductId,
} = require("./utils/checkAdsFreePassPurchaseAllowed");
const {
  extractDaysFromOrderName,
  extractDays,
  isAdsFreePassProduct,
} = require("./utils/extractDaysFromOrderName");
const cacheClient = require("../../../cache/cacheClient");
const mongoose = require("mongoose");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const tossWebhookHandlers = require("./handlers/tossWebhookHandlers");
const tossPaymentsClient = require("./clients/tossPaymentsClient");
const googlePlayRefundHandler = require("./handlers/googlePlayRefundHandler");

// Redis 키 관리를 위한 헬퍼 함수들
// Redisキー管理用ヘルパー関数
// Helper functions for Redis key management
const RedisKeys = {
  user: (userId) => `user:${userId}`,
  requestCount: (orderId) => `refund:count:${orderId}`,
  vouchersForRefund: (orderId) => `refund:vouchers:${orderId}`,
  googleOrderId: () => `refund:google:current`,
  paymentProgress: (userId, orderId) => `payment:progress:${userId}:${orderId}`,
  webhookProcessed: (orderId, status) => `webhook:${orderId}:${status}`,
  purchaseLimit: (productId, userId) => `cache:limit:${productId}:${userId}`,
};

let remainingPercentage = 1 - Number(process.env.COSMOS_REFUND_CANCEL_PERCENTAGE);

const chargeController = {
  // 구매 제한 확인 - Redis 캐싱 적용
  async getPurchaseLimit(req, res, next) {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    req.user = userId;
    const productId = req.query.productId;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    try {
      // Redis에서 캐시된 결과 확인
      const cacheKey = RedisKeys.purchaseLimit(productId, userId);
      const cachedResult = await cacheClient.get(cacheKey);

      if (cachedResult) {
        // console.log("Purchase limit cache hit");
        return res
          .status(200)
          .json({ success: true, purchaseLimit: cachedResult.limit });
      }

      // console.log("Purchase limit cache miss");

      // DB에서 조회
      const purchaseLimitArr =
        await chargeService.getChargesByProductId(productId);
      if (!purchaseLimitArr) {
        return res
          .status(404)
          .json({ success: false, message: "Purchase limit not found" });
      }

      const userInDB = await userService.getUserById(userId);
      const hasUserPurchased = purchaseLimitArr.some((charge) => {
        return charge?.userId?.equals(userInDB?._id);
      });

      // 초심자 패키지의 경우: 이미 구매했다면 1, 아니면 0
      // (최대 구매 가능 수량 1개)
      if (
        productId === process.env.VITE_COSMOS_VOUCHERS_BUNDLE_PACKAGE_NEWBIE ||
        productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE
      ) {
        // userInDB의 purchased.packageForNewbie도 체크 (웹/앱 연동)
        const hasPurchasedFlag =
          userInDB?.purchased?.packageForNewbie || hasUserPurchased;
        const finalLimit = hasPurchasedFlag ? 1 : 0;

        // Redis에 캐싱 (1시간)
        await cacheClient.set(
          cacheKey,
          { limit: finalLimit, hasUserPurchased: hasPurchasedFlag },
          3600,
        );

        return res
          .status(200)
          .json({ success: true, purchaseLimit: finalLimit });
      }

      let OverCountToStopFromPurchasingAgain = hasUserPurchased
        ? 1000000000000000
        : 0;
      let finalLimit;

      if (productId === process.env.COSMOS_PRODUCT_EVENT_PACKAGE) {
        finalLimit =
          purchaseLimitArr?.length + OverCountToStopFromPurchasingAgain;
      }

      // Redis에 캐싱 (1시간)
      await cacheClient.set(
        cacheKey,
        { limit: finalLimit, hasUserPurchased },
        3600,
      );

      res.status(200).json({ success: true, purchaseLimit: finalLimit });
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error fetching purchase limit:", error);
      }
      next(new AppError(error?.message, commonErrors.chargeController, 500));
    }
  },

  // 사전 결제 - 중복 방지 적용
  // 事前決済 - 重複防止適用
  // Pre-payment - duplicate prevention
  async postPrePaymentForToss(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;

      if (!req?.isAuthenticated()) {
        return next(
          new AppError(
            commonErrors.chargeControllerPostPrePaymentForTossError,
            commonErrors.userNotFoundError,
            404,
          ),
        );
      }

      const {
        orderId,
        paymentKey,
        orderName,
        orderHistory,
        orderVouchersArr,
        amount,
        currency,
        country,
        method,
        apiName,
        adsFreePassAmount,
        productId, // 무료 이용권의 productId 추가
      } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID is required",
        });
      }

      // 결제 진행 중인지 Redis에서 확인
      const progressKey = RedisKeys.paymentProgress(userId, orderId);
      const isInProgress = await cacheClient.exists(progressKey);

      if (isInProgress) {
        return res.status(200).json({
          success: false,
          message: "Payment already in progress.",
          status: "in_progress",
          orderId,
          action: "check_status",
        });
      }

      // 결제 진행 상태를 Redis에 설정 (1분)
      await cacheClient.set(progressKey, "in_progress", 60);

      try {
        const userInDB = await userService.getUserById(userId);

        // 초심자 패키지 중복 구매 방지 체크
        // orderName에 "초심자 패키지"가 포함되어 있는지 확인
        const hasNewbieInOrderName =
          orderName && orderName.includes("초심자 패키지");

        // productId가 초심자 패키지이거나 orderName에 초심자 패키지가 포함된 경우에만 체크
        // productId가 undefined이거나 빈 문자열이면 체크하지 않음
        if (
          (productId &&
            (productId ===
              process.env.VITE_COSMOS_VOUCHERS_BUNDLE_PACKAGE_NEWBIE ||
              productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE)) ||
          hasNewbieInOrderName
        ) {
          // userInDB.purchased.packageForNewbie가 웹/앱 연동을 위한 가장 정확한 정보
          // 한 번이라도 구매했다면 이 플래그가 true가 되어야 함
          if (userInDB?.purchased?.packageForNewbie) {
            await cacheClient.del(progressKey);
            if (process.env.NODE_ENV === "DEVELOPMENT") {
              console.log("Duplicate newbie package purchase attempt detected");
              console.log("orderName:", orderName);
              console.log("productId:", productId);
              console.log(
                "userInDB.purchased.packageForNewbie:",
                userInDB?.purchased?.packageForNewbie,
              );
            }
            return res.status(400).json({
              success: false,
              message: "초심자 패키지는 계정당 1회만 구매 가능합니다.",
            });
          }
        }

        // 무료 이용권인 경우 adsFreePass 생성 및 구매 가능 여부 확인
        let adsFreePass = {};
        let productIdForAdsFree = null;
        if (adsFreePassAmount && adsFreePassAmount > 0) {
          // productId가 무료 이용권인 경우에만 사용
          // 초심자 패키지와 함께 구매할 때는 productId가 초심자 패키지일 수 있으므로
          // 무료 이용권 productId를 별도로 처리
          if (productId && isAdsFreePassProduct(productId, orderName)) {
            productIdForAdsFree = productId;
          } else {
            // orderName에서 일수 추출 시도
            const days = extractDays(null, orderName);
            if (days !== null) {
              // 일수가 추출되면 productId 생성
              productIdForAdsFree = `cosmos_vouchers_ads_remover_${days}d`;
            } else {
              // 기본값 사용
              productIdForAdsFree =
                process.env.COSMOS_PRODUCT_ADS_REMOVER ||
                "cosmos_vouchers_ads_remover_3d";
            }
          }

          const purchaseDate = new Date().toISOString();

          // 구매 가능 여부 확인
          const purchaseCheck = checkAdsFreePassPurchaseAllowed(
            userInDB,
            productIdForAdsFree,
            orderName,
          );

          if (!purchaseCheck.allowed) {
            await cacheClient.del(progressKey);
            return res.status(400).json({
              success: false,
              message: purchaseCheck.reason,
            });
          }

          const adsFreePassExpiredDate = adsFreePassExpiredDateMaker({
            productId: productIdForAdsFree,
            purchaseDate: purchaseDate,
          });

          if (adsFreePassExpiredDate !== "" && adsFreePassExpiredDate) {
            // orderName이 없으면 일수 기반으로 생성
            const finalOrderName =
              orderName ||
              (extractDays(productIdForAdsFree, null) !== null
                ? `Normal Tarot ${extractDays(
                    productIdForAdsFree,
                    null,
                  )}-Day Free Pass`
                : "Normal Tarot 3-Day Free Pass");

            adsFreePass = {
              name: finalOrderName,
              orderId: orderId,
              expired: adsFreePassExpiredDate,
            };
          }
        }

        let createdChargeInfo;
        const chargeData = {
          orderId,
          paymentKey,
          orderName,
          orderHistory,
          orderVouchers: orderVouchersArr,
          amount,
          currency,
          country,
          method,
          apiName,
          userId: userInDB,
        };

        // productId가 있으면 추가
        if (productId) {
          chargeData.productId = productId;
        }

        // adsFreePass가 있으면 추가
        if (adsFreePass && Object.keys(adsFreePass).length > 0) {
          chargeData.adsFreePass = adsFreePass;
        }

        if (method === "가상계좌") {
          chargeData.refundReceiveAccount = {
            bank: "XX",
            accountNumber: "XXXXXXXXX",
            holderName: "XXX",
          };
        }

        createdChargeInfo =
          await chargeService.createChargeForTossPrePayment(chargeData);

        // 성공 시 진행 상태 해제
        await cacheClient.del(progressKey);

        res.status(200).json({
          success: true,
          message: "PrePayment for Toss processed successfully",
          createdChargeInfo,
        });
      } catch (error) {
        // 에러 시 진행 상태 해제
        await cacheClient.del(progressKey);

        // 에러 로깅 추가
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.error(
            "Error in postPrePaymentForToss inner try-catch:",
            error,
          );
          console.error("Error message:", error.message);
          console.error("Error statusCode:", error.statusCode);
        }

        // 409 Conflict 에러 처리 (중복 주문)
        if (error.statusCode === 409 || error.message?.includes("Conflict")) {
          return res.status(409).json({
            success: false,
            message: error.message || "Order already exists",
          });
        }

        // 다른 에러는 상위 catch로 전달
        throw error;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error processing payment:", error);
      }
      res
        .status(500)
        .json({ success: false, message: "Payment processing failed" });
    }
  },

  async getPrePaymentForToss(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const orderId = req?.query?.orderId ?? null;
        if (orderId === null || orderId === undefined) {
          return;
        }

        const chargeInDB = await chargeService.getChargeByOrderId(orderId);
        res.status(200).json({
          charge: chargeInDB,
        });
      } else {
        next(
          new AppError(
            commonErrors.chargeControllerGetPrePaymentForTossError,
            commonErrors.userNotFoundError,
            404,
          ),
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error fetching pre-payment Info:", error);
      }
      next(new AppError(error?.message, commonErrors.chargeController, 404));
    }
  },

  async deletePrePaymentForTossByOrderId(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const orderId = req?.body?.orderId;
        if (orderId === "" || orderId === undefined) return;
        await chargeService.deleteChargeByOrderId(orderId);
        res.status(200).json({ success: true });
      } else {
        next(
          new AppError(
            commonErrors.chargeControllerDeletePrePaymentForTossByOrderIdError,
            commonErrors.userNotFoundError,
            404,
          ),
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error deleting pre-payment Info:", error);
      }
      res
        .status(500)
        .json({ success: false, message: "Deleting Pre-Payment Info failed" });
    }
  },

  async deletePrePaymentForTossByPaymentKey(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const paymentKey = req?.body?.paymentKey;
        if (paymentKey === "" || paymentKey === undefined) return;
        const userInDB = await userService.getUserById(userId);
        const userObjId = userInDB._id;
        await chargeService.deleteChargeByUserObjIdAndPaymentKey(
          userObjId,
          paymentKey,
        );
        res.status(200).json({ success: true });
      } else {
        next(
          new AppError(
            commonErrors.chargeControllerDeletePrePaymentForTossByPaymentKeyError,
            commonErrors.userNotFoundError,
            404,
          ),
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error deleting pre-payment Info:", error);
      }
      res
        .status(500)
        .json({ success: false, message: "Deleting Pre-Payment Info failed" });
    }
  },

  async putPrePaymentForToss(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      req.user = userId;
      if (req?.isAuthenticated() === true) {
        const { orderId, paymentKey } = req.body;
        if (orderId === undefined || orderId === "") return;

        const chargeInDB = await chargeService.getChargeByOrderId(orderId);

        // orderHistory가 있는 경우에만 업데이트 (무료 이용권은 orderHistory가 없을 수 있음)
        const orderHistoryUpdate =
          chargeInDB?.orderHistory &&
          Object.keys(chargeInDB.orderHistory).length > 0
            ? {
                orderHistory: {
                  ...Object.fromEntries(
                    Object.entries(chargeInDB.orderHistory).map(
                      ([key, valueOfArray]) => {
                        valueOfArray[5] = chargeInDB.createdAt;
                        valueOfArray[8] = chargeInDB.paymentKey;
                        return [key, valueOfArray];
                      },
                    ),
                  ),
                },
              }
            : {};

        await chargeService.putChargeByOrderId(orderId, {
          paymentKey,
          ...orderHistoryUpdate,
        });

        const userInDB = await userService.getUserById(req.user);

        await chargeController.updateUserVouchersInDetail(
          orderId,
          chargeInDB,
          userInDB,
        );

        res.status(200).json({ success: true });
      } else {
        next(
          new AppError(
            commonErrors.chargeControllerPutPrePaymentForTossError,
            commonErrors.userNotFoundError,
            404,
          ),
        );
      }
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error putting pre-payment Info:", error);
      }
      res
        .status(500)
        .json({ success: false, message: "Putting Pre-Payment Info failed" });
    }
  },

  // 웹훅 처리 - Redis 활용
  async postWebHookForToss(req, res, next) {
    const status = req?.body?.data?.status;
    const orderId = req?.body?.data?.orderId;

    if (!orderId) return res.status(200).end();

    // 웹훅 중복 처리 방지
    const webhookKey = RedisKeys.webhookProcessed(orderId, status);
    const isProcessed = await cacheClient.exists(webhookKey);

    if (isProcessed) {
      // console.log(`Webhook already processed: ${orderId}_${status}`);
      return res.status(200).json({ message: "Already processed" });
    }

    // 처리 중 마킹 (1시간)
    await cacheClient.set(webhookKey, "processed", 3600);

    if (process.env.NODE_ENV === "DEVELOPMENT") {
    }

    const chargeInDB = await chargeService.getChargeByOrderId(orderId);
    if (!chargeInDB) return res.status(200).end();

    const userObjId = chargeInDB?.userId;
    const orderVouchers = chargeInDB?.orderVouchers;
    const userInDB = await userService.getUserByObjId(userObjId);

    const vouchers = userInDB?.vouchers;

    const webhookDeps = {
      chargeService,
      userService,
      cacheClient,
      RedisKeys,
      mongoose,
      updateUserVouchersInDetail: (...args) =>
        chargeController.updateUserVouchersInDetail(...args),
      updateVouchersInDetailForRefund: (...args) =>
        chargeController.updateVouchersInDetailForRefund(...args),
      calculateMinimumRefundableLimit: (r) =>
        chargeController.calculateMinimumRefundableLimit(r),
      getRemainingRefundableAmount: (r) =>
        chargeController.getRemainingRefundableAmount(r),
    };
    // 모든 결제(가상계좌 제외)의 경우
    if (req?.body?.data && req?.body?.data?.method !== "가상계좌") {
      return await tossWebhookHandlers.handleNonVirtualAccountWebhook(
        webhookDeps,
        req,
        res,
        { status, orderId, chargeInDB, userInDB, vouchers },
      );
    }
    // 가상계좌 결제의 경우
    return await tossWebhookHandlers.handleVirtualAccountWebhook(
      webhookDeps,
      req,
      res,
      { status, orderId, chargeInDB, userInDB, vouchers, orderVouchers },
    );
  },

  // 환불 완료 처리 (더 이상 필요 없지만 호환성을 위해 유지)
  async handleRefundCompletion(req, orderId) {
    // 이 메서드는 이제 processRefundVouchers 내부에서 처리됨
    // 호환성을 위해 빈 메서드로 유지
  },

  // 결제 확인 (Redis 캐싱 적용)
  async postConfirmForToss(req, res, next) {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: User ID not found" });
    }
    req.user = userId;
    const { paymentKey, orderId, amount } = req.body;
    if (!orderId || amount === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    try {
      // 결제 진행 상태 확인
      const paymentProgressKey = RedisKeys.paymentProgress(userId, orderId);
      const isProcessing = await cacheClient.get(paymentProgressKey);
      if (isProcessing === "processing") {
        // console.log(`Payment is being processed for orderId: ${orderId}`);
        return res.status(200).json({
          success: false,
          message: "Payment is being processed. Please wait.",
          status: "processing",
          orderId,
          action: "retry",
        });
      }
      if (isProcessing === "completed") {
        // console.log(`Payment already processed for paymentKey: ${paymentKey}`);
        await cacheClient.set(paymentProgressKey, "completed", 3600);
        return res.status(200).json({
          success: true,
          message: "결제가 이미 완료되었습니다",
          status: "completed",
          orderId,
          action: "redirect_to_success",
        });
      }

      // 결제 진행 상태 설정
      await cacheClient.set(paymentProgressKey, "processing", 300);

      const chargeInfo = await chargeService.getChargeByOrderId(orderId);
      if (!chargeInfo) {
        await cacheClient.del(paymentProgressKey);
        return res
          .status(404)
          .json({ success: false, message: "Charge not found" });
      }

      // 무료 이용권 체크 (amount가 0이거나 adsFreePass가 있거나 orderName/productId가 무료 이용권인 경우)
      const isFreeVoucher =
        amount === 0 ||
        amount === "0" ||
        Number(amount) === 0 ||
        chargeInfo?.adsFreePass ||
        isAdsFreePassProduct(chargeInfo?.productId, chargeInfo?.orderName);

      // 무료 이용권이 아닌 경우에만 토스 결제 상태 확인
      if (!isFreeVoucher && paymentKey) {
        const isAlreadyProcessed = await tossPaymentsClient.getPaymentStatus(
          paymentKey,
          process.env.COSMOS_TOSS_SECRET_KEY,
        );
        if (isAlreadyProcessed) {
          // console.log(`Payment already processed for paymentKey: ${paymentKey}`);
          await cacheClient.set(paymentProgressKey, "completed", 3600);
          return res
            .status(400)
            .json({ success: false, message: "Payment already processed" });
        }
      }

      let response;
      if (!isFreeVoucher) {
        // 유료 결제인 경우에만 토스 API 호출
        if (!paymentKey) {
          await cacheClient.del(paymentProgressKey);
          return res.status(400).json({
            success: false,
            message: "Payment key is required for paid orders",
          });
        }

        let widgetSecretKey;
        const currencyFromOrderHistory =
          chargeInfo?.orderHistory?.[
            Object.keys(chargeInfo?.orderHistory || {})?.[0]
          ]?.[7];

        if (
          currencyFromOrderHistory === "KRW" ||
          chargeInfo?.currency === "KRW"
        ) {
          widgetSecretKey = process.env.COSMOS_TOSS_SECRET_KEY;
        } else if (
          currencyFromOrderHistory === "USD" ||
          chargeInfo?.currency === "USD"
        ) {
          widgetSecretKey = process.env.COSMOS_TOSS_SECRET_KEY_PAYPAL;
        } else {
          // 기본값으로 KRW 사용
          widgetSecretKey = process.env.COSMOS_TOSS_SECRET_KEY;
        }

        if (!widgetSecretKey) {
          await cacheClient.del(paymentProgressKey);
          return res
            .status(500)
            .json({ success: false, message: "Secret key not configured" });
        }

        const idempotencyKey = `${orderId}-${paymentKey || "free"}`;
        response = await tossPaymentsClient.confirmPayment(
          process.env.COSMOS_TOSS_CONFIRM_URL,
          { orderId, amount, paymentKey },
          widgetSecretKey,
          idempotencyKey,
        );
      } else {
        // 무료 이용권인 경우 가짜 응답 생성 (토스 API 호출 건너뛰기)
        response = {
          data: {
            status: "DONE",
            orderId: orderId,
            paymentKey: paymentKey || "free_voucher",
            amount: amount,
            method: "FREE",
          },
        };
      }

      if (chargeInfo?.method === "가상계좌") {
        const refundReceiveAccount =
          response?.data?.virtualAccount?.refundReceiveAccount || {};
        await chargeService.putChargeByOrderId(orderId, {
          paymentKey,
          refundReceiveAccount: {
            bank: refundReceiveAccount?.bankCode || refundReceiveAccount?.bank,
            accountNumber: refundReceiveAccount?.accountNumber,
            holderName: refundReceiveAccount?.holderName,
          },
          apiName: "Toss(미입금상태)",
        });
        await cacheClient.del(RedisKeys.user(userId));
      } else {
        // 일반 결제: 트랜잭션으로 User 업데이트 보호
        const session = await mongoose.startSession();
        let transactionError = null;
        try {
          await session.withTransaction(async () => {
            const {
              orderHistory,
              orderVouchers,
              adsFreePass: chargeAdsFreePass,
              orderName,
              productId,
            } = await chargeService.getChargeByOrderId(orderId);
            const userInDB = await userService.getUserById(userId);
            if (!userInDB) {
              await cacheClient.del(paymentProgressKey);
              throw new Error("User not found");
            }

            // 초심자 패키지 중복 구매 방지 체크
            // productId가 존재하고 초심자 패키지인 경우에만 체크
            if (
              productId &&
              (productId ===
                process.env.VITE_COSMOS_VOUCHERS_BUNDLE_PACKAGE_NEWBIE ||
                productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE)
            ) {
              // userInDB.purchased.packageForNewbie가 웹/앱 연동을 위한 가장 정확한 정보
              // 한 번이라도 구매했다면 이 플래그가 true가 되어야 함
              if (userInDB?.purchased?.packageForNewbie) {
                await cacheClient.del(paymentProgressKey);
                // 트랜잭션 내부에서는 응답을 보내지 말고 에러를 throw
                throw new Error(
                  "초심자 패키지는 계정당 1회만 구매 가능합니다.",
                );
              }
            }

            let updatedVouchersInDetail = {};
            if (orderHistory && Object.keys(orderHistory).length > 0) {
              // 현재 날짜를 ISO 문자열로 생성 (구매일)
              const currentDate = new Date().toISOString();

              updatedVouchersInDetail = Object.fromEntries(
                Object.entries(orderHistory).map(([key, valueOfArray]) => {
                  const vouchersInDetailOfUser =
                    userInDB?.vouchersInDetail?.[key] || [];
                  const doubleArray = [...vouchersInDetailOfUser];

                  // 날짜 필드(인덱스 5)가 'date' 문자열이면 실제 날짜로 변환
                  const voucherData = [...valueOfArray];
                  if (
                    voucherData[5] === "date" ||
                    voucherData[5] === "Date" ||
                    !voucherData[5]
                  ) {
                    voucherData[5] = currentDate;
                  }

                  doubleArray.push(voucherData);
                  return [key, doubleArray];
                }),
              );
            }

            const vouchers = userInDB.vouchers || {};
            let updatedVouchers = { ...vouchers };
            let updatedStars = userInDB.stars || 0; // 스타 초기값

            orderVouchers?.forEach((elem) => {
              if (elem) {
                const key = elem[0];
                if (key === "stars") {
                  // 스타인 경우 별도 처리
                  updatedStars += elem[1];
                } else {
                  updatedVouchers[key] = (vouchers[key] || 0) + elem[1];
                }
              }
            });

            // 무료 이용권인 경우 adsFreePass 업데이트
            let adsFreePassExpiredDate = "";
            let productIdForAdsFree = null;

            console.log("[Normal tarot free pass check]", {
              isFreeVoucher,
              productId,
              orderName,
              isAdsFreePassProduct: isAdsFreePassProduct(productId, orderName),
              chargeAdsFreePass,
            });

            if (
              isFreeVoucher &&
              (isAdsFreePassProduct(productId, orderName) || chargeAdsFreePass)
            ) {
              // productId가 무료 이용권인 경우에만 사용
              // 초심자 패키지와 함께 구매할 때는 productId가 초심자 패키지일 수 있으므로
              // 무료 이용권 productId를 별도로 처리
              if (productId && isAdsFreePassProduct(productId, orderName)) {
                productIdForAdsFree = productId;
              } else {
                // orderName에서 일수 추출 시도
                const days = extractDays(null, orderName);
                if (days !== null) {
                  // 일수가 추출되면 productId 생성
                  productIdForAdsFree = `cosmos_vouchers_ads_remover_${days}d`;
                } else {
                  // 기본값 사용
                  productIdForAdsFree = process.env.COSMOS_PRODUCT_ADS_REMOVER;
                }
              }

              // 구매 가능 여부 확인
              const purchaseCheck = checkAdsFreePassPurchaseAllowed(
                userInDB,
                productIdForAdsFree,
                orderName,
              );

              if (!purchaseCheck.allowed) {
                await cacheClient.del(paymentProgressKey);
                // 트랜잭션 내부에서는 응답을 보내지 말고 에러를 throw
                throw new Error(purchaseCheck.reason);
              }

              const purchaseDate = new Date().toISOString();
              adsFreePassExpiredDate = adsFreePassExpiredDateMaker({
                productId: productIdForAdsFree,
                purchaseDate: purchaseDate,
              });

              console.log("[adsFreePassExpiredDate calculation]", {
                productIdForAdsFree,
                purchaseDate,
                adsFreePassExpiredDate,
                adsFreePassExpiredDateType: typeof adsFreePassExpiredDate,
              });
            }

            // 업데이트할 사용자 정보 준비
            const userUpdateData = {
              ...userInDB,
              vouchers: { ...updatedVouchers },
              stars: updatedStars, // 스타 업데이트 추가
            };

            // orderHistory가 있는 경우에만 vouchersInDetail 업데이트
            if (Object.keys(updatedVouchersInDetail).length > 0) {
              userUpdateData.vouchersInDetail = {
                ...userInDB?.vouchersInDetail,
                ...updatedVouchersInDetail,
              };
            }

            // 초심자 패키지 구매 시 플래그 설정 (웹/앱 연동)
            if (
              productId ===
                process.env.VITE_COSMOS_VOUCHERS_BUNDLE_PACKAGE_NEWBIE ||
              productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE
            ) {
              userUpdateData.purchased = {
                ...userInDB?.purchased,
                packageForNewbie: true,
              };
            }

            // adsFreePass가 있는 경우 업데이트
            if (adsFreePassExpiredDate !== "" && adsFreePassExpiredDate) {
              // orderName이 없으면 일수 기반으로 생성
              const days = extractDays(productIdForAdsFree, orderName);
              const finalOrderName =
                orderName ||
                (days !== null
                  ? `Normal Tarot ${days}-Day Free Pass`
                  : "Normal Tarot 3-Day Free Pass");

              console.log("[adsFreePass update]", {
                finalOrderName,
                orderId,
                adsFreePassExpiredDate,
                days,
              });

              userUpdateData.adsFreePass = {
                name: finalOrderName,
                orderId: orderId,
                expired: adsFreePassExpiredDate,
              };
            }

            const updatedUserInfo = await userService.updateUser(
              userUpdateData,
              session,
            );

            // 트랜잭션 성공 후 캐시 업데이트
            await cacheClient.set(
              RedisKeys.user(userId),
              updatedUserInfo,
              3600,
            );
          });
        } catch (txError) {
          // 트랜잭션 내부에서 발생한 에러 저장
          transactionError = txError;
        } finally {
          await session.endSession();
        }

        // 트랜잭션 에러가 있으면 여기서 처리
        if (transactionError) {
          await cacheClient.del(paymentProgressKey);
          if (
            transactionError.message ===
            "초심자 패키지는 계정당 1회만 구매 가능합니다."
          ) {
            return res.status(400).json({
              success: false,
              message: transactionError.message,
            });
          }
          if (
            transactionError.message &&
            transactionError.message.includes("ads free pass")
          ) {
            return res.status(400).json({
              success: false,
              message: transactionError.message,
            });
          }
          if (transactionError.message === "User not found") {
            return res.status(404).json({
              success: false,
              message: transactionError.message,
            });
          }
          // 다른 에러는 상위 catch로 전달
          throw transactionError;
        }
      }

      // 결제 성공 시 상태 업데이트
      await cacheClient.set(paymentProgressKey, "completed", 3600);
      res.status(200).json({ success: true, data: response.data });
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error in postConfirmForToss:", error);
      }
      await cacheClient.del(RedisKeys.paymentProgress(userId, orderId));

      // 트랜잭션 내부에서 발생한 에러 처리
      if (error.message === "초심자 패키지는 계정당 1회만 구매 가능합니다.") {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      if (error.message && error.message.includes("ads free pass")) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
      if (error.message === "User not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      if (error.response?.data?.code === "ALREADY_PROCESSED_PAYMENT") {
        await cacheClient.set(
          RedisKeys.paymentProgress(userId, orderId),
          "completed",
          3600,
        );
        return res
          .status(400)
          .json({ success: false, message: "Payment already processed" });
      }
      res.status(error.response?.status || 500).json({
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Payment confirmation failed",
      });
    }
  },

  // 부분환불 (Redis 활용)
  async postPartialCancelForToss(req, res, next) {
    const userId = req?.user ?? req?.session?.user?.id ?? null;
    req.user = userId;
    await cacheClient.del(RedisKeys.user(userId));

    const vouchersArrForRefund = Object.values(req.body)?.flat(1);

    if (!vouchersArrForRefund?.length || !vouchersArrForRefund[0]?.length) {
      return res.status(200).json({ message: "nothing" });
    }

    const orderId = vouchersArrForRefund[0][4];

    // 무료 이용권 환불 차단
    const chargeInfo = await chargeService.getChargeByOrderId(orderId);
    if (chargeInfo) {
      const isFreeVoucher =
        chargeInfo?.adsFreePass ||
        chargeInfo?.amount === 0 ||
        chargeInfo?.amount === "0" ||
        Number(chargeInfo?.amount) === 0 ||
        chargeInfo?.method === "FREE" ||
        isAdsFreePassProduct(chargeInfo?.productId, chargeInfo?.orderName);

      if (isFreeVoucher) {
        return res.status(400).json({
          success: false,
          message: "무료 이용권은 환불할 수 없습니다.",
        });
      }
    }

    // Redis에 환불 상태 설정
    const countKey = RedisKeys.requestCount(orderId);
    const vouchersKey = RedisKeys.vouchersForRefund(orderId);

    await cacheClient.set(countKey, vouchersArrForRefund.length, 3600);

    let filteredObj = {};
    const cancelPromises = vouchersArrForRefund.map(async (voucher, index) => {
      const orderId = voucher[4];
      const paymentKey = voucher[8];
      const listPrice = voucher[1];
      const quantity = voucher[0];
      const payMethod = voucher[9];
      const totalAmount = quantity * listPrice;
      const cancelAmount =
        Math.round(totalAmount * Number(process.env.COSMOS_REFUND_CANCEL_PERCENTAGE) * 100) /
        100;
      const currency = voucher[7];
      let cancelOption;

      // 환불 대상 이용권 필터링
      filteredObj = {
        ...filteredObj,
        ...Object.fromEntries(
          Object.entries(req.body)
            .map(([key, valueArray]) => [
              key,
              (filteredObj?.[key] || []).concat(
                valueArray?.filter(
                  (value) =>
                    value?.[4] === orderId &&
                    value?.[8] === paymentKey &&
                    value?.[0] === quantity &&
                    value?.[1] === listPrice,
                ),
              ),
            ])
            ?.filter(([_, filteredArray]) => filteredArray?.length > 0),
        ),
      };

      if (payMethod !== "가상계좌") {
        if (currency === "KRW") {
          cancelOption = {
            cancelReason: "고객이 취소를 원함.",
            cancelAmount: cancelAmount,
          };
        } else if (currency === "USD") {
          cancelOption = {
            cancelReason: "The customer has asked to cancel.",
            cancelAmount: cancelAmount,
            currency: currency,
          };
        }
      } else {
        const chargeInfo = await chargeService.getChargeByOrderId(orderId);
        const refundReceiveAccount = chargeInfo?.refundReceiveAccount;
        cancelOption = {
          cancelReason: "고객이 취소를 원함.",
          cancelAmount: cancelAmount,
          refundReceiveAccount: { ...refundReceiveAccount },
        };
      }

      const widgetSecretKey =
        currency === "KRW"
          ? process.env.COSMOS_TOSS_SECRET_KEY
          : process.env.COSMOS_TOSS_SECRET_KEY_PAYPAL;
      const cancelUrl = `${process.env.COSMOS_TOSS_CANCEL_URL}/${paymentKey}/cancel`;

      // 요청 간격 조절
      await new Promise((resolve) => setTimeout(resolve, index * 1500));

      try {
        const response = await tossPaymentsClient.cancelPayment(
          cancelUrl,
          cancelOption,
          widgetSecretKey,
        );

        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log(`Refund success (amount: ${cancelAmount})`);
        }

        return { success: true, response };
      } catch (error) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log(
            `Refund failed (amount: ${cancelAmount})`,
            error?.response?.data,
          );
        }

        // 실패 시 카운트 감소
        const currentCount = (await cacheClient.get(countKey)) || 0;
        if (currentCount > 0) {
          await cacheClient.set(countKey, currentCount - 1, 3600);
        }

        // 실패한 항목을 filteredObj에서 제거
        filteredObj = {
          ...Object.fromEntries(
            Object.entries(filteredObj)
              .map(([key, valueArray]) => [
                key,
                valueArray?.filter(
                  (value) =>
                    !(
                      value?.[4] === orderId &&
                      value?.[8] === paymentKey &&
                      value?.[0] === quantity &&
                      value?.[1] === listPrice
                    ),
                ),
              ])
              ?.filter(([_, filteredArray]) => filteredArray?.length > 0),
          ),
        };

        return { success: false, error };
      }
    });

    try {
      const results = await Promise.all(cancelPromises);

      // 최종 환불 대상 정보를 Redis에 저장
      await cacheClient.set(vouchersKey, filteredObj, 3600);

      const successResults = results?.filter((result) => result.success);
      const failureResults = results?.filter((result) => !result.success);

      if (successResults?.length > 0 && failureResults?.length === 0) {
        return res.status(200).json({
          statusCodeArr: successResults.map(
            (r) => r.response.request.res.statusCode,
          ),
          dataArr: successResults.map((r) => r.response.data.cancels),
          message: "response",
        });
      } else if (successResults?.length === 0 && failureResults?.length > 0) {
        return res.status(200).json({ message: "error" });
      } else if (successResults?.length === 0 && failureResults?.length === 0) {
        return res.status(200).json({ message: "nothing" });
      } else {
        return res.status(200).json({ message: "both" });
      }
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("Error processing cancellations:", error);
      }
      await cacheClient.del(countKey);
      await cacheClient.del(vouchersKey);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // 구글 플레이 결제 (기존과 동일)
  async postChargeForGooglePayStore(req, res, next) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("[GooglePlay payment] Started - request received");
    }
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[GooglePlay payment] userId:", userId);
      }
      req.user = userId;
      await cacheClient.del(RedisKeys.user(userId));

      const {
        email,
        className,
        id,
        sourceReceiptClassName,
        transactionId,
        state,
        products,
        productId,
        platform,
        orderId,
        packageName,
        purchaseTime,
        purchaseState,
        purchaseToken,
        quantity,
        acknowledged,
        getPurchaseState,
        autoRenewing,
        accountId,
        purchaseId,
        purchaseDate,
        isPending,
        isAcknowledged,
        renewalIntent,
        sourcePlatform,
        sourcePurchaseToken,
        sourceOrderId,
        collection,
        latestReceipt,
        nativeTransactions,
        validationDate,
        zd,
        ...restOfPaymentInfo
      } = req.body;

      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          "[GooglePlay payment] orderId:",
          orderId,
          "productId:",
          productId,
          "purchaseState:",
          purchaseState,
        );
      }

      if (purchaseState !== 0) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log(
            "[GooglePlay payment] Failed - Invalid purchase state:",
            purchaseState,
          );
        }
        return res
          .status(400)
          .json({ success: false, message: "Invalid purchase state" });
      }

      // 항상 로그 출력
      console.log("[GooglePlay payment] Google verification started:", {
        packageName,
        productId,
        purchaseToken: purchaseToken?.substring(0, 20) + "...",
        orderId,
        purchaseState,
      });

      const isValidPurchase = await verifyPurchaseWithGooglePlay(
        packageName,
        productId,
        purchaseToken,
      );

      // 항상 로그 출력
      console.log("[GooglePlay payment] Google verification result:", {
        isValidPurchase,
        packageName,
        productId,
        orderId,
      });

      if (!isValidPurchase) {
        // 항상 상세 로그 출력
        console.error("[GooglePlay payment] Failed - Invalid purchase:", {
          packageName,
          productId,
          purchaseToken: purchaseToken?.substring(0, 20) + "...",
          orderId,
          purchaseState,
          userId,
          email,
        });
        return res
          .status(400)
          .json({ success: false, message: "Invalid purchase" });
      }

      let orderName = orderNameMaker(productId);
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[GooglePlay payment] orderName:", orderName);
      }
      if (orderName === "Unknown") {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[GooglePlay payment] Failed - Unknown product");
        }
        return res.status(406).end();
      }

      if (
        email === process.env.COSMOS_ADMIN_EMAIL_1 ||
        email === process.env.COSMOS_ADMIN_EMAIL_2 ||
        accountId === process.env.COSMOS_ADMIN_EMAIL_1 ||
        accountId === process.env.COSMOS_ADMIN_EMAIL_2
      ) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          consoleForReceipt(req);
        }
      }

      if (!orderId) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[GooglePlay payment] Failed - No orderId");
        }
        return res.status(400).json({
          success: false,
          message: "Order ID is required",
        });
      }

      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[GooglePlay payment] Fetching user info");
      }
      const userInDB = await userService.getUserById(userId);
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          "[GooglePlay payment] User info result:",
          userInDB ? "found" : "not found",
        );
      }
      const orderHistory = orderHistoryMaker({
        products,
        quantity,
        productId,
        orderId,
        purchaseDate,
        purchaseToken,
        packageName,
        zd,
      });
      const orderVouchersArr = orderVouchersArrMaker({ products, quantity });
      const adsFreePassExpiredDate = adsFreePassExpiredDateMaker({
        productId,
        purchaseDate,
      });

      // 광고제거 이용권 구매 가능 여부 확인
      if (adsFreePassExpiredDate !== "" && adsFreePassExpiredDate) {
        const purchaseCheck = checkAdsFreePassPurchaseAllowed(
          userInDB,
          productId,
          orderName,
        );

        if (!purchaseCheck.allowed) {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log(
              "[GooglePlay payment] Purchase not allowed - already has valid ads-free/free pass:",
              purchaseCheck.reason,
            );
          }
          return res.status(400).json({
            success: false,
            message: purchaseCheck.reason,
          });
        }
      }

      const adsFreePass =
        adsFreePassExpiredDate !== "" && adsFreePassExpiredDate
          ? {
              name: orderName,
              expired: adsFreePassExpiredDate,
              description: [
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
              ],
            }
          : {};

      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[GooglePlay payment] Checking existing order");
      }
      const existingChargeInfo =
        await chargeService.getChargeByOrderId(orderId);
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          "[GooglePlay payment] Existing order check result:",
          existingChargeInfo ? "already exists" : "new",
        );
      }

      if (!existingChargeInfo) {
        // 트랜잭션: Charge 생성 + User 바우처 업데이트
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[GooglePlay payment] Transaction started - saving to DB");
        }
        const session = await mongoose.startSession();
        try {
          await session.withTransaction(async () => {
            if (process.env.NODE_ENV === "DEVELOPMENT") {
              console.log("[GooglePlay payment] Creating Charge");
            }
            const createdChargeInfo =
              await chargeService.createChargeForAndroidGooglePlay({
                orderId,
                purchaseToken,
                orderName,
                adsFreePass,
                orderHistory,
                orderVouchers: orderVouchersArr,
                amount: quantity,
                productId,
                packageName,
                apiName: platform,
                userId: userInDB,
                createdAtForIAP: purchaseDate,
              });
            if (process.env.NODE_ENV === "DEVELOPMENT") {
              console.log(
                "[GooglePlay payment] Charge created:",
                createdChargeInfo ? "success" : "failed",
              );
            }

            const updatedVouchers = updatedVouchersMaker({
              userInDB,
              createdChargeInfo,
            });
            const updatedVouchersInDetail = updatedVouchersInDetailMaker({
              orderHistory,
              userInDB,
              orderId,
            });

            // [추가]: 스타(Stars) 처리
            // orderVouchersArrMaker에서 'stars' 키로 반환된 값을 처리
            let updatedStars = userInDB.stars || 0;
            if (updatedVouchers["stars"]) {
              updatedStars += updatedVouchers["stars"];
              delete updatedVouchers["stars"]; // vouchers 객체에는 stars를 저장하지 않음
            }

            // 인앱결제에서 광고제거 이용권을 산 경우 웹의 보통타로 무료 이용권도 산 처리
            // 같은 일수의 아이템끼리 연동 (예: 3일 광고제거 = 3일 보통타로 무료 이용권)
            if (
              adsFreePassExpiredDate !== "" &&
              adsFreePassExpiredDate &&
              productId
            ) {
              // productId 또는 orderName에서 일수 추출
              const days = extractDays(productId, orderName);
            }

            if (process.env.NODE_ENV === "DEVELOPMENT") {
              console.log("[GooglePlay payment] Updating User");
            }
            if (adsFreePassExpiredDate !== "" && adsFreePassExpiredDate) {
              await userService.updateUser(
                {
                  ...userInDB,
                  adsFreePass: {
                    name: orderName,
                    orderId: orderId,
                    expired: adsFreePassExpiredDate,
                  },
                  vouchers: updatedVouchers,
                  vouchersInDetail: updatedVouchersInDetail,
                  stars: updatedStars, // 스타 업데이트
                },
                session,
              );
            } else if (productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE) {
              await userService.updateUser(
                {
                  ...userInDB,
                  vouchers: updatedVouchers,
                  vouchersInDetail: updatedVouchersInDetail,
                  purchased: { ...userInDB?.purchased, packageForNewbie: true },
                  stars: updatedStars, // 스타 업데이트
                },
                session,
              );
            } else {
              await userService.updateUser(
                {
                  ...userInDB,
                  vouchers: updatedVouchers,
                  vouchersInDetail: updatedVouchersInDetail,
                  stars: updatedStars, // 스타 업데이트
                },
                session,
              );
            }
            if (process.env.NODE_ENV === "DEVELOPMENT") {
              console.log("[GooglePlay payment] User update done");
            }
          });
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log("[GooglePlay payment] Transaction completed");
          }
        } catch (txError) {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.error("[GooglePlay payment] Transaction error:", txError);
          }
          throw txError;
        } finally {
          await session.endSession();
        }
      } else {
        // 이미 처리된 주문 - 중복 호출 또는 재시도
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log(`[GooglePlay payment] Duplicate order - already processed: ${orderId}`);
        }
      }

      await cacheClient.del(RedisKeys.user(userId));
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[GooglePlay payment] Success - sending response");
      }

      res.status(200).json({ success: true });
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("[GooglePlay payment] Error:", {
          name: error?.name,
          message: error?.message,
          stack: error?.stack,
          orderId: req?.body?.orderId,
          userId: req?.user,
        });
      }
      res.status(500).json({
        success: false,
        message: "Payment(iap) processing failed",
        error: error?.message,
      });
    }
  },

  // 구글 플레이 환불 처리 (OIDC 검증 후 handlers/googlePlayRefundHandler 위임)
  async postRefundForGooglePlayStore(req, res, next) {
    // 1. OIDC ID 토큰 검증 (보안)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const idToken = authHeader.split(" ")[1];
      try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience:
            process.env.COSMOS_GOOGLE_PLAY_WEBHOOK_AUDIENCE ||
            "https://cosmos-tarot.com/payments/hook/google/subscription",
        });
        const payload = ticket.getPayload();
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[GooglePlay refund] Auth success:", payload.email);
        }
      } catch (authError) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.error("[GooglePlay refund] Auth failed:", authError.message);
        }
        return res
          .status(200)
          .json({ success: false, message: "Invalid OIDC token" });
      }
    }

    return googlePlayRefundHandler.handleRefundWebhook(req, res, {
      chargeService,
      cacheClient,
      verifyPurchaseWithGooglePlay,
      processRefund,
      defaultPackageName: "com.cosmos_tarot.cosmos",
    });
  },

  // 헬퍼 메서드들
  async updateUserVouchersInDetail(
    orderId,
    chargeInDB,
    userInDB,
    session = null,
  ) {
    const updatedChargeInDB = await chargeService.getChargeByOrderId(orderId);
    const updatedOrderHistory = updatedChargeInDB.orderHistory || {};

    // orderHistory가 없거나 비어있으면 처리하지 않음 (무료 이용권의 경우)
    if (!updatedOrderHistory || Object.keys(updatedOrderHistory).length === 0) {
      return;
    }

    const keysArrOfOrderHistory = Object.keys(updatedOrderHistory);
    const updatedUserInDB = await userService.getUserByObjId(userInDB._id);
    let updatedVouchersInDetail2 = { ...updatedUserInDB?.vouchersInDetail };

    keysArrOfOrderHistory?.forEach((key) => {
      const check =
        updatedVouchersInDetail2?.[key]?.[
          updatedVouchersInDetail2?.[key]?.length - 1
        ] ?? [];

      if (check?.length === 0) return;

      if (
        updatedVouchersInDetail2?.[key]?.[
          updatedVouchersInDetail2?.[key]?.length - 1
        ]?.[4] === orderId
      ) {
        updatedVouchersInDetail2[key][
          updatedVouchersInDetail2[key].length - 1
        ][5] = updatedOrderHistory?.[key]?.[5];
        updatedVouchersInDetail2[key][
          updatedVouchersInDetail2[key].length - 1
        ][8] = updatedChargeInDB?.paymentKey;
      }
    });

    await userService.updateUser(
      {
        ...updatedUserInDB,
        vouchersInDetail: updatedVouchersInDetail2,
      },
      session,
    );
  },

  // 초심자 패키지 orderId 조회
  async getBeginnerPackageOrderIds(req, res, next) {
    try {
      const userId = req?.user ?? req?.session?.user?.id ?? null;
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized: User ID not found" });
      }

      const userInDB = await userService.getUserById(userId);
      if (!userInDB) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      // 초심자 패키지를 구매하지 않은 경우 빈 배열 반환
      if (!userInDB?.purchased?.packageForNewbie) {
        return res.status(200).json(buildResponse([], null, 200));
      }

      // 사용자의 모든 Charge 조회
      const userObjId = userInDB._id;
      const chargeArrInDB =
        await chargeRepository.findManyByUserObjId(userObjId);

      // 초심자 패키지 orderId 필터링
      const beginnerPackageOrderIds = [];
      for (const charge of chargeArrInDB) {
        const orderName = charge?.orderName || "";
        // orderName으로 먼저 확인 (대부분의 경우 여기서 판별 가능)
        if (orderName === "Beginner Package" || orderName === "초심자 패키지") {
          beginnerPackageOrderIds.push(charge.orderId);
        } else {
          // orderName으로 판별되지 않는 경우 productId 확인
          // 백엔드 환경 변수만 사용 (VITE_*는 프론트엔드용)
          const fullCharge = await chargeService.getChargeByOrderId(
            charge.orderId,
          );
          if (fullCharge) {
            const productId = fullCharge?.productId || "";
            if (productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE) {
              beginnerPackageOrderIds.push(fullCharge.orderId);
            }
          }
        }
      }

      return res
        .status(200)
        .json(buildResponse(beginnerPackageOrderIds, null, 200));
    } catch (err) {
      next(new AppError(err.name, err.message, 500));
    }
  },

  updateVouchersInDetailForRefund(vouchersInDetail, vouchersObjForRefund) {
    return Object.fromEntries(
      Object.entries(vouchersObjForRefund).map(([key, arrOfArray]) => {
        let vouchersInDetailOfUser = vouchersInDetail?.[key] || [];
        let doubleArray = [...vouchersInDetailOfUser];

        arrOfArray?.forEach((arr) => {
          doubleArray?.forEach((array) => {
            if (array?.[4] === arr?.[4] && Array.isArray(array)) {
              array[0] = array[0] - arr[0];
            }
          });
        });

        return [key, doubleArray.filter((array) => array[0] !== 0)];
      }),
    );
  },

  calculateMinimumRefundableLimit(req) {
    return (
      (req?.body?.data?.cancels?.[0]?.cancelAmount +
        req?.body?.data?.cancels?.[0]?.refundableAmount) *
      remainingPercentage
    );
  },

  getRemainingRefundableAmount(req) {
    return req?.body?.data?.cancels[req?.body?.data?.cancels?.length - 1]
      ?.refundableAmount;
  },

  // 기존 테스트용 메서드 (그대로 유지)
  async postPartialCancelForToss1(req, res, next) {
    if (process.env.NODE_ENV === "DEVELOPMENT") console.log("Entered here as well");
    let widgetSecretKey = process.env.COSMOS_TOSS_SECRET_KEY_PAYPAL;
    let cancelReason1 = "The customer has asked to cancel.";

    const encryptedSecretKey1 =
      "Basic " + Buffer.from(widgetSecretKey + ":").toString("base64");

    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("widgetSecretKey : ", widgetSecretKey);
      console.log("encryptedSecretKey1 : ", encryptedSecretKey1);
    }

    try {
      const response = await axios.post(
        `${process.env.COSMOS_TOSS_API_BASE_URL}/payments/${process.env.COSMOS_TOSS_TEST_PAYMENT_KEY}/cancel`,
        { cancelReason: cancelReason1 },
        {
          headers: {
            Authorization: encryptedSecretKey1,
            "Content-Type": "application/json",
          },
        },
      );

      res.status(200).json({ message: "response" });
    } catch (error) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("Refund failure console:", error?.response?.data);
      }
      res.status(200).json({ message: "error" });
    }
  },
};

// 구글 인앱결제 환불 로직 (기존과 동일하지만 일부 개선)
async function processRefund(orderId) {
  try {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(`[Refund] Started - orderId: ${orderId}`);
    }

    // null 체크 추가
    if (!orderId) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error("[Refund] Failed - orderId is null or undefined");
      }
      return;
    }

    let chargeInDB;
    let userInDB;

    try {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(`[Refund] Fetching Charge - orderId: ${orderId}`);
      }
      chargeInDB = await chargeService.getChargeByOrderId(orderId);
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          "[Refund] Charge fetch done:",
          chargeInDB ? "found" : "not found",
        );
      }

      // 무료 이용권 환불 차단
      if (chargeInDB) {
        const isFreeVoucher =
          chargeInDB?.adsFreePass ||
          chargeInDB?.amount === 0 ||
          chargeInDB?.amount === "0" ||
          Number(chargeInDB?.amount) === 0 ||
          chargeInDB?.method === "FREE" ||
          isAdsFreePassProduct(chargeInDB?.productId, chargeInDB?.orderName);

        if (isFreeVoucher) {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log(
              `[Refund] Free voucher refund blocked - orderId: ${orderId}`,
            );
          }
          return;
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          `[Refund] No charge - creating Violation - orderId: ${orderId}`,
        );
      }
      await violationService.createViolation({
        violationType: "GoogleInAppRefund",
        orderId: orderId || "N.A",
        refundedAmount: "N.A",
        remainingQuantity: "null",
        violationDate: new Date(),
        violationDescription: "No charge info due to out of stock",
        userObjId: "N.A",
      });
      return;
    }

    try {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(`[Refund] Fetching User`);
      }
      userInDB = await userService.getUserByObjId(chargeInDB?.userId);
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(`[Refund] User fetch done:`, userInDB ? "found" : "not found");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          `[Refund] No user - creating Violation - orderId: ${orderId}`,
        );
      }
      await violationService.createViolation({
        violationType: "GoogleInAppRefund",
        orderId: orderId || "N.A",
        refundedAmount: `${chargeInDB?.amount}` ?? "null",
        remainingQuantity: "null",
        violationDate: new Date(),
        violationDescription: "No user info due to out of stock or withdraw",
        userObjId: chargeInDB?.userId || "N.A",
      });
      return;
    }

    let orderItem;

    if (userInDB && userInDB?.email) {
      if (
        userInDB?.vouchersInDetail &&
        typeof userInDB?.vouchersInDetail === "object"
      ) {
        try {
          const vouchersValues = Object.values(userInDB?.vouchersInDetail);

          if (chargeInDB?.productId?.split("_")?.includes("package")) {
            if (typeof orderItem !== "object") orderItem = {};
            Object.entries(userInDB?.vouchersInDetail)
              ?.filter((elem) => {
                elem[1]?.forEach((arrElem) => {
                  return arrElem?.[4] === orderId;
                });
              })
              ?.forEach(([key, values]) => {
                orderItem[key] = values?.[0]?.[0] ?? 0;
              });
          } else {
            orderItem = vouchersValues
              ?.filter((elem) => elem?.length !== 0)
              .flat()
              .find((elem) => elem?.[4] === orderId);
          }
        } catch (objectError) {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.error("Error in Object.values:", objectError);
          }
        }
      } else {
        orderItem = null;
      }

      if (!orderItem) {
        // console.log(`No order item found for orderId: ${orderId}`);
      }
    }

    let remainingQuantity;
    let refundQuantity;

    if (chargeInDB?.productId?.split("_")?.includes("package")) {
      refundQuantity = {};
      remainingQuantity = {};

      Object.entries(chargeInDB?.orderHistory || {}).forEach(
        ([type, detail]) => {
          refundQuantity[type] = detail?.[0] ?? 0;
        },
      );

      Object.entries(chargeInDB?.orderHistory || {}).forEach(
        ([type, detail]) => {
          const matchingVoucher = userInDB?.vouchersInDetail?.[type]?.find(
            (v) => v?.[4] === orderId,
          );
          remainingQuantity[type] = matchingVoucher ? matchingVoucher[0] : 0;
        },
      );
    } else {
      remainingQuantity = orderItem?.[0] ?? 0;
      refundQuantity = chargeInDB?.amount ?? 0;
    }

    let result;
    if (chargeInDB?.productId?.split("_")?.includes("package")) {
      result = Object.entries(refundQuantity).some(
        ([type, qty]) => (remainingQuantity[type] ?? 0) < qty,
      );
    } else {
      result =
        (remainingQuantity >= 0 &&
          refundQuantity >= 0 &&
          remainingQuantity < refundQuantity) ||
        !remainingQuantity;
    }

    if (result) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          `[Refund] Violation detected - OrderID: ${orderId}, holding Vouchers: ${JSON.stringify(
            remainingQuantity,
          )}, Requesting Amount: ${JSON.stringify(
            refundQuantity,
          )}, Time: ${new Date().toISOString()}`,
        );
      }

      await violationService.createViolation({
        violationType: "GoogleInAppRefund",
        orderId: orderId || "N.A",
        refundedAmount: JSON.stringify(refundQuantity),
        remainingQuantity: JSON.stringify(remainingQuantity),
        violationDate: new Date(),
        violationDescription: `Violation: holding ${JSON.stringify(
          remainingQuantity,
        )}, requesting ${JSON.stringify(refundQuantity)}`,
        userObjId: userInDB?._id ?? "N.A",
      });

      const originalViolationsInDetail = userInDB?.violationsInDetail || [];
      const violationsInDetail = [
        ...originalViolationsInDetail,
        [
          "GoogleInAppRefund",
          orderId,
          refundQuantity,
          remainingQuantity,
          new Date(),
        ],
      ];

      // userInDB를 메모리에서 갱신 → 이후 트랜잭션의 updateUserVouchers가 올바른 violationsInDetail 사용
      userInDB = {
        ...userInDB,
        isInViolation: true,
        violationsInDetail,
      };

      if (userInDB?.id) {
        // userInDB가 null 아니면
        await cacheClient.del(RedisKeys.user(userInDB.id));
      }

      try {
        await userService.updateUser(userInDB);
      } catch (error) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.error(
            `Fail to record history of violation - OrderID: ${orderId}`,
            error,
          );
        }
      }
    }

    // 트랜잭션: User 바우처 차감 + Charge 삭제
    // 참고: 구글 Pub/Sub 8분 지연으로 인해 완벽한 방지는 불가능하며, violation 체크로 보완
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("[Refund] Transaction started - voucher deduction and Charge delete");
    }
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Refund] User voucher update started");
        }
        const updatedUser = await updateUserVouchers(
          userInDB,
          chargeInDB.orderVouchers,
          chargeInDB.orderHistory,
        );

        await userService.updateUser(updatedUser, session);
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Refund] User vouchers update done");
        }

        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Refund] Deleting Charge");
        }
        await chargeService.deleteChargeByOrderId(orderId, session);
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Refund] Charge deleted");
        }

        // 트랜잭션 성공 후 캐시 삭제
        if (userInDB?.id) {
          await cacheClient.del(RedisKeys.user(userInDB.id));
        }
      });
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[Refund] Transaction completed - success");
      }
    } catch (txError) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error(
          `[Refund] Transaction error - orderId ${orderId}:`,
          txError,
        );
      }
      throw txError;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error(`[Refund] Error - orderId ${orderId}:`, error);
    }
  }
}

async function updateUserVouchers(user, orderVouchers, orderHistory) {
  const safeUser = user || {};
  const safeVouchers = safeUser?.vouchers || {};
  const safeVouchersInDetail = safeUser?.vouchersInDetail || {};
  const safeOrderHistory = orderHistory || {};

  const updatedVouchers = { ...safeVouchers };
  const updatedVouchersInDetail = { ...safeVouchersInDetail };

  let isDone = false;

  try {
    if (safeOrderHistory && typeof safeOrderHistory === "object") {
      const orderHistoryEntries = Object.entries(safeOrderHistory);

      orderHistoryEntries?.forEach(([voucherType, oneVoucherInDetail]) => {
        if (updatedVouchersInDetail[voucherType]?.length > 0) {
          if (Array.isArray(oneVoucherInDetail)) {
            oneVoucherInDetail?.forEach((detail) => {
              const index = updatedVouchersInDetail[voucherType].findIndex(
                (voucher) => {
                  if (voucher?.[4] === detail && voucher?.length === 10)
                    return true;
                  if (
                    voucher?.[4] === detail &&
                    voucher?.length > 10 &&
                    new Date(voucher?.[10]) > new Date()
                  )
                    return true;
                  if (
                    voucher?.[4] === detail &&
                    voucher?.length > 10 &&
                    (voucher?.[10] === "" || voucher?.[10] === "NA")
                  )
                    return true;
                  return false;
                },
              );

              if (index !== -1) {
                updatedVouchersInDetail[voucherType][index][0] -=
                  oneVoucherInDetail?.[0];
                if (updatedVouchersInDetail[voucherType]?.[index]?.[0] <= 0) {
                  updatedVouchersInDetail[voucherType].splice(index, 1);
                }
                isDone = true;
              }
            });
          }

          if (updatedVouchersInDetail[voucherType]?.length === 0) {
            updatedVouchersInDetail[voucherType] = [];
          }
        }
      });
    }
  } catch (entriesError) {
    console.error("Error in Object.entries:", entriesError);
  }

  if (isDone && Array.isArray(orderVouchers)) {
    orderVouchers?.forEach(([voucherType, count]) => {
      if (updatedVouchers?.[voucherType] !== undefined) {
        updatedVouchers[voucherType] -= count;
        if (updatedVouchers?.[voucherType] < 0)
          updatedVouchers[voucherType] = 0;
      }
    });
  }

  return {
    ...safeUser,
    vouchers: { ...safeUser?.vouchers, ...updatedVouchers },
    vouchersInDetail: {
      ...safeUser?.vouchersInDetail,
      ...updatedVouchersInDetail,
    },
  };
}

module.exports = chargeController;
