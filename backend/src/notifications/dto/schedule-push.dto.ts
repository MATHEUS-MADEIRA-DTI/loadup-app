import { IsNumber, IsObject, Min } from 'class-validator';

export class SchedulePushDto {
  @IsObject()
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };

  @IsNumber()
  @Min(1)
  delaySeconds: number;
}
