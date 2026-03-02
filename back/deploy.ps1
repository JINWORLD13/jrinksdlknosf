$ErrorActionPreference = "Stop"

# 새 버전 배포
Write-Host "배포 시작..." -ForegroundColor Green
gcloud app deploy --promote --stop-previous-version --quiet

# 최신 1개만 남기고 나머지 삭제
Write-Host "오래된 버전 정리 중..." -ForegroundColor Yellow
$versions = gcloud app versions list --service=default --format="value(version.id)" --sort-by="~version.createTime"
$oldVersions = $versions | Select-Object -Skip 1

if ($oldVersions) {
    foreach ($version in $oldVersions) {
        Write-Host "삭제 중: $version" -ForegroundColor Red
        gcloud app versions delete $version --service=default --quiet
    }
    Write-Host "정리 완료!" -ForegroundColor Green
} else {
    Write-Host "삭제할 오래된 버전이 없습니다." -ForegroundColor Cyan
}

# staging 버킷 정리
Write-Host "staging 버킷 정리 중..." -ForegroundColor Yellow
gsutil -m rm -r gs://staging.cosmos-tarot-2024.appspot.com/**
Write-Host "staging 버킷 정리 완료!" -ForegroundColor Green 

Write-Host "배포 완료!" -ForegroundColor Green