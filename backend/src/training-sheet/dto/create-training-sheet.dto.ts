import { IsObject, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { TrainingSheetDayValidator } from './training-sheet-day.validator';

export class CreateTrainingSheetDto {
  @IsObject()
  @Validate(TrainingSheetDayValidator)
  @Transform(({ value }) => value)
  days: Record<string, { status: 'training' | 'rest' }>;
}
