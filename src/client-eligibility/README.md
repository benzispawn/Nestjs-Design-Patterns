# Client Eligibility Module

## Purpose
This module centralizes how eligibility is calculated and exposed for screens `A`, `B`, and `C`.

Current endpoints:
- `GET /screen-a`
- `GET /screen-b`
- `GET /screen-c`

Each endpoint uses the same eligibility decision and returns the screen identifier plus eligibility payload.

## Request Flow
1. `EligibilityController` receives the request and reads `req.user.id` and optional `req.user.tenantId`.
2. `EligibilityService` delegates to a single-flight provider through DI token.
3. Provider strategy is selected manually in `client-eligibility.module.ts`:
- `memory` -> `InMemoryEligibilitySingleFlightProvider`
- `redis` -> `RedisEligibilitySingleFlightProvider`
4. Selected provider:
- checks short-lived cache
- checks in-flight state (memory map or Redis lock)
- if needed, calls repository once and stores result in cache
5. `EligibilityRepository` performs the evaluation and returns the eligibility model.

## Single-Flight and Cache Logic
`InMemoryEligibilitySingleFlightProvider` has two in-memory maps:
- `inflight: Map<string, Promise<EligibilityModel>>`
- `cache: Map<string, { expiresAt: number; data: EligibilityModel }>`

Behavior:
- If cache for a user is valid (TTL = 10s), return cached result immediately.
- If a request for the same user is already running, return the same in-flight promise.
- If no cache and no in-flight request exist, evaluate once in repository, cache the result, and share completion.

This prevents duplicated repository calls when multiple simultaneous requests arrive for the same user.

## Redis Single-Flight (In Progress)
`RedisEligibilitySingleFlightProvider` uses:
- cache key: `eligibility:{userId}`
- lock key: `eligibility:lock:{userId}`

Behavior:
- read cache from Redis first
- acquire lock with `NX` + short TTL
- lock owner evaluates repository and writes cache
- lock contenders wait/poll briefly for cache to appear
- if wait times out, fallback evaluates and stores cache

Config via env vars:
- `REDIS_HOST` (default `127.0.0.1`)
- `REDIS_PORT` (default `6379`)
- `REDIS_USERNAME` (optional)
- `REDIS_PASSWORD` (optional)
- `REDIS_DB` (default `0`)
- `ELIGIBILITY_CACHE_TTL_SECONDS` (default `10`)
- `ELIGIBILITY_LOCK_TTL_MS` (default `5000`)
- `ELIGIBILITY_LOCK_WAIT_TIMEOUT_MS` (default `7000`)
- `ELIGIBILITY_LOCK_POLL_MS` (default `100`)

## Simultaneous Requests
- Same user, simultaneous calls (`/screen-a`, `/screen-b`, `/screen-c`): repository evaluation is expected to run once.
- Different users, simultaneous calls: repository evaluation runs once per distinct user.

This behavior is covered by unit and e2e tests.

## Important Limitation
The default strategy remains **in-memory and per instance**.

That means it is suitable for **vertical scaling context only** (single process/instance with more CPU/RAM), but it does not coordinate state across multiple instances.

In horizontal/distributed deployments:
- each instance has its own cache/inflight map
- deduplication is not global
- restarts clear all cached state

## Manual Strategy Switch
For now, the switch is intentionally manual in:
- `src/client-eligibility/client-eligibility.module.ts`

Update:
- `const ELIGIBILITY_PROVIDER_STRATEGY: "memory" | "redis" = "memory";`

Set to `"redis"` when Redis is available and configured.

## Docker Redis
Redis runtime is available via project root `docker-compose.yml`.

Start:
- `docker compose up -d redis`

Stop:
- `docker compose stop redis`
