# Lessora AI Structure Workflow

Use this document before adding or changing client-side API calls, server-side endpoints, database models, services, controllers, routes, or validation schemas.

The goal is to keep Lessora AI predictable for humans and coding agents. Do not invent new folders, response shapes, or layer responsibilities when an existing pattern already fits.

## Before Changing Code

- Read `docs/ai/commands.md` and `docs/ai/standards.md`.
- Read this file for any change involving client services or server API layers.
- For behavior, architecture, workflow, or multi-step work, create or update aligned files in `docs/specs/`, `docs/plans/`, and `docs/ai/tasks/`.
- Inspect only the relevant files for the feature. Do not scan the entire workspace unless the task cannot be understood otherwise.
- Keep changes small and aligned with the current stack.

## Current Stack Boundaries

- `client-side/` is the Expo React Native mobile app.
- `server-side/` is the Node.js, Express, TypeScript API.
- MongoDB access belongs on the server through Mongoose schemas/models.
- Authentication uses the existing JWT and bcrypt flow.
- Request validation belongs on the server through Zod schemas.
- Client code should call API service functions, not raw backend URLs from screens.

## Client-Side Service Workflow

Client API code lives in `client-side/src/services/`.

Use the current `client-side/src/services/api.ts` pattern unless there is a clear reason to split by domain.

### Client Service Rules

- Export TypeScript payload and response types near the service functions that use them.
- Keep fetch details inside service files.
- Screens and components should call named service functions such as `login()` or `register()`.
- Screens should not build backend URLs directly.
- Keep the backend base URL in one place.
- Keep request and response parsing consistent with the server response envelope.
- Throw normal `Error` objects from service helpers so screens can show readable messages.
- Do not duplicate API helper logic across screens.

### Expected Client Response Shape

Server responses should be consumed as one of these shapes:

```ts
{
  data: T;
  error: null;
}
```

```ts
{
  message: string;
  error: null;
}
```

```ts
{
  data: null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}
```

### Adding a New Client API Function

1. Add payload and response types in `client-side/src/services/api.ts` or a domain service file under `client-side/src/services/`.
2. Reuse a shared request helper for JSON, headers, errors, and parsing.
3. Export a named function for the screen to call.
4. Update the screen to call the service function.
5. Keep loading, success, and error UI states in the screen or a screen-level hook.

## Server-Side API Workflow

Server API code lives in `server-side/src/`.

Use this layer order:

```text
routes -> controllers -> services -> schemas/models
```

### Folder Responsibilities

- `routes/`: defines Express routes and maps endpoints to controllers.
- `controllers/`: parses and validates request input, calls services, and formats HTTP responses.
- `services/`: contains business logic, database operations, password hashing, token signing, and integrations.
- `schemas/`: contains Zod request schemas and Mongoose database schemas/models.
- `middleware/`: contains shared Express middleware such as error handling.
- `config/`: contains environment-backed configuration and integration settings.

## Server Layer Rules

### Routes

- Keep route files thin.
- Do not put business logic in route files.
- Mount new route groups from `server-side/src/app.ts` under `/api/<domain>`.
- Use plural or domain names consistently, for example `/api/auth` or `/api/lessons`.

Example shape:

```ts
import { Router } from "express";
import { createThing } from "../controllers/thing.controller";

const router = Router();

router.post("/", createThing);

export { router as thingRouter };
```

### Controllers

- Controllers receive `Request`, `Response`, and `NextFunction`.
- Validate request input with Zod schemas before calling services.
- Call exactly the service function needed for the use case.
- Return JSON in the existing response envelope.
- Use `next(error)` for errors and let `errorHandler` format them.
- Do not query Mongoose models directly in controllers unless the task explicitly changes the layering.

Success examples:

```ts
res.json({ data: result, error: null });
```

```ts
res.status(201).json({ message: "Created", error: null });
```

### Services

- Services own business logic.
- Services may call Mongoose models.
- Services may hash passwords, compare passwords, sign tokens, call external APIs, and coordinate multiple models.
- Services should return plain data that controllers can serialize.
- Services should throw `Error` with user-safe messages for known failures.
- Do not import Express `Request` or `Response` into services.

### Zod Request Schemas

- Use Zod for incoming request validation.
- Export inferred TypeScript types from Zod schemas.
- Keep request validation separate from Mongoose persistence models.
- Prefer explicit field rules and readable validation messages.

Example shape:

```ts
export const createThingSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type CreateThingPayload = z.infer<typeof createThingSchema>;
```

### Mongoose Models

- Put Mongoose schemas/models in `server-side/src/schemas/`.
- Export an interface for the document shape.
- Add indexes for common query patterns when they are known.
- Keep schema comments short and useful.
- Use references for separate top-level ownership, such as `userId`.
- Embed bounded subdocuments when the parent and children are normally read together, like lesson plan sessions.
- Include timestamps when records are user-created or updated over time.
- Include `schemaVersion` when future migrations are likely.

### Error Handling

- Let `server-side/src/middleware/errorHandler.ts` produce the final error response.
- Zod validation errors should become `VALIDATION_ERROR`.
- Known user mistakes should become `BAD_REQUEST` or another intentional status.
- Unexpected failures should become `SERVER_ERROR`.
- Do not leak secrets, connection strings, raw stack traces, or provider responses to clients.

## Adding a New Server Feature

Use this order for a new API feature:

1. Define the behavior in a spec under `docs/specs/`.
2. Define implementation steps in a plan under `docs/plans/`.
3. Track execution in a task brief under `docs/ai/tasks/`.
4. Add or update the Zod request schema.
5. Add or update the Mongoose model if persistence changes.
6. Add or update the service function.
7. Add or update the controller.
8. Add or update the route.
9. Mount the route in `app.ts` if it is a new route group.
10. Add or update client service functions if the mobile app calls it.
11. Add or update UI screens only through service functions.
12. Run the best available validation command from `docs/ai/commands.md`.

## Naming Conventions

- Server route files: `<domain>.routes.ts`
- Server controller files: `<domain>.controller.ts`
- Server service files: `<domain>.service.ts`
- Server request schema files: `<domain>.schema.ts`
- Mongoose model exports: PascalCase, for example `User` or `LessonPlan`
- Client service functions: lower camel case, for example `login`, `register`, `createLessonPlan`
- Payload types: `<Action>Payload`
- Response types: `<Action>Response`

## Anti-Hallucination Checklist

Before writing code, answer these from local files:

- Which existing file owns this responsibility?
- Which route path already exists or should be mounted?
- Which response envelope does the client expect?
- Which Zod schema validates the input?
- Which service owns the business logic?
- Which Mongoose model owns persistence?
- Which screen or context will call the client service?
- Which validation command proves the change builds?

If any answer is unknown, inspect the relevant file or document the assumption in the task brief before implementing.

## Current Known Patterns

- Auth route group: `server-side/src/routes/auth.routes.ts`
- Auth controller: `server-side/src/controllers/auth.controller.ts`
- Auth service: `server-side/src/services/auth.service.ts`
- Auth validation: `server-side/src/schemas/auth.schema.ts`
- User model: `server-side/src/schemas/user.schema.ts`
- Lesson plan model: `server-side/src/schemas/lesson.schema.ts`
- OpenAI lesson generation service scaffold: `server-side/src/services/openai.service.ts`
- Client API service: `client-side/src/services/api.ts`
- Client auth session context: `client-side/src/context/AuthContext.tsx`

