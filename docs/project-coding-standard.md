# Athena Coding Standards

## Purpose

Athena is designed as a production-quality autonomous intelligence platform, not a hackathon prototype.

Every piece of code should prioritize:

- Readability
- Simplicity
- Scalability
- Maintainability
- Type Safety
- Performance
- Testability

When multiple implementations are possible, prefer the solution that is easier to maintain and extend.

---

# General Principles

Write code as if another engineer will maintain it for the next five years.

Avoid clever code.

Prefer explicit code over magical abstractions.

Small modules are better than large modules.

Every file should have a single responsibility.

Never optimize prematurely.

---

# TypeScript

Always enable strict mode.

Never use:

```ts
any
```

Prefer

```ts
unknown
```

or proper interfaces.

Always define explicit return types for exported functions.

Use interfaces for object contracts.

Use type aliases only for unions or utility types.

Prefer enums only when necessary.

---

# Naming Conventions

## Variables

camelCase

```ts
currentMatch
homeTeam
confidenceScore
```

---

## Functions

camelCase

Functions should describe actions.

Good

```ts
fetchFixtures()

calculateMomentum()

buildConsensus()

saveMatch()

publishEvent()
```

Bad

```ts
doThing()

run()

handleStuff()
```

---

## Classes

PascalCase

```ts
TxLineClient

ConsensusEngine

ScoutModule

ReplayEngine
```

---

## Interfaces

Prefix with I only if required by existing libraries.

Otherwise

```ts
interface Match

interface AnalysisResult

interface Event
```

---

## Files

Use kebab-case.

```
match-service.ts

consensus-engine.ts

txline-client.ts
```

---

# Folder Organization

One responsibility per folder.

Example

```
matches/

controller.ts

service.ts

repository.ts

schema.ts

types.ts

routes.ts
```

Never mix unrelated business logic.

---

# Controllers

Controllers should

- receive requests
- validate input
- call services
- return responses

Controllers should NOT

- contain business logic
- access Prisma directly
- contain calculations

---

# Services

Services contain business logic.

Example

```
ScoutService

ConsensusService

ReplayService
```

Services should be framework independent whenever possible.

---

# Repositories

Repositories are responsible only for database operations.

Never place business logic inside repositories.

---

# Validation

Always validate external input.

Use Zod.

Never trust

- request body
- params
- query strings
- external APIs

Every endpoint should validate before processing.

---

# Error Handling

Never throw raw errors to the client.

Always return structured responses.

```json
{
    "success": false,
    "message": "...",
    "error": "..."
}
```

Log detailed errors internally.

Return user-friendly errors externally.

---

# Logging

Use Fastify logger.

Log

Application start

Shutdown

Errors

External API requests

Authentication

Synchronization

Never log

Passwords

Secrets

JWTs

API tokens

Private keys

---

# Environment Variables

Never hardcode secrets.

Always load from

```
.env
```

Validate required variables at startup.

Application should fail immediately if critical variables are missing.

---

# Async Code

Always use

```ts
async/await
```

Avoid promise chains.

Good

```ts
const matches = await service.getMatches();
```

Bad

```ts
service.getMatches().then(...)
```

---

# API Design

RESTful.

Version every endpoint.

```
/api/v1
```

Examples

```
GET /matches

GET /matches/:id

GET /analysis/:id

GET /signals

POST /sync
```

---

# Response Format

Every successful response

```json
{
    "success": true,
    "data": {}
}
```

Every failure

```json
{
    "success": false,
    "message": "...",
    "error": "..."
}
```

Never return inconsistent structures.

---

# Database

PostgreSQL is the source of truth.

Redis is cache only.

Never store permanent business data in Redis.

Every write should happen through Prisma.

Avoid raw SQL unless absolutely necessary.

---

# Transactions

Use Prisma transactions whenever multiple writes must succeed together.

Example

Saving

- Match
- Odds
- Events

should occur inside one transaction if consistency matters.

---

# Event Bus

Modules communicate through the Event Bus.

Never directly call another reasoning module.

Correct

```
Scout

↓

Event Bus

↓

Consensus
```

Incorrect

```
Scout

↓

Risk

↓

History

↓

Reporter
```

---

# Athena Modules

Each reasoning module implements

```ts
interface ReasoningModule {

    analyze(context: MatchContext): AnalysisResult;

}
```

Modules must

- be deterministic
- have no side effects
- never modify shared state

---

# Consensus Engine

Consensus receives module outputs.

It never performs module-specific analysis.

Responsibilities

- combine results
- resolve conflicts
- compute confidence
- produce recommendation

---

# Frontend

Use Server Components whenever possible.

Use Client Components only when necessary.

Keep business logic out of React components.

Use custom hooks.

Example

```
useMatches()

useAnalysis()

useReplay()
```

---

# State Management

Server state

TanStack Query

Client state

Zustand

Never duplicate state unnecessarily.

---

# Styling

Tailwind CSS

shadcn/ui

No inline styles.

Prefer reusable components.

---

# Component Rules

Each component should do one thing.

Large components should be decomposed.

Maximum recommended size

300 lines

---

# Comments

Comment WHY.

Not WHAT.

Bad

```ts
// increment i
i++;
```

Good

```ts
// Skip already processed events
```

---

# Git

Branch names

```
feature/...

fix/...

refactor/...

docs/...
```

Commit format

```
feat:

fix:

refactor:

docs:

test:

chore:
```

Examples

```
feat: add scout reasoning module

fix: resolve replay timeline bug

refactor: simplify consensus calculation
```

---

# Testing

Every service should be testable independently.

Avoid hidden dependencies.

Prefer dependency injection.

Test

Happy path

Edge cases

Failures

Invalid input

---

# Performance

Cache expensive reads.

Batch database operations.

Avoid N+1 queries.

Never fetch unnecessary columns.

Use pagination.

---

# Security

Validate every request.

Never expose secrets.

Escape user-generated content.

Rate limit sensitive endpoints.

Use HTTPS in production.

---

# Documentation

Every exported function should include concise documentation if its behavior isn't obvious.

Complex algorithms should explain the reasoning behind the implementation.

Keep README files updated.

---

# AI Code Generation Rules

When generating code:

- Produce complete, production-ready implementations.
- Do not generate placeholders unless explicitly requested.
- Follow the established folder structure.
- Use existing shared types instead of duplicating interfaces.
- Prefer composition over inheritance.
- Keep functions focused and short.
- Explain architectural decisions when introducing new patterns.

If a requested implementation conflicts with these standards, prefer these standards and explain the trade-offs.

---

# Engineering Philosophy

Athena should feel like software built by a mature engineering team.

Every new feature should improve the platform's long-term architecture, not just solve the immediate problem.

Before writing code, always consider:

- Is this reusable?
- Is this modular?
- Is this testable?
- Is this scalable?
- Is this easy for another engineer to understand?

Favor consistency over cleverness.