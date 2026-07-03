"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";

import { strings } from "@/constants/strings";
import { useMonthlyCalendar } from "@/hooks/useCalendar";
import { calendarService } from "@/services/calendarService";
import { DayRecord } from "@/types";

import {
  StyledCard,
  StyledSectionHeader,
  StyledSectionIcon,
  StyledSectionTitle,
} from "../../styles";
import { formatShortDate } from "../../utils";
import {
  StyledDayCard,
  StyledDayHeaderRow,
  StyledDayLabel,
  StyledEmptyChip,
  StyledEmptyDot,
  StyledEmptyLabel,
  StyledExerciseNames,
  StyledList,
  StyledSkeletonCard,
  StyledStatItem,
  StyledStatsRow,
  StyledStatusBadge,
} from "./styles";

const WEEKDAY_SHORT_KEYS = [
  "sundayShort",
  "mondayShort",
  "tuesdayShort",
  "wednesdayShort",
  "thursdayShort",
  "fridayShort",
  "saturdayShort",
] as const;

function getWeekdayShort(dateStr: string): string {
  const day = new Date(`${dateStr}T12:00:00`).getDay();
  return strings.trainingPlan[WEEKDAY_SHORT_KEYS[day]];
}

function statusLabel(status: string): string {
  if (status === "completed") return strings.sessionHistory.statusCompleted;
  if (status === "skipped") return strings.sessionHistory.statusSkipped;
  if (status === "partial" || status === "active")
    return strings.sessionHistory.statusPartial;
  return strings.sessionHistory.statusPending;
}

function formatDuration(activeSeconds: number): string {
  const diffMins = Math.round(activeSeconds / 60);
  if (diffMins < 1) return "<1min";
  if (diffMins < 60) return `${diffMins}min`;
  const h = Math.floor(diffMins / 60);
  const m = diffMins % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export default function WeeklyHistory() {
  const now = new Date();

  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthly = useMonthlyCalendar(now.getFullYear(), now.getMonth() + 1);
  const prevMonthYear =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const prevMonthly = useMonthlyCalendar(
    prevMonthYear,
    now.getMonth() === 0 ? 12 : now.getMonth(),
  );

  const daysWithSession = useMemo(() => {
    const allDays = [
      ...(prevMonthly.data?.days ?? []),
      ...(monthly.data?.days ?? []),
    ];
    return last7Days.filter((date) =>
      allDays.some(
        (d) => d.date?.startsWith(date) && d.sessionStatus === "recorded",
      ),
    );
  }, [last7Days, monthly.data, prevMonthly.data]);

  const dayQueries = useQueries({
    queries: daysWithSession.map((date) => ({
      queryKey: ["calendar", "day", date],
      queryFn: () => calendarService.getDayDetails(date),
    })),
  });

  const dayCards = useMemo(() => {
    const map = new Map<
      string,
      {
        records: DayRecord[];
        status: string;
        activeSeconds: number;
        isLoading: boolean;
      }
    >();
    daysWithSession.forEach((date, i) => {
      const query = dayQueries[i];
      map.set(date, {
        records: query?.data?.recordedSession?.records ?? [],
        status: query?.data?.recordedSession?.status ?? "pending",
        activeSeconds: query?.data?.recordedSession?.activeSeconds ?? 0,
        isLoading: query?.isLoading ?? false,
      });
    });
    return map;
  }, [daysWithSession, dayQueries]);

  if (monthly.isLoading) {
    return (
      <StyledCard>
        <StyledSectionHeader>
          <StyledSectionIcon>
            <CalendarDays size={16} />
          </StyledSectionIcon>
          <StyledSectionTitle>
            {strings.progression.weeklyHistoryTitle}
          </StyledSectionTitle>
        </StyledSectionHeader>
        <StyledList>
          {Array.from({ length: 3 }).map((_, i) => (
            <StyledSkeletonCard key={i} />
          ))}
        </StyledList>
      </StyledCard>
    );
  }

  if (daysWithSession.length === 0) return null;

  return (
    <StyledCard>
      <StyledSectionHeader>
        <StyledSectionIcon>
          <CalendarDays size={16} />
        </StyledSectionIcon>
        <StyledSectionTitle>
          {strings.progression.weeklyHistoryTitle}
        </StyledSectionTitle>
      </StyledSectionHeader>
      <StyledList>
        {last7Days.map((date) => {
          const day = dayCards.get(date);

          if (!day) {
            return (
              <StyledEmptyChip key={date}>
                <StyledEmptyDot />
                <StyledEmptyLabel>{getWeekdayShort(date)}</StyledEmptyLabel>
              </StyledEmptyChip>
            );
          }

          if (day.isLoading) {
            return <StyledSkeletonCard key={date} />;
          }

          const uniqueNames = Array.from(
            new Set(day.records.map((r) => r.exerciseName)),
          );
          const shownNames = uniqueNames.slice(0, 3);
          const moreCount = uniqueNames.length - shownNames.length;
          const totalSeries = day.records.length;

          return (
            <StyledDayCard key={date}>
              <StyledDayHeaderRow>
                <StyledDayLabel>
                  {getWeekdayShort(date)} · {formatShortDate(date)}
                </StyledDayLabel>
                <StyledStatusBadge $good={day.status === "completed"}>
                  {statusLabel(day.status)}
                </StyledStatusBadge>
              </StyledDayHeaderRow>
              <StyledExerciseNames>
                {shownNames.join(", ")}
                {moreCount > 0 &&
                  ` ${strings.progression.moreExercises(moreCount)}`}
              </StyledExerciseNames>
              <StyledStatsRow>
                <StyledStatItem>
                  {strings.progression.seriesUnit(totalSeries)}
                </StyledStatItem>
                <StyledStatItem>
                  {formatDuration(day.activeSeconds)}
                </StyledStatItem>
              </StyledStatsRow>
            </StyledDayCard>
          );
        })}
      </StyledList>
    </StyledCard>
  );
}
