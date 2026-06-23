import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTrainingSessionDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  dayOfWeek?: string;
}
