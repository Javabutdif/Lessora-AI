# Server-side (Node + Express)

This folder contains a simple Express API server with:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/health`

It uses MongoDB-backed models for users, lesson plans, and dedicated admin accounts, and validates requests with Zod.

## Admin bootstrap

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your environment before starting the server. The backend will create or update the dedicated admin account on startup.

Example:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

## Run

1. Install dependencies: `npm install`
2. Start in development: `npm run dev`
3. Build for production: `npm run build`
4. Start built server: `npm start`
