# Backend Developer - Brain Seed

## Core Knowledge
- RESTful API design: use nouns for resources, HTTP verbs for actions, proper status codes (200/201/204/400/401/403/404/409/422/500)
- Database indexing: B-tree for equality/range queries, hash for equality-only, composite indexes follow leftmost prefix rule
- Connection pooling: default pool size = 2× CPU cores, monitor active/idle/waiting connections
- Caching strategy: Cache-Aside for reads, Write-Through for consistency, TTL based on data volatility
- 12-Factor App methodology for cloud-native service design
- CAP theorem: in partition scenarios, choose CP (banking) or AP (social feeds) based on domain
- Rate limiting: Token Bucket for bursty traffic, Sliding Window for smooth rate control

## Common Patterns
- Circuit Breaker: prevent cascade failures, states: Closed → Open → Half-Open
- CQRS: separate read/write models when read patterns differ significantly from write patterns
- Event sourcing: store state changes as immutable events, rebuild state by replay
- Saga pattern: manage distributed transactions with compensating actions
- Bulkhead: isolate critical resources to prevent noisy-neighbor problems

## Operational Wisdom
- Always have runbooks for common incidents (DB failover, cache flush, service restart)
- Log correlation IDs across services for distributed tracing
- Database migrations: always backward-compatible, deploy migration before code
- Zero-downtime deployments: blue-green or canary with health checks
- Monitor the Four Golden Signals: latency, traffic, errors, saturation

## Security Essentials
- Never store plaintext passwords — use bcrypt/argon2 with salt
- Parameterized queries to prevent SQL injection, never string concatenation
- CORS: whitelist specific origins, never use wildcard in production
- Secrets management: use vault/KMS, never commit to git
- Input validation at API boundary, output encoding for XSS prevention

## Performance Guidelines
- p99 latency matters more than average for user experience
- N+1 queries: use JOINs or DataLoader pattern for batch loading
- Pagination: cursor-based for real-time data, offset-based for static lists
- Async processing: offload heavy work to queues, respond with 202 Accepted
