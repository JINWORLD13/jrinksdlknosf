require("./instrument.js");
const Sentry = require("@sentry/node");
require("dotenv").config();
require("./src/db/mongoose/mongoose")();

// 큐 워커 초기화 (선택 사항)
// キューワーカー初期化 (オプション)
// Queue worker init (optional)
const { initTarotQueueProcessors } = require("./src/queue/tarotQueue");
const enableTarotQueueWorker =
  String(
    process.env.COSMOS_ENABLE_TAROT_QUEUE_WORKER ?? "true",
  ).toLowerCase() !== "false";
if (enableTarotQueueWorker) {
  initTarotQueueProcessors();
}
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const compression = require("compression"); // js, css 압축. 이미지파일은 압축 안됨. / js, css 圧縮。画像ファイルは圧縮されません。 / js, css compression. Images are not compressed.
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cacheClient = require("./src/cache/cacheClient");

const {
  tarotRouter,
  authRouter,
  userRouter,
  adminRouter,
  chargeRouter,
  googleRouter,
  versionRouter,
  referralRouter,
} = require("./src/api/routes/index");
const { routes: routeConfig, isApiPath, getHealthPaths } = require("./src/config/routes");
const googlePassport = require("./src/api/middlewares/googlePassportForJWT");

/**
// ! passport.authenticate(미들웨어로써)를 쓰려는 곳(이전에 세팅 작업해야 하고) 및 isLogged 쓰는 곳(추가로 authenticate도 선언돼야 req에 user값이 저장됨.), 그리고 로그아웃에서 선언해야 될 5가지 코드]
passport.authenticate()를 사용하여 로컬 전략을 활용하여 로그인을 처리
1. passport.authenticate 호출: 로그인 시도가 있을 때, passport.authenticate 미들웨어가 호출됩니다. 이때 LocalStrategy 또는 다른 사용자 지정된 인증 전략이 실행되고, 성공 시에 사용자 객체가 반환됩니다(//!req.user를 쓰려면 authenticate는 먼저 선행되어야 함.)
*/

/**
 //! 로컬에서 https 테스트하려면, openssl 다운받고 해당명령어 프로프트에서 입력해야 함. 물론, server.cert, server.key는 server.js 와 같은 위치에서 하도록 설정. 자세한건 oneNote에 openssl 검색 ㄱ.
 //! Google Cloud Platform (GCP)의 App Engine을 사용할 때는 HTTPS 리다이렉션을 위한 추가적인 미들웨어를 직접 구현할 필요가 없습니다.
// 리액트 packages.json에서 아래 내용 넣어야 https로 로컬에서 작동가능.
// "scripts": {
//   "start": "HTTPS=true react-scripts start",
 */

/**다음 환경에서는 필수적으로 설정해야 합니다:

클라우드 플랫폼 (Heroku, AWS, Vercel, Netlify)

CDN 사용 (Cloudflare, AWS CloudFront)

로드 밸런서 뒤

Nginx, Apache 리버스 프록시 뒤

 */
app.set("trust proxy", true);

// 헬스체크 엔드포인트 - Railway 헬스체크를 위해 가장 먼저 정의
// ヘルスチェックエンドポイント - Railway ヘルスチェックのために最優先で定義
// Health check endpoint - Defined first for Railway health checks
app.get(["/health", "/ko/health", "/ja/health", "/en/health"], (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Google AdSense 및 SEO용 정적 파일 명시적 서빙 (리다이렉트 미들웨어보다 먼저 처리)
// 루트 도메인(cosmos-tarot.com)과 www 서브도메인(www.cosmos-tarot.com) 모두에서 접근 가능하도록 설정
app.get("/app-ads.txt", (req, res) => {
  const filePath = path.join(__dirname, "front/dist/app-ads.txt");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

app.get(routeConfig.adsTxt, (req, res) => {
  const filePath = path.join(__dirname, "front/dist/ads.txt");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

app.get(routeConfig.robotsTxt || "/robots.txt", (req, res) => {
  const filePath = path.join(__dirname, "front/dist/robots.txt");
  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.sendFile(filePath);
  } else {
    res.status(404).send("File not found");
  }
});

// 2. 리다이렉트 (SEO 중복 방지)
// 2. リダイレクト (SEO 重複防止)
// 2. Redirection (SEO duplication prevention)
app.use((req, res, next) => {
  // 헬스체크 경로는 리다이렉트하지 않음
  if (req.path === routeConfig.health || req.path.startsWith(routeConfig.health)) {
    return next();
  }

  // Google AdSense용 정적 파일들은 리다이렉트하지 않음 (루트 도메인에서 직접 접근 필요)
  if (
    req.path === routeConfig.adsTxt ||
    req.path === routeConfig.appAdsTxt ||
    req.path === routeConfig.robotsTxt
  ) {
    return next();
  }

  // 개발 환경에서는 리다이렉트하지 않음 (localhost 접속 허용)
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return next();
  }

  const host = req.get("host");
  if (!host) return next();

  // localhost는 리다이렉트하지 않음 (개발 환경)
  if (host.includes("localhost") || host.includes("127.0.0.1")) {
    return next();
  }

  // CLIENT_URL에서 프로토콜 제거하고 도메인만 추출
  const clientUrl = process.env.COSMOS_CLIENT_URL || "";
  const targetDomain = clientUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  // CLIENT_URL: "https://cosmos-tarot.com" => 결과: "cosmos-tarot.com" (https:// 제거됨)

  if (!targetDomain) return next();

  // www.cosmos-tarot.com → cosmos-tarot.com 리다이렉트 (301 Permanent Redirect)
  // www를 non-www로 통일 (SEO 최적화)
  // 단, ads.txt 등 정적 파일은 예외 (위에서 이미 처리됨)
  if (host === "www.cosmos-tarot.com") {
    return res.redirect(301, `https://cosmos-tarot.com${req.originalUrl}`);
  }

  // 이미 올바른 호스트(cosmos-tarot.com)로 요청이 왔으면 리다이렉트하지 않음
  if (host === targetDomain || host === "cosmos-tarot.com") {
    return next();
  }

  return res.redirect(301, `https://cosmos-tarot.com${req.originalUrl}`);
});

// 3. 로깅
// 3. ロギング
// 3. Logging
if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// 4. 보안
// 4. セキュリティ
// 4. Security
app.use(helmet());

// 5. 환경별 CORS 설정
//! localhost:5173 이용시 제일 위에 두어야 함;;
if (process.env.NODE_ENV === "DEVELOPMENT") {
  const cors = require("cors");
  app.use(
    cors({
      credentials: true, // 쿠키 전송 허용
      origin: true,
    }),
  );
} else if (process.env.NODE_ENV === "PRODUCTION") {
  //! 앱과의 연동
  // CORS 설정
  app.use((req, res, next) => {
    // Origin은 하나만 설정해야 합니다. 여러 Origin을 허용하려면 조건문을 사용하세요.
    const allowedOrigins = [
      "cosmostarot://cosmos-tarot.com",
      "cosmostarot://www.cosmos-tarot.com",
      "cosmostarot://",
      "https://cosmos-tarot.com",
      "https://www.cosmos-tarot.com",
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader("Access-Control-Allow-Credentials", "true"); // 쿠키 전송 허용
    res.setHeader("Access-Control-Max-Age", "3600");

    // OPTIONS 요청에 대해 즉시 응답
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    next();
  });
}

// 5. 성능 관련 미들웨어 (Compression: gzip 압축)
// 5. パフォーマンス関連ミドルウェア (Compression: gzip 圧縮)
// 5. Performance middleware (Compression: gzip compression)
app.use(compression());

// 6. 바디 파싱 및 쿠키 파싱 (Passport 전에 필요할 수 있음)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // 쿠키 파싱

// UTF-8 인코딩 명시적 설정 (깨진 문자 방지)
app.use((req, res, next) => {
  // JSON 응답에 charset=UTF-8 명시
  const originalJson = res.json;
  res.json = function (data) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return originalJson.call(this, data);
  };
  next();
});

// 7. 인증 관련 미들웨어 (Passport JWT)
// 7. 認証関連ミドルウェア (Passport JWT)
// 7. Authentication middleware (Passport JWT)
app.use(googlePassport.initialize());

// API 경로는 언어 리다이렉트에서 제외하는 미들웨어
// 모든 HTTP 메서드에서 API 경로는 언어 경로 없이도 접근 가능하도록
app.use((req, res, next) => {
  if (isApiPath(req.path)) {
    return next();
  }
  next();
});

// 라우터 설정 (env: COSMOS_ROUTE_*)
// ルーター設定
// Router configuration
app.use(routeConfig.tarot, tarotRouter);
app.use(routeConfig.authenticate, authRouter);
app.use(routeConfig.user, userRouter);
app.use(routeConfig.admin, adminRouter);
app.use(routeConfig.payments, chargeRouter);
app.use(routeConfig.google, googleRouter);
app.use(routeConfig.version, versionRouter);
app.use(routeConfig.referral, referralRouter);

if (process.env.SENTRY_DSN) {
  app.get("/debug-sentry", function mainHandler(req, res) {
    throw new Error("My first Sentry error!");
  });
}

//! (중요) 아래는 프리렌더 서버 빌리는거(광고신청시 이걸로 하기.)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// & 프론트에선 html에 meta 태그에 설정하고 벡엔드에선 이렇게 동시에 해야 프론트의 Blob 객체(js 내장객체)를 허용가능 - build 후 얘기(백엔드에선 blob만 하기)
// &  'worker-src blob:;'을 사용하는 것이 구글 정책에 위배될 가능성이 있다고 함. 구글은 Blob URL을 통한 웹 워커 생성을 제한하는 경향이 있다고 함. 그래서 프론트(index.html, worker-src blob:;)에서도 지움.
// & a 태그 활용
//! csp는 build한 후 적용 가능. 개발 서버모드에서는 안됨. 이건 허용할 url들 모음집. 허용 안하면 기본값 빼고 전부 블락됨. csp는 중요함. 도메인 등록시 그 도메인의 모든 하위 도메인은 도메인 소유주에게만 허용됨.
// Content Security Policy (CSP): Google 광고 및 외부 서비스들을 포함한 상세한 CSP 설정
// 올바른 CSP 설정 (*.google.co.* 문제 해결)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "base-uri 'self'; " +
      "object-src 'none'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' " +
      "https://*.tosspayments.com " +
      "https://*.google.com " +
      "https://www.google.co.kr " +
      "https://www.google.co.jp " +
      "https://www.google.co.uk " +
      "https://*.googleapis.com " +
      "https://*.gstatic.com " +
      "https://*.googleusercontent.com " +
      "https://*.googlesyndication.com " +
      "https://*.doubleclick.net " +
      "https://*.jsdelivr.net " +
      "https://www.googletagmanager.com " +
      "https://googleads.g.doubleclick.net " +
      "https://pagead2.googlesyndication.com " +
      "https://adservice.google.com " +
      "https://tpc.googlesyndication.com " +
      "https://www.googleadservices.com " +
      "https://cdnjs.cloudflare.com blob:; " +
      "style-src 'self' 'unsafe-inline' " +
      "https://*.tosspayments.com " +
      "https://*.googleapis.com " +
      "https://*.jsdelivr.net " +
      "https://fonts.googleapis.com; " +
      "img-src 'self' " +
      "https://*.tosspayments.com " +
      "https://*.google.com " +
      "https://www.google.co.kr " +
      "https://www.google.co.jp " +
      "https://www.google.co.uk " +
      "https://*.googleapis.com " +
      "https://*.gstatic.com " +
      "https://pagead2.googlesyndication.com " +
      "https://*.doubleclick.net " +
      "https://*.jsdelivr.net data:; " +
      "font-src 'self' " +
      "https://*.tosspayments.com " +
      "https://*.gstatic.com " +
      "https://*.jsdelivr.net " +
      "https://fonts.gstatic.com; " +
      "connect-src 'self' " +
      "https://cosmos-tarot.com " +
      "https://www.cosmos-tarot.com " +
      "https://*.tosspayments.com " +
      "https://*.google.com " +
      "https://www.google.co.kr " +
      "https://www.google.co.jp " +
      "https://www.google.co.uk " +
      "https://*.googleapis.com " +
      "https://*.gstatic.com " +
      "https://*.doubleclick.net " +
      "https://*.jsdelivr.net " +
      "https://*.google-analytics.com " +
      "https://www.googletagmanager.com " +
      "https://adservice.google.com " +
      "https://www.googleadservices.com " +
      "https://cdn.jsdelivr.net/* " +
      "https://*.sentry.io " +
      "https://pagead2.googlesyndication.com blob:; " +
      "frame-src 'self' " +
      "https://*.tosspayments.com " +
      "https://*.google.com " +
      "https://www.google.co.kr " +
      "https://www.google.co.jp " +
      "https://www.google.co.uk " +
      "https://*.doubleclick.net " +
      "https://www.googletagmanager.com " +
      "https://googleads.g.doubleclick.net; " +
      "media-src 'self' " +
      "https://cdn.pixabay.com " +
      "https://*.public.blob.vercel-storage.com " +
      "blob: data:; " +
      "worker-src 'self' blob: https://www.googletagmanager.com;",
  );
  next();
});

app.use((req, res, next) => {
  //! 브라우저 설정 언어 감지
  const acceptLanguage = req.headers["accept-language"] || "en";

  // 지원하는 언어 목록
  const supportedLanguages = ["ko", "en", "ja"];

  // accept-language 파싱하여 가장 선호하는 언어 선택
  const preferredLanguage =
    acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim())
      .find((lang) => supportedLanguages.includes(lang)) || "en";

  // 선택된 언어로 Content-Language 헤더 설정
  res.header("Content-Language", preferredLanguage);

  next();
});

// 캐싱 및 성능 최적화 옵션 추가
const staticOptions = {
  maxAge: process.env.NODE_ENV === "PRODUCTION" ? "30d" : "0", // 30일 캐쉬
  etag: true, // 변경 감지시 새로운 해쉬 태그를 파일명에 붙임
  lastModified: true, // 수정된 날짜로 변경됐는지 판별
  setHeaders: (res, path) => {
    // HTML 파일은 항상 최신 버전 확인
    if (path.endsWith(".html")) {
      res.set("Cache-Control", "no-cache");
    }
    // Service Worker 파일은 절대 캐시하지 않음 (항상 최신 버전 확인)
    if (path.endsWith("/sw.js") || path.endsWith("\\sw.js")) {
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
    }
    // registerSW.js도 캐시하지 않음
    if (path.endsWith("/registerSW.js") || path.endsWith("\\registerSW.js")) {
      res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate",
      );
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
    }
  },
};
// 정적 파일 서빙 및 SPA 라우팅
// 이 설정은 "front/dist" 디렉토리의 내용을 웹 루트('/')로 서빙한다는 의미
// 정적 파일 서빙: Express.static을 통한 효율적인 정적 파일 처리s
// 주의: express.static은 API 경로를 제외하고 정적 파일만 서빙해야 함
app.use((req, res, next) => {
  const requestPath = req.path;

  // API 경로는 정적 파일 서빙에서 제외
  if (
    requestPath.startsWith("/tarot") ||
    requestPath.startsWith("/authenticate") ||
    requestPath.startsWith("/user") ||
    requestPath.startsWith("/admin") ||
    requestPath.startsWith("/payments") ||
    requestPath.startsWith("/google") ||
    requestPath.startsWith("/version") ||
    requestPath.startsWith("/referral") ||
    requestPath.startsWith("/health")
  ) {
    return next(); // API 경로는 정적 파일 서빙 건너뛰기
  }
  next();
});

app.use(express.static(path.join(__dirname, "front/dist"), staticOptions));

// SPA fallback with prerendered HTML support
// 주의: 이 라우터는 GET 요청만 처리하며, API 경로는 이미 위의 라우터에서 처리됨
// Express는 더 구체적인 경로를 먼저 매칭하므로, /payments/* 경로는 chargeRouter가 먼저 처리함
// 하지만 안전을 위해 API 경로는 여기서 처리하지 않음
app.get("*", (req, res, next) => {
  const requestPath = req.path;

  // API 경로는 이미 위의 라우터에서 처리되어야 함
  if (isApiPath(requestPath)) {
    return next();
  }

  // 정적 파일 (이미 express.static에서 처리되지만, 명시적으로 확인)
  if (path.extname(requestPath) && requestPath !== "/") {
    // 정적 파일이 실제로 존재하는지 확인
    const staticFilePath = path.join(__dirname, "front/dist", requestPath);
    if (fs.existsSync(staticFilePath)) {
      // 파일이 존재하면 express.static이 처리하도록 next() 호출
      return next();
    }
    // 파일이 존재하지 않으면 404 반환
    return res.status(404).send("File not found");
  }

  let htmlPath;

  // 브라우저 설정 언어 감지 함수
  const getBrowserLanguage = () => {
    const acceptLanguage = req.headers["accept-language"] || "en";
    const supportedLanguages = ["ko", "en", "ja"];
    return (
      acceptLanguage
        .split(",")
        .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0])
        .find((lang) => supportedLanguages.includes(lang)) || "en"
    );
  };

  // 루트 경로 처리 - 브라우저 설정 언어 감지 후 리다이렉트
  if (requestPath === "/" || requestPath === "") {
    const browserLanguage = getBrowserLanguage();
    // 브라우저 설정 언어 경로로 리다이렉트 (301 Permanent Redirect, 슬래시 없이)
    return res.redirect(301, `/${browserLanguage}`);
  }
  // 언어별 루트 경로 trailing slash 제거 및 리다이렉트 (/ko/, /en/, /ja/ → /ko, /en, /ja)
  else if (
    requestPath === "/ko/" ||
    requestPath === "/en/" ||
    requestPath === "/ja/"
  ) {
    const lang = requestPath.replace(/\//g, "");
    // trailing slash 제거하고 리다이렉트 (301 Permanent Redirect)
    return res.redirect(301, `/${lang}`);
  }
  // 언어별 루트 경로 (/ko, /en, /ja) - 슬래시 없이
  else if (
    requestPath === "/ko" ||
    requestPath === "/en" ||
    requestPath === "/ja"
  ) {
    const lang = requestPath.replace(/\//g, "");
    htmlPath = path.join(__dirname, "front/dist", lang, "index.html");
  }
  // 언어 접두사가 없는 경로 (예: /mypage) - 브라우저 언어로 리다이렉트
  // 단, API 경로는 리다이렉트하지 않음 (이미 위에서 처리됨)
  else if (!requestPath.match(/^\/(ko|en|ja)(\/|$)/)) {
    if (isApiPath(requestPath)) {
      return res.status(404).json({ error: "Not Found" });
    }

    const browserLanguage = getBrowserLanguage();
    // 브라우저 설정 언어 경로로 리다이렉트 (301 Permanent Redirect)
    return res.redirect(301, `/${browserLanguage}${requestPath}`);
  }
  // 언어 접두사가 있는 경로 (예: /ko/mypage, /en/mypage) - 프리렌더링된 페이지들
  else {
    // trailing slash 제거
    const cleanPath = requestPath.replace(/\/$/, "");
    htmlPath = path.join(__dirname, "front/dist", cleanPath + ".html");
  }

  // 파일이 존재하면 해당 HTML 파일 서빙
  if (fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }

  // 파일이 없으면 기본 index.html로 fallback (SPA 라우팅)
  res.sendFile(path.join(__dirname, "front/dist/index.html"));
});

const port = Number(process.env.PORT) || 8080;
let server;

// 레디스 연결
// Redis 接続
// Redis connection
cacheClient.connect().catch((error) => {
  console.error(
    "Redis connection failed (server will continue):",
    error.message,
  );
  // Redis 연결 실패해도 서버는 계속 실행
});

//! GCP App engine 쓰고 있어서 자동으로 됨.. 배포할 땐 .env(back) 말고 app.yaml 참조함.
// Railway에서는 NODE_ENV가 설정되지 않을 수 있으므로 항상 서버 시작
if (process.env.NODE_ENV === "DEVELOPMENT") {
  server = app.listen(port, () => {});
} else {
  // PRODUCTION 또는 Railway 환경에서 서버 시작
  server = app.listen(port, "0.0.0.0", () => {
    console.log(
      `Server listening on port ${port} (NODE_ENV: ${
        process.env.NODE_ENV || "not set"
      })`,
    );
  });
}
//! io 호출안되니 굳이 변수 선언 안해도 됨.

// The error handler must be registered before any other error middleware and after all controllers
if (process.env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app);
}

// 에러 처리 미들웨어 (가장 아래)
// エラー処理ミドルウェア (最下端)
// Error handling middleware (at the bottom)
app.use((err, req, res, next) => {
  // 프로덕션에서는 상세 에러 정보 숨기기
  const isDevelopment = process.env.NODE_ENV === "DEVELOPMENT";

  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: isDevelopment ? err.stack : "wrong",
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(err.statusCode || 500).json({
    name: isDevelopment ? err.name : "Internal Server Error",
    message: isDevelopment ? err.message : "Something went wrong",
    code: err.statusCode || 500,
  });
});
