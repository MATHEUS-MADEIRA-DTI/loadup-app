"use client";

import styled from "styled-components";

import { MonthlyCalendar } from "@/types";

interface CalendarGridProps {
  calendar: MonthlyCalendar;
  onMonthChange: (year: number, month: number) => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function CalendarGrid({
  calendar,
  onMonthChange,
}: CalendarGridProps) {
  const { year, month, days } = calendar;

  const firstDay = new Date(year, month - 1, 1).getDay();

  const handlePrev = () => {
    if (month === 1) onMonthChange(year - 1, 12);
    else onMonthChange(year, month - 1);
  };

  const handleNext = () => {
    const now = new Date();
    if (
      year > now.getFullYear() ||
      (year === now.getFullYear() && month >= now.getMonth() + 1)
    )
      return;
    if (month === 12) onMonthChange(year + 1, 1);
    else onMonthChange(year, month + 1);
  };

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledNavButton onClick={handlePrev}>‹</StyledNavButton>
        <StyledTitle>
          {MONTH_NAMES[month - 1]} {year}
        </StyledTitle>
        <StyledNavButton onClick={handleNext}>›</StyledNavButton>
      </StyledHeader>
      <StyledGrid>
        {WEEKDAYS.map((d) => (
          <StyledWeekday key={d}>{d}</StyledWeekday>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const dateNum = new Date(day.date).getDate();
          const today = new Date().toISOString().split("T")[0];
          const isToday = day.date.startsWith(today);
          // Derivar status de exibição a partir dos campos do backend
          const displayStatus =
            day.plannedStatus === "rest"
              ? "rest"
              : day.sessionStatus === "recorded"
                ? "completed"
                : day.sessionStatus === "skipped"
                  ? "skipped"
                  : "pending";
          return (
            <StyledDayCell key={day.date} $isToday={isToday}>
              <StyledDayNumber $isToday={isToday}>{dateNum}</StyledDayNumber>
              <StyledDot $status={displayStatus} />
            </StyledDayCell>
          );
        })}
      </StyledGrid>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StyledTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.titleMedium.fontSize};
  font-weight: ${({ theme }) => theme.typography.titleMedium.fontWeight};
  color: ${({ theme }) => theme.colors.onSurface};
`;

const StyledNavButton = styled.button`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
  background: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

const StyledWeekday = styled.span`
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: ${({ theme }) => theme.typography.labelSmall.fontWeight};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const StyledDayCell = styled.div<{ $isToday: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme, $isToday }) =>
    $isToday ? theme.colors.primaryContainer : "transparent"};
`;

const StyledDayNumber = styled.span<{ $isToday: boolean }>`
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  font-weight: ${({ theme, $isToday }) =>
    $isToday
      ? theme.typography.titleMedium.fontWeight
      : theme.typography.bodyMedium.fontWeight};
  color: ${({ theme, $isToday }) =>
    $isToday ? theme.colors.primary : theme.colors.onSurface};
`;

const STATUS_COLORS: Record<string, string | undefined> = {
  completed: undefined,
  skipped: undefined,
  pending: undefined,
  rest: undefined,
};

const StyledDot = styled.span<{ $status: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ theme, $status }) => {
    if ($status === "completed") return theme.colors.successContainer;
    if ($status === "skipped") return theme.colors.errorContainer;
    if ($status === "pending") return theme.colors.outline;
    return "transparent";
  }};
`;

// Suppress unused variable warning
void STATUS_COLORS;
