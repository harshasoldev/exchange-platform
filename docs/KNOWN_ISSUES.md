# Known Issues

---

## Authentication (Sprint 2)

### P2 — Master user cannot access /auth/admin/check (Expected — RBAC works correctly)
- **Severity:** Not a bug
- **Status:** Expected behavior
- **Note:** Master role intentionally lacks super_admin permission. Returns 403 Forbidden. This is correct RBAC enforcement.

### P3 — No forgot password flow
- **Severity:** Low
- **Status:** Not implemented
- **Planned:** Sprint 3 or later
- **Workaround:** Admin can reset user passwords via database seed

### P3 — No 2FA implementation yet
- **Severity:** Low
- **Status:** Schema ready, UI pending
- **Planned:** Sprint 4
- **Note:** Database has `two_factor_secret` and `two_factor_enabled` fields ready

## Infrastructure (Sprint 1)

### P2 — Prisma migrations not versioned
- **Severity:** Medium
- **Status:** Using `db push` instead of `migrate dev`
- **Impact:** No rollback history, manual reset required
- **Planned:** Sprint 3
- **Workaround:** `prisma db push --force-reset` resets the database

### P3 — Redis not running in development
- **Severity:** Low
- **Status:** Not started locally
- **Note:** Redis is optional for current functionality. Will be needed for WebSocket in Sprint 6.

### P3 — No automated database backups
- **Severity:** Low
- **Status:** Not implemented
- **Planned:** Sprint 9 (Monitoring)

## Wallet (Sprint 3 — Upcoming)

### P1 — Wallet export not implemented
- **Severity:** High
- **Status:** Pending
- **Planned:** Sprint 3

### P2 — CSV import pending
- **Severity:** Medium
- **Status:** Pending
- **Planned:** Sprint 3

### P3 — Transaction rollback on failure
- **Severity:** Low
- **Status:** Schema supports it, logic pending
- **Planned:** Sprint 3

## Dashboard (Sprint 4 — Planned)

### P2 — Dashboard charts loading slowly
- **Severity:** Medium
- **Status:** Not implemented yet
- **Planned:** Sprint 4

### P3 — Real-time notifications pending
- **Severity:** Low
- **Status:** Not implemented
- **Planned:** Sprint 4

## Sports (Sprint 6 — Planned)

### P1 — Sports API pending
- **Severity:** High
- **Status:** Schema + seed data ready, API endpoints pending
- **Planned:** Sprint 6

### P2 — Live odds updates pending
- **Severity:** Medium
- **Status:** WebSocket support pending
- **Planned:** Sprint 6

### P2 — Fancy markets not implemented
- **Severity:** Medium
- **Status:** Schema has type field, logic pending
- **Planned:** Sprint 6

## General

### P3 — No unit tests yet
- **Severity:** Low
- **Status:** Jest configured, no tests written
- **Planned:** Sprint 3
- **Note:** Backend package has Jest configuration ready

### P3 — Frontend not started
- **Severity:** Low
- **Status:** Frontend package created, no code yet
- **Planned:** Sprint 4 (Dashboard)

### P2 — Swagger/OpenAPI docs pending
- **Severity:** Medium
- **Status:** Swagger module configured, not fully documented
- **Planned:** Sprint 3
