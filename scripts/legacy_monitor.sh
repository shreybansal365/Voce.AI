#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
OUT_DIR="${OUT_DIR:-./legacy-metrics}"
INTERVAL_SECONDS="${INTERVAL_SECONDS:-10}"
METRICS_BEARER_TOKEN="${METRICS_BEARER_TOKEN:-}"

mkdir -p "$OUT_DIR"

CSV="$OUT_DIR/metrics.csv"
if [[ ! -f "$CSV" ]]; then
  echo "timestamp,http_rps,ai_rps,ai_tokens_per_sec,heap_used_bytes" > "$CSV"
fi

echo "Legacy monitor running."
echo "BASE_URL=$BASE_URL"
echo "Writing to $CSV (every ${INTERVAL_SECONDS}s)"
echo "Stop with Ctrl+C"

while true; do
  ts="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"

  if [[ -n "$METRICS_BEARER_TOKEN" ]]; then
    metrics="$(curl -fsS -H "Authorization: Bearer $METRICS_BEARER_TOKEN" "$BASE_URL/api/metrics" || true)"
  else
    metrics="$(curl -fsS "$BASE_URL/api/metrics" || true)"
  fi
  if [[ -z "$metrics" ]]; then
    echo "$ts,0,0,0,0" >> "$CSV"
    sleep "$INTERVAL_SECONDS"
    continue
  fi

  http_total="$(echo "$metrics" | awk '$1=="voce_http_requests_total"{sum+=$2} END{print sum+0}')"
  ai_total="$(echo "$metrics" | awk '$1=="voce_ai_requests_total"{sum+=$2} END{print sum+0}')"
  ai_tokens_total="$(echo "$metrics" | awk '$1=="voce_ai_tokens_total"{sum+=$2} END{print sum+0}')"
  heap_used="$(echo "$metrics" | awk 'BEGIN{value=0} $1=="voce_process_heap_bytes"{value=$2} END{print value}')"

  state_file="$OUT_DIR/.state"
  if [[ -f "$state_file" ]]; then
    read -r prev_ts prev_http prev_ai prev_tokens < "$state_file" || true
  else
    prev_ts=0
    prev_http=0
    prev_ai=0
    prev_tokens=0
  fi

  now_s="$(date +%s)"
  if [[ "$prev_ts" -eq 0 ]]; then
    http_rps=0
    ai_rps=0
    tokens_ps=0
  else
    dt=$((now_s - prev_ts))
    if [[ "$dt" -le 0 ]]; then dt=1; fi
    http_rps="$(awk -v a="$http_total" -v b="$prev_http" -v dt="$dt" 'BEGIN{printf "%.3f",(a-b)/dt}')"
    ai_rps="$(awk -v a="$ai_total" -v b="$prev_ai" -v dt="$dt" 'BEGIN{printf "%.3f",(a-b)/dt}')"
    tokens_ps="$(awk -v a="$ai_tokens_total" -v b="$prev_tokens" -v dt="$dt" 'BEGIN{printf "%.3f",(a-b)/dt}')"
  fi

  echo "$now_s $http_total $ai_total $ai_tokens_total" > "$state_file"
  echo "$ts,$http_rps,$ai_rps,$tokens_ps,$heap_used" >> "$CSV"

  sleep "$INTERVAL_SECONDS"
done
