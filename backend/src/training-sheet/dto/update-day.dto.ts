import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class UpdateDayDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['training', 'rest'])
  status: 'training' | 'rest';
}
