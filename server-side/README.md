# Server-side (Node + Express)

This folder contains a simple Express API server with:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/health`

It uses MongoDB-backed models for users, lesson plans, and dedicated admin accounts, and validates requests with Zod.

## Run

1. Install dependencies: `npm install`
2. Start in development: `npm run dev`
3. Build for production: `npm run build`
4. Start built server: `npm start`
