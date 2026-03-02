# 환경 변수 명세 / Environment Variables / 환경 변수

> Cosmos Tarot 프로젝트에서 사용하는 환경 변수 명칭 규칙  
> Naming convention: 앱 전용 변수는 `COSMOS_` 접두사 사용

<br>

---

## 명칭 규칙 / Naming Convention / 명칭 규칙

| 구분                    | 접두사    | 예시                                          |
| ----------------------- | --------- | --------------------------------------------- |
| **Node 표준**           | (없음)    | `NODE_ENV`, `PORT`                            |
| **앱 전용**             | `COSMOS_` | `COSMOS_CLIENT_URL`, `COSMOS_TOSS_SECRET_KEY` |
| **프론트 빌드 시 주입** | `VITE_`   | `VITE_COSMOS_*` (유지)                        |

<br>

---

## 환경 변수 목록 / List / 환경 변수 목록

### 1. 런타임 / Runtime

| 명칭       | 용도      | 예시 값                     |
| ---------- | --------- | --------------------------- |
| `NODE_ENV` | 실행 환경 | `DEVELOPMENT`, `PRODUCTION` |
| `PORT`     | 서버 포트 | `8080`                      |

### 2. 앱 URL / App URL

| 명칭                | 용도                                             |
| ------------------- | ------------------------------------------------ |
| `COSMOS_CLIENT_URL` | 프론트엔드(클라이언트) URL (OAuth 리다이렉트 등) |
| `COSMOS_SITE_URL`   | 사이트 기준 URL (도메인/호스트 판별)             |

### 3. OAuth (Google) / 인증

| 명칭                                 | 용도                                        |
| ------------------------------------ | ------------------------------------------- |
| `COSMOS_GOOGLE_AUTH_URL`             | Google OAuth 인증 URL                       |
| `COSMOS_GOOGLE_CLIENT_ID`            | Google OAuth Client ID                      |
| `COSMOS_GOOGLE_CLIENT_SECRET`        | Google OAuth Client Secret                  |
| `COSMOS_GOOGLE_SIGN_REDIRECT_URI`    | Google OAuth 콜백(리다이렉트) URI           |
| `COSMOS_GOOGLE_TOKEN_URL`            | Google OAuth 토큰 교환 URL                  |
| `COSMOS_GOOGLE_SERVICE_ACCOUNT_JSON` | Google 서비스 계정 JSON (인앱 결제 검증 등) |

### 4. 결제 (Toss PG) / Payment

| 명칭                              | 용도                    |
| --------------------------------- | ----------------------- |
| `COSMOS_TOSS_SECRET_KEY`          | Toss 결제 시크릿 키     |
| `COSMOS_TOSS_SECRET_KEY_PAYPAL`   | Toss PayPal용 시크릿 키 |
| `COSMOS_TOSS_CONFIRM_URL`         | 결제 승인 API URL       |
| `COSMOS_TOSS_CANCEL_URL`          | 결제 취소 API Base URL  |
| `COSMOS_TOSS_API_BASE_URL`        | Toss API Base URL       |
| `COSMOS_TOSS_TEST_PAYMENT_KEY`    | 테스트용 결제 키        |
| `COSMOS_REFUND_CANCEL_PERCENTAGE` | 환불 시 취소 비율 (0~1) |

### 5. 상품 ID / Product IDs

| 명칭                                                     | 용도                                    |
| -------------------------------------------------------- | --------------------------------------- |
| `COSMOS_PRODUCT_NEWBIE_PACKAGE`                          | 초심자 패키지 상품 ID                   |
| `COSMOS_PRODUCT_ADS_REMOVER`                             | 광고 제거 상품 ID                       |
| `COSMOS_PRODUCT_EVENT_PACKAGE`                           | 이벤트 패키지 상품 ID                   |
| `COSMOS_PRODUCT_PACKAGE`                                 | 패키지 상품 ID 접두사 (includes 검사용) |
| `COSMOS_PRODUCT_PACKAGE_1` ~ `COSMOS_PRODUCT_PACKAGE_10` | 패키지별 상품 ID                        |
| `COSMOS_PRODUCT_VOUCHER_1` ~ `COSMOS_PRODUCT_VOUCHER_11` | 이용권별 상품 ID                        |

### 6. 관리자 / Admin

| 명칭                   | 용도            |
| ---------------------- | --------------- |
| `COSMOS_ADMIN_EMAIL_1` | 관리자 이메일 1 |
| `COSMOS_ADMIN_EMAIL_2` | 관리자 이메일 2 |

### 7. 큐·워커 / Queue & Worker

| 명칭                               | 용도                                 |
| ---------------------------------- | ------------------------------------ |
| `COSMOS_ENABLE_TAROT_QUEUE_WORKER` | 타로 큐 워커 활성화 (`true`/`false`) |

### 8. 데이터베이스·캐시 / Database & Cache

| 명칭                        | 용도                                  |
| --------------------------- | ------------------------------------- |
| `COSMOS_MONGO_DB_URL`       | MongoDB 연결 URL                      |
| `COSMOS_REDIS_HOST`         | Redis 호스트                          |
| `COSMOS_REDIS_PORT`         | Redis 포트                            |
| `COSMOS_REDIS_PASSWORD`     | Redis 비밀번호                        |
| `COSMOS_REDIS_DB`           | Redis DB 번호                         |
| `COSMOS_REDIS_USERNAME`     | Redis 사용자명 (선택)                 |
| `COSMOS_REDIS_EVAL_ENABLED` | Redis EVAL 사용 여부 (`true`/`false`) |

### 9. AI (OpenRouter) / AI

| 명칭                                   | 용도                                                                  |
| -------------------------------------- | --------------------------------------------------------------------- |
| `COSMOS_TAROT_READING_TYPE_2`          | 타로 모델 2 읽기 타입 라벨 (저장·응답용, short만. 미설정 시 `normal`) |
| `COSMOS_TAROT_READING_TYPE_3`          | 타로 모델 3 읽기 타입 라벨 (미설정 시 `deep`)                         |
| `COSMOS_TAROT_READING_TYPE_4`          | 타로 모델 4 읽기 타입 라벨 (미설정 시 `serious`)                      |
| `COSMOS_TAROT_READING_TYPE_GUEST`      | 게스트 읽기 타입 라벨 (저장 시 `guest_` 접두사. 미설정 시 `normal`)   |
| `COSMOS_OPENROUTER_TAROT_LLAMA33_70B`  | Llama 70B 모델 ID                                                     |
| `COSMOS_OPENROUTER_TAROT_LLAMA31_405B` | Llama 405B 모델 ID                                                    |
| `COSMOS_OPENROUTER_TAROT_GEMINI_FLASH` | Gemini Flash 모델 ID                                                  |
| `COSMOS_OPENROUTER_TAROT2_MAX_TOKENS`  | Tarot 2 최대 토큰                                                     |
| `COSMOS_OPENROUTER_TAROT3_MAX_TOKENS`  | Tarot 3 최대 토큰                                                     |
| `COSMOS_OPENROUTER_TAROT4_MAX_TOKENS`  | Tarot 4 최대 토큰                                                     |

### 10. 앱 버전 / App Version

| 명칭                  | 용도                                            |
| --------------------- | ----------------------------------------------- |
| `APP_MINIMUM_VERSION` | 앱 최소 지원 버전 (이보다 낮으면 강제 업데이트) |
| `APP_IOS_URL`         | iOS 앱스토어 URL                                |
| `APP_ANDROID_URL`     | Android 플레이스토어 URL                        |

### 11. 프론트엔드 (Vite 주입) / Frontend (Vite)

| 명칭                                | 비고                                                      |
| ----------------------------------- | --------------------------------------------------------- |
| `VITE_COSMOS_*`                     | 기존 명칭 유지 (빌드 시 클라이언트에 주입)                |
| `VITE_ADMOB_BANNER_ID`              | AdMob 배너 광고 유닛 ID                                   |
| `VITE_ADMOB_INTERSTITIAL_TAROT1_ID` | AdMob 전면광고(타로1) 유닛 ID                             |
| `VITE_ADMOB_INTERSTITIAL_TAROT2_ID` | AdMob 전면광고(타로2) 유닛 ID                             |
| `VITE_ADMOB_REWARD_ID`              | AdMob 보상형 광고 유닛 ID                                 |
| `VITE_ADMOB_REWARD_INTERSTITIAL_ID` | AdMob 보상형 전면광고 유닛 ID                             |
| `VITE_MUSIC_CDN_BASE`               | 음원 CDN 베이스 URL (미설정 시 `https://cdn.pixabay.com`) |

> **Android strings.xml**: `app/src/main/res/values/strings.xml`의 `admob_app_id`는 gitignore됨.  
> 앱 빌드 시 `ca-app-pub-XXXX~YYYY` 형식으로 별도 설정 필요.

<br>

---

## 설정 파일 / Config Files / 설정 파일

| 환경             | 파일                                                     |
| ---------------- | -------------------------------------------------------- |
| 개발             | `back/.env`                                              |
| 프론트 개발/빌드 | `back/front/.env`, `.env.development`, `.env.production` |

[← 문서 홈으로](../README.md)
