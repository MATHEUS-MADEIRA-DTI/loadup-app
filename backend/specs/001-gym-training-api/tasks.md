# Tasks: LoadUp Backend Implementation

## Phase 1: Setup (Shared Infrastructure)

- [x] T001 [P] Initialize NestJS project with TypeScript strict mode
- [x] T002 [P] Add MongoDB and Mongoose dependencies in package.json
- [x] T003 [P] Configure ESLint and Prettier in .eslintrc.json and .prettierrc
- [x] T004 [P] Create tsconfig.json with "strict": true and NestJS compiler settings
- [x] T005 [P] Add .env.example with MONGODB_URI, JWT_SECRET, JWT_EXPIRES_IN, NODE_ENV
- [x] T006 [P] Create src/main.ts with ValidationPipe, global filters, and timezone handling bootstrap
- [x] T007 [P] Create src/app.module.ts wiring ConfigModule, MongooseModule, and domain modules
- [x] T008 [P] Create src/config/database.config.ts and src/config/jwt.config.ts
- [x] T009 [P] Create src/config/timezone.config.ts with America/Sao_Paulo as default timezone
- [x] T010 [P] Create src/common/pipes/validation.pipe.ts and src/common/filters/http-exception.filter.ts
- [x] T011 [P] Create src/common/utils/timezone.util.ts to convert UTC dates to America/Sao_Paulo

---

## Phase 2: Foundational (Blocking Prerequisites)

- [x] T012 [P] Create src/common/guards/jwt.guard.ts to validate JWT on protected routes
- [x] T013 [P] Create src/common/decorators/current-user.decorator.ts for authenticated user injection
- [x] T014 [P] Create src/common/interceptors/transform.interceptor.ts for consistent API response formatting
- [x] T015 [P] Create src/users/schemas/user.schema.ts and src/users/entities/user.entity.ts
- [x] T016 [P] Create src/users/users.module.ts, src/users/users.service.ts, and src/users/users.controller.ts
- [x] T017 [P] Create src/auth/auth.module.ts, src/auth/auth.service.ts, src/auth/auth.controller.ts
- [x] T018 [P] Create src/auth/strategies/jwt.strategy.ts and integrate it with AuthModule
- [x] T019 [P] Create src/auth/dto/register.dto.ts and src/auth/dto/login.dto.ts with class-validator rules
- [x] T020 [P] Create src/users/dto/create-user.dto.ts and src/users/dto/update-user.dto.ts
- [x] T021 [P] Create src/common/constants/error-codes.ts for shared error handling
- [x] T022 [P] Add Mongoose connection in src/app.module.ts using src/config/database.config.ts
- [x] T023 [P] Add JWT module configuration in src/auth/auth.module.ts using src/config/jwt.config.ts

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1)

**Goal**: Allow new users to register, login, and receive JWT tokens.

**Independent Test**: Register a new user, login with credentials, and use JWT to access a protected endpoint.

- [x] T024 [US1] Implement src/auth/auth.controller.ts POST /auth/register using AuthService
- [x] T025 [US1] Implement src/auth/auth.controller.ts POST /auth/login using AuthService
- [x] T026 [US1] Implement src/auth/auth.service.ts with bcrypt password hashing and JWT generation
- [x] T027 [US1] Implement src/users/users.service.ts methods to create and find users by email
- [x] T028 [US1] Add JWT validation to src/common/guards/jwt.guard.ts and apply it to protected controllers
- [x] T029 [US1] Add user registration and login error handling in src/common/filters/http-exception.filter.ts
- [x] T030 [US1] Update src/app.module.ts to import AuthModule and UsersModule

---

## Phase 4: User Story 2 - Create and Manage Training Sheet by Days of Week (Priority: P1)

**Goal**: Provide one active training sheet per user with 7 days and toggleable training/rest days.

**Independent Test**: Create a training sheet, retrieve it, and update a day status to training or rest.

- [x] T031 [US2] Create src/training-sheet/schemas/day.schema.ts and src/training-sheet/schemas/training-sheet.schema.ts
- [x] T032 [US2] Create src/training-sheet/dto/create-training-sheet.dto.ts and src/training-sheet/dto/update-day.dto.ts
- [x] T033 [US2] Create src/training-sheet/training-sheet.module.ts, src/training-sheet/training-sheet.service.ts, and src/training-sheet/training-sheet.controller.ts
- [x] T034 [US2] Implement src/training-sheet/training-sheet.service.ts createTrainingSheet and getTrainingSheet methods
- [x] T035 [US2] Implement src/training-sheet/training-sheet.controller.ts POST /training-sheet and GET /training-sheet
- [x] T036 [US2] Implement src/training-sheet/training-sheet.service.ts updateDayStatus method and controller PATCH /training-sheet/days/:dayOfWeek
- [x] T037 [US2] Implement src/training-sheet/training-sheet.controller.ts GET /training-sheet/days/:dayOfWeek
- [x] T038 [US2] Add validation to src/training-sheet/dto/create-training-sheet.dto.ts for exactly 7 days and valid status values
- [x] T039 [US2] Add business rule in src/training-sheet/training-sheet.service.ts to enforce one active training sheet per user

---

## Phase 5: User Story 3 - Add and Manage Exercises in Training Sheet (Priority: P1)

**Goal**: Enable users to add, update, retrieve, and delete exercises within a training day.

**Independent Test**: Add an exercise to a training day, update it, retrieve it, and delete it.

- [x] T040 [US3] Create src/exercises/dto/create-exercise.dto.ts and src/exercises/dto/update-exercise.dto.ts
- [x] T041 [US3] Create src/exercises/exercises.module.ts, src/exercises/exercises.service.ts, and src/exercises/exercises.controller.ts
- [x] T042 [US3] Implement src/exercises/exercises.service.ts addExerciseToDay method
- [x] T043 [US3] Implement src/exercises/exercises.controller.ts POST /training-sheet/days/:dayOfWeek/exercises
- [x] T044 [US3] Implement src/exercises/exercises.service.ts getExercisesForDay and getExerciseById methods
- [x] T045 [US3] Implement src/exercises/exercises.controller.ts GET /training-sheet/days/:dayOfWeek/exercises and GET /training-sheet/days/:dayOfWeek/exercises/:exerciseId
- [x] T046 [US3] Implement src/exercises/exercises.service.ts updateExerciseInDay and deleteExerciseFromDay methods
- [x] T047 [US3] Implement src/exercises/exercises.controller.ts PATCH /training-sheet/days/:dayOfWeek/exercises/:exerciseId and DELETE /training-sheet/days/:dayOfWeek/exercises/:exerciseId
- [x] T048 [US3] Add validation to src/exercises/dto/create-exercise.dto.ts for series types, reps range, and required fields
- [x] T049 [US3] Add business rule in src/exercises/exercises.service.ts to reject exercise adds on rest days

---

## Phase 6: User Story 4 - Record Training Session with Metrics (Priority: P2)

**Goal**: Store workout session records with per-set weight, reps, and rest time.

**Independent Test**: Create a training session, add a record, retrieve the session, and update or delete the record.

- [x] T050 [US4] Create src/training-session/schemas/session-record.schema.ts and src/training-session/schemas/training-session.schema.ts
- [x] T051 [US4] Create src/training-session/dto/create-training-session.dto.ts, src/training-session/dto/record-set.dto.ts, and src/training-session/dto/update-training-session.dto.ts
- [x] T052 [US4] Create src/training-session/training-session.module.ts, src/training-session/training-session.service.ts, and src/training-session/training-session.controller.ts
- [x] T053 [US4] Implement src/training-session/training-session.service.ts createTrainingSession and getTrainingSession methods
- [x] T054 [US4] Implement src/training-session/training-session.controller.ts POST /training-sessions and GET /training-sessions/:sessionId
- [x] T055 [US4] Implement src/training-session/training-session.service.ts addRecordToSession, updateSessionRecord, and deleteSessionRecord methods
- [x] T056 [US4] Implement src/training-session/training-session.controller.ts POST /training-sessions/:sessionId/records, PATCH /training-sessions/:sessionId/records/:recordId, DELETE /training-sessions/:sessionId/records/:recordId
- [x] T057 [US4] Implement src/training-session/training-session.controller.ts PATCH /training-sessions/:sessionId/complete
- [x] T058 [US4] Implement src/training-session/training-session.controller.ts GET /training-sessions/today
- [x] T059 [US4] Add validation in src/training-session/dto/record-set.dto.ts for weight, repsCompleted, and restTime ranges

---

## Phase 7: User Story 5 - View Progression and Track Evolution (Priority: P2)

**Goal**: Provide progression summaries, exercise history, and chart-ready trend data.

**Independent Test**: Query progression endpoints for exercise history, summary, and chart output.

- [x] T060 [US5] Create src/progression/progression.module.ts, src/progression/progression.service.ts, and src/progression/progression.controller.ts
- [x] T061 [US5] Create src/progression/dto/progression-data.dto.ts and src/progression/dto/progression-chart.dto.ts
- [x] T062 [US5] Implement src/progression/progression.service.ts to compute exercise progression from TrainingSession records
- [x] T063 [US5] Implement src/progression/progression.controller.ts GET /progression/exercise/:exerciseName
- [x] T064 [US5] Implement src/progression/progression.controller.ts GET /progression/summary
- [x] T065 [US5] Implement src/progression/progression.controller.ts GET /progression/chart/:exerciseName
- [x] T066 [US5] Implement src/progression/progression.controller.ts GET /progression/body-part/:muscleGroup
- [x] T067 [US5] Add date range filtering and America/Sao_Paulo conversion in progression service methods
- [x] T068 [US5] Add trend and personal record logic in src/progression/progression.service.ts

---

## Phase 8: User Story 6 - Calendar System and Daily Workout View (Priority: P2)

**Goal**: Show today’s workout, full month view, and allow marking a day completed/skipped.

**Independent Test**: Retrieve today’s calendar summary, full monthly calendar, and mark a day as completed or skipped.

- [x] T069 [US6] Create src/calendar/calendar.module.ts, src/calendar/calendar.service.ts, and src/calendar/calendar.controller.ts
- [x] T070 [US6] Create src/calendar/dto/calendar-view.dto.ts
- [x] T071 [US6] Implement src/calendar/calendar.service.ts getTodayView and getMonthlyView methods
- [x] T072 [US6] Implement src/calendar/calendar.service.ts getDayDetails and getWeeklyView methods
- [x] T073 [US6] Implement src/calendar/calendar.service.ts markDayStatus method for completed/skipped/reset actions
- [x] T074 [US6] Implement src/calendar/calendar.controller.ts GET /calendar/today
- [x] T075 [US6] Implement src/calendar/calendar.controller.ts GET /calendar and GET /calendar/week
- [x] T076 [US6] Implement src/calendar/calendar.controller.ts GET /calendar/:dateString and PATCH /calendar/:dateString/mark
- [x] T077 [US6] Add America/Sao_Paulo timezone conversion and date validation in src/calendar/calendar.service.ts

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Finish shared infrastructure and ensure consistent behavior across modules.

- [x] T078 [P] Update src/common/middleware/timezone.middleware.ts or src/common/utils/timezone.util.ts to enforce America/Sao_Paulo conversions globally
- [x] T079 [P] Add src/common/interceptors/transform.interceptor.ts to convert outgoing dates to America/Sao_Paulo ISO strings
- [x] T080 [P] Add src/common/guards/jwt.guard.ts to all protected endpoints in Auth, TrainingSheet, Exercises, TrainingSession, Calendar, and Progression
- [x] T081 [P] Add centralized validation and error response patterns in src/common/filters/http-exception.filter.ts and src/common/pipes/validation.pipe.ts
- [x] T082 [P] Document backend API contract assumptions in specs/001-gym-training-api/README.md or quickstart.md if needed
- [x] T083 [P] Review tsconfig.json, .eslintrc.json, and .prettierrc for strict mode and formatting consistency
- [x] T084 [P] Confirm all endpoints return dates in America/Sao_Paulo timezone as required by the spec
- [x] T085 [P] Remove any test scaffolding or placeholder test files, since no tests are required for this feature

---

## Phase 10: User Entity — Add `name` Field (spec update May 12, 2026)

**Goal**: Add required `name` field (non-empty string) to User registration and persistence, per FR-001 update.

- [x] T086 [P] Add `name` prop to `src/users/schemas/user.schema.ts`: `@Prop({ required: true, trim: true })` before the `email` field
- [x] T087 [P] Add `name` field to `src/auth/dto/register.dto.ts`: `@IsString() @IsNotEmpty() name: string;` (import `IsString`, `IsNotEmpty` from `class-validator`)
- [x] T088 [P] Update `src/auth/auth.service.ts` register method to pass `name` when calling `UsersService.create()` (destructure `name` from `RegisterDto` and include in the user creation payload)
- [x] T089 [P] Update `src/auth/auth.service.ts` register response to include `name` in the returned object alongside `id`, `email`, `token`, and `createdAt`
- [x] T090 [P] Update `src/users/users.service.ts` `create()` method signature to accept and persist `name` in the new User document

---

## Dependencies & Execution Order

- Phase 2 Foundational depends on Phase 1 Setup
- Phase 3-8 user stories depend on Phase 2 Foundational
- Phase 3-5 all depend on core Auth and TrainingSheet modules
- Phase 6 Training Session depends on TrainingSheet, Exercises, and Auth
- Phase 7 Progression depends on Training Session and Auth
- Phase 8 Calendar depends on Training Sheet, Training Session, and Auth
- Phase 9 Polish depends on all prior phases

## Parallel Opportunities

- T001-T011 can run in parallel during initial setup
- T012-T023 can run in parallel for foundational infrastructure
- Within each story phase, model/schema tasks can run in parallel with DTO and module scaffolding tasks
- T078-T085 are cross-cutting polish tasks that can also run in parallel after core endpoints exist

## Suggested MVP Scope

- MVP should stop after completing Phase 5 (User Story 3) if the goal is to deliver a functional training plan with exercise management
- For full backend release, continue through Phase 8 with Training Session, Progression, and Calendar
- Phase 9 is final polish and enforcement of timezone and security constraints
