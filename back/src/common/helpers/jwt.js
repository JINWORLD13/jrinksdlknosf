const jwt = require("jsonwebtoken");
const AppError = require("../errors/AppError");
const secretKey = require("../../config/secretKey").secretKey;
const accessTokenOption = require("../../config/secretKey").accessTokenOption;
const refreshTokenOption = require("../../config/secretKey").refreshTokenOption;

module.exports = {
  // 이 sign은 jsonwebtoken 모듈의 sign이 아니다. 다시 정의하고 있음.
  sign: (user) => {
    const accessTokenPayload = {
      // 토큰내 들어갈 정보. (가벼운 정보만 넣기)
      type: "access",
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        profilePictureUrl: user.profilePictureUrl,
        role: user.role,
      },
    };

    const refreshTokenPayload = {
      type: "refresh",
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        profilePictureUrl: user.profilePictureUrl,
        role: user.role,
      },
      canRefresh: true,
    };

    const result = {
      // jsonsebtoken라이브러리의 sign 메소드를 통해 access token 발급!
      // jwt.sign( { 토큰이 가질 데이터(payload), 비밀 키, 옵션, 콜백함수(보통 에러 핸들링에 사용) } )
      accessToken: jwt.sign(accessTokenPayload, secretKey, accessTokenOption),
      refreshToken: jwt.sign(
        refreshTokenPayload,
        secretKey,
        refreshTokenOption
      ),
    };

    return result;
  },

  verify: (token) => {
    let decodedPayload;
    try {
      // verify를 통해 값 decode! (express-jwt로 간편하게 jwt verify하는 방법도 있음)
      decodedPayload = jwt.verify(token, secretKey);
    } catch (error) {
      // ! 이미 라이브러리 내부에서 err 메세지('jwt expired', 'invalid token')를 정의해 놓음.
      return { error };
    }
    return decodedPayload;
  },

  refreshVerify: (refreshToken, userId) => {
    if (!refreshToken)
      throw new AppError(
        "no refresh token",
        "리프레시 토큰이 없습니다. 다시 로그인 해주세요.",
        401
      );
    return jwt.verify(refreshToken, secretKey, (error, result) => {
      if (error) return { error }; // 시간계산 로직을 쓰면 더 세분화됨.
      if (result.user.id === userId) {
        const accessTokenPayload = {
          // 토큰내 들어갈 정보. (가벼운 정보만 넣기)
          type: "access",
          user: {
            id: result.user.id,
            email: result.user.email,
            displayName: result.user.displayName,
            profilePictureUrl: result.user.profilePictureUrl,
            role: result.user.role,
          },
        };
        const newAccessToken = jwt.sign(
          accessTokenPayload,
          secretKey,
          accessTokenOption
        );
        return { newAccessToken };
      }
    });
  },
};
