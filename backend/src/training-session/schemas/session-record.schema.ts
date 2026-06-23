import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionRecordDocument = SessionRecord & Document;

@Schema()
export class SessionRecord {
  @Prop({ required: true })
  exerciseName: string;

  @Prop({ required: true, enum: ['warm-up', 'adjustment', 'working'] })
  seriesType: 'warm-up' | 'adjustment' | 'working';

  @Prop({ required: true })
  seriesOrder: number;

  @Prop({ required: true, min: 0.5, max: 500 })
  weight: number;

  @Prop({ required: true, min: 0, max: 1000 })
  repsCompleted: number;

  @Prop({ required: true, min: 0, max: 600 })
  restTime: number;
}

export const SessionRecordSchema = SchemaFactory.createForClass(SessionRecord);
