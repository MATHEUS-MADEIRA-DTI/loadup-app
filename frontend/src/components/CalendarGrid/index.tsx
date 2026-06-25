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
  background: ${({ theme }) => theme.colors.glassOverlay};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  border-radius: ${({ theme }) => theme.borderRadius.inner};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.card};
  backdrop-filter: blur(14px);
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StyledTitle = styled.h3`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.headlineMedium.fontSize};
  font-weight: 900;
  color: ${({ theme }) => theme.colors.onSurface};
`;

const StyledNavButton = styled.button`
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  transition:
    background 0.2s ease,
    transform 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ theme }) => theme.colors.surfaceElevated};
  }
`;

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const StyledWeekday = styled.span`
  font-family: "Barlow Condensed", Inter, sans-serif;
  font-size: ${({ theme }) => theme.typography.labelSmall.fontSize};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const StyledDayCell = styled.div<{ $isToday: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.chip};
  background-color: ${({ theme, $isToday }) =>
    $isToday ? theme.colors.primaryContainer : theme.colors.surface};
  border: 1px solid
    ${({ theme, $isToday }) =>
      $isToday ? theme.colors.primary : theme.colors.outlineVariant};
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
