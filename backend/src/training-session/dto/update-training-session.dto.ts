import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateTrainingSessionDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['completed', 'skipped'])
  status: 'completed' | 'skipped';
}
