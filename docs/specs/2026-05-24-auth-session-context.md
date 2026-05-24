# Auth Session Context Spec

## Goal

Add token handling, route protection, and an automatic client-side session timer without changing the existing registration success flow.

## Behavior

- Successful login returns user data and a JWT.
- The JWT payload includes `user` and `exp`.
- The client stores the token locally after login.
- On app boot, the client restores a valid saved token and user.
- Expired or invalid tokens are removed.
- When the token expires during an active session, the client logs the user out.
- Authenticated users see the protected app stack.
- Unauthenticated users see onboarding, login, and registration routes.

## Security Notes

- The frontend decodes the JWT only for local session timing and route selection.
- Backend authorization must still verify the JWT before protecting future API endpoints.
- AsyncStorage is used for the current Expo setup; a later hardening pass can move tokens to SecureStore or a keychain-backed store.
