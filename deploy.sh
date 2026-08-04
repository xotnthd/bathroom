#!/bin/bash
# 배포 스크립트: 최신 코드 pull -> Docker 이미지 빌드 -> 기존 컨테이너 교체 실행
# 사용법: cd /opt/bathroom && ./deploy.sh
set -e

APP_DIR="/opt/bathroom"
IMAGE_NAME="bathroom-backend"
CONTAINER_NAME="bathroom-backend"

cd "$APP_DIR"

echo "==> [1/4] 최신 코드 받는 중..."
git pull origin master

echo "==> [2/4] Docker 이미지 빌드 중..."
docker build -t "$IMAGE_NAME" .

echo "==> [3/4] 기존 컨테이너 정리 중..."
docker stop "$CONTAINER_NAME" 2>/dev/null || true
docker rm "$CONTAINER_NAME" 2>/dev/null || true

echo "==> [4/4] 컨테이너 실행 중..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  --env-file "$APP_DIR/.env" \
  -p 8080:8080 \
  -v "$APP_DIR/uploads:/opt/bathroom/uploads" \
  "$IMAGE_NAME"

echo "==> 완료. 로그 확인: docker logs -f $CONTAINER_NAME"
