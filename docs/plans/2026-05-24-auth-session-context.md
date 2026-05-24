# Auth Session Context Plan

- [x] Install frontend token decoding and storage dependencies.
- [x] Update backend login to return a signed JWT with user metadata.
- [x] Update API service login typing for `{ token, user }`.
- [x] Add an Auth Context for token persistence, restore, expiry detection, and logout.
- [x] Wrap the app in the Auth Provider.
- [x] Protect navigation by rendering authenticated and unauthenticated stacks conditionally.
- [x] Wire login and logout screens into the Auth Context.
- [x] Run the best available validation command and record blockers.
