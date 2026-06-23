# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x (strict mode)
**Primary Dependencies**: Next.js 14+ (App Router), Styled Components, @tanstack/react-query v5, Recharts
**Storage**: N/A (stateless frontend; all state via React Query + LoadUp REST API)
**Testing**: None (no tests of any kind per constitution)
**Target Platform**: Web (mobile-first, 375 px+)
**Project Type**: Mobile-first web application
**Performance Goals**: < 2s LCP on mobile, < 100ms interaction response
**Constraints**: No UI libraries (MUI, Ant Design, etc.); all components custom; styled via ThemeProvider only
**Scale/Scope**: 4 screens, personal project

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with LoadUp Frontend Constitution v1.0.0:

- [ ] **I. TypeScript Strict** — All new files use `.ts`/`.tsx`, `strict: true`, no `any` without justification
- [ ] **II. Component Architecture** — Components have single responsibility; shared in `src/components/`, page-specific co-located with page
- [ ] **III. Clean Code & DRY** — No duplicated logic, functions named clearly, no magic values, files ≤ 300 lines
- [ ] **IV. API Layer Isolation** — All HTTP calls via `src/services/`; React Query used for server state; no raw `fetch` in components
- [ ] **V. Mobile-First Theme** — All styles use ThemeProvider tokens; no hardcoded colors/sizes; layouts start at 375 px

If any gate fails, document the violation and justification in the Complexity Tracking table below.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation                  | Why Needed         | Simpler Alternative Rejected Because |
| -------------------------- | ------------------ | ------------------------------------ |
| [e.g., 4th project]        | [current need]     | [why 3 projects insufficient]        |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient]  |
