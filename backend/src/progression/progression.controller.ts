import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProgressionService } from './progression.service';

@Controller('progression')
@UseGuards(JwtAuthGuard)
export class ProgressionController {
  constructor(private readonly progressionService: ProgressionService) {}

  @Get('exercise/:exerciseName')
  async getExerciseProgression(
    @CurrentUser('id') userId: string,
    @Param('exerciseName') exerciseName: string,
    @Query('limit') limit?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.progressionService.getExerciseProgression(userId, exerciseName, dateFrom, dateTo);
  }

  @Get('summary')
  async getSummary(@CurrentUser('id') userId: string) {
    return this.progressionService.getProgressionSummary(userId);
  }

  @Get('chart/:exerciseName')
  async getChart(
    @CurrentUser('id') userId: string,
    @Param('exerciseName') exerciseName: string,
    @Query('seriesType') seriesType?: string,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? Number(limit) : 30;
    return this.progressionService.getProgressionChart(
      userId,
      exerciseName,
      seriesType,
      parsedLimit,
    );
  }

  @Get('body-part/:muscleGroup')
  async getBodyPart(@CurrentUser('id') userId: string, @Param('muscleGroup') muscleGroup: string) {
    return this.progressionService.getBodyPartProgression(userId, muscleGroup);
  }
}
