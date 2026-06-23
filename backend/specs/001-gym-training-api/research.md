# Phase 0 Research: LoadUp Implementation

**Date**: May 8, 2026  
**Purpose**: Resolve technical unknowns and document architectural decisions

## Technology Stack Decisions

### 1. NestJS Framework Selection

**Decision**: Use NestJS as the HTTP framework for building the REST API

**Rationale**:

- NestJS is a mature, opinionated framework for Node.js that enforces modular, scalable architecture
- Built-in dependency injection supports SOLID principles (Dependency Inversion) crucial to the Constitution
- Decorators (@Controller, @Injectable, @Module) provide clear, explicit code that aligns with "Explicit over Clever" principle
- Excellent TypeScript support with strict mode enforcement
- Large ecosystem of modules for JWT, database integration, validation, and middleware
- Well-suited for RESTful APIs with clear separation of concerns (controllers, services, repositories)

**Alternatives Considered**:

- Express.js: Minimal framework, would require manual implementation of modular architecture patterns; more flexibility = more opportunity for poor design decisions
- Fastify: Lighter and faster but less opinionated; requires manual architecture setup; harder to enforce consistency

**Conclusion**: NestJS is the best match for the project's emphasis on Clean Code, SOLID principles, and modular design.

---

### 2. Mongoose vs Native MongoDB Driver

**Decision**: Use Mongoose as the MongoDB ODM

**Rationale**:

- Mongoose provides schema validation at the application layer, protecting data integrity
- Integrates seamlessly with NestJS via @nestjs/mongoose package
- Provides strong typing support via TypeScript, essential for TypeScript-First principle
- Built-in middleware hooks and virtuals simplify cross-cutting concerns
- Easier to enforce consistent naming conventions and data structures across the codebase
- Supports migration patterns without requiring separate migration tools initially

**Alternatives Considered**:

- Native MongoDB driver: Lower abstraction level = more manual control; harder to enforce schemas and types
- TypeORM with MongoDB: Overly complex for this project; designed for relational databases

**Conclusion**: Mongoose balances schema flexibility of MongoDB with type safety and consistency enforcement.

---

### 3. JWT Authentication Strategy

**Decision**: Use @nestjs/jwt with @nestjs/passport for stateless JWT authentication

**Rationale**:

- JWT is stateless and scales horizontally without session storage
- @nestjs/jwt and @nestjs/passport are the standard NestJS authentication libraries
- JWT with HS256 signing is sufficient for a personal project; no OAuth/OIDC complexity needed
- Aligns with RESTful principles and HTTP best practices
- Clear separation of concerns: strategy module in common/guards/ and auth service

**Token Configuration**:

- **Algorithm**: HS256 (symmetric key signing)
- **Expiration**: 24 hours (standard session duration)
- **Refresh**: Out of scope for MVP; users can re-login after token expiration
- **Storage**: Client-side (browser localStorage or mobile secure storage)

**Conclusion**: @nestjs/jwt is the idiomatic choice for NestJS projects.

---

### 4. Timezone Handling Strategy

**Decision**: Use date-fns-tz for all timezone conversions; store all dates in MongoDB as UTC; convert to America/Sao_Paulo for user display

**Rationale**:

- date-fns-tz is a lightweight, composable library that works well with TypeScript
- Storing UTC internally is the database best practice (no ambiguity, works with timezones anywhere)
- Conversion at the presentation layer (interceptor) ensures consistency across all endpoints
- All dates stored in database are UTC timestamps, independent of user timezone
- Middleware automatically converts response dates to America/Sao_Paulo before sending to client
- This approach scales: if the project expands to multiple timezones, the architecture is already prepared

**Implementation**:

- Database: Store dates as ISO 8601 UTC strings or Unix timestamps
- Service layer: Work with Date objects in UTC
- Interceptor: Convert all serialized dates to America/Sao_Paulo before response
- Request body: Accept ISO 8601 strings, parse to UTC, validate

**Conclusion**: UTC storage + presentation-layer conversion is the most scalable and maintainable approach.

---

### 5. Validation Library Choice

**Decision**: Use class-validator and class-transformer for DTO validation

**Rationale**:

- class-validator is the standard validation library for NestJS
- Works seamlessly with TypeScript decorators and NestJS ValidationPipe
- Allows declarative validation rules on DTO classes, keeping validation logic readable and co-located with type definitions
- Supports custom validators for complex domain rules (e.g., "series count must be at least 1")
- class-transformer handles serialization/deserialization with custom mappings

**Validation Rules** (to be enforced in DTOs):

- Email: RFC 5322 format via `@IsEmail()`
- Password: Minimum 8 characters, enforced with `@MinLength(8)`
- Numeric fields (reps, weight, rest time): Positive integers via `@IsPositive()`
- Series type: Enum validation ('warm-up', 'adjustment', 'working') via `@IsEnum()`
- Required fields: `@IsNotEmpty()` for mandatory fields

**Conclusion**: class-validator + class-transformer is the idiomatic NestJS approach.

---

### 6. External Exercise API Integration (Optional)

**Decision**: Design the system to support external exercise API; implementation deferred to Phase 2 or later

**Rationale**:

- Spec allows users to search exercises or enter manually
- External API is optional; users can always enter exercises manually
- Current MVP doesn't require this feature; can be added later without restructuring
- Defer to keep initial scope focused on core functionality

**Future Implementation Pattern**:

- Separate module: `exercises-api/` for external API integration
- Service to fetch exercises from external source (to be defined)
- Caching layer to avoid repeated requests
- Fallback to manual entry if API unavailable

**Conclusion**: External API integration is out of scope for Phase 1; design for extensibility but don't build it yet.

---

### 7. Database Indexing Strategy

**Decision**: Create indexes for common query patterns; design schema to minimize N+1 queries

**Rationale**:

- MongoDB queries need indexes for performance (SC-004: <500ms p95)
- Common queries: by user_id, by date range, by exercise
- Mongoose will handle index creation via schema definitions
- Denormalization where appropriate to reduce joins (e.g., store user info in training sheet)

**Planned Indexes**:

- User collection: unique index on email
- TrainingSheet: index on userId (each user has exactly one)
- TrainingSessions: index on (userId, date) for calendar queries
- Exercises in TrainingSheet: denormalized to avoid lookups

**Conclusion**: Indexes will be defined in Mongoose schemas; design will minimize N+1 queries.

---

## Summary: Technical Decisions Locked In

| Decision     | Chosen           | Rationale Summary                                    |
| ------------ | ---------------- | ---------------------------------------------------- |
| Framework    | NestJS           | Modular, enforces architecture, excellent TS support |
| ODM          | Mongoose         | Schema + type safety, NestJS integration             |
| Auth         | @nestjs/jwt      | Stateless, standard for NestJS                       |
| Timezone     | date-fns-tz      | Lightweight, UTC + presentation conversion           |
| Validation   | class-validator  | Declarative, NestJS standard                         |
| External API | Deferred         | Out of scope MVP; design for extensibility           |
| Indexing     | Mongoose schemas | Performance via indexes, no N+1 queries              |

All decisions align with the Constitution: TypeScript-First, Clean Code & SOLID, DRY & Modularity, Simplicity-First, and Explicit over Clever.
