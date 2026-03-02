# 타로 AI: 트랜잭션 + Redis 큐 + Redis 캐싱 흐름 (포트폴리오용)

**공개 파일:** `back/src/domains/tarot/controllers/utils/postQuestionToAI.js`  
→ Redis 유저 캐시 조회 → (useQueue면) Redis/Bull 큐에 job 등록 → (동기면) AI 해석 + MongoDB 트랜잭션 + Redis 캐시 갱신.

- **postQuestionToAI.js:** Redis 캐시 조회, Bull 큐 등록, 동기 경로(runSyncTarotFlow) 처리.
- **tarotCardInterpreterWithAIAPI.js:** AI 해석 (비공개 모듈). 포트폴리오에는 호출 측만 노출.
- **큐 워커:** `back/src/queue/tarotQueue.js` — Bull job 처리 후 AI 호출 + 트랜잭션 + 캐시 무효화.

---

## 1. 컨트롤러: Redis 캐시 조회 + 큐 등록 vs 동기 경로

`postQuestionToAI.js` 구조. 트랜잭션·Redis 큐·캐시 흐름을 보여주기 위한 요약.

```javascript
// postQuestionToAI.js
const cacheClient = require("../../../../cache/cacheClient.js");
const { userService } = require("../../../user/services/index.js");
const { haikuQueue, sonnetQueue } = require("../../../../queue/tarotQueue.js");

async function postQuestionToAI(req, res, next, modelNumber) {
  const userId = req?.user ?? req?.session?.user?.id ?? null;
  const inputQuestionData = req?.body;

  // 1) Redis 캐시에서 유저 조회 (캐시 미스 시 DB)
  const userFromCache = await cacheClient.get(`user:${userId}`);
  const userInfo = userFromCache
    ? userFromCache
    : await userService.getUserById(userId);

  // 2) 검증 (이용권·광고제거·인앱 위반)
  const validated = await validateTarotRequest(
    userId, userInfo, inputQuestionData, modelNumber, res
  );
  if (validated === null) return;

  // 3) Redis 큐: useQueue 시 job 등록 → 202 Accepted
  if (inputQuestionData?.useQueue === true) {
    const crypto = require("crypto");
    const jobId = crypto.randomUUID();
    const queue = modelNumber === 2 ? haikuQueue : sonnetQueue;
    const job = await queue.add(
      { userId, inputQuestionData, modelNumber },
      { jobId }
    );
    return res.status(202).json({
      success: true, message: "Job queued", status: "queued", jobId: job.id,
    });
  }

  // 4) 동기 경로: AI 해석 + MongoDB 트랜잭션 + Redis 캐시 갱신
  await runSyncTarotFlow(
    userId, inputQuestionData, modelNumber, validated.userInfo, res
  );
}
```

---

## 2. 동기 경로: runSyncTarotFlow — 트랜잭션 내 캐시 갱신

```javascript
// postQuestionToAI.js - runSyncTarotFlow
const mongoose = require("mongoose");

async function runSyncTarotFlow(userId, inputQuestionData, modelNumber, userInfo, res) {
  const interpretation = await tarotCardInterpreterWithAIAPI(
    { ...inputQuestionData }, modelNumber
  );
  const interpretationWithoutQuestion = processInterpretation(interpretation, inputQuestionData);
  const type = getReadingType(modelNumber);

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // 타로 생성 + 유저 업데이트 (바우처 차감 또는 무료 타로 통계 증가)
      await createTarotAndSendResponse(...);
      updatedUserInfo = await processVoucherConsumption(...) // 또는 userService.updateUser(...)

      // 트랜잭션 내부에서 캐시 무효화 + 갱신
      await cacheClient.del(`user:${userId}`);
      await cacheClient.del(`cache:tarot:${userId}`);
      await cacheClient.set(`user:${userId}`, updatedUserInfo, 3600);
    });
  } finally {
    await session.endSession();
  }
}
```

---

## 3. 큐 워커: Bull job 처리 → AI 호출 → 트랜잭션 → 캐시 무효화

```javascript
// tarotQueue.js
const Queue = require("bull");
const queueRedisConfig = require("../config/queueConfig");

const jobOptions = {
  redis: queueRedisConfig.redis,
  settings: {
    lockDuration: 60000,
    stalledInterval: 60000,
    maxStalledCount: 3,
  },
  defaultJobOptions: {
    removeOnComplete: { age: 240 },
    removeOnFail: true,
    attempts: 2,
    backoff: { type: "exponential", delay: 2000 },
    timeout: 240000,
  },
};

const haikuQueue = new Queue("haiku-queue", jobOptions);
const sonnetQueue = new Queue("sonnet-queue", jobOptions);

const processJob = async (job) => {
  const { userId, inputQuestionData, modelNumber } = job.data;

  const userInfo = await userService.getUserById(userId);
  const interpretation = await tarotCardInterpreterWithAIAPI(
    { ...inputQuestionData }, modelNumber
  );
  const interpretationWithoutQuestion = processInterpretation(interpretation, inputQuestionData);
  const type = getReadingType(modelNumber);

  const conn = mongoose.connection;
  const session = await conn.startSession();

  try {
    await session.withTransaction(async () => {
      // 타로 생성 + 유저 업데이트 (바우처/무료 타로)
      finalResult = await createTarotAndSendResponse(
        inputQuestionData, interpretationWithoutQuestion, type, userInfo, null, session
      );
      updatedUserInfo = await processVoucherConsumption(...) // 또는 userService.updateUser(...)
    });

    // 트랜잭션 성공 후 캐시 무효화
    await cacheClient.del(`user:${userId}`);
    await cacheClient.del(`cache:tarot:${userId}`);
    return finalResult;
  } finally {
    await session.endSession();
  }
};

// initTarotQueueProcessors() 호출 시 프로세서 등록 (server.js)
haikuQueue.process(50, processJob);
sonnetQueue.process(50, processJob);
```

---

## 4. Redis 캐시 키 패턴

| 키 패턴 | 용도 | TTL |
| ------- | ---- | --- |
| `user:${userId}` | 유저 정보 | 3600s |
| `cache:tarot:${userId}` | 타로 기록 | 3600s |
| `payment:progress:${userId}:${orderId}` | 결제 진행 상태 | 60~3600s |
| `auth:temp:${code}` | 앱 코드→토큰 교환 | - |

---

## 5. 흐름 요약

| 단계 | 컨트롤러 (postQuestionToAI) | 큐 워커 (tarotQueue) |
|------|-----------------------------|------------------------|
| 1 | Redis `get(user:${userId})` 또는 DB로 유저 조회 | Job 데이터로 유저 조회 |
| 2 | useQueue면 `queue.add()` → 202, 아니면 아래로 | `tarotCardInterpreterWithAIAPI()` 호출 |
| 3 | 동기: runSyncTarotFlow 내 AI 호출 + 트랜잭션 + 캐시 갱신 | `session.withTransaction()` |
| 4 | `session.withTransaction()` | 타로 생성 + 유저 업데이트 |
| 5 | `cacheClient.del` + `cacheClient.set` (트랜잭션 내) | `cacheClient.del` (트랜잭션 성공 후) |

**정리:** `postQuestionToAI.js`는 **Redis 캐시 조회·Bull 큐 등록·동기 경로(runSyncTarotFlow)** 를 담당. AI 해석은 `tarotCardInterpreterWithAIAPI.js`(비공개)에서 수행.
