#!/bin/bash
# Metrics tracker — runs daily at 8 PM

echo "[$DATE] Collecting metrics..."

# Track server stats
echo "Server health check..."
curl -s http://72.61.5.158:8080/landing.html > /dev/null && echo "Landing page: UP" || echo "Landing page: DOWN"
curl -s http://72.61.5.158:3000/api/health > /dev/null && echo "API: UP" || echo "API: DOWN"
curl -s http://72.61.5.158:3001/api/health > /dev/null && echo "DevDashboard: UP" || echo "DevDashboard: DOWN"

# Log to metrics
echo "{\"date\": \"$DATE\", \"status\": \"collected\"}" >> /root/.openclaw/workspace/projects/hn-radar/metrics-log.jsonl

echo "[$DATE] Metrics logged"
