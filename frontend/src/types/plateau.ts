/**
 * Plateau Alerts Type Definitions
 * Describes the structure of plateau alerts from the backend
 * and client-side augmented data.
 */

import type { MuscleGroup } from "./trainingSheet";

/**
 * PlateauAlert - Response from GET /plateau/alerts
 * Represents a single plateau detection for an exercise.
 */
export interface PlateauAlert {
  /** Unique MongoDB ObjectId */
  _id: string;
  /** Exercise name (matched against training sheet) */
  exerciseName: string;
  /** Day of week when alert was detected */
  dayOfWeek: string;
  /** Type of alert: exercise stagnation, day-based, or rep-range-max */
  alertType: "exercise" | "day" | "rep-range-max";
  /** Number of sessions without progression */
  sessionCount: number;
  /** Recommendation text for the user */
  suggestion: string;
  /** ISO date string when alert was detected */
  detectedAt: string;
  /** Whether alert is still active */
  active: boolean;
}

/**
 * PlateauAlertWithMuscleGroup - Client-side augmented alert
 * Extends PlateauAlert with muscle group resolved from training sheet.
 */
export interface PlateauAlertWithMuscleGroup extends PlateauAlert {
  /** Muscle group resolved from training sheet (optional if not found) */
  muscleGroup?: MuscleGroup;
}

/**
 * PlateauAlertsResponse - Response wrapper from backend
 * Wraps the alerts array with metadata.
 */
export interface PlateauAlertsResponse {
  /** Array of plateau alerts */
  data: PlateauAlert[];
  /** ISO timestamp of response */
  timestamp: string;
}
