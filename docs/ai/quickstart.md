# Quickstart

Use this page as the shortest path from an idea to a finished workflow bundle.

Start with `npm run workflow -- scaffold` when you need a new task brief, spec, or plan. The templates in `docs/specs/TEMPLATE.md`, `docs/plans/TEMPLATE.md`, and `docs/ai/tasks/` define the structure the scaffold mirrors.

## 1. Create the artifacts

1. Run `npm run workflow -- scaffold --slug <topic> --artifacts bundle` when the work changes behavior, architecture, workflow, or spans multiple steps.
2. Run `npm run workflow -- scaffold --slug <topic> --artifacts task` when the work only needs a task brief.
3. Fill in the generated files so the current work has a real summary, scope, next action, and validation notes.

## 2. Keep them aligned

- The spec says what should change and why.
- The plan says how the work will be carried out.
- The task brief says what is happening now and what another agent needs to know to continue.
- Use explicit `none` values for intentionally omitted spec or plan links so later tools do not have to infer intent.

If the scope changes, update all three artifacts together so the bundle stays easy to resume.

## 3. Validate the work

Run `npm run workflow -- check` before handoff so missing fields or broken linked paths fail early. Then use the commands listed in `docs/ai/commands.md` for code validation. Start with the smallest useful check, then run the stronger repo checks before handoff.

Typical flow:

- run `npm run workflow -- check`
- run focused tests or checks for the files you changed
- run the repository validation command set
- fix any failures before marking the task ready

## 4. Export for another tool when needed

When another LLM or IDE needs to continue the work, generate a portable markdown handoff pack:

- run `npm run workflow -- pack`
- add `--to gemini` or `--to claude` for a tool-specific prompt block
- add `--stdout` when you want to paste the pack directly without writing a file
- add `--include-diff` only when the receiving tool really needs patch-level context

The default pack path is `docs/ai/handoffs/`.

## 5. Finalize the bundle

When the work is complete:

1. Make sure the task brief is marked complete and the final status is accurate.
2. Confirm the linked spec and plan reflect the final outcome.
3. Run `npm run workflow -- finalize --task <path-to-completed-task-brief>` or the matching fallback command from `docs/ai/commands.md` when more than one task brief exists.


## Environment Configuration

### Server Environment Variables

Create a `.env` file in the `server-side/` directory with the following configuration:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/lessora-ai
JWT_SECRET=your-jwt-secret-here
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-4o-mini
```

**Configuration Details:**
- `PORT`: The port number for the Express server (default: 4000)
- `MONGODB_URI`: MongoDB connection string (local or cloud instance)
- `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)
- `OPENAI_API_KEY`: Your OpenAI API key from https://platform.openai.com/api-keys
- `OPENAI_MODEL`: The OpenAI model to use (recommended: gpt-4o-mini for cost efficiency)

### Mobile App Environment Variables

Create a `.env` file in the `client-side/` directory:

```env
EXPO_PUBLIC_API_BASE=http://localhost:4000
```

**Configuration Details:**
- `EXPO_PUBLIC_API_BASE`: The base URL for the backend API server
- For production, replace with your deployed server URL (e.g., `https://api.yourdomain.com`)

### Web Portal Environment Variables

Create a `.env` file in the `client-side-admin/` directory:

```env
VITE_API_BASE=http://localhost:4000
```

**Configuration Details:**
- `VITE_API_BASE`: The base URL for the backend API server
- For production, replace with your deployed server URL (e.g., `https://api.yourdomain.com`)

### Security Notes

- **Never commit `.env` files to version control** - they are already in `.gitignore`
- Use strong, unique values for `JWT_SECRET` in production
- Keep your `OPENAI_API_KEY` secure and rotate it if compromised
- Use environment-specific values for development, staging, and production
