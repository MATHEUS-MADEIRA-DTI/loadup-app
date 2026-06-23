import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class ExerciseCacheEntry {
  name: string;
  muscleGroup: string;
  type: string;
  equipment: string;
  instructions: string;
}

export type ExerciseCacheDocument = ExerciseCache & Document;

@Schema({ collection: 'exercise_caches' })
export class ExerciseCache {
  @Prop({ required: true, unique: true, index: true })
  cacheKey: string;

  @Prop({
    type: [
      {
        name: { type: String, required: true },
        muscleGroup: { type: String, required: true },
        type: { type: String, required: true },
        equipment: { type: String, required: true },
        instructions: { type: String, required: true },
      },
    ],
    default: [],
  })
  results: ExerciseCacheEntry[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true, index: true })
  expiresAt: Date;
}

export const ExerciseCacheSchema = SchemaFactory.createForClass(ExerciseCache);
