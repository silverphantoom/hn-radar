#!/bin/bash

# Auto-promotion script for HN Radar
# Run this daily at 8:30 AM CST

echo "📢 HN Radar Auto-Promotion - $(date)"

# Check if API server is running
if ! pgrep -f "node.*hn-radar.*server" > /dev/null; then
    echo "Starting HN Radar API server..."
    cd /root/.openclaw/workspace/projects/hn-radar/api
    nohup node server.js > ../server.log 2>&1 &
    sleep 2
fi

# Check subscriber count
SUBS=$(curl -s http://localhost:3000/api/subscribers/count 2>/dev/null | grep -o '"count":[0-9]*' | cut -d: -f2 || echo "0")
echo "Current subscribers: $SUBS"

# Log metrics
METRICS_FILE="/root/.openclaw/workspace/projects/hn-radar/metrics.json"
echo "{\"date\":\"$(date -Iseconds)\",\"subscribers\":$SUBS}" > $METRICS_FILE

echo "✅ Auto-promotion check complete"

# TODO: Add Twitter/LinkedIn posting when API keys available