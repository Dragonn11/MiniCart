# Architecture Decision Records

Context for the major technical choices in MiniCart.



1. Routing

Choose: React Router v6 with lazy() and route-level code splitting.

Each page loads on demand via a shared SuspenseWrapper (handles loading + error boundary).

Rejected: Single bundle (400-500KB upfront for 2-3 pages visited — wasteful). Next.js/Remix (no SSR/SEO need yet; easy to migrate later).

Trade-offs: Brief loading flash on first navigation to each route. All routes share the same error UI - would need restructuring for per-route error handling.

At scale: New page = one lazy import + one router line. Feature teams can't bloat each other's bundles.



2. HTTP layer

Chose: Axios with interceptors plus MSW for dev mocking.

Request interceptor injects auth tokens and stamps request timing. Response interceptor logs every call and normalises errors to a consistent 'ApiError' shape. MSW mocks the full API in dev with realistic latency, filtering, and pagination.

Rejected: Fetch API (no interceptors — we end up reimplementing Axios). Static JSON mocks (no latency/error simulation). GraphQL (overkill for a handful of REST endpoints).

Trade-offs: Axios adds approx 13KB. MSW adds approx 20KB dev-only. Mock handlers must stay in sync with the real API manually we'd close that gap with OpenAPI codegen when a backend exists.

At scale: Swapping to a real backend -> change one env var, remove MSW bootstrap. Zero component changes.



3. Caching

Chose: TanStack Query with per-resource stale times.

Cart: 'staleTime: 0' (always fresh — stale counts break UX). Products: '5 min' (catalog barely changes mid-session). Orders: 30s (statuses update but not second-by-second). Hierarchical query keys ('['products', 'list', filters]'') for granular invalidation. placeholderData keeps old data visible while new filters load.

Rejected: Single global staleTime (too fresh for products or too stale for cart). SWR (similar, but React Query's mutation API and devtools are more mature). Manual useState plus useEffect caching (got messy fast).

Trade-offs: React Query adds ~12KB. Cache invalidation is implicit — we keep it close to mutation hooks. Stale prices possible if a user sits on a page >5 min.

At scale: Each team owns their query keys and stale times independently.



4. State management

Chose: No global state library. React Query for server data, URL params for filters/pagination, 'useState' for UI state. That's all.

approx 90% of state is server data that React Query handles. Cart mutations use optimistic updates (instant UI, background sync, automatic rollback on failure).

Rejected: Redux (no complex client logic to justify the boilerplate).

Trade-offs: No single file showing all app state. State is colocated with its feature — we think that's better.

At scale: No shared global store = no merge conflict bottleneck. Redux becomes worth it if we add something like a multi-step checkout with undo/redo.



 5. Logging

Chose: Custom logger class wrapping 'console.log' with structured metadata. Fed by Axios interceptors (API timing), global error handlers ('window.onerror', unhandled rejections), and a React ErrorBoundary.

Three methods: 'info', 'warn', 'error'. Production has a 'sendToMonitoring' stub ready for Sentry/DataDog.

Rejected: Sentry and DataDog are production monitoring tools hence we don't have a production deployment yet, so adding them now would mean configuring services with nothing to monitor. The logger already has a 'sendToMonitoring' hook ready, so wiring either one in later is a easy job.

Trade-offs: Console gets crowded in dev. Logger is a singleton, not a hook- intentional, since interceptors and error handlers live outside React.

At scale: Structured JSON logs are queryable in any aggregation service. ErrorBoundary is per-route, so one feature crashing doesn't white-screen the app.

---

