# Counselor Student Action Center

A mini full-stack feature that helps a school counselor quickly understand a student's priorities, tasks, unread messages, and urgency level.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript

---

## Setup & Run

### Prerequisites

- Node.js 18+
- npm 9+

### Backend

```bash
cd backend
npm install
npm run dev
```

Server starts at **http://localhost:3001**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at **http://localhost:5173**

---

## API Contract

### GET `/students/:id/action-center`

Returns a student's full action center data.

**Path params:** `id` — student ID (`stu_001`, `stu_002`, `stu_003`)

**Response:**
```json
{
  "student": {
    "id": "stu_001",
    "name": "Maya Patel",
    "email": "maya.patel@school.edu",
    "grade": 11,
    "gpa": 3.2,
    "counselorId": "csl_001",
    "enrollmentStatus": "at_risk"
  },
  "tasks": [...],
  "messages": [...],
  "unreadMessagesCount": 2,
  "urgencyLevel": "critical"
}
```

**Urgency level logic:**
| Condition | Level |
|---|---|
| Urgent/overdue tasks + `at_risk` enrollment | `critical` |
| Urgent tasks or overdue + high priority | `high` |
| High priority tasks or `at_risk` enrollment | `medium` |
| Otherwise | `low` |

**Error responses:** `404` if student not found.

---

### PATCH `/tasks/:taskId/status`

Updates the status of a task.

**Path params:** `taskId` — task ID (e.g. `tsk_001`)

**Request body:**
```json
{ "status": "in_progress" }
```

Valid statuses: `todo`, `in_progress`, `completed`

**Response:**
```json
{
  "task": { ...updated task object... }
}
```

**Error responses:** `400` for invalid status, `404` if task not found.

---

## Architecture Note

The project follows a simple **two-app monorepo** layout:

```
task 1/
├── backend/    # Express REST API
└── frontend/   # React SPA
```

**Backend** is a stateless Express server with in-memory data (the mock data arrays are mutated directly for task status updates — appropriate for a prototype). Routes are split by resource (`/students`, `/tasks`). Urgency level is computed server-side from task priorities and enrollment status so the frontend stays presentational.

**Frontend** is a single-page React app with no routing library needed (only one view). State lives in `ActionCenter.tsx` — the top-level page component fetches data on student selection and passes slices down to `StudentProfile`, `TaskList`, and `MessagesPanel`. Task status updates are optimistic: the UI updates immediately from the API response without re-fetching the full dataset. Loading and error states are handled at the page level with a retry mechanism.
