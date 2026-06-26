import { IsIn, IsNotEmpty, IsString } from 'class-validator';

const VALID_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export class SwapDaysDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_DAYS)
  dayA: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(VALID_DAYS)
  dayB: string;
}
