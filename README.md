# Lessora AI

![Lessora AI logo](./assets/Lessora-ai%20logo.png)

A full-stack scaffold for the Lessora AI project.

This repository includes:
- `client-side` — Expo React Native app with onboarding, login, registration, and home screens.
- `server-side` — Node + Express API with auth endpoints under `/api/auth`.

## Project structure

- `client-side/` — Expo app source and mobile client implementation
- `server-side/` — Express API, validation, and in-memory auth logic
- `assets/` — shared images and logo assets

## Quick start

### Server
```bash
cd server-side
npm install
npm run build
npm start
```

### Client
```bash
cd client-side
npm install
npx expo start
```

Open the Expo URL with Expo Go on your phone, or use `expo start --lan` to connect over your local network.

### Building for Production (Client)

The client is configured with Expo Application Services (EAS) for cloud building. 
- You can find the EAS workflows in `client-side/.eas/workflows`.
- To generate an APK: `cd client-side && npx eas-cli build -p android --profile preview`
- To generate an App Bundle (Play Store): `cd client-side && npx eas-cli build -p android --profile production`

## Notes

- The logo is stored in `assets/Lessora-ai logo.png`.
- Ignore files are configured in `.gitignore` for node modules, logs, lock files, environment files, and editor output.
