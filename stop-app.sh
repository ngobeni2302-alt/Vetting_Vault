#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$ROOT_DIR/.vettingvault-pids"

if [ ! -f "$PID_FILE" ]; then
  echo "No PID file found at $PID_FILE"
  echo "If the app is still running, stop it manually."
  exit 1
fi

stop_pid() {
  local name="$1"
  local pid="$2"

  if [ -z "$pid" ]; then
    return
  fi

  if kill -0 "$pid" >/dev/null 2>&1; then
    echo "Stopping $name (PID $pid)..."
    if ps -o sid= -p "$pid" >/dev/null 2>&1; then
      local sid
      sid="$(ps -o sid= -p "$pid" | tr -d ' ')"
      kill "-$sid" >/dev/null 2>&1 || kill "$pid"
    else
      kill "$pid"
    fi
  else
    echo "$name is not running (PID $pid not active)."
  fi
}

# shellcheck disable=SC1090
source "$PID_FILE"

stop_pid "backend" "${BACKEND_PID:-}"
stop_pid "frontend" "${FRONTEND_PID:-}"

rm -f "$PID_FILE"
echo "VettingVault services stopped."
