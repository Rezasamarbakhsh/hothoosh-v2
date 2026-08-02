# Development Rules

## Tech Stack

<!-- Define the exact technologies, versions, and tooling for this project. -->

## Project Structure Conventions

```
frontend/
  src/
    components/    # Reusable UI components
    pages/         # Page-level components
    hooks/         # Custom React hooks
    services/      # API client and service functions
    stores/        # State management
    utils/         # Utility functions
    types/         # TypeScript type definitions
    styles/        # Global styles and theme

backend/
  src/
    routes/        # API route handlers
    services/      # Business logic
    models/        # Database models
    middleware/    # Express/HTTP middleware
    utils/         # Backend utilities
    types/         # Shared type definitions

shared/
  types/          # Shared TypeScript types
  constants/      # Shared constants
  utils/          # Shared utility functions

agents/
  # Agent definitions and configurations

memory/
  # Persistent memory and context storage

knowledge/
  # Knowledge base and retrieval data
```

## Coding Standards

### General

- Use TypeScript throughout (strict mode enabled)
- Prefer composition over inheritance
- Keep functions small and focused (single responsibility)
- Write descriptive variable and function names
- Add JSDoc comments for public APIs

### Frontend

- Use functional components with hooks
- Prefer `const` over `let`, never use `var`
- Use CSS modules or Tailwind for styling (no inline styles)
- Co-locate related files (component + styles + tests)

### Backend

- Follow RESTful API design conventions
- Validate all input at the API boundary
- Use environment variables for configuration (never hardcode secrets)
- Handle errors consistently with proper HTTP status codes

## Git Workflow

- **Branch naming**: `feat/...`, `fix/...`, `chore/...`
- **Commit messages**: Conventional Commits format
- **PR reviews**: At least 1 approval required

## Testing

- Write unit tests for business logic and utilities
- Write integration tests for API endpoints
- Aim for meaningful coverage on critical paths

## Code Review Checklist

- [ ] No hardcoded secrets or configuration
- [ ] Proper error handling
- [ ] TypeScript types are correct and complete
- [ ] No `console.log` or debug code left
- [ ] New dependencies are justified
- [ ] Documentation updated if needed
