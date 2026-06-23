# Tasks: External Exercise Search API

**Input**: Design documents from `specs/003-exercise-api-mcp/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/search-exercises.yaml
**Tests**: None (out of scope per constitution)
**Branch**: `003-exercise-api-mcp`

---

## Phase 1: Setup — Install Dependency

**Purpose**: Add `@nestjs/axios` to the project so HttpModule is available for NestJS DI.

- [x] T001 Run `npm install @nestjs/axios axios` in `C:\Users\dti-\Documents\LoadUp\backend` and verify the packages appear in `package.json` under `dependencies`

**Checkpoint**: `npm install` exits 0; `@nestjs/axios` visible in `package.json`.

---

## Phase 2: Foundational — Config + Schema + DTOs + Mapper (Blocking Prerequisites)

**Purpose**: All shared infrastructure that US1, US2, and US3 depend on. Must be complete before the service, client, controller, or module can be implemented.

**⚠️ CRITICAL**: No user-story work can begin until T002–T007 are complete.

- [x] T002 Create `src/exercises-api/config/exercises-api.config.ts` — export `exercisesApiConfig` using `registerAs('exercisesApi', () => { ... })` that reads `process.env.EXERCISES_API_KEY`; if missing, throws `new Error('[ExercisesApi] EXERCISES_API_KEY is required but not set')` synchronously; also exports `ExercisesApiConfig` interface with `{ apiKey: string; baseUrl: string }` where `baseUrl = 'https://api.api-ninjas.com/v1/exercises'`

- [x] T003 [P] Create `src/exercises-api/schemas/exercise-cache.schema.ts` — define `ExerciseCacheEntry` class (plain class, not decorated) with fields `name: string`, `muscleGroup: string`, `type: string`, `equipment: string`, `instructions: string`; define `ExerciseCache` class decorated with `@Schema({ collection: 'exercise_caches' })` extending `Document` with `@Prop` fields: `cacheKey: string` (required, unique, index), `results: ExerciseCacheEntry[]` (type: raw subdoc array), `createdAt: Date` (required), `expiresAt: Date` (required, index); export `ExerciseCacheSchema = SchemaFactory.createForClass(ExerciseCache)` and `ExerciseCacheDocument = ExerciseCache & Document`

- [x] T004 [P] Create `src/exercises-api/dto/search-exercises.dto.ts` — export `SearchExercisesDto` with two optional fields: `name?: string` decorated with `@IsOptional() @IsString() @MaxLength(100) @Matches(/^[\p{L}0-9\s_\-]+$/u, { message: 'name contains invalid characters' })`; `muscle?: string` with same decorators; export `SearchExercisesResponseDto` with fields `results: ExerciseResultDto[]`, `cached: boolean`, `warning: string | null`

- [x] T005 [P] Create `src/exercises-api/dto/exercise-result.dto.ts` — export `ExerciseResultDto` with fields `name: string`, `muscleGroup: string`, `type: string`, `equipment: string`, `instructions: string`; all fields decorated with `@Expose()` for class-transformer compatibility

- [x] T006 [P] Create `src/exercises-api/mappers/muscle-group.mapper.ts` — define `MUSCLE_MAP: Record<string, string>` with all 15 EN→PT entries from plan.md; export `mapMuscleGroup(value: string): string` that returns `MUSCLE_MAP[value.toLowerCase()] ?? value`; compute `REVERSE_MUSCLE_MAP: Record<string, string>` via `Object.entries(MUSCLE_MAP).reduce(...)` (PT→EN, last-write-wins for collisions); export `mapMuscleGroupToEnglish(ptValue: string): string` that returns `REVERSE_MUSCLE_MAP[ptValue.trim().toLowerCase()] ?? ptValue`; add JSDoc comment on `mapMuscleGroupToEnglish` documenting the collision approximation (e.g., "Perna" → "calves")

- [x] T007 [P] Create `src/exercises-api/exercises-api.client.ts` — inject `HttpService` from `@nestjs/axios` and `ConfigService`; expose `async search(name?: string, muscleEn?: string): Promise<ApiNinjasExercise[]>` that builds query params from non-undefined inputs, calls `lastValueFrom(this.httpService.get<ApiNinjasExercise[]>(baseUrl, { headers: { 'X-Api-Key': apiKey }, params }))`, returns `response.data`; define `ApiNinjasExercise` interface (`name`, `muscle`, `type`, `equipment`, `instructions`, all `string`); wrap the call in try/catch and rethrow as a plain `Error` with message `'ExternalApiUnavailable'` — never log or rethrow the raw Axios error (which may contain the API key in headers)

**Checkpoint**: `npx tsc --noEmit` returns zero errors. No runtime yet — module not registered.

---

## Phase 3: User Story 1 + 2 — Search Endpoint with Cache (P1 + P2)

**Goal**: `GET /exercises/search?name=...&muscle=...` returns exercise results from cache or external API.

**Independent Test**: Start the server and call `GET /exercises/search?name=bench press` with a valid JWT. First call hits API Ninjas and returns results with `cached: false`. Second identical call returns `cached: true` without contacting the external API.

- [x] T008 Create `src/exercises-api/exercises-api.service.ts` — inject `@InjectModel(ExerciseCache.name) private readonly cacheModel: Model<ExerciseCacheDocument>` and `ExercisesApiClient`; implement `async search(dto: SearchExercisesDto): Promise<SearchExercisesResponseDto>` using the orchestration logic from plan.md Phase 1 pseudocode:
  1. Build `cacheKey` from `[dto.name, dto.muscle].filter(Boolean).map(s => s.trim().toLowerCase()).join('|')`
  2. Query fresh cache: `cacheModel.findOne({ cacheKey, expiresAt: { $gt: new Date() } })`
  3. On hit: return `{ results: entry.results, cached: true, warning: null }`
  4. On miss: call `client.search(dto.name, dto.muscle ? mapMuscleGroupToEnglish(dto.muscle) : undefined)`; on success: map results with `mapMuscleGroup()`, upsert cache (`findOneAndUpdate` with `upsert: true`, set `results`, `createdAt`, `expiresAt = now + 7 days`), return `{ results, cached: false, warning: null }`
  5. On `ExternalApiUnavailable` error: try stale fallback (`findOne({ cacheKey })`); if found return `{ results, cached: true, warning: 'Resultados em cache (API externa indisponível)' }`; else return `{ results: [], cached: false, warning: 'Serviço de exercícios temporariamente indisponível' }`
  6. If MongoDB is unavailable during cache read: log the error and proceed directly to the external API call (do not surface to caller)

- [x] T009 [P] Create `src/exercises-api/exercises-api.controller.ts` — annotate with `@Controller('exercises')` and `@UseGuards(JwtAuthGuard)`; inject `ExercisesApiService`; implement `@Get('search') async search(@Query() dto: SearchExercisesDto): Promise<SearchExercisesResponseDto>`; add manual validation: if `!dto.name && !dto.muscle` throw `new BadRequestException("Pelo menos um dos parâmetros 'name' ou 'muscle' deve ser fornecido")`; delegate to `this.exercisesApiService.search(dto)` and return result directly

**Checkpoint**: `npx tsc --noEmit` zero errors. Module not yet wired — no HTTP test possible yet.

---

## Phase 4: Module Wiring + App Registration

**Goal**: Make the new module loadable by NestJS and register `ExercisesApiModule` in `app.module.ts`.

- [x] T010 Create `src/exercises-api/exercises-api.module.ts` — import `HttpModule` from `@nestjs/axios`; import `MongooseModule.forFeature([{ name: ExerciseCache.name, schema: ExerciseCacheSchema }])`; import `ConfigModule.forFeature(exercisesApiConfig)`; declare providers `[ExercisesApiClient, ExercisesApiService]`; declare controllers `[ExercisesApiController]`; no exports needed

- [x] T011 Edit `src/app.module.ts` — add `ExercisesApiModule` to the `imports` array (import from `./exercises-api/exercises-api.module`); no other changes to this file

**Checkpoint**: `npm run start:dev` starts without errors; `EXERCISES_API_KEY` missing → NestJS bootstrap fails with `[ExercisesApi] EXERCISES_API_KEY is required but not set`.

---

## Phase 5: User Story 3 — Add Exercise from Search (P3)

**Goal**: Confirm the existing `POST /training-sheet/days/{dayOfWeek}/exercises` endpoint accepts a payload sourced from search results without modification.

**Independent Test**: Take a result object from `GET /exercises/search`, map it to `CreateExerciseDto` fields (`name`, `muscleGroup`, `series: []`), POST to the exercises endpoint for a training day, and verify the exercise appears in the day's list.

- [x] T012 Verify `src/exercises/dto/create-exercise.dto.ts` accepts `name: string`, `muscleGroup: string`, and optional `series` array — read the file and confirm the DTO fields are compatible with the fields returned by `GET /exercises/search`; if any required field is missing or incompatible, add it with `@IsOptional()` so the search-sourced payload works; do NOT otherwise modify `src/exercises/`

**Checkpoint**: A search result object can be sent to the existing exercises endpoint with no 400 errors caused by missing required fields.

---

## Phase 6: Validation — TypeScript + End-to-End Smoke Test

**Goal**: Zero TS errors; server starts; endpoint responds correctly in both cache-miss and cache-hit scenarios.

- [x] T013 Run `npx tsc --noEmit` in `C:\Users\dti-\Documents\LoadUp\backend` and fix any TypeScript errors until output is empty

- [x] T014 [P] Add `EXERCISES_API_KEY` to `.env` file (value: the actual API Ninjas key); confirm the variable name matches what `exercises-api.config.ts` reads from `process.env`

- [x] T015 Start the server with `npm run start:dev` and verify it starts without errors; confirm startup failure message appears if `EXERCISES_API_KEY` is removed from `.env`

---

## Dependencies Between Phases

```
Phase 1 (T001) → Phase 2 (T002–T007) → Phase 3 (T008–T009) → Phase 4 (T010–T011) → Phase 6 (T013–T015)
                                                                                     ↑
                                                               Phase 5 (T012) ───────┘
```

| Phase | Tasks     | Depends on       | Parallelizable within phase                      |
| ----- | --------- | ---------------- | ------------------------------------------------ |
| 1     | T001      | —                | —                                                |
| 2     | T002–T007 | T001             | T003, T004, T005, T006, T007 can run in parallel |
| 3     | T008–T009 | T002–T007        | T009 can start once T008 signature is defined    |
| 4     | T010–T011 | T008–T009        | T011 after T010                                  |
| 5     | T012      | T001 (read-only) | Independent of phases 2–4                        |
| 6     | T013–T015 | T010–T011        | T014 parallel with T013                          |

---

## Implementation Strategy

**MVP Scope**: Phases 1–4 + T013–T015 deliver US1 and US2 (search + cache) as a fully working API endpoint. This is the minimum viable delivery.

**Phase 5** (T012) is a read-and-verify task — US3 reuses the existing endpoint from spec 001 with no code changes expected.

**Stop-and-confirm gates** (as requested):

- After Phase 1: confirm `@nestjs/axios` installed
- After Phase 2: confirm `npx tsc --noEmit` passes on new files
- After Phase 3: confirm service and controller compile
- After Phase 4: confirm server starts and endpoint is reachable
- After Phase 5: confirm search-to-add flow works end-to-end
- After Phase 6: final validation complete

---

## Phase 7: FR-013 — Exercise Type Mapping (EN → PT)

**Purpose**: Apply `mapExerciseType()` to the `type` field of each result before caching, so all stored and returned exercise types are in Portuguese (spec.md FR-013).

**⚠️ Depends on**: T006 (mapper file) and T008 (service) — both already complete.

- [x] T016 [P] Edit `src/exercises-api/mappers/muscle-group.mapper.ts` — add `const EXERCISE_TYPE_MAP: Record<string, string>` with 7 entries (`strength → 'Força'`, `cardio → 'Cardio'`, `stretching → 'Alongamento'`, `powerlifting → 'Powerlifting'`, `plyometrics → 'Pliometria'`, `olympic_weightlifting → 'Halterofilia'`, `strongman → 'Strongman'`); add `export function mapExerciseType(value: string): string` that returns `EXERCISE_TYPE_MAP[value.toLowerCase()] ?? value`

- [x] T017 Edit `src/exercises-api/exercises-api.service.ts` — import `mapExerciseType` from `./mappers/muscle-group.mapper`; in the result mapping block, change `type: item.type` to `type: mapExerciseType(item.type)` so the type field is translated before the cache upsert

- [x] T018 Run `npx tsc --noEmit` and confirm zero errors; restart the server with `npm run start:dev` and confirm it starts cleanly

**Checkpoint**: `GET /exercises/search?name=bench press` returns `"type": "Força"` (not `"strength"`) for strength exercises; cached entries store the Portuguese value.
