<!--
SYNCHRONIZATION REPORT
======================
Version: 0.0.0 → 1.0.0 (MINOR - Initial Constitution)
Ratification: 2026-05-08

CONSTITUTION ESTABLISHED:
- Project: LoadUp (personal web project)
- Principles: TypeScript-First, Clean Code & SOLID, DRY & Modularity, Simplicity First, Explicit over Clever
- Key Decision: No testing (unit/integration/e2e) per project requirements
- Technology Lock: TypeScript (strict mode) + Node.js environment

PRINCIPLES ADDED (5):
  1. I. TypeScript-First - Static typing, strict mode applied
  2. II. Clean Code & SOLID Principles - Readability, maintainability, SOLID compliance
  3. III. DRY & Modularity - Eliminate duplication, focused modules
  4. IV. Simplicity-First Architecture - Simple, modular, scalable, extensible design
  5. V. Explicit over Clever - Clarity over ingenuity, readable code

SECTIONS ADDED:
  - Technology Stack - TypeScript, Node.js, ESLint, Prettier; no testing framework
  - Code Quality Patterns - type safety, linting, formatting, documentation, naming conventions
  - Governance - amendment procedures, versioning, compliance verification

STATUS OF DEPENDENT TEMPLATES:
  ✅ plan-template.md - Already includes "Constitution Verification" gate (no updates needed)
  ✅ spec-template.md - Compatible with new principles (test scenarios explicitly optional)
  ⚠️  tasks-template.md - Contains example test tasks; should remove test task generation
  ✅ Extended Guidance - Create `.github/CODING_GUIDELINES.md` for development reference

FOLLOW-UP TASKS:
  - [ ] Add ESLint & Prettier configuration to project root
  - [ ] Create `.github/CODING_GUIDELINES.md` with detailed examples
  - [ ] Initialize tsconfig.json with `strict: true` configuration
  - [ ] Document technology stack versions (Node.js LTS recommended)
-->

# LoadUp Constitution

## Core Principles

### I. TypeScript-First

All application code MUST be written in TypeScript. TypeScript provides static type safety, enhanced IDE support, and improves maintainability. Use strict mode throughout the project (`strict: true` in tsconfig.json). Type definitions MUST be explicit; implicit `any` types are prohibited except in isolated legacy contexts with documented justification.

### II. Clean Code & SOLID Principles

Code MUST prioritize readability and maintainability. Apply SOLID principles throughout:

- **Single Responsibility**: Each module, class, and function has ONE clear purpose
- **Open/Closed**: Code is open for extension, closed for modification
- **Liskov Substitution**: Derived types must be substitutable for their base types
- **Interface Segregation**: Depend on focused interfaces, not bloated contracts
- **Dependency Inversion**: Depend on abstractions, not concrete implementations

Complexity MUST be justified and documented. Code reviews MUST verify compliance with these principles.

### III. DRY & Modularity

Duplication MUST be eliminated. Shared logic MUST be extracted into reusable modules or utilities. Keep modules focused and independently understandable. Establish clear, minimal interfaces between modules to reduce coupling. Cross-cutting concerns (logging, error handling, validation) MUST be centralized.

### IV. Simplicity-First Architecture

Architecture MUST be simple, modular, and scalable. Favor direct solutions over clever abstractions. Start with simple patterns (layered, service-oriented) and add complexity only when justified. Design MUST be extensible for future features and potential public release without requiring fundamental restructuring. Document architectural decisions and rationale in design documents.

### V. Explicit over Clever

Code MUST be explicit and readable over clever or overly abstract solutions. Variable and function names MUST be clear and self-documenting. Favor conventional patterns over custom abstractions. Long, clear function bodies are preferable to condensed or nested operations that obscure intent. When there is a choice between readable clarity and brevity, clarity WINS.

## Technology Stack

**Language**: TypeScript (strict mode mandatory)  
**Runtime**: Node.js (version TBD - specify in feature plan)  
**Package Manager**: npm (or yarn if team consensus)  
**Code Quality**: ESLint (TypeScript parser) + Prettier for formatting  
**No Testing**: Unit, integration, and end-to-end tests are OUT OF SCOPE for this personal project

## Code Quality Patterns

- **Type Safety**: No `any` types without documented justification
- **Linting**: ESLint configuration enforces code style consistency
- **Formatting**: Prettier enforces consistent code formatting
- **Documentation**: Public APIs and complex logic MUST have JSDoc comments
- **Naming**: Use clear, descriptive names; avoid single-letter variables except in tight scopes (loops, lambdas)
- **Function Length**: Functions MUST remain reasonably short (~20 lines ideally); longer functions MUST have clear structure
- **Comments**: Comments explain WHY, not WHAT; code structure makes WHAT clear

## Governance

This Constitution supersedes all other coding practices in this project. Amendments require documentation of the change rationale, updated version number, and explicit approval.

**Versioning**: MAJOR.MINOR.PATCH

- **MAJOR**: Principle removals incompatible with prior versions or redefinitions
- **MINOR**: New principle or materially expanded guidance
- **PATCH**: Clarifications, wording, non-semantic refinements

**Compliance**: All features and pull requests MUST verify compliance with these principles. Deviations MUST be justified and documented in the PR description or design document.

**Version**: 1.0.0 | **Ratified**: 2026-05-08 | **Last Amendment**: 2026-05-08
