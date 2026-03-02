const axios = require("axios");
const NodeCache = require("node-cache");
const { userService } = require("../../domains/user/services");

const myCache = new NodeCache({ stdTTL: 110, checkperiod: 120 });

//& (참고) 이 모듈을 쓰려면 authRouter에 해당 미들웨어코드에 scope 설정 해줘야 함...
// googlePassport.authenticate("google", {
//   scope: ["profile", "email", "https://www.googleapis.com/auth/androidpublisher"],
//   accessType: "offline", // refreshToken 발급용
//   prompt: "consent", // 동의화면. refreshToken 발급용2
// })

//! 리프레쉬 발급 받는건 없네;
async function getNewAccessToken(refreshToken) {
  console.log("Attempting to get new access token...");
  try {
    const response = await axios({
      method: "post",
      url: "https://oauth2.googleapis.com/token",
      data: {
        grant_type: "refresh_token",
        client_id: process.env.COSMOS_GOOGLE_CLIENT_ID,
        client_secret: process.env.COSMOS_GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
      },
    });
    console.log("New access token obtained successfully");
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting new access token:", error);
    throw error;
  }
}

async function consumeInAppPurchase(
  packageName,
  productId,
  purchaseToken,
  userInfo,
  isFirstConsumption = true
) {
  console.log(`[START] consumeInAppPurchase`);
  console.log(
    `Attempting to consume in-app purchase: PackageName: ${packageName}, ProductId: ${productId}, PurchaseToken: ${purchaseToken}, IsFirstConsumption: ${isFirstConsumption}`
  );

  // 캐시에 토큰이 있는지 확인
  if (myCache.has(purchaseToken)) {
    console.log("This token has already been consumed recently (Cache hit)");
    return;
  }

  try {
    // 첫 번째 소비가 아닌 경우에만 verify 수행
    if (!isFirstConsumption) {
      console.log("[VERIFY] Verifying purchase before consumption");
      const verifyRes = await verifyPurchase(
        packageName,
        productId,
        purchaseToken,
        userInfo.accessToken
      );
      console.log(
        "[VERIFY] Verification response:",
        JSON.stringify(verifyRes.data, null, 2)
      );

      if (verifyRes.data.consumptionState === 1) {
        console.log("This purchase has already been consumed (API check)");
        myCache.set(purchaseToken, true);
        return;
      }
    }

    // 소비 처리 진행
    console.log("[CONSUME] Proceeding with purchase consumption");
    const isValidPurchase = await verifyPurchaseWithGooglePlay(
      packageName,
      productId,
      purchaseToken
    );
    // 구매 확인 후
    if (isValidPurchase) {
      const consumeRes = await consumePurchase(
        packageName,
        productId,
        purchaseToken,
        userInfo.accessToken
      );
      // 소비 성공 시 캐시에 저장
      myCache.set(purchaseToken, true);
      console.log(
        "[CONSUME] Purchase consumed successfully. Response:",
        JSON.stringify(consumeRes.data, null, 2)
      );
      return consumeRes.data;
      // 여기서 사용자에게 아이템을 지급하는 등의 처리를 합니다.
    }
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
    } else if (err.response && err.response.status === 401) {
      // Access token이 만료된 경우, 리프레시 토큰으로 새 액세스 토큰 발급
      console.log(
        "[REFRESH] Access token is invalid. Trying to refresh token..."
      );
      const newAccessToken = await getNewAccessToken(userInfo.refreshToken);
      console.log("[REFRESH] New access token obtained, updating user info");
      await userService.updateUser({
        ...userInfo,
        accessToken: newAccessToken,
      });
      console.log("[RETRY] Retrying consumption with new access token");
      return await consumeInAppPurchase(
        packageName,
        productId,
        purchaseToken,
        { ...userInfo, accessToken: newAccessToken },
        false
      );
    } else {
      throw err;
    }
  } finally {
    console.log(`[END] consumeInAppPurchase`);
  }
}

async function verifyPurchase(
  packageName,
  productId,
  purchaseToken,
  accessToken
) {
  console.log(
    `[VERIFY] Verifying purchase: PackageName: ${packageName}, ProductId: ${productId}, PurchaseToken: ${purchaseToken}`
  );
  const response = await axios.get(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  console.log(
    "[VERIFY] Verification response:",
    JSON.stringify(response.data, null, 2)
  );
  return response;
}

async function consumePurchase(
  packageName,
  productId,
  purchaseToken,
  accessToken
) {
  console.log(
    `[CONSUME] Consuming purchase: PackageName: ${packageName}, ProductId: ${productId}, PurchaseToken: ${purchaseToken}`
  );
  const response = await axios.post(
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}:consume`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(
    "[CONSUME] Consumption response:",
    JSON.stringify(response.data, null, 2)
  );
  return response;
}

module.exports = { consumeInAppPurchase };
