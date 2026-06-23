# Feature Specification: LoadUp Frontend Web Application

**Feature Branch**: `002-web-app`  
**Created**: 2026-05-11  
**Status**: Draft

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Authentication (Priority: P1)

A new user opens the app for the first time and creates an account using their email and password. On subsequent visits, they log in with the same credentials and are taken directly to the home screen. If they close the browser and return, they remain authenticated without needing to log in again until their session expires.

**Why this priority**: Authentication is the gateway to all other functionality. Without it, no other screen is accessible. It is the minimum viable entry point.

**Independent Test**: A user can open the app, register an account, and reach the home screen. Can be tested entirely without any training data.

**Acceptance Scenarios**:

1. **Given** the user is on the registration screen, **When** they submit a valid name, email and password, **Then** an account is created and they are redirected to the home screen.
2. **Given** the user is on the login screen, **When** they submit correct credentials, **Then** they are redirected to the home screen.
3. **Given** the user is authenticated and closes the browser, **When** they reopen the app, **Then** they remain logged in without re-entering credentials.
4. **Given** the user submits incorrect credentials, **When** login is attempted, **Then** a clear, user-friendly error message is displayed.
5. **Given** the user's session has expired, **When** they try to access any protected screen, **Then** they are redirected to the login screen.

---

### User Story 2 — Home & Calendar (Priority: P2)

A user opens the app on a training day and immediately sees what workout is planned for today. They complete their workout, then tap to mark the day as done. They can also browse the monthly calendar to see their history at a glance — which days they trained, skipped, or have planned ahead.

**Why this priority**: The home screen is the primary daily touchpoint. It delivers the most immediate value and drives daily engagement.

**Independent Test**: A user with an existing training sheet can open the app, view today's workout summary, mark today as completed, and view the monthly calendar — all without navigating to other screens.

**Acceptance Scenarios**:

1. **Given** today is a training day, **When** the user opens the home screen, **Then** the current day's exercises are listed with their series.
2. **Given** today is a rest day, **When** the user opens the home screen, **Then** a clear rest day indicator is displayed instead of exercises.
3. **Given** the user has not yet created a training sheet, **When** they open the home screen, **Then** they see a prompt to create one.
4. **Given** today's workout is pending, **When** the user taps "Mark as Completed", **Then** the day is saved as completed and the visual indicator updates.
5. **Given** the user taps "Skip Today", **When** confirmed, **Then** the day is saved as skipped with the appropriate indicator.
6. **Given** the monthly calendar is visible, **When** the user views it, **Then** completed days show a "done" indicator, skipped days show a "skipped" indicator, and future days show "pending".

---

### User Story 3 — Training Sheet Management (Priority: P3)

A user sets up or adjusts their weekly training plan. They define which days of the week are training days versus rest days, and for each training day they can navigate to manage exercises. A first-time user who has no plan can create one from scratch.

**Why this priority**: The training sheet is the foundation of all workout planning. Without it, the home screen and workout logging have nothing to display.

**Independent Test**: A user can create a training sheet, configure which days are training days, and navigate to each day — verifiable without logging any actual workouts.

**Acceptance Scenarios**:

1. **Given** the user has no training sheet, **When** they visit the training sheet screen, **Then** they see an option to create a new plan.
2. **Given** a training sheet exists, **When** the user views it, **Then** all 7 days of the week are displayed with their current type (training or rest).
3. **Given** a day is set to rest, **When** the user toggles it to training, **Then** it changes to a training day immediately.
4. **Given** a day is set to training, **When** the user taps on it, **Then** they are navigated to the exercises screen for that day.

---

### User Story 4 — Exercise Management (Priority: P4)

A user views the exercises planned for a specific training day and manages them. They can add new exercises, edit existing ones (including individual series), and remove exercises they no longer want.

**Why this priority**: Exercises are the core content unit. Training logging and progression depend on exercises being configured correctly.

**Independent Test**: A user can navigate to a training day, add an exercise with multiple series, edit one series, and delete the exercise — all within the exercises screen.

**Acceptance Scenarios**:

1. **Given** the user is on the exercises screen for a training day, **When** exercises exist, **Then** each exercise is shown with its name, muscle group, and list of series.
2. **Given** the user taps "Add Exercise", **When** they enter a name, select a muscle group, and add at least one series, **Then** the exercise is saved and appears in the list.
3. **Given** an exercise exists, **When** the user edits a series, **Then** they can change its type (warm-up, adjustment, working) and rep count.
4. **Given** an exercise exists, **When** the user deletes it, **Then** it is removed from the day after confirmation.
5. **Given** a training day has no exercises, **When** the user views it, **Then** an empty state message prompts them to add exercises.

---

### User Story 5 — Workout Logging (Priority: P5)

A user is at the gym and actively logging their workout. They see all planned exercises for today, and for each set they record how much weight they lifted, how many reps they completed, and their rest time. At the end, they mark the session as done.

**Why this priority**: This is the core in-gym interaction. It must be fast and usable with one hand under gym conditions.

**Independent Test**: A user with today's exercises configured can open the workout logging screen, log at least one set with weight, reps, and rest time, and mark the session as complete.

**Acceptance Scenarios**:

1. **Given** today has planned exercises, **When** the user opens the workout logging screen, **Then** all exercises and their sets are listed in order.
2. **Given** a set has not been logged yet, **When** the user taps on it, **Then** they can enter weight, reps, and rest time.
3. **Given** the user submits a logged set, **When** saved, **Then** that set visually changes to a "logged" state, distinguishable from pending sets.
4. **Given** the user has logged all (or some) sets, **When** they tap "Finish Session", **Then** the session is marked as completed.
5. **Given** the user decides not to train, **When** they tap "Skip Session", **Then** the session is marked as skipped.
6. **Given** a session is already marked completed, **When** the user revisits the screen, **Then** all logged sets are displayed in a read-only summary.

---

### User Story 6 — Progression Tracking (Priority: P6)

A user wants to see how they're improving over time for a specific exercise. They view a chart showing their weight and reps across past sessions, and a summary card showing their current training streak, total sessions, and personal records.

**Why this priority**: Progression is a motivational and analytical feature. It depends on workout log history, making it the last to be meaningful in the feature priority chain.

**Independent Test**: A user with at least one logged session can navigate to the progression screen, select an exercise, and view a chart with their history plus an overall summary card.

**Acceptance Scenarios**:

1. **Given** the user navigates to the progression screen, **When** they select an exercise, **Then** a chart displays weight and reps across all past sessions for that exercise.
2. **Given** there is no history for an exercise, **When** the user selects it, **Then** an empty state message is shown instead of the chart.
3. **Given** the user views the summary section, **When** data exists, **Then** current training streak, total sessions completed, and personal records are displayed.
4. **Given** no sessions have been logged yet, **When** the user opens the progression screen, **Then** a welcoming empty state is shown with guidance to start logging.

---

### Edge Cases

- What happens when the user opens the app with no internet connection?
- What happens when the user tries to access the workout logging screen on a rest day?
- What happens when today's session was already marked as completed and the user returns to the logging screen?
- What happens when an exercise is deleted from the training sheet after it already has progression history?
- What happens when the user has a training sheet but no exercises added to today's day?
- What happens if the JWT token expires mid-session while the user is actively logging a workout?

## Requirements _(mandatory)_

### Functional Requirements

**Authentication**

- **FR-001**: The application MUST allow users to create an account using name, email and password (all three fields are required; name must be non-empty).
- **FR-002**: The application MUST allow users to log in using email and password.
- **FR-003**: The application MUST maintain the user's authenticated session using a JWT token persisted across browser sessions.
- **FR-004**: The application MUST redirect authenticated users to the home screen after login or registration.
- **FR-005**: The application MUST redirect unauthenticated users to the login screen when accessing any protected route.

**Home & Calendar**

- **FR-006**: The home screen MUST display the current day's workout, including exercises and series, when today is a training day.
- **FR-007**: The home screen MUST clearly indicate when today is a rest day.
- **FR-008**: The home screen MUST display a prompt to create a training sheet when none exists.
- **FR-009**: Users MUST be able to mark today as completed directly from the home screen.
- **FR-010**: Users MUST be able to mark today as skipped directly from the home screen.
- **FR-011**: The home screen MUST include a monthly calendar view showing visual indicators for completed, skipped, and pending training days.

**Training Sheet**

- **FR-012**: The training sheet screen MUST display all 7 days of the week with their current type (training or rest).
- **FR-013**: Users MUST be able to create a training sheet when none exists.
- **FR-014**: Users MUST be able to toggle any day between training and rest.
- **FR-015**: Users MUST be able to navigate from any training day on the sheet to that day's exercise list.

**Exercises**

- **FR-016**: The exercises screen MUST list all exercises for a selected training day.
- **FR-017**: Users MUST be able to add a new exercise by providing: name, muscle group, and at least one series.
- **FR-018**: Each series MUST have a configurable type (warm-up, adjustment, or working) and a rep count.
- **FR-019**: Users MUST be able to edit an existing exercise's details and its series.
- **FR-020**: Users MUST be able to delete an exercise from a training day, with a confirmation step.

**Workout Logging**

- **FR-021**: The workout logging screen MUST display all planned exercises and their series for today's session.
- **FR-022**: For each set, users MUST be able to log: weight used, reps completed, and rest time.
- **FR-023**: Logged sets MUST be visually distinguished from pending sets.
- **FR-024**: Users MUST be able to mark a session as completed.
- **FR-025**: Users MUST be able to mark a session as skipped.
- **FR-026**: A completed session MUST be displayed in a read-only summary state on return.

**Progression**

- **FR-027**: The progression screen MUST allow users to select any exercise from their training history.
- **FR-028**: The progression screen MUST display a chart showing weight and reps evolution over time for the selected exercise.
- **FR-029**: The progression screen MUST display an overall summary including: current training streak, total sessions completed, and personal records.

**Navigation**

- **FR-030**: The application MUST use a Bottom Navigation Bar as the primary navigation pattern, following the Figma prototype, with exactly four items: Home, Training Sheet, Workout, and Progression.
- **FR-031**: The Bottom Navigation Bar MUST be persistently visible on all authenticated screens and allow switching between the four main sections without losing scroll or form state.

**Cross-Cutting**

- **FR-032**: The application MUST be fully responsive and optimized for mobile screens (minimum supported width: 320px).
- **FR-033**: All primary interactions MUST be reachable and operable using one hand on a mobile device.
- **FR-034**: The application MUST provide clear loading and error states for all data-fetching operations.

**Internationalization**

- **FR-035**: All user-facing strings MUST be stored in centralized translation files and never hardcoded directly inside components.
- **FR-036**: The default and only active language for this version is Brazilian Portuguese (`pt-BR`).
- **FR-037**: The string architecture MUST support adding new languages in the future without requiring changes to individual components.

**Theming**

- **FR-038**: The application MUST support both a dark theme and a light theme, with both fully defined in the global theme configuration.
- **FR-039**: Users MUST be able to toggle between dark and light themes via an accessible control.
- **FR-040**: The user's chosen theme MUST be persisted and restored automatically on the next visit.

### Key Entities

- **User**: The authenticated individual using the app. Has credentials (email, password) and a JWT session.
- **Training Sheet**: The user's weekly plan. Maps each day of the week to a type (training or rest) and a list of exercises.
- **Training Day**: One entry in the weekly plan. Has a day-of-week, a type, and an ordered list of exercises.
- **Exercise**: A planned movement. Has a name, muscle group, and an ordered list of series.
- **Series (Set Plan)**: A planned set within an exercise. Has a type (warm-up, adjustment, working) and a target rep count.
- **Training Session**: A record of a single day's workout. Has a date, status (completed/skipped), and a list of logged sets.
- **Logged Set**: Records one completed set. Has references to exercise and set index, plus weight, reps, and rest time actually performed.
- **Progression Record**: Aggregated view of an exercise's logged set history over time, used to render charts and compute PRs.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A new user can register, configure a training day, and log their first set in under 5 minutes from first opening the app.
- **SC-002**: Logging a single set (weight + reps + rest time) requires no more than 3 taps and takes under 10 seconds.
- **SC-003**: All screens render correctly and are fully functional on screens from 320px to 1280px wide.
- **SC-004**: Home, workout logging, and exercise screens display their content within 2 seconds on a standard mobile data connection.
- **SC-005**: All primary actions (mark day, log set, mark session done) are reachable with one thumb without requiring two-handed interaction on a standard-size phone.
- **SC-006**: The monthly calendar accurately reflects the user's training history with 100% consistency with the stored data.
- **SC-007**: The progression chart correctly plots all logged sets for a given exercise, with no data loss or misrepresentation.

## Assumptions

- The LoadUp REST API is fully operational and accessible at a configurable base URL (environment variable).
- JWT tokens are short-lived (approximately 24 hours); the app redirects to login on expiry without automatic refresh.
- The primary target device is a modern smartphone; desktop is supported but not the priority interaction surface.
- Brazilian Portuguese (`pt-BR`) is the sole UI language for this version.
- The Figma prototype (file key: `Buolm5kzeDIg7FMTyM21r5`) serves as a visual reference; design deviations that improve mobile usability are permitted and encouraged.
- Offline mode and background sync are out of scope for this version.
- Push notifications, plateau alerts, external exercise search, personal trainer view, and integrated stopwatch are explicitly out of scope.
- Full i18n implementation with a language switcher (English, Spanish) is out of scope for this version; only the centralized string architecture is required now.
- The app does not need to support older browsers (IE, legacy Safari); modern evergreen browsers on iOS and Android are the minimum target.
- Users are expected to have an active internet connection during gym sessions.

### UI Architecture

- Page components must only contain layout composition and data fetching hooks — no inline component declarations and no styled components.
- Every page-specific UI element must live in its own file inside a `components/` subfolder co-located with the page.
- Styled components must be declared in a separate `styles.ts` file co-located with their component.
