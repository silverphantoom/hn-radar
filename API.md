# HN Radar — API Documentation

## Base URL
`http://72.61.5.158:3000`

## Endpoints

### POST /api/subscribe
Subscribe a new user

**Request:**
```json
{
  "email": "user@example.com",
  "tier": "free"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

### GET /api/stats
Get subscriber stats

**Response:**
```json
{
  "total_subscribers": 42,
  "pro_subscribers": 5,
  "free_subscribers": 37,
  "mrr": 60
}
```

### GET /api/health
Health check

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T20:53:00Z"
}
```

## Pro Tier API (Coming Soon)

### GET /api/opportunities
Get full opportunity list with deep analysis

### GET /api/github-trending
Get GitHub trending repos

### GET /api/reports/weekly
Get weekly deep-dive report

---

*API for Pro subscribers only*
