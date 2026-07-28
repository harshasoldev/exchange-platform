# Database Migration History

---

## Migration 001 — Initial Schema
**Date:** 27 July 2026

### Created
- `users` — Core user accounts with auth fields, hierarchy and audit columns
- `roles` — Role definitions (Super Admin, Master, Agent, Client)
- `permissions` — Individual permission definitions
- `role_permissions` — Many-to-many role-permission assignments
- `sessions` — JWT session management with device tracking
- `user_devices` — Registered user devices for security
- `login_logs` — Login attempt history
- `password_history` — Password change history
- `user_profiles` — Extended user profile information
- `wallets` — Per-user wallet with balance and credit limits
- `wallet_transactions` — Double-entry transaction ledger
- `withdrawals` — Withdrawal request tracking
- `commissions` — Commission tracking for hierarchy
- `settings` — System settings (key-value store)
- `countries` — Supported countries
- `currencies` — Supported currencies
- `bank_accounts` — User bank account information
- `api_keys` — API key management
- `audit_logs` — Audit trail for all system actions
- `system_logs` — System-level log entries
- `notifications` — User notification storage
- `sports` — Sports categories
- `events` — Sports events/matches
- `market_templates` — Market templates per sport
- `markets` — Betting markets for events
- `bets` — User bet records

### Indexes Created
- All foreign keys indexed (role_id, master_id, agent_id, user_id, wallet_id, etc.)
- Query-optimized indexes (status, createdAt, isActive, email, username)
- Unique constraints (username, email, token, refreshToken)

### Migration Command
```bash
npx prisma db push --schema=packages/database/prisma/schema.prisma
```

### Rollback
```bash
npx prisma db push --schema=packages/database/prisma/schema.prisma --force-reset
```

### Notes
- UUID primary keys used for all user-facing tables
- Sports/betting tables use auto-increment integers (optimized for high-frequency writes)
- Soft delete via `deleted_at` column on 10 tables
- Optimistic locking on wallets via `version` field

---

## Migration 002 — Auth Enhancements
**Date:** 28 July 2026

### Added
- `password_history` table for password rotation security
- `login_logs` table for login attempt tracking
- `user_devices` table for device fingerprinting

### Changed
- `users` table: Added `is_locked`, `locked_until`, `login_attempts`, `two_factor_secret`, `two_factor_enabled`, `last_login_ip`
- `sessions` table: Added `device_id`, `device_name`, `last_activity`

### Indexes Added
- `users`: is_active, deleted_at
- `login_logs`: userId, createdAt, status
- `sessions`: token, refreshToken, expiresAt, isActive
- `password_history`: userId, createdAt

### Migration Command
```bash
npx prisma db push --schema=packages/database/prisma/schema.prisma --force-reset
```

### Breaking Changes
- All existing user IDs changed from cuid to UUID format
- Session table primary keys changed to UUID
- Requires full database reset (force-reset)

### Seed Data
- 4 roles: Super Admin, Master, Agent, Client
- 21 permissions across 10 modules
- 2 users: admin (super_admin), master (master)

---

## Migration 003 — Sports & Betting
**Date:** (Sprint 6)

### Planned
- Sports, Events, Markets, MarketTemplates, Bets tables
- Match Winner, Total Runs, Fancy markets support
- In-play betting status tracking

---

## Migration 004 — Wallet System
**Date:** (Sprint 3)

### Planned
- Wallet creation on user registration
- Double-entry transaction recording
- Deposit/withdraw approval workflow
- Commission auto-calculation
