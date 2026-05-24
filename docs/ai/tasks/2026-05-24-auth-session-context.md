# Auth Session Context

## Status

- [x] Define the expected JWT session behavior.
- [x] Add backend token issuance on login.
- [x] Add client auth context with storage, decoding, and expiry timer.
- [x] Protect app routes through navigation stack selection.
- [x] Run validation.

## Linked artifacts

- spec: `docs/specs/2026-05-24-auth-session-context.md`
- plan: `docs/plans/2026-05-24-auth-session-context.md`

## Current state

- status: in review
- next action: review auth session implementation and validation blockers
- blockers: full repo validation has pre-existing TypeScript blockers outside the auth session files

## Relevant files

- `server-side/src/services/auth.service.ts`
- `server-side/src/controllers/auth.controller.ts`
- `client-side/src/services/api.ts`
- `client-side/src/context/AuthContext.tsx`
- `client-side/src/navigation/AppNavigator.tsx`
- `client-side/App.tsx`
- `client-side/src/screens/Auth/LoginScreen.tsx`
- `client-side/src/screens/Dashboard/ProfileScreen.tsx`
- `client-side/package.json`
- `client-side/package-lock.json`

## Notes

- Registration remains a message-only response.
- Login now returns user profile data plus a signed JWT.
- The client stores the token in AsyncStorage and uses the JWT `exp` claim to trigger automatic logout.

## Validation

- Backend targeted auth compile passed: `npx tsc --noEmit --esModuleInterop --skipLibCheck src/services/auth.service.ts src/controllers/auth.controller.ts`.
- Full backend compile is blocked by existing `src/services/openai.service.ts` type error for `focusArea`.
- Full client compile is blocked by `tsconfig.json` requiring `moduleResolution` to be `node16`, `nodenext`, or `bundler` when `customConditions` is set.
- Client compile with `--moduleResolution bundler` is blocked by existing route type errors in older duplicate screens outside the active auth flow.

## Blockers

- Existing validation blockers are unrelated to the auth session files changed in this task.
