# Feature Specification: Plateau Detection Agent

**Feature Branch**: `004-plateau-agent`  
**Created**: 2026-05-12  
**Status**: Draft

## User Scenarios & Testing _(mandatory)_

### User Story 1 — View Plateau Alerts for All Exercises (Priority: P1)

After completing a training session, the user can consult a list of all exercises where progression has stalled, so they know which ones need attention before their next workout.

**Why this priority**: This is the core output of the feature. Without it, nothing else is deliverable. Detection without visibility has zero user value.

**Independent Test**: Call `GET /plateau/alerts` with a valid JWT after seeding at least one exercise with 4+ identical sessions. Verify the response contains a plateau alert for that exercise with a suggestion.

**Acceptance Scenarios**:

1. **Given** an exercise "Supino Reto" has been performed with 80kg × 8 reps (working series) in 4 consecutive sessions, **When** `GET /plateau/alerts` is called, **Then** the response includes a plateau alert for "Supino Reto" with a progression suggestion.
2. **Given** the user has no exercises in plateau, **When** `GET /plateau/alerts` is called, **Then** the response is an empty array with HTTP 200.
3. **Given** an exercise has been performed with 80kg × 8 in 2 sessions and then 85kg × 8 in 2 sessions, **When** `GET /plateau/alerts` is called, **Then** no plateau is reported for that exercise (progression detected).
4. **Given** an exercise has "warm-up" or "adjustment" series with identical weight/reps but no repeating "working" series, **When** `GET /plateau/alerts` is called, **Then** no plateau is reported (only "working" series are analyzed).

---

### User Story 2 — View Plateau Status for a Specific Exercise (Priority: P2)

The user looks up the plateau status of a single exercise by name to understand its progression history in detail.

**Why this priority**: Supports the detailed view that a UI drill-down requires. Depends on P1 detection being in place.

**Independent Test**: Call `GET /plateau/alerts/:exerciseName` with a known plateaued exercise name and verify the response contains the plateau details and suggestion for that exercise only.

**Acceptance Scenarios**:

1. **Given** "Agachamento" is in plateau, **When** `GET /plateau/alerts/Agachamento` is called, **Then** the response includes the alert details and suggestion for that exercise.
2. **Given** "Rosca Direta" is not in plateau, **When** `GET /plateau/alerts/Rosca%20Direta` is called, **Then** the response returns HTTP 200 with `plateau: false` and no suggestion.
3. **Given** the exercise name does not match any recorded exercise, **When** the endpoint is called, **Then** the response returns HTTP 200 with `plateau: false` (not 404 — absence of data is not an error).

---

### User Story 3 — Automatic Detection on Session Completion (Priority: P1)

When the user marks a training session as "completed", the system automatically runs plateau detection for all exercises in that session and updates the saved alerts. No manual trigger is needed.

**Why this priority**: P1 alongside US1 — the detection must happen automatically. Manual trigger would require the frontend to manage timing, creating coupling and missed updates.

**Independent Test**: Mark a session as "completed" via `PATCH /training-sessions/:sessionId/complete`. Then call `GET /plateau/alerts` and verify that plateau results reflect the updated session data.

**Acceptance Scenarios**:

1. **Given** completing a session pushes an exercise over the 4-session threshold, **When** the session is marked as "completed", **Then** a plateau alert is created or updated for that exercise automatically.
2. **Given** completing a session shows progression (weight or reps increased), **When** the session is marked as "completed", **Then** any existing plateau alert for that exercise is removed or marked resolved.
3. **Given** a session is marked "completed" but contains no "working" series, **When** detection runs, **Then** no plateau alerts are created or modified.
4. **Given** the detection logic fails (e.g., DB error), **When** the session is marked "completed", **Then** the session completion still succeeds — plateau detection failure must not block the primary action.

---

### User Story 4 — Training-Day Aggregate Alert (Priority: P3)

When 2 or more exercises in the same training day are simultaneously in plateau, a day-level aggregate alert is generated summarizing the stagnation.

**Why this priority**: P3 — nice-to-have context that summarizes individual exercise alerts. US1–US3 are fully valuable without it.

**Independent Test**: Seed 2 plateaued exercises on the same `dayOfWeek`. Call `GET /plateau/alerts` and verify a day-level alert is included in the response alongside the individual exercise alerts.

**Acceptance Scenarios**:

1. **Given** "Segunda" has 2 exercises both in plateau, **When** `GET /plateau/alerts` is called, **Then** the response includes a day-level alert for "Segunda" stating how many exercises are stagnated.
2. **Given** "Terça" has only 1 exercise in plateau, **When** `GET /plateau/alerts` is called, **Then** no day-level alert is generated for "Terça".
3. **Given** exercises from different days are both in plateau, **When** `GET /plateau/alerts` is called, **Then** each day that qualifies gets its own day-level alert independently.

---

### Edge Cases

- What if a session is marked "completed" multiple times? → Detection must be idempotent — re-running produces the same result; no duplicate alerts.
- What if the user has fewer than 4 sessions recorded for an exercise? → No plateau is reported; insufficient data to make a determination.
- What if weight or reps data is missing from a session record? → That record is skipped during analysis; only records with both weight and reps present are considered.
- What if the exercise name changes between sessions (user edited it)? → Detection matches by the exact name stored in session records; renamed exercises are treated as new exercises.
- What if the plateau detection logic is slow (many sessions to analyze)? → Detection runs asynchronously as a side effect of session completion; latency must not affect the `PATCH /complete` response time.
- What if 2 weeks pass with only 2 sessions? → The 2-week rule triggers only if enough sessions exist; with fewer than 4 sessions in 2 weeks, no plateau is reported.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST expose a `GET /plateau/alerts` endpoint, protected by JWT authentication, that returns all active plateau alerts for the authenticated user.
- **FR-002**: The system MUST expose a `GET /plateau/alerts/:exerciseName` endpoint, protected by JWT authentication, that returns the plateau status for a named exercise.
- **FR-003**: Plateau detection MUST run automatically when a training session is marked as "completed" (triggered as a side effect of `PATCH /training-sessions/:sessionId/complete`).
- **FR-004**: Plateau detection MUST analyze only series with `type: "working"`. Warm-up and adjustment series MUST be excluded.
- **FR-005**: A plateau MUST be detected when the same exercise records the same weight AND same reps in 4 or more consecutive sessions, OR across a 2-week calendar period (whichever threshold is reached first).
- **FR-006**: Plateau detection MUST run per exercise individually, not per training day or per training sheet.
- **FR-007**: Each exercise-level plateau alert MUST include a human-readable progression suggestion in Portuguese.
- **FR-008**: If 2 or more exercises in the same `dayOfWeek` are simultaneously in plateau, the system MUST generate a day-level aggregate alert.
- **FR-009**: Plateau detection results MUST be persisted in MongoDB as `PlateauAlert` documents (upserted on each session completion), not recalculated on every read request.
- **FR-010**: Plateau detection failure MUST NOT block session completion — the `PATCH /complete` response must succeed even if detection throws an error.
- **FR-011**: The system MUST NOT expose the `EXERCISES_API_KEY` or any internal error details in plateau alert responses.
- **FR-012**: When progression is detected (weight or reps increase compared to the previous session), any existing plateau alert for that exercise MUST be removed or marked as resolved.

### Key Entities

- **PlateauAlert**: Represents a detected plateau. Attributes: `userId` (reference), `exerciseName` (string), `dayOfWeek` (string), `alertType` (`"exercise"` | `"day"`), `suggestion` (string | null), `sessionCount` (number — how many sessions triggered the alert), `detectedAt` (date), `resolvedAt` (date | null), `active` (boolean).
- **PlateauAnalysisResult**: Value object (not persisted). Attributes: `exerciseName`, `isInPlateau` (boolean), `consecutiveCount` (number), `suggestion` (string | null).

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Detection runs asynchronously after session completion. Frontend calls `GET /plateau/alerts` immediately after `PATCH /complete` and receives updated results. No polling required.
- **SC-002**: Plateau detection does not add more than 500ms to the session completion response time under normal load.
- **SC-003**: The same session being marked "completed" multiple times produces identical alert results (idempotent detection).
- **SC-004**: A user with no plateau exercises receives an empty array from `GET /plateau/alerts` (no false positives).
- **SC-005**: An exercise with 4 consecutive identical working-series sessions is always flagged (no false negatives for the primary detection rule).

## Assumptions

- The progression history analyzed for plateau detection comes from existing `TrainingSession` + `SessionRecord` documents (spec 002). No new data source is introduced.
- "Same weight AND same reps" means both values must be identical across sessions — changing either one is sufficient to reset the plateau counter.
- The "working" series type uses the existing `type: "working"` value already defined in `ExerciseSeries` (spec 001).
- Suggestion messages are static strings chosen from a fixed set based on the plateau type; no AI or dynamic generation is required. The selection logic and available strings are:

  **Exercise-level suggestions** (choose based on what is stagnant):
  | Condition | Suggestion |
  |-----------|------------|
  | Weight stagnant | "Tente aumentar 2.5kg no próximo treino" |
  | Reps stagnant | "Tente fazer mais 1 repetição na próxima sessão" |
  | Both weight and reps stagnant for 5+ sessions | "Considere reduzir o tempo de descanso entre séries" |
  | Both weight and reps stagnant for 5+ sessions (alternate) | "Tente variar o exercício por 1 semana" |

  **Day-level suggestion template**:
  - `"Seu treino de {dia} está estagnado — {n} exercícios sem evolução"`

  Where `{dia}` is the Portuguese day name (e.g., "Segunda", "Terça") and `{n}` is the count of plateaued exercises on that day.

- The 2-week rule is calendar-based: if the oldest and newest session in the plateau window are more than 14 days apart AND the exercise appears plateaued in those sessions, the alert triggers.
- `dayOfWeek` for aggregate alerts is sourced from the `dayOfWeek` field on `TrainingSession`.
- The existing `PATCH /training-sessions/:sessionId/complete` endpoint is the only trigger point; no cron job or background scheduler is required for MVP.
- Authentication uses the existing JWT guard — no new auth scope is needed.
- Push notifications for alerts are explicitly out of scope for this spec.
- Automatic training plan adjustment based on alerts is explicitly out of scope for this spec.
- Machine learning-based predictions are explicitly out of scope for this spec.
