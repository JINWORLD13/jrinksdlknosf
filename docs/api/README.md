# API 문서 / API Documentation / API ドキュメント

> 백엔드 API 엔드포인트 개요 / Backend API Endpoint Overview / バックエンド API エンドポイント概要

**관련:** 프론트 페이지 라우트(UrlPaths · ROUTE)와 서버 마운트(server.js) 정리는 [라우트 정리](../ROUTES.md) 참고.

<br>

---

## 한눈에 보기 / Overview / 概要

<table>
<tr>
<td width="33%">

### 한국어

| 항목          | 내용                                               |
| ------------- | -------------------------------------------------- |
| **Base Path** | `/tarot`, `/authenticate`, `/user`, `/payments` 등 |
| **인증**      | OAuth 2.0 (Google) + JWT                           |
| **토큰**      | Access + Refresh (자동 갱신)                       |
| **응답**      | JSON                                               |
| **에러 코드** | 400, 401, 403, 404, 500                            |

</td>
<td width="33%">

### English

| Item           | Details                                              |
| -------------- | ---------------------------------------------------- |
| **Base Path**  | `/tarot`, `/authenticate`, `/user`, `/payments`, etc |
| **Auth**       | OAuth 2.0 (Google) + JWT                             |
| **Token**      | Access + Refresh (auto-renewal)                      |
| **Response**   | JSON                                                 |
| **Error Code** | 400, 401, 403, 404, 500                              |

</td>
<td width="33%">

### 日本語

| 項目             | 詳細                                               |
| ---------------- | -------------------------------------------------- |
| **Base Path**    | `/tarot`, `/authenticate`, `/user`, `/payments` 等 |
| **認証**         | OAuth 2.0 (Google) + JWT                           |
| **トークン**     | Access + Refresh（自動更新）                       |
| **レスポンス**   | JSON                                               |
| **エラーコード** | 400, 401, 403, 404, 500                            |

</td>
</tr>
</table>

<br>

---

## API 엔드포인트 요약 / API Endpoints / API エンドポイント

### 1. 인증 / Authentication / 認証 (`/authenticate`)

| 메서드 | 경로                     | 설명                  | 인증 |
| ------ | ------------------------ | --------------------- | ---- |
| GET    | `/oauth/google/start`    | OAuth 로그인 시작     | -    |
| GET    | `/oauth/google/callback` | OAuth 콜백 → JWT 발급 | -    |
| GET    | `/oauth/google/fail`     | OAuth 실패 처리       | -    |
| POST   | `/oauth/token-exchange`  | 앱용 코드→토큰 교환   | -    |

### 2. 타로 / Tarot (`/tarot`)

| 메서드 | 경로                | 설명                           | 인증 |
| ------ | ------------------- | ------------------------------ | ---- |
| POST   | `/readings/normal`  | 일반 타로 해석 (모델2)         | JWT  |
| POST   | `/readings/deep`    | 딥 타로 해석 (모델3)           | JWT  |
| POST   | `/readings/serious` | 시리어스 타로 해석 (모델4)     | JWT  |
| GET    | `/readings`         | 타로 기록 조회                 | JWT  |
| DELETE | `/readings`         | 타로 기록 삭제                 | JWT  |
| GET    | `/status/:jobId`    | 큐 Job 상태 폴링 (useQueue 시) | -    |

> **타로 API:** `useQueue: true` 시 Bull 큐에 job 등록 후 202 Accepted. `/status/:jobId`로 폴링.

### 3. 결제 / Payments (`/payments`)

| 메서드 | 경로                          | 설명                             | 인증 |
| ------ | ----------------------------- | -------------------------------- | ---- |
| POST   | `/toss/prepare`               | Toss 결제 준비                   | JWT  |
| GET    | `/toss/prepare`               | Toss 결제 준비 조회              | JWT  |
| DELETE | `/toss/prepare`               | Toss 결제 준비 삭제 (orderId)    | JWT  |
| DELETE | `/toss/prepare/by-key`        | Toss 결제 준비 삭제 (paymentKey) | JWT  |
| PUT    | `/toss/prepare`               | Toss 결제 준비 수정              | JWT  |
| POST   | `/toss/confirm`               | Toss 결제 승인                   | JWT  |
| POST   | `/toss/refund`                | Toss 환불 (전체/부분)            | JWT  |
| POST   | `/hook/toss/payment`          | Toss 웹훅 (가상계좌 입금 등)     | -    |
| POST   | `/mobile/verify`              | 구글 인앱 결제 영수증 검증       | JWT  |
| POST   | `/hook/google/subscription`   | 구글 인앱 환불 웹훅              | -    |
| GET    | `/purchase-limit`             | 상품별 구매 제한 조회            | JWT  |
| GET    | `/beginner-package-order-ids` | 초심자 패키지 orderId 조회       | JWT  |

### 4. 사용자 / User (`/user`)

| 메서드 | 경로       | 설명        | 인증 |
| ------ | ---------- | ----------- | ---- |
| GET    | `/profile` | 프로필 조회 | JWT  |
| PUT    | `/profile` | 프로필 수정 | JWT  |
| DELETE | `/account` | 회원 탈퇴   | JWT  |

### 5. 버전·추천 / Version & Referral

| 메서드 | 경로              | 설명                      | 인증 |
| ------ | ----------------- | ------------------------- | ---- |
| GET    | `/version/check`  | 앱 최소 버전·업데이트 URL | -    |
| POST   | `/referral/claim` | 추천인 보상 청구          | JWT  |

### 6. 헬스체크 / Health

| 메서드 | 경로                                                | 설명                        |
| ------ | --------------------------------------------------- | --------------------------- |
| GET    | `/health`, `/ko/health`, `/ja/health`, `/en/health` | 서버 상태 확인 (Railway 등) |

<br>

---

## 인증 방식 / Authentication / 認証方式

<table>
<tr>
<td width="33%">

### 한국어

**JWT 토큰**

```http
Authorization: Bearer <token>
```

**checkTokenWithRefresh 미들웨어**

- Access Token 만료 시 Refresh Token으로 자동 갱신
- 갱신된 토큰은 응답 헤더로 전달

</td>
<td width="33%">

### English

**JWT Token**

```http
Authorization: Bearer <token>
```

**checkTokenWithRefresh Middleware**

- Auto-renewal via Refresh Token on Access Token expiry
- New token passed via response header

</td>
<td width="33%">

### 日本語

**JWT トークン**

```http
Authorization: Bearer <token>
```

**checkTokenWithRefresh ミドルウェア**

- Access Token 期限切れ時に Refresh Token で自動更新
- 更新トークンはレスポンスヘッダーで送信

</td>
</tr>
</table>

<br>

---

## 응답 형식 / Response Format / レスポンス形式

<table>
<tr>
<td width="33%">

### 한국어

**성공**

```json
{
  "success": true,
  "data": { ... }
}
```

**에러**

```json
{
  "success": false,
  "message": "에러 메시지"
}
```

</td>
<td width="33%">

### English

**Success**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error**

```json
{
  "success": false,
  "message": "Error message"
}
```

</td>
<td width="33%">

### 日本語

**成功**

```json
{
  "success": true,
  "data": { ... }
}
```

**エラー**

```json
{
  "success": false,
  "message": "エラーメッセージ"
}
```

</td>
</tr>
</table>

<br>

---

## 에러 코드 / Error Codes / エラーコード

| Code | 한국어      | English         | 日本語           |
| ---- | ----------- | --------------- | ---------------- |
| 400  | 잘못된 요청 | Bad Request     | 不正なリクエスト |
| 401  | 인증 실패   | Unauthorized    | 認証失敗         |
| 403  | 권한 없음   | Forbidden       | 権限なし         |
| 404  | 리소스 없음 | Not Found       | リソースなし     |
| 500  | 서버 에러   | Internal Server | サーバーエラー   |

<br>

---

## 아키텍처 / Architecture / アーキテクチャ

<table>
<tr>
<td width="33%">

### 한국어

- **계층 구조**: Controller → Service → Repository
- **인증**: OAuth 2.0 (Google) + JWT
- **캐싱**: Redis (user, tarot, payment progress 등)
- **큐**: Bull (Redis 기반, haiku-queue, sonnet-queue)
- **데이터베이스**: MongoDB

</td>
<td width="33%">

### English

- **Layered Architecture**: Controller → Service → Repository
- **Auth**: OAuth 2.0 (Google) + JWT
- **Caching**: Redis (user, tarot, payment progress, etc.)
- **Queue**: Bull (Redis-based, haiku-queue, sonnet-queue)
- **Database**: MongoDB

</td>
<td width="33%">

### 日本語

- **レイヤーアーキテクチャ**: Controller → Service → Repository
- **認証**: OAuth 2.0 (Google) + JWT
- **キャッシング**: Redis (user, tarot, payment progress 等)
- **キュー**: Bull (Redis ベース, haiku-queue, sonnet-queue)
- **データベース**: MongoDB

</td>
</tr>
</table>

<br>

---

<div align="center">

**코드 위치:** `back/src/api/routes/`, `back/src/domains/*/controllers/`

[← 문서 홈으로](../README.md)

</div>
