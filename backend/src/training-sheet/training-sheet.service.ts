import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainingSheet, TrainingSheetDocument } from './schemas/training-sheet.schema';
import { toObjectId } from '../common/utils/object-id.util';
import { CsvExerciseRow } from '../exercises-api/dto/csv-import.dto';
import { ExerciseDatabaseService } from '../exercises-api/services/exercise-database.service';

@Injectable()
export class TrainingSheetService {
  private readonly logger = new Logger(TrainingSheetService.name);

  constructor(
    @InjectModel(TrainingSheet.name)
    private readonly trainingSheetModel: Model<TrainingSheetDocument>,
    private readonly databaseService: ExerciseDatabaseService,
  ) {}

  private normalizeDays(days: Record<string, { status: 'training' | 'rest' }>) {
    const orderMap = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    return orderMap.map((day, index) => ({
      dayOfWeek: day,
      status: days[day].status,
      exercises: [],
      order: index,
    }));
  }

  async createTrainingSheet(userId: string, days: Record<string, { status: 'training' | 'rest' }>) {
    const existing = await this.trainingSheetModel.findOne({ userId: toObjectId(userId) }).exec();
    if (existing) {
      throw new ConflictException('Training sheet already exists for user');
    }
    const sheet = new this.trainingSheetModel({
      userId: toObjectId(userId),
      days: this.normalizeDays(days),
    });
    return sheet.save();
  }

  async getTrainingSheet(userId: string) {
    const sheet = await this.trainingSheetModel.findOne({ userId: toObjectId(userId) }).exec();
    if (!sheet) {
      throw new NotFoundException('Training sheet not found');
    }
    return sheet;
  }

  async updateDayStatus(userId: string, dayOfWeek: string, status: 'training' | 'rest') {
    const sheet = await this.getTrainingSheet(userId);
    const day = sheet.days.find((d) => d.dayOfWeek === dayOfWeek);
    if (!day) {
      throw new NotFoundException('Day not found');
    }
    day.status = status;
    if (status === 'rest') {
      day.exercises = [];
    }
    sheet.markModified('days');
    return sheet.save();
  }

  async getDay(userId: string, dayOfWeek: string) {
    const sheet = await this.getTrainingSheet(userId);
    const day = sheet.days.find((d) => d.dayOfWeek === dayOfWeek);
    if (!day) {
      throw new NotFoundException('Day not found');
    }
    return day;
  }

  /**
   * Add exercises to a training day from CSV import
   * @param userId - User ID
   * @param dayOfWeek - Day of week (e.g., 'monday', 'tuesday')
   * @param csvRows - Validated CSV rows from CsvImportService
   * @returns Updated day with new exercises
   */
  async addExercisesFromCsv(userId: string, dayOfWeek: string, csvRows: CsvExerciseRow[]) {
    const sheet = await this.getTrainingSheet(userId);
    const day = sheet.days.find((d) => d.dayOfWeek === dayOfWeek);

    if (!day) {
      throw new NotFoundException('Day not found');
    }

    if (day.status === 'rest') {
      throw new BadRequestException('Cannot add exercises to a rest day');
    }

    // Map CSV rows to Exercise entities
    const newExercises: any[] = [];
    for (const row of csvRows) {
      // Validate exercise exists in database
      const dbExercise = this.databaseService.findByName(row.nome);
      if (!dbExercise) {
        this.logger.warn(`Exercise "${row.nome}" not found in database, creating from CSV import`);
      }

      const exerciseId = this.generateExerciseId();
      newExercises.push({
        _id: exerciseId,
        name: row.nome,
        muscleGroup: row.grupo_muscular,
        videoUrl: row.video_url || undefined,
        tip: row.dica || undefined,
        series: [],
        order: day.exercises.length + newExercises.length,
        database: !!dbExercise, // Mark if it came from database
      });
    }

    // Add new exercises to day
    day.exercises.push(...newExercises);
    sheet.markModified('days');

    const updated = await sheet.save();
    const updatedDay = updated.days.find((d) => d.dayOfWeek === dayOfWeek);

    this.logger.log(`Added ${newExercises.length} exercises to ${dayOfWeek} for user ${userId}`);

    return updatedDay;
  }

  private generateExerciseId(): string {
    return `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
