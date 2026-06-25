"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, MinusCircle } from "lucide-react";

import MuscleChip from "@/components/MuscleChip";
import PageTransition from "@/components/PageTransition";
import { strings } from "@/constants/strings";
import { useMonthlyCalendar } from "@/hooks/useCalendar";
import { useTodaySession } from "@/hooks/useSession";
import { useTrainingSheet } from "@/hooks/useTrainingSheet";
import { DayOfWeek, MuscleGroup } from "@/types";

import HistorySessionItem from "./components/HistorySessionItem";
import SessionView from "./components/SessionView";
import WorkoutIntro from "./components/WorkoutIntro";

import {
  StyledDayCardSkeleton,
  StyledEmptyText,
  StyledHeader,
  StyledPage,
  StyledSectionTitle,
  StyledSubtitle,
  StyledTabBar,
  StyledTabBtn,
  StyledTabContent,
  StyledTabIndicator,
  StyledTitle,
  StyledTodayStatusCard,
  StyledTodayStatusInfo,
  StyledTodayStatusSub,
  StyledTodayStatusTitle,
} from "./styles";
import {
  type ActiveTab,
  type AppView,
  DAY_FULL,
  todayDayOfWeek,
  todayIso,
} from "./utils";

export default function TrainPage() {
  const router = useRouter();
  const now = new Date();
  const [view, setView] = useState<AppView>("tabs");
  const [activeTab, setActiveTab] = useState<ActiveTab>("iniciar");
  const [sessionDay, setSessionDay] = useState<DayOfWeek | null>(null);

  const sheet = useTrainingSheet();
  const todaySession = useTodaySession();
  const monthly = useMonthlyCalendar(now.getFullYear(), now.getMonth() + 1);
  const prevMonthYear =
    now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
  const prevMonthly = useMonthlyCalendar(prevMonthYear, prevMonth);
  const todayDow = todayDayOfWeek();
  const session = useTodaySession();
  const todaySheetDay = sheet.data?.days.find((d) => d.dayOfWeek === todayDow);
  useEffect(() => {
    if (
      session.data?.status === "completed" ||
      session.data?.status === "skipped"
    ) {
      router.push("/session/completed");
    }
  }, [session.data, router]);
  useEffect(() => {
    if (
      sheet.data &&
      todaySheetDay?.status === "training" &&
      view === "tabs" &&
      (!session.data?.status || session.data?.status === "partial")
    ) {
      setView("intro");
    }
  }, [sheet.data, todaySheetDay, session.data, view]);
  const nextTrainingDay = useMemo<DayOfWeek | null>(() => {
    const orderedDays: DayOfWeek[] = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    if (!sheet.data) return null;
    const todayIndex = orderedDays.indexOf(todayDow);
    for (let offset = 1; offset < orderedDays.length; offset += 1) {
      const nextDow = orderedDays[(todayIndex + offset) % orderedDays.length];
      const nextDay = sheet.data.days.find((d) => d.dayOfWeek === nextDow);
      if (nextDay?.status === "training") {
        return nextDow;
      }
    }
    return null;
  }, [sheet.data, todayDow]);

  const pastSessions = useMemo(() => {
    const todayStr = todayIso();
    const all = [
      ...(monthly.data?.days ?? []),
      ...(prevMonthly.data?.days ?? []),
    ];
    return all
      .filter(
        (d) =>
          (d.sessionStatus === "recorded" ||
            d.sessionStatus === "skipped" ||
            d.sessionStatus === "pending") &&
          d.date.substring(0, 10) <= todayStr,
      )
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [monthly.data, prevMonthly.data]);

  const handleStartDay = (dow: DayOfWeek) => {
    setSessionDay(dow);
    setView("session");
  };
  const handleBack = () => {
    router.push("/training-plan");
  };

  if (view === "session" && sessionDay) {
    const sheetDay = sheet.data?.days.find((d) => d.dayOfWeek === sessionDay);
    return (
      <SessionView
        dayOfWeek={sessionDay}
        sheetDay={sheetDay}
        onBack={handleBack}
      />
    );
  }
  if (view === "intro" && todaySheetDay) {
    return (
      <WorkoutIntro
        dayOfWeek={todayDow}
        sheetDay={todaySheetDay}
        onBack={() => router.push("/")}
        onStart={() => handleStartDay(todayDow)}
      />
    );
  }

  const todayStatus = todaySession.data?.status;
  const todayDone = todayStatus === "completed" || todayStatus === "skipped";
  const todayPartial = todayStatus === "partial";
  const seriesCount = todaySession.data?.records?.length ?? 0;
  const isPartial = todayPartial;
  const isNotStarted = isPartial && seriesCount === 0;
  const isInProgress = isPartial && seriesCount > 0;

  const todayMuscles = todaySheetDay
    ? Array.from(
        new Set(todaySheetDay.exercises.map((ex) => ex.muscleGroup)),
      ).slice(0, 3)
    : [];

  return (
    <PageTransition>
      <StyledPage>
        <StyledTabBar>
          <StyledTabBtn
            $active={activeTab === "iniciar"}
            onClick={() => setActiveTab("iniciar")}
          >
            {strings.workout.tabIniciar}
          </StyledTabBtn>
          <StyledTabBtn
            $active={activeTab === "historico"}
            onClick={() => setActiveTab("historico")}
          >
            {strings.workout.tabHistorico(pastSessions.length)}
          </StyledTabBtn>
          <StyledTabIndicator $right={activeTab === "historico"} />
        </StyledTabBar>

        {activeTab === "iniciar" ? (
          <StyledTabContent key="iniciar">
            {sheet.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <StyledDayCardSkeleton key={i} />
              ))
            ) : todaySheetDay && todaySheetDay.status === "training" ? (
              <StyledTodayStatusCard
                $status="training"
                onClick={() => setView("intro")}
                style={{ cursor: "pointer" }}
              >
                <StyledTodayStatusInfo>
                  <StyledTodayStatusTitle>
                    {DAY_FULL[todayDow]}
                  </StyledTodayStatusTitle>
                  <StyledTodayStatusSub>
                    {todaySheetDay.exercises.length} exercícios · Toque para
                    iniciar
                  </StyledTodayStatusSub>
                </StyledTodayStatusInfo>
              </StyledTodayStatusCard>
            ) : (
              <>
                <StyledTodayStatusCard $status="rest">
                  <StyledTodayStatusInfo>
                    <StyledTodayStatusTitle>
                      {strings.home.restDayBigTitle}
                    </StyledTodayStatusTitle>
                    <StyledTodayStatusSub>
                      {strings.home.restDaySubtitle}
                    </StyledTodayStatusSub>
                  </StyledTodayStatusInfo>
                </StyledTodayStatusCard>
                <StyledSectionTitle>
                  {strings.home.todayIsRest}
                </StyledSectionTitle>
                {nextTrainingDay && (
                  <StyledEmptyText>
                    {`Próximo treino: ${DAY_FULL[nextTrainingDay]}`}
                  </StyledEmptyText>
                )}
              </>
            )}
          </StyledTabContent>
        ) : (
          <StyledTabContent key="historico">
            {monthly.isLoading || prevMonthly.isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <StyledDayCardSkeleton key={i} />
              ))
            ) : pastSessions.length === 0 ? (
              <StyledEmptyText>{strings.workout.noHistory}</StyledEmptyText>
            ) : (
              pastSessions.map((day) => {
                const sheetDay = sheet.data?.days.find(
                  (d) => d.dayOfWeek === day.dayOfWeek,
                );
                return (
                  <HistorySessionItem
                    key={day.date}
                    day={day}
                    sheetDay={sheetDay}
                    onClick={() =>
                      router.push(`/session/${day.date.split("T")[0]}`)
                    }
                  />
                );
              })
            )}
          </StyledTabContent>
        )}
      </StyledPage>
    </PageTransition>
  );
}
