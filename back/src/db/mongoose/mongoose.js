const mongoose = require("mongoose");

// 기존 설정 유지
mongoose.set("strictQuery", false);
// mongoose.set('debug', true); // 디버깅 활성화

const DB_URL = process.env.COSMOS_MONGO_DB_URL;

// 재연결 방지를 위한 플래그
let isConnecting = false;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;

const DBConnect = async () => {
  // 이미 연결 시도 중이면 중단
  if (isConnecting) {
    console.log("Connection already in progress...");
    return;
  }

  isConnecting = true;

  try {
    await mongoose.connect(DB_URL, {
      dbName: "cosmos",

      // 올바른 커넥션 풀 설정
      // 새로 추가된 커넥션 풀 설정들
      // APP ENGINE 인스턴스 F1은 성능이 낮으니 연결 수를 적게
      // 正しいコネクションプール設定。新規追加。F1は性能が低いため接続数を少なめに
      // Correct connection pool settings. New. F1 has low performance so fewer connections
      //! F2부터 10개로 해보자
      maxPoolSize: 7,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,

      // 올바른 옵션명들
      bufferCommands: false, // bufferMaxEntries (X) -> bufferCommands (O)
      maxIdleTimeMS: 30000,
      heartbeatFrequencyMS: 2000,
    });

    // 연결 성공
    isConnecting = false;
    reconnectAttempts = 0;

    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log(
        "커넥션 풀: 최소 2개 ~ 최대 7개(병렬 삭제 처리를 위해 증가) - mongoose.js"
      );
    } else {
      console.log("C.S");
    }
  } catch (err) {
    isConnecting = false;
    console.error("mongoDB connection err: ", err.message);

    // 재연결 시도 (최대 5번까지만)
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.log(
          `Server restarting ${reconnectAttempts}/${maxReconnectAttempts} 10 sec later`
        );
      }

      setTimeout(async () => {
        await DBConnect();
      }, 10000); // 10초 대기
    } else {
      if (process.env.NODE_ENV === "DEVELOPMENT") {
        console.error(
          "Maximum reconnection attempts exceeded. Please restart the server."
        );
      }
    }
  }
};

const db = mongoose.connection;

// 무한루프 방지된 에러 처리
db.on("error", (error) => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.error("mongoDB connection error: ", error.message);
  }
  // 여기서 DBConnect() 호출 제거 (무한루프 방지)
});

db.on("disconnected", () => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.error("mongoDB disconnected");
  }
  // 무한루프 방지: 이미 연결 시도 중이 아닐 때만 재연결
  if (!isConnecting && reconnectAttempts < maxReconnectAttempts) {
    if (process.env.NODE_ENV === "DEVELOPMENT") {
      console.log("restaring 5 sec later...");
    }
    setTimeout(async () => {
      await DBConnect();
    }, 5000);
  }
});

// 연결 성공 이벤트
db.on("connected", () => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("mongoDB connection success!");
  }
});

// 재연결 성공 이벤트
db.on("reconnected", () => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("mongoDB reconnection success!");
  }
  reconnectAttempts = 0; // 재연결 성공 시 카운터 리셋
});

// 🧹 프로세스 종료 시 깔끔하게 연결 해제
process.on("SIGINT", async () => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("\n👋 Server shutting down... Closing MongoDB connections.");
  }
  await mongoose.connection.close();
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("mongoDB disconnection success!");
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("\n👋 Server shutting down... Closing MongoDB connections.");
  }
  await mongoose.connection.close();
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    console.log("mongoDB disconnection success!");
  }
  process.exit(0);
});

module.exports = DBConnect;

// App engine에서 버전 속 인스턴스 수가 서버의 개수가 됨.
// 서버당 최대 미리 만들어 놓은 커넥션 수가 10개.
// 몽고db는 무료버전은 최대 100개 가능. 그럼 자동 스케일링으로 10개 되면 100개가 됨.. 그 이상은 불가.
// F1의 한계들
// - CPU 600MHz → AI 대기시간 동안 다른 요청 처리 어려움
// - 메모리 128MB → Node.js + MongoDB 연결만으로도 빠듯
// - 네트워크 공유 → 느린 응답 시간
// 여유로움: 1-5명 동시 사용
// 버거움: 6-10명 동시 사용
// 한계: 11명+ 동시 사용 (느려짐)

//! 사용자 늘어날때 가이드
// 1. F1으로 자동 스케일링이 됨.
// 2. F1을 넘게 되면, F2로 바꾸고 풀링최대수도 10개~15개(몽고DB 무료버전 기준)
// 티어 최대연결수 권장풀링크기 월
// 비용M0(Free) 100개 3-10개 무료
// M2/M5(Shared) 500개 10-50개 $9-25
// M10(Dedicated) 1500개 50-150개 $57
// M20 3000개 100-300개 $120
// M30 4500개 200-450개 $240
// M40+ 제한거의없음 수백~수천개 $480+
