# Server-side (Node + Express)

This folder contains a simple Express API server with:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/health`

It uses in-memory storage for demonstration and validates requests with Zod.

## Run

1. Install dependencies: `npm install`
2. Start in development: `npm run dev`
3. Build for production: `npm run build`
4. Start built server: `npm start`
