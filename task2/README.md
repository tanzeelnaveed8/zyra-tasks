# Counselor Student Action Center — Task 2 (Production Readiness)

Extends Task 1 with backend observability, error handling, and a full test suite.

## What's New in Task 2

| Addition | Detail |
|---|---|
| Request logging | `morgan` logs every request with method, URL, status, response time, and request ID |
| Request IDs | Every request gets a UUID via `crypto.randomUUID()` — attached to `req`, returned as `X-Request-ID` header, and included in error responses |
| Error middleware | Centralized Express error handler catches unhandled errors and returns consistent JSON with the request ID |
| Backend integration tests | 11 tests covering happy paths, error paths, data integrity, and header assertions |
| Frontend component tests | 9 tests for `PriorityBadge`, `UrgencyBadge`, and `MessagesPanel` using Vitest + Testing Library |

---

## Setup & Run

### Prerequisites

- Node.js 18+

### Backend

```bash
cd backend
npm install
npm run dev      # dev server on http://localhost:3001
npm test         # run integration tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev      # Vite dev server on http://localhost:5173
npm test         # run component tests
```

---

## API Contract

### GET `/students/:id/action-center`

Returns student profile, tasks, messages, unread count, and urgency level.

**Headers returned:** `X-Request-ID: <uuid>`

**Response:**
```json
{
  "student": { "id": "stu_001", "name": "Maya Patel", "enrollmentStatus": "at_risk", ... },
  "tasks": [...],
  "messages": [...],
  "unreadMessagesCount": 2,
  "urgencyLevel": "critical"
}
```

**Error (404):**
```json
{ "error": "Student not found", "requestId": "<uuid>" }
```

---

### PATCH `/tasks/:taskId/status`

Updates a task's status.

**Body:** `{ "status": "todo" | "in_progress" | "completed" }`

**Response:** `{ "task": { ...updated task } }`

**Error (400):**
```json
{ "error": "Invalid status. Must be one of: todo, in_progress, completed", "requestId": "<uuid>" }
```

---

## Performance Decisions & Tradeoffs

### In-memory data store

**Decision:** Mock data arrays are mutated in place; no database.

**Tradeoff:** Zero latency, zero setup — ideal for a prototype assessment. In production, this would be replaced with a database (PostgreSQL + Prisma). State resets on server restart, and concurrent writes have no transaction safety.

### Urgency computed server-side

**Decision:** The urgency level is computed in the API handler, not the frontend.

**Tradeoff:** This keeps the frontend purely presentational and makes the logic reusable by other consumers (mobile app, email notifications, webhooks). The cost is a tiny amount of compute per request — acceptable because the calculation is O(n) over a small array and adds < 1ms.

### No caching layer

**Decision:** No Redis or in-memory cache for responses.

**Tradeoff:** For this scale (3 students, < 20 tasks) a cache would be premature optimisation. In production with many counselors polling frequently, a short-lived cache (5–30s TTL) on the action-center endpoint would cut database load significantly.

### morgan for logging (not a structured logger)

**Decision:** Used `morgan` for HTTP-level logging rather than a structured logger like `pino` or `winston`.

**Tradeoff:** `morgan` is zero-config and human-readable, which is great for development. In production you'd want structured JSON logs (so they're parseable by Datadog, CloudWatch, etc.) — `pino` with `pino-http` would be the upgrade path. The `X-Request-ID` header is already included in every log line, so correlation across services is already possible.

### Vitest over Jest for frontend tests

**Decision:** Used Vitest instead of Jest for frontend tests.

**Tradeoff:** Vitest shares the Vite config, so there's no separate Babel/Jest transform setup. It's significantly faster in watch mode. The API is compatible with Jest, so migrating if needed is trivial.

### supertest + jest for backend integration tests

**Decision:** Integration tests hit the actual Express app via `supertest` (no mocking).

**Tradeoff:** Tests are slower than unit tests but they verify the full request pipeline — middleware, routing, data, and response shape — in one shot. This is more valuable here than isolated unit tests because the risk surface is in how the layers compose.
