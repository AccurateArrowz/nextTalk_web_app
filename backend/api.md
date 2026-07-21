# Backend API Reference

This document describes the current backend HTTP and Socket.IO surface for the NextTalk app.

## Base URL

- HTTP API base: `http://<host>:<port>/api/v1`
- Health check: `http://<host>:<port>/health`
- Socket.IO server: `http://<host>:<port>`

> For local device testing, bind the server to `0.0.0.0` and use your Mac’s LAN IP address from the same network.

## Authentication

Most protected endpoints require an access token in the `Authorization` header:

```http
Authorization: Bearer <accessToken>
```

The auth flow also sets a refresh token as an `HttpOnly` cookie named `refreshToken`.

### Common response shape

Most feature endpoints use a standard JSON envelope:

```json
{
  "success": true,
  "data": {},
  "message": "optional"
}
```

Errors use:

```json
{
  "success": false,
  "message": "What went wrong"
}
```

## HTTP Endpoints

### 1. Auth

| Method | Path | Auth | Description |
|---|---|---:|---|
| `POST` | `/api/v1/auth/register` | No | Register a new user. |
| `POST` | `/api/v1/auth/login` | No | Log in and receive an access token. |
| `POST` | `/api/v1/auth/refresh` | No | Refresh an access token using the refresh cookie. |
| `POST` | `/api/v1/auth/logout` | No | Clear the refresh token cookie. |

#### Register payload

```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "min-8-chars",
  "firstName": "optional",
  "lastName": "optional"
}
```

#### Login payload

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

#### Register / Login success response

```json
{
  "message": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user | platformAdmin",
    "firstName": "string | null",
    "lastName": "string | null",
    "avatarUrl": "string | null",
    "status": {
      "state": "online | offline | away",
      "lastSeenAt": "string"
    }
  },
  "accessToken": "string"
}
```

### 2. Users

| Method | Path | Auth | Description |
|---|---|---:|---|
| `GET` | `/api/v1/users/me` | Yes | Get auth user profile. |
| `PATCH` | `/api/v1/users/me` | Yes | Update profile. Supports multipart `profileImage` upload. |
| `PATCH` | `/api/v1/users/me/password` | Yes | Change password. |
| `PATCH` | `/api/v1/users/me/focus-mode` | Yes | Toggle focus mode. |
| `GET` | `/api/v1/users/search` | Yes | Search users by username. |

#### Update profile payload

```json
{
  "firstName": "string | null",
  "lastName": "string | null",
  "email": "user@example.com"
}
```

Multipart upload form:

```text
profileImage=<image file>
```

#### Change password payload

```json
{
  "currentPassword": "string",
  "newPassword": "min-8-chars"
}
```

#### Focus mode payload

```json
{
  "enabled": true
}
```

### 3. Friends

| Method | Path | Auth | Description |
|---|---|---:|---|
| `POST` | `/api/v1/friends/request` | Yes | Send a friend request. |
| `PATCH` | `/api/v1/friends/request/:id` | Yes | Accept or decline a friend request. |
| `GET` | `/api/v1/friends` | Yes | List accepted friends. |
| `GET` | `/api/v1/friends/requests/incoming` | Yes | List incoming pending requests. |
| `GET` | `/api/v1/friends/requests/outgoing` | Yes | List outgoing pending requests. |
| `DELETE` | `/api/v1/friends/:friendId` | Yes | Remove a friend. |
| `POST` | `/api/v1/friends/block` | Yes | Block a user. |

#### Send request payload

```json
{
  "recipientId": "string"
}
```

#### Respond to request payload

```json
{
  "action": "accept | decline"
}
```

#### Block payload

```json
{
  "targetId": "string"
}
```

### 4. Conversations

All conversation routes require authentication.

| Method | Path | Auth | Description |
|---|---|---:|---|
| `POST` | `/api/v1/conversations` | Yes | Create a friend-gated direct chat or a group conversation. |
| `GET` | `/api/v1/conversations` | Yes | List conversations for the current user. |
| `GET` | `/api/v1/conversations/:id` | Yes | Get one conversation by id. |
| `POST` | `/api/v1/conversations/:id/participants` | Yes | Invite a participant. |
| `DELETE` | `/api/v1/conversations/:id/participants/:userId` | Yes | Remove a participant. |
| `PATCH` | `/api/v1/conversations/:id/settings` | Yes | Toggle history visibility for new members. |
| `GET` | `/api/v1/conversations/:id/messages` | Yes | Fetch paginated message history. |
| `POST` | `/api/v1/conversations/:id/messages` | Yes | Send a new message. |
| `PATCH` | `/api/v1/conversations/:id/messages/:messageId/read` | Yes | Mark a message as read. |

#### Create conversation payload

Direct conversation:

```json
{
  "type": "direct",
  "targetUserId": "string"
}
```

The target user must already have an accepted friendship with the current user. Existing direct conversations also require the friendship to still be accepted before new messages can be sent.

Group conversation:

```json
{
  "type": "group",
  "name": "string",
  "participantIds": ["string", "string"]
}
```

The creator is added automatically as the group admin. `participantIds` are added as members, and every listed user must exist.

#### Invite participant payload

```json
{
  "userId": "string"
}
```

Only group admins can invite or remove participants. New invited participants get `visibleFrom` set to their join time by default, so message history before that time is hidden from them.

#### Update conversation settings payload

```json
{
  "allowHistoryForNewMembers": true
}
```

Only group admins can update this setting. When enabled, new members can see previous messages; when disabled, future members only see messages from their join point. Enabling the setting also unlocks history for existing restricted members.

#### Message history query params

```text
before=<message-id>
limit=<number>
```

### 5. Admin Users

| Method | Path | Auth | Description |
|---|---|---:|---|
| `GET` | `/api/v1/admin/users` | Yes, platformAdmin | List users. |
| `GET` | `/api/v1/admin/users/:id` | Yes, platformAdmin | Get one user. |
| `POST` | `/api/v1/admin/users` | Yes, platformAdmin | Create a user. |
| `PUT` | `/api/v1/admin/users/:id` | Yes, platformAdmin | Replace user record. |
| `PATCH` | `/api/v1/admin/users/:id` | Yes, platformAdmin | Update user record. |
| `DELETE` | `/api/v1/admin/users/:id` | Yes, platformAdmin | Delete a user. |

### 6. Health

| Method | Path | Auth | Description |
|---|---|---:|---|
| `GET` | `/health` | No | Simple uptime/health check. |

#### Health response

```json
{
  "status": "ok",
  "uptime": 123.456
}
```

## Socket.IO Events

The backend initializes Socket.IO on the same HTTP server used for REST endpoints.

### Connection

- Endpoint: `http://<host>:<port>`
- Client transport: Socket.IO
- Authentication: JWT access token must be supplied through `socket.handshake.auth.token` or the `Authorization: Bearer <token>` header.

### Events

| Event | Direction | Description |
|---|---|---|
| `join:conversation` | Client → Server | Join a conversation room. |
| `typing:start` | Client → Server | Broadcast typing indicator to conversation participants. |
| `typing:stop` | Client → Server | Stop typing broadcast. |

#### `join:conversation`

Payload:

```ts
conversationId: string
```

Acknowledgement shape:

```json
{
  "ok": true,
  "conversationId": "string"
}
```

#### `typing:start` / `typing:stop`

Payload:

```json
{
  "conversationId": "string"
}
```

## Notes for Flutter / iOS

- Use the backend LAN IP on the same Wi‑Fi network.
- Keep the app’s CORS origin configured in the environment for the device origin you use during development.
- For realtime chat, connect the Socket.IO client to the same host/port as the REST API.
- If you are using an emulator or device simulator, the reachable host may differ from your local machine host.
