import { strings } from "@/constants/strings";
import { CalendarSessionStatus, DayOfWeek } from "@/types";

export const DAY_LABELS: Record<string, string> = {
  monday: "Seg",
  tuesday: "Ter",
  wednesday: "Qua",
  thursday: "Qui",
  friday: "Sex",
  saturday: "Sáb",
  sunday: "Dom",
};

export const DAY_FULL_LABELS: Record<string, string> = {
  monday: strings.trainingPlan.monday,
  tuesday: strings.trainingPlan.tuesday,
  wednesday: strings.trainingPlan.wednesday,
  thursday: strings.trainingPlan.thursday,
  friday: strings.trainingPlan.friday,
  saturday: strings.trainingPlan.saturday,
  sunday: strings.trainingPlan.sunday,
};

export interface RecentSession {
  date: string;
  dayOfWeek: DayOfWeek;
  sessionStatus: CalendarSessionStatus;
  muscles: string[];
  totalSeries: number;
}

export function formatDayNumber(dateStr: string): string {
  return String(new Date(dateStr).getDate());
}

export function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
