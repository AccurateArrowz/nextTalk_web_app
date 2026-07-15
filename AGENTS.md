# Repository Guidelines

## Project Structure & Module Organization
This repo contains two apps:
- `backend/` - Express + TypeScript API. Source lives in `backend/src/`, with feature folders such as `features/auth`, `features/users`, `features/conversations`, and shared code in `config/`, `middleware/`, `interfaces/`, and `routes/`.
- `frontend/` - Next.js app router frontend. UI code lives in `frontend/app/`, with reusable components in `frontend/app/_components/` and helpers in `frontend/app/_lib/`.

Keep backend changes feature-oriented and avoid scattering logic across layers. Prefer adding new endpoints under the relevant feature folder, then wiring them through `backend/src/routes/index.ts`.

## Build, Test, and Development Commands
Use the package scripts from the app you are changing:
- `cd backend && npm run typecheck` - TypeScript only, no emit.
- `cd backend && npm run build` - Compile backend output to `dist/`.
- `cd backend && npm run dev` - Start the backend in development mode.
- `cd frontend && npm run dev` - Start the Next.js frontend locally.
- `cd frontend && npm run lint` - Run frontend lint checks.

## Coding Style & Naming Conventions
Use TypeScript with strict, explicit types. Match the existing code style:
- Prefer named exports and feature-based filenames like `user.service.ts`, `conversation.routes.ts`.
- Use `camelCase` for variables/functions, `PascalCase` for classes/components, and `kebab-case` for route and file names.
- Keep indentation consistent with the surrounding file, and avoid unnecessary abstraction.
- Use path aliases already configured in the app instead of long relative paths when available.

## Testing Guidelines
Automated test coverage is light in this repo, so verify changes with the relevant app commands above. For backend work, `npm run typecheck` and `npm run build` are the minimum checks. If you add tests, place them near the feature they cover and use clear names such as `conversation.service.test.ts`.

## Commit & Pull Request Guidelines
Recent commits use short, imperative prefixes such as `add:` and `refactor:`. Keep commit subjects concise and action-oriented, for example: `add: socket room joins for conversations`.

Pull requests should include:
- A short summary of what changed and why.
- Any setup or migration notes.
- Screenshots or API examples when UI or responses change.
- The commands you ran for verification.

## Security & Configuration Tips
Do not store tokens in browser-accessible storage unless the feature explicitly requires it. Keep secrets in environment variables and reuse the existing auth and CORS configuration when adding new endpoints or socket events.
