# Nova Admin — Roadmap

---

## Sprint 1 — Infrastructure
**Status:** ✅ Completed (27 July 2026)

- ✅ Monorepo setup with npm workspaces
- ✅ Docker Compose (PostgreSQL, Redis, Backend, Nginx)
- ✅ Prisma schema — 26 production tables
- ✅ PostgreSQL database with indexes and constraints
- ✅ Nginx reverse proxy with security headers
- ✅ GitHub Actions CI/CD pipeline
- ✅ Health check monitoring
- ✅ Environment configuration (.env.example)
- ✅ TypeScript configuration
- ✅ Project documentation structure

## Sprint 2 — Authentication
**Status:** ✅ Completed (28 July 2026)

- ✅ JWT login with 24h token expiry
- ✅ Refresh token rotation (7-day lifetime)
- ✅ Secure logout with session termination
- ✅ Role-based access control (4 roles)
- ✅ 21 permissions across 10 modules
- ✅ Password hashing (bcrypt)
- ✅ Session management with device tracking
- ✅ Account lockout on failed attempts
- ✅ Audit logging for auth events
- ✅ RBAC route guards and decorators

## Sprint 3 — Wallet (Current)
**Status:** 🔄 In Progress

- [ ] User CRUD operations (create, read, update, delete)
- [ ] Wallet management with balance tracking
- [ ] Deposit/withdraw system
- [ ] Double-entry transaction recording
- [ ] Transaction history with filters
- [ ] Commission auto-calculation
- [ ] Audit logs for all wallet operations
- [ ] Unit tests for wallet module
- [ ] API documentation (Swagger)

## Sprint 4 — Dashboard
**Status:** 📋 Planned

- [ ] Admin dashboard with real-time charts
- [ ] Revenue and profit statistics
- [ ] User growth tracking
- [ ] Active session monitoring
- [ ] Notification center
- [ ] Recent activity feed
- [ ] Export reports (CSV/Excel)

## Sprint 5 — Reports
**Status:** 📋 Planned

- [ ] User activity reports
- [ ] Financial reports (P&L)
- [ ] Betting statistics
- [ ] Commission reports
- [ ] Report scheduling
- [ ] Automated email reports
- [ ] Report export (PDF, CSV, Excel)

## Sprint 6 — Sports
**Status:** 📋 Planned

- [ ] Sports/events management
- [ ] Market creation and odds management
- [ ] Fancy markets support
- [ ] In-play betting
- [ ] Multi-market display
- [ ] Bet placement and settlement
- [ ] Live odds updates (WebSocket)

## Sprint 7 — Casino
**Status:** 📋 Planned

- [ ] Casino game integration (Evolution, Ezugi)
- [ ] Game categories and filters
- [ ] Aviator/Crash game
- [ ] Indian Poker
- [ ] Lottery system
- [ ] Casino bet tracking

## Sprint 8 — Settlement
**Status:** 📋 Planned

- [ ] Automated bet settlement
- [ ] Commission calculation
- [ ] Payout processing
- [ ] Dispute resolution
- [ ] Settlement reports

## Sprint 9 — Monitoring
**Status:** 📋 Planned

- [ ] System health monitoring
- [ ] Performance metrics
- [ ] Error tracking (Sentry)
- [ ] Log aggregation
- [ ] Alert system
- [ ] Uptime monitoring

## Sprint 10 — Production
**Status:** 📋 Planned

- [ ] Load testing and optimization
- [ ] Security audit
- [ ] Backup automation
- [ ] Disaster recovery
- [ ] Production deployment
- [ ] Client onboarding
- [ ] Documentation finalization
