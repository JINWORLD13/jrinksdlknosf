// 토스 페이먼츠 API 클라이언트. 결제 상태 조회, 결제 확인, 부분/전액 취소. secretKey/URL은 호출부에서 주입.
// Toss Payments APIクライアント。決済状態照会、決済確認、部分/全額キャンセル。secretKey/URLは呼び出し元から注入。
// Toss Payments API client. Get payment status, confirm payment, partial/full cancel. secretKey/URL injected by caller.

const axios = require("axios");

const TOSS_PAYMENTS_BASE = "https://api.tosspayments.com/v1";

// Basic 인증 헤더 생성
// Basic認証ヘッダー生成
// Build Basic auth header
function authHeader(secretKey) {
  return `Basic ${Buffer.from(`${secretKey}:`, "utf8").toString("base64")}`;
}

// 결제 상태 조회 (DONE/CANCELED 여부)
// 決済状態照会（DONE/CANCELEDかどうか）
// Get payment status (whether DONE or CANCELED)
async function getPaymentStatus(paymentKey, secretKey) {
  try {
    const response = await axios.get(
      `${TOSS_PAYMENTS_BASE}/payments/${paymentKey}`,
      {
        headers: {
          Authorization: authHeader(secretKey),
          "Content-Type": "application/json",
        },
      },
    );
    return (
      response.data.status === "DONE" || response.data.status === "CANCELED"
    );
  } catch (error) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.error("Error checking payment status:", error);
    }
    return false;
  }
}

// 결제 확인 (승인)
// 決済確認（承認）
// Confirm payment (approve)
async function confirmPayment(confirmUrl, body, secretKey, idempotencyKey) {
  return axios.post(confirmUrl, body, {
    headers: {
      Authorization: authHeader(secretKey),
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    responseType: "json",
  });
}

// 결제 취소 (부분/전액)
// 決済キャンセル（部分/全額）
// Cancel payment (partial/full)
async function cancelPayment(cancelUrl, cancelOption, secretKey) {
  return axios.post(cancelUrl, cancelOption, {
    headers: {
      Authorization: authHeader(secretKey),
      "Content-Type": "application/json",
    },
  });
}

module.exports = {
  getPaymentStatus,
  confirmPayment,
  cancelPayment,
};
