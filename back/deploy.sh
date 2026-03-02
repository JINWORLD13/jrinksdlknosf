#!/bin/bash

# 새 버전 배포
echo "배포 시작..."
gcloud app deploy --promote --stop-previous-version --quiet

# 현재 트래픽 받는 버전 확인
CURRENT_VERSION=$(gcloud app versions list --service=default --filter="TRAFFIC_SPLIT=1" --format="value(VERSION.ID)")

# 해당 버전 제외하고 모두 삭제
gcloud app versions list --service=default --format="value(VERSION.ID)" | grep -v "$CURRENT_VERSION" | xargs gcloud app versions delete --service=default --quiet