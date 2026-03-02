# Portfolio Redacted Schema

> 포트폴리오 공개용 축약 스키마 예시  
> 실제 운영 코드가 아니라, 구조 설명용 샘플입니다.

> Frontend 공개 코드에서는 의미 키 직접 노출을 줄이기 위해 opaque transport(`a[]`, `b[]`)를 사용하고,  
> Backend에서만 실제 처리 구조로 복원합니다.

---

## 1) User (Redacted)

```javascript
const userSchema = new Schema(
  {
    // [PORTFOLIO] 계정 식별 정보
    accountIdentity: { type: Object, required: true },
    // [PORTFOLIO] 사용자 상태/권한 정보
    accountState: { type: Object, required: false },
    // [PORTFOLIO] 인증 관련 메타데이터 (세부 키 비공개)
    authMetadata: { type: Object, required: false },
    // userAgent: { deviceType, os, browser, login, ... }
    // counsleeInfo: { localeScopedProfile, preferenceData, ... }
    // [REDACTED] 수익화/개인정보/운영 최적화 필드
  },
  { timestamps: true, versionKey: false }
);

userSchema.index({ "accountIdentity.uniqueKey": 1 }, { unique: true });
// [REDACTED] 운영 정책용 partial TTL index
// userSchema.index({ updatedAt: 1 }, { expireAfterSeconds: ... , partialFilterExpression: ... });
```

---

## 2) Tarot (Redacted)

```javascript
const tarotSchema = new Schema(
  {
    // [PORTFOLIO] Question payload schema intentionally abstracted.
    // questionData: { promptText, contextText, optionTexts, ... }
    questionData: { type: Object, required: false },
    // [PORTFOLIO] Reading setup schema intentionally abstracted.
    // readingConfig: { spreadMeta, selectedCards, ... }
    readingConfig: { type: Object, required: true },
    // [PORTFOLIO] Combined reading config kept abstract.
    // combinedReadingConfig: { selectedCards, mergePolicy, ... }
    combinedReadingConfig: { type: Object, required: false },
    interpretation: { type: String, required: false }, // 결과 텍스트
    readingType: { type: String, required: true }, // 리딩 타입 식별값
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    // [REDACTED] 추가질문 체인/분기 내부 구조
    chainMetadata: { type: Object, required: false },
  },
  { timestamps: true, versionKey: false }
);

// 중복 방지용 인덱스(핵심 아이디어만 공개)
tarotSchema.index({ "questionData.question": 1, timeOfCounselling: 1 }, { unique: true });

// [REDACTED] 보관 기간 세부 수치
// tarotSchema.index({ createdAt: 1 }, { expireAfterSeconds: ... });
```

---

## 2-A) Frontend Transport (Opaque)

```javascript
// Frontend transport (public-safe)
const payload = {
  questionData: { v: 1, a: [/* ordered core values */], b: [/* optional values */] },
  readingConfig: { v: 1, a: [/* ordered meta values */], b: [/* selected cards */] },
};

// Backend normalization (private processing shape)
// normalizeTarotPayload(payload) -> { questionData: {...}, readingConfig: {...} }
```

---

## 2-1) GuestTarot (Redacted)

```javascript
const guestTarotSchema = new Schema(
  {
    deviceId: { type: String, required: true, index: true },
    // [PORTFOLIO] Question payload schema intentionally abstracted.
    // questionData: { promptText, contextText, optionTexts, ... }
    questionData: { type: Object, required: false },
    // [PORTFOLIO] Reading setup schema intentionally abstracted.
    // readingConfig: { spreadMeta, selectedCards, ... }
    readingConfig: { type: Object, required: true },
    interpretation: { type: String, required: false },
    readingType: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

// [REDACTED] 단기 보관 정책 TTL 인덱스
// guestTarotSchema.index({ createdAt: 1 }, { expireAfterSeconds: ... });
```

---

## 3) Charge/Payment (Redacted)

```javascript
const chargeSchema = new Schema(
  {
    // [PORTFOLIO] 주문 기본 식별/표시 정보
    orderInfo: { type: Object, required: true },
    // [PORTFOLIO] 결제 흐름 메타데이터
    paymentFlow: { type: Object, required: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // orderHistory: { itemKey: [qty, used, revoked], ... }
    // orderVouchers: [[voucherType, count], ...]
    // refundReceiveAccount: { bank, accountNumber, holderName, ... }
    // [REDACTED] 결제 식별자/상품/환불/바우처 내부 정책 데이터
    paymentInternal: { type: Object, required: false },
  },
  { timestamps: true, versionKey: false }
);

// 레이스 컨디션 방지 핵심 인덱스(공개 가치 높음)
chargeSchema.index({ userId: 1, orderId: 1 }, { unique: true });

// [REDACTED] 결제 수단/상품별 TTL 정책 상세
// chargeSchema.index({ createdAt: 1 }, { expireAfterSeconds: ..., partialFilterExpression: ... });
// ...
```

---

## 4) Violation / DeletedUser (Redacted)

```javascript
const violationSchema = new Schema({
  violationCategory: { type: String, required: true },
  relatedOrderKey: { type: String, required: false, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  // [PORTFOLIO] violation details are stored but semantic rules are redacted.
  // detailPayload: { refundedAmount, remainingQuantity, description, ... }
  // [REDACTED] 내부 판단/추적 상세 메타데이터
  traceMetadata: { type: Object, required: false },
});

const deletedUserSchema = new Schema({
  accountIdentity: { type: Object, required: true },
  deleteReason: { type: String, required: false }, // 삭제 사유
  // userAgent: { deviceType, os, browser, login, ... }
  // vouchers: { typeKey: count, ... }
  // [REDACTED] 운영 보존/복구용 내부 스냅샷
  archiveSnapshot: { type: Object, required: false },
});
```

---

## 공개 원칙 (면접/포폴용)

- 구조/관계/인덱스 의도는 공개
- 수익화 정책값, 임계치, 상세 분기, TTL 수치, 내부 enum은 마스킹
- 실제 사용자 데이터 예시는 절대 포함 금지
- 실제 키/토큰/시크릿은 환경변수로만 관리

