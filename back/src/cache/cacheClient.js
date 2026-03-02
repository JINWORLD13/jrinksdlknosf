const { createClient } = require("redis");
const { commonErrors, wrapError } = require("../common/errors");

const isDevelopment = process.env.NODE_ENV !== "PRODUCTION";

class CacheClient {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 2; // 2번!

    // 새로 추가: 백그라운드 앱 관리용 변수들
    // 新規追加: バックグラウンドアプリ管理用変数
    // New: background app management variables
    this.isAppInBackground = false;
    this.backgroundReconnectTimer = null;
    this.lastActiveTime = Date.now();
    this.heartbeatInterval = null;
    this.reconnectInProgress = false; // 중복 재연결 방지

    // 보안 설정 (사용자 요청 반영)
    // セキュリティ設定（ユーザー要望反映）
    // Security settings (per user request)
    this.allowedKeyPrefixes = [
      "user:",
      "session:",
      "cache:",
      "counter:",
      "refund:",
      "payment:",
      "auth:",
    ];
    this.maxKeysToScan = 1000; // 1000개로 설정
    this.evalEnabled = process.env.COSMOS_REDIS_EVAL_ENABLED === "true";
    this.trustedScripts = new Map();
  }

  async connect() {
    // 중복 연결 시도 방지
    if (this.reconnectInProgress) {
      if (isDevelopment)
        console.log("Reconnection already in progress, skipping...");
      return;
    }

    this.reconnectInProgress = true;

    try {
      this.client = createClient({
        username: process.env.COSMOS_REDIS_USERNAME,
        password: process.env.COSMOS_REDIS_PASSWORD,
        socket: {
          host: process.env.COSMOS_REDIS_HOST || "localhost",
          port: Number(process.env.COSMOS_REDIS_PORT) || 6379,
          connectTimeout: 1500, // 1500ms
          lazyConnect: true,
          keepAlive: true, // 연결 유지하기
          noDelay: true, // 빠른 응답

          // 새로 추가: 추가 소켓 옵션들
          // 新規追加: 追加ソケットオプション
          // New: additional socket options
          family: 0, // IPv4와 IPv6 모두 지원
          keepAliveInitialDelay: 10000, // 10초 후 첫 keepalive 패킷
        },
        retry_unfulfilled_commands: true,
        retryDelayOnFailover: 1000, // 500ms → 1000ms로 개선!

        // 새로 추가: 추가 안정성 옵션들
        // 新規追加: 追加安定性オプション
        // New: additional stability options
        retryDelayOnClusterDown: 300,
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        commandTimeout: 8000, // 명령어 타임아웃 8초
        enableOfflineQueue: true, // 오프라인일 때 명령어 큐에 저장
      });

      this.setupEventListeners();
      await this.client.connect();

      // 새로 추가: 연결 성공하면 하트비트 시작
      // 新規追加: 接続成功でハートビート開始
      // New: start heartbeat on connection success
      this.startHeartbeat();

      // 안전한 스크립트들을 미리 등록
      // 安全なスクリプトを事前登録
      // Register trusted scripts in advance
      await this.registerTrustedScripts();
    } catch (error) {
      if (isDevelopment) console.error("Redis connection error:", error);
      this.connected = false;

      // 새로 추가: 연결 실패해도 재시도 스케줄링
      this.scheduleReconnect();
      throw error;
    } finally {
      this.reconnectInProgress = false;
    }
  }

  // 새로 추가: 하트비트로 연결 상태 체크
  // 新規追加: ハートビートで接続状態チェック
  // New: check connection state via heartbeat
  startHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    // 백그라운드 상태에 따라 다른 간격으로 설정
    // バックグラウンド状態に応じて間隔を設定
    // Set interval by background state
    const interval = this.isAppInBackground ? 60000 : 30000; // 백그라운드: 1분, 포그라운드: 30초

    this.heartbeatInterval = setInterval(async () => {
      try {
        if (this.isConnected()) {
          await this.client.ping();
          this.lastActiveTime = Date.now();
        }
      } catch (error) {
        if (isDevelopment)
          console.warn("Heartbeat failed, connection might be lost");
        this.connected = false;
        this.handleConnectionLoss();
      }
    }, interval);
  }

  // 새로 추가: 연결 끊김 처리
  handleConnectionLoss() {
    if (this.reconnectInProgress) return; // 이미 재연결 중이면 무시

    if (!this.isAppInBackground) {
      // 앱이 활성상태인데 연결이 끊어진 경우 즉시 재연결
      // アプリがアクティブなのに接続が切れた場合は即時再接続
      // Reconnect immediately when app is active but connection lost
      if (isDevelopment)
        console.log(
          "Active app connection lost, attempting immediate reconnect",
        );
      this.scheduleReconnect(1000); // 1초 후 재연결
    } else {
      // 백그라운드 상태면 조금 더 여유롭게
      // バックグラウンドなら少し余裕を持って
      // If in background, allow more delay
      if (isDevelopment)
        console.log(
          "Background app connection lost, scheduling gentle reconnect",
        );
      this.scheduleReconnect(5000); // 5초 후 재연결
    }
  }

  // 새로 추가: 재연결 스케줄링 (지수 백오프 적용)
  // 新規追加: 再接続スケジュール（指数バックオフ適用）
  // New: schedule reconnect (exponential backoff)
  scheduleReconnect(delay = 2000) {
    if (this.backgroundReconnectTimer) {
      clearTimeout(this.backgroundReconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (isDevelopment)
        console.error("Max reconnection attempts reached, giving up");
      return;
    }

    // 지수 백오프: 재시도할 때마다 대기시간 늘리기 (최대 10초)
    const backoffDelay = Math.min(
      delay * Math.pow(2, this.reconnectAttempts),
      10000,
    );

    this.backgroundReconnectTimer = setTimeout(async () => {
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        try {
          if (isDevelopment)
            console.log(
              `Attempting scheduled reconnect (${
                this.reconnectAttempts + 1
              }/${this.maxReconnectAttempts})`,
            );
          await this.connect();
        } catch (error) {
          if (isDevelopment)
            console.error("Scheduled reconnect failed:", error);
          // 재귀적으로 다시 스케줄링
          // 再帰的に再スケジュール
          // Reschedule recursively
          this.scheduleReconnect(delay);
        }
      }
    }, backoffDelay);
  }

  // 새로 추가: 앱 상태 변화 감지
  // 新規追加: アプリ状態変化検知
  // New: detect app state change
  setAppState(isBackground) {
    const wasBackground = this.isAppInBackground;
    this.isAppInBackground = isBackground;

    if (isBackground && !wasBackground) {
      if (isDevelopment) console.log("App went to background");
      // 백그라운드로 갈 때 하트비트 간격 늘리기
      // バックグラウンド時にハートビート間隔を延長
      this.startHeartbeat(); // 간격 조정된 하트비트 재시작
    } else if (!isBackground && wasBackground) {
      if (isDevelopment) console.log("App came to foreground");
      // 포그라운드로 올 때 연결 상태 체크하고 하트비트 정상화
      // フォアグラウンド復帰時に接続状態チェックとハートビート正常化
      // When returning to foreground, check connection and restore heartbeat
      this.checkAndReconnect();
      this.startHeartbeat(); // 30초 간격으로 복원
    }
  }

  // 새로 추가: 연결 상태 체크 및 재연결
  // 新規追加: 接続状態チェックと再接続
  // New: check connection and reconnect
  async checkAndReconnect() {
    const timeSinceLastActive = Date.now() - this.lastActiveTime;

    // 5분 이상 비활성 상태였거나 연결이 끊어진 경우
    // 5分以上非アクティブまたは接続切断の場合
    // Inactive for 5+ minutes or connection lost
    if (timeSinceLastActive > 300000 || !this.isConnected()) {
      if (isDevelopment) console.log("Connection seems stale, reconnecting...");
      try {
        if (this.client && this.client.isOpen) {
          await this.client.disconnect();
        }
        await this.connect();
      } catch (error) {
        if (isDevelopment) console.error("Reconnection failed:", error);
        this.scheduleReconnect();
      }
    }
  }

  setupEventListeners() {
    this.client.on("error", (err) => {
      if (isDevelopment) console.error("Redis Client Error", err);
      this.connected = false;
      // 개선: 에러 발생시에도 재연결 시도
      // 改善: エラー発生時も再接続試行
      // On error, attempt reconnect
      this.handleConnectionLoss();
    });

    this.client.on("connect", () => {
      if (isDevelopment) console.log("Redis client connected");
      this.connected = true;
      this.reconnectAttempts = 0; // 개선: 성공하면 재시도 카운터 리셋
      this.lastActiveTime = Date.now(); // 새로 추가
    });

    this.client.on("end", () => {
      if (isDevelopment) console.log("Redis connection ended");
      this.connected = false;
      // 개선: 연결 종료시에도 재연결 시도
      // 改善: 接続終了時も再接続試行
      // On connection end, attempt reconnect
      this.handleConnectionLoss();
    });

    this.client.on("reconnecting", () => {
      this.reconnectAttempts++;
      if (isDevelopment)
        console.log(
          `Redis reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
        );
      this.connected = false;

      // 개선: 최대 재시도 횟수 체크를 여기서 제거 (scheduleReconnect에서 처리)
    });

    this.client.on("ready", () => {
      if (isDevelopment) console.log("Redis client ready");
      this.connected = true;
      this.lastActiveTime = Date.now(); // 새로 추가
    });
  }

  // 키 패턴 검증
  // キーパターン検証
  // Validate key pattern
  validateKeyPattern(pattern) {
    const hasValidPrefix = this.allowedKeyPrefixes.some((prefix) =>
      pattern.startsWith(prefix),
    );

    if (!hasValidPrefix) {
      throw wrapError(
        new Error(
          `Invalid key pattern. Allowed prefixes: ${this.allowedKeyPrefixes.join(
            ", ",
          )}`,
        ),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }

    // 위험한 문자 검사
    // 危険文字チェック
    // Check for dangerous characters
    const dangerousChars = /[;&|`$\(\)]/;
    if (dangerousChars.test(pattern)) {
      throw wrapError(
        new Error("Pattern contains dangerous characters"),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }

    return true;
  }

  // 키 검증
  // キー検証
  // Validate key
  validateKey(key) {
    if (typeof key !== "string" || key.length === 0) {
      throw wrapError(
        new Error("Key must be a non-empty string"),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }

    if (key.length > 250) {
      throw wrapError(
        new Error("Key too long (max 250 characters)"),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }

    const hasValidPrefix = this.allowedKeyPrefixes.some((prefix) =>
      key.startsWith(prefix),
    );

    if (!hasValidPrefix) {
      throw wrapError(
        new Error(
          `Invalid key. Allowed prefixes: ${this.allowedKeyPrefixes.join(", ")}`,
        ),
        commonErrors.argumentError,
        { statusCode: 400 },
      );
    }

    return true;
  }

  isConnected() {
    return this.connected && this.client && this.client.isOpen;
  }

  // 새로 추가: 안전한 작업 실행 (재연결 시도 포함)
  async safeExecute(operation, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        if (!this.isConnected()) {
          if (attempt === 1) {
            // 첫 번째 시도에서 연결이 안 되어 있으면 재연결 시도
            // 初回試行で未接続なら再接続試行
            // If not connected on first attempt, try reconnect
            await this.checkAndReconnect();
          } else {
            throw wrapError(
              new Error("Redis not connected"),
              commonErrors.databaseError,
              { statusCode: 500 },
            );
          }
        }

        return await operation();
      } catch (error) {
        if (isDevelopment)
          console.warn(
            `Operation failed (attempt ${attempt}/${maxRetries}):`,
            error.message,
          );

        if (attempt === maxRetries) {
          throw error;
        }

        // 재시도 전 잠깐 대기 (지수 백오프)
        // 再試行前に短く待機（指数バックオフ）
        // Brief wait before retry (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 500 * Math.pow(2, attempt - 1)),
        );
      }
    }
  }

  // 기본 메서드들 (보안 검증 포함) - safeExecute로 감싸서 개선
  async set(key, data, expireSeconds = 3600) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);

        // 만료 시간 제한 (최대 7일)
        // 有効期限制限（最大7日）
        // Expiry limit (max 7 days)
        const maxExpire = 7 * 24 * 3600;
        const safeExpire = Math.min(expireSeconds, maxExpire);

        // UTF-8 인코딩 보장: 문자열이면 그대로, 객체면 JSON.stringify 사용
        // JSON.stringify는 기본적으로 UTF-8을 사용하므로 추가 처리 불필요
        const value = typeof data === "string" ? data : JSON.stringify(data);
        await this.client.setEx(key, safeExpire, value);
        return true;
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis set error:", error);
      return false;
    }
  }

  async get(key) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);

        const str = await this.client.get(key);
        if (!str) return null;

        // Redis 클라이언트는 이미 UTF-8로 디코딩된 문자열을 반환
        // 다만 answer 필드가 JSON 문자열인 경우를 대비해 안전하게 처리
        try {
          return JSON.parse(str);
        } catch {
          // JSON이 아닌 경우 문자열 그대로 반환 (UTF-8 보장됨)
          return str;
        }
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis get error:", error);
      return null;
    }
  }

  async del(...keys) {
    try {
      return await this.safeExecute(async () => {
        // 모든 키 검증
        // 全キー検証
        keys.forEach((key) => this.validateKey(key));

        // 한 번에 삭제할 키 개수 100개로 설정
        // 一括削除キー数を100に制限
        // Limit keys to delete at once to 100
        if (keys.length > 100) {
          throw wrapError(
            new Error("Too many keys to delete at once (max 100)"),
            commonErrors.argumentError,
            { statusCode: 400 },
          );
        }

        const deletedCount = await this.client.del(keys);
        return deletedCount;
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis del error:", error);
      return false;
    }
  }

  // SCAN으로 keys 대체 (안전한 키 조회)하되 safeExecute 적용
  async scanKeys(pattern, count = 100) {
    try {
      return await this.safeExecute(async () => {
        this.validateKeyPattern(pattern);

        const keys = [];
        let cursor = 0;
        let scannedCount = 0;

        do {
          const result = await this.client.scan(cursor, {
            MATCH: pattern,
            COUNT: Math.min(count, 100), // 최대 100개씩
          });

          cursor = result.cursor;
          keys.push(...result.keys);
          scannedCount += result.keys.length;

          // 최대 스캔 개수 제한 (1000개)
          if (scannedCount >= this.maxKeysToScan) {
            if (isDevelopment)
              console.warn(`Scan limit reached: ${this.maxKeysToScan}`);
            break;
          }
        } while (cursor !== 0);

        return keys;
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis scanKeys error:", error);
      return [];
    }
  }

  // 위험한 keys 명령어 비활성화
  // 危険なkeysコマンド無効化
  // Disable dangerous keys command
  async keys(pattern) {
    if (isDevelopment)
      console.warn("DEPRECATED: keys() is unsafe. Use scanKeys() instead.");
    return await this.scanKeys(pattern);
  }

  // 안전한 스크립트 등록
  async registerTrustedScripts() {
    // Lock 해제 스크립트
    const unlockScript = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;

    // 조건부 증가 스크립트
    // 条件付き増加スクリプト
    // Conditional increment script
    const conditionalIncrScript = `
      local current = redis.call("get", KEYS[1])
      if current == false then
        current = 0
      else
        current = tonumber(current)
      end
      
      local limit = tonumber(ARGV[1])
      if current < limit then
        return redis.call("incr", KEYS[1])
      else
        return current
      end
    `;

    try {
      const unlockSha = await this.client.scriptLoad(unlockScript);
      const incrSha = await this.client.scriptLoad(conditionalIncrScript);

      this.trustedScripts.set("unlock", unlockSha);
      this.trustedScripts.set("conditionalIncr", incrSha);

      if (isDevelopment) console.log("Trusted scripts registered");
    } catch (error) {
      if (isDevelopment)
        console.error("Failed to register trusted scripts:", error);
    }
  }

  // 안전한 스크립트 실행하되 safeExecute 적용
  // 安全なスクリプト実行（safeExecute適用）
  // Execute trusted script with safeExecute
  async executeTrustedScript(scriptName, keys, args) {
    try {
      return await this.safeExecute(async () => {
        if (!this.trustedScripts.has(scriptName)) {
          throw wrapError(
            new Error(`Unknown trusted script: ${scriptName}`),
            commonErrors.configError,
            { statusCode: 500 },
          );
        }

        keys.forEach((key) => this.validateKey(key));

        const sha = this.trustedScripts.get(scriptName);
        return await this.client.evalSha(sha, {
          keys: keys,
          arguments: args,
        });
      });
    } catch (error) {
      if (isDevelopment)
        console.error(`Trusted script execution error (${scriptName}):`, error);
      return null;
    }
  }

  // eval 명령어 제한
  async eval(script, numKeys, ...args) {
    if (!this.evalEnabled) {
      throw wrapError(
        new Error(
          "eval() is disabled for security. Use executeTrustedScript() instead.",
        ),
        commonErrors.configError,
        { statusCode: 403 },
      );
    }

    if (process.env.NODE_ENV === "production") {
      throw wrapError(
        new Error("eval() is not allowed in production"),
        commonErrors.configError,
        { statusCode: 403 },
      );
    }

    if (isDevelopment)
      console.warn("WARNING: Using eval() in development mode");

    try {
      return await this.safeExecute(async () => {
        return await this.client.eval(script, {
          keys: args.slice(0, numKeys),
          arguments: args.slice(numKeys),
        });
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis eval error:", error);
      return null;
    }
  }

  // Lock 타임아웃하되 safeExecute 적용
  async acquireLock(lockKey, timeout = 400, retries = 2) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(lockKey);

        const lockValue = `${Date.now()}-${Math.random()}`;

        for (let i = 0; i < retries; i++) {
          const acquired = await this.client.set(lockKey, lockValue, {
            PX: timeout,
            NX: true,
          });

          if (acquired) {
            return {
              success: true,
              lockValue,
              release: async () => {
                return await this.executeTrustedScript(
                  "unlock",
                  [lockKey],
                  [lockValue],
                );
              },
            };
          }

          // 재시도 대기시간
          await new Promise((resolve) => setTimeout(resolve, 50 * (i + 1)));
        }

        return { success: false };
      });
    } catch (error) {
      if (isDevelopment) console.error("Lock acquisition error:", error);
      return { success: false };
    }
  }

  // 제한된 카운터 증가
  // 制限付きカウンター増加
  // Limited counter increment
  async limitedIncr(key, limit = 1000) {
    try {
      this.validateKey(key);
      return await this.executeTrustedScript(
        "conditionalIncr",
        [key],
        [limit.toString()],
      );
    } catch (error) {
      if (isDevelopment) console.error("Limited incr error:", error);
      return null;
    }
  }

  // 나머지 메서드들하되 safeExecute 적용
  async incr(key) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);
        return await this.client.incr(key);
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis incr error:", error);
      return null;
    }
  }

  async setex(key, seconds, value) {
    return await this.set(key, value, seconds);
  }

  async ttl(key) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);
        return await this.client.ttl(key);
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis ttl error:", error);
      return -2;
    }
  }

  async expire(key, seconds) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);

        const maxExpire = 7 * 24 * 3600;
        const safeSeconds = Math.min(seconds, maxExpire);

        return await this.client.expire(key, safeSeconds);
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis expire error:", error);
      return false;
    }
  }

  async exists(key) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);
        return await this.client.exists(key);
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis exists error:", error);
      return false;
    }
  }

  // 리스트 처리하되 safeExecute 적용
  // リスト処理（safeExecute適用）
  // List operations with safeExecute
  async lpush(key, ...values) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);

        // 한 번에 추가할 값 개수를 100개로 설정
        if (values.length > 100) {
          throw new Error("Too many values to push at once (max 100)");
        }

        const stringValues = values.map((v) =>
          typeof v === "string" ? v : JSON.stringify(v),
        );
        return await this.client.lPush(key, stringValues);
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis lpush error:", error);
      return 0;
    }
  }

  async lrange(key, start, stop) {
    try {
      return await this.safeExecute(async () => {
        this.validateKey(key);

        // 조회 범위를 1000개로 설정
        // 取得範囲を1000件に制限
        // Limit range to 1000
        const maxRange = 1000;
        const safeStop = Math.min(stop, start + maxRange);

        return await this.client.lRange(key, start, safeStop);
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis lrange error:", error);
      return [];
    }
  }

  async ping() {
    try {
      return await this.safeExecute(async () => {
        const response = await this.client.ping();
        return response === "PONG";
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis ping error:", error);
      return false;
    }
  }

  async info(section = null) {
    try {
      return await this.safeExecute(async () => {
        return section
          ? await this.client.info(section)
          : await this.client.info();
      });
    } catch (error) {
      if (isDevelopment) console.error("Redis info error:", error);
      return "";
    }
  }

  // 개선된 disconnect
  async disconnect() {
    try {
      // 새로 추가: 타이머들 정리
      // 新規追加: タイマー整理
      // New: clear timers
      if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
      }

      if (this.backgroundReconnectTimer) {
        clearTimeout(this.backgroundReconnectTimer);
        this.backgroundReconnectTimer = null;
      }

      if (this.client && this.connected) {
        await this.client.quit();
        this.connected = false;
        if (isDevelopment) console.log("Redis disconnected gracefully");
      }
    } catch (error) {
      if (isDevelopment) console.error("Redis disconnect error:", error);
    }
  }
}

const cacheClient = new CacheClient();
module.exports = cacheClient;
