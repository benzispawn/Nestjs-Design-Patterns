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
2. `EligibilityService` delegates to the in-memory single-flight provider.
3. `InMemoryEligibilitySingleFlightProvider`:
- checks short-lived cache
- checks in-flight map (single-flight deduplication)
- if needed, calls repository once and stores result in cache
4. `EligibilityRepository` performs the evaluation and returns the eligibility model.

## Single-Flight and Cache Logic
`InMemoryEligibilitySingleFlightProvider` has two in-memory maps:
- `inflight: Map<string, Promise<EligibilityModel>>`
- `cache: Map<string, { expiresAt: number; data: EligibilityModel }>`

Behavior:
- If cache for a user is valid (TTL = 10s), return cached result immediately.
- If a request for the same user is already running, return the same in-flight promise.
- If no cache and no in-flight request exist, evaluate once in repository, cache the result, and share completion.

This prevents duplicated repository calls when multiple simultaneous requests arrive for the same user.

## Simultaneous Requests
- Same user, simultaneous calls (`/screen-a`, `/screen-b`, `/screen-c`): repository evaluation is expected to run once.
- Different users, simultaneous calls: repository evaluation runs once per distinct user.

This behavior is covered by unit and e2e tests.

## Important Limitation
The current cache/single-flight approach is **in-memory and per instance**.

That means it is suitable for **vertical scaling context only** (single process/instance with more CPU/RAM), but it does not coordinate state across multiple instances.

In horizontal/distributed deployments:
- each instance has its own cache/inflight map
- deduplication is not global
- restarts clear all cached state

## Future Direction
A distributed solution is planned for next iterations, for example:
- shared cache (e.g., Redis) with TTL
- distributed lock/single-flight strategy per user key
- consistent behavior across multiple instances/pods

This module intentionally keeps the current implementation simple while preparing for that evolution.
