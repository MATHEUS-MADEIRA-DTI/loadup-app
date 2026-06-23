# Phase 1 Design: Data Model

**Date**: May 8, 2026  
**Purpose**: Define entities, relationships, validation rules, and state transitions for LoadUp

## Entity Definitions

### 1. User Entity

Represents a gym member account in the system.

**Fields**:

- `_id` (ObjectId): MongoDB unique identifier
- `name` (String, required): User's display name
- `email` (String, unique, indexed): User's email address (login credential)
- `passwordHash` (String): Bcrypt hash of user's password (never store plaintext)
- `createdAt` (Date, UTC): Account creation timestamp
- `updatedAt` (Date, UTC): Last profile update timestamp
- `timezone` (String, default: 'America/Sao_Paulo'): User's preferred timezone

**Validation Rules**:

- Name MUST be a non-empty string (whitespace-only is rejected)
- Email MUST be unique across all users
- Email MUST be valid RFC 5322 format
- Password (at registration) MUST be at least 8 characters
- Email and password are immutable after creation (update functionality out of MVP scope)

**State Transitions**:

- User starts in "active" state upon successful registration
- Inactive state (soft delete) if account is deleted by user
- No workflow states; always active or deleted

**Relationships**:

- One-to-One: User → TrainingSheet (each user has exactly one active training sheet)
- One-to-Many: User → TrainingSession (user can have multiple recorded sessions)

---

### 2. TrainingSheet Entity

Represents a weekly training plan belonging to a user.

**Fields**:

- `_id` (ObjectId): MongoDB unique identifier
- `userId` (ObjectId, indexed): Reference to User (foreign key)
- `days` (Array of Day subdocuments): Seven days of the week with exercises and status
- `createdAt` (Date, UTC): When the training sheet was created
- `updatedAt` (Date, UTC): Last modification timestamp
- `version` (Number, default: 1): For optimistic concurrency control

**Validation Rules**:

- Each user has exactly one active training sheet
- Days array MUST have exactly 7 elements (Monday through Sunday)
- Each day has a status: "training" or "rest"
- Exercises can only be added to "training" days
- No exercises on "rest" days

**State Transitions**:

- Upon creation: all days default to "training" status with empty exercises
- User can toggle day status between "training" and "rest"
- Editing is unrestricted (no lock-out period)

**Relationships**:

- Many-to-One: TrainingSheet → User
- Embedded subdocuments: TrainingSheet.days (Day)

---

### 3. Day Subdocument (embedded in TrainingSheet)

Represents a single day of the week within a training sheet.

**Fields**:

- `dayOfWeek` (String, enum: 'monday' to 'sunday'): Day identifier
- `status` (String, enum: 'training' | 'rest'): Whether this is a training or rest day
- `exercises` (Array of Exercise subdocuments): Exercises scheduled for this day
- `order` (Number): Position in week (0 = Monday, 6 = Sunday) for sorting

**Validation Rules**:

- dayOfWeek must be one of: 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
- status must be 'training' or 'rest'
- If status is 'rest', exercises array must be empty
- If status is 'training', exercises array can contain 1 to N exercises

**State Transitions**:

- Upon creation: inherits status from user's choice
- Can toggle status at any time (changing 'training' → 'rest' clears exercises)

**Relationships**:

- Embedded in: TrainingSheet.days (array of Day)
- Contains: Exercise subdocuments

---

### 4. Exercise Subdocument (embedded in Day)

Represents a single exercise on a training day.

**Fields**:

- `_id` (ObjectId): Unique within the day
- `name` (String): Exercise name (e.g., "Bench Press", "Squats")
- `muscleGroup` (String): Target muscle group (e.g., "chest", "legs", "back")
- `series` (Array of Series subdocuments): Sets for this exercise
- `order` (Number): Sequence of exercises within the day (for display)
- `externalExerciseId` (String, optional): Reference to external exercise API (if applicable)

**Validation Rules**:

- name MUST not be empty
- series array MUST have at least 1 set
- series array MUST have at most 10 sets (arbitrary but reasonable limit)
- Each series object must have valid structure (see Series below)
- muscleGroup should be from a predefined list (extensible enum)

**State Transitions**:

- Upon creation: user provides name, muscleGroup, and series array
- Can be modified or deleted at any time
- Deletion removes exercise from day and frees its position

**Relationships**:

- Embedded in: Day.exercises (array of Exercise)
- Contains: Series subdocuments (array of Series)

---

### 5. Series Subdocument (embedded in Exercise)

Represents a single set within an exercise.

**Fields**:

- `_id` (ObjectId): Unique within the exercise
- `type` (String, enum: 'warm-up' | 'adjustment' | 'working'): Set type
- `reps` (Number): Target repetitions for this set
- `order` (Number): Sequence within the exercise (1-based)

**Validation Rules**:

- type MUST be one of: 'warm-up', 'adjustment', 'working'
- reps MUST be a positive integer (≥ 1)
- reps MUST be ≤ 200 (reasonable upper limit)
- order MUST match position in array (e.g., first set has order 1)

**State Transitions**:

- Upon creation: assigned reps and type
- Can be edited directly by the user at any time (type and reps may be updated)

**Relationships**:

- Embedded in: Exercise.series (array of Series)
- No external relationships

---

### 6. TrainingSession Entity

Represents a recorded actual workout performance for a specific date.

**Fields**:

- `_id` (ObjectId): MongoDB unique identifier
- `userId` (ObjectId, indexed): Reference to User
- `date` (Date, UTC): Date of the workout (stored as start of day in UTC)
- `dayOfWeek` (String): Day name from the training sheet (e.g., 'monday')
- `status` (String, enum: 'completed' | 'skipped' | 'partial'): Session completion status
- `records` (Array of SessionRecord subdocuments): Metrics for each set performed
- `createdAt` (Date, UTC): When the session record was created
- `updatedAt` (Date, UTC): Last modification timestamp

**Validation Rules**:

- userId MUST match authenticated user (security)
- date MUST be in the past or today (no future dates)
- status can be 'completed', 'skipped', or 'partial'
- records array can be empty if skipped
- If completed, records should correspond to the training sheet for that day

**State Transitions**:

- Upon creation: starts in 'partial' state (user hasn't finished recording)
- Can transition to 'completed' when user marks done
- Can transition to 'skipped' instead of recording metrics
- Once marked 'completed' or 'skipped', can be updated (edit metrics, change status)

**Relationships**:

- Many-to-One: TrainingSession → User
- Embedded subdocuments: TrainingSession.records (SessionRecord)
- Implicit relationship to TrainingSheet (used to determine expected structure)

---

### 7. SessionRecord Subdocument (embedded in TrainingSession)

Represents recorded metrics for a single set performed.

**Fields**:

- `_id` (ObjectId): Unique within the session
- `exerciseName` (String): Name of the exercise (denormalized for historical accuracy)
- `seriesType` (String, enum: 'warm-up' | 'adjustment' | 'working'): Set type
- `seriesOrder` (Number): Position of this set (1-based)
- `weight` (Number): Weight used in kilograms
- `repsCompleted` (Number): Actual repetitions completed
- `restTime` (Number): Rest time in seconds after this set

**Validation Rules**:

- weight MUST be a positive number (≥ 0.5 kg)
- weight MUST be ≤ 500 kg (reasonable upper limit)
- repsCompleted MUST be a non-negative integer (≥ 0)
- repsCompleted MUST be ≤ 1000
- restTime MUST be a non-negative integer (≥ 0)
- restTime MUST be ≤ 600 seconds (10 minutes)

**State Transitions**:

- Upon creation: user enters weight, repsCompleted, and restTime
- Can be modified by user during session recording
- Immutable after session is marked 'completed' (or allow editing with timestamp tracking)

**Relationships**:

- Embedded in: TrainingSession.records (array of SessionRecord)
- Denormalized reference to Exercise (stores exerciseName for historical record)

---

## Relationship Diagram

```
User (1)
├── TrainingSheet (1)
│   └── Day (7: one per day of week)
│       └── Exercise (N per day)
│           └── Series (1-10 per exercise)
│
└── TrainingSession (N: one per recorded workout)
    └── SessionRecord (N: one per set recorded)
```

---

## Indexing Strategy

To meet performance goals (SC-004: <500ms p95 response time):

**User Collection**:

- Unique index on `email` (for login queries)

**TrainingSheet Collection**:

- Index on `userId` (retrieve user's training sheet)
- Compound index: (userId, updatedAt) for sorting by modification

**TrainingSession Collection**:

- Index on `userId` (retrieve user's sessions)
- Compound index: (userId, date) for calendar queries and progression tracking
- Index on `date` for date range queries

**Notes**:

- All queries filter by `userId` for security; index ensures O(log n) performance
- Date range queries (calendar view, progression) use (userId, date) compound index
- Denormalization of data (e.g., exerciseName in SessionRecord) avoids joins

---

## Timezone Handling in Data Model

**Storage**:

- All `Date` fields stored as UTC ISO 8601 strings in MongoDB
- Database stores no timezone information; dates are always UTC

**Usage**:

- TrainingSession.date represents start of day; always UTC (e.g., 2026-05-08T00:00:00Z)
- Calendar queries filter by date range in UTC
- Conversion to America/Sao_Paulo happens in the API layer (interceptor)

**Example**:

- User in São Paulo views calendar for May 8, 2026 at 10 AM local time
- API receives request, converts "May 8" to UTC date range (2026-05-08T00:00:00Z to 2026-05-08T23:59:59Z)
- Query MongoDB for TrainingSession with date in that range
- Response interceptor converts dates back to America/Sao_Paulo before sending to client

---

## Summary

The data model is designed to:

- **Enforce data integrity**: Validation rules prevent invalid states
- **Support efficient queries**: Indexes and denormalization minimize database round-trips
- **Maintain timezone consistency**: UTC storage + presentation-layer conversion
- **Scale for future features**: Extensible design (externalExerciseId for API integration)
- **Follow SOLID principles**: Clear responsibilities, minimal coupling between entities
- **Ensure data accuracy**: SessionRecord denormalization preserves historical accuracy of exercises and series
