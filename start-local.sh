#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
PORT="${1:-4173}"

cd "$ROOT_DIR"

echo "Starting local prototype site..."
echo "Root: $ROOT_DIR"
echo "URL:  http://localhost:${PORT}/local-links.html"
echo ""
echo "Press Ctrl+C to stop."

python3 -m http.server "$PORT"
