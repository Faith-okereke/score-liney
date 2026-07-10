# Athena Project Structure

## Overview

Athena is a production-grade autonomous sports intelligence platform built for the TxLINE World Cup Hackathon.

The backend ingests live sports data from TxLINE, normalizes and stores it, then feeds it into Athena's reasoning engine. The frontend visualizes Athena's live intelligence, consensus decisions, replay analysis, and historical insights.

The architecture is designed to be modular, scalable, and production-ready.

---

# Tech Stack

## Monorepo

- pnpm Workspaces
- Turborepo

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand

## Backend

- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Redis (Upstash)
- Zod
- WebSockets

## Deployment

Frontend
- Vercel

Backend
- Railway

Database
- Neon PostgreSQL

Redis
- Upstash

---

# Monorepo Structure

```
athena/

apps/
    web/
    api/

packages/
    ui/
    core/
    agents/
    types/
    utils/

docs/
```

---

# Backend Structure

```
apps/api/src/

config/

modules/

plugins/

routes/

services/

lib/

types/

server.ts

app.ts
```

---

# Module Structure

Each module follows this structure:

```
module-name/

controller.ts

service.ts

repository.ts

schema.ts

types.ts

routes.ts
```

Business logic belongs in services.

Controllers should remain thin.

Repositories should contain database access.

---

# TxLINE Module

```
txline/

auth/

client/

services/

types/
```

Responsibilities

- Authentication
- API Client
- Sync
- Token Refresh
- Data Retrieval

No business logic.

---

# Athena Modules

Athena is one autonomous intelligence composed of reasoning modules.

```
athena/

scout/

momentum/

historical/

risk/

devil/

consensus/

reporter/
```

Every module implements:

```
analyze(context)

↓

returns

AnalysisResult
```

Modules never call each other directly.

Only the Consensus Engine combines results.

---

# Data Flow

```
TxLINE

↓

Authentication

↓

Sync Engine

↓

PostgreSQL

↓

Athena

↓

Consensus

↓

WebSocket

↓

Frontend
```

Athena never communicates directly with TxLINE.

Athena only consumes normalized data stored in PostgreSQL.

---

# API Design

REST API

Versioned

```
/api/v1
```

Examples

```
GET /matches

GET /matches/:id

GET /analysis/:id

GET /signals

GET /replay/:id
```

---

# Event Architecture

Use an internal Event Bus.

Never tightly couple modules.

```
TxLINE Update

↓

Event Bus

↓

Athena Modules
```

---

# Database Principles

PostgreSQL is the source of truth.

Redis is temporary cache.

Never store permanent data in Redis.

---

# Code Style

Always use

- async/await
- TypeScript strict mode
- Dependency Injection where appropriate
- Zod validation
- Feature-first architecture

Avoid

- global state
- business logic inside controllers
- duplicated types
- circular dependencies

---

# Error Handling

Never swallow errors.

Always return structured API responses.

```
{
  success: false,
  message: "",
  error: ""
}
```

---

# Engineering Philosophy

Prioritize

- readability
- maintainability
- modularity
- production readiness

Every new feature should be designed as if it will be maintained for years.