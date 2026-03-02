const authRouter = require("express").Router();
const { routes: routeConfig } = require("../../config/routes");
const googlePassport = require("../middlewares/googlePassportForJWT");
const AppError = require("../../common/errors/AppError");
const commonErrors = require("../../common/errors/commonErrors");
const createAndSendTokens = require("../middlewares/createAndSendTokens");
const { refreshVerify } = require("../../common/helpers/jwt");
const { clearAllCookies } = require("../../common/helpers/cookieHelper");
const cacheClient = require("../../cache/cacheClient");

// OAuth 로그인 시작
authRouter.get(
  "/oauth/google/start",
  (req, res, next) => {
    // Navbar.jsx에서 리다이렉트 요청 시 쿠키에 저장
    const redirectUri = req?.query?.redirect_uri || ""; //! capacitor 용 리다이렉트

    // OAuth 플로우 중 유지하기 위해 쿠키에 저장 (임시)
    if (redirectUri) {
      res.cookie("oauth_redirect_uri", redirectUri, {
        httpOnly: true,
        maxAge: 10 * 60 * 1000, // 10분
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    next();
  },
  googlePassport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline", // refreshToken 발급용
    prompt: "consent", // 동의화면. refreshToken 발급용2
  }),
);

//! Google 로그인 콜백
authRouter.get("/oauth/google/callback", (req, res, next) => {
  googlePassport.authenticate(
    "google",
    { session: false },
    (err, user, info) => {
      const redirectUri = req.cookies.oauth_redirect_uri || "";

      if (err) {
        if (
          err.message === "BLOCKED_REGION" ||
          err.message === "BLOCKED_USER"
        ) {
          res.clearCookie("oauth_redirect_uri");
          return res.status(403).json({
            success: false,
            blockedRegion: true,
            message: "unknown error", // 보안상 구체적인 이유는 숨김
          });
        }
        return next(err);
      }
      if (!user) {
        return res.redirect(`${routeConfig.authenticate}/oauth/google/fail`);
      }
      res.clearCookie("oauth_redirect_uri");
      req.user = user;
      createAndSendTokens(req, res, next, redirectUri);
    },
  )(req, res, next);
});

authRouter.get("/oauth/google/fail", (req, res, next) => {
  // 쿠키에서 redirectUri 읽기
  const redirectUri = req.cookies.oauth_redirect_uri || "";
  // 쿠키 삭제
  res.clearCookie("oauth_redirect_uri");

  if (redirectUri && redirectUri.startsWith("cosmostarot://")) {
    // 앱으로 리다이렉트
    res.redirect(`${redirectUri}`);
  } else {
    // 웹으로 리다이렉트
    res.redirect(process.env.COSMOS_CLIENT_URL);
  }
});

authRouter.get("/oauth/google/logout", async (req, res, next) => {
  try {
    // 로그아웃 시 Redis 캐시 삭제 (유저, 타로 캐시)
    // 토큰에서 userId 추출 (만료되어도 payload는 읽을 수 있음)
    const jwt = require("jsonwebtoken");
    let userId = null;

    try {
      // 액세스 토큰 또는 리프레시 토큰에서 userId 추출
      const accessToken =
        req.cookies.accessTokenCosmos || req.headers.authorization?.slice(7);
      const refreshToken =
        req.cookies.refreshTokenCosmos || req.headers["refresh-token"];

      if (accessToken) {
        const decoded = jwt.decode(accessToken);
        userId = decoded?.user?.id;
      } else if (refreshToken) {
        const secretKey = require("../../config/secretKey").secretKey;
        const decoded = jwt.verify(refreshToken, secretKey);
        userId = decoded?.user?.id;
      }

      // 캐시 삭제
      if (userId) {
        await cacheClient.del(`user:${userId}`);
        await cacheClient.del(`cache:tarot:${userId}`);
      }
    } catch (err) {
      // 토큰 추출 실패 시 무시하고 계속 진행 (캐시 삭제 실패해도 로그아웃은 진행)
      console.log("Cache delete failed on logout (ignored):", err.message);
    }

    clearAllCookies(res); // cookieHelper 사용
    const logoutRedirectUri = req?.query?.redirect_uri || "";
    if (logoutRedirectUri && logoutRedirectUri.startsWith("cosmostarot://")) {
      // 앱으로 리다이렉트
      res.redirect(`${logoutRedirectUri}`);
    } else {
      // 웹으로 리다이렉트
      res.redirect(process.env.COSMOS_CLIENT_URL);
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.name, err.message, 401));
  }
});

//! 임시 코드를 토큰으로 교환하는 엔드포인트
authRouter.post("/oauth/token-exchange", async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(new AppError("no code", "인증 코드가 없습니다.", 400));
    }

    // Redis에서 임시 코드로 토큰 조회 (cacheClient.get이 자동으로 JSON.parse 해줌)
    const tokenData = await cacheClient.get(`auth:temp:${code}`);

    if (!tokenData) {
      return next(
        new AppError(
          "invalid or expired code",
          "인증 코드가 유효하지 않거나 만료되었습니다. 다시 로그인해주세요.",
          401,
        ),
      );
    }

    // 즉시 Redis에서 삭제 (일회용)
    await cacheClient.del(`auth:temp:${code}`);

    // 토큰 반환
    res.status(200).json({
      success: true,
      data: {
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
      },
    });
  } catch (err) {
    console.error("Token exchange error:", err);
    next(
      new AppError(err.name, err.message || "토큰 교환에 실패했습니다.", 500),
    );
  }
});

//! 토큰 갱신 엔드포인트 (헤더 또는 쿠키에서 리프레쉬 토큰 읽기)
authRouter.post("/refresh", async (req, res, next) => {
  try {
    // 리프레쉬 토큰: 헤더(네이티브 앱) 또는 쿠키(웹)에서 읽기
    const refreshToken =
      req.headers["refresh-token"] || // 네이티브 앱용
      req.cookies.refreshTokenCosmos; // 웹용

    if (!refreshToken) {
      return next(
        new AppError(
          "no refresh token",
          "리프레시 토큰이 없습니다. 다시 로그인 해주세요.",
          401,
        ),
      );
    }

    // userId는 요청 body나 쿠키의 액세스 토큰에서 추출 (만료되어도 payload는 읽을 수 있음)
    const jwt = require("jsonwebtoken");
    const secretKey = require("../../config/secretKey").secretKey;

    // 만료된 액세스 토큰에서 userId 추출
    let userId;
    try {
      const decoded = jwt.decode(
        req.body.accessToken || req.headers.authorization?.slice(7),
      );
      userId = decoded?.user?.id;
    } catch (err) {
      // 액세스 토큰이 없거나 디코딩 실패시, 리프레쉬 토큰에서 추출
      const decodedRefresh = jwt.verify(refreshToken, secretKey);
      userId = decodedRefresh?.user?.id;
    }

    if (!userId) {
      return next(
        new AppError("invalid token", "유효하지 않은 토큰입니다.", 401),
      );
    }

    // 리프레쉬 토큰 검증 및 새 액세스 토큰 생성
    const result = refreshVerify(refreshToken, userId);

    if (result.error) {
      return next(
        new AppError(
          "token refresh failed",
          "토큰 갱신에 실패했습니다. 다시 로그인 해주세요.",
          401,
        ),
      );
    }

    // 새 액세스 토큰 반환
    res.status(200).json({
      success: true,
      data: {
        newAccessToken: result.newAccessToken,
      },
    });
  } catch (err) {
    console.log(err);
    next(new AppError(err.name, err.message, 401));
  }
});

module.exports = authRouter;
