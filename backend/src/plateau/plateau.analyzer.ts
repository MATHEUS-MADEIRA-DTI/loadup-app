import { Injectable } from '@nestjs/common';
import { pickSuggestion } from './constants/suggestions';

export interface SessionSnapshot {
  exerciseName: string;
  dayOfWeek: string;
  date: Date;
  weight: number;
  reps: number;
}

export interface PlateauAnalysisResult {
  exerciseName: string;
  dayOfWeek: string;
  isInPlateau: boolean;
  consecutiveCount: number;
  suggestion: string | null;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

@Injectable()
export class PlateauAnalyzer {
  analyze(snapshots: SessionSnapshot[]): PlateauAnalysisResult[] {
    const exerciseMap = new Map<string, SessionSnapshot[]>();

    for (const snap of snapshots) {
      if (snap.weight == null || snap.reps == null) continue;
      const existing = exerciseMap.get(snap.exerciseName) ?? [];
      existing.push(snap);
      exerciseMap.set(snap.exerciseName, existing);
    }

    const results: PlateauAnalysisResult[] = [];

    for (const [exerciseName, entries] of exerciseMap) {
      entries.sort((a, b) => b.date.getTime() - a.date.getTime());

      const tuples = entries.map((e) => ({ weight: e.weight, reps: e.reps }));
      const dayOfWeek = entries[0].dayOfWeek;

      let consecutiveCount = 1;
      while (
        consecutiveCount < tuples.length &&
        tuples[consecutiveCount].weight === tuples[0].weight &&
        tuples[consecutiveCount].reps === tuples[0].reps
      ) {
        consecutiveCount++;
      }

      const dateSpanDays =
        consecutiveCount >= 2
          ? (entries[0].date.getTime() - entries[consecutiveCount - 1].date.getTime()) / MS_PER_DAY
          : 0;

      const isInPlateau = consecutiveCount >= 4 || (consecutiveCount >= 2 && dateSpanDays >= 14);

      results.push({
        exerciseName,
        dayOfWeek,
        isInPlateau,
        consecutiveCount,
        suggestion: isInPlateau ? pickSuggestion(tuples, consecutiveCount) : null,
      });
    }

    return results;
  }
}
