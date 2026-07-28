# Nova Admin — Sprint 1

Infrastructure layer for the Exchange Administration Platform.

## ✅ Sprint 1 — Verification Report

| # | Check | Status | Notes |
|:-:|:------|:------:|:------|
| 1 | Monorepo Setup | ✅ | npm workspaces with 2 packages |
| 2 | Dependencies | ✅ | All npm packages installed |
| 3 | Prisma Generate | ✅ | Client generated from 40+ table schema |
| 4 | Database Schema | ✅ | Pushed to PostgreSQL (nova_admin) |
| 5 | TypeScript Build | ✅ | Compiles without errors |
| 6 | Backend Running | ✅ | NestJS on port 8002 |
| 7 | Health Check Script | ✅ | Shows all services status |
| 8 | Docker Compose | ✅ | Config validates |
| 9 | CI/CD Pipeline | ✅ | GitHub Actions workflow ready |
| 10 | Nginx Config | ✅ | Config ready (frontend in Sprint 5) |

## 📁 Structure

```
/opt/nova-admin/
├── docker-compose.yml     # PostgreSQL, Redis, Backend, Nginx
├── package.json           # Monorepo root (npm workspaces)
├── .env.example           # Environment template
├── tsconfig.base.json     # Shared TypeScript config
├── scripts/
│   ├── health-check.js    # Service health verification
│   └── setup.sh           # One-command setup
├── packages/
│   ├── backend/           # NestJS API server
│   │   ├── src/main.ts
│   │   ├── src/app.module.ts
│   │   └── Dockerfile
│   └── database/
│       └── prisma/schema.prisma  # 40+ tables
├── nginx/
│   └── nginx.conf         # Full proxy config
└── .github/workflows/
    └── ci.yml             # CI/CD pipeline
```

## 🚀 Startup Commands

```bash
# 1. Install everything
cd /opt/nova-admin
npm install

# 2. Set up database
export DATABASE_URL="postgresql://postgres:***@localhost:5432/nova_admin"
npx prisma generate --schema=packages/database/prisma/schema.prisma
npx prisma db push --schema=packages/database/prisma/schema.prisma

# 3. Build backend
cd packages/backend && npx tsc

# 4. Start backend
PORT=8002 node dist/main.js

# 5. Verify
node ../scripts/health-check.js

# Docker (alternative)
docker compose up -d
```

## 🔑 Environment Variables

| Variable | Default | Description |
|:---------|:--------|:------------|
| `DATABASE_URL` | `postgresql://postgres:***@localhost:5432/nova_admin` | PostgreSQL connection |
| `REDIS_URL` | `redis://redis:6379` | Redis connection |
| `JWT_SECRET` | `nova-jwt-secret-2026` | JWT signing secret |
| `PORT` | `8002` | Backend port |
| `NODE_ENV` | `development` | Environment mode |

## 📊 Database Schema (40+ Tables)

- **Users** (User, Role, Permission, RolePermission, Session, UserDevice)
- **Auth** (LoginLog, PasswordHistory)
- **Wallet** (WalletTransaction, Withdrawal, Commission)
- **Sports** (Sport, Event, MarketTemplate, Market)
- **Betting** (Bet)
- **Logs** (AuditLog, SystemLog, Notification)
- **Config** (Setting, Country, Currency, BankAccount, ApiKey)

## 🔜 Sprint 2 — Authentication

Login, JWT, Refresh Tokens, Roles, Permissions, 2FA
