"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MinusCircle } from "lucide-react";

import MuscleChip from "@/components/MuscleChip";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import { useMonthlyCalendar } from "@/hooks/useCalendar";
import { useTodaySession } from "@/hooks/useSession";
import { useTrainingSheet } from "@/hooks/useTrainingSheet";
import { DayOfWeek, MuscleGroup } from "@/types";

import DaySelectCard from "./components/DaySelectCard";
import HistorySessionItem from "./components/HistorySessionItem";
import SessionView from "./components/SessionView";
import {
  StyledCtaArea, StyledCtaBtn, StyledCtaTodayDone, StyledDayCardSkeleton,
  StyledEmptyText, StyledHeader, StyledPage, StyledSectionTitle, StyledSubtitle,
  StyledTabBar, StyledTabBtn, StyledTabContent, StyledTabIndicator, StyledTitle,
  StyledTodayStatusBadge, StyledTodayStatusCard, StyledTodayStatusIcon,
  StyledTodayStatusInfo, StyledTodayStatusMuscles, StyledTodayStatusSub,
  StyledTodayStatusTitle,
} from "./styles";
import { type ActiveTab, type AppView, DAY_FULL, todayDayOfWeek, todayIso } from "./utils";

export default function TrainPage() {
  const router = useRouter();
  const now = new Date();
  const [view, setView] = useState<AppView>("tabs");
  const [activeTab, setActiveTab] = useState<ActiveTab>("iniciar");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);
  const [sessionDay, setSessionDay] = useState<DayOfWeek | null>(null);

  const sheet = useTrainingSheet();
  const todaySession = useTodaySession();
  const monthly = useMonthlyCalendar(now.getFullYear(), now.getMonth() + 1);
  const prevMonthYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const prevMonthly = useMonthlyCalendar(prevMonthYear, prevMonth);
  const todayDow = todayDayOfWeek();

  const trainingDays = useMemo(() => sheet.data?.days.filter((d) => d.status === "training") ?? [], [sheet.data]);

  const pastSessions = useMemo(() => {
    const todayStr = todayIso();
    const all = [...(monthly.data?.days ?? []), ...(prevMonthly.data?.days ?? [])];
    return all
      .filter((d) => (d.sessionStatus === "recorded" || d.sessionStatus === "skipped" || d.sessionStatus === "pending") && d.date.substring(0, 10) <= todayStr)
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [monthly.data, prevMonthly.data]);

  const handleStartDay = (dow: DayOfWeek) => { setSessionDay(dow); setView("session"); };
  const handleBack = () => { setView("tabs"); setSessionDay(null); };

  if (view === "session" && sessionDay) {
    const sheetDay = sheet.data?.days.find((d) => d.dayOfWeek === sessionDay);
    return <SessionView dayOfWeek={sessionDay} sheetDay={sheetDay} onBack={handleBack} />;
  }

  const todayStatus = todaySession.data?.status;
  const todayDone = todayStatus === "completed" || todayStatus === "skipped";
  const todayPartial = todayStatus === "partial";
  const seriesCount = todaySession.data?.records?.length ?? 0;
  const isDone = todayStatus === "completed" || todayStatus === "skipped";
  const isPartial = todayStatus === "partial";
  const isNotStarted = isPartial && seriesCount === 0;
  const isInProgress = isPartial && seriesCount > 0;
  const todaySheetDay = sheet.data?.days.find((d) => d.dayOfWeek === todayDow);
  const todayMuscles = todaySheetDay ? Array.from(new Set(todaySheetDay.exercises.map((ex) => ex.muscleGroup))).slice(0, 3) : [];

  return (
    <PageTransition>
      <StyledPage>
        <StyledHeader>
          <StyledSubtitle>LoadUp</StyledSubtitle>
          <StyledTitle>{strings.workout.titleFull}</StyledTitle>
        </StyledHeader>

        <StyledTabBar>
          <StyledTabBtn $active={activeTab === "iniciar"} onClick={() => setActiveTab("iniciar")}>{strings.workout.tabIniciar}</StyledTabBtn>
          <StyledTabBtn $active={activeTab === "historico"} onClick={() => setActiveTab("historico")}>{strings.workout.tabHistorico(pastSessions.length)}</StyledTabBtn>
          <StyledTabIndicator $right={activeTab === "historico"} />
        </StyledTabBar>

        {activeTab === "iniciar" ? (
          <StyledTabContent key="iniciar">
            {todaySession.data && (isDone || isPartial) && (
              <StyledTodayStatusCard $status={todayStatus ?? "partial"}>
                <StyledTodayStatusIcon $status={todayStatus ?? "partial"}>
                  {todayStatus === "completed" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" /></svg>
                  ) : todayStatus === "skipped" ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                  ) : isInProgress ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 18.43 22 16.29 20.57 14.86z" /></svg>
                  )}
                </StyledTodayStatusIcon>
                <StyledTodayStatusInfo>
                  <StyledTodayStatusTitle>Treino de Hoje</StyledTodayStatusTitle>
                  {isNotStarted ? (
                    <>
                      <StyledTodayStatusSub>{DAY_FULL[todayDow]}</StyledTodayStatusSub>
                      {todayMuscles.length > 0 && (
                        <StyledTodayStatusMuscles>{todayMuscles.map((mg) => <MuscleChip key={mg} muscleGroup={mg as MuscleGroup} />)}</StyledTodayStatusMuscles>
                      )}
                    </>
                  ) : (
                    <StyledTodayStatusSub>
                      {todayStatus === "completed" ? strings.workout.statusRecorded : todayStatus === "skipped" ? strings.workout.statusSkipped : "Em andamento"}
                      {" · "}{seriesCount} série{seriesCount !== 1 ? "s" : ""} registrada{seriesCount !== 1 ? "s" : ""}
                    </StyledTodayStatusSub>
                  )}
                </StyledTodayStatusInfo>
                <StyledTodayStatusBadge $status={todayStatus ?? "partial"}>
                  {isNotStarted ? "Hoje" : todayStatus === "completed" ? strings.workout.statusRecorded : todayStatus === "skipped" ? strings.workout.statusSkipped : "Parcial"}
                </StyledTodayStatusBadge>
              </StyledTodayStatusCard>
            )}

            <StyledSectionTitle>{strings.workout.selectDayTitle}</StyledSectionTitle>

            {sheet.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => <StyledDayCardSkeleton key={i} />)
            ) : trainingDays.length === 0 ? (
              <StyledEmptyText>{strings.workout.noSheetText}</StyledEmptyText>
            ) : (
              trainingDays.map((day) => (
                <DaySelectCard key={day.dayOfWeek} day={day} isSelected={selectedDay === day.dayOfWeek}
                  onClick={() => setSelectedDay((prev) => prev === day.dayOfWeek ? null : day.dayOfWeek)} />
              ))
            )}

            <StyledCtaArea>
              {todayDone ? (
                <StyledCtaTodayDone $skipped={todayStatus === "skipped"}>
                  {todayStatus === "completed" ? <CheckCircle2 size={18} strokeWidth={2} /> : <MinusCircle size={18} strokeWidth={2} />}
                  <span>{todayStatus === "completed" ? strings.workout.completedTitle : strings.workout.skippedTitle}</span>
                </StyledCtaTodayDone>
              ) : (() => {
                const targetDow = selectedDay ?? todayDow;
                const canStart = !todayDone && (selectedDay !== null || trainingDays.some((d) => d.dayOfWeek === todayDow));
                return (
                  <StyledCtaBtn $disabled={!canStart} onClick={() => canStart && handleStartDay(targetDow)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    {todayPartial ? strings.workout.startCta(DAY_FULL[todayDow]) + " (continuar)" : strings.workout.startCta(DAY_FULL[targetDow])}
                  </StyledCtaBtn>
                );
              })()}
            </StyledCtaArea>
          </StyledTabContent>
        ) : (
          <StyledTabContent key="historico">
            {monthly.isLoading || prevMonthly.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <StyledDayCardSkeleton key={i} />)
            ) : pastSessions.length === 0 ? (
              <StyledEmptyText>{strings.workout.noHistory}</StyledEmptyText>
            ) : (
              pastSessions.map((day) => {
                const sheetDay = sheet.data?.days.find((d) => d.dayOfWeek === day.dayOfWeek);
                return (
                  <HistorySessionItem key={day.date} day={day} sheetDay={sheetDay}
                    onClick={() => router.push(`/session/${day.date.split("T")[0]}`)} />
                );
              })
            )}
          </StyledTabContent>
        )}
      </StyledPage>
    </PageTransition>
  );
}