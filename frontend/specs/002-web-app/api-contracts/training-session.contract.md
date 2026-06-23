# API Contract: Training Session Module

**Module**: `training-session`  
**Responsibility**: Record workout sessions and track metrics per set

---

## Endpoint: POST /training-sessions

Create a new training session record for today (or specified date).

**Request**:

```typescript
{
  date?: string;  // ISO 8601 date, defaults to today
  dayOfWeek?: string;  // e.g., 'monday', auto-determined from date if omitted
}
```

**Response (201 Created)**:

```typescript
{
  _id: string;
  userId: string;
  date: string; // ISO 8601 in America/Sao_Paulo
  dayOfWeek: string;
  status: "partial"; // Initial status
  records: []; // Empty until sets are recorded
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:

- `400 Bad Request`: Invalid date, future date not allowed
- `409 Conflict`: Session already exists for this date
- `404 Not Found`: Training sheet not found (no plan to record against)

---

## Endpoint: POST /training-sessions/:sessionId/records

Record metrics for a completed set (weight, reps, rest time).

**Request**:

```typescript
{
  exerciseName: string;
  seriesType: "warm-up" | "adjustment" | "working";
  seriesOrder: number; // 1-based
  weight: number; // kg, ≥0.5, ≤500
  repsCompleted: number; // 0-1000
  restTime: number; // seconds, 0-600
}
```

**Response (201 Created)**:

```typescript
{
  _id: string;
  exerciseName: string;
  seriesType: "warm-up" | "adjustment" | "working";
  seriesOrder: number;
  weight: number;
  repsCompleted: number;
  restTime: number;
}
```

**Errors**:

- `400 Bad Request`: Invalid metrics (negative weight, out of range reps/rest)
- `404 Not Found`: Session not found

---

## Endpoint: GET /training-sessions/:sessionId

Retrieve session details and recorded metrics.

**Response (200 OK)**:

```typescript
{
  _id: string;
  userId: string;
  date: string;           // ISO 8601 in America/Sao_Paulo
  dayOfWeek: string;
  status: 'partial' | 'completed' | 'skipped';
  records: [
    {
      _id: string;
      exerciseName: string;
      seriesType: 'warm-up' | 'adjustment' | 'working';
      seriesOrder: number;
      weight: number;
      repsCompleted: number;
      restTime: number;
    }
  ];
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:

- `404 Not Found`: Session not found

---

## Endpoint: PATCH /training-sessions/:sessionId/records/:recordId

Update metrics for a recorded set (before marking completed).

**Request**:

```typescript
{
  weight?: number;
  repsCompleted?: number;
  restTime?: number;
}
```

**Response (200 OK)**:

```typescript
{
  _id: string;
  exerciseName: string;
  seriesType: "warm-up" | "adjustment" | "working";
  seriesOrder: number;
  weight: number;
  repsCompleted: number;
  restTime: number;
}
```

**Errors**:

- `400 Bad Request`: Invalid metrics
- `404 Not Found`: Record or session not found

---

## Endpoint: DELETE /training-sessions/:sessionId/records/:recordId

Remove a recorded set (if user wants to undo an entry).

**Response (204 No Content)**

**Errors**:

- `404 Not Found`: Record or session not found

---

## Endpoint: PATCH /training-sessions/:sessionId/complete

Mark session as completed (finalize recording).

**Request**:

```typescript
{
  status: "completed" | "skipped";
}
```

**Response (200 OK)**:

```typescript
{
  _id: string;
  status: 'completed' | 'skipped';
  records: [ ... ];
  updatedAt: string;
}
```

**Errors**:

- `400 Bad Request`: Invalid status
- `404 Not Found`: Session not found

---

## Endpoint: GET /training-sessions?date=YYYY-MM-DD&dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD

List sessions for date range or specific date.

**Response (200 OK)**:

```typescript
[
  {
    _id: string;
    date: string;       // ISO 8601 in America/Sao_Paulo
    dayOfWeek: string;
    status: 'partial' | 'completed' | 'skipped';
    recordCount: number;  // Quick summary
  }
]
```

**Errors**:

- `400 Bad Request`: Invalid date format

---

## Endpoint: GET /training-sessions/today

Convenience endpoint to get or create today's session.

**Response (200 OK)**: Same as GET /training-sessions/:sessionId

**Side Effect**: Auto-creates session if it doesn't exist for today

---

## Notes

- Sessions can be partially recorded (user records some sets, then saves)
- Status lifecycle: 'partial' → 'completed' or 'skipped' (can be toggled before completion)
- Records are appended to records array; can be edited or deleted before session is marked final
- Session date is stored in UTC; converted to America/Sao_Paulo for display
- User can record a session for a past date (e.g., retroactively logging yesterday's workout)
- sessionId corresponds to userId + date combination for uniqueness
