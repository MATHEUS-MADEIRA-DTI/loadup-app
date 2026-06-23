# Data Model: Plateau Detection Agent

**Feature**: `004-plateau-agent`
**Collection**: `plateau_alerts`
**Plan reference**: [plan.md](plan.md)

---

## Collection: `plateau_alerts`

Stores plateau detection results for each user. Documents are upserted (never inserted blindly) on every session completion, ensuring idempotency.

### Schema Fields

| Field          | Type                    | Required | Index                | Notes                                                                                                         |
| -------------- | ----------------------- | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------- |
| `_id`          | ObjectId                | auto     | —                    | Mongoose default                                                                                              |
| `userId`       | ObjectId                | yes      | compound (see below) | References `users` collection                                                                                 |
| `exerciseName` | String                  | yes      | compound (see below) | Exact exercise name from `SessionRecord.exerciseName`; for day-level alerts this stores the `dayOfWeek` value |
| `dayOfWeek`    | String                  | yes      | —                    | Value from `TrainingSession.dayOfWeek` (e.g., `"monday"`)                                                     |
| `alertType`    | `"exercise"` \| `"day"` | yes      | compound (see below) | `"exercise"` = per-exercise alert; `"day"` = aggregate day alert                                              |
| `suggestion`   | String \| null          | yes      | —                    | Static string from `src/plateau/constants/suggestions.ts`                                                     |
| `sessionCount` | Number                  | yes      | —                    | Number of consecutive sessions that triggered the alert; `0` for day alerts                                   |
| `detectedAt`   | Date                    | yes      | —                    | Timestamp of first detection; NOT overwritten on subsequent upserts — use `$setOnInsert`                      |
| `resolvedAt`   | Date \| null            | no       | —                    | Set when progression detected; `null` while plateau is active                                                 |
| `active`       | Boolean                 | yes      | single index         | `true` = plateau ongoing; `false` = resolved                                                                  |

### Indexes

| Index                                 | Type            | Purpose                                                                                             |
| ------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------- |
| `{ userId, exerciseName, alertType }` | Unique compound | One alert per exercise (or day) per type per user. Enables efficient upsert with `{ upsert: true }` |
| `{ userId, active }`                  | Compound        | Fast reads for `GET /plateau/alerts` (filter by user + active)                                      |

### NestJS Schema (`strictPropertyInitialization: false`)

```typescript
// src/plateau/schemas/plateau-alert.schema.ts
@Schema({ collection: 'plateau_alerts', timestamps: false })
export class PlateauAlert {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', index: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  exerciseName: string;

  @Prop({ required: true })
  dayOfWeek: string;

  @Prop({ required: true, enum: ['exercise', 'day'] })
  alertType: 'exercise' | 'day';

  @Prop({ type: String, default: null })
  suggestion: string | null;

  @Prop({ required: true, default: 0 })
  sessionCount: number;

  @Prop({ required: true })
  detectedAt: Date;

  @Prop({ type: Date, default: null })
  resolvedAt: Date | null;

  @Prop({ required: true, default: true, index: true })
  active: boolean;
}

export const PlateauAlertSchema = SchemaFactory.createForClass(PlateauAlert);
PlateauAlertSchema.index({ userId: 1, exerciseName: 1, alertType: 1 }, { unique: true });
PlateauAlertSchema.index({ userId: 1, active: 1 });
```

---

## Value Object: `PlateauAnalysisResult`

Not persisted. Produced by `PlateauAnalyzer.analyze()` and consumed by `PlateauService` to drive upserts.

| Field              | Type           | Notes                                                 |
| ------------------ | -------------- | ----------------------------------------------------- |
| `exerciseName`     | string         | matches `SessionRecord.exerciseName`                  |
| `dayOfWeek`        | string         | from the most recent session containing this exercise |
| `isInPlateau`      | boolean        | `true` if detection threshold met                     |
| `consecutiveCount` | number         | how many consecutive sessions were identical          |
| `suggestion`       | string \| null | null when `isInPlateau` is false                      |

```typescript
export interface PlateauAnalysisResult {
  exerciseName: string;
  dayOfWeek: string;
  isInPlateau: boolean;
  consecutiveCount: number;
  suggestion: string | null;
}
```

---

## Detection Rules Summary

| Rule                | Condition                                                                                             | Result        |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| Consecutive count   | Same `(weight, reps)` in `>= 4` sessions (ordered by date, working only)                              | Plateau       |
| 2-week window       | Same `(weight, reps)` and date span between first and last session `>= 14 days`, with `>= 2` sessions | Plateau       |
| Progression         | `(weight, reps)` differ from previous session                                                         | Resolve alert |
| Insufficient data   | Fewer than 2 matching sessions                                                                        | No plateau    |
| Non-working series  | `seriesType !== 'working'`                                                                            | Excluded      |
| Missing weight/reps | Record skipped                                                                                        | Excluded      |

---

## Upsert Behavior

```typescript
// Exercise-level alert upsert
await plateauAlertModel.findOneAndUpdate(
  { userId, exerciseName, alertType: 'exercise' },
  {
    $set: {
      dayOfWeek,
      suggestion,
      sessionCount: consecutiveCount,
      active: isInPlateau,
      resolvedAt: isInPlateau ? null : new Date(),
    },
    $setOnInsert: { detectedAt: new Date() }, // only on first insert
  },
  { upsert: true, new: true },
);
```
