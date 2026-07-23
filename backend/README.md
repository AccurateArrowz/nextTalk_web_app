# Backend

Express.js + TypeScript API for nextTalk. The backend is feature-based and now consumes shared request/response shared from the workspace package at `shared`.

## Structure

- `src/app.ts` - Express app wiring
- `src/server.ts` - HTTP server bootstrap and Socket.IO attach point
- `src/features/*` - Domain features such as auth, users, friendships, conversations, and messages
- `src/routes/index.ts` - API route aggregation
- `src/config/*` - Environment, database, cookie, and JWT setup
- `src/middleware/*` - Auth, error, and 404 handling

## Workspace & Contracts

Shared Zod schemas live in `shared/src/` and are imported by the backend as `@nexttalk/shared`. Prefer inferred types from those schemas instead of handwritten DTO interfaces.

## Commands

Run commands from `backend/`:

- `npm run dev` - start the API in development mode
- `npm run typecheck` - run TypeScript without emitting files
- `npm run build` - compile to `dist/` and rewrite path aliases
- `npm run start` - run the compiled server

## Configuration

Required environment variables are defined in `src/config/env.ts`, including `PORT`, `MONGO_URI`, `JWT_SECRET`, and `CLIENT_ORIGIN`. Keep secrets out of the repo and use cookies for refresh-token transport.

## Conventions

- Keep route handlers thin and push business logic into services.
- Use shared schemas for request validation in controllers.
- Preserve existing feature folder names and route prefixes when adding endpoints.

## Naming Conventions
- file names are kebab-case, while the contents (interfaces, types, classes) inside use PascalCase, and variables/functions use camelCase
