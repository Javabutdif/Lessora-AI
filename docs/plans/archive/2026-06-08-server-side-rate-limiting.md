# Server-Side Rate Limiting Plan

## Steps

- [ ] add a small reusable rate limit middleware
- [ ] wire the middleware into the API route groups in `server-side/src/app.ts`
- [ ] verify the server still type-checks

## Implementation notes

- keep the limiter in memory and keyed by request identity plus route group
- use conservative defaults so normal usage is unlikely to be affected
- avoid touching controller logic unless a route needs a specific exception
