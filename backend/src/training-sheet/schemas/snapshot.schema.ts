import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Day, DaySchema } from './day.schema';

export type SnapshotDocument = Snapshot & Document;

@Schema({ _id: true, timestamps: true })
export class Snapshot {
  _id?: Types.ObjectId;

  @Prop({ required: true })
  label: string;

  @Prop({ enum: ['manual', 'auto'], default: 'manual' })
  type: 'manual' | 'auto';

  @Prop({ type: [DaySchema], required: true })
  days: Day[];

  createdAt: Date;
}

export const SnapshotSchema = SchemaFactory.createForClass(Snapshot);
