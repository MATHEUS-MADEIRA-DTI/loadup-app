"use client";

import { DayOfWeek, WeeklyCalendar } from "@/types";

import { DAY_LABELS, formatDayNumber, isToday } from "../../utils";

import {
  StyledCalendarEmpty,
  StyledDayDot,
  StyledDayLabel,
  StyledDayNumber,
  StyledDayPill,
  StyledDayPillSkeleton,
  StyledWeekRow,
} from "./styles";

interface WeekStripProps {
  weekly: WeeklyCalendar | undefined;
  isLoading: boolean;
  selectedDow: DayOfWeek | null;
  todayDow: DayOfWeek | null;
  emptyMessage: string;
  onDayClick: (dayOfWeek: DayOfWeek) => void;
}

export default function WeekStrip({
  weekly,
  isLoading,
  selectedDow,
  todayDow,
  emptyMessage,
  onDayClick,
}: WeekStripProps) {
  if (isLoading) {
    return (
      <StyledWeekRow>
        {Array.from({ length: 7 }).map((_, i) => (
          <StyledDayPillSkeleton key={i} />
        ))}
      </StyledWeekRow>
    );
  }

  if (!weekly) {
    return <StyledCalendarEmpty>{emptyMessage}</StyledCalendarEmpty>;
  }

  return (
    <StyledWeekRow>
      {weekly.days.map((day) => {
        const today = isToday(day.date);
        const selected = day.dayOfWeek === selectedDow;
        return (
          <StyledDayPill
            key={day.date}
            $today={today}
            $selected={selected}
            onClick={() => onDayClick(day.dayOfWeek as DayOfWeek)}
          >
            <StyledDayLabel $today={today} $selected={selected}>
              {DAY_LABELS[day.dayOfWeek] ?? day.dayOfWeek.slice(0, 3)}
            </StyledDayLabel>
            <StyledDayNumber $today={today} $selected={selected}>
              {formatDayNumber(day.date)}
            </StyledDayNumber>
            <StyledDayDot
              $plannedStatus={day.plannedStatus}
              $sessionStatus={day.sessionStatus}
            />
          </StyledDayPill>
        );
      })}
    </StyledWeekRow>
  );
}
