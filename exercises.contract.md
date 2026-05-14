# API Contract: Exercises Module

**Module**: `exercises`  
**Responsibility**: Add, update, delete exercises within training sheet days

---

## Endpoint: POST /training-sheet/days/:dayOfWeek/exercises

Add an exercise to a training day.

**Request**:

```typescript
{
  name: string;                // Exercise name, e.g., "Bench Press"
  muscleGroup: string;         // Muscle group, e.g., "chest"
  series: [
    {
      type: 'warm-up' | 'adjustment' | 'working';
      reps: number;            // 1-200
    }
    // ... can have multiple series
  ];
}
```

**Response (201 Created)**:

```typescript
{
  _id: string;
  name: string;
  muscleGroup: string;
  series: [
    {
      _id: string;
      type: 'warm-up' | 'adjustment' | 'working';
      reps: number;
      order: number;           // 1-based sequence
    }
  ];
  order: number;               // Position in day (auto-assigned)
}
```

**Errors**:

- `400 Bad Request`: Invalid series structure, missing fields, reps out of range
- `404 Not Found`: Day not found or training sheet doesn't exist
- `409 Conflict`: Day is marked as 'rest' (cannot add exercises)

---

## Endpoint: GET /training-sheet/days/:dayOfWeek/exercises

List all exercises for a training day.

**Response (200 OK)**:

```typescript
[
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
  // ... more exercises
]
```

**Errors**:

- `404 Not Found`: Day not found

---

## Endpoint: GET /training-sheet/days/:dayOfWeek/exercises/:exerciseId

Retrieve a specific exercise.

**Response (200 OK)**:

```typescript
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
```

**Errors**:

- `404 Not Found`: Exercise or day not found

---

## Endpoint: PATCH /training-sheet/days/:dayOfWeek/exercises/:exerciseId

Update an exercise (name, muscleGroup, or series array).

**Request**:

```typescript
{
  name?: string;
  muscleGroup?: string;
  series?: [
    {
      type: 'warm-up' | 'adjustment' | 'working';
      reps: number;
    }
  ];
}
```

**Response (200 OK)**:

```typescript
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
```

**Errors**:

- `400 Bad Request`: Invalid update payload
- `404 Not Found`: Exercise or day not found

---

## Endpoint: DELETE /training-sheet/days/:dayOfWeek/exercises/:exerciseId

Delete an exercise from a training day.

**Response (204 No Content)**

**Errors**:

- `404 Not Found`: Exercise or day not found

---

## Endpoint: GET /exercises/search (Optional - Deferred)

Search external exercise API (out of MVP scope).

---

## Series Type Guidelines

- **warm-up**: Light sets to prepare muscles, typically higher reps (10-15)
- **adjustment**: Transitional sets between warm-up and working sets, medium reps (6-10)
- **working**: Main training sets with target weight/reps (3-8)

Multiple series of the same type allowed (e.g., 2 warm-up sets, then 3 working sets).

---

## Notes

- Exercises are embedded in Day documents within the training sheet
- Each exercise can have 1-10 series
- Series order is 1-based and auto-assigned based on array position
- Exercise order within a day is auto-assigned; can be reordered by POSTing exercises in desired order
- All exercises tied to logged-in user via training sheet
