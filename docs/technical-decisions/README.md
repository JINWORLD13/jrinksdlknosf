# 기술적 의사결정 기록

<table>
<tr>
  <td><b>🇰🇷 한국어</b></td>
  <td>프로젝트를 진행하면서 고민하고 결정한 내용들</td>
</tr>
<tr>
  <td><b>English</b></td>
  <td>Technical decisions made during development</td>
</tr>
<tr>
  <td><b>🇯🇵 日本語</b></td>
  <td>開発中に検討し決定した内容</td>
</tr>
</table>

<br>

---

## 한눈에 보기

> Overview | 概要

<table>
<tr>
<td width="33%">

### 한국어

| 결정 사항   | 선택                    | 이유                |
| ----------- | ----------------------- | ------------------- |
| **백엔드**  | Node.js + Express       | JavaScript 풀스택   |
| **DB**      | MongoDB (NoSQL)         | 유연한 스키마       |
| **캐시**    | Redis                   | Lock, 캐싱, Bull 큐 |
| **인증**    | OAuth 2.0 + JWT         | Stateless           |
| **결제**    | PG + 인앱               | 웹/앱 지원          |
| **AI 통합** | 멀티 Provider           | 안정성 보장         |
| **인프라**  | Railway, GCP App Engine | Docker, Serverless  |

</td>
<td width="33%">

### English

| Decision      | Choice            | Reason                |
| ------------- | ----------------- | --------------------- |
| **Backend**   | Node.js + Express | JavaScript full-stack |
| **DB**        | MongoDB (NoSQL)   | Flexible schema       |
| **Cache**     | Redis             | Lock mechanism        |
| **Auth**      | OAuth 2.0 + JWT   | Stateless             |
| **Payment**   | PG + In-app       | Web/App support       |
| **AI System** | Multi-Provider    | High availability     |
| **Infra**     | GCP App Engine    | Serverless            |

</td>
<td width="33%">

### 日本語

| 決定事項         | 選択              | 理由                            |
| ---------------- | ----------------- | ------------------------------- |
| **バックエンド** | Node.js + Express | JavaScript フルスタック         |
| **DB**           | MongoDB (NoSQL)   | 柔軟なスキーマ                  |
| **キャッシュ**   | Redis             | Lock, キャッシング, Bull キュー |
| **認証**         | OAuth 2.0 + JWT   | Stateless                       |
| **決済**         | PG + アプリ内     | Web/App サポート                |
| **AI システム**  | マルチ Provider   | 高可用性                        |
| **インフラ**     | GCP App Engine    | Serverless                      |

</td>
</tr>
</table>

<br>

---

## 주요 의사결정

> Key Decisions | 主要決定事項

<table>
<tr>
<td width="33%">

### 한국어

**1. Node.js 선택**

- JavaScript로 FE/BE 통일
- 비동기 처리 간편

**2. MongoDB 선택**

- 유연한 스키마 변경
- TTL Index 자동 삭제

**3. Redis 도입**

- 결제 데이터 임시 저장 (payment:progress 등)
- Lock(acquireLock)으로 중복 방지
- Bull 큐: 타로 AI 비동기 처리 (haiku-queue, sonnet-queue)

**4. AI 통합**

- 다중 백업 시스템
- 응답 검증 + 재시도

**5. GCP App Engine**

- Serverless
- Auto Scaling 자동

</td>
<td width="33%">

### English

**1. Node.js Choice**

- Unified FE/BE with JavaScript
- Easy async processing

**2. MongoDB Choice**

- Flexible schema
- TTL Index auto-delete

**3. Redis Introduction**

- Temporary payment data (payment:progress, etc.)
- Lock (acquireLock) prevents duplicates
- Bull queue: tarot AI async (haiku-queue, sonnet-queue)

**4. AI Integration**

- Multi-tier backup system
- Response validation + retry

**5. GCP App Engine**

- Serverless
- Auto Scaling

</td>
<td width="33%">

### 日本語

**1. Node.js 選択**

- JavaScript で FE/BE 統一
- 非同期処理が簡単

**2. MongoDB 選択**

- 柔軟なスキーマ
- TTL Index 自動削除

**3. Redis 導入**

- 一時決済データ保存 (payment:progress 等)
- Lock (acquireLock) で重複防止
- Bull キュー: タロット AI 非同期 (haiku-queue, sonnet-queue)

**4. AI 統合**

- 多段階バックアップ
- レスポンス検証+再試行

**5. GCP App Engine**

- Serverless
- Auto Scaling

</td>
</tr>
</table>

<br>

---

## 트러블슈팅 경험 / Troubleshooting / トラブルシューティング

<table>
<tr>
<td width="33%">

#### 한국어

| 문제                 | 시도           | 최종 해결                       |
| -------------------- | -------------- | ------------------------------- |
| **Redis 연결 끊김**  | 단순 재연결    | 포그라운드 재연결 + 지수 백오프 |
| **MongoDB TTL 지연** | 즉시 삭제 기대 | 60초 주기 이해                  |
| **Cold Start**       | 기본 설정      | `min_idle_instances: 1`         |
| **API Rate Limit**   | 단순 재시도    | 지수 백오프                     |

</td>
<td width="33%">

#### English

| Problem                 | Attempt          | Solution                                   |
| ----------------------- | ---------------- | ------------------------------------------ |
| **Redis Disconnection** | Simple Reconnect | Foreground Reconnect + Exponential Backoff |
| **MongoDB TTL Delay**   | Expect Immediate | Understand 60s cycle                       |
| **Cold Start**          | Default          | `min_idle_instances: 1`                    |
| **API Rate Limit**      | Simple Retry     | Exponential Backoff                        |

</td>
<td width="33%">

#### 日本語

| 問題                 | 試行           | 解決                                  |
| -------------------- | -------------- | ------------------------------------- |
| **Redis 接続切断**   | 単純再接続     | フォアグラウンド再接続+指数バックオフ |
| **MongoDB TTL 遅延** | 即時削除期待   | 60 秒周期理解                         |
| **Cold Start**       | デフォルト設定 | `min_idle_instances: 1`               |
| **API Rate Limit**   | 単純再試行     | 指数バックオフ                        |

</td>
</tr>
</table>

<br>

---

<details>
<summary><b>상세 의사결정 과정 보기 / Detailed Decision Process / 詳細な意思決定プロセス</b></summary>

## 1. 기술 스택 선택 / Tech Stack / 技術スタック選択

### 1-1. Node.js + Express

<table>
<tr>
<td width="33%">

#### 한국어

**선택 이유:**

- JavaScript로 FE/BE 모두 작성
- Express는 가볍고 배우기 쉬움
- 비동기 처리 용이
- npm 생태계 풍부

**고려했던 대안:**

- Python + Django/FastAPI
- Java + Spring Boot

**배운 점:**

- Node.js 이벤트 루프
- Express 미들웨어 체인
- async/await 비동기 로직

</td>
<td width="33%">

#### English

**Why Chosen:**

- Write both FE/BE in JavaScript
- Express is lightweight and easy
- Easy async processing
- Rich npm ecosystem

**Alternatives Considered:**

- Python + Django/FastAPI
- Java + Spring Boot

**Lessons Learned:**

- Node.js event loop
- Express middleware chain
- async/await async logic

</td>
<td width="33%">

#### 日本語

**選択理由:**

- JavaScript で FE/BE 両方記述
- Express は軽量で学びやすい
- 非同期処理が容易
- npm エコシステムが豊富

**検討した代替案:**

- Python + Django/FastAPI
- Java + Spring Boot

**学んだ点:**

- Node.js イベントループ
- Express ミドルウェアチェーン
- async/await 非同期ロジック

</td>
</tr>
</table>

---

### 1-2. MongoDB 選択 / MongoDB Choice / MongoDB 選択

<table>
<tr>
<td width="33%">

#### 한국어

**선택 이유:**

- 스키마 유연 (초기 설계 변경 쉬움)
- JSON 형태 (JavaScript 호환성)
- MongoDB Atlas 무료 호스팅
- Mongoose ORM 직관적

**실제 사용 경험:**

```javascript
{
  credits: {
    basic: 10,
    advanced: 5
  },
  history: {
    basic: [
      { quantity: 5, amount: 5000, orderId: "ORDER_123" }
    ]
  }
}
```

**장점:**

- ✅ 스키마 변경 자유로움
- ✅ TTL Index 자동 삭제
- ✅ Aggregation Pipeline
- ✅ MongoDB 트랜잭션 ACID 지원

**단점:**

- ⚠️ Join 어려움 (populate 활용)
- ⚠️ 트랜잭션 성능 (단일 컬렉션보다 느림)

</td>
<td width="33%">

#### English

**Why Chosen:**

- Flexible schema (easy to change initial design)
- JSON format (JavaScript compatibility)
- MongoDB Atlas free hosting
- Mongoose ORM intuitive

**Real Usage:**

```javascript
{
  credits: {
    basic: 10,
    advanced: 5
  },
  history: {
    basic: [
      { quantity: 5, amount: 5000, orderId: "ORDER_123" }
    ]
  }
}
```

**Pros:**

- ✅ Flexible schema changes
- ✅ TTL Index auto-deletion
- ✅ Aggregation Pipeline
- ✅ MongoDB transaction ACID support

**Cons:**

- ⚠️ Difficult joins (use populate)
- ⚠️ Transaction performance (slower than single collection)

</td>
<td width="33%">

#### 日本語

**選択理由:**

- スキーマ柔軟（初期設計変更容易）
- JSON 形式（JavaScript 互換性）
- MongoDB Atlas 無料ホスティング
- Mongoose ORM が直感的

**実際の使用例:**

```javascript
{
  credits: {
    basic: 10,
    advanced: 5
  },
  history: {
    basic: [
      { quantity: 5, amount: 5000, orderId: "ORDER_123" }
    ]
  }
}
```

**利点:**

- ✅ スキーマ変更が自由
- ✅ TTL Index 自動削除
- ✅ Aggregation Pipeline
- ✅ MongoDB トランザクション ACID 対応

**欠点:**

- ⚠️ Join が困難（populate 活用）
- ⚠️ トランザクション性能（単一コレクションより遅い）

</td>
</tr>
</table>

---

### 1-3. Redis 캐싱 & Lock

<table>
<tr>
<td width="33%">

#### 한국어

**도입 이유:**

1. 중복 요청 방지 (Redis Lock)
2. 사용자 데이터 캐싱 (성능 향상)
3. 결제 진행 상태 관리

**실제 사용:**

**1. Redis Lock (중복 결제 방지)**

```javascript
// 간단한 Lock 패턴 (TTL 기반)
const key = `payment:${orderId}`;
const isInProgress = await redisClient.exists(key);

if (isInProgress) {
  return { success: false };
}

// Lock 설정 (1분 TTL)
await redisClient.set(key, "in_progress", 60);

try {
  // 결제 처리
  const payment = await gateway.confirm({...});
  await Payment.create({...});
} finally {
  // Lock 해제
  await redisClient.del(key);
}
```

**2. 고급 Lock (Lua Script)**

```javascript
// acquireLock 메서드
const lock = await redisClient.acquireLock(`payment:${orderId}`, 400);

if (!lock.success) {
  throw new Error("이미 처리 중");
}

try {
  // 결제 처리
} finally {
  await lock.release();
}
```

**Lua Script unlock:**

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
-- 자신이 획득한 lock만 해제
```

**3. 사용자 데이터 캐싱**

```javascript
// 캐시 우선 조회
let user = await redisClient.get(`user:${id}`);

if (!user) {
  // DB 조회
  user = await userService.getById(id);
  await redisClient.set(`user:${id}`, user, 3600);
}
```

**장점:**

- ✅ 중복 요청 완벽 차단
- ✅ 빠른 응답 속도
- ✅ 분산 환경 지원
- ✅ Lua Script로 안전한 unlock

**트러블슈팅:**

- 문제: 백그라운드 전환 시 연결 끊김
- 해결: Heartbeat + 자동 재연결
- 코드: `back/src/cache/cacheClient.js`

</td>
<td width="33%">

#### English

**Reasons:**

1. Prevent duplicate requests (Redis Lock)
2. User data caching (performance)
3. Payment progress management

**Use Cases:**

**1. Redis Lock (Prevent Duplicate Payment)**

```javascript
// Simple Lock pattern (TTL-based)
const key = `payment:${orderId}`;
const isInProgress = await redisClient.exists(key);

if (isInProgress) {
  return { success: false };
}

// Set Lock (1min TTL)
await redisClient.set(key, "in_progress", 60);

try {
  // Process payment
  const payment = await gateway.confirm({...});
  await Payment.create({...});
} finally {
  // Release Lock
  await redisClient.del(key);
}
```

**2. Advanced Lock (Lua Script)**

```javascript
// acquireLock method
const lock = await redisClient.acquireLock(`payment:${orderId}`, 400);

if (!lock.success) {
  throw new Error("Already processing");
}

try {
  // Process payment
} finally {
  await lock.release();
}
```

**Lua Script unlock:**

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
-- Only release own lock
```

**3. User Data Caching**

```javascript
// Cache-first lookup
let user = await redisClient.get(`user:${id}`);

if (!user) {
  // DB query
  user = await userService.getById(id);
  await redisClient.set(`user:${id}`, user, 3600);
}
```

**Advantages:**

- ✅ Perfect duplicate prevention
- ✅ Fast response
- ✅ Distributed support
- ✅ Safe unlock with Lua Script

**Troubleshooting:**

- Problem: Disconnection on background
- Solution: Heartbeat + Auto-reconnect
- Code: `back/src/cache/cacheClient.js`

</td>
<td width="33%">

#### 日本語

**導入理由:**

1. 重複リクエスト防止 (Redis Lock)
2. ユーザーデータキャッシング (性能向上)
3. 決済進行状態管理

**実際の使用:**

**1. Redis Lock (重複決済防止)**

```javascript
// 簡単な Lock パターン (TTL ベース)
const key = `payment:${orderId}`;
const isInProgress = await redisClient.exists(key);

if (isInProgress) {
  return { success: false };
}

// Lock 設定 (1分 TTL)
await redisClient.set(key, "in_progress", 60);

try {
  // 決済処理
  const payment = await gateway.confirm({...});
  await Payment.create({...});
} finally {
  // Lock 解除
  await redisClient.del(key);
}
```

**2. 高度な Lock (Lua Script)**

```javascript
// acquireLock メソッド
const lock = await redisClient.acquireLock(`payment:${orderId}`, 400);

if (!lock.success) {
  throw new Error("処理中");
}

try {
  // 決済処理
} finally {
  await lock.release();
}
```

**Lua Script unlock:**

```lua
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
else
  return 0
end
-- 自分が取得した lock のみ解除
```

**3. ユーザーデータキャッシング**

```javascript
// キャッシュ優先照会
let user = await redisClient.get(`user:${id}`);

if (!user) {
  // DB 照会
  user = await userService.getById(id);
  await redisClient.set(`user:${id}`, user, 3600);
}
```

**利点:**

- ✅ 重複リクエスト完全遮断
- ✅ 高速レスポンス
- ✅ 分散環境サポート
- ✅ Lua Script で安全な unlock

**トラブルシューティング:**

- 問題: バックグラウンド時接続切断
- 解決: Heartbeat + 自動再接続
- コード: `back/src/cache/cacheClient.js`

</td>
</tr>
</table>

---

### 1-3-1. Bull 큐 (Redis 기반) / Bull Queue / Bull キュー

<table>
<tr>
<td width="33%">

#### 한국어

**도입 이유:**

- 타로 AI 해석은 LLM 호출로 30초~4분 소요
- 동기 처리 시 요청 타임아웃·연결 끊김 위험
- Bull로 비동기 처리 → 202 Accepted + 폴링으로 결과 수신

**구조:**

- `haiku-queue`: 모델2 (일반 타로)
- `sonnet-queue`: 모델3/4 (딥·시리어스)
- `COSMOS_ENABLE_TAROT_QUEUE_WORKER`: 워커 활성화 (기본 true)
- Job 옵션: attempts 2, timeout 4분, concurrency 50

**코드:** `back/src/queue/tarotQueue.js`

</td>
<td width="33%">

#### English

**Reasons:**

- Tarot AI takes 30s~4min (LLM call)
- Sync processing risks timeout/disconnect
- Bull async → 202 Accepted + polling for result

**Structure:**

- `haiku-queue`: model 2
- `sonnet-queue`: model 3/4
- `COSMOS_ENABLE_TAROT_QUEUE_WORKER`: worker enable (default true)
- Job: attempts 2, timeout 4min, concurrency 50

**Code:** `back/src/queue/tarotQueue.js`

</td>
<td width="33%">

#### 日本語

**導入理由:**

- タロット AI は LLM 呼び出しで 30秒～4分
- 同期処理はタイムアウト・切断リスク
- Bull 非同期 → 202 Accepted + ポーリングで結果取得

**構成:**

- `haiku-queue`: モデル2
- `sonnet-queue`: モデル3/4
- `COSMOS_ENABLE_TAROT_QUEUE_WORKER`: ワーカー有効 (デフォルト true)
- Job: attempts 2, timeout 4分, concurrency 50

**コード:** `back/src/queue/tarotQueue.js`

</td>
</tr>
</table>

---

### 1-4. GCP App Engine / Railway

<table>
<tr>
<td width="33%">

#### 한국어

**선택 이유:**

- Serverless (서버 관리 불필요)
- Auto Scaling 자동
- HTTPS 자동 발급
- 학생 이용권 활용

**비용:** 월 $22 (F1 인스턴스 1개 상시)

</td>
<td width="33%">

#### English

**Why Chosen:**

- Serverless (no server management)
- Auto Scaling automatic
- HTTPS auto-provisioned
- Student vouchers available

**Cost:** $22/month (1 F1 instance always-on)

</td>
<td width="33%">

#### 日本語

**選択理由:**

- Serverless（サーバー管理不要）
- Auto Scaling 自動
- HTTPS 自動発行
- 学生利用券活用

**費用:** 月額 $22（F1 インスタンス 1 個常時）

</td>
</tr>
</table>

</details>

<br>

---

<div align="center">

**코드 위치 / Code Location / コード位置:** `back/src/domains/`

[← 문서 홈으로 / Back to Docs / ドキュメントホームへ](../README.md)

</div>
