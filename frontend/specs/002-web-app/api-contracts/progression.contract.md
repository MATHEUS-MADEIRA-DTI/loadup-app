# API Contract: Progression Tracking Module

**Module**: `progression`  
**Responsibility**: Analyze workout history and provide progression insights

---

## Endpoint: GET /progression/exercise/:exerciseName

Get progression data for a specific exercise over time.

**Query Parameters**:

- `limit` (number, default: 50): Maximum number of sessions to return
- `dateFrom` (string, optional): ISO 8601 start date
- `dateTo` (string, optional): ISO 8601 end date

**Response (200 OK)**:

```typescript
{
  exerciseName: string;
  muscleGroup: string;
  totalSessions: number;
  firstRecordedDate: string;     // ISO 8601 in America/Sao_Paulo
  lastRecordedDate: string;
  personalRecord: {
    weight: number;
    reps: number;
    date: string;
    seriesType: 'warm-up' | 'adjustment' | 'working';
  };
  records: [
    {
      sessionDate: string;        // ISO 8601 in America/Sao_Paulo
      seriesType: 'warm-up' | 'adjustment' | 'working';
      weight: number;
      repsCompleted: number;
      trend: 'improvement' | 'maintained' | 'decline' | null;  // vs. previous session
    }
    // ... ordered chronologically (newest first)
  ];
}
```

**Errors**:

- `400 Bad Request`: Invalid date format
- `404 Not Found`: No records found for this exercise

---

## Endpoint: GET /progression/summary

Get overall progression summary (quick stats).

**Response (200 OK)**:

```typescript
{
  totalSessionsRecorded: number;
  totalExercisesLogged: number;
  lastSessionDate: string;        // ISO 8601 in America/Sao_Paulo
  workoutStreak: {
    currentDays: number;          // Consecutive recorded/completed sessions
    longestStreak: number;        // All-time longest streak
  };
  topExercises: [
    {
      name: string;
      totalRecords: number;
      latestWeight: number;
      maxWeight: number;
    }
    // ... top 5 exercises by frequency
  ];
}
```

---

## Endpoint: GET /progression/chart/:exerciseName

Get data formatted for charting (weight and reps over time).

**Query Parameters**:

- `seriesType` (string, optional): Filter to specific series type ('warm-up', 'adjustment', 'working')
- `limit` (number, default: 30): Recent sessions to include

**Response (200 OK)**:

```typescript
{
  exerciseName: string;
  seriesType: string | null;  // null = all types combined
  chartData: [
    {
      date: string;             // ISO 8601 in America/Sao_Paulo
      weight: number;
      reps: number;
      sessionCount: number;     // How many sets of this weight/reps that session
    }
    // ... chronologically ordered
  ];
  statistics: {
    averageWeight: number;
    maxWeight: number;
    minWeight: number;
    averageReps: number;
    maxReps: number;
  };
}
```

---

## Endpoint: GET /progression/compare/:exercise1/:exercise2

Compare progression of two exercises side-by-side.

**Response (200 OK)**:

```typescript
{
  exercise1: {
    name: string;
    currentWeight: number;
    maxWeight: number;
    sessionCount: number;
    trend: 'up' | 'flat' | 'down';
  };
  exercise2: {
    name: string;
    currentWeight: number;
    maxWeight: number;
    sessionCount: number;
    trend: 'up' | 'flat' | 'down';
  };
  comparisonData: [
    {
      date: string;
      exercise1Weight: number | null;
      exercise2Weight: number | null;
    }
  ];
}
```

**Errors**:

- `404 Not Found`: One or both exercises not found in history

---

## Endpoint: GET /progression/body-part/:muscleGroup

Get progression across all exercises targeting a specific muscle group.

**Response (200 OK)**:

```typescript
{
  muscleGroup: string;
  exercisesTracked: number;
  exercises: [
    {
      name: string;
      sessionCount: number;
      maxWeight: number;
      currentWeight: number;
      lastRecorded: string;     // ISO 8601 in America/Sao_Paulo
    }
  ];
  totalVolume: {
    value: number;
    unit: 'kg';
    calculatedAs: 'sum of (weight × reps) across all sessions';
  };
}
```

---

## Progression Trend Logic

Trend determination (for `/progression/exercise` endpoint):

- **Improvement**: Current weight/reps exceeds previous session's max, OR same weight with more reps
- **Maintained**: Same weight and reps as previous session
- **Decline**: Lower weight or fewer reps than previous session

---

## Personal Record (PR) Calculation

Personal Record is determined by:

1. Highest weight lifted for the exercise (across all sessions)
2. If multiple sessions have same max weight, highest reps achieved with that weight
3. Filtered by series type if applicable ('working' sets typically count as PRs)

---

## Workout Streak Logic

Consecutive streak tracking:

- Starts counting from most recent completed session going backward
- A "skipped" day breaks the streak (counts as 0-day session)
- A "partial" or "pending" day doesn't break the streak but doesn't increment it
- Only "completed" sessions increment the streak

---

## Date/Timezone Handling

- All dates in responses converted to America/Sao_Paulo timezone
- Query filters (dateFrom, dateTo) accept ISO 8601 dates (UTC converted for queries)
- Chart data ordered chronologically (oldest first for charting libraries)

---

## Notes

- Progression endpoints are read-only (GET only)
- No personal records are hard-deleted; progression is always queryable for past dates
- Calculation is based on TrainingSession.records data (stored with weight, reps, date)
- Exercise name matching is case-insensitive (normalized in comparisons)
- Trend calculations require at least 2 sessions for the same exercise
- All responses include sufficient data for client-side charting/visualization
