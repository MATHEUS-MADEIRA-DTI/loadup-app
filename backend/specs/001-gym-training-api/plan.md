# Implementation Plan: LoadUp - REST API for Gym Training Management

**Branch**: `001-gym-training-api` | **Date**: May 8, 2026 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-gym-training-api/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

LoadUp is a personal project to build a REST API for gym training management that allows users to create personalized training plans organized by day of week, add exercises with detailed series configurations, record actual workout sessions, and track progression over time. The system will be built using NestJS with TypeScript, MongoDB for persistence, and JWT-based authentication. Users access a calendar interface that displays today's workout and enables session tracking. The MVP focuses on core features: authentication, training sheet management, exercise management, session recording, progression tracking, and a calendar system. All dates and times operate in Brazilian timezone (America/Sao_Paulo, UTC-3).

## Technical Context

**Language/Version**: TypeScript with strict mode (Node.js LTS latest version)  
**Primary Dependencies**: NestJS (framework), Mongoose (MongoDB ODM), @nestjs/jwt (JWT auth), class-validator, class-transformer  
**Storage**: MongoDB (NoSQL document database)  
**Testing**: No testing framework (explicitly out of scope per constitution)  
**Target Platform**: Node.js backend API server  
**Project Type**: Web service / REST API  
**Performance Goals**: API response under 500ms for 95th percentile (SC-004)  
**Constraints**: Single active training sheet per user, Brazilian timezone (UTC-3) for all date/time operations, data retention indefinite unless deleted by user  
**Scale/Scope**: Personal project (one user initially, designed for expansion); 21 core features across 6 user stories

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

**Principles Verification**:

- ✅ **TypeScript-First**: All source code written in TypeScript with `strict: true` mode enforced via tsconfig.json
- ✅ **Clean Code & SOLID**: Modular architecture with one module per domain (auth, users, training-sheet, exercises, training-session, calendar, progression) enforces Single Responsibility and Dependency Inversion via NestJS dependency injection
- ✅ **DRY & Modularity**: Cross-cutting concerns (validation, error handling, timezone conversion) centralized in shared modules; each domain module has focused scope
- ✅ **Simplicity-First Architecture**: Standard NestJS layered architecture (controller → service → repository) applied consistently; no custom frameworks or over-abstraction
- ✅ **Explicit over Clever**: No complex metaprogramming; decorators used only as provided by NestJS and class-validator; clear function and variable names required

**Constitution Compliance**: ✅ **PASS** - No violations identified. Design adheres to all 5 core principles.

**Pre-Design Gate Status**: ✅ CLEARED - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/001-gym-training-api/
├── plan.md              # This file (planning workflow output)
├── research.md          # Phase 0 output - technology and pattern research
├── data-model.md        # Phase 1 output - entity definitions and relationships
├── quickstart.md        # Phase 1 output - developer setup and quick reference
├── contracts/           # Phase 1 output - API contracts and interface specifications
│   ├── auth.contract.md
│   ├── training-sheet.contract.md
│   ├── exercises.contract.md
│   ├── training-session.contract.md
│   ├── calendar.contract.md
│   └── progression.contract.md
└── checklists/          # Quality validation checklists
    └── requirements.md
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main.ts                           # Application entry point
│   ├── app.module.ts                     # Root application module
│   ├── config/                           # Configuration management
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── timezone.config.ts
│   │
│   ├── common/                           # Shared utilities and infrastructure
│   │   ├── decorators/
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── jwt.guard.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   ├── middleware/
│   │   │   └── timezone.middleware.ts
│   │   ├── utils/
│   │   │   ├── timezone.util.ts
│   │   │   └── error-response.util.ts
│   │   └── constants/
│   │       └── error-codes.ts
│   │
│   ├── auth/                             # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts
│   │   ├── auth.controller.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   └── entities/
│   │       └── auth.entity.ts
│   │
│   ├── users/                            # Users module
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   ├── users.controller.ts
│   │   ├── schemas/
│   │   │   └── user.schema.ts
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── entities/
│   │       └── user.entity.ts
│   │
│   ├── training-sheet/                   # Training sheet module
│   │   ├── training-sheet.module.ts
│   │   ├── training-sheet.service.ts
│   │   ├── training-sheet.controller.ts
│   │   ├── schemas/
│   │   │   ├── training-sheet.schema.ts
│   │   │   └── day.schema.ts
│   │   ├── dto/
│   │   │   ├── create-training-sheet.dto.ts
│   │   │   ├── update-training-sheet.dto.ts
│   │   │   └── update-day.dto.ts
│   │   └── entities/
│   │       ├── training-sheet.entity.ts
│   │       └── day.entity.ts
│   │
│   ├── exercises/                        # Exercises module
│   │   ├── exercises.module.ts
│   │   ├── exercises.service.ts
│   │   ├── exercises.controller.ts
│   │   ├── schemas/
│   │   │   ├── exercise.schema.ts
│   │   │   └── series.schema.ts
│   │   ├── dto/
│   │   │   ├── create-exercise.dto.ts
│   │   │   ├── update-exercise.dto.ts
│   │   │   └── create-series.dto.ts
│   │   └── entities/
│   │       ├── exercise.entity.ts
│   │       └── series.entity.ts
│   │
│   ├── training-session/                 # Training session module
│   │   ├── training-session.module.ts
│   │   ├── training-session.service.ts
│   │   ├── training-session.controller.ts
│   │   ├── schemas/
│   │   │   ├── training-session.schema.ts
│   │   │   └── session-record.schema.ts
│   │   ├── dto/
│   │   │   ├── create-training-session.dto.ts
│   │   │   ├── record-set.dto.ts
│   │   │   └── update-training-session.dto.ts
│   │   └── entities/
│   │       ├── training-session.entity.ts
│   │       └── session-record.entity.ts
│   │
│   ├── calendar/                         # Calendar module
│   │   ├── calendar.module.ts
│   │   ├── calendar.service.ts
│   │   ├── calendar.controller.ts
│   │   └── dto/
│   │       └── calendar-view.dto.ts
│   │
│   └── progression/                      # Progression tracking module
│       ├── progression.module.ts
│       ├── progression.service.ts
│       ├── progression.controller.ts
│       └── dto/
│           ├── progression-data.dto.ts
│           └── progression-chart.dto.ts
│
├── .env.example                          # Environment variables template
├── .eslintrc.json                        # ESLint configuration
├── .prettierrc                           # Prettier configuration
├── tsconfig.json                         # TypeScript configuration (strict: true)
├── nest-cli.json                         # NestJS CLI configuration
├── package.json                          # Project dependencies
└── package-lock.json                     # Locked dependency versions
```

**Structure Decision**: Selected **Option 1: Single Project (NestJS Backend Service)**. This is a backend API project with no separate frontend; modular NestJS architecture with one module per domain. Documentation, configuration, and utilities are centralized. This structure follows NestJS conventions, adheres to SOLID principles (Dependency Inversion via decorators), and supports DRY with shared utilities in the `common/` folder. The design is simple, extensible for future features (timezone handling, external API integration), and aligns with the Constitution's emphasis on clarity and modularity.

## Complexity Tracking

No constitution violations identified. All complexity is justified by feature requirements and aligns with simplicity-first principles.
