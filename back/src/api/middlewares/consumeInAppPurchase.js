const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const NodeCache = require("node-cache");

//! 서버 RAM에 저장함. 대역폭이나 추가비용 없음. 다만, 메모리 부족시 문제
//! stdTTL: 110 -> 110초 뒤 자동 삭제
//! checkperiod: 120 -> 120초마다 만료된 캐시 항목을 정리
const myCache = new NodeCache({ stdTTL: 110, checkperiod: 120 });

// 서비스 계정 키 읽기 (지연 로딩 - 환경 변수 또는 파일)
let serviceAccount = null;

const getServiceAccount = () => {
  if (serviceAccount) {
    return serviceAccount;
  }

  // 1. 환경 변수에서 읽기 (Railway 등에서 사용)
  if (process.env.COSMOS_GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.COSMOS_GOOGLE_SERVICE_ACCOUNT_JSON);
      return serviceAccount;
    } catch (error) {
      console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", error);
    }
  }

  // 2. 파일에서 읽기 (로컬 개발 환경)
  const secretPath = path.join(
    __dirname,
    "../../.secret/cosmos-tarot-2024-ef33be4bcecf.json"
  );

  try {
    if (fs.existsSync(secretPath)) {
      serviceAccount = JSON.parse(fs.readFileSync(secretPath, "utf8"));
      return serviceAccount;
    }
  } catch (error) {
    console.error("Failed to read service account file:", error);
  }

  // 파일이 없으면 null 반환 (서버는 시작되지만 해당 기능은 사용 불가)
  return null;
};

// JWT 토큰 생성 함수
const createJWT = () => {
  const account = getServiceAccount();
  if (!account) {
    throw new Error(
      "Google Service Account not configured. Please set GOOGLE_SERVICE_ACCOUNT_JSON environment variable or provide the service account file."
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/androidpublisher",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  return jwt.sign(payload, account.private_key, { algorithm: "RS256" });
};

// 액세스 토큰 얻기
const getAccessToken = async () => {
  const token = createJWT();
  const response = await axios.post("https://oauth2.googleapis.com/token", {
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: token,
  });
  return response.data.access_token;
};

// 취소, 환불 또는 지불 거절된 구매를 나열합니다.
const getVoidedPurchases = async (packageName) => {
  console.log(`[START] getVoidedPurchases for package: ${packageName}`);
  try {
    const accessToken = await getAccessToken();
    const url = `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/voidedpurchases`;
    const now = Math.floor(Date.now() / 1000); // 초 단위로 변환
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

    const response = await axios.get(url, {
      params: {
        startTime: thirtyDaysAgo.toString(),
        endTime: now.toString(),
        maxResults: 1000,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("Voided Purchases:", response.data.voidedPurchases);
    return response.data.voidedPurchases;
  } catch (error) {
    console.error("Error fetching voided purchases:", error);
    if (error.response) {
      console.error("Error response data:", error.response.data);
    }
    throw error;
  } finally {
    console.log(`[END] getVoidedPurchases`);
  }
};

//구글 인앱 결제 api에 소비(consume) 상태 처리를 위한 미들웨어
const consumeInAppPurchase = async (
  packageName,
  productId,
  purchaseToken,
  isFirstConsumption = true
) => {
  console.log(`[START] consumeInAppPurchase`);
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(
      `Attempting to consume in-app purchase: PackageName: ${packageName}, ProductId: ${productId}, PurchaseToken: ${purchaseToken}, IsFirstConsumption: ${isFirstConsumption}`
    );
  } else {
    console.log(`Attempting to consume in-app purchase`);
  }

  if (myCache.has(purchaseToken)) {
    //! 이미 소비된 토큰은 myCache에 저장되어 있기에 중복 소비 방지용 코드
    console.log("This token has already been consumed recently (Cache hit)");
    return;
  }

  try {
    const accessToken = await getAccessToken();

    if (!isFirstConsumption) {
      //! 구매 상태를 검증(소비된 상태인지 아닌지 확인)
      console.log("[VERIFY] Verifying purchase before consumption");
      const verifyUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}`;
      const verifyRes = await axios.get(verifyUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      console.log(
        "[VERIFY] Verification response:",
        JSON.stringify(verifyRes.data, null, 2)
      );

      if (verifyRes.data.consumptionState === 1) {
        //! 이미 소비 됨..
        console.log("This purchase has already been consumed (API check)");
        myCache.set(purchaseToken, true); // 이미 소비된 토근은 캐시에 저장하여 중복 소비를 방지합니다.
        return;
      }
    }

    //! 소비 처리 요청
    console.log("[CONSUME] Proceeding with purchase consumption");
    const consumeUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}:consume`;
    const consumeRes = await axios.post(
      consumeUrl,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    myCache.set(purchaseToken, true);
    console.log(
      "[CONSUME] Purchase consumed successfully. Response:",
      JSON.stringify(consumeRes.data, null, 2)
    );
    return consumeRes.data;
  } catch (err) {
    console.error("[ERROR] Error in consumeInAppPurchase:", err);
    if (err.response) {
      console.error(
        "Error response:",
        JSON.stringify(err.response.data, null, 2)
      );
    }

    if (err.response && err.response.status === 410) {
      console.log("This purchase has already been consumed (410 error)");
      myCache.set(purchaseToken, true);
    } else {
      throw err;
    }
  } finally {
    console.log(`[END] consumeInAppPurchase`);
  }
};

module.exports = { consumeInAppPurchase, getVoidedPurchases };
