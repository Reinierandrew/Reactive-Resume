#!/bin/bash
# Start Chrome with remote debugging for PDF generation

# Kill any existing Chrome instances on port 9222
lsof -ti:9222 | xargs kill -9 2>/dev/null || true

# Start Chrome with remote debugging
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --remote-debugging-port=9222 \
  --headless \
  --disable-gpu \
  --no-sandbox \
  > /dev/null 2>&1 &

echo "Chrome started on port 9222 for PDF generation"
echo "PID: $!"

