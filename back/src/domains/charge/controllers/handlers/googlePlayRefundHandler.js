//구글 플레이 환불 웹훅 처리. Pub/Sub 디코딩, orderId 추출, 락/검증/환불 오케스트레이션. processRefund·verifyPurchaseWithGooglePlay는 controller에서 주입.
//Google Play返金ウェブフック処理。Pub/Subデコード、orderId抽出、ロック/検証/返金オーケストレーション。processRefund・verifyPurchaseWithGooglePlayはcontrollerから注入。
//Google Play refund webhook. Pub/Sub decode, orderId extraction, lock/verify/refund orchestration. processRefund and verifyPurchaseWithGooglePlay injected by controller.

const LOCK_TTL_SEC = 300;
const NOTIFICATION_SUBSCRIPTION_CANCELED = 3;
const NOTIFICATION_SUBSCRIPTION_REVOKED = 12;
const NOTIFICATION_SUBSCRIPTION_EXPIRED = 13;

// Pub/Sub 메시지에서 orderId 추출
// Pub/SubメッセージからorderIdを抽出
// Extract orderId from Pub/Sub message
async function parseAndExtractOrderId(body, getChargeByPurchaseToken) {
  if (!body?.message?.data) {
    return { orderId: "", message: null };
  }
  const decodedString = Buffer.from(body.message.data, "base64").toString(
    "utf-8",
  );
  const message = JSON.parse(decodedString);
  let orderId = "";
  let purchaseToken = "";

  if (message.voidedPurchaseNotification) {
    orderId = message.voidedPurchaseNotification.orderId || "";
    purchaseToken = message.voidedPurchaseNotification.purchaseToken || "";
    if (orderId && purchaseToken) {
      const chargeByToken = await getChargeByPurchaseToken(purchaseToken);
      if (chargeByToken?.orderId) orderId = chargeByToken.orderId;
    }
  } else if (message.subscriptionNotification) {
    const sub = message.subscriptionNotification;
    purchaseToken = sub.purchaseToken || "";
    const notificationType = Number(sub.notificationType);
    const isRevokeOrCancel =
      notificationType === NOTIFICATION_SUBSCRIPTION_CANCELED ||
      notificationType === NOTIFICATION_SUBSCRIPTION_REVOKED ||
      notificationType === NOTIFICATION_SUBSCRIPTION_EXPIRED;
    if (purchaseToken && isRevokeOrCancel) {
      const chargeByToken = await getChargeByPurchaseToken(purchaseToken);
      if (chargeByToken?.orderId) orderId = chargeByToken.orderId;
    }
  }

  return { orderId, message };
}

//구글 플레이 환불 웹훅 처리 (OIDC 검증은 호출부에서 수행)
//Google Play返金ウェブフック処理（OIDC検証は呼び出し元で実行）
//Google Play refund webhook handling (OIDC verification done by caller)
async function handleRefundWebhook(req, res, deps) {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("[GooglePlay refund] Webhook called");
  }

  try {
    if (!req?.body || !req?.body?.message) {
      return res.status(200).end();
    }

    const { orderId, message } = await parseAndExtractOrderId(
      req.body,
      deps.chargeService.getChargeByPurchaseToken.bind(deps.chargeService),
    );

    if (process.env.NODE_ENV === "DEVELOPMENT" && message) {
      console.log("[GooglePlay refund] Event received:", JSON.stringify(message));
    }

    if (!orderId && message && (message.voidedPurchaseNotification || message.subscriptionNotification)) {
      console.warn(
        "[GooglePlay refund] orderId not extracted - received message:",
        JSON.stringify(message),
      );
    }

    if (orderId) {
      const lockKey = `lock:refund:${orderId}`;
      const isLocked = await deps.cacheClient.exists(lockKey);
      if (isLocked) {
        return res.status(200).json({ success: true, message: "Processing" });
      }
      await deps.cacheClient.set(lockKey, "locked", LOCK_TTL_SEC);

      try {
        const chargeInDB = await deps.chargeService.getChargeByOrderId(orderId);
        if (chargeInDB && chargeInDB.purchaseToken) {
          const isValid = await deps.verifyPurchaseWithGooglePlay(
            chargeInDB.packageName || deps.defaultPackageName || "com.cosmos_tarot.cosmos",
            chargeInDB.productId,
            chargeInDB.purchaseToken,
          );
          if (!isValid) {
            await deps.processRefund(orderId);
          }
        } else {
          await deps.processRefund(orderId);
        }
      } finally {
        await deps.cacheClient.del(lockKey);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error("[GooglePlay refund] Error:", error);
    }
    return res.status(200).json({ success: false });
  }
}

module.exports = {
  parseAndExtractOrderId,
  handleRefundWebhook,
};
