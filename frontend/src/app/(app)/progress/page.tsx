"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Flame, TrendingUp, Dumbbell, Trophy } from "lucide-react";

import EmptyState from "@/components/EmptyState";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import { useMonthlyCalendar } from "@/hooks/useCalendar";
import {
  useProgressionChart,
  useProgressionSummary,
} from "@/hooks/useProgression";
import { useTrainingSheet } from "@/hooks/useTrainingSheet";
import { useTheme } from "@/styles/ThemeProvider";
import { MuscleGroup } from "@/types";

import ProgressionChart from "./components/ProgressionChart";
import {
  StyledBody,
  StyledCard,
  StyledChipScroll,
  StyledExerciseChip,
  StyledHeader,
  StyledHeaderSkeleton,
  StyledHint,
  StyledImprovementBadge,
  StyledMuscleBar,
  StyledMuscleBarWrap,
  StyledMuscleCount,
  StyledMuscleList,
  StyledMuscleName,
  StyledMuscleRow,
  StyledPage,
  StyledPillLabel,
  StyledPillValue,
  StyledPrBanner,
  StyledPrText,
  StyledSectionHeader,
  StyledSectionIcon,
  StyledSectionTitle,
  StyledSkeletonCard,
  StyledStatPill,
  StyledStatRow,
  StyledSubtitle,
  StyledTitle,
} from "./styles";
import { formatShortDate, getISOWeekKey } from "./utils";

export default function ProgressPage() {
  const { theme } = useTheme();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const now = new Date();
  const summary = useProgressionSummary();
  const chart = useProgressionChart(selectedExercise ?? "");
  const sheet = useTrainingSheet();
  const monthly = useMonthlyCalendar(now.getFullYear(), now.getMonth() + 1);
  const prevMonthYear =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const prevMonthly = useMonthlyCalendar(prevMonthYear, prevMonth);

  const exerciseNames = useMemo<string[]>(() => {
    const topNames = (summary.data?.topExercises ?? []).map((e) => e.name);
    if (topNames.length > 0) return topNames;
    if (!sheet.data) return [];
    const set = new Set<string>();
    sheet.data.days.forEach((day) => {
      if (day.status === "training")
        day.exercises.forEach((ex) => set.add(ex.name));
    });
    return Array.from(set);
  }, [summary.data, sheet.data]);

  useEffect(() => {
    if (exerciseNames.length > 0 && selectedExercise === null)
      setSelectedExercise(exerciseNames[0]);
  }, [exerciseNames, selectedExercise]);

  const weeklyActivity = useMemo(() => {
    const allDays = [
      ...(prevMonthly.data?.days ?? []),
      ...(monthly.data?.days ?? []),
    ].filter((d) => d.sessionStatus === "recorded");
    const weekMap = new Map<string, number>();
    allDays.forEach((day) => {
      const date = new Date(`${day.date.substring(0, 10)}T12:00:00`);
      const key = getISOWeekKey(date);
      weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
    });
    return Array.from(weekMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([, count], i) => ({ label: `S${i + 1}`, count }));
  }, [monthly.data, prevMonthly.data]);

  const muscleSeries = useMemo(() => {
    if (!sheet.data) return [];
    const map = new Map<string, number>();
    sheet.data.days.forEach((day) => {
      if (day.status === "training")
        day.exercises.forEach((ex) => {
          map.set(
            ex.muscleGroup,
            (map.get(ex.muscleGroup) ?? 0) + ex.series.length,
          );
        });
    });
    const max = Math.max(...Array.from(map.values()), 1);
    return Array.from(map.entries())
      .map(([group, count]) => ({
        group: group as MuscleGroup,
        count,
        pct: (count / max) * 100,
      }))
      .sort((a, b) => b.count - a.count);
  }, [sheet.data]);

  const prData = useMemo(() => {
    const data = chart.data?.chartData;
    if (!data || data.length === 0) return null;
    const maxWeight = chart.data!.statistics.maxWeight;
    const prPoint = data.reduce(
      (best, p) => (p.weight >= best.weight ? p : best),
      data[0],
    );
    const firstWeight = data[0].weight;
    const improvement =
      firstWeight > 0 ? ((maxWeight - firstWeight) / firstWeight) * 100 : 0;
    return {
      weight: maxWeight,
      reps: prPoint.reps,
      date: formatShortDate(prPoint.date),
      improvement,
    };
  }, [chart.data]);

  if (summary.isLoading && sheet.isLoading) {
    return (
      <PageTransition>
        <StyledPage>
          <StyledHeaderSkeleton />
          <StyledBody>
            <StyledSkeletonCard />
            <StyledSkeletonCard style={{ height: 220 }} />
          </StyledBody>
        </StyledPage>
      </PageTransition>
    );
  }

  const hasNoData =
    !summary.isLoading &&
    !summary.error &&
    summary.data?.totalSessionsRecorded === 0;

  return (
    <PageTransition>
      <StyledPage>
        <StyledHeader>
          <StyledSubtitle>LoadUp</StyledSubtitle>
          <StyledTitle>{strings.progression.titleMain}</StyledTitle>
          <StyledStatRow>
            <StyledStatPill>
              <StyledPillValue>
                {summary.data?.totalSessionsRecorded ?? 0}
              </StyledPillValue>
              <StyledPillLabel>
                {strings.progression.statWorkouts}
              </StyledPillLabel>
            </StyledStatPill>
            <StyledStatPill>
              <StyledPillValue>
                {summary.data?.totalExercisesLogged ?? 0}
              </StyledPillValue>
              <StyledPillLabel>
                {strings.progression.statSeries}
              </StyledPillLabel>
            </StyledStatPill>
            <StyledStatPill>
              <StyledPillValue>
                {summary.data?.workoutStreak.currentDays ?? 0}
              </StyledPillValue>
              <StyledPillLabel>
                {strings.progression.statStreakDays}
              </StyledPillLabel>
            </StyledStatPill>
          </StyledStatRow>
        </StyledHeader>

        <StyledBody>
          {hasNoData && (
            <EmptyState
              title={strings.progression.noDataTitle}
              description={strings.progression.noDataSubtitle}
            />
          )}

          {weeklyActivity.length > 0 && (
            <StyledCard>
              <StyledSectionHeader>
                <StyledSectionIcon>
                  <Flame size={16} />
                </StyledSectionIcon>
                <StyledSectionTitle>
                  {strings.progression.weeklyActivityTitle}
                </StyledSectionTitle>
              </StyledSectionHeader>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart
                  data={weeklyActivity}
                  margin={{ top: 4, right: 4, bottom: 0, left: -28 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.colors.outlineVariant}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, fill: theme.colors.onSurfaceMuted }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: theme.colors.onSurfaceMuted }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      fontSize: "12px",
                      border: `1px solid ${theme.colors.outlineVariant}`,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.20)",
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.onSurface,
                    }}
                    labelStyle={{ color: theme.colors.onSurfaceMuted }}
                    itemStyle={{ color: theme.colors.onSurface }}
                    cursor={{ fill: theme.colors.outlineVariant, opacity: 0.4 }}
                    formatter={(v: number) => [v, "Treinos"]}
                  />
                  <Bar
                    dataKey="count"
                    fill={theme.colors.primary}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </StyledCard>
          )}

          <StyledCard>
            <StyledSectionHeader>
              <StyledSectionIcon>
                <TrendingUp size={16} />
              </StyledSectionIcon>
              <StyledSectionTitle>
                {strings.progression.chargeProgressionTitle}
              </StyledSectionTitle>
            </StyledSectionHeader>
            {exerciseNames.length === 0 ? (
              <StyledHint>{strings.progression.noExercisesWithData}</StyledHint>
            ) : (
              <StyledChipScroll>
                {exerciseNames.map((name) => (
                  <StyledExerciseChip
                    key={name}
                    $selected={selectedExercise === name}
                    onClick={() => setSelectedExercise(name)}
                  >
                    {name}
                  </StyledExerciseChip>
                ))}
              </StyledChipScroll>
            )}
            {prData && (
              <StyledPrBanner>
                <StyledPrText>
                  <Trophy size={14} style={{ flexShrink: 0 }} />{" "}
                  {strings.progression.prLabel(
                    prData.weight,
                    prData.reps,
                    prData.date,
                  )}
                </StyledPrText>
                {prData.improvement > 0 && (
                  <StyledImprovementBadge>
                    {strings.progression.improvement(prData.improvement)}
                  </StyledImprovementBadge>
                )}
              </StyledPrBanner>
            )}
            {selectedExercise === null ? (
              <StyledHint>{strings.progression.selectExerciseHint}</StyledHint>
            ) : chart.isLoading ? (
              <StyledSkeletonCard style={{ height: 180, margin: 0 }} />
            ) : chart.error ? (
              <StyledHint>{strings.progression.noDataSubtitle}</StyledHint>
            ) : chart.data ? (
              <ProgressionChart
                data={chart.data}
                primaryColor={theme.colors.primary}
                primaryContainerColor={theme.colors.primaryContainer}
                onSurfaceMuted={theme.colors.onSurfaceMuted}
                surfaceColor={theme.colors.surface}
                onSurfaceColor={theme.colors.onSurface}
                outlineVariant={theme.colors.outlineVariant}
              />
            ) : null}
          </StyledCard>

          {muscleSeries.length > 0 && (
            <StyledCard>
              <StyledSectionHeader>
                <StyledSectionIcon>
                  <Dumbbell size={16} />
                </StyledSectionIcon>
                <StyledSectionTitle>
                  {strings.progression.muscleFocusTitle}
                </StyledSectionTitle>
              </StyledSectionHeader>
              <StyledMuscleList>
                {muscleSeries.map(({ group, count, pct }) => (
                  <StyledMuscleRow key={group}>
                    <StyledMuscleName>{group}</StyledMuscleName>
                    <StyledMuscleBarWrap>
                      <StyledMuscleBar
                        $pct={pct}
                        $bg={
                          theme.colors.muscleGroups[group]?.text ??
                          theme.colors.primary
                        }
                      />
                    </StyledMuscleBarWrap>
                    <StyledMuscleCount>
                      {strings.progression.seriesUnit(count)}
                    </StyledMuscleCount>
                  </StyledMuscleRow>
                ))}
              </StyledMuscleList>
            </StyledCard>
          )}
        </StyledBody>
      </StyledPage>
    </PageTransition>
  );
}
