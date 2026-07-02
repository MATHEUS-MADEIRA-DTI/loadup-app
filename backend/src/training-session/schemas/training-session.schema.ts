import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SessionRecord, SessionRecordSchema } from './session-record.schema';

export type TrainingSessionDocument = TrainingSession & Document;

@Schema({ timestamps: true })
export class TrainingSession {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  dayOfWeek: string;

  @Prop({ required: true, enum: ['partial', 'active', 'completed', 'skipped'] })
  status: 'partial' | 'active' | 'completed' | 'skipped';

  @Prop({ type: [SessionRecordSchema], default: [] })
  records: SessionRecord[];

  @Prop()
  completedAt?: Date;

  @Prop()
  startedAt?: Date;

  @Prop({ default: 0 })
  activeSeconds: number;

  @Prop()
  lastResumedAt?: Date;
}

export const TrainingSessionSchema = SchemaFactory.createForClass(TrainingSession);
TrainingSessionSchema.index({ userId: 1, date: 1 }, { unique: true });
