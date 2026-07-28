# Architecture Decisions

Every major architectural decision, why it was made, and when.

---

## Decision #001
**Why NestJS over FastAPI?**

We chose NestJS over FastAPI (which powered the original betting exchange prototype) for the following reasons:

| Factor | NestJS | FastAPI (Previous) |
|:-------|:------:|:------------------:|
| TypeScript support | ✅ Native | ❌ Python |
| Dependency injection | ✅ Built-in | ❌ Manual |
| Module system | ✅ Scalable | ❌ Flat |
| Decorator-based routing | ✅ Clean | ✅ Similar |
| Real-time (WebSocket) | ✅ Socket.IO | ❌ Raw WebSocket |
| ORM integration | ✅ Prisma | ✅ SQLAlchemy |
| Enterprise pattern | ✅ Yes | ❌ No |
| Team scalability | ✅ Excellent | ⚠️ Good |

**Decision:** NestJS
**Date:** 27 July 2026
**Accepted:** Yes

---

## Decision #002
**Why PostgreSQL over MySQL?**

| Factor | PostgreSQL | MySQL |
|:-------|:----------:|:-----:|
| JSON support | ✅ Excellent | ⚠️ Basic |
| Indexing | ✅ Advanced | ✅ Good |
| UUID support | ✅ Native | ❌ Requires workaround |
| Array support | ✅ Native | ❌ |
| Transaction support | ✅ Full ACID | ✅ Full ACID |
| Connection pooling | ✅ PgBouncer | ✅ ProxySQL |
| License | Open Source | Open Source (GPL) |

**Decision:** PostgreSQL
**Date:** 27 July 2026
**Accepted:** Yes

---

## Decision #003
**Why Prisma over TypeORM?**

| Factor | Prisma | TypeORM |
|:-------|:------:|:-------:|
| Type safety | ✅ Excellent | ⚠️ Partial |
| Migration system | ✅ Declarative | ✅ Imperative |
| Schema validation | ✅ Built-in | ❌ Manual |
| Query performance | ✅ Optimized | ✅ Good |
| Learning curve | ⚠️ Moderate | ⚠️ Steep |
| Active maintenance | ✅ Yes | ⚠️ Declining |
| MongoDB support | ✅ Yes | ✅ Yes |

**Decision:** Prisma
**Date:** 27 July 2026
**Accepted:** Yes

---

## Decision #004
**Why Monorepo with npm workspaces?**

- Single source of truth for shared types
- Simplified dependency management
- Atomic commits across packages
- Easier CI/CD pipeline
- Shared ESLint/TypeScript config
- Faster builds with caching

**Decision:** npm workspaces
**Date:** 27 July 2026
**Accepted:** Yes

---

## Decision #005
**Why UUID primary keys over auto-increment IDs?**

- Prevents ID enumeration attacks
- Enables distributed/offline ID generation
- No sequential guessing of user counts
- Safer for multi-tenant architecture
- Slightly larger index size, but acceptable for this scale

**Decision:** UUID for user-facing tables, auto-increment for high-write tables (sports/betting)
**Date:** 27 July 2026
**Accepted:** Yes

---

## Decision #006
**Why JWT over session-based auth?**

| Factor | JWT | Session |
|:-------|:---:|:-------:|
| Scalability | ✅ Stateless | ❌ Stateful |
| Mobile support | ✅ Native | ⚠️ Requires cookies |
| API-friendly | ✅ Bearer token | ⚠️ Cookie-dependent |
| Revocation | ⚠️ Via blacklist | ✅ Instant |
| Refresh tokens | ✅ Supported | ❌ Not applicable |

**Decision:** JWT with refresh token rotation
**Date:** 28 July 2026
**Accepted:** Yes

---

## Decision #007
**Why separate Wallet table instead of balance on User?**

Having a dedicated Wallet table provides:
- Optimistic locking via version field (prevents race conditions)
- Clean separation of concerns
- Support for multiple currencies
- Easier auditing and transaction history
- Better scalability for high-frequency balance updates

**Decision:** Separate Wallet + WalletTransaction tables
**Date:** 28 July 2026
**Accepted:** Yes

---

## Decision #008
**Why RBAC over ABAC?**

| Factor | RBAC | ABAC |
|:-------|:----:|:----:|
| Simplicity | ✅ Simple | ❌ Complex |
| Performance | ✅ Fast | ⚠️ Slower |
| Maintenance | ✅ Easy | ❌ Hard |
| Granularity | ⚠️ Role-level | ✅ Attribute-level |
| Meeting requirements | ✅ Sufficient | ❌ Over-engineered |

For an exchange admin panel, RBAC with 4 roles and 21 permissions provides the right balance of security and simplicity.

**Decision:** RBAC with database-driven permissions
**Date:** 28 July 2026
**Accepted:** Yes
