import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

@Controller('training-sheet')
@UseGuards(JwtAuthGuard)
export class TrainingSheetController {
  constructor(
    private readonly trainingSheetService: TrainingSheetService,
    private readonly csvImportService: CsvImportService,
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
}
