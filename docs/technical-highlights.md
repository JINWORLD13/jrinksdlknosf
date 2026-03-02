# Technical Highlights / 기술 하이라이트

> Cosmos Tarot 프로젝트의 핵심 기술 구현 세부 사항입니다.

---

## 1. 멀티 Provider 통합 (Multi-Provider Integration)

3개의 AI Provider를 조합하여 서비스 안정성을 확보했습니다. Primary 모델 실패 시 자동으로 Secondary, Tertiary 모델로 Fallback 로직이 실행됩니다.

```javascript
// Fallback logic structure
// Primary → Secondary → Tertiary 순으로 Fallback
// 한 Provider가 실패하더라도 서비스 중단 없이 운영 가능
```

## 2. 결제 및 트랜잭션 시스템 (Payment & Transaction System)

Web PG(Toss)와 Mobile In-App 결제를 모두 지원하며, 데이터 무결성을 위해 Redis와 MongoDB 트랜잭션을 활용합니다.

- **중복 결제 방지**: Redis Lock을 사용하여 동일 사용자의 동시 요청을 차단합니다.
- **데이터 무결성**: 결제 완료와 바우처 지급 과정을 MongoDB Transaction으로 원자적(Atomic)으로 처리합니다.
- **복잡한 로직**: 부분 환불, 가상계좌 웹훅 처리 등 예외 상황을 고려하여 설계되었습니다.

## 3. 효율적인 데이터 관리 (Data Management)

MongoDB의 TTL(Time-To-Live) 인덱스를 활용하여 개인정보 보호 및 스토리지 효율성을 극대화했습니다.

- **자동 정리**: 결제 방법 및 데이터 유형에 따라 서로 다른 보관 정책(1분~90일)을 적용하여 데이터를 자동 삭제합니다.
- **GDPR 대응**: 사용하지 않는 타로 기록(3개월 후 삭제) 등을 주기적으로 정리하여 보안 및 개인정보 관련 규정을 준수합니다.

## 4. Redis 안정성 및 비동기 처리

모바일 앱 환경의 특성(백그라운드 전환 등)을 고려하여 Redis 연결을 관리하고, 무거운 작업은 큐를 통해 처리합니다.

- **연결 복구**: Heartbeat와 지수 백오프(Exponential Backoff)를 적용하여 자동 재연결을 수행합니다.
- **비동기 큐 (Bull Queue)**: LLM 해석과 같이 시간이 오래 걸리는 작업은 비동기 큐를 통해 처리하여 서버 부하를 방지하고 응답 속도를 개선했습니다.

## 5. 분석 및 모니터링 (Analytics & Monitoring)

사용자 행동을 분석하고 서비스 가시성을 확보하기 위해 다양한 도구를 활용했습니다.

- **Firebase**: FCM을 통한 푸시 알림 및 Firebase Auth 기반의 소셜 로그인 보조, 앱 내 활동 분석을 수행합니다.
- **Google Analytics (GA4)**: 사용자 경로, 페이지 체류 시간, 전환율(결제 완료 등) 등 주요 비즈니스 지표를 추적합니다.
- **Sentry**: 실시간 에러 추적 및 성능 모니터링을 통해 프로덕션 환경의 이슈에 즉각 대응합니다.

## 6. 에러 핸들링 패턴 (Error Handling Pattern)

단순 로그 기록 이상으로, 체계적인 에러 추적을 위해 커스텀 패턴을 적용했습니다.

- **wrapError**: 원본 에러의 Stack Trace를 보존하면서 도메인별 에러 이름(Name)을 부여하는 유틸리티를 사용하여, Sentry 등 모니터링 툴에서 에러 발생 지점과 원인을 명확히 파악할 수 있게 설계했습니다.
- **중앙 집중식 미들웨어**: 모든 에러는 최종적으로 `server.js`의 에러 핸들러 미들웨어를 거쳐 일관된 형식의 JSON으로 클라이언트에 전달됩니다.

---

[문서 홈으로 돌아가기](./README.md)
