# Error Handling Guidelines

To maintain a robust and maintainable API, we follow a structured error handling pattern. This ensures that every error has a machine-readable name and an appropriate HTTP status code.

## Key Components

1.  **`commonErrors.js`**: A centralized list of all error identifiers (names). ALWAYS use constants from this file instead of raw strings.
2.  **`wrapError.js`**: A utility function to create or wrap errors.
    - **Usage**: `wrapError(originalError, errorName, options)`
    - **Note**: It is a function, NOT a constructor. Do not use `new wrapError`.
3.  **`AppError.js`**: A custom error class for creating structured errors from scratch.
    - **Usage**: `new AppError(name, message, statusCode)`

## Recommended Patterns

### 1. Internal Service Logic

Throw a "raw" error with a message from `commonErrors`. This acts as a signal for the service boundary.

```javascript
if (!user) {
  throw new Error(commonErrors.userNotFoundError);
}
```

### 2. Service Boundary (Catch Block)

Wrap the error to add context (Service-level name) and status code.

```javascript
try {
  // ... logic
} catch (err) {
  // If already a repository error, just pass it through
  if (err.name === commonErrors.userRepositoryFindByIdError) throw err;

  throw wrapError(err, commonErrors.userServiceGetUserByIdError, {
    statusCode: err.message === commonErrors.userNotFoundError ? 404 : 500,
  });
}
```

### 3. Queue Workers or Async Tasks

Use `wrapError` immediately if it won't be caught and re-wrapped elsewhere.

```javascript
if (!userInfo) {
  throw wrapError(
    new Error(commonErrors.userNotFoundError),
    commonErrors.userNotFoundError,
    { statusCode: 404 },
  );
}
```

## Why follow this?

- **Global Error Handler**: Our global error handler in `server.js` relies on `err.name` and `err.statusCode` to return consistent JSON responses.
- **Sentry/Monitoring**: Named errors are much easier to group and analyze in monitoring tools.
- **Maintenance**: Changing an error message in one place (`commonErrors.js`) updates it everywhere.
