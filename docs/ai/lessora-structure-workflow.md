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

- `client-side-admin/` is the React web portal (teacher + admin + landing pages).
- `server-side/` is the Node.js, Express, TypeScript API.
- MongoDB access belongs on the server through Mongoose schemas/models.
- Authentication uses the existing JWT and bcrypt flow.
- Request validation belongs on the server through Zod schemas.
- Client code should call API service functions, not raw backend URLs from pages.

## Client-Side Service Workflow

Client API code lives in `client-side-admin/src/services/`.

Use the current `client-side-admin/src/services/api.ts` pattern unless there is a clear reason to split by domain.

### Client Service Rules

- Export TypeScript payload and response types near the service functions that use them.
- Keep fetch details inside service files.
- Pages and components should call named service functions such as `login()` or `register()`.
- Pages should not build backend URLs directly.
- Keep the backend base URL in one place.
- Keep request and response parsing consistent with the server response envelope.
- Throw normal `Error` objects from service helpers so pages can show readable messages.
- Do not duplicate API helper logic across pages.

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

1. Add payload and response types in `client-side-admin/src/services/api.ts` or a domain service file under `client-side-admin/src/services/`.
2. Reuse a shared request helper for JSON, headers, errors, and parsing.
3. Export a named function for the page to call.
4. Update the page to call the service function.
5. Keep loading, success, and error UI states in the page or a page-level hook.

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
10. Add or update client service functions if the web portal calls it.
11. Add or update UI pages only through service functions.
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
- Client API service: `client-side-admin/src/services/api.ts`
- Client auth: `localStorage` tokens managed by `setUserToken()` / `getUserToken()` in `client-side-admin/src/services/api.ts`

## Lesson Plan AI Generation Workflow

Use this workflow for the Generate Plan screen. Do not invent a new AI route, client service, prompt location, or response shape without updating the linked spec and plan first.

### Ownership

- client page: `client-side-admin/src/pages/GeneratePlanPage.tsx`
- client service: `client-side-admin/src/services/api.ts`
- client API base env: `import.meta.env.VITE_API_BASE_URL` → defaults to `http://localhost:4000`
- server route: `server-side/src/routes/ai.routes.ts`
- server controller: `server-side/src/controllers/ai.controller.ts`
- server validation schema: `server-side/src/schemas/ai.schema.ts`
- server business logic: `server-side/src/services/openai.service.ts`
- server AI role and strict rules: `server-side/src/config/openai.config.ts`
- auth middleware: `server-side/src/middleware/auth.middleware.ts`
- quota field: `User.aiResponseCredits`
- history model: `LessonPlan.aiDocument`
- mounted route group: `/api/ai`
- endpoint: `POST /api/ai/lesson-plan/generate`
- history list endpoint: `GET /api/ai/lesson-plan/history`
- history detail endpoint: `GET /api/ai/lesson-plan/history/:lessonPlanId`
- document export: handled client-side via `client-side-admin/src/utils/documentExport.ts` (when needed)

### Client Field Mapping

The visible web form fields map to the backend request as follows:

```ts
{
  title: topicSubject,
  subject: topicSubject,
  gradeLevel: selectedGradeLabel,
  duration: Number(duration),
  numberOfSessions: 1,
  userDraftText: goalsStandards || undefined,
  templateNotes: goalsStandards || undefined,
}
```

Current visible fields:

- Topic / Subject: required
- Grade Level: required
- Duration: required, whole minutes, minimum 5
- Specific Goals / Standards: optional teacher draft context

### Response Contract

The backend returns the standard data envelope:

```ts
{
  data: {
    success: boolean;
    document: {
      type: "lesson_plan_document";
      format: "json";
      version: 1;
      title: string;
      blocks: Array<
        | { type: "heading"; level: 1 | 2 | 3; text: string }
        | { type: "paragraph"; text: string }
        | { type: "list"; style: "bullet" | "numbered"; items: string[] }
      >;
      exportTargets: string[];
    };
    draftText: string;
    sections: {
      title: string;
      subject: string;
      gradeLevel: string;
      duration: string;
      lessonOverview: string;
      learningObjectives: string[];
      materials: string[];
      procedure: string[];
      assessment: string[];
      teacherNotes: string[];
    };
    sessions: Array<{
      sessionNumber: number;
      title: string;
      duration: number;
      objectives: string[];
      content: string;
      activities: string[];
    }>;
    model: string;
    role: string;
    tokens: {
      prompt: number;
      completion: number;
      total: number;
    };
  },
  error: null
}
```

### Anti-Hallucination Answers For This Flow

- Existing file that owns client fetch logic: `client-side-admin/src/services/api.ts`
- Existing client API base setting: `import.meta.env.VITE_API_BASE_URL` in `client-side-admin/src/services/api.ts`
- Existing backend route path: `/api/ai/lesson-plan/generate`
- Existing response envelope: `{ data: T, error: null }`
- Existing Zod request schema: `generateLessonPlanSchema`
- Existing service method: `openAIService.generateLessonPlan`
- Mongoose persistence model: `User.aiResponseCredits` tracks remaining AI responses
- Mongoose history model: `LessonPlan.aiDocument` stores generated JSON documents
- Validation command: `cd server-side && npx tsc --noEmit` and `cd ../client-side-admin && npx tsc --noEmit`

### Strict AI Role Rule

The client must never send a system prompt, role prompt, or role override. The lesson plan specialist identity belongs only in `server-side/src/config/openai.config.ts`.

### Document And Media Rules

- The canonical generated output is `data.document`, a text-only JSON document.
- The Generate Plan screen should render `document.blocks` as a read-only preview by default.
- Editing should be opt-in from the preview panel through the pencil icon, which toggles editable fields for the same `document.blocks`.
- Export features build a local Word-compatible `.doc` file in the browser and trigger a download.
- The client-side export helper converts `document.blocks` into HTML/plain-text content locally, then triggers a browser download.
- The AI service itself should not generate media or binary files; document export is now handled in the client.
- AI media generation is disabled. Do not request or return images, audio, video, slides, charts, or other media from the lesson plan specialist.
- `draftText` is a compatibility preview string, not the source of truth for editing or exporting.

### Accepted Lesson Plan Document Structure

The approved generated lesson plan is a JSON document with this shape:

```ts
{
  type: "lesson_plan_document";
  format: "json";
  version: 1;
  title: string;
  blocks: LessonPlanDocumentBlock[];
  exportTargets: ["doc"];
}
```

The `blocks` array must render a complete classroom-ready lesson plan in this order:

- heading level 1: lesson title
- paragraph: subject
- paragraph: grade level
- paragraph: duration
- heading level 2: Lesson Overview
- paragraph: overview
- heading level 2: Learning Objectives
- bullet list: at least 3 objectives
- heading level 2: Materials
- bullet list: at least 3 materials
- heading level 2: Procedure
- numbered list: at least 5 teaching steps
- heading level 2: Assessment
- bullet list: at least 2 assessment methods
- heading level 2: Teacher Notes
- bullet list: at least 2 teacher notes

The backend must reject incomplete generated documents that miss required headings. The client must render the preview from `document.blocks`, not from `draftText`.

### History Rules

- A successful AI generation must create a `LessonPlan` owned by the authenticated user.
- The saved `LessonPlan.aiDocument` is the same JSON document used by preview, edit, and export.
- Dashboard recent plans must call `GET /api/ai/lesson-plan/history`; do not use static recent-plan cards.
- Clicking a recent plan should navigate to `/preview/{id}`.
- The Generate Plan page loads saved plan details from `GET /api/ai/lesson-plan/history/:lessonPlanId`.
- Saved plans open in preview mode by default and can be edited locally with the pencil toggle.
- Exporting a history plan uses the same client-side export helper with the currently loaded document.
- Saved-plan edits are local only until a save/update endpoint is explicitly added.

### OpenAI And Quota Rules

- `POST /api/ai/lesson-plan/generate` and `POST /api/ai/lesson-plan/refine` require `Authorization: Bearer <token>`.
- The client API service owns the bearer token through `setAuthToken`; screens should not attach headers manually.
- Each user starts with `aiResponseCredits: 5`.
- One successful OpenAI generation/refinement consumes one response credit.
- If credits are `0`, the backend must reject before calling OpenAI.
- If OpenAI fails after a credit is reserved, the backend refunds the credit.
- If MongoDB saving fails after a credit is reserved, the backend refunds the credit.
- The OpenAI call must request JSON output and normalize it into `LessonPlanDocument`; do not accept free-form prose for this workflow.
- Default model is `gpt-4o-mini`. If `OPENAI_MODEL` is overridden, it must support the Responses API and JSON output.
- The OpenAI prompt must include the full required lesson plan document shape through `Teacher Notes`; do not provide a partial example that stops at objectives.
- The backend should reject incomplete generated documents that miss required headings: Lesson Overview, Learning Objectives, Materials, Procedure, Assessment, and Teacher Notes.

### Home Redirect Rules

- The dashboard hero "Try it now" action should navigate to `/generate`.
- Navigation belongs in the dashboard page/component; pages must not call backend AI endpoints directly.
