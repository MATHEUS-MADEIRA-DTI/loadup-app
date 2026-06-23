import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CalendarService } from './calendar.service';

@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('today')
  async getToday(@CurrentUser('id') userId: string) {
    return this.calendarService.getTodayView(userId);
  }

  @Get()
  async getMonthly(
    @CurrentUser('id') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.calendarService.getMonthlyView(userId, Number(year), Number(month));
  }

  @Get('week')
  async getWeekly(@CurrentUser('id') userId: string, @Query('date') date?: string) {
    return this.calendarService.getWeeklyView(userId, date);
  }

  @Get(':dateString')
  async getDayDetails(@CurrentUser('id') userId: string, @Param('dateString') dateString: string) {
    return this.calendarService.getDayDetails(userId, dateString);
  }

  @Patch(':dateString/mark')
  async markDay(
    @CurrentUser('id') userId: string,
    @Param('dateString') dateString: string,
    @Body() body: { action: 'completed' | 'skipped' | 'reset' },
  ) {
    return this.calendarService.markDayStatus(userId, dateString, body.action);
  }
}
