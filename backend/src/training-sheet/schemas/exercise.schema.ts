import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Series, SeriesSchema } from './series.schema';

export type ExerciseDocument = Exercise & Document;

@Schema({ _id: false })
export class Exercise {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  muscleGroup: string;

  @Prop({ type: [SeriesSchema], default: [] })
  series: Series[];

  @Prop({ required: true })
  order: number;

  @Prop({ required: false })
  type?: string;

  @Prop({ required: false })
  instructions?: string;

  @Prop({ required: false })
  videoUrl?: string;

  @Prop({ required: false })
  tip?: string;

  @Prop({ default: true })
  database: boolean;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);
