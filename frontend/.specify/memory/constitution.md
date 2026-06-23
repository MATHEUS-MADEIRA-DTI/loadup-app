<!--
Sync Impact Report
==================
Version change: 0.0.0 (template) ? 1.0.0
Added sections: Core Principles (5), Tech Stack, Architecture, UI/UX Standards, Governance
Removed sections: none (initial ratification)
Templates requiring updates:
  ? plan-template.md — Constitution Check gates aligned
  ? spec-template.md — no mandatory sections added
  ? tasks-template.md — no new principle-driven task types required
Follow-up TODOs: none
-->

# LoadUp Frontend Constitution

## Core Principles

### I. TypeScript Strict Mode (NON-NEGOTIABLE)
All source files MUST be written in TypeScript with `"strict": true` enabled in `tsconfig.json`.
Use of `any` is FORBIDDEN unless wrapped in an explicit type-narrowing comment explaining why.
Implicit `any`, `@ts-ignore`, and `@ts-expect-error` MUST NOT appear in production code.
Every function parameter, return type, and exported symbol MUST be explicitly typed.

**Rationale**: The backend already enforces strict TypeScript. Consistency across the full stack
eliminates an entire class of runtime bugs and makes refactoring safe.

### II. Component-Based Architecture
Each React component MUST have exactly one responsibility.
Components that render UI MUST NOT contain business logic or data-fetching.
Shared UI primitives MUST live in `src/components/`.
Page-specific components MUST live alongside their page in `src/app/[page]/components/`.
Styled Components MUST be co-located in the same file as the component that uses them —
never in a separate `*.styles.ts` unless the file exceeds 300 lines.

**Rationale**: Locality of behaviour reduces the cognitive load of reading and changing code.
Shared components remain reusable; page components stay focused.

### III. Clean Code & DRY
Every piece of logic MUST have a single source of truth.
Functions MUST do one thing and be named clearly after what they do (no abbreviations, no clever names).
Magic numbers and magic strings MUST be extracted to named constants.
Files MUST NOT exceed 300 lines; if they do, split by responsibility.
Imports MUST be grouped: external ? internal ? relative, separated by blank lines.

**Rationale**: DRY reduces bugs from diverging copies. Clean naming makes code self-documenting
and removes the need for excessive comments.

### IV. API Layer Isolation
All HTTP calls to the LoadUp backend MUST go through the `src/services/` layer.
React Query (`@tanstack/react-query`) MUST be used for all server state — no `useEffect` + `fetch`.
Service functions MUST return typed response objects — never raw `Response` or `unknown`.
Authentication tokens MUST be read from a single, centralised source (e.g., a custom hook or
a token-storage utility) — never duplicated across services.

**Rationale**: Centralising API calls makes it trivial to add auth headers, error handling,
and retry logic in one place. React Query eliminates the loading/error boilerplate that clutters components.

### V. Mobile-First, Theme-Driven UI
All styling MUST use Styled Components with the global `ThemeProvider`.
Raw hex values, pixel sizes, and font sizes MUST NOT appear in component files —
only theme tokens (`theme.colors.*`, `theme.spacing.*`, `theme.typography.*`).
All layouts MUST be designed for 375 px viewport first, then adapted upward via `min-width` media queries.
No third-party UI component libraries (e.g., MUI, Ant Design) — custom components only.

**Rationale**: A single theme object is the source of truth for the design system extracted
from the Figma file. Mobile-first ensures the primary experience (phone) is never an afterthought.

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14+ (App Router) | Server Components where applicable |
| Language | TypeScript (strict) | `noImplicitAny`, `strictNullChecks` |
| Styling | Styled Components | Co-located, theme-driven |
| Server state | @tanstack/react-query v5 | All data fetching |
| Charts | Recharts | Progress and activity charts |
| Package manager | npm | Lock file MUST be committed |

## Architecture

### Directory Structure (enforced)

```
src/
+-- app/                     # Next.js App Router pages
¦   +-- (auth)/              # Login, register
¦   +-- dashboard/           # Home screen
¦   +-- training-plan/       # Meu Plano de Treino
¦   +-- train/               # Treinar Agora
¦   +-- progress/            # Meu Progresso
+-- components/              # Shared UI primitives
+-- services/                # API layer (one file per domain)
+-- hooks/                   # Custom React hooks
+-- styles/                  # Theme, global styles, tokens
+-- types/                   # Shared TypeScript interfaces
+-- lib/                     # Pure utility functions (no React)
```

### Naming Conventions
- React components: `PascalCase`
- Hooks: `use` prefix + `camelCase` (e.g., `useTrainingSheet`)
- Services: `camelCase` domain noun + `Service` suffix (e.g., `trainingSheetService`)
- Types/interfaces: `PascalCase`, no `I` prefix
- Styled components: `Styled` + component name (e.g., `StyledCard`)
- Constants: `SCREAMING_SNAKE_CASE`

## UI/UX Standards

The Figma file (key: `Buolm5kzeDIg7FMTyM21r5`) serves as the design reference.
Copilot has freedom to improve on the reference where it produces a better result.
The design system (colors, spacing, typography) MUST be defined in `src/styles/theme.ts`
and consumed exclusively through the ThemeProvider — never hardcoded.

**No tests of any kind** (unit, integration, e2e) MUST be generated or included.
This is a personal project; developer confidence comes from the type system, not test suites.

## Governance

This constitution supersedes all inline comments, README preferences, and ad-hoc decisions.
Any amendment requires:
1. Updating this file with the rationale and version bump.
2. Updating dependent templates if the change adds or removes principle-driven constraints.
3. Committing the change with message: `docs: amend constitution to vX.Y.Z (reason)`.

**Version semantics**:
- MAJOR: principle removed or fundamentally redefined
- MINOR: new principle or section added
- PATCH: wording, clarification, typo fix

All features implemented for this project MUST pass the Constitution Check in their `plan.md`
before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-05-11 | **Last Amended**: 2026-05-11
