"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import PageTransition from "@/components/PageTransition";
import { useTodaySession } from "@/hooks/useSession";
import { useTrainingSheet } from "@/hooks/useTrainingSheet";
import { DayOfWeek } from "@/types";

import RestAlertsModal from "./components/RestAlertsModal";
import SessionView from "./components/SessionView";
import WorkoutIntro from "./components/WorkoutIntro";
import { RestAlertsProvider } from "./context/RestAlertsContext";
import { StyledDayCardSkeleton, StyledPage } from "./styles";
import { type AppView, todayDayOfWeek } from "./utils";

export default function TrainPage() {
  return (
    <RestAlertsProvider>
      <TrainPageContent />
    </RestAlertsProvider>
  );
}

function TrainPageContent() {
  const router = useRouter();
  const [view, setView] = useState<AppView>("tabs");
  const [sessionDay, setSessionDay] = useState<DayOfWeek | null>(null);

  const sheet = useTrainingSheet();
  const todaySession = useTodaySession();
  const todayDow = todayDayOfWeek();
  const todaySheetDay = sheet.data?.days.find((d) => d.dayOfWeek === todayDow);

  useEffect(() => {
    if (
      todaySession.data?.status === "completed" ||
      todaySession.data?.status === "skipped"
    ) {
      router.push("/session/completed");
    }
  }, [todaySession.data, router]);

  useEffect(() => {
    if (
      sheet.data &&
      todaySheetDay?.status === "training" &&
      view === "tabs" &&
      (!todaySession.data?.status || todaySession.data?.status === "partial")
    ) {
      setView("intro");
    }
  }, [sheet.data, todaySheetDay, todaySession.data, view]);

  useEffect(() => {
    if (view === "tabs" && sheet.data && todaySheetDay?.status !== "training") {
      router.replace("/home");
    }
  }, [view, sheet.data, todaySheetDay?.status, router]);

  if (view === "session" && sessionDay) {
    const sheetDay = sheet.data?.days.find((d) => d.dayOfWeek === sessionDay);
    return (
      <>
        <SessionView
          dayOfWeek={sessionDay}
          sheetDay={sheetDay}
          onBack={() => router.push("/training-plan")}
        />
        <RestAlertsModal />
      </>
    );
  }

  if (view === "intro" && todaySheetDay) {
    return (
      <>
        <WorkoutIntro
          dayOfWeek={todayDow}
          sheetDay={todaySheetDay}
          onBack={() => router.push("/")}
          onStart={() => {
            localStorage.setItem("workout_started_at", String(Date.now()));
            setSessionDay(todayDow);
            setView("session");
          }}
        />
        <RestAlertsModal />
      </>
    );
  }

  return (
    <PageTransition>
      <StyledPage>
        <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <StyledDayCardSkeleton />
          <StyledDayCardSkeleton />
        </div>
      </StyledPage>
    </PageTransition>
  );
}
