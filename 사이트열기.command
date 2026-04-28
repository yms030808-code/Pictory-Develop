#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-4173}"
URL="http://localhost:${PORT}/local-links.html"

cd "$ROOT_DIR"

echo "Pictory 로컬 사이트를 시작합니다..."
echo "경로: $ROOT_DIR"
echo "주소: $URL"
echo ""

if ! command -v python3 >/dev/null 2>&1; then
  echo "[오류] python3를 찾을 수 없습니다."
  echo "macOS에서 python3 설치 후 다시 실행해 주세요."
  read -r -p "엔터를 누르면 종료합니다."
  exit 1
fi

sleep 0.5
open "$URL" || true
echo "브라우저가 자동으로 열리지 않으면 위 주소를 직접 열어 주세요."
echo "종료하려면 이 창에서 Ctrl+C 를 누르세요."
echo ""

python3 -m http.server "$PORT"
