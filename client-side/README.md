# Client-side (React Native)

This folder contains a basic Expo-managed React Native application with:

- Landing page
- Login screen
- Register screen
- Home screen
- API client pointing to `http://localhost:4000/api`

## Run

1. Install dependencies: `npm install`
2. Start Expo: `npm run start`

> If you run the app from a device or emulator, update `src/services/api.ts` to use your machine IP if `localhost` does not resolve.

## Production Builds

This project is configured to use [Expo Application Services (EAS)](https://expo.dev/eas) for building the production application.

1. Install EAS CLI globally: `npm install -g eas-cli`
2. Log in to your Expo account: `eas login`
3. Start a cloud build:
   - For Android (APK): `eas build -p android --profile preview`
   - For Android (App Bundle): `eas build -p android --profile production`
   - For iOS: `eas build -p ios`

EAS workflows are defined in `.eas/workflows/create-production-builds.yml`.
