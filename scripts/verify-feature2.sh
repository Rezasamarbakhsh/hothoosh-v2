#!/bin/bash
# Feature 2 Verification Script
set -e
cd /home/z/my-project
echo "=== Feature 2 Auth Verification ==="

# Kill existing next dev
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start dev server
npx next dev -p 3000 > /tmp/nextdev.log 2>&1 &
DEV_PID=$!
echo "Dev server PID: $DEV_PID"

# Wait for ready
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/login 2>/dev/null | grep -q 200; then
    echo "Server ready after ${i}s"
    break
  fi
  sleep 1
done

echo ""
echo "=== Route Status ==="
for route in "/login" "/register" "/forgot-password" "/chat"; do
  CODE=$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:3000${route}")
  echo "  $route → $CODE"
done

echo ""
echo "=== Root redirect ==="
curl -s -o /dev/null -w "  / → %{http_code}\n" -L http://127.0.0.1:3000/

echo ""
echo "=== TypeScript ==="
npx tsc --noEmit 2>&1 | grep 'src/' || echo "  No TS errors in src/"

echo ""
echo "=== File Structure ==="
find src/app/'(auth)'/ src/app/'(workspace)'/ src/features/auth/ -type f | sort

echo ""
echo "=== Done ==="
trap "kill $DEV_PID 2>/dev/null" EXIT
