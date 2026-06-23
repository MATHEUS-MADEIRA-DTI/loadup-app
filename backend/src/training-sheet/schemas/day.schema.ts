import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Exercise, ExerciseSchema } from './exercise.schema';

export type DayDocument = Day & Document;

@Schema({ _id: false })
export class Day {
  @Prop({
    required: true,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  })
  dayOfWeek: string;

  @Prop({ required: true, enum: ['training', 'rest'] })
  status: 'training' | 'rest';

  @Prop({ type: [ExerciseSchema], default: [] })
  exercises: Exercise[];

  @Prop({ required: true })
  order: number;
}

export const DaySchema = SchemaFactory.createForClass(Day);
