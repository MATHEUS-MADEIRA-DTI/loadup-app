import { strings } from "@/constants/strings";
import { DayOfWeek, SeriesType } from "@/types";

export const DAY_LABEL: Record<DayOfWeek, string> = {
  monday: strings.trainingPlan.monday,
  tuesday: strings.trainingPlan.tuesday,
  wednesday: strings.trainingPlan.wednesday,
  thursday: strings.trainingPlan.thursday,
  friday: strings.trainingPlan.friday,
  saturday: strings.trainingPlan.saturday,
  sunday: strings.trainingPlan.sunday,
};

export const SERIES_LABEL: Record<SeriesType, string> = {
  "warm-up": strings.exercises.seriesType["warm-up"],
  adjustment: strings.exercises.seriesType.adjustment,
  working: strings.exercises.seriesType.working,
};

export const SERIES_COLOR: Record<SeriesType, { bg: string; text: string }> = {
  "warm-up": { bg: "#E3F2FD", text: "#0D47A1" },
  adjustment: { bg: "#FFF3E0", text: "#E65100" },
  working: { bg: "#EDE7F6", text: "#4A148C" },
};

export const VALID_DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function isValidDay(day: string): day is DayOfWeek {
  return VALID_DAYS.includes(day as DayOfWeek);
}
