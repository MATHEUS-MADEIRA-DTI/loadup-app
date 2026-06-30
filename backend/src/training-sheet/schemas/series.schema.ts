import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeriesDocument = Series & Document;

@Schema({ _id: false })
export class Series {
  @Prop({ required: true, enum: ['warm-up', 'adjustment', 'working'] })
  type: 'warm-up' | 'adjustment' | 'working';

  @Prop({ required: false, min: 1, max: 200 })
  repsMin?: number;

  @Prop({ required: false, min: 1, max: 200 })
  repsMax?: number;

  /** @deprecated kept for migration; use repsMin/repsMax */
  @Prop({ required: false, min: 1, max: 200 })
  reps?: number;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false })
  restTime?: number;

  @Prop({ required: false, min: 0, max: 500 })
  suggestedWeight?: number;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
