
// //! 모바일 환경에서는 브라우저 종료나, 한동안 창을 닫고 있거나, 메모리가 알아서 서버 종료(즉, 세션종료..) => 재접속시 로그인 NOT FOUND 에러 발생.
// //& 이 모듈을 사용시, 로그인 처리 로직은 세션용 passport로 했지만, 결과를 토큰으로 따로 jwt를 통해 만들어 res.cookie로 쏴주었다(createAndSendTokens.js).
// //! 아래 두개의 주석세트 참조
// /**
//  아래 구문은 server.js(혹은 index.js, 즉 메인 페이지)에서 반드시 불러줘야 함...

//   // 세션 스토어 생성
//     uri: process.env.MONGO_DB_URL,
//     collection: "sessions",
//   });
//   // 전역 세션 설정
//   app.use(
//     session({
//       secret: process.env.SESSION_SECRET_KEY,
//       resave: false,
//       saveUninitialized: true,
//       store: store, // MongoDB 세션 스토어 사용
//       cookie: { secure: true, maxAge: 60 * 60 * 1000 * 168 }, // HTTPS를 사용하는 경우 true로 변경
//     })
//   );
//   // passport 초기화 및 세션 설정
//   app.use(googlePassport.initialize());
//   app.use(googlePassport.session());
// */
// /**
//   express-session 사용
//   app.use(session()) : 세션 생성 미들웨어
//   Express에서 session을 사용할 때, store는 세션 데이터를 저장하는 방식을 지정하는 옵션입니다. store를 지정하지 않으면 기본적으로 메모리에 세션 데이터가 저장되지만, 실제 프로덕션 환경에서는 이 방식이 적절하지 않을 수 있습니다.

//   // ! passport.authenticate(미들웨어로써)를 쓰려는 곳(이전에 세팅 작업해야 하고) 및 isLogged 쓰는 곳(추가로 authenticate도 선언돼야 req에 user값이 저장됨.), 그리고 로그아웃에서 선언해야 될 5가지 코드]
//   passport.authenticate()를 사용하여 로컬 전략을 활용하여 로그인을 처리
//   1. passport.authenticate 호출: 로그인 시도가 있을 때, passport.authenticate 미들웨어가 호출됩니다. 이때 LocalStrategy 또는 다른 사용자 지정된 인증 전략이 실행되고, 성공 시에 사용자 객체가 반환됩니다(//!req.user를 쓰려면 authenticate는 먼저 선행되어야 함.)

//   2. serializeUser 호출: passport.authenticate 미들웨어가 성공적으로 사용자를 인증하면, Passport는 serializeUser 메서드를 호출하여 사용자 정보의 일부를 세션에 저장합니다. 이때 done(null, user.id)에서 user.id를 반환합니다.

//   3. 세션에 사용자 정보 저장: 세션에는 serializeUser에서 반환한 값(기본은 user.id)이 저장되어, 이후의 요청에서 세션을 복원할 때 이 값이 사용됩니다.

//   4. deserializeUser 호출: 세션을 복원할 때 (passport.session() 미들웨어가 동작하는 시점), Passport는 deserializeUser 메서드를 호출하여 세션에 저장된 정보를 복원합니다. 이때 deserializeUser의 콜백 함수에서 사용자 정보가 req.user에 저장됩니다.
//   1.resave 옵션:

//   resave: false는 세션이 수정되지 않았을 때에도 세션을 다시 저장할지 여부를 나타냅니다.
//   resave: false로 설정하면 세션이 변경되지 않은 경우에도 매번 세션을 저장하지 않아 효율적으로 동작합니다.
//   예를 들어, 사용자가 로그인한 경우에만 세션을 변경하고 싶을 때 resave: false를 사용할 수 있습니다.

//   2. saveUninitialized 옵션:

//   saveUninitialized: false는 초기화되지 않은 세션을 저장할지 여부를 나타냅니다.
//   saveUninitialized: false로 설정하면 사용자가 로그인하지 않은 경우에도 세션을 생성하지 않아 효율적으로 동작합니다.
//   예를 들어, 사용자가 로그인할 때 세션을 생성하고 초기화하고자 할 때 saveUninitialized: false를 사용할 수 있습니다.
// */


// // https://accounts.google.com/o/oauth2/v2/auth
// // https://oauth2.googleapis.com/token
// // https://www.googleapis.com/oauth2/v3/userinfo
// // 인증 절차에 필요한 url이 GoogleStrategy에 다 들어가 있다.

// passport.use(
//   "google", // 전략 이름 구분
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_SIGN_REDIRECT_URI,
//       passReqToCallback: true,
//     },
//     //  Google OAuth를 통해 로그인하면, passport.use()에 등록된 아래 콜백 함수가 호출(리다이렉트될 때 이 함수 호출됨.)
//     async function (req, accessToken, refreshToken, profile, callback) {
//       console.log("googlePassportForSession 작동");
//       // 선택한 계정 정보(로그인)나 만든 계정 정보(회원가입)가 들어옴.
//       try {
//         // ! 최신 정보
//           id: profile.id, // 내가 JWT 토큰의 payload의 id에도 쓰고 있음..
//           email: profile.emails[0].value,
//           displayName: profile.displayName,
//           profilePictureUrl: profile.photos[0].value,
//         };





/**
 req.session이 세션을 나타내는 객체입니다. req.user는 passport.js에서 인증된 사용자의 정보를 저장하기 위해 사용되는 속성입니다.

express-session 미들웨어를 사용하면 req 객체에 session 속성이 추가되어 req.session으로 접근할 수 있습니다. 이 req.session 객체는 현재 사용자의 세션 데이터를 저장하고 관리하는 역할을 합니다.

예를 들어, req.session.userId = user.id;와 같이 세션에 사용자의 식별자를 저장할 수 있습니다. 그리고 이후의 요청에서 req.session.userId를 통해 해당 값을 읽어올 수 있습니다.

반면에 req.user는 Passport 미들웨어에서 인증된 사용자의 정보를 저장하는 데 사용됩니다. serializeUser에서 세션에 저장한 사용자 식별자를 deserializeUser에서 사용하여 사용자 정보를 조회하고, 조회된 사용자 정보를 req.user에 저장합니다.
 */
