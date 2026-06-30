import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TrainingSession, TrainingSessionDocument } from './schemas/training-session.schema';
import {
  TrainingSheet,
  TrainingSheetDocument,
} from '../training-sheet/schemas/training-sheet.schema';
import { getDayOfWeek, getSaoPauloStartOfDayUtc } from '../common/utils/timezone.util';
import { toObjectId } from '../common/utils/object-id.util';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface SessionCompletedEvent {
  userId: string;
  sessionId: string;
  dayOfWeek: string;
}

@Injectable()
export class TrainingSessionService {
  constructor(
    @InjectModel(TrainingSession.name)
    private readonly trainingSessionModel: Model<TrainingSessionDocument>,
    @InjectModel(TrainingSheet.name)
    private readonly trainingSheetModel: Model<TrainingSheetDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createTrainingSession(userId: string, dateString?: string) {
    const sheet = await this.trainingSheetModel.findOne({ userId: toObjectId(userId) }).exec();
    if (!sheet) {
      throw new NotFoundException('Training sheet not found');
    }
    const date = getSaoPauloStartOfDayUtc(dateString ? new Date(dateString) : new Date());
    if (date > new Date()) {
      throw new BadRequestException('Future dates are not allowed');
    }
    const existing = await this.trainingSessionModel
      .findOne({ userId: toObjectId(userId), date })
      .exec();
    if (existing) {
      throw new ConflictException('Session already exists for this date');
    }
    const session = new this.trainingSessionModel({
      userId: toObjectId(userId),
      date,
      dayOfWeek: getDayOfWeek(date),
      status: 'partial',
      records: [],
    });
    return session.save();
  }

  async getTrainingSession(userId: string, sessionId: string) {
    const session = await this.trainingSessionModel
      .findOne({ _id: toObjectId(sessionId), userId: toObjectId(userId) })
      .exec();
    if (!session) {
      throw new NotFoundException('Session not found');
    }
    return session;
  }

  async addRecordToSession(
    userId: string,
    sessionId: string,
    payload: {
      exerciseName: string;
      seriesType: 'warm-up' | 'adjustment' | 'working';
      seriesOrder: number;
      weight: number;
      repsCompleted: number;
      restTime: number;
    },
  ) {
    const session = await this.getTrainingSession(userId, sessionId);
    if (session.status === 'skipped') {
      throw new ConflictException('Cannot record sets for a skipped session');
    }
    session.records.push({
      exerciseName: payload.exerciseName,
      seriesType: payload.seriesType,
      seriesOrder: payload.seriesOrder,
      weight: payload.weight,
      repsCompleted: payload.repsCompleted,
      restTime: payload.restTime,
    });
    return session.save();
  }

  async updateSessionRecord(
    userId: string,
    sessionId: string,
    recordId: string,
    payload: { weight?: number; repsCompleted?: number; restTime?: number },
  ) {
    const session = await this.getTrainingSession(userId, sessionId);
    const record = (session.records as any[]).find((r: any) => r._id?.toString() === recordId);
    if (!record) {
      throw new NotFoundException('Record not found');
    }
    if (payload.weight !== undefined) {
      record.weight = payload.weight;
    }
    if (payload.repsCompleted !== undefined) {
      record.repsCompleted = payload.repsCompleted;
    }
    if (payload.restTime !== undefined) {
      record.restTime = payload.restTime;
    }
    return session.save();
  }

  async deleteSessionRecord(userId: string, sessionId: string, recordId: string) {
    const session = await this.getTrainingSession(userId, sessionId);
    const index = (session.records as any[]).findIndex((r: any) => r._id?.toString() === recordId);
    if (index === -1) {
      throw new NotFoundException('Record not found');
    }
    session.records.splice(index, 1);
    return session.save();
  }

  async completeSession(userId: string, sessionId: string, status: 'completed' | 'skipped') {
    const session = await this.getTrainingSession(userId, sessionId);
    session.status = status;
    if (status === 'completed') {
      session.completedAt = new Date();
    }
    const saved = await session.save();
    if (status === 'completed') {
      this.eventEmitter.emit('session.completed', {
        userId,
        sessionId,
        dayOfWeek: session.dayOfWeek,
      } satisfies SessionCompletedEvent);
    }
    return saved;
  }

  async getTodaySession(userId: string) {
    const date = getSaoPauloStartOfDayUtc(new Date());
    let session = await this.trainingSessionModel
      .findOne({ userId: toObjectId(userId), date })
      .exec();
    if (!session) {
      session = await this.createTrainingSession(userId, new Date().toISOString());
    }
    return session;
  }
}
