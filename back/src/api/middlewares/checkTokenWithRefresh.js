const AppError = require("../../common/errors/AppError");
const { buildResponse } = require("../../common/utils/util");
const { verify, refreshVerify } = require("../../common/helpers/jwt");
const { checkBlocking } = require("../../common/utils/blockingService");
const jwt = require("jsonwebtoken");

const checkTokenWithRefresh = async (req, res, next) => {
  //& access token과 refresh token의 존재 유무를 체크합니다.
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log(`[Auth check] Started - ${req.method} ${req.path}`);
  }
  try {
    // 0. 통합 차단 확인
    const clientIp =
      (req.ip && String(req.ip).trim()) ||
      (req.headers["x-forwarded-for"] &&
        String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
      req.socket?.remoteAddress ||
      "";
    const uaString = req.headers["user-agent"];

    // 1차: IP/기기/지역 차단 확인 (토큰/유저정보 없이도 가능)
    const { blocked } = await checkBlocking({ ip: clientIp, uaString });
    if (blocked) {
      return res.status(403).json({
        success: false,
        blocked: true,
        message: "unknown error.",
      });
    }

    // Authorization 헤더에서 액세스 토큰 읽기
    const accessToken = req.headers["authorization"]?.slice(7);

    // 리프레쉬 토큰: 헤더(네이티브 앱) 또는 쿠키(웹)에서 읽기
    const refreshToken =
      req.headers["refresh-token"] || // 네이티브 앱용 (헤더)
      req.cookies.refreshTokenCosmos; // 웹용 (쿠키)

    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(
        `[인증체크] accessToken: ${
          accessToken ? "있음" : "없음"
        }, refreshToken: ${refreshToken ? "있음" : "없음"}`,
      );
    }

    if (accessToken && refreshToken) {
      // access token 검증 -> expired여야 함(jwt.decode의 결과와 같은 payload가 나오지만, 여기선 서명 검증하니 expired 혹은 invaild시 그에 맞는 반환값을 반환해 상태 확인도 추가적으로 해줌.).
      const accessVerifiedResult = verify(accessToken);

      // access token 디코딩하여 user의 정보를 가져옵니다. decode는 (verify와 달리 비밀키 사용해 서명검증 없이) payload 반환.
      const accessTokenPayload = jwt.decode(accessToken);

      // 단순 서명없이 나오는 페이로드(디코딩 결과)가 없으면 권한이 없음(토큰이 없거나 형식이 다른 수상한 토큰이거나)을 응답.
      if (accessTokenPayload === null || accessTokenPayload === undefined) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Auth check] Failed - no payload");
        }
        next(new AppError("unauthorization", "권한이 없습니다!", 401));
        return;
      }

      // ! (중요) req로 verify한 user정보를 req.user나 req.user.session에 넘겨줌.
      // req.session.user = accessTokenPayload?.user;
      req.user = accessTokenPayload?.user.id;

      // 2차: ID/닉네임 차단 확인
      const userData = accessTokenPayload?.user;
      if (userData) {
        const { blocked: userBlocked } = await checkBlocking({
          ip: null, // 이미 위에서 체크함
          uaString: null, // 이미 위에서 체크함
          userProfile: userData,
        });

        if (userBlocked) {
          return res.status(403).json({
            success: false,
            blocked: true,
            message: "unknown error.",
          });
        }
      }

      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(`[Auth check] userId: ${req.user}`);
      }

      // id로 refresh token을 검증합니다.
      const refreshVerifiedResult = refreshVerify(
        refreshToken,
        accessTokenPayload?.user?.id,
      );

      //~ 재발급을 위해서는 access token이 만료되어 있어야합니다.
      if (accessVerifiedResult?.error?.message === "jwt expired") {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Auth check] accessToken expired");
        }
        //? 1. access token이 만료되고, refresh token도 만료(혹은 유효하지 않은 경우도) 된 경우 => 새로 로그인해야합니다.
        if (
          refreshVerifiedResult?.error?.message === "jwt expired" ||
          refreshVerifiedResult?.error?.message === "invalid token"
        ) {
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log("[Auth check] Failed - refreshToken expired/invalid");
          }
          next(
            new AppError(
              "unauthorization",
              "다시 로그인해주시길 바랍니다.",
              401,
            ),
          );
        } else {
          //? 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
          if (process.env.NODE_ENV === "DEVELOPMENT") {
            console.log("[Auth check] accessToken reissued");
          }
          const data = {
            newAccessToken: refreshVerifiedResult.newAccessToken,
          };
          res.status(200).json(buildResponse(data, 200, null));
        }
      } else if (accessVerifiedResult?.error) {
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log(
            "[인증체크] 실패 - accessToken 에러:",
            accessVerifiedResult?.error?.message,
          );
        }
        next(new AppError("unauthorization", "유효하지 않은 토큰입니다.", 401));
      } else {
        //~ 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
        // 다음 미들웨어로 넘어감.
        if (process.env.NODE_ENV === "DEVELOPMENT") {
          console.log("[Auth check] Success - next middleware");
        }
        next();
      }
    } else {
      //& 4. access token 또는 refresh token이 없는 경우
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log("[Auth check] Failed - no token");
      }
      next(
        new AppError(
          "no tokens error",
          "Access Token 혹은 Refresh Token이 없습니다.",
          400,
        ),
      );
    }
  } catch (err) {
    console.error("[Auth check] Error:", err);
    next(err);
  }
};

module.exports = checkTokenWithRefresh;
