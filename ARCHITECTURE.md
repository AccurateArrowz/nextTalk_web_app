# nextTalk Architecture

This note is meant to give the quickest useful map of the repo so a new prompt can orient itself without rereading every feature file.

## High-level layout

- `backend/` is the main product code right now.
- `frontend/` is a Next.js app router frontend that still exists in its current form.
- A shared workspace package provides request/response schemas and shared types.

## Backend shape

The backend is an Express + TypeScript API with a feature-oriented structure.

- `backend/src/app.ts` wires middleware and route registration.
- `backend/src/server.ts` starts HTTP and attaches Socket.IO.
- `backend/src/routes/index.ts` aggregates feature routers.
- `backend/src/config/` contains env, database, cookie, and JWT setup.
- `backend/src/middleware/` contains auth, error, and 404 handlers.
- `backend/src/utils/` contains common error helpers.
- `backend/src/features/*` contains the actual business domains.

### Feature folders

Each feature generally follows the same pattern:

- `*.controller.ts` handles HTTP requests and responses.
- `*.service.ts` contains business logic.
- `*.model.ts` defines the Mongoose schema/model.
- `*.interface.ts` defines backend-facing document and DTO types.
- `*.routes.ts` wires endpoints to controllers.

Current feature areas:

- `auth` for login, register, refresh, logout, and session handling.
- `users` for profiles, admin user management, and uploads.
- `conversations` for direct/group chats, membership, history visibility, and message history.
- `messages` for sending and reading messages.
- `friendships` for friend requests, acceptance, removal, and blocking.
- `health` for basic service checks.

## Data and contracts

The backend uses Mongoose models for persistence and a shared contract package for API shapes.

- MongoDB stores users, sessions, conversations, messages, and friendships.
- Request validation should come from shared Zod schemas when available.
- Response DTOs should stay aligned with the shared package, but the backend may keep local document types for Mongoose-specific fields.

Important practical note:

- The backend previously hit type-resolution friction around shared exports versus local DTO/document typing.
- When editing feature code, prefer keeping document types separate from response DTO types.
- If a compile error appears to come from shared types, check whether the import is coming from the package root or a subpath.

## Auth and sessions

Auth is not a simple stateless JWT-only setup.

- Access tokens are used for API auth.
- Refresh tokens are meant to travel via cookies, not browser storage.
- The backend has rotation and persistence concerns, so auth changes usually affect more than one layer.

When touching auth, check:

- `backend/src/features/auth/*`
- `backend/src/middleware/require-auth.ts`
- `backend/src/config/cookies.ts`
- `backend/src/config/jwt.ts`
- any frontend auth retry or fetch wrapper that attaches credentials

## Real-time layer

Socket.IO is attached from the backend server bootstrap.

- `backend/src/socket.ts` owns Socket.IO setup and access helpers.
- Message sending emits live events for conversation rooms.
- Conversation membership and message updates may affect both HTTP and socket behavior.

## Current development and build flow

- `npm run dev` in `backend/` is the development entry.
- `npm run build` compiles TypeScript and rewrites path aliases.
- `npm run start` runs the compiled backend from `dist/server.js`.
- `npm run typecheck` checks TypeScript only.

## Frontend

The frontend is currently a Next.js app router project.

- Keep frontend notes short for now.
- The main migration work later is likely a move toward React-first architecture, so this file intentionally does not deep-dive into frontend internals.

## How to work in this repo

- Prefer feature-local changes over cross-cutting edits in multiple layers unless the request is explicitly app-wide.
- Keep route handlers thin.
- Put business logic in services.
- Preserve current route prefixes and feature boundaries.
- Avoid browser-accessible token storage.
- Verify with `npm run typecheck` or the relevant app-level command after backend edits.

