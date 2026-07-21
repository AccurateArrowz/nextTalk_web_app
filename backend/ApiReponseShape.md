# API Response Shape Guidelines

All API responses from the nextTalk API conform to a standard JSON envelope format, with a consistent structure for success, paginated, validation error, and other error scenarios.

## Summary Table

| Scenario | Status | `success` | Key fields |
|---|---|---|---|
| Success (general) | 200 / 201 | `true` | `data`, `message?` |
| Success (paginated) | 200 | `true` | `data[]`, `pagination` |
| Validation error | 400 | `false` | `message`, `errors[]` |
| Bad request | 400 | `false` | `message` |
| Unauthorized | 401 | `false` | `message` |
| Auth middleware error | 401 / 403 / 500 | `false` | `message` |
| Forbidden | 403 | `false` | `message` |
| Not found | 404 | `false` | `message` |
| Conflict | 409 | `false` | `message` |
| Internal server error | 500 | `false` | `message` |
| Unhandled global error | 500 | `false` | `message` |

---

## Response Shapes

### 1. Success (General)
Returned for non-paginated successful operations (e.g., entity creation, updates, single resource retrieval).
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "message": "User updated successfully"
}
```

### 2. Success (Paginated)
Returned when retrieving lists of resources with pagination.
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_1",
      "content": "Hello"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Validation Error
Returned when request parameters, query string, or body fail Zod validation schema checks.
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

### 4. Generic/Standard Error
Returned for other errors (e.g. Unauthorized, Not Found, Forbidden, Internal Server Errors).
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```
