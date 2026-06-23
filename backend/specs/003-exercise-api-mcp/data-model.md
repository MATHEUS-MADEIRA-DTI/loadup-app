# Data Model: External Exercise Search API

**Feature**: `003-exercise-api-mcp`  
**Date**: 2026-05-12

---

## Collection: `exercise_caches`

Stores cached search results from the API Ninjas Exercises API. Entries are never auto-deleted — manual TTL via `expiresAt` allows stale-cache fallback when the external API is unavailable.

### Mongoose Schema

```typescript
// src/exercises-api/schemas/exercise-cache.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ExerciseCacheEntry {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) muscleGroup: string; // already in Portuguese
  @Prop({ required: true }) type: string;
  @Prop({ required: true }) equipment: string;
  @Prop({ required: true }) instructions: string;
}

@Schema({ collection: 'exercise_caches' })
export class ExerciseCache extends Document {
  @Prop({ required: true, unique: true, index: true })
  cacheKey: string; // normalized "name|muscle" — muscle value is in Portuguese (frontend language)

  @Prop({ type: [ExerciseCacheEntry], required: true })
  results: ExerciseCacheEntry[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, index: true })
  expiresAt: Date; // createdAt + 7 days; checked manually, NOT MongoDB TTL index
}

export const ExerciseCacheSchema = SchemaFactory.createForClass(ExerciseCache);
```

### Fields

| Field       | BSON Type | Index   | Required | Description                                                                                                                                                                                                                                                        |
| ----------- | --------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `_id`       | ObjectId  | PK      | auto     | Mongoose default                                                                                                                                                                                                                                                   |
| `cacheKey`  | String    | unique  | yes      | Composite key: `"name\|muscle"`, lowercased and trimmed. The `muscle` component is the **Portuguese** value sent by the frontend (e.g., `"bench press\|peito"`). This ensures cache identity matches frontend input without depending on the reverse-mapping step. |
| `results`   | Array     | —       | yes      | Array of `ExerciseCacheEntry` sub-documents, already mapped to Portuguese muscle names                                                                                                                                                                             |
| `createdAt` | Date      | —       | yes      | UTC timestamp of first successful cache write for this key                                                                                                                                                                                                         |
| `expiresAt` | Date      | regular | yes      | `createdAt + 7 days`. Fresh check: `expiresAt > new Date()`. Documents are kept after expiry for fallback reads                                                                                                                                                    |

### ExerciseCacheEntry (embedded sub-document)

| Field          | BSON Type | Required | Notes                                                               |
| -------------- | --------- | -------- | ------------------------------------------------------------------- |
| `name`         | String    | yes      | Exercise name as returned by API Ninjas                             |
| `muscleGroup`  | String    | yes      | Translated to Portuguese via `mapMuscleGroup()` before caching      |
| `type`         | String    | yes      | API Ninjas `type` field (e.g., "strength", "stretching", "cardio")  |
| `equipment`    | String    | yes      | API Ninjas `equipment` field (e.g., "barbell", "body only", "none") |
| `instructions` | String    | yes      | Full instructions text from API Ninjas                              |

### Indexes Summary

```
{ cacheKey: 1 }  — unique  (fast lookup by composite key)
{ expiresAt: 1 } — regular (freshness range queries)
```

> **Why not MongoDB native TTL index?**  
> A native `expireAfterSeconds` TTL index auto-deletes documents once `expiresAt` is past. This would destroy the stale-cache fallback required by FR-007 (serve expired results when the external API is unavailable). Manual TTL preserves documents while still enabling freshness checks.

---

## Value Object: ExerciseSearchResult (API response)

Not persisted — returned to the client only.

```typescript
// src/exercises-api/dto/exercise-result.dto.ts
export class ExerciseResultDto {
  name: string;
  muscleGroup: string;
  type: string;
  equipment: string;
  instructions: string;
}

export class SearchExercisesResponseDto {
  results: ExerciseResultDto[];
  cached: boolean;
  warning: string | null;
}
```

---

## No modifications to existing collections

The following collections from spec 001 are **not modified**:

- `training_sheets` — unchanged
- `users` — unchanged
- `training_sessions` — unchanged
