# Nova Admin Changelog

---

# Version 0.2.0
Release Date: 28 July 2026

## Sprint 2 - Authentication & Security

### Added
- JWT-based login with 24-hour token expiry
- Refresh token rotation (UUID-based, 7-day lifetime)
- Secure logout with session invalidation
- Session management with device tracking
- Role-Based Access Control (RBAC) — 4 roles
- Permission system — 21 granular permissions
- Password hashing using bcrypt (10 rounds)
- Super Admin role with full system access
- Master role with 9 permissions
- Two demo accounts (admin + master) via seed
- Login attempt tracking with auto-lock
- Password history tracking
- Route guards: JwtAuthGuard, RolesGuard, PermissionsGuard
- Role/permission decorators: @Roles(), @RequirePermissions()
- Account lockout after failed login attempts

### Changed
- User schema: added isLocked, lockedUntil, loginAttempts, lastLoginIp, twoFactor fields
- Backend port changed to 8899 (avoiding conflicts)
- Auth service now creates audit log entries on login/logout

### Fixed
- Token extraction in auth guard
- Session cleanup on logout
- DATABASE_URL environment variable passing

### Security
- bcrypt password hashing (10 salt rounds)
- JWT secret from environment variable
- Helmet security headers
- Rate limiting on auth endpoints
- CORS configured for frontend domain
- SQL injection protection via Prisma parameterized queries
- XSS protection via input validation
- Route-level permission enforcement

### Database Changes
- Added `password_history` table
- Added `login_logs` table  
- Added `user_devices` table
- Added `audit_logs` table
- Updated `users` table: new auth-related columns

### Dependencies Added
- @nestjs/jwt, @nestjs/passport, passport-jwt
- bcrypt, uuid
- passport (authentication middleware)

---

# Version 0.1.0
Release Date: 27 July 2026

## Sprint 1 - Infrastructure

### Added
- Monorepo structure with npm workspaces (2 packages)
- Docker Compose configuration (PostgreSQL, Redis, Backend, Nginx)
- Prisma ORM with 26 database tables
- PostgreSQL 16 database schema
- Redis 7 configuration for caching
- NestJS 10 backend application
- Nginx reverse proxy with security headers
- GitHub Actions CI/CD pipeline
- Health check script
- Environment configuration (.env.example)
- TypeScript configuration
- Project documentation (ARCHITECTURE.md, CODING_STANDARDS.md, etc.)
- 4 roles: Super Admin, Master, Agent, Client
- 21 permissions across 10 modules
- Seed data: admin/admin123 and master/master123

### Changed
- Initial project structure

### Fixed
- Docker networking configuration
- Prisma connection string handling
- TypeScript decorator compatibility (experimentalDecorators: true)

### Performance
- Nginx gzip compression enabled
- Nginx keepalive connections (64 upstream, 1000 client)
- Prisma connection pooling

### Security
- Helmet middleware for security headers
- Rate limiting (30 req/s API, 5 req/s auth)
- Environment variable validation
- CORS origin restriction
- Nginx server_tokens off
- X-Frame-Options, X-Content-Type-Options, XSS-Protection headers
- Input validation via class-validator

### Database
- 26 tables created
- UUID primary keys on all user-facing tables
- created_at, updated_at, deleted_at on all tables
- Foreign keys with indexes on all relations
- Audit fields (created_by, updated_by)
- Soft delete support (deleted_at)

### Dependencies Added
- @nestjs/common, @nestjs/core, @nestjs/platform-express
- @prisma/client, prisma
- class-transformer, class-validator
- helmet, reflect-metadata, rxjs
- @nestjs/cli, @nestjs/schematics (dev)
- typescript, ts-node (dev)
