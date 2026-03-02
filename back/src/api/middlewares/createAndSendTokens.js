const jwt = require("../../common/helpers/jwt");
const { userController } = require("../../domains/user/controllers");
const { buildResponse } = require("../../common/utils/util");
const AppError = require("../../common/errors/AppError");
const {
  getGoogleAccessToken,
  getGoogleRefreshToken,
} = require("../../common/helpers/getGoogleToken");
const { userService } = require("../../domains/user/services");
const {
  setRefreshTokenCookie,
  setGoogleRefreshTokenCookie,
  setAccessTokenCookie,
  setGoogleAccessTokenCookie,
} = require("../../common/helpers/cookieHelper");
const crypto = require("crypto");
const cacheClient = require("../../cache/cacheClient");

/**
 * Google OAuth 인증 후 JWT 토큰을 생성하고 전달합니다.
 *
 * 토큰 전달 방식:
 * - 웹: httpOnly Cookie (보안) + 일반 Cookie (Access Token)
 * - 앱: Redis 임시 저장 → code 파라미터로 전달 (3분 TTL)
 *
 * 보안:
 * - Refresh Token: httpOnly (XSS 방어)
 * - Access Token: 일반 쿠키 (프론트에서 메모리로 이동)
 */
const createAndSendTokens = async (req, res, next, redirectUri) => {
  try {
    const userId = req?.user?.id || req?.user;
    
    // 로그인 시 기존 캐시 삭제 (유저, 타로 캐시)
    if (userId) {
      await cacheClient.del(`user:${userId}`);
      await cacheClient.del(`cache:tarot:${userId}`);
    }
    
    const googleAccessToken = await getGoogleAccessToken(userId);
    const googleRefreshToken = await getGoogleRefreshToken(userId);

    const userInfo = await userService.getUserById(userId);
    
    // 로그인 시 최신 사용자 정보를 캐시에 저장 (1시간 TTL)
    if (userInfo && userId) {
      await cacheClient.set(`user:${userId}`, userInfo, 3600);
    }
    
    const token = jwt.sign(userInfo);
    const JWTAccessToken = token?.accessToken;
    const JWTRefreshToken = token?.refreshToken;

    // 앱 환경: Redis 임시 저장 후 code로 전달
    if (redirectUri && redirectUri.startsWith("cosmostarot://")) {
      const tempCode = crypto.randomBytes(32).toString("hex");

      const tokenData = {
        accessToken: JWTAccessToken,
        refreshToken: JWTRefreshToken,
        createdAt: Date.now(),
      };

      await cacheClient.setex(
        `auth:temp:${tempCode}`,
        180, // 3분 TTL
        JSON.stringify(tokenData)
      );

      // 앱으로 리다이렉트
      // redirectUri에 이미 쿼리 파라미터가 있을 수 있음 (예: ?ref=xxx)
      // 기존 쿼리가 있으면 &, 없으면 ? 사용
      // 올바른 경우: ?ref=xxx&code=yyy
      // 잘못된 경우: ?ref=xxx?code=yyy (URL 파싱 오류)
      const separator = redirectUri.includes("?") ? "&" : "?";
      res.redirect(`${redirectUri}${separator}code=${tempCode}`);
    } else {
      // 웹 환경: Cookie로 전달
      setGoogleAccessTokenCookie(res, googleAccessToken);
      setAccessTokenCookie(res, JWTAccessToken);
      setGoogleRefreshTokenCookie(res, googleRefreshToken);
      setRefreshTokenCookie(res, JWTRefreshToken);

      res.redirect(process.env.COSMOS_CLIENT_URL);
    }
  } catch (err) {
    next(new AppError(err.name, err.message, 401));
  }
};

module.exports = createAndSendTokens;
