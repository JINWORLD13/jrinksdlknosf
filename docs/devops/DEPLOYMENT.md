# 배포 가이드 / Deployment Guide / デプロイガイド

> Railway (Docker) 및 GCP App Engine 배포 프로세스

<br>

---

## 한눈에 보기 / Overview / 概要

<table>
<tr>
<td width="33%">

### 한국어

| 항목         | 내용                                  |
| ------------ | ------------------------------------- |
| **플랫폼**   | **Railway** (Docker) · GCP App Engine |
| **빌드**     | Dockerfile (Node.js 22)               |
| **런타임**   | Node.js 22                            |
| **헬스체크** | `/health`                             |
| **재시작**   | ON_FAILURE, 최대 10회                 |
| **HTTPS**    | 자동 발급                             |

</td>
<td width="33%">

### English

| Item             | Details                   |
| ---------------- | ------------------------- |
| **Platform**     | GCP App Engine (Standard) |
| **Runtime**      | Node.js 22                |
| **Instance**     | F1 (256MB RAM, 600MHz)    |
| **Auto Scaling** | 1-20 instances            |
| **Region**       | asia-northeast3 (Seoul)   |
| **HTTPS**        | Auto-provisioned          |
| **Monthly Cost** | ~$22                      |

</td>
<td width="33%">

### 日本語

| 項目                 | 詳細                                  |
| -------------------- | ------------------------------------- |
| **プラットフォーム** | **Railway** (Docker) · GCP App Engine |
| **ビルド**           | Dockerfile (Node.js 22)               |
| **ランタイム**       | Node.js 22                            |
| **ヘルスチェック**   | `/health`                             |
| **再起動**           | ON_FAILURE, 最大10回                  |
| **HTTPS**            | 自動発行                              |

</td>
</tr>
</table>

<br>

---

## 인프라 구성 / Infrastructure / インフラ構成

<table>
<tr>
<td width="33%">

#### 한국어

| 리소스            | 스펙           | 비용       |
| ----------------- | -------------- | ---------- |
| **App Engine**    | F1, 1개 상시   | $22/월     |
| **MongoDB Atlas** | M0 Free, 512MB | $0         |
| **Redis Cloud**   | 30MB Free      | $0         |
| **합계**          | -              | **$22/월** |

</td>
<td width="33%">

#### English

| Resource          | Spec            | Cost       |
| ----------------- | --------------- | ---------- |
| **App Engine**    | F1, 1 always-on | $22/mo     |
| **MongoDB Atlas** | M0 Free, 512MB  | $0         |
| **Redis Cloud**   | 30MB Free       | $0         |
| **Total**         | -               | **$22/mo** |

</td>
<td width="33%">

#### 日本語

| リソース          | スペック       | 費用       |
| ----------------- | -------------- | ---------- |
| **App Engine**    | F1, 1 個常時   | $22/月     |
| **MongoDB Atlas** | M0 Free, 512MB | $0         |
| **Redis Cloud**   | 30MB Free      | $0         |
| **合計**          | -              | **$22/月** |

</td>
</tr>
</table>

<br>

---

## 배포 프로세스 / Deployment Process / デプロイプロセス

<table>
<tr>
<td width="33%">

### 한국어

```bash
# 1. 빌드
npm run build

# 2. 배포
gcloud app deploy

# 3. 확인
curl /health
```

</td>
<td width="33%">

### English

```bash
# 1. Build
npm run build

# 2. Deploy
gcloud app deploy

# 3. Verify
curl /health
```

</td>
<td width="33%">

### 日本語

```bash
# 1. ビルド
npm run build

# 2. デプロイ
gcloud app deploy

# 3. 確認
curl /health
```

</td>
</tr>
</table>

<table>
<tr>
<td width="33%">

### 한국어

**배포 스크립트:**

```bash
# Linux/Mac
./deploy.sh

# Windows
.\deploy.ps1
```

</td>
<td width="33%">

### English

**Deploy Scripts:**

```bash
# Linux/Mac
./deploy.sh

# Windows
.\deploy.ps1
```

</td>
<td width="33%">

### 日本語

**デプロイスクリプト:**

```bash
# Linux/Mac
./deploy.sh

# Windows
.\deploy.ps1
```

</td>
</tr>
</table>

<br>

---

## Railway 배포 / Railway Deploy / Railway デプロイ

<table>
<tr>
<td width="33%">

### 한국어

**방식:** Git Push 시 자동 배포 (Dockerfile 빌드)

| 항목           | 내용                |
| -------------- | ------------------- |
| **빌드**       | `back/Dockerfile`   |
| **설정**       | `back/railway.json` |
| **시작 명령**  | `node server.js`    |
| **헬스체크**   | `/health` (300초)   |
| **재시작**     | ON_FAILURE, 최대 10회 |
| **환경 변수**  | Railway 대시보드에서 설정 |

```bash
# 1. 커밋 후 푸시 (자동 배포 트리거)
git add . && git commit -m "deploy" && git push

# 2. 배포 후 확인
curl https://<your-app>.railway.app/health
```

</td>
<td width="33%">

### English

**Method:** Auto-deploy on Git Push (Dockerfile build)

| Item           | Details              |
| -------------- | -------------------- |
| **Build**      | `back/Dockerfile`    |
| **Config**     | `back/railway.json`  |
| **Start**      | `node server.js`     |
| **Health**     | `/health` (300s)     |
| **Restart**    | ON_FAILURE, max 10   |
| **Env vars**   | Set in Railway dashboard |

```bash
# 1. Commit and push (triggers deploy)
git add . && git commit -m "deploy" && git push

# 2. Verify after deploy
curl https://<your-app>.railway.app/health
```

</td>
<td width="33%">

### 日本語

**方式:** Git Push で自動デプロイ (Dockerfile ビルド)

| 項目           | 内容                  |
| -------------- | --------------------- |
| **ビルド**     | `back/Dockerfile`     |
| **設定**       | `back/railway.json`   |
| **起動**       | `node server.js`      |
| **ヘルス**     | `/health` (300秒)      |
| **再起動**     | ON_FAILURE, 最大10回  |
| **環境変数**   | Railway ダッシュボードで設定 |

```bash
# 1. コミットしてプッシュ (デプロイ開始)
git add . && git commit -m "deploy" && git push

# 2. デプロイ後確認
curl https://<your-app>.railway.app/health
```

</td>
</tr>
</table>

<br>

---

## Auto Scaling 설정 / Configuration / 設定

<table>
<tr>
<td width="33%">

### 한국어

| 설정                 | 값  | 효과             |
| -------------------- | --- | ---------------- |
| `min_idle_instances` | 1   | Cold Start 방지  |
| `max_instances`      | 20  | 트래픽 급증 대응 |
| `instance_class`     | F1  | 비용 최적화      |

</td>
<td width="33%">

### English

| Setting              | Value | Effect                |
| -------------------- | ----- | --------------------- |
| `min_idle_instances` | 1     | Prevent Cold Start    |
| `max_instances`      | 20    | Handle traffic spikes |
| `instance_class`     | F1    | Cost optimization     |

</td>
<td width="33%">

### 日本語

| 設定                 | 値  | 効果                 |
| -------------------- | --- | -------------------- |
| `min_idle_instances` | 1   | Cold Start 防止      |
| `max_instances`      | 20  | トラフィック急増対応 |
| `instance_class`     | F1  | コスト最適化         |

</td>
</tr>
</table>

<br>

---

## 모니터링 / Monitoring / モニタリング

<table>
<tr>
<td width="33%">

### 한국어

**GCP Console 지표:**

- 요청 수 (QPS)
- 응답 시간 (Latency)
- 에러율
- 인스턴스 수

**로그 확인:**

```bash
# 실시간 로그
gcloud app logs tail -s default

# 에러만 필터링
gcloud app logs tail -s default | grep ERROR
```

</td>
<td width="33%">

### English

**GCP Console Metrics:**

- Request count (QPS)
- Response time (Latency)
- Error rate
- Instance count

**Check Logs:**

```bash
# Real-time logs
gcloud app logs tail -s default

# Filter errors only
gcloud app logs tail -s default | grep ERROR
```

</td>
<td width="33%">

### 日本語

**GCP Console 指標:**

- リクエスト数（QPS）
- レスポンス時間（Latency）
- エラー率
- インスタンス数

**ログ確認:**

```bash
# リアルタイムログ
gcloud app logs tail -s default

# エラーのみフィルタリング
gcloud app logs tail -s default | grep ERROR
```

</td>
</tr>
</table>

<br>

---

## 롤백 전략 / Rollback Strategy / ロールバック戦略

<table>
<tr>
<td width="33%">

### 한국어

```bash
# 버전 목록 확인
gcloud app versions list

# 이전 버전으로 롤백
gcloud app services set-traffic default \
  --splits v2=1.0
```

</td>
<td width="33%">

### English

```bash
# List versions
gcloud app versions list

# Rollback to previous version
gcloud app services set-traffic default \
  --splits v2=1.0
```

</td>
<td width="33%">

### 日本語

```bash
# バージョンリスト確認
gcloud app versions list

# 以前のバージョンにロールバック
gcloud app services set-traffic default \
  --splits v2=1.0
```

</td>
</tr>
</table>

<br>

---

## 트러블슈팅 / Troubleshooting / トラブルシューティング

<table>
<tr>
<td width="33%">

#### 한국어

| 문제                  | 해결                         |
| --------------------- | ---------------------------- |
| **배포 실패 (403)**   | `gcloud auth login` 재인증   |
| **Cold Start 지연**   | `min_idle_instances: 1` 설정 |
| **MongoDB 연결 끊김** | IP 화이트리스트 추가         |
| **Redis 재연결 실패** | 자동 재연결 로직 구현        |

</td>
<td width="33%">

#### English

| Issue                      | Solution                            |
| -------------------------- | ----------------------------------- |
| **Deploy Failed (403)**    | Re-authenticate `gcloud auth login` |
| **Cold Start Delay**       | Set `min_idle_instances: 1`         |
| **MongoDB Disconnected**   | Add IP to whitelist                 |
| **Redis Reconnect Failed** | Implement auto-reconnect logic      |

</td>
<td width="33%">

#### 日本語

| 問題                    | 解決                         |
| ----------------------- | ---------------------------- |
| **デプロイ失敗（403）** | `gcloud auth login` 再認証   |
| **Cold Start 遅延**     | `min_idle_instances: 1` 設定 |
| **MongoDB 接続切断**    | IP ホワイトリストに追加      |
| **Redis 再接続失敗**    | 自動再接続ロジック実装       |

</td>
</tr>
</table>

<br>

---

<details>
<summary><b>📖 상세 배포 가이드 보기 / Detailed Deployment Guide / 詳細デプロイガイド</b></summary>

## 인프라 아키텍처 / Infrastructure Architecture / インフラアーキテクチャ

```
Internet (HTTPS)
    ↓
Custom Domain (DNS)
    ↓
GCP App Engine
├── Express API Server
├── React SPA (정적 파일 / Static Files / 静的ファイル)
└── Cloud Pub/Sub (웹훅 / Webhook / Webhook)
    ↓
External Services
├── MongoDB Atlas
├── Redis Cloud
├── Payment PG
└── Mobile Store
```

---

## 배포 환경 / Deployment Environment / デプロイ環境

<table>
<tr>
<td width="33%">

### 한국어

| 환경     | URL              | 설정 파일  |
| -------- | ---------------- | ---------- |
| **개발** | `localhost:8080` | `.env`     |
| **운영** | `mydomain.com`   | `app.yaml` |

</td>
<td width="33%">

### English

| Environment | URL              | Config File |
| ----------- | ---------------- | ----------- |
| **Dev**     | `localhost:8080` | `.env`      |
| **Prod**    | `mydomain.com`   | `app.yaml`  |

</td>
<td width="33%">

### 日本語

| 環境     | URL              | 設定ファイル |
| -------- | ---------------- | ------------ |
| **開発** | `localhost:8080` | `.env`       |
| **本番** | `mydomain.com`   | `app.yaml`   |

</td>
</tr>
</table>

---

## 배포 명령어 / Deployment Commands / デプロイコマンド

<table>
<tr>
<td width="33%">

### 한국어

**수동 배포:**

```bash
cd back
gcloud app deploy app.yaml \
  --project=my-gcp-project-id
```

**배포 스크립트 (deploy.sh):**

```bash
#!/bin/bash
echo "🚀 Starting deployment..."

cd front
npm run build

cd ..
gcloud app deploy app.yaml \
  --project=my-gcp-project-id \
  --quiet

echo "✅ Deployment complete!"
```

</td>
<td width="33%">

### English

**Manual Deploy:**

```bash
cd back
gcloud app deploy app.yaml \
  --project=my-gcp-project-id
```

**Deploy Script (deploy.sh):**

```bash
#!/bin/bash
echo "🚀 Starting deployment..."

cd front
npm run build

cd ..
gcloud app deploy app.yaml \
  --project=my-gcp-project-id \
  --quiet

echo "✅ Deployment complete!"
```

</td>
<td width="33%">

### 日本語

**手動デプロイ:**

```bash
cd back
gcloud app deploy app.yaml \
  --project=my-gcp-project-id
```

**デプロイスクリプト (deploy.sh):**

```bash
#!/bin/bash
echo "🚀 Starting deployment..."

cd front
npm run build

cd ..
gcloud app deploy app.yaml \
  --project=my-gcp-project-id \
  --quiet

echo "✅ Deployment complete!"
```

</td>
</tr>
</table>

---

## Auto Scaling 상세 설정 / Auto Scaling Configuration / Auto Scaling 詳細設定

```yaml
instance_class: F1

automatic_scaling:
  min_idle_instances: 1 # 항상 1개 대기 / Always 1 ready / 常に 1 個待機
  max_instances: 20 # 최대 20개 / Max 20 / 最大 20 個
```

<table>
<tr>
<td width="33%">

### 한국어

**효과:**

- ✅ Cold Start 거의 제거
- ✅ 트래픽 급증 시 자동 확장
- ✅ 유휴 시 비용 절감

</td>
<td width="33%">

### English

**Benefits:**

- ✅ Almost eliminates Cold Start
- ✅ Auto-scales on traffic spikes
- ✅ Cost savings when idle

</td>
<td width="33%">

### 日本語

**効果:**

- ✅ Cold Start ほぼ除去
- ✅ トラフィック急増時に自動拡張
- ✅ アイドル時にコスト削減

</td>
</tr>
</table>

---

## 정적 파일 처리 / Static File Handling / 静的ファイル処理

### app.yaml 설정 / Configuration / 設定

```yaml
handlers:
  # SEO 파일 우선 처리 / SEO files first / SEO ファイル優先処理
  - url: /robots\.txt
    static_files: front/dist/robots.txt

  # JS/CSS/이미지 / JS/CSS/Images / JS/CSS/画像
  - url: /(.*\.(js|css|png|jpg))$
    static_files: front/dist/\1

  # SPA 라우팅 / SPA Routing / SPA ルーティング
  - url: /.*
    script: auto
    secure: always
```

<table>
<tr>
<td width="33%">

### 한국어

**장점:**

- ✅ App Engine이 직접 서빙 (빠름)
- ✅ Node.js 서버 부하 감소
- ✅ CDN 캐싱 자동 적용

</td>
<td width="33%">

### English

**Benefits:**

- ✅ Served directly by App Engine (fast)
- ✅ Reduces Node.js server load
- ✅ Auto CDN caching

</td>
<td width="33%">

### 日本語

**利点:**

- ✅ App Engine が直接サーブ（高速）
- ✅ Node.js サーバー負荷軽減
- ✅ CDN キャッシング自動適用

</td>
</tr>
</table>

---

## HTTPS 및 도메인 / HTTPS & Domain / HTTPS とドメイン

<table>
<tr>
<td width="33%">

### 한국어

**커스텀 도메인 연결:**

```bash
gcloud app domain-mappings create \
  mydomain.com
```

**DNS 설정:**

```
A Record:
  Host: @
  Points to: [GCP App Engine IP]

CNAME Record:
  Host: www
  Points to: ghs.googlehosted.com
```

**SSL 인증서:**

- GCP가 Let's Encrypt로 자동 발급
- 갱신도 자동 처리
- HTTP → HTTPS 강제 리다이렉트

</td>
<td width="33%">

### English

**Custom Domain Mapping:**

```bash
gcloud app domain-mappings create \
  mydomain.com
```

**DNS Configuration:**

```
A Record:
  Host: @
  Points to: [GCP App Engine IP]

CNAME Record:
  Host: www
  Points to: ghs.googlehosted.com
```

**SSL Certificate:**

- Auto-issued by GCP via Let's Encrypt
- Auto-renewal
- Enforced HTTP → HTTPS redirect

</td>
<td width="33%">

### 日本語

**カスタムドメイン接続:**

```bash
gcloud app domain-mappings create \
  mydomain.com
```

**DNS 設定:**

```
A Record:
  Host: @
  Points to: [GCP App Engine IP]

CNAME Record:
  Host: www
  Points to: ghs.googlehosted.com
```

**SSL 証明書:**

- GCP が Let's Encrypt で自動発行
- 更新も自動処理
- HTTP → HTTPS 強制リダイレクト

</td>
</tr>
</table>

---

## CI/CD 파이프라인 (향후 계획) / CI/CD Pipeline (Planned) / CI/CD パイプライン（今後の計画）

```yaml
# .github/workflows/deploy.yml
name: Deploy to GCP

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Build Frontend
        run: |
          cd back/front
          npm ci
          npm run build

      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: my-gcp-project-id

      - name: Deploy to App Engine
        run: |
          cd back
          gcloud app deploy app.yaml --project=my-gcp-project-id --quiet
```

---

## 비용 최적화 / Cost Optimization / コスト最適化

<table>
<tr>
<td width="33%">

### 한국어

| 항목            | 스펙      | 월 비용 |
| --------------- | --------- | ------- |
| App Engine (F1) | 1개 상시  | $22     |
| MongoDB Atlas   | M0 Free   | $0      |
| Redis Cloud     | 30MB Free | $0      |
| **합계**        | -         | **$22** |

**절감 팁:**

1. Auto Scaling 조정 (트래픽 패턴 분석)
2. 정적 파일 CDN 활용
3. Redis 캐싱으로 DB 쿼리 감소

</td>
<td width="33%">

### English

| Item            | Spec      | Monthly |
| --------------- | --------- | ------- |
| App Engine (F1) | 1 always  | $22     |
| MongoDB Atlas   | M0 Free   | $0      |
| Redis Cloud     | 30MB Free | $0      |
| **Total**       | -         | **$22** |

**Cost-Saving Tips:**

1. Adjust Auto Scaling (analyze traffic patterns)
2. Utilize CDN for static files
3. Reduce DB queries with Redis caching

</td>
<td width="33%">

### 日本語

| 項目            | スペック  | 月額    |
| --------------- | --------- | ------- |
| App Engine (F1) | 1 個常時  | $22     |
| MongoDB Atlas   | M0 Free   | $0      |
| Redis Cloud     | 30MB Free | $0      |
| **合計**        | -         | **$22** |

**コスト削減のヒント:**

1. Auto Scaling 調整（トラフィックパターン分析）
2. 静的ファイル CDN 活用
3. Redis キャッシングで DB クエリ削減

</td>
</tr>
</table>

---

## 장애 대응 / Incident Response / 障害対応

<table>
<tr>
<td width="33%">

### 한국어

**서비스 다운 시:**

```bash
# 1. 헬스체크
curl https://mydomain.com/health

# 2. 로그 확인
gcloud app logs tail -s default | grep ERROR

# 3. 인스턴스 상태
gcloud app instances list

# 4. 긴급 롤백
gcloud app services set-traffic default \
  --splits v2=1.0
```

</td>
<td width="33%">

### English

**When Service is Down:**

```bash
# 1. Health Check
curl https://mydomain.com/health

# 2. Check Logs
gcloud app logs tail -s default | grep ERROR

# 3. Instance Status
gcloud app instances list

# 4. Emergency Rollback
gcloud app services set-traffic default \
  --splits v2=1.0
```

</td>
<td width="33%">

### 日本語

**サービスダウン時:**

```bash
# 1. ヘルスチェック
curl https://mydomain.com/health

# 2. ログ確認
gcloud app logs tail -s default | grep ERROR

# 3. インスタンス状態
gcloud app instances list

# 4. 緊急ロールバック
gcloud app services set-traffic default \
  --splits v2=1.0
```

</td>
</tr>
</table>

</details>

<br>

---

<div align="center">

**코드 위치:** `back/railway.json`, `back/Dockerfile`, `back/deploy.sh`, `back/app.yaml` (GCP용)

[← 문서 홈으로](../README.md)

</div>
