import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { compareAsc, formatISO } from 'date-fns';
import {
  TrainingSheet,
  TrainingSheetDocument,
} from '../training-sheet/schemas/training-sheet.schema';
import {
  TrainingSession,
  TrainingSessionDocument,
} from '../training-session/schemas/training-session.schema';
import { getSaoPauloStartOfDayUtc } from '../common/utils/timezone.util';
import { toObjectId } from '../common/utils/object-id.util';

@Injectable()
export class ProgressionService {
  constructor(
    @InjectModel(TrainingSession.name)
    private readonly trainingSessionModel: Model<TrainingSessionDocument>,
    @InjectModel(TrainingSheet.name)
    private readonly trainingSheetModel: Model<TrainingSheetDocument>,
  ) {}

  private normalizeLabel(label: string) {
    return label.trim().toLowerCase();
  }

  private async getExerciseMetadata(userId: string) {
    const sheet = await this.trainingSheetModel.findOne({ userId: toObjectId(userId) }).exec();
    if (!sheet) {
      return new Map<string, string>();
    }
    const map = new Map<string, string>();
    sheet.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        map.set(this.normalizeLabel(exercise.name), exercise.muscleGroup);
      });
    });
    return map;
  }

  private mapTrend(
    current: { weight: number; repsCompleted: number },
    previous?: { weight: number; repsCompleted: number },
  ) {
    if (!previous) {
      return null;
    }
    if (
      current.weight > previous.weight ||
      (current.weight === previous.weight && current.repsCompleted > previous.repsCompleted)
    ) {
      return 'improvement';
    }
    if (current.weight === previous.weight && current.repsCompleted === previous.repsCompleted) {
      return 'maintained';
    }
    return 'decline';
  }

  async getExerciseProgression(
    userId: string,
    exerciseName: string,
    dateFrom?: string,
    dateTo?: string,
  ) {
    const normalizedName = this.normalizeLabel(exerciseName);
    const query: any = { userId: toObjectId(userId), status: { $ne: 'skipped' } };
    if (dateFrom) {
      query.date = { ...query.date, $gte: getSaoPauloStartOfDayUtc(new Date(dateFrom)) };
    }
    if (dateTo) {
      query.date = { ...query.date, $lte: getSaoPauloStartOfDayUtc(new Date(dateTo)) };
    }
    const sessions = await this.trainingSessionModel.find(query).sort({ date: -1 }).exec();
    const matched: Array<{
      sessionDate: string;
      seriesType: string;
      weight: number;
      repsCompleted: number;
    }> = [];
    sessions.forEach((session) => {
      session.records
        .filter((record) => this.normalizeLabel(record.exerciseName) === normalizedName)
        .forEach((record) => {
          matched.push({
            sessionDate: formatISO(session.date),
            seriesType: record.seriesType,
            weight: record.weight,
            repsCompleted: record.repsCompleted,
          });
        });
    });
    if (matched.length === 0) {
      throw new NotFoundException('No records found for this exercise');
    }
    const personalRecord = matched.reduce((best, current) => {
      if (!best) {
        return current;
      }
      if (current.weight > best.weight) {
        return current;
      }
      if (current.weight === best.weight && current.repsCompleted > best.repsCompleted) {
        return current;
      }
      return best;
    }, matched[0]);
    const records = matched
      .sort((a, b) => compareAsc(new Date(a.sessionDate), new Date(b.sessionDate)))
      .map((record, index, array) => ({
        ...record,
        trend: this.mapTrend(record, index > 0 ? array[index - 1] : undefined),
      }))
      .reverse();
    const muscleGroupMap = await this.getExerciseMetadata(userId);
    return {
      exerciseName,
      muscleGroup: muscleGroupMap.get(normalizedName) || 'unknown',
      totalSessions: new Set(records.map((item) => item.sessionDate)).size,
      firstRecordedDate: records[records.length - 1].sessionDate,
      lastRecordedDate: records[0].sessionDate,
      personalRecord: {
        weight: personalRecord.weight,
        reps: personalRecord.repsCompleted,
        date: personalRecord.sessionDate,
        seriesType: personalRecord.seriesType,
      },
      records,
    };
  }

  async getProgressionSummary(userId: string) {
    const sessions = await this.trainingSessionModel
      .find({ userId: toObjectId(userId), status: 'completed' })
      .sort({ date: -1 })
      .exec();
    if (!sessions.length) {
      return {
        totalSessionsRecorded: 0,
        totalExercisesLogged: 0,
        lastSessionDate: null,
        workoutStreak: { currentDays: 0, longestStreak: 0 },
        topExercises: [],
      };
    }
    const records = sessions.flatMap((session) =>
      session.records.map((record) => ({ session, record })),
    );
    const topExercisesMap = new Map<
      string,
      { totalRecords: number; latestWeight: number; maxWeight: number }
    >();
    records.forEach(({ record }) => {
      const key = record.exerciseName;
      const existing = topExercisesMap.get(key) || {
        totalRecords: 0,
        latestWeight: 0,
        maxWeight: 0,
      };
      existing.totalRecords += 1;
      existing.latestWeight = record.weight;
      existing.maxWeight = Math.max(existing.maxWeight, record.weight);
      topExercisesMap.set(key, existing);
    });
    const topExercises = Array.from(topExercisesMap.entries())
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.totalRecords - a.totalRecords)
      .slice(0, 5);
    const streaks = sessions
      .map((session) => ({
        date: getSaoPauloStartOfDayUtc(session.date).getTime(),
        status: session.status,
      }))
      .sort((a, b) => b.date - a.date);
    let currentDays = 0;
    let longestStreak = 0;
    let previousDay = getSaoPauloStartOfDayUtc(new Date()).getTime();
    streaks.forEach((session) => {
      const diff = previousDay - session.date;
      const sameDay = diff === 0;
      if (!sameDay && diff > 86400000) {
        return;
      }
      if (session.status === 'completed') {
        currentDays += 1;
        longestStreak = Math.max(longestStreak, currentDays);
      } else if (session.status === 'skipped') {
        currentDays = 0;
      }
      previousDay = session.date;
    });
    return {
      totalSessionsRecorded: sessions.length,
      totalExercisesLogged: records.length,
      lastSessionDate: formatISO(sessions[0].date),
      workoutStreak: {
        currentDays,
        longestStreak,
      },
      topExercises,
    };
  }

  async getProgressionChart(userId: string, exerciseName: string, seriesType?: string, limit = 30) {
    const normalizedName = this.normalizeLabel(exerciseName);
    const sessions = await this.trainingSessionModel
      .find({ userId: toObjectId(userId), status: 'completed' })
      .sort({ date: 1 })
      .limit(limit)
      .exec();
    const chartData = sessions
      .flatMap((session) =>
        session.records
          .filter((record) => {
            const matchesName = this.normalizeLabel(record.exerciseName) === normalizedName;
            const matchesType = seriesType ? record.seriesType === seriesType : true;
            return matchesName && matchesType;
          })
          .map((record) => ({
            date: formatISO(session.date),
            weight: record.weight,
            reps: record.repsCompleted,
            sessionCount: 1,
          })),
      )
      .sort((a, b) => compareAsc(new Date(a.date), new Date(b.date)));
    if (!chartData.length) {
      throw new NotFoundException('No chart data found for this exercise');
    }
    const weights = chartData.map((item) => item.weight);
    const reps = chartData.map((item) => item.reps);
    return {
      exerciseName,
      seriesType: seriesType || null,
      chartData,
      statistics: {
        averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
        maxWeight: Math.max(...weights),
        minWeight: Math.min(...weights),
        averageReps: reps.reduce((a, b) => a + b, 0) / reps.length,
        maxReps: Math.max(...reps),
      },
    };
  }

  async getBodyPartProgression(userId: string, muscleGroup: string) {
    const sheet = await this.trainingSheetModel.findOne({ userId: toObjectId(userId) }).exec();
    if (!sheet) {
      throw new NotFoundException('Training sheet not found');
    }
    const exerciseMap = new Map<string, string>();
    sheet.days.forEach((day) => {
      day.exercises.forEach((exercise) => {
        if (exercise.muscleGroup.toLowerCase() === muscleGroup.toLowerCase()) {
          exerciseMap.set(exercise.name.toLowerCase(), exercise.name);
        }
      });
    });
    const records = await this.trainingSessionModel
      .find({ userId: toObjectId(userId), status: 'completed' })
      .exec();
    const filtered: Array<{ name: string; sessionDate: string; weight: number; reps: number }> = [];
    records.forEach((session) => {
      session.records.forEach((record) => {
        if (exerciseMap.has(record.exerciseName.toLowerCase())) {
          filtered.push({
            name: exerciseMap.get(record.exerciseName.toLowerCase()) ?? record.exerciseName,
            sessionDate: formatISO(session.date),
            weight: record.weight,
            reps: record.repsCompleted,
          });
        }
      });
    });
    if (!filtered.length) {
      throw new NotFoundException('No body-part progression found');
    }
    const exercises = Array.from(
      filtered
        .reduce((map, entry) => {
          const existing = map.get(entry.name) || {
            name: entry.name,
            sessionCount: 0,
            totalVolume: 0,
            maxWeight: 0,
            currentWeight: 0,
            lastRecorded: entry.sessionDate,
          };
          existing.sessionCount += 1;
          existing.totalVolume += entry.weight * entry.reps;
          existing.maxWeight = Math.max(existing.maxWeight, entry.weight);
          existing.currentWeight = entry.weight;
          existing.lastRecorded = entry.sessionDate;
          map.set(entry.name, existing);
          return map;
        }, new Map<string, any>())
        .values(),
    ).map((item: any) => ({
      name: item.name as string,
      sessionCount: item.sessionCount as number,
      totalVolume: item.totalVolume as number,
      maxWeight: item.maxWeight as number,
      currentWeight: item.currentWeight as number,
      lastRecorded: item.lastRecorded as string,
    }));
    const totalVolume = exercises.reduce((sum, item) => sum + item.totalVolume, 0);
    return {
      muscleGroup,
      exercisesTracked: exercises.length,
      exercises,
      totalVolume: {
        value: totalVolume,
        unit: 'kg',
        calculatedAs: 'sum of (weight x reps) across all sessions',
      },
    };
  }
}
