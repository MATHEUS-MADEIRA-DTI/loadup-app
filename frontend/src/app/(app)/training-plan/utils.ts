import { strings } from "@/constants/strings";
import { DayOfWeek } from "@/types";

export const DAYS: DayOfWeek[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export const DAY_LABEL: Record<DayOfWeek, string> = {
  monday: strings.trainingPlan.monday,
  tuesday: strings.trainingPlan.tuesday,
  wednesday: strings.trainingPlan.wednesday,
  thursday: strings.trainingPlan.thursday,
  friday: strings.trainingPlan.friday,
  saturday: strings.trainingPlan.saturday,
  sunday: strings.trainingPlan.sunday,
};

export const DAY_SHORT: Record<DayOfWeek, string> = {
  monday: strings.trainingPlan.mondayShort,
  tuesday: strings.trainingPlan.tuesdayShort,
  wednesday: strings.trainingPlan.wednesdayShort,
  thursday: strings.trainingPlan.thursdayShort,
  friday: strings.trainingPlan.fridayShort,
  saturday: strings.trainingPlan.saturdayShort,
  sunday: strings.trainingPlan.sundayShort,
};

export const JS_TO_DOW: Record<number, DayOfWeek> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};
