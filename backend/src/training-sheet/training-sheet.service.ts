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
  async swapDays(userId: string, dayA: string, dayB: string) {
    const sheet = await this.getTrainingSheet(userId);

    const dA = sheet.days.find((d) => d.dayOfWeek === dayA);
    const dB = sheet.days.find((d) => d.dayOfWeek === dayB);

    if (!dA || !dB) {
      throw new NotFoundException('One or both days not found');
    }

    const tempExercises = [...dA.exercises];
    const tempStatus = dA.status;

    dA.exercises = dB.exercises;
    dA.status = dB.status;

    dB.exercises = tempExercises;
    dB.status = tempStatus;

    sheet.markModified('days');
    return sheet.save();
  }
  async saveSnapshot(userId: string, label?: string) {
    const sheet = await this.getTrainingSheet(userId);

    const snapshot = {
      label: label ?? `Versão ${new Date().toLocaleDateString('pt-BR')}`,
      type: label ? 'manual' : 'auto',
      days: JSON.parse(JSON.stringify(sheet.days)),
      createdAt: new Date(),
    };

    if (sheet.snapshots.length >= 15) {
      const manualCount = sheet.snapshots.filter((s) => s.type === 'manual').length;
      if (manualCount > 0) {
        const firstAutoIdx = sheet.snapshots.findIndex((s) => s.type === 'auto');
        if (firstAutoIdx >= 0) sheet.snapshots.splice(firstAutoIdx, 1);
        else sheet.snapshots.shift();
      } else {
        sheet.snapshots.shift();
      }
    }

    sheet.snapshots.push(snapshot as any);
    sheet.markModified('snapshots');
    return sheet.save();
  }

  async getSnapshots(userId: string, muscleGroup?: string) {
    const sheet = await this.getTrainingSheet(userId);

    let snapshots = [...sheet.snapshots].reverse();

    if (muscleGroup) {
      snapshots = snapshots.filter((s) =>
        s.days.some((d) => d.exercises.some((ex) => ex.muscleGroup === muscleGroup)),
      );
    }

    return snapshots.map((s) => ({
      _id: s._id,
      label: s.label,
      type: s.type,
      createdAt: s.createdAt,
      muscleGroups: Array.from(
        new Set(s.days.flatMap((d) => d.exercises.map((ex) => ex.muscleGroup))),
      ),
      totalExercises: s.days.reduce((acc, d) => acc + d.exercises.length, 0),
    }));
  }

  async restoreSnapshot(userId: string, snapshotId: string) {
    const sheet = await this.getTrainingSheet(userId);

    const snapshot = sheet.snapshots.find((s) => s._id?.toString() === snapshotId);

    if (!snapshot) throw new NotFoundException('Snapshot not found');

    // Auto-save current state before restoring
    await this.saveSnapshot(
      userId,
      `Antes de restaurar — ${new Date().toLocaleDateString('pt-BR')}`,
    );

    const freshSheet = await this.getTrainingSheet(userId);
    freshSheet.days = snapshot.days.map((d) => ({ ...d })) as any;
    freshSheet.markModified('days');
    return freshSheet.save();
  }

  // Atualiza o copyDay para salvar snapshot automático antes de copiar
  async copyDay(
    userId: string,
    sourceUserId: string,
    sourceDayOfWeek: string,
    targetDayOfWeek: string,
    isFriend: boolean,
  ) {
    const sourceSheet = await this.trainingSheetModel
      .findOne({ userId: toObjectId(sourceUserId) })
      .exec();

    if (!sourceSheet) throw new NotFoundException('Source training sheet not found');

    const sourceDay = sourceSheet.days.find((d) => d.dayOfWeek === sourceDayOfWeek);
    if (!sourceDay) throw new NotFoundException('Source day not found');

    // Auto snapshot before copy
    await this.saveSnapshot(userId, `Antes de copiar ${sourceDayOfWeek} de outro usuário`);

    const mySheet = await this.getTrainingSheet(userId);
    const targetDay = mySheet.days.find((d) => d.dayOfWeek === targetDayOfWeek);
    if (!targetDay) throw new NotFoundException('Target day not found');

    targetDay.exercises = JSON.parse(JSON.stringify(sourceDay.exercises));
    targetDay.status = 'training';

    mySheet.markModified('days');
    return mySheet.save();
  }
  private generateExerciseId(): string {
    return `ex_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
