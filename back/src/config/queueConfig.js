const queueRedisConfig = {
  redis: {
    host: process.env.COSMOS_REDIS_HOST || "localhost",
    port: Number(process.env.COSMOS_REDIS_PORT) || 6379,
    password: process.env.COSMOS_REDIS_PASSWORD,
    // 환경별 Redis DB 인덱스 분리 (dev/prod 격리용)
    // - 예: dev=1, prod=0
    db: Number(process.env.COSMOS_REDIS_DB) || 0,
    // Bull은 ioredis를 기반으로 하거나 redis 옵션을 받으므로 필요한 경우 추가 설정
  },
};

module.exports = queueRedisConfig;
