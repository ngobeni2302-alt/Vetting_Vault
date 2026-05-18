#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
LOG_DIR="$ROOT_DIR/.run-logs"
PID_FILE="$ROOT_DIR/.vettingvault-pids"
APP_URL="http://localhost:5173"

mkdir -p "$LOG_DIR"

require_command() {
  local cmd="$1"
  if ! command -v "$cmd" >/dev/null 2>&1; then
    echo "Missing required command: $cmd" >&2
    exit 1
  fi
}

is_port_open() {
  local port="$1"
  (echo >"/dev/tcp/127.0.0.1/$port") >/dev/null 2>&1
}

wait_for_port() {
  local port="$1"
  local name="$2"
  local attempts=90

  for _ in $(seq 1 "$attempts"); do
    if is_port_open "$port"; then
      echo "$name is ready on port $port."
      return 0
    fi
    sleep 1
  done

  echo "$name did not start on port $port in time." >&2
  exit 1
}

open_browser() {
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$APP_URL" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then
    open "$APP_URL" >/dev/null 2>&1 &
  elif command -v start >/dev/null 2>&1; then
    start "$APP_URL" >/dev/null 2>&1 &
  else
    echo "Open $APP_URL in your browser."
  fi
}

start_backend() {
  if is_port_open 8080; then
    echo "Backend already appears to be running on port 8080."
    return
  fi

  echo "Starting backend..."
  (
    cd "$BACKEND_DIR"
    mvn spring-boot:run
  ) >"$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
}

start_frontend() {
  if is_port_open 5173; then
    echo "Frontend already appears to be running on port 5173."
    return
  fi

  echo "Installing frontend dependencies if needed..."
  (
    cd "$FRONTEND_DIR"
    if [ ! -d node_modules ]; then
      npm install
    fi
  ) >"$LOG_DIR/frontend-install.log" 2>&1

  echo "Starting frontend..."
  (
    cd "$FRONTEND_DIR"
    npm run dev -- --host 127.0.0.1
  ) >"$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
}

write_pid_file() {
  : >"$PID_FILE"
  if [ "${BACKEND_PID:-}" != "" ]; then
    echo "BACKEND_PID=$BACKEND_PID" >>"$PID_FILE"
  fi
  if [ "${FRONTEND_PID:-}" != "" ]; then
    echo "FRONTEND_PID=$FRONTEND_PID" >>"$PID_FILE"
  fi
}

require_command mvn
require_command npm

start_backend
start_frontend
write_pid_file

wait_for_port 8080 "Backend"
wait_for_port 5173 "Frontend"

echo "Opening VettingVault at $APP_URL"
open_browser

echo "Logs:"
echo "  Backend:  $LOG_DIR/backend.log"
echo "  Frontend: $LOG_DIR/frontend.log"
if [ -f "$LOG_DIR/frontend-install.log" ]; then
  echo "  Install:  $LOG_DIR/frontend-install.log"
fi
