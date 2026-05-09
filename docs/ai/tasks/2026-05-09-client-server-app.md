# Client/Server App Scaffold

## Summary

Create a new React Native client app under `client-side/` and a Node + Express API in `server-side/`. The client includes a landing page, login, register, and home screen. The server exposes auth endpoints and a health check.

## Files created

- `client-side/package.json`
- `client-side/tsconfig.json`
- `client-side/babel.config.js`
- `client-side/app.json`
- `client-side/App.tsx`
- `client-side/src/screens/LandingScreen.tsx`
- `client-side/src/screens/LoginScreen.tsx`
- `client-side/src/screens/RegisterScreen.tsx`
- `client-side/src/screens/HomeScreen.tsx`
- `client-side/src/services/api.ts`
- `client-side/README.md`
- `server-side/package.json`
- `server-side/tsconfig.json`
- `server-side/src/app.ts`
- `server-side/src/server.ts`
- `server-side/src/routes/auth.routes.ts`
- `server-side/src/controllers/auth.controller.ts`
- `server-side/src/services/auth.service.ts`
- `server-side/src/schemas/auth.schema.ts`
- `server-side/src/middleware/errorHandler.ts`
- `server-side/README.md`
- `assets/` (created for logo storage)

## Notes

- The React Native client uses Expo-managed configuration and React Navigation.
- The backend uses Zod for request validation and in-memory auth storage for demonstration.
- `client-side/src/services/api.ts` is configured to use `http://localhost:4000/api` by default.
