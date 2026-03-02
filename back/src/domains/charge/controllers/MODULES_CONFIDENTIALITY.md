# Charge Controller 모듈 분리 및 기밀 여부

chargeController에서 토스/구글 인앱 결제·환불 관련 코드를 실무 기준으로 모듈화한 구조와, **따로 뺀 모듈의 기밀 여부**를 정리한 문서입니다.

---

## 1. 모듈 구조

| 모듈 | 경로 | 역할 |
|------|------|------|
| 토스 웹훅 핸들러 | `handlers/tossWebhookHandlers.js` | 토스 결제 완료/취소/부분취소 웹훅 라우팅 및 처리 (결제완료·가상계좌·환불 이용권) |
| 토스 API 클라이언트 | `clients/tossPaymentsClient.js` | 토스 결제 상태 조회, 결제 확인, 결제 취소 HTTP 호출 |
| 구글 플레이 환불 핸들러 | `handlers/googlePlayRefundHandler.js` | 구글 Pub/Sub 웹훅 디코딩, orderId 추출, 락/검증/환불 오케스트레이션 |

---

## 2. 따로 뺀 모듈의 기밀 여부

### 공개 가능 (기밀 아님)

- **`handlers/tossWebhookHandlers.js`**  
  - 비밀키/API키 없음. `process.env` 참조는 상품ID 등 일반 설정 수준만 사용.  
  - 결제 완료·취소·환불 이용권 처리 **플로우**만 포함. **공개 가능.**

- **`clients/tossPaymentsClient.js`**  
  - secretKey/URL은 **호출부(chargeController)**에서 `process.env`로 주입.  
  - 본 모듈에는 비밀값 없음. Toss Payments API 호출 **형식**만 포함. **공개 가능.**

- **`handlers/googlePlayRefundHandler.js`**  
  - 비밀값 없음. Pub/Sub 디코딩·orderId 추출·락/검증/환불 오케스트레이션만 포함.  
  - 실제 구매 검증 로직은 `verifyPurchaseWithGooglePlay`(미들웨어)에 있으며, 해당 파일은 `.gitignore` 대상. **본 핸들러는 공개 가능.**

### 기밀 유지 대상 (별도 관리)

- **`chargeController.js`**  
  - `process.env.COSMOS_TOSS_SECRET_KEY`, `COSMOS_ADMIN_EMAIL_*` 등 **환경 변수 이름** 노출.  
  - 값은 `.env`에 두고 커밋하지 않으면 됨. 공개 시에는 env **이름**만 노출되는 수준.

- **`verifyPurchaseWithGooglePlay.js`** (미들웨어)  
  - 구글 인앱 결제 **실제 검증 로직** 포함. 이미 `.gitignore`에 포함된 **기밀** 파일.

- **`processRefund`** (chargeController 하단 함수)  
  - 구글 인앱 환불 시 바우처 차감·Charge 삭제·violation 기록 등 **비즈니스 로직** 포함.  
  - 상품/바우처 구조가 드러나므로, 공개 범위에 따라 controller 전체와 함께 비공개로 둘 수 있음.

---

## 3. 요약

| 구분 | 기밀 여부 |
|------|-----------|
| `handlers/tossWebhookHandlers.js` | **공개 가능** |
| `clients/tossPaymentsClient.js` | **공개 가능** |
| `handlers/googlePlayRefundHandler.js` | **공개 가능** |
| `chargeController.js` | env 이름만 노출, 값은 .env로 관리 시 공개 가능 |
| `verifyPurchaseWithGooglePlay.js` | **기밀** (.gitignore 유지) |
| `processRefund` (및 controller 내부 비즈니스 로직) | 공개 범위에 따라 비공개 검토 |

따로 뺀 **세 모듈(tossWebhookHandlers, tossPaymentsClient, googlePlayRefundHandler)** 자체에는 **기밀 정보가 없으며 공개 가능**합니다.
