# Tasks: Plateau Detection Agent

**Input**: Design documents from `specs/004-plateau-agent/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/plateau-alerts.yaml
**Tests**: None (out of scope per constitution)
**Branch**: `004-plateau-agent`

---

## Phase 1: Setup — Install Dependency

**Purpose**: Add `@nestjs/event-emitter` so the async event bus is available for NestJS DI.

- [x] T001 Run `npm install @nestjs/event-emitter` in `C:\Users\dti-\Documents\LoadUp\backend` and verify the package appears in `package.json` under `dependencies`

**Checkpoint**: `npm install` exits 0; `@nestjs/event-emitter` visible in `package.json`.

---

## Phase 2: Foundational — Constants + Schema + DTOs + Analyzer (Blocking Prerequisites)

**Purpose**: All shared infrastructure that the service, listener, controller, and module depend on. Must be complete before any orchestration or wiring can be implemented.

**⚠️ CRITICAL**: No user-story work can begin until T002–T006 are complete.

- [x] T002 Create `src/plateau/constants/suggestions.ts`
- [x] T003 [P] Create `src/plateau/schemas/plateau-alert.schema.ts`
- [x] T004 [P] Create `src/plateau/dto/plateau-alert.dto.ts`
- [x] T005 [P] Create `src/plateau/plateau.analyzer.ts`
- [x] T006 [P] Export `interface SessionCompletedEvent`

**Checkpoint**: `npx tsc --noEmit` returns zero errors on the new files. No runtime yet — module not registered.

---

## Phase 3: US1 + US3 — Service + Listener (Detection + Read Endpoints)

**Goal**: Detection runs asynchronously on session completion and results are persisted. `GET /plateau/alerts` returns active alerts.

**Independent Test**: Mark a session as completed. Query `GET /plateau/alerts` immediately after. Verify updated plateau results are returned.

- [x] T007 Create `src/plateau/plateau.service.ts` — inject `@InjectModel(PlateauAlert.name) private readonly alertModel: Model<PlateauAlertDocument>`, `PlateauAnalyzer`, and `@InjectModel(TrainingSession.name) private readonly sessionModel: Model<TrainingSessionDocument>`; implement `async runDetectionForUser(userId: string): Promise<void>` that: (1) queries all `TrainingSession` docs for user sorted by `date` descending, with `.lean()`, (2) builds `SessionSnapshot[]` from `session.records` where `seriesType === 'working'`, mapping `exerciseName`, `dayOfWeek` (from session), `date` (from session), `weight` (from record), `reps` (from `repsCompleted`), (3) calls `this.analyzer.analyze(snapshots)`, (4) for each result calls `findOneAndUpdate({ userId: toObjectId(userId), exerciseName, alertType: 'exercise' }, { $set: { dayOfWeek, suggestion, sessionCount: consecutiveCount, active: isInPlateau, resolvedAt: isInPlateau ? null : new Date() }, $setOnInsert: { detectedAt: new Date() } }, { upsert: true, new: true })`, (5) after all exercise upserts, queries active exercise alerts grouped by `dayOfWeek`, upserts day-level alert for each day with `count >= 2`, deactivates day-level alerts for days that no longer qualify; implement `async getActiveAlerts(userId: string): Promise<PlateauAlertItemDto[]>` returning `alertModel.find({ userId: toObjectId(userId), active: true }).lean()`; implement `async getAlertByExercise(userId: string, exerciseName: string): Promise<ExercisePlateauStatusDto>` returning the active alert if found or `{ exerciseName, plateau: false, suggestion: null }` if not; import `toObjectId` from `../common/utils/object-id.util`

- [x] T008 [P] Create `src/plateau/listeners/session-completed.listener.ts` — inject `PlateauService` and `Logger`; decorate class with `@Injectable()`; add method `@OnEvent('session.completed') async handleSessionCompleted(payload: SessionCompletedEvent): Promise<void>` that wraps `await this.plateauService.runDetectionForUser(payload.userId)` in try/catch and calls `this.logger.error(...)` on failure — never rethrows; import `OnEvent` from `@nestjs/event-emitter`, `SessionCompletedEvent` from `../../training-session/training-session.service`

**Checkpoint**: `npx tsc --noEmit` zero errors. Module not yet wired — no HTTP test possible.

---

## Phase 4: US2 — Controller

**Goal**: `GET /plateau/alerts` and `GET /plateau/alerts/:exerciseName` are accessible via HTTP with JWT auth.

**Independent Test**: Call `GET /plateau/alerts` with a valid JWT and verify HTTP 200 with `data: []` (empty).

- [x] T009 Create `src/plateau/plateau.controller.ts` — annotate with `@Controller('plateau')` and `@UseGuards(JwtAuthGuard)`; inject `PlateauService`; implement `@Get('alerts') async getAlerts(@CurrentUser('id') userId: string): Promise<PlateauAlertItemDto[]>` delegating to `this.plateauService.getActiveAlerts(userId)`; implement `@Get('alerts/:exerciseName') async getAlertByExercise(@CurrentUser('id') userId: string, @Param('exerciseName') exerciseName: string): Promise<ExercisePlateauStatusDto>` delegating to `this.plateauService.getAlertByExercise(userId, exerciseName)`; import `JwtAuthGuard` from `../common/guards/jwt.guard`, `CurrentUser` from `../common/decorators/current-user.decorator`

**Checkpoint**: `npx tsc --noEmit` zero errors.

---

## Phase 5: Module Wiring + Integration

**Goal**: `PlateauModule` wired; `TrainingSessionService` emits the event; `app.module.ts` registers everything.

- [x] T010 Create `src/plateau/plateau.module.ts` — import `MongooseModule.forFeature([{ name: PlateauAlert.name, schema: PlateauAlertSchema }, { name: TrainingSession.name, schema: TrainingSessionSchema }])`; declare providers `[PlateauAnalyzer, PlateauService, SessionCompletedListener]`; declare controllers `[PlateauController]`; no exports needed

- [x] T011 Edit `src/training-session/training-session.service.ts` — add `EventEmitter2` injection: add `private readonly eventEmitter: EventEmitter2` to the constructor parameter list; in `completeSession()`, after `session.status = status` and `return session.save()`, add `this.eventEmitter.emit('session.completed', { userId, sessionId, dayOfWeek: session.dayOfWeek } satisfies SessionCompletedEvent)` — emit AFTER save, fire-and-forget (no await); import `EventEmitter2` from `@nestjs/event-emitter`; the `SessionCompletedEvent` interface is already exported from this file (T006)

- [x] T012 Edit `src/app.module.ts` — add `EventEmitterModule.forRoot()` to the `imports` array (import from `@nestjs/event-emitter`); add `PlateauModule` to the `imports` array (import from `./plateau/plateau.module`); no other changes

**Checkpoint**: `npm run start:dev` starts without errors; `{/plateau/alerts, GET}` mapped in router output; `[PlateauModule]` initialized in logs.

---

## Phase 6: Validation — TypeScript + Smoke Test

**Goal**: Zero TS errors; server starts; endpoints respond correctly.

- [x] T013 Run `npx tsc --noEmit` in `C:\Users\dti-\Documents\LoadUp\backend` and fix any TypeScript errors until output is empty

- [x] T014 Start the server with `npm run start:dev` and verify: (1) server starts cleanly, (2) `GET /plateau/alerts` with valid JWT returns `{ data: [], timestamp: "..." }`, (3) `GET /plateau/alerts/SomeExercise` returns `{ data: { exerciseName: "SomeExercise", plateau: false, suggestion: null }, timestamp: "..." }`

---

## Dependencies Between Phases

```
Phase 1 (T001) → Phase 2 (T002–T006) → Phase 3 (T007–T008) → Phase 4 (T009) → Phase 5 (T010–T012) → Phase 6 (T013–T014)
```

| Phase | Tasks     | Depends on | Parallelizable within phase                           |
| ----- | --------- | ---------- | ----------------------------------------------------- |
| 1     | T001      | —          | —                                                     |
| 2     | T002–T006 | T001       | T003, T004, T005, T006 can run in parallel after T002 |
| 3     | T007–T008 | T002–T006  | T008 can start once T007 signature defined            |
| 4     | T009      | T007       | —                                                     |
| 5     | T010–T012 | T007–T009  | T011 and T012 after T010                              |
| 6     | T013–T014 | T010–T012  | T014 after T013                                       |

---

## Implementation Strategy

**MVP Scope**: Phases 1–6 deliver US1, US2, US3, and US4 as a complete working feature.

**Stop-and-confirm gates**:

- After Phase 1: confirm `@nestjs/event-emitter` installed
- After Phase 2: confirm `npx tsc --noEmit` passes on new files
- After Phase 3: confirm service and listener compile
- After Phase 4: confirm controller compiles
- After Phase 5: confirm server starts and endpoints are mapped
- After Phase 6: final validation complete
