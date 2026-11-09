# CampusX — Campus Competitive Learning & Skill Benchmarking System

A medium-scope, runnable implementation of the main student/faculty workflow from the project synopsis. The React interface keeps the CampusX visual design; the backend now provides authenticated APIs for contests, participation, submissions, evaluation records, leaderboard and personal analytics.

## Implemented in this build

- JWT login with seeded demo roles; BCrypt password hashing.
- JWT request filter and role checks for faculty/admin contest creation.
- Contest list, details, create and join endpoints.
- Student source submission with a stored evaluation result.
- Overall leaderboard calculated from recorded scores.
- Subject-wise student analytics and submission history.
- Learning Studio with embedded public videos and locally saved lesson-completion state.
- Demo contests seeded automatically on a fresh database.
- Local H2 mode and Docker Compose PostgreSQL mode.
- Dockerfiles for frontend and backend.

## Run locally (Windows / VS Code)

### One-click startup

Double-click `START_CAMPUSX.bat` in the project root. It opens separate terminal windows for Spring Boot and Vite. Keep both windows open while using the app.

If this is the first run, make sure Java 17+ (for the backend), Maven, and Node.js 20.19+ (or 22.12+) are installed. The frontend script runs `npm install` automatically if `frontend/node_modules` is missing.

### Manual startup

Open two terminals in the project root.

### Terminal 1 — backend

```powershell
cd backend
mvn spring-boot:run
```

Backend: `http://localhost:8080`

Local mode uses a file-based H2 database at `backend/data/campusdb`. Existing data is retained between restarts. To reset the demo database, stop the backend and back up/delete the `backend/data/campusdb.mv.db` file before starting again.

### Terminal 2 — frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Run with Docker (persistent PostgreSQL)

From the project root:

```powershell
docker compose up --build
```

Open `http://localhost:5173`. The PostgreSQL data is stored in the `campusx-postgres` Docker volume. Stop the stack with `Ctrl+C`, then `docker compose down`; use `docker compose down -v` only if you intentionally want to delete the database volume.

The compose file uses demo-only local credentials. Change database credentials and `JWT_SECRET` before any public deployment.

## First-time setup and roles

1. Start the backend and frontend using the included `START_CAMPUSX.bat` (or follow the manual steps below).
2. Sign in with one of the seeded demo accounts listed below. This version currently provides seeded demo accounts; a public self-registration screen/API is not included.
3. Students can browse contests, join them, submit source and see their own analytics.
4. Contest creation is restricted to `FACULTY` and `ADMIN` roles.

### Demo login accounts

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `Admin@123` |
| Faculty | `faculty1` | `Faculty@123` |
| Faculty | `faculty2` | `Faculty@123` |
| Student | `student1` | `Student@123` |
| Student | `student2` | `Student@123` |
| Student | `student3` | `Student@123` |
| Student | `student4` | `Student@123` |
| Student | `student5` | `Student@123` |

These accounts are inserted by `DemoDataInitializer` when the database is first initialized. If you already have a database with these usernames, use the same passwords that were set when they were first created.

### Promote a local demo account to Faculty

For local H2 development only, open `http://localhost:8080/h2-console` and connect with:

- JDBC URL: `jdbc:h2:file:./data/campusdb`
- User: `sa`
- Password: (blank)

Run this SQL to promote an existing demo account:

```sql
UPDATE users SET role = 'FACULTY' WHERE username = 'your_username';
```

Log out and sign in again so the next JWT contains the updated role.

For Docker/PostgreSQL, use:

```powershell
docker compose exec database psql -U campusx -d campusx -c "UPDATE users SET role='FACULTY' WHERE username='your_username';"
```

## Main API routes

All routes below except `/api/auth/**` require `Authorization: Bearer <JWT>`.

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/login` | Obtain JWT and role |
| GET | `/api/contests` | List contests and current user's join state |
| GET | `/api/contests/{id}` | Contest details |
| POST | `/api/contests` | Faculty/Admin creates a contest |
| POST | `/api/contests/{id}/join` | Student joins a contest |
| POST | `/api/contests/{id}/submissions` | Submit source for demo evaluation |
| GET | `/api/submissions/mine` | Current user's submission history |
| GET | `/api/leaderboard` | Overall points leaderboard |
| GET | `/api/analytics/mine` | Current user's score and subject averages |

## Evaluation and architecture notes — important for demo/viva

This version is a **modular Spring Boot application**, not seven independently deployed microservices yet. It implements the central workflow in one backend so it remains manageable for a student project demo. PostgreSQL is available through Docker Compose; H2 is used for quick local development.

The evaluation endpoint currently applies a transparent source-structure rubric and stores the score. It deliberately does **not** execute arbitrary student code on the web server. A production online judge needs isolated containers/sandboxes, test-case management, CPU/memory/time limits, and asynchronous workers. Kafka/RabbitMQ, Redis sorted sets, STOMP/WebSocket live pushes, separate service databases, load testing and fault-tolerance are documented next-stage integrations, not claimed as implemented in this package.

Leaderboard and analytics are database-backed but fetched when the dashboard loads/refreshes; they are not push-based real-time streams. Lesson completion is browser-local. The video URLs are public educational embeds and can be replaced with faculty-approved material.

## Suggested demo sequence

1. Register/sign in as Student.
2. Open Contests → join a challenge → paste a short code sample → submit.
3. Show the returned evaluation score and submission history.
4. Open My Progress and show subject-wise score aggregation.
5. Open Leaderboard and show score aggregation across accounts.
6. Promote a second account to Faculty using the SQL above, sign in as Faculty, and publish a contest.
7. Open Learning Studio and play an embedded lesson.

## Troubleshooting

- If a terminal is already in `frontend`, run `npm run dev` directly; do not run `cd frontend` again.
- If a terminal is already in `backend`, run `mvn spring-boot:run` directly; do not run `cd backend` again.
- Keep the backend terminal open. It should report that Tomcat started on port `8080`.
- Keep the frontend terminal open. Vite should print `http://127.0.0.1:5173/`.
- Open `http://127.0.0.1:5173/` and sign in with `student1` / `Student@123`.
- If login fails, check the backend terminal first. The API base URL can be overridden in `frontend/.env` using `VITE_API_URL=http://localhost:8080/api`.
- Dashboard API requests now time out after 12 seconds and show a useful error instead of spinning forever.

## Verification note

The source archive includes a previously generated frontend `dist` folder. The current environment used for repackaging does not have Maven installed and cannot complete a fresh Maven build; the package registry also did not complete a fresh npm install here. Therefore this archive is prepared with startup scripts and corrected setup instructions, but a clean end-to-end build on the user's Windows machine is still required before claiming a verified production build.
