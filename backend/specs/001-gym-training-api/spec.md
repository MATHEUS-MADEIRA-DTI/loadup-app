# Feature Specification: LoadUp - REST API for Gym Training Management

**Feature Branch**: `001-gym-training-api`  
**Created**: May 8, 2026  
**Status**: Draft  
**Input**: User description: "O LoadUp é uma API REST de gerenciamento de treino na academia..."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - User Registration and Authentication (Priority: P1)

New gym users need to create accounts and securely log into the system to access their personalized training data. This is the foundation for all other features and must work reliably.

**Why this priority**: Authentication is the foundational requirement - without it, the system cannot maintain user isolation, data security, or personalized experiences. This is a critical P1 feature.

**Independent Test**: Can be fully tested by creating a new user account with email and password, receiving a JWT token, and using that token to access protected endpoints. Delivers the core security and access control foundation.

**Acceptance Scenarios**:

1. **Given** a user provides valid name, email and password, **When** they submit registration, **Then** the system creates the account and returns a success message
2. **Given** an existing user provides correct email and password, **When** they submit login, **Then** the system returns a valid JWT token
3. **Given** a user provides invalid or duplicate email, **When** they submit registration, **Then** the system rejects with appropriate error message
4. **Given** a user provides incorrect password, **When** they attempt login, **Then** the system denies access and returns error

---

### User Story 2 - Create and Manage Training Sheet by Days of Week (Priority: P1)

Users need to create a structured workout plan organized by days of the week, defining which days are training days and which are rest days. This establishes the framework for their entire training program.

**Why this priority**: Without the ability to plan and organize workouts by day, users cannot structure their training. This is essential to the core MVP value proposition.

**Independent Test**: Can be fully tested by creating a training sheet, assigning exercises to specific weekdays, designating rest days, and retrieving the complete weekly schedule. Delivers a complete, usable training plan.

**Acceptance Scenarios**:

1. **Given** a logged-in user, **When** they create a training sheet, **Then** the system initializes a sheet with all 7 days of the week and associates it with the user
2. **Given** a user managing their training sheet, **When** they designate certain days as rest days, **Then** those days are marked and cannot have exercises assigned
3. **Given** a user managing their training sheet, **When** they designate certain days as training days, **Then** exercises can be added to those days
4. **Given** a user with an existing training sheet, **When** they retrieve their sheet, **Then** all days, rest designations, and exercises are returned in correct structure
5. **Given** a user editing their active training sheet, **When** they modify exercises, days, or series, **Then** changes are applied immediately and persist

---

### User Story 3 - Add and Manage Exercises in Training Sheet (Priority: P1)

Users need to add exercises to their training days with detailed series configurations (number of sets, reps per set, warm-up sets, working sets). This enables them to specify exactly what they'll perform each training day.

**Why this priority**: The ability to add and configure exercises is core to the MVP - this is what users actually execute. Without this, they have an empty plan.

**Independent Test**: Can be fully tested by adding an exercise to a training day with multiple series specifications (e.g., 4 sets: 1 warm-up with 15 reps, 1 adjustment with 6 reps, 2 working with 8 reps) and verifying the data is stored correctly. Delivers a complete, executable daily workout plan.

**Acceptance Scenarios**:

1. **Given** a training day with space for exercises, **When** a user adds an exercise with series specifications, **Then** the exercise is saved with all series details preserved
2. **Given** a user adding an exercise, **When** they specify warm-up, adjustment, and working sets separately, **Then** each set is stored with correct type, reps, and sequence
3. **Given** an exercise already in the training sheet, **When** the user modifies series or reps, **Then** changes are persisted
4. **Given** an exercise in the training sheet, **When** the user deletes it, **Then** it is removed and space becomes available
5. **Given** a training day with multiple exercises, **When** the user retrieves the day, **Then** all exercises appear in the correct order with complete series information

---

### User Story 4 - Record Training Session with Metrics (Priority: P2)

Users need to record actual workout execution, logging weight used, repetitions completed, and rest time between sets. This data becomes the foundation for progression tracking.

**Why this priority**: This feature is essential for tracking progress and adjusting future workouts, but comes after the ability to create and view the plan. It's P2 because users need a structured plan first (P1) to record against.

**Independent Test**: Can be fully tested by recording a complete training session for a specific day, entering weight/reps/rest for each set, and verifying the session is stored and retrievable. Delivers complete session data for future analysis.

**Acceptance Scenarios**:

1. **Given** a user viewing today's workout, **When** they record completed sets with weight, reps, and rest time, **Then** all metrics are saved per set
2. **Given** a user recording a training session, **When** they log data for each set in sequence, **Then** the system preserves the order and association with the correct exercise
3. **Given** a recorded training session, **When** the user retrieves it later, **Then** all recorded metrics (weight, reps, rest time) are displayed exactly as entered
4. **Given** a user who partially completed a workout, **When** they save their session, **Then** the system records what was completed (allows partial sessions)

---

### User Story 5 - View Progression and Track Evolution (Priority: P2)

Users need to view historical data showing how their strength and endurance have improved over time, comparing weight and repetitions across sessions for the same exercise.

**Why this priority**: Progression visualization motivates users and validates their training effectiveness, but depends on having historical session data (P2). It's valuable but not required for basic MVP functionality.

**Independent Test**: Can be fully tested by recording multiple sessions for the same exercise over time and visualizing the progression in weight and reps. Delivers clear progression insights.

**Acceptance Scenarios**:

1. **Given** a user with multiple completed sessions for the same exercise, **When** they request progression data, **Then** the system displays historical weight and reps in chronological order
2. **Given** progression data for an exercise, **When** the user reviews it, **Then** they can clearly see improvements in weight or repetitions between sessions
3. **Given** an exercise performed with varying weights/reps across sessions, **When** the user views progression, **Then** the data is accurate and complete
4. **Given** a user viewing progression, **When** they want to set a new personal record, **Then** they can identify their best performance to date

---

### User Story 6 - Calendar System and Daily Workout View (Priority: P2)

Users need a calendar interface that automatically displays which workout is scheduled for today, with the ability to mark the current day as completed or skipped, allowing the system to adjust future calendar display accordingly.

**Why this priority**: The calendar provides essential UX for daily engagement and tracking, but the core functionality (having a training plan) is P1. The calendar enhances usability (P2).

**Independent Test**: Can be fully tested by viewing today's workout in the calendar, marking it as completed or skipped, and verifying the calendar state updates accordingly. Delivers daily engagement and status tracking.

**Acceptance Scenarios**:

1. **Given** a user opening the app on a training day, **When** they view the calendar, **Then** today's workout is automatically displayed
2. **Given** today's workout is displayed, **When** the user marks it as completed, **Then** the calendar updates and the session status persists
3. **Given** today's workout is displayed, **When** the user marks it as skipped, **Then** the calendar reflects this and future scheduling adjusts (if applicable)
4. **Given** today is a designated rest day, **When** the user views the calendar, **Then** no workout is shown and rest day status is clear
5. **Given** a user viewing the calendar, **When** they click on any previous day, **Then** they can see what was scheduled and what was recorded

---

### Edge Cases

- **What happens when a user hasn't recorded a training session for a scheduled workout day?** System should allow marking as skipped and querying for unrecorded days.
- **What happens when a user tries to add an exercise to a rest day?** System should reject with clear error message.
- **What happens when external exercise API is unavailable when user searches for exercises?** System should gracefully degrade and allow manual exercise entry as fallback.
- **What happens if a user marks a day as both completed and skipped?** The system should enforce one status per day - most recent action wins or system prevents duplicate status submission.
- **What happens when a user modifies their training sheet structure after already recording sessions?** Historical sessions should remain intact; modifications only affect future dates.
- **What happens when a user wants to adjust their training sheet mid-week?** Changes should apply immediately to future days; past recorded data remains unchanged.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST allow users to register with name, email and password (all three fields are required; name must be a non-empty string)
- **FR-002**: System MUST authenticate users via JWT tokens after login
- **FR-003**: System MUST validate JWT tokens on all protected endpoints
- **FR-004**: System MUST allow each user to create and manage exactly one active training sheet
- **FR-005**: System MUST allow users to organize training by days of the week (Monday-Sunday)
- **FR-006**: System MUST allow users to designate days as rest days or training days
- **FR-007**: System MUST allow users to add exercises to training days with full series specifications
- **FR-008**: System MUST support defining multiple series per exercise with individual reps and set type (warm-up, adjustment, working)
- **FR-009**: System MUST allow users to manually enter exercises or search/import from an external exercise API
- **FR-010**: System MUST allow users to record training sessions with weight, repetitions, and rest time per set
- **FR-011**: System MUST allow users to retrieve historical session data for progression analysis
- **FR-012**: System MUST display a calendar showing today's workout and provide status marking (completed/skipped)
- **FR-013**: System MUST prevent unauthorized access - users can only access their own data
- **FR-014**: System MUST persist all data in MongoDB
- **FR-015**: System MUST follow RESTful conventions for all endpoints
- **FR-016**: System MUST return appropriate HTTP status codes (200, 201, 400, 401, 404, 500, etc.)
- **FR-017**: System MUST validate all user inputs and return descriptive error messages
- **FR-018**: System MUST track user progression through session history
- **FR-019**: System MUST allow users to update and delete exercises from their training sheets
- **FR-020**: System MUST support partial workout sessions (user can record only some exercises/sets if needed)
- **FR-021**: System MUST display all dates and times to the user in Brazilian timezone (America/Sao_Paulo, UTC-3)

### Key Entities

- **User**: Represents a gym member with name (required, non-empty string), email, password hash, creation date, and JWT settings
- **TrainingSheet**: Represents a complete weekly training plan belonging to a user, containing exercises organized by day of week
- **Day**: Represents a specific day of the week (Monday-Sunday) within a training sheet, with status (training/rest) and associated exercises
- **Exercise**: Represents a single exercise in a training day with metadata (name, muscle group) and its series specifications
- **Series/Set**: Represents individual sets within an exercise with properties (type: warm-up/adjustment/working, reps, order)
- **TrainingSession**: Represents a recorded actual workout performance for a specific date with metrics per set (weight, reps completed, rest time)
- **ExerciseAPI**: Represents integration with external exercise database for searching and importing exercise definitions

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can complete registration and login process in under 1 minute
- **SC-002**: Users can create and configure a complete weekly training sheet in under 5 minutes
- **SC-003**: Users can add an exercise with multiple series and specifications in under 2 minutes
- **SC-004**: System API responds to all requests in under 500ms for 95th percentile response time
- **SC-005**: Users can retrieve their training data and session history on first page load in under 2 seconds
- **SC-006**: 100% of user data is persisted correctly and retrievable (no data loss)
- **SC-007**: All REST endpoints follow consistent HTTP status code conventions (4xx for client errors, 5xx for server errors)
- **SC-008**: Users can view their weekly calendar and today's workout within 1 second of app load
- **SC-009**: Progression tracking shows accurate weight/rep comparisons across sessions for the same exercise with 100% data accuracy

## Out of scope for this spec

- Integrated timer
- Personal trainer profile
- Exercise video URLs
- Detailed user profile settings

## Assumptions

- **User Management**: Users have unique email addresses; forgotten passwords will be handled through standard recovery mechanisms (out of scope for MVP)
- **Training Structure**: Each user can have one active training sheet at a time; historical sheets can be archived (archive functionality out of scope for MVP)
- **External API**: If exercise API has exactly one active training sheet that can be edited at any time; the training sheet persists across sessions and can be modified as needed
- **Data Retention**: User data is retained indefinitely unless user explicitly deletes their account; deleted accounts remove all associated data
- **Authentication**: JWT tokens are stateless and will be validated via signature; token refresh mechanism uses standard token lifetime
- **Calendar & Timezone**: All dates and times operate in Brazilian timezone (America/Sao_Paulo, UTC-3); this is the system default and all user-facing displays use this timezone
- **API Integration**: External exercise API (if used) should have search/filter capabilities; LoadUp acts as client, not proxy
- **Performance**: MongoDB will be properly indexed for common queries (user_id, exercise_id, date range)
- **Concurrency**: Multiple simultaneous requests from the same user will be handled sequentially at the data layer to prevent race conditions
- **Input Validation**: Email format validated via RFC 5322 standard; password minimum 8 characters; all numeric fields validated for positive numbers (reps, weight, rest time)
