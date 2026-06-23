import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Day, DaySchema } from './day.schema';

export type TrainingSheetDocument = TrainingSheet & Document;

@Schema({ timestamps: true })
export class TrainingSheet {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  userId: Types.ObjectId;

  @Prop({ type: [DaySchema], required: true })
  days: Day[];

  @Prop({ default: 1 })
  version: number;
}

export const TrainingSheetSchema = SchemaFactory.createForClass(TrainingSheet);
TrainingSheetSchema.index({ userId: 1 }, { unique: true });
