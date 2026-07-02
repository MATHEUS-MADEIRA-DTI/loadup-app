import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { SchedulePushDto } from './dto/schedule-push.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly svc: NotificationsService) {}

  @Get('vapid-public-key')
  getKey() {
    return { publicKey: this.svc.getPublicKey() };
  }

  @Post('schedule')
  schedule(@Body() dto: SchedulePushDto) {
    this.svc.schedulePush(dto.subscription, dto.delaySeconds);
    return { scheduled: true };
  }
}
