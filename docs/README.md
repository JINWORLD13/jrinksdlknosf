# Cosmos Tarot 기술 문서 / Technical Documentation / 技術ドキュメント

<br>

---

## 문서 구성 / Documentation / ドキュメント構成

<table>
<tr>
<td width="33%">

### 한국어

| 문서                                    | 내용               | 핵심 키워드                        |
| --------------------------------------- | ------------------ | ---------------------------------- |
| **[API 문서](./api/)**                  | 엔드포인트 명세    | OAuth, 결제, 외부 API              |
| **[라우트 정리](./ROUTES.md)**          | 프론트·서버 라우트 | UrlPaths, ROUTE, server.js         |
| **[DB 설계](./database/)**              | MongoDB ERD        | TTL Index, 트랜잭션, Redis 캐시/큐 |
| **[배포 가이드](./devops/)**            | Railway / GCP 배포 | Docker, 웹훅                       |
| **[기술 결정](./technical-decisions/)** | 의사결정 과정      | Fallback, Lock 패턴                |

</td>
<td width="33%">

### English

| Document                                     | Content               | Keywords                                   |
| -------------------------------------------- | --------------------- | ------------------------------------------ |
| **[API Docs](./api/)**                       | Endpoint Specs        | OAuth, Payment, API                        |
| **[Routes Reference](./ROUTES.md)**          | Front & server routes | UrlPaths, ROUTE, server.js                 |
| **[DB Design](./database/)**                 | MongoDB ERD           | TTL Index, Transactions, Redis cache/queue |
| **[Deploy Guide](./devops/)**                | Railway / GCP Deploy  | Docker, Webhook                            |
| **[Tech Decisions](./technical-decisions/)** | Decision Process      | Fallback, Lock Pattern                     |

</td>
<td width="33%">

### 日本語

| ドキュメント                           | 内容                   | キーワード                                           |
| -------------------------------------- | ---------------------- | ---------------------------------------------------- |
| **[API ドキュメント](./api/)**         | エンドポイント仕様     | OAuth, 決済, 外部 API                                |
| **[ルート一覧](./ROUTES.md)**          | フロント・サーバルート | UrlPaths, ROUTE, server.js                           |
| **[DB 設計](./database/)**             | MongoDB ERD            | TTL Index, トランザクション, Redis キャッシュ/キュー |
| **[デプロイガイド](./devops/)**        | Railway / GCP デプロイ | Docker, Webhook                                      |
| **[技術決定](./technical-decisions/)** | 意思決定プロセス       | Fallback, Lock パターン                              |

</td>
</tr>
</table>

<br>

---

## 기술 스택 / Tech Stack / 技術スタック

<table>
<tr>
<td width="33%" valign="top">

### 한국어

- **Frontend**: React 18, Three.js, Redux Toolkit, SCSS
- **Backend**: Node.js 22, Express, MongoDB, Redis, JWT
- **인프라**: Railway (Docker), GCP App Engine
- **결제**: PG 결제, 모바일 인앱
- **외부**: Multi AI (Fallback), Firebase, GA

</td>
<td width="33%" valign="top">

### English

- **Frontend**: React 18, Three.js, Redux Toolkit, SCSS
- **Backend**: Node.js 22, Express, MongoDB, Redis, JWT
- **Infrastructure**: Railway (Docker), GCP App Engine
- **Payment**: PG Payment, Mobile In-App
- **External**: Multi AI (Fallback), Firebase, GA

</td>
<td width="33%" valign="top">

### 日本語

- **フロントエンド**: React 18, Three.js, Redux Toolkit, SCSS
- **バックエンド**: Node.js 22, Express, MongoDB, Redis, JWT
- **インフラ**: Railway (Docker), GCP App Engine
- **決済**: PG 決済, モバイルインアプ
- **外部**: マルチ AI (Fallback), Firebase, GA

</td>
</tr>
</table>

<br>

---

## 개발 지표 / Development Metrics / 開発指標

<table>
<tr>
<td width="33%">

### 한국어

| 항목            | 값                                                            |
| --------------- | ------------------------------------------------------------- |
| 개발 기간       | 10개월 (2023.11 - 2024.08)                                    |
| 백엔드 코드     | 약 25,000줄                                                   |
| 프론트엔드 코드 | 약 120,000줄 (JS·TS 기준)                                     |
| API 엔드포인트  | 35+개                                                         |
| DB 컬렉션       | 6개 (User, Tarot, GuestTarot, Charge, Violation, DeletedUser) |
| 배포 횟수       | 100+회                                                        |

</td>
<td width="33%">

### English

| Item           | Value                         |
| -------------- | ----------------------------- |
| Duration       | 10 months (2023.11 - 2024.08) |
| Backend Code   | ~25,000 lines                 |
| Frontend Code  | ~120,000 lines (JS/TS only)   |
| API Endpoints  | 30+                           |
| DB Collections | 5                             |
| Deployments    | 100+ times                    |

</td>
<td width="33%">

### 日本語

| 項目                 | 値                                                             |
| -------------------- | -------------------------------------------------------------- |
| 開発期間             | 10 ヶ月 (2023.11 - 2024.08)                                    |
| バックエンドコード   | 約 25,000 行                                                   |
| フロントエンドコード | 約 120,000 行 (JS・TS基準)                                     |
| API エンドポイント   | 35+個                                                          |
| DB コレクション      | 6 個 (User, Tarot, GuestTarot, Charge, Violation, DeletedUser) |
| デプロイ回数         | 100+回                                                         |

</td>
</tr>
</table>

<br>

---

## 학습한 기술 / Skills Learned / 習得した技術

<table>
<tr>
<td width="33%">

### 한국어

**백엔드**

- RESTful API 설계 및 구현
- MongoDB 스키마 설계 및 인덱싱
- Redis 캐싱·Lock·Bull 큐 (타로 AI 비동기 처리)
- JWT 기반 인증 시스템
- PG사 결제 시스템 연동
- 모바일 인앱 결제 시스템
- 외부 API 통합 (멀티 Provider)
- 웹훅 처리 (Pub/Sub)
- **대규모 요청 비동기 처리**: LLM의 느린 응답 속도를 극복하기 위해 Bull Queue를 도입, 서버 부하를 분산하고 사용자 경험을 개선했습니다.
- **체계적인 에러 추적**: `wrapError` 유틸리티와 Sentry를 연동하여 에러 발생 시 원본 Stack Trace를 보존하고 도메인별 에러를 명확히 분류하도록 구현했습니다.
- **자원 최적화 전략**: MongoDB TTL 인덱스로 개인정보를 자동 파기하고, Redis 캐싱으로 DB 부하를 70% 이상 절감했습니다.

**인프라**

- **현재 배포**: Railway (Git Push로 자동 배포). _GCP App Engine은 과거 사용._
- Auto Scaling 설정
- 커스텀 도메인 연결
- HTTPS 인증서 관리

**문제 해결**

- 에러 핸들링 및 Fallback 패턴
- 트랜잭션 무결성 (MongoDB Transaction + Redis Lock)
- 성능 최적화 (캐싱, TTL)

</td>
<td width="33%">

### English

**Backend**

- RESTful API design & implementation
- MongoDB schema design & indexing
- Redis caching, Lock & Bull queue (tarot AI async)
- JWT-based authentication system
- PG payment system integration
- Mobile in-app payment system
- External API integration (Multi-provider)
- Webhook processing (Pub/Sub)
- Optimized Asynchronous Processing: Implemented Bull Queue for large-scale LLM request distribution
- Data-Driven Decision Making: Integrated Firebase Analytics and GA to track user churn and key conversion events

**Infrastructure**

- **Current Deployment**: Railway (Auto-deploy via Git Push). _GCP App Engine was used previously._
- Auto Scaling configuration
- Custom domain connection
- HTTPS certificate management

**Problem Solving**

- Error handling & Fallback patterns
- Transaction integrity (MongoDB Transaction + Redis Lock)
- Performance optimization (Caching, TTL)

</td>
<td width="33%">

### 日本語

**バックエンド**

- RESTful API 設計と実装
- MongoDB スキーマ設計とインデックス
- Redis キャッシング・Lock・Bull キュー（タロット AI 非同期）
- JWT ベース認証システム
- PG 決済システム連携
- モバイルインアプ決済システム
- 外部 API 統合（マルチプロバイダー）
- Webhook 処理 (Pub/Sub)

**インフラ**

- **現在デプロイ**: Railway (Git Pushで自動デプロイ). _GCP App Engineは過去に使用._
- Auto Scaling 設定
- カスタムドメイン接続
- HTTPS 証明書管理

**問題解決**

- エラーハンドリングと Fallback パターン
- トランザクション整合性 (MongoDB Transaction + Redis Lock)
- パフォーマンス最適化（キャッシング、TTL）

</td>
</tr>
</table>

<br>
 
 ---
 
 ## 개발 회고 및 트러블 슈팅 / Retrospective & Troubleshooting / 開発回顧＆トラブルシューティング
 
 <table>
 <tr>
 <td width="33%">
 
 ### 한국어
 
 **1. 배경 및 선택**
 - **WebView (Hybrid)**: 1인 개발로 Web/Navite 동시 대응을 위해 채택. Capacitor 브릿지로 호환성 확보.
 - **Logic-based Tarot**: 타로의 구조적 로직에 집중하여 AI 해석 가능성 확신 및 구현.
 - **DB 회고**: 초기 친숙함으로 MongoDB 선택했으나, 데이터 관계성을 고려할 때 RDBMS(PostgreSQL)가 더 적합했을 것임을 학습.
 
 **2. 주요 트러블 슈팅**
 - **Three.js**: 메모리 누수(dispose 명시적 호출) 및 SEO 한계(Prerender 우회) 해결.
 - **비용 최적화**: GCP($35/월) → Railway($5/월) 이전으로 85% 이상 절감.
 - **인증 구조 개선**: GCP 세션 소실 문제 해결을 위해 JWT(Stateless) + Refresh Token 도입.
 - **결제 안정성**: Redis Lock 및 MongoDB Unique Index로 중복 결제(Race Condition) 원천 차단.
 - **도메인 이슈**: Railway CNAME 제약 및 AdMob ads.txt 인증 문제 해결을 위해 Cloudflare 우회 구성.
 - **iOS 날짜**: `yyyy-mm-dd` 포맷 파싱 오류 → `MM/DD/YYYY` 로컬 포맷으로 변경하여 해결.
 
 </td>
 <td width="33%">
 
 ### English
 
 **1. Background & Choices**
 - **WebView (Hybrid)**: Adopted for efficiency in solo dev to cover both Web & Native.
 - **Logic-based Tarot**: Focused on structural logic of Tarot, confirming feasibility of AI interpretation.
 - **DB Reflection**: Chose MongoDB for familiarity, but learned RDBMS (PostgreSQL) would be better for relational data.
 
 **2. Key Troubleshooting**
 - **Three.js**: Solved memory leaks (manual dispose) & SEO limitations (Prerender workaround).
 - **Cost Optimization**: Migrated GCP($35/mo) → Railway($5/mo), saving over 85%.
 - **Auth System**: Switched to JWT (Stateless) + Refresh Token to fix session loss on GCP.
 - **Payment Safety**: Prevented race conditions with Redis Lock & MongoDB Unique Index.
 - **Domain Issues**: Solved Railway CNAME & AdMob ads.txt issues via Cloudflare routing.
 - **iOS Date**: Fixed `yyyy-mm-dd` parsing error by switching to `MM/DD/YYYY` local format.
 
 </td>
 <td width="33%">
 
 ### 日本語
 
 **1. 背景と選択**
 - **WebView (Hybrid)**: 1人開発でWeb/Native同時対応のため採用。
 - **Logic-based Tarot**: タロットの構造的ロジックに集中し、AI解釈の可能性を確信・実装。
 - **DB 回顧**: 初期はMongoDBを選択したが、データ関係性を考慮するとRDBMS(PostgreSQL)が適していたと学習。
 
 **2. トラブルシューティング**
 - **Three.js**: メモリリーク(dispose明示)とSEO限界(Prerender回避)を解決。
 - **コスト最適化**: GCP($35/月) → Railway($5/月) 移行で85%以上削減。
 - **認証構造改善**: GCPセッション消失解決のため、JWT(Stateless) + Refresh Token導入。
 - **決済安定性**: Redis LockとMongoDB Unique Indexで重複決済(Race Condition)を完全遮断。
 - **ドメイン問題**: Railway CNAME制約とAdMob ads.txt認証問題をCloudflare迂回で解決。
 - **iOS 日付**: `yyyy-mm-dd` パースエラー → `MM/DD/YYYY` ローカルフォーマットに変更して解決。
 
 </td>
 </tr>
 </table>
 
 <br>

---

## 주요 기술 하이라이트 / Key Technical Highlights / 主要技術ハイライト

<table>
<tr>
<td width="33%">

### 한국어

**1. 멀티 Provider 통합**

3개 Provider를 조합하여 안정성 확보

```javascript
Primary → Secondary → Tertiary
순으로 Fallback
한 Provider 실패해도
서비스 중단 없음
```

**2. 결제 시스템**

웹 PG 결제 + 모바일 인앱 결제를 모두 지원

```javascript
Redis Lock으로 중복 결제 방지
부분 환불, 웹훅 처리 등
복잡한 로직 구현
```

**3. TTL Index 활용**

MongoDB TTL Index로 데이터 자동 정리

```javascript
결제 방법별로 다른 보관 정책
GDPR 대응 +
스토리지 비용 절감
```

**4. Redis 안정성 강화**

모바일 앱의 백그라운드 전환에도 안정적인 Redis 연결

```javascript
Heartbeat + 자동 재연결
(지수 백오프)
포그라운드/백그라운드
상태별 다른 전략
```

</td>
<td width="33%">

### English

**1. Multi-Provider Integration**

Ensured stability by combining 3 providers

```javascript
Fallback chain:
Primary → Secondary → Tertiary
No service interruption
even if one provider fails
```

**2. Payment System**

Support for both web PG & mobile in-app payment

```javascript
Duplicate payment prevention
with Redis Lock
Complex logic: partial refunds,
webhook processing
```

**3. TTL Index Usage**

Automatic data cleanup with MongoDB TTL Index

```javascript
Different retention policies
per payment method
GDPR compliance +
storage cost reduction
```

**4. Redis Stability**

Stable Redis connection even with mobile app background transitions

```javascript
Heartbeat + auto-reconnection
(exponential backoff)
Different strategies for
foreground/background states
```

</td>
<td width="33%">

### 日本語

**1. マルチプロバイダー統合**

3 つのプロバイダーを組み合わせて安定性確保

```javascript
Fallback チェーン:
Primary → Secondary → Tertiary
1つのプロバイダーが失敗しても
サービス中断なし
```

**2. 決済システム**

Web PG 決済 + モバイルインアプ決済の両方をサポート

```javascript
Redis Lock で重複決済防止
部分返金、Webhook 処理など
複雑なロジック実装
```

**3. TTL Index 活用**

MongoDB TTL Index でデータ自動クリーンアップ

```javascript
決済方法別に異なる保管ポリシー
GDPR 対応 +
ストレージコスト削減
```

**4. Redis 安定性強化**

モバイルアプリのバックグラウンド切替でも安定的な Redis 接続

```javascript
Heartbeat + 自動再接続(指数バックオフ);
フォアグラウンド / バックグラウンド;
状態別異なる戦略;
```

</td>
</tr>
</table>

<br>

---

## 상세 문서 바로가기 / Detailed Docs / 詳細ドキュメント

- API 엔드포인트 문서 / API Endpoint Docs / API エンドポイントドキュメント [api/README.md](./api/README.md)
- 라우트 정리 (프론트·서버) / Routes Reference / ルート一覧 [ROUTES.md](./ROUTES.md)
- 데이터베이스 ERD / Database ERD / データベース ERD [database/ERD.md](./database/ERD.md)
- 환경 변수 명세 / Environment Variables / 環境変数 [devops/ENV_VARIABLES.md](./devops/ENV_VARIABLES.md)
- 배포 가이드 / Deployment Guide / デプロイガイド [devops/DEPLOYMENT.md](./devops/DEPLOYMENT.md)
- 기술적 의사결정 / Technical Decisions / 技術的意思決定 [technical-decisions/README.md](./technical-decisions/README.md)
