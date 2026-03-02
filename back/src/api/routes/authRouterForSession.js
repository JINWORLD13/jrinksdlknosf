const authRouter = require("express").Router();
const googlePassport = require("../middlewares/googlePassportForJWT");
const AppError = require("../misc/AppError");
const commonErrors = require("../misc/commonErrors");
const createAndSendTokens = require("../middlewares/createAndSendTokens");

let xClientType;
let clientType;
let redirectUri;
// '서버url/auth/google/sign' 경로 설정을 통해 authenticate를 거쳐 계정 선택하는 페이지로 감(로그인페이지옴. 루트 페이지(Google 로그인 시작 라우트. 계정 선택하는 곳.))
// authenticate는 인증 미들웨어. 단순 인증뿐만아니라, 로그인창 띄우고 등등 있음.
authRouter.get(
  "/google/sign",
  (req, res, next) => {
    // console.log("req 확인하기 : ", req);
    xClientType = req.headers["x-client-type"] || "";
    clientType = req.query.clientType || ""; //! "app"이나 "web" 들어옴.(expo or react native용 리다이렉트)
    redirectUri = req.query.redirect_uri || ""; //! capacitor 용 리다이렉트
    next();
  },
  googlePassport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline", // refreshToken 발급용
    prompt: "consent", // 동의화면. refreshToken 발급용2
  })
);

//! Google 로그인 콜백(리다이렉트) 계정선택하거나 만들고 나서 옴
// 그런데 브라우저 주소창에 /google/signin/callbac 바로 뒤에 code query가 붙음. 그런데 이건 원래 유저정보 url에 http 요청 보낼 때 필요한 쿼리(const { code } = req.query;)인데 GoolgeStrategy덕에 필요없음.
// & 여기서 만일 토큰을 json으로 주고 받고 싶을땐, 리다이렉트되는걸 클라이언트의 다른 url로 해, 그 페이지에서 axios를 요청하고, 다시 nodejs의 다른 서버에서 보내준뒤 클라이언트에서 redirect해서 바로 다른 화면 전환하면 됨.(여기서 생성된 토큰을 그 nodejs의 url로 보내야 함. (axios 이용))
authRouter.get(
  "/google/sign/callback",
  googlePassport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/google/sign/fail",
  }),
  (req, res, next) => createAndSendTokens(req, res, next, redirectUri)
);

authRouter.get("/google/sign/fail", (req, res, next) => {
  // console.log("실패함", process.env.COSMOS_CLIENT_URL);
  res.redirect(process.env.COSMOS_CLIENT_URL);
});

authRouter.get("/google/logout", (req, res, next) => {
  try {
    res.clearCookie("gAccessTokenCosmos");
    res.clearCookie("gRefreshTokenCosmos");
    res.clearCookie("accessTokenCosmos");
    res.clearCookie("refreshTokenCosmos");
    const appHost = new URL(process.env.COSMOS_SITE_URL).hostname;
    if (redirectUri && redirectUri.startsWith(`cosmostarot://${appHost}`)) {
      // 앱으로 리다이렉트
      res.redirect(`${redirectUri}`);
    } else {
      // 웹으로 리다이렉트
      res.redirect(process.env.COSMOS_CLIENT_URL);
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.name, err.message, 401));
  }
});

module.exports = authRouter;



// // 구글 계정 선택 화면에서 계정 선택 후 redirect 된 주소
// // 구글 클라우드 플랫폼에서 등록한 GOOGLE_REDIRECT_URI(ex : http://localhost:8080/login/redirect)와 일치해야 함
// // ! 그런데 브라우저 주소창에 /login/redirect  바로 뒤에 code query가 붙음.
// // ! 그 code로 access_token을 요청할 수 있다
//   // access_token, refresh_token 등의 구글 토큰 정보 가져오기
//     // x-www-form-urlencoded 형식으로 구글 인증 서버로부터 QueryString으로 받아온 code
//     code,
//     client_id: process.env.CLIENT_ID,
//     client_secret: process.env.CLIENT_SECRET,
//     redirect_uri: process.env.GOOGLE_SIGNIN_REDIRECT_URI,
//     grant_type: "authorization_code",
//   });



// // '서버url/auth/google/sign' 경로 설정을 통해 authenticate를 거쳐 계정 선택하는 페이지로 감(로그인페이지옴. 루트 페이지(Google 로그인 시작 라우트. 계정 선택하는 곳.))
// authRouter.get(
//   "/google/signin",
//   passport.authenticate("google-signin", {
//     scope: ["profile", "email"],
//     accessType: "offline", // refreshToken 발급용
//     prompt: "consent", // 동의화면. refreshToken 발급용2
//   })
// );
// // Google 로그인 콜백(리다이렉트)
// // ! 그런데 브라우저 주소창에 /google/signin/callbac 바로 뒤에 code query가 붙음. 그런데 이건 원래 유저정보 url에 http 요청 보낼 때 필요한 쿼리(const { code } = req.query;)인데 GoolgeStrategy덕에 필요없음.
// authRouter.get(
//   "/google/signin/callback",
//   passport.authenticate("google-signin", {
//     failureRedirect: "http://localhost:8080/auth/google/signin/fail",
//   }),
//   (req, res) => {
//     // ! GoogleStrategy 라이브러리 덕에 토큰, 유저정보 다 user에 저장됨.



