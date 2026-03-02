# Error Handling Guidelines

This document outlines the standardized error handling strategy for the Cosmos Tarot project.

## Core Principles

1.  **Consistency**: Use a single pattern across the entire codebase.
2.  **Standardized Names**: Always use `commonErrors` constants for error names.
3.  **Structured Responses**: Errors should be machine-readable and include appropriate HTTP status codes.
4.  **Propagation**: Status codes should propagate automatically through service layers.

## The `wrapError` Utility

The `wrapError` function is the primary tool for creating and wrapping errors.

### Signature

```javascript
function wrapError(originalError, errorName, options = {})
```

### Features

- **Automatic Propagation**: If the `originalError` already has a `statusCode`, `wrapError` will preserve it unless explicitly overridden in `options`.
- **Stack Trace Preservation**: The original stack trace is maintained.
- **Constant Mapping**: It ensures the error's `name` property matches one of our `commonErrors`.

## Common Patterns

### In Services (Anticipated Errors)

When you expect a specific error condition (e.g., user not found), throw it explicitly in the `try` block:

```javascript
// GOOD
async getUser(id) {
  try {
    const user = await repo.findById(id);
    if (!user) {
      throw wrapError(
        new Error(commonErrors.userNotFoundError),
        commonErrors.userNotFoundError,
        { statusCode: 404 }
      );
    }
    return user;
  } catch (err) {
    // Propagate repository errors or re-wrap if necessary
    if (err.name === commonErrors.repoError) throw err;
    throw wrapError(err, commonErrors.userServiceError);
  }
}
```

### In Controllers / Infrastructure

Standardize the error before it hits the global handler:

```javascript
} catch (err) {
  // The global handler will use the statusCode and name from this wrapError
  throw wrapError(err, commonErrors.criticalError);
}
```

## Why this approach?

- **Cleaner Catch Blocks**: You don't need complex `if/else` logic in every catch block to determine the status code.
- **Better Debugging**: Consistency makes it easier to track errors in logs.
- **Predictable API**: The frontend receives consistent error structures.
