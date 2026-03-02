const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const { userService } = require("../../domains/user/services");
const {
  getGoogleAccessToken,
  getGoogleRefreshToken,
} = require("../../common/helpers/getGoogleToken");
const jwt = require("../../common/helpers/jwt");
const { parseUserAgent } = require("../../common/utils/parseUserAgent");
const { isBlockedRegion } = require("../../common/utils/geoByIp");
const {
  BLOCKED_IPS,
  BLOCKED_DEVICE_TYPES,
  BLOCKED_NAMES,
  BLOCKED_GOOGLE_IDS,
} = require("../../common/utils/blockedUsers");
const areObjectsEqual = require("../../common/utils/areObjectsEqual");

// 사람 구분: Google OAuth id(profile.id)로 함. ipAdd·userAgent는 세션/통계/이상 접근 확인용.

//! 모바일 환경에서는 브라우저 종료나, 한동안 창을 닫고 있거나, 메모리가 알아서 서버 종료(즉, 세션종료..) => 재접속시 로그인 NOT FOUND 에러 발생.
//! 그래서 토큰으로 대체함.

//? express-jwt로 간편하게 jwt verify하는 법
/**
  const jwt = require('express-jwt');    
  const jwtMiddleware = jwt({
  secret: JWT_SECRET,
  algorithms: ['HS256']
  });
  app.use('/protected', jwtMiddleware, (req, res) => {
  res.json({ message: 'Access granted!' });
  });
 */
//? passport에도 jwt decode 하는 전략 있음.
/**
 const JwtStrategy = require('passport-jwt').Strategy;
 const ExtractJwt = require('passport-jwt').ExtractJwt;
 */

passport.use(
  "google",
  new GoogleStrategy(
    {
      authorizationURL: process.env.COSMOS_GOOGLE_AUTH_URL,
      clientID: process.env.COSMOS_GOOGLE_CLIENT_ID,
      clientSecret: process.env.COSMOS_GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.COSMOS_GOOGLE_SIGN_REDIRECT_URI,
      passReqToCallback: true,
    },
    //! 구글OAuth에서 발급하는 accessToken 및 refreshToken에서 accessToken은 수명이 1시간 이내로 짧다.
    async function (req, accessToken, refreshToken, profile, done) {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("googlePassportForJWT running");
      }
      try {
        const ua = parseUserAgent(req?.headers?.["user-agent"]);
        // trust proxy 사용 시 req.ip가 프록시 뒤 클라이언트 IP(x-forwarded-for 첫 값)로 설정됨
        const clientIp =
          (req.ip && String(req.ip).trim()) ||
          (req.headers["x-forwarded-for"] &&
            String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
          req.socket?.remoteAddress ||
          "";

        // 1. 지역 차단 (양양, 춘천)
        if (clientIp && (await isBlockedRegion(clientIp))) {
          return done(new Error("BLOCKED_REGION"));
        }

        // 2. IP 차단 (특정 IP)
        // BLOCKED_IPS에 포함되어 있는지 확인
        if (clientIp && BLOCKED_IPS.some((ip) => clientIp.includes(ip))) {
          return done(new Error("BLOCKED_USER"));
        }

        // 3. 기기 차단 (SM-M536S 등)
        // rawUA나 deviceType에 차단 키워드가 포함되어 있는지 확인
        const uaString = ua.rawUA || "";
        const deviceString = ua.deviceType || "";
        if (
          BLOCKED_DEVICE_TYPES.some(
            (device) =>
              uaString.includes(device) || deviceString.includes(device),
          )
        ) {
          return done(new Error("BLOCKED_USER"));
        }

        // 4. 구글 ID 차단
        if (profile?.id && BLOCKED_GOOGLE_IDS.includes(profile.id)) {
          return done(new Error("BLOCKED_USER"));
        }

        // 5. 닉네임 차단
        // displayName이 차단 목록에 있는지 확인
        if (
          profile?.displayName &&
          BLOCKED_NAMES.includes(profile.displayName)
        ) {
          return done(new Error("BLOCKED_USER"));
        }

        const user = {
          id: profile?.id, // 구글OAUTH에서 이메일당 부여하는 고유 ID(구글 사이트에서 계정 삭제하지 않는 한 고정). 내가 JWT 토큰의 payload의 id에도 쓰고 있음
          email: profile?.emails[0]?.value,
          displayName: profile?.displayName,
          profilePictureUrl: profile?.photos[0]?.value,
          userAgent: {
            deviceType: ua.deviceType,
            os: ua.os,
            browser: ua.browser,
            rawUA: ua.rawUA || undefined,
            login: new Date(),
          },
          ipAdd: clientIp,
        };

        const userInDB = await userService.getUserById(user.id);
        let newUserInDB;
        let updatedUserInDB;
        const userWithTokens = { ...user, accessToken, refreshToken };
        if (userInDB === undefined || userInDB === null) {
          newUserInDB = await userService.createUser(userWithTokens);
        } else {
          const oldUser = {
            id: userInDB?.id,
            email: userInDB?.email,
            displayName: userInDB?.displayName,
            profilePictureUrl: userInDB?.profilePictureUrl,
            accessToken: userInDB?.accessToken,
            refreshToken: userInDB?.refreshToken,
            userAgent: userInDB?.userAgent || {},
            ipAdd: userInDB?.ipAdd || "",
          };

          if (!areObjectsEqual(userWithTokens, oldUser)) {
            updatedUserInDB = await userService.updateUser(userWithTokens);
          }
        }

        const googleAccessToken = await getGoogleAccessToken(user.id);
        const googleRefreshToken = await getGoogleRefreshToken(user.id);
        const userInfo = newUserInDB || updatedUserInDB || userInDB;
        const token = jwt.sign(userInfo);
        const JWTAccessToken = token?.accessToken;
        const JWTRefreshToken = token?.refreshToken;

        //! req.user에 두번째 인자 참조됨.
        //! callback 시 설정한 라우터(get)에 googlePassportForJWT.authenticate("google", {세션비활성화, 실패경로})를 설정해야 그 다음 인자로, (req, res) => {여기서 req.user를 쓸 수 있음.}
        done(null, {
          id: profile.id,
          gAccessTokenCosmos: googleAccessToken,
          gRefreshTokenCosmos: googleRefreshToken,
          accessTokenCosmos: JWTAccessToken,
          refreshTokenCosmos: JWTRefreshToken,
        });
      } catch (err) {
        console.error(err);
        done(err);
      }
    },
  ),
);

// JWT를 사용하는 경우, passport.serializeUser()와 passport.deserializeUser() 함수를 명시적으로 호출할 필요는 없음.

const googlePassport = passport;
module.exports = googlePassport;
