import { IsString, MinLength } from 'class-validator';

export class CancelPushDto {
  @IsString()
  @MinLength(1)
  endpoint: string;
}
