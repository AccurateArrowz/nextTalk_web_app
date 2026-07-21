# Backend Design Principles

This backend should be designed around clear domain boundaries, predictable API contracts, and safe-by-default collaboration behavior. The goal is not to add layers for their own sake; it is to make each feature easy to reason about, test, and extend without breaking existing clients.

## 1. Domain-first feature modules

Keep code grouped by product capability:

- `auth` owns identity, login, refresh, logout, and token/session rules.
- `users` owns profiles, user search, presence-adjacent profile fields, and platform-admin user management.
- `friendships` owns friend requests, accepted friendships, blocking, and any future relationship state.
- `conversations` owns conversation membership, group settings, admin permissions, and history visibility.
- `messages` owns message persistence, read receipts, and message fan-out.

Controllers should stay thin. They validate request shape, call the service, and send a response. Services should own business decisions such as "only group admins can invite users" or "new group members only see messages from their join point by default."

## 2. Stable response envelopes

Every HTTP response should follow the documented envelope:

```json
{
  "success": true,
  "data": {},
  "message": "Optional human-readable message"
}
```

Errors should use:

```json
{
  "success": false,
  "message": "What went wrong"
}
```

Avoid returning mixed shapes like `{ "user": ... }` in one route and `{ "data": ... }` in another. Consistent envelopes reduce frontend branching and make generated/shared contracts easier to trust.

## 3. Validate at boundaries, enforce in services

Use shared Zod schemas for request bodies whenever possible. Validation answers "is this input shaped correctly?" Service methods answer "is this action allowed?"

Examples:

- Body validation checks `recipientId` exists.
- Service logic checks the recipient exists, the sender is not sending to self, and a duplicate request is not already pending.
- Conversation service checks membership/admin role before changing participants or settings.

This avoids the common anti-pattern of putting authorization decisions in controllers where they become duplicated and easy to miss.


## 4. Safe group conversation defaults

Group conversation privacy should be explicit:

- The creator is an admin.
- Invited users are members by default.
- New members only see messages from their join point by default.
- Admins may enable full history visibility for new members.
- Enabling full history can retroactively unlock history for existing restricted members; disabling it affects future joins.

This is common in private chat products because it avoids accidentally leaking prior conversation context to someone added later.

## 5. Consistent authorization for HTTP and sockets

Socket events and HTTP endpoints must enforce the same membership rules. Joining a Socket.IO room should require current conversation membership, and message writes over HTTP should use the same participant checks as realtime behavior. Never trust a socket room subscription as authorization by itself.

## 6. Index around access patterns

Indexes should match common queries:

- Users by `username` for search.
- Friendships by pair and status for relationship checks.
- Conversations by `participants.userId` for inbox loading.
- Direct conversations by a stable sorted `directKey`.
- Messages by `conversationId` and `createdAt` for paginated history.

Add indexes alongside the model fields they support so future maintainers understand the read path.

## 7. Keep DTOs intentionally small

Return only fields the client needs. Public user search should not expose email. Conversation participants can include public profile data later, but password hashes, refresh/session tokens, and internal moderation state should never appear in normal client DTOs.

## 8. Make state transitions idempotent where practical

Creating or opening a direct conversation should return the existing direct thread for the pair. Friend requests should clearly reject duplicates with `409 Conflict`. Read receipts should be safe to call more than once without duplicating entries.

## 9. Prefer boring names and explicit flags

Names like `allowHistoryForNewMembers`, `visibleFrom`, `requestedBy`, and `directKey` are clear enough that a new engineer can infer the behavior. Avoid vague names such as `flag`, `data`, `meta2`, or `roomUserState`; unclear names are cheap to write and expensive to maintain.


