import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ExerciseResultDto } from './exercise-result.dto';

export class SearchExercisesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[\p{L}0-9\s_-]+$/u, { message: 'name contains invalid characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[\p{L}0-9\s_-]+$/u, { message: 'muscle contains invalid characters' })
  muscle?: string;
}

export class SearchExercisesResponseDto {
  results: ExerciseResultDto[];
  cached: boolean;
  warning: string | null;
}
