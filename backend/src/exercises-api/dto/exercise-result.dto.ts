import { Expose } from 'class-transformer';

export class ExerciseResultDto {
  @Expose()
  name: string;

  @Expose()
  muscleGroup: string;

  @Expose()
  videoUrl?: string;

  @Expose()
  tip?: string;
}
