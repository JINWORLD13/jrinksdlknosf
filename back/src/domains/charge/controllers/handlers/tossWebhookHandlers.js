//토스 페이먼츠 웹훅 처리 모듈. 결제 완료/취소/부분취소, 가상계좌 완료, 환불 이용권 처리. deps는 chargeController에서 주입.
//Toss Paymentsウェブフック処理モジュール。決済完了/キャンセル/部分キャンセル、仮想口座入金完了、返金利用券処理。depsはchargeControllerから注入。
//Toss Payments webhook handler. Payment done/cancel/partial cancel, virtual account done, refund voucher. deps injected by chargeController.

const mongoose = require("mongoose");

// 비가상계좌 웹훅 라우팅
// 非仮想口座ウェブフックのルーティング
// Non-virtual-account webhook routing
async function handleNonVirtualAccountWebhook(
  deps,
  req,
  res,
  { status, orderId, chargeInDB, userInDB, vouchers },
) {
  switch (status) {
    case "DONE":
      return handlePaymentDone(deps, req, res, {
        orderId,
        chargeInDB,
        userInDB,
      });
    case "CANCELED":
      return handlePaymentCanceled(deps, req, res, {
        orderId,
        userInDB,
        vouchers,
      });
    case "PARTIAL_CANCELED":
      return handlePartialCanceled(deps, req, res, {
        orderId,
        userInDB,
        vouchers,
      });
    default:
      return res.status(200).end();
  }
}

//가상계좌 웹훅 라우팅
//仮想口座ウェブフックのルーティング
//Virtual account webhook routing
async function handleVirtualAccountWebhook(
  deps,
  req,
  res,
  { status, orderId, chargeInDB, userInDB, vouchers, orderVouchers },
) {
  switch (status) {
    case "DONE":
      return handleVirtualAccountDone(deps, req, res, {
        orderId,
        chargeInDB,
        userInDB,
        vouchers,
        orderVouchers,
      });
    case "CANCELED":
      if (chargeInDB.apiName === "Toss") {
        return handlePaymentCanceled(deps, req, res, {
          orderId,
          userInDB,
          vouchers,
        });
      }
      await deps.chargeService.deleteChargeByOrderId(orderId);
      return res.status(200).json({ status });
    case "PARTIAL_CANCELED":
      return handlePartialCanceled(deps, req, res, {
        orderId,
        userInDB,
        vouchers,
      });
    default:
      return res.status(200).end();
  }
}

/** 결제 완료 처리 (일반 결제) */
async function handlePaymentDone(
  deps,
  req,
  res,
  { orderId, chargeInDB, userInDB },
) {
  if (process.env.NODE_ENV === "DEVELOPMENT") console.log("Payment completed");

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await deps.chargeService.putChargeByOrderId(
        orderId,
        {
          apiName: "Toss",
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
        },
        session,
      );

      await deps.updateUserVouchersInDetail(
        orderId,
        chargeInDB,
        userInDB,
        session,
      );
      await deps.cacheClient.del(deps.RedisKeys.user(userInDB.id));
    });
  } finally {
    await session.endSession();
  }
  return res.status(200).json({ success: true });
}

// 가상계좌 입금 완료 처리
// 仮想口座入金完了処理
// Virtual account deposit completed
async function handleVirtualAccountDone(
  deps,
  req,
  res,
  { orderId, chargeInDB, userInDB, vouchers, orderVouchers },
) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      let updatedVouchersInDetail = Object.fromEntries(
        Object.entries(chargeInDB?.orderHistory).map(
          ([key, valueOfArray]) => {
            let vouchersInDetailOfUser;
            if (
              !userInDB?.vouchersInDetail ||
              !userInDB?.vouchersInDetail[key]
            ) {
              vouchersInDetailOfUser = { [key]: [] };
            } else {
              vouchersInDetailOfUser = userInDB?.vouchersInDetail;
            }
            const doubleArray = [...vouchersInDetailOfUser?.[key]] || [];
            doubleArray.push(valueOfArray);
            return [key, doubleArray];
          },
        ),
      );

      let updatedVouchers = { ...vouchers };
      let updatedStars = userInDB.stars || 0;

      orderVouchers?.forEach((elem) => {
        const key = elem?.[0];
        if (key === "stars") {
          updatedStars += elem[1];
        } else {
          updatedVouchers[key] = (vouchers?.[key] || 0) + elem[1];
        }
      });

      const userUpdateData = {
        ...userInDB,
        vouchersInDetail: {
          ...userInDB?.vouchersInDetail,
          ...updatedVouchersInDetail,
        },
        vouchers: { ...updatedVouchers },
        stars: updatedStars,
      };

      if (
        chargeInDB?.productId ===
          process.env.VITE_COSMOS_VOUCHERS_BUNDLE_PACKAGE_NEWBIE ||
        chargeInDB?.productId === process.env.COSMOS_PRODUCT_NEWBIE_PACKAGE
      ) {
        userUpdateData.purchased = {
          ...userInDB?.purchased,
          packageForNewbie: true,
        };
      }

      await deps.userService.updateUser(userUpdateData, session);

      await deps.chargeService.putChargeByOrderId(
        orderId,
        {
          apiName: "Toss",
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
        },
        session,
      );

      await deps.updateUserVouchersInDetail(
        orderId,
        chargeInDB,
        userInDB,
        session,
      );
      await deps.cacheClient.del(deps.RedisKeys.user(userInDB.id));
    });
  } finally {
    await session.endSession();
  }
  return res.status(200).json({ success: true });
}

// 전액 취소 웹훅 처리
// 全額キャンセルウェブフック処理
// Full refund webhook handling
async function handlePaymentCanceled(
  deps,
  req,
  res,
  { orderId, userInDB, vouchers },
) {
  const countKey = deps.RedisKeys.requestCount(orderId);
  const requestCount = (await deps.cacheClient.get(countKey)) || 0;

  if (requestCount === 0) return res.status(200).json({});

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("Full cancel webhook entered, requestCount:", requestCount);
  }

  if (requestCount === 1) {
    const vouchersKey = deps.RedisKeys.vouchersForRefund(orderId);
    const vouchersObjForRefund = (await deps.cacheClient.get(vouchersKey)) || {};

    if (Object.keys(vouchersObjForRefund).length > 0) {
      await processRefundVouchers(
        deps,
        userInDB,
        vouchersObjForRefund,
        orderId,
        req,
      );
      await deps.cacheClient.del(countKey);
      await deps.cacheClient.del(vouchersKey);
    }
  }

  if (requestCount > 1) {
    await deps.cacheClient.set(countKey, requestCount - 1, 3600);
  } else {
    await deps.cacheClient.del(countKey);
  }
  return res.status(200).json({});
}

// 부분 취소 웹훅 처리
// 部分キャンセルウェブフック処理
// Partial cancel webhook handling
async function handlePartialCanceled(
  deps,
  req,
  res,
  { orderId, userInDB, vouchers },
) {
  const countKey = deps.RedisKeys.requestCount(orderId);
  const requestCount = (await deps.cacheClient.get(countKey)) || 0;

  if (requestCount === 0) return res.status(200).json({});

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("Partial cancel webhook entered, requestCount:", requestCount);
  }

  if (requestCount === 1) {
    const vouchersKey = deps.RedisKeys.vouchersForRefund(orderId);
    const vouchersObjForRefund = (await deps.cacheClient.get(vouchersKey)) || {};

    if (Object.keys(vouchersObjForRefund).length > 0) {
      await processRefundVouchers(
        deps,
        userInDB,
        vouchersObjForRefund,
        orderId,
        req,
      );
      await deps.cacheClient.del(countKey);
      await deps.cacheClient.del(vouchersKey);
    }
  }

  if (requestCount > 1) {
    await deps.cacheClient.set(countKey, requestCount - 1, 3600);
  } else {
    await deps.cacheClient.del(countKey);
  }
  return res.status(200).json({});
}

// 환불 이용권 처리 (바우처 차감 + Charge 삭제)
// 返金利用券処理（バウチャー減算＋Charge削除）
// Refund voucher processing (voucher deduction + Charge delete)
async function processRefundVouchers(
  deps,
  userInDB,
  vouchersObjForRefund,
  orderId,
  req,
) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      let updatedVouchers = { ...userInDB.vouchers };
      const keysArr = Object.keys(vouchersObjForRefund);
      const vouchersArrForRefund = keysArr.map((key) => {
        let total = 0;
        vouchersObjForRefund[key]?.forEach((arr) => {
          total += arr[0];
        });
        return [key, total];
      });

      vouchersArrForRefund.forEach((voucher) => {
        const key = voucher[0];
        const newValue = updatedVouchers[key] - voucher[1];
        updatedVouchers[key] = newValue < 0 ? 0 : newValue;
      });

      const updatedVouchersInDetail = deps.updateVouchersInDetailForRefund(
        userInDB.vouchersInDetail,
        vouchersObjForRefund,
      );

      await deps.userService.updateUser(
        {
          ...userInDB,
          vouchersInDetail: {
            ...userInDB.vouchersInDetail,
            ...updatedVouchersInDetail,
          },
          vouchers: updatedVouchers,
        },
        session,
      );

      const minimumRefundableLimit = deps.calculateMinimumRefundableLimit(req);
      const remainingAmount = deps.getRemainingRefundableAmount(req);

      if (req?.body?.data?.cancels?.length > 0) {
        if (remainingAmount <= minimumRefundableLimit) {
          await deps.chargeService.deleteChargeByOrderId(orderId, session);
        }
      }
      await deps.cacheClient.del(deps.RedisKeys.user(userInDB.id));
    });
  } finally {
    await session.endSession();
  }
}

module.exports = {
  handleNonVirtualAccountWebhook,
  handleVirtualAccountWebhook,
  handlePaymentDone,
  handleVirtualAccountDone,
  handlePaymentCanceled,
  handlePartialCanceled,
  processRefundVouchers,
};
