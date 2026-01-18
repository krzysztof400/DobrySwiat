#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

cleanup() {
  if [[ -n "${BACKEND_PID:-}" ]]; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then
    kill "$FRONTEND_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

cd "$BACKEND_DIR"
if command -v uv >/dev/null 2>&1; then
  uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
else
  python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
  BACKEND_PID=$!
fi

cd "$FRONTEND_DIR"
python -m http.server 5500 &
FRONTEND_PID=$!

wait
