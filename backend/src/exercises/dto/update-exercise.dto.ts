import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

class ExerciseSeriesDto {
  @IsIn(['warm-up', 'adjustment', 'working'])
  type: 'warm-up' | 'adjustment' | 'working';

  @IsInt()
  @Min(1)
  @Max(200)
  repsMin: number;

  @IsInt()
  @Min(1)
  @Max(200)
  repsMax: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5999)
  restTime?: number;
}

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  muscleGroup?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseSeriesDto)
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  series?: ExerciseSeriesDto[];

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  tip?: string;
}
