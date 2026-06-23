# API Contract: Training Sheet Module

**Module**: `training-sheet`  
**Responsibility**: CRUD operations for user's weekly training plan

---

## Endpoint: POST /training-sheet

Create user's training sheet (one per user, called once).

**Request**:

```typescript
{
  days: {
    [dayName: string]: {
      status: 'training' | 'rest';
    }
  }
  // Example:
  {
    "monday": { "status": "training" },
    "tuesday": { "status": "training" },
    "wednesday": { "status": "rest" },
    // ... all 7 days
  }
}
```

**Response (201 Created)**:

```typescript
{
  _id: string;
  userId: string;
  days: [
    {
      dayOfWeek: 'monday';
      status: 'training';
      exercises: [];
      order: 0;
    },
    // ... 7 total
  ];
  createdAt: string;  // ISO 8601 in America/Sao_Paulo
  updatedAt: string;
}
```

**Errors**:

- `400 Bad Request`: Invalid day structure or status
- `409 Conflict`: Training sheet already exists for user

---

## Endpoint: GET /training-sheet

Retrieve user's training sheet.

**Response (200 OK)**:

```typescript
{
  _id: string;
  userId: string;
  days: [
    {
      dayOfWeek: string;
      status: 'training' | 'rest';
      exercises: [
        {
          _id: string;
          name: string;
          muscleGroup: string;
          series: [
            {
              _id: string;
              type: 'warm-up' | 'adjustment' | 'working';
              reps: number;
              order: number;
            }
          ];
          order: number;
        }
      ];
      order: number;
    }
  ];
  createdAt: string;
  updatedAt: string;
}
```

**Errors**:

- `404 Not Found`: Training sheet not created yet
- `401 Unauthorized`: Missing or invalid JWT token

---

## Endpoint: PATCH /training-sheet/days/:dayOfWeek

Update a specific day's status (toggle between training and rest).

**Request**:

```typescript
{
  status: "training" | "rest";
}
```

**Response (200 OK)**:

```typescript
{
  dayOfWeek: string;
  status: "training" | "rest";
  exercises: []; // Cleared if changing to 'rest'
  order: number;
}
```

**Errors**:

- `400 Bad Request`: Invalid status value
- `404 Not Found`: Day not found
- `409 Conflict`: Invalid day name

---

## Endpoint: GET /training-sheet/days/:dayOfWeek

Retrieve exercises and status for a specific day.

**Response (200 OK)**:

```typescript
{
  dayOfWeek: string;
  status: 'training' | 'rest';
  exercises: [
    {
      _id: string;
      name: string;
      series: [ { type, reps, order } ];
      order: number;
    }
  ];
}
```

**Errors**:

- `404 Not Found`: Day not found
- `400 Bad Request`: Invalid day name

---

## Endpoint: DELETE /training-sheet

Delete user's training sheet (out of MVP scope but defined for completeness).

**Response (204 No Content)**

---

## Notes

- Each user has exactly one training sheet (one-to-one relationship)
- Days array is immutable in structure (always 7 days, Monday-Sunday)
- Status toggle auto-clears exercises when changing 'training' → 'rest'
- All timestamps in America/Sao_Paulo timezone (presentation layer conversion)
