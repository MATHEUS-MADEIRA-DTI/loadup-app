# Implementation Tasks: Exercise Database (005)

**Feature**: Exercise Database — Local JSON search replacing external API  
**Branch**: `005-exercise-database`  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)  
**Status**: Ready for Phase 1 implementation

---

## Phase 1: Setup & Foundation

> **Gate**: Confirm MuscleGroup enum has 11 values, Exercise entity has all new fields, exercises.json validates. **Target**: Complete before Phase 2.

### Core Infrastructure

- [x] T001 Update MuscleGroup enum: Add Trapézio, Antebraço, Panturrilha (8→11 groups) in `src/common/enums/muscle-group.enum.ts`

- [x] T002 [P] Update Exercise schema: Add `videoUrl: string`, `tip?: string`, `database: boolean` fields to `src/exercises/schemas/exercise.schema.ts`

- [x] T002b [P] Update Exercise DTOs: Add same fields to `src/exercises/dto/exercise.dto.ts` and create `src/exercises/dto/search-exercises.dto.ts` for request/response

- [x] T003 Validate exercises.json: Load `src/assets/exercises.json`, confirm 172 exercises exist, all have required fields (name, muscleGroup, videoUrl), all muscleGroups match 11-value enum. Create validation script in `scripts/validate-exercises.ts` (run once during setup)

---

## Phase 2: Foundational — Exercise Database Service

> **Gate**: Confirm ExerciseDatabaseService loads, caches, and searches exercises in <100ms. No external API calls. **Target**: Complete before Phase 3 (User Stories).

- [x] T004 Create ExerciseDatabaseService:
  - File: `src/exercises-api/services/exercise-database.service.ts`
  - Load `exercises.json` on app startup via `OnModuleInit`
  - Use `path.join(__dirname, '..', '..', 'assets', 'exercises.json')` for production-safe path resolution
  - Implement `search(name?: string, muscle?: string): Exercise[]` with case-insensitive partial name matching and AND logic for filters
  - Include `Logger` for startup messages

- [x] T005 Update ExercisesApiModule: Register ExerciseDatabaseService as injectable in `src/exercises-api/exercises-api.module.ts`

---

## Phase 3: User Story 1 — Local Exercise Search (P1)

> **Goal**: Enable fast local search without external API calls.  
> **Independent Test**: `GET /exercises/search?name=supino&muscle=Peito` returns results from local JSON with videoUrl and tip fields.  
> **Gate**: Response format matches spec 003 (frontend compat), search <100ms, zero external API calls. **Target**: By day 2 EOD.

- [x] T006 [US1] Remove API call from exercises-api service:
  - File: `src/exercises-api/exercises-api.service.ts`
  - Remove all external API references (API Ninjas, MyMemory)
  - Inject ExerciseDatabaseService
  - Update `search(name?: string, muscle?: string)` to call `ExerciseDatabaseService.search()` instead of HTTP client
  - Keep response DTO identical to spec 003

- [x] T007 [P] [US1] Update search endpoint:
  - File: `src/exercises-api/exercises-api.controller.ts`
  - Verify `GET /exercises/search?name={query}&muscle={muscle}` uses updated service
  - Confirm response includes `videoUrl` and `tip` from database
  - Keep route signature unchanged (frontend compat)

- [x] T008 [P] [US1] Remove TranslationService dependency from exercises-api:
  - File: `src/exercises-api/exercises-api.module.ts`
  - Remove `TranslationModule` import if present
  - Remove TranslationService injection from controller/service
  - Add `OnModuleInit` to trigger database load at startup

---

## Phase 4: User Story 2 — Video URLs and Tips (P2)

> **Goal**: Display video execution URLs and optional tips with exercises.  
> **Independent Test**: Exercise response includes `videoUrl` (YouTube URL) and `tip` fields. Frontend can render tip as link if starts with "https://".  
> **Gate**: All exercises have videoUrl and optional tip fields; response format verified. **Target**: By day 2 EOD (parallelizable with US1).

- [x] T009 [P] [US2] Verify videoUrl and tip fields in Exercise entity:
  - File: `src/exercises/schemas/exercise.schema.ts` (already updated in T002)
  - Confirm field types and optional status match spec (videoUrl: string, tip?: string)
  - Add to exercise response DTOs if not already done

- [x] T010 [P] [US2] Update training day schema references:
  - File: `src/training-sheet/schemas/training-day.schema.ts`
  - Confirm MuscleGroup enum reference matches updated enum from T001
  - Verify embedded Exercise schema includes new fields

---

## Phase 5: User Story 3 — Bulk CSV Import (P2)

> **Goal**: Enable bulk exercise import via CSV for power users and coaches.  
> **Independent Test**: Download CSV template, fill with valid data, upload, and verify exercises added to training day. Test validation errors with specific row/field messages.  
> **Gate**: CSV template downloads, import endpoint accepts upload, validation catches errors with specific row numbers. **Target**: By day 3.

### CSV Infrastructure

- [x] T011 [US3] Create CSV import DTO and types:
  - File: `src/exercises-api/dto/csv-import.dto.ts`
  - Define CSV row structure: `CsvExerciseRow { nome: string, grupo_muscular: string, video_url?: string, dica?: string }`
  - Define validation error structure: `CsvValidationError { row: number, field: string, message: string }`
  - Note: Series (tipo_serie, repeticoes) are NOT imported via CSV; users add exercises first, then configure series manually (same workflow as search)

- [x] T012 [US3] Create CsvImportService:
  - File: `src/exercises-api/services/csv-import.service.ts`
  - Parse CSV using Node.js built-in string operations (`.split()`, no papaparse)
  - Implement `validateCsvFile(buffer: Buffer): { errors: CsvValidationError[], rows: CsvExerciseRow[] }`
  - Validate each row:
    - Required fields: `nome`, `grupo_muscular` (must be non-empty strings)
    - `grupo_muscular` must be valid MuscleGroup enum value
    - Optional fields: `video_url` (if provided, validate URL format), `dica` (any string)
    - Collect ALL errors before returning (not fail-fast)
  - Return specific error messages with row numbers
  - Note: NO tipo_serie or repeticoes validation (series configured manually after import)

### CSV Endpoints

- [x] T013 [US3] Create CSV template endpoint:
  - File: `src/exercises-api/exercises-api.controller.ts`
  - Add `GET /exercises/csv-template` endpoint
  - Return semicolon-separated CSV file (UTF-8):
    ```
    nome;grupo_muscular;video_url;dica
    # Headers: exercise name (PT-BR); muscle group; YouTube URL (optional); tip (optional)
    # Required fields: nome, grupo_muscular
    # Optional fields: video_url, dica
    # Note: Series are configured manually after import (same workflow as search)
    Supino Reto Barra;Peito;https://youtu.be/sqOw2Y6uDWQ;Cotovelos em 45 graus
    Rosca Direta;Bíceps;;
    ```
  - Response headers: `Content-Type: text/csv; charset=utf-8`, `Content-Disposition: attachment; filename=exercicios_template.csv`

- [x] T014 [US3] Create CSV import endpoint:
  - File: `src/training-sheet/training-sheet.controller.ts`
  - Add `POST /:dayOfWeek/exercises/import` endpoint
  - Use Multer middleware for file upload (`@UseInterceptors(FileInterceptor('file'))`)
  - Accept `multipart/form-data` with `file` field
  - Call `CsvImportService.validateCsvFile(file.buffer)`
  - If validation errors exist: return 400 with error array `{ errors: CsvValidationError[] }`
  - If valid: call `TrainingSheetService.addExercisesFromCsv(dayOfWeek, csvRows)`
  - Return updated training day on success (201)

### CSV Integration with Training Service

- [x] T015 [US3] Update TrainingSheetService:
  - File: `src/training-sheet/training-sheet.service.ts`
  - Add method `addExercisesFromCsv(dayOfWeek: string, csvRows: CsvExerciseRow[]): Promise<TrainingDay>`
  - Convert CSV rows to Exercise objects (WITHOUT series):
    - Create Exercise: `{ name, muscleGroup, videoUrl, tip, series: [], database: true }`
    - Series array is EMPTY; user configures series manually afterwards (same workflow as search)
    - Set `database: true` flag for all imported exercises
  - Add exercises to training day's exercises array
  - Save and return updated training day
  - Return response includes empty series array; frontend will render form for user to add series

- [x] T016 [P] [US3] Update TrainingSheetModule:
  - File: `src/training-sheet/training-sheet.module.ts`
  - Register CsvImportService as injectable
  - Ensure Multer is configured (likely already present)

---

## Phase 6: Cleanup & Validation

> **Goal**: Remove translation module completely, validate TypeScript, perform end-to-end smoke test.  
> **Gate**: Server starts cleanly, zero TypeScript errors, full workflow (search + CSV import) works. **Target**: By day 3 EOD (final phase).

### Module Removal

- [x] T017 Delete translation module:
  - Remove folder: `src/translation/` (entire directory: `translation.module.ts`, `translation.service.ts`, `translation.client.ts`, `translation.config.ts`, `constants/translation.constants.ts`)

- [x] T018 Remove translation references from app:
  - File: `src/app.module.ts`
  - Remove `TranslationModule` import
  - Remove from `imports: []` array
  - Verify ExercisesApiModule is still imported

- [x] T019 [P] Verify no orphaned translation references:
  - Search entire codebase for `translation` (case-insensitive)
  - Search for `TranslationModule`, `TranslationService`, `TranslationClient`
  - Remove any remaining imports or references
  - Files to check: `src/exercises-api/`, `src/app.module.ts`, `src/main.ts`

### Validation & Testing

- [x] T020 TypeScript compilation check:
  - Run: `npx tsc --noEmit` from project root
  - Confirm zero errors
  - Confirm no `any` types without justification

- [x] T021 Smoke test workflow:
  - Start server: `npm run start:dev`
  - Test search endpoint:
    - `GET /exercises/search?name=supino` → verify results returned in <100ms
    - `GET /exercises/search?muscle=Peito` → verify muscle filter works
    - `GET /exercises/search?name=supino&muscle=Peito` → verify AND logic
  - Test CSV template:
    - `GET /exercises/csv-template` → verify CSV file downloads with headers and examples
  - Test CSV import:
    - Upload valid CSV to `POST /training-sheet/days/Monday/exercises/import` → verify exercises added
    - Upload CSV with invalid rows → verify validation errors returned with row numbers and field details
  - Verify no external API calls made during search

---

## Success Criteria

- ✅ All 21 tasks completed
- ✅ MuscleGroup enum has 11 values (8 original + 3 new)
- ✅ Exercise entity includes videoUrl, tip, database fields
- ✅ ExerciseDatabaseService loads exercises.json at startup in OnModuleInit
- ✅ Local search returns results in <100ms (no external API calls)
- ✅ Search response format matches spec 003 (frontend compat)
- ✅ CSV template endpoint downloads correctly
- ✅ CSV import validates with specific row/field errors
- ✅ CSV tipo_serie mapping works (Aquecimento→warm-up, etc.)
- ✅ Translation module completely removed
- ✅ TypeScript compilation: zero errors
- ✅ End-to-end workflow verified

---

## Stop-and-Confirm Gates

### After Phase 1 (T001-T003)

**Confirm before proceeding to Phase 2**:

- [x] MuscleGroup enum contains exactly 11 values (verify by running `npm run build`)
- [x] Exercise schema has `videoUrl: string`, `tip?: string`, `database: boolean` fields
- [x] exercises.json validation script runs without errors and confirms 172 exercises with required fields

### After Phase 2 (T004-T005)

**Confirm before proceeding to Phase 3-5**:

- [x] ExerciseDatabaseService loads exercises.json on app startup (check startup log)
- [x] Search performance <100ms (test manually: `GET /exercises/search?name=supino`)
- [x] No external API calls in network tab

### After Phase 3-4 (T006-T010)

**Confirm before proceeding to Phase 5**:

- [x] `GET /exercises/search?name=supino&muscle=Peito` returns results with videoUrl and tip fields
- [x] Response format identical to spec 003 (same DTO structure)
- [x] Translation module references removed from exercises-api

### After Phase 5 (T011-T016)

**Confirm before proceeding to Phase 6**:

- [x] `GET /exercises/csv-template` downloads UTF-8 CSV file with headers and examples
- [x] `POST /training-sheet/days/Monday/exercises/import` accepts file upload
- [x] CSV validation returns errors with specific row numbers and field details
- [x] Valid CSV adds exercises to training day and returns updated day

### After Phase 6 (T017-T021)

**FINAL GATE**:

- [x] `npx tsc --noEmit` returns zero errors
- [x] Server starts without errors: `npm run start:dev`
- [x] Full end-to-end workflow (search + CSV import) verified
- [x] No translation module references in codebase
- [x] All 11 muscle groups functional
- [x] Feature 005 fully implemented and ready for integration

---

## Implementation Notes

### Task Dependencies

- T001 must complete before T002-T003 (enum is blocker)
- T004-T005 must complete before T006-T010 (service is blocker)
- T002-T003 can run in parallel with T004-T005
- T006-T010 can run in parallel after their blockers
- T011-T016 can run in parallel (no inter-dependencies)
- T017-T021 must run after all other tasks complete

### Estimated Timeline

- Phase 1 (T001-T003): 30 minutes
- Phase 2 (T004-T005): 45 minutes
- Phase 3-4 (T006-T010): 1.5 hours (parallelizable)
- Phase 5 (T011-T016): 2 hours
- Phase 6 (T017-T021): 45 minutes
- **Total**: ~5 hours with parallelization

### Critical Files Reference

- Spec: [spec.md](spec.md) (3 User Stories, 12 Functional Requirements)
- Plan: [plan.md](plan.md) (Design decisions, implementation patterns)
- Database: `src/assets/exercises.json` (172 exercises, pre-created, ready to load)
- Constitution: `specs/technical-decisions.md` (cross-cutting rules: TypeScript strict, no tests, no external APIs)
