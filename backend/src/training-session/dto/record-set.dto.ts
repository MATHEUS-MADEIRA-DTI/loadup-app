import { IsIn, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class RecordSetDto {
  @IsNotEmpty()
  exerciseName: string;

  @IsIn(['warm-up', 'adjustment', 'working'])
  seriesType: 'warm-up' | 'adjustment' | 'working';

  @IsNumber()
  @Min(1)
  seriesOrder: number;

  @IsNumber()
  @Min(0.5)
  @Max(500)
  weight: number;

  @IsNumber()
  @Min(0)
  @Max(1000)
  repsCompleted: number;

  @IsNumber()
  @Min(0)
  @Max(600)
  restTime: number;
}
