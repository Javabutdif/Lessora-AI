# Engineering Decisions

Use this file for durable decisions that affect how the product or repository should evolve.

Keep entries short, specific, and ordered with the newest decision at the top.

### Client auth context owns JWT session state

- date: 2026-05-24
- status: accepted
- context: The mobile client needs token persistence, route protection, and automatic logout when a session expires.
- decision: Use a centralized React Auth Context with AsyncStorage persistence and `jwt-decode` expiration checks; protected React Navigation screens are rendered only when authenticated.
- consequences: Auth state has one owner on the client, and future protected API calls can read the token from context. AsyncStorage is sufficient for the current implementation but should be replaced with SecureStore or keychain-backed storage for stronger token-at-rest protection.

## What belongs here

- workflow continuity rules that should stay true across tasks and tool switches
- durable repo-level decisions about validation, packaging, or workspace structure
- product architecture choices that future contributors could reverse incorrectly without context

## Template

### Decision title

- date:
- status:
- context:
- decision:
- consequences:

### Shared React web admin portal on dedicated Vite app

- date: 2026-05-28
- status: accepted
- context: The repository needs a second client experience for administrators without duplicating backend ownership.
- decision: Build a dedicated React + TypeScript web admin under `client-side-admin` that consumes the existing Express API through shared auth and stats endpoints.
- consequences: The admin portal can evolve independently from the mobile client while continuing to use the same backend server and data contracts.

## Notes

- Prefer a new entry when a decision would otherwise be easy to forget or reverse incorrectly.
- Use `accepted`, `superseded`, or `rejected` for status values if the team wants a simple lifecycle.
- Avoid recording temporary implementation details here unless they have long-term value.
- Link to a spec or plan when the decision came out of a larger design discussion.
