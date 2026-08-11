# Quickstart

Use this page as the shortest path from an idea to implemented code.

Start with the Archiona pre-coding gate: create a plan, get it approved, then implement.

## 1. Create the plan

Run `archiona plan --slug <topic> --title "<Title>"` when the work changes behavior, architecture, or spans multiple steps.

Fill every section in `.archiona/plans/<slug>.md`:
- **Evidence**: what files you read and what you learned
- **Problem**: what change is needed
- **Files**: exact files to touch
- **Dependencies**: any new or changed dependencies
- **Test plan**: how to verify the change
- **Rollback**: how to undo the change

Then tick `- [x] **Approved**`.

## 2. Read the matching skill

Before writing code, read the relevant skill under `.archiona/skills/`. The skill overrides your defaults for that area.

## 3. Implement

Write code only against the approved plan. Only touch the files listed in the plan.

## 4. Validate

Run `archiona validate` before considering the change done. Then use the commands in `docs/ai/commands.md` for code validation.

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

### Web Portal Environment Variables

Create a `.env` file in the `client-side-admin/` directory:

```env
VITE_API_BASE=http://localhost:4000
```

**Configuration Details:**
- `VITE_API_BASE`: The base URL for the backend API server
- For production, replace with your deployed server URL (e.g., `https://api.yourdomain.com`)

### Security Notes

- **Never commit `.env` files to version control** — they are already in `.gitignore`
- Use strong, unique values for `JWT_SECRET` in production
- Keep your `OPENAI_API_KEY` secure and rotate it if compromised
- Use environment-specific values for development, staging, and production
