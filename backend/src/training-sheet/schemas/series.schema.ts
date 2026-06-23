import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SeriesDocument = Series & Document;

@Schema({ _id: false })
export class Series {
  @Prop({ required: true, enum: ['warm-up', 'adjustment', 'working'] })
  type: 'warm-up' | 'adjustment' | 'working';

  @Prop({ required: true, min: 1, max: 200 })
  reps: number;

  @Prop({ required: true })
  order: number;

  @Prop({ required: false })
  restTime?: number;
}

export const SeriesSchema = SchemaFactory.createForClass(Series);
