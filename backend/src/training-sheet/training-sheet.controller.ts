import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CreateTrainingSheetDto } from './dto/create-training-sheet.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { TrainingSheetService } from './training-sheet.service';
import { CsvImportService } from '../exercises-api/services/csv-import.service';
import { SwapDaysDto } from './dto/swap-days.dto';
import { FriendshipService } from '../friendship/friendship.service';
import { UsersService } from '../users/users.service';
import { ForbiddenException } from '@nestjs/common';

@Controller('training-sheet')
@UseGuards(JwtAuthGuard)
export class TrainingSheetController {
  constructor(
    private readonly trainingSheetService: TrainingSheetService,
    private readonly csvImportService: CsvImportService,
    private readonly friendshipService: FriendshipService,
    private readonly usersService: UsersService,
  ) {}
  @Post()
  async createTrainingSheet(
    @CurrentUser('id') userId: string,
    @Body() createDto: CreateTrainingSheetDto,
  ) {
    return this.trainingSheetService.createTrainingSheet(userId, createDto.days);
  }

  @Get()
  async getTrainingSheet(@CurrentUser('id') userId: string) {
    return this.trainingSheetService.getTrainingSheet(userId);
  }
  @Patch('days/swap')
  async swapDays(@CurrentUser('id') userId: string, @Body() swapDto: SwapDaysDto) {
    return this.trainingSheetService.swapDays(
      userId,
      swapDto.dayA.toLowerCase(),
      swapDto.dayB.toLowerCase(),
    );
  }
  @Patch('days/:dayOfWeek')
  async updateDayStatus(
    @CurrentUser('id') userId: string,
    @Param('dayOfWeek') dayOfWeek: string,
    @Body() updateDto: UpdateDayDto,
  ) {
    return this.trainingSheetService.updateDayStatus(
      userId,
      dayOfWeek.toLowerCase(),
      updateDto.status,
    );
  }

  @Get('days/:dayOfWeek')
  async getDay(@CurrentUser('id') userId: string, @Param('dayOfWeek') dayOfWeek: string) {
    return this.trainingSheetService.getDay(userId, dayOfWeek.toLowerCase());
  }

  @Post('days/:dayOfWeek/exercises/import')
  @UseInterceptors(FileInterceptor('file'))
  async importExercisesFromCsv(
    @CurrentUser('id') userId: string,
    @Param('dayOfWeek') dayOfWeek: string,
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo CSV é obrigatório');
    }

    // Validate CSV
    const validationResult = this.csvImportService.validateCsvFile(file.buffer);

    if (!validationResult.isValid) {
      return {
        success: false,
        message: 'Arquivo CSV contém erros de validação',
        errors: validationResult.errors,
        totalErrors: validationResult.errors.length,
      };
    }

    // Add exercises to day
    try {
      const updatedDay = await this.trainingSheetService.addExercisesFromCsv(
        userId,
        dayOfWeek.toLowerCase(),
        validationResult.rows,
      );

      return {
        success: true,
        message: `${validationResult.rows.length} exercícios importados com sucesso`,
        exercises_count: validationResult.rows.length,
        day: updatedDay,
      };
    } catch (error) {
      throw error;
    }
  }
  @Post('copy-day')
  async copyDay(
    @CurrentUser('id') userId: string,
    @Body()
    body: {
      sourceUserId: string;
      sourceDayOfWeek: string;
      targetDayOfWeek: string;
    },
  ) {
    const sourceUser = await this.usersService.getPublicProfile(body.sourceUserId);
    const isFriend = await this.friendshipService.isFriend(userId, body.sourceUserId);

    if (!sourceUser.isPublic && !isFriend) {
      throw new BadRequestException('No access to this training plan');
    }

    return this.trainingSheetService.copyDay(
      userId,
      body.sourceUserId,
      body.sourceDayOfWeek,
      body.targetDayOfWeek,
      isFriend,
    );
  }

  @Get('user/:userId')
  async getFriendSheet(@CurrentUser('id') userId: string, @Param('userId') targetUserId: string) {
    console.log('=== getFriendSheet called ===');
    console.log('userId:', userId);
    console.log('targetUserId:', targetUserId);

    const targetUser = await this.usersService.getPublicProfile(targetUserId);
    console.log('targetUser:', targetUser);

    const isFriend = await this.friendshipService.isFriend(userId, targetUserId);
    console.log('isFriend result:', isFriend);

    if (!targetUser.isPublic && !isFriend) {
      throw new ForbiddenException('No access to this training plan');
    }

    return this.trainingSheetService.getTrainingSheet(targetUserId);
  }
  @Post('snapshots')
  async saveSnapshot(@CurrentUser('id') userId: string, @Body() body: { label?: string }) {
    return this.trainingSheetService.saveSnapshot(userId, body.label);
  }

  @Get('snapshots')
  async getSnapshots(
    @CurrentUser('id') userId: string,
    @Query('muscleGroup') muscleGroup?: string,
  ) {
    return this.trainingSheetService.getSnapshots(userId, muscleGroup);
  }

  @Post('snapshots/:id/restore')
  async restoreSnapshot(@CurrentUser('id') userId: string, @Param('id') snapshotId: string) {
    return this.trainingSheetService.restoreSnapshot(userId, snapshotId);
  }
}
