import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface Exercise {
  name: string;
  muscleGroup: string;
  videoUrl: string;
  tip?: string;
}

@Injectable()
export class ExerciseDatabaseService implements OnModuleInit {
  private readonly logger = new Logger(ExerciseDatabaseService.name);
  private exercises: Exercise[] = [];

  async onModuleInit(): Promise<void> {
    await this.loadExercises();
  }

  private async loadExercises(): Promise<void> {
    try {
      const filePath = path.join(__dirname, '..', '..', 'assets', 'exercises.json');

      this.logger.log(`Loading exercises from: ${filePath}`);

      const fileContent = fs.readFileSync(filePath, 'utf-8');
      this.exercises = JSON.parse(fileContent);

      this.logger.log(`✅ Successfully loaded ${this.exercises.length} exercises from database`);
    } catch (error) {
      this.logger.error(
        `Failed to load exercises.json: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new Error('Failed to initialize exercise database');
    }
  }

  /**
   * Search exercises with optional filters
   * @param name - Partial name match (case-insensitive)
   * @param muscle - Exact muscle group match (MuscleGroup enum)
   * @returns Array of exercises matching criteria (AND logic if both provided)
   */
  search(name?: string, muscle?: string): Exercise[] {
    let results = [...this.exercises];

    // Filter by name (case-insensitive partial match)
    if (name && name.trim() !== '') {
      const lowerName = name.toLowerCase();
      results = results.filter((ex) => ex.name.toLowerCase().includes(lowerName));
    }

    // Filter by muscle group (exact match)
    if (muscle && muscle.trim() !== '') {
      results = results.filter((ex) => ex.muscleGroup === muscle);
    }

    return results;
  }

  /**
   * Get all exercises
   */
  getAll(): Exercise[] {
    return [...this.exercises];
  }

  /**
   * Get exercise by name
   */
  findByName(name: string): Exercise | undefined {
    return this.exercises.find((ex) => ex.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Get all unique muscle groups
   */
  getMuscleGroups(): string[] {
    const groups = new Set(this.exercises.map((ex) => ex.muscleGroup));
    return Array.from(groups).sort();
  }

  /**
   * Get exercise count
   */
  getCount(): number {
    return this.exercises.length;
  }
}
