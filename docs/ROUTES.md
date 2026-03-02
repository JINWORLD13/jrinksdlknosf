# 라우트 정리 / Routes Reference

> 프론트엔드 페이지 라우트(UrlPaths · ROUTE.jsx)와 백엔드 API 라우트(server.js)를 한 문서에서 참조합니다. 실제 경로·env 키 매핑은 코드에만 있으며, 문서에서는 유추되지 않도록 기술하지 않습니다.

---

## 1. 프론트엔드 페이지 라우트 (UrlPaths.jsx · ROUTE.jsx)

언어 코드 `/:lang` (ko, en, ja) 아래에 정의됩니다. 상대 경로는 `routeEnv.js`에서 env로 읽습니다.

### 1.1 상대 경로 상수 (UrlPaths.jsx — 자식 라우트용)

`ROUTE_ENV` 키: `HOME`, `LOGOUT`, `GENERAL_READING`, `GENERAL_READING_SPREAD`, `GENERAL_READING_RESULT`, 타로·ETC·MYPAGE 관련 키, `TOSS_SUCCESS`, `TOSS_FAIL`.  
→ UrlPaths.jsx의 `*_PATH` / `*_REL` 및 ROUTE.jsx에서 사용.

### 1.2 getPathWithLang(lang) 로 만드는 절대 경로 (UrlPaths.jsx)

`/${lang}/...` 형태. `getPathWithLang(lang)` 반환 객체의 키로 사용.

### 1.3 호환용만 정의 (ROUTE.jsx에서 라우트로 미사용)

- `MORE_TERMS_OF_SERVICE_PATH`, `MYPAGE_USERINFO_PATH`
- `MYPAGE_THEMECHART_*`, `MYPAGE_USERINFO_CHANGE_PATH`

---

## 2. 백엔드 API 라우트 (server.js)

server.js에서 마운트하는 prefix는 `back/src/config/routes.js`에서 env로 읽습니다. 세부 경로·메서드는 [API 문서](./api/README.md) 참고.

- `routes` 객체 키에 따라 tarotRouter, authRouter, userRouter, adminRouter, chargeRouter, googleRouter, versionRouter, referralRouter 마운트.
- health·appAdsTxt·adsTxt·robotsTxt는 server.js에서 직접 사용.

### 2.1 API 경로 (언어 리다이렉트 제외)

프론트 `apiRoutes.js`의 `isApiPath`, 백엔드 `routes.js`의 `isApiPath`로 env에 정의된 prefix는 **언어 코드 없이** 사용합니다.

---

## 3. 정리

| 구분 | 정의 위치 |
|------|-----------|
| 프론트 상대 경로 | `back/front/src/config/routeEnv.js` → UrlPaths.jsx |
| 프론트 API prefix | `back/front/src/config/apiRoutes.js` |
| 프론트 라우트 조합 | `back/front/src/config/route/ROUTE.jsx` |
| 백엔드 API prefix | `back/src/config/routes.js` → server.js |
| 백엔드 API 상세 | `back/src/api/routes/*.js` → [docs/api/README.md](./api/README.md) |

실제 경로 값·env 상수명 매핑은 코드에만 두고, 문서에서는 나열하지 않습니다.
