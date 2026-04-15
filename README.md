# MiniCart

A small ecommerce cart app I built to learn React Query and play around with optimistic updates.

## start

```bash
npm install
npm run dev
```

That should open up at localhost. The whole thing runs on mocked APIs (MSW) so we
don't need a backend or anything.

To build for prod:
```bash
npm run build
```

## what I have used

--React 18 + TypeScript (strict mode, because why not)
--Vite for builds — it's fast and I didn't want to deal with webpack configs
-- React Router 6 with lazy loading for each page
-- TanStack Query handles all the server state, caching, refetching etc
--Axios with interceptors for auth headers and request logging
- MSW mocks the entire API layer during development

## features

-- product browsing with search, category filters, sorting, and pagination
-- shopping cart - add/remove items, quantity updates. It uses optimistic updates so it is instant
-- order history page (paginated)
-- each route is code-split so the initial bundle stays small
-- error boundaries so the whole app doesn't crash if one component blows up
-- basic logging service that captures API performance and errors

## project structure


src/
  features/         # products, cart, orders — each has its own api/hooks/components
  shared/           # reusable stuff —      ErrorBoundary, Pagination, logger, etc
   api/              # axios client, react-query setup, mock handlers
   app/              # router config
   main.tsx          # entry point




