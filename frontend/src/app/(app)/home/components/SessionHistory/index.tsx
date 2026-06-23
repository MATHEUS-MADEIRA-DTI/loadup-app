"use client";

import { strings } from "@/constants/strings";

import { DAY_FULL_LABELS, formatShortDate, RecentSession } from "../../utils";

import {
  StyledRecentHeader,
  StyledSectionTitle,
  StyledSessionBadge,
  StyledSessionContent,
  StyledSessionDate,
  StyledSessionIcon,
  StyledSessionItem,
  StyledSessionList,
  StyledSessionMeta,
  StyledSessionName,
  StyledSessionNameRow,
  StyledViewAllBtn,
} from "./styles";

interface SessionHistoryProps {
  sessions: RecentSession[];
  onViewAll: () => void;
  onSessionClick: (date: string) => void;
}

export default function SessionHistory({
  sessions,
  onViewAll,
  onSessionClick,
}: SessionHistoryProps) {
  return (
    <>
      <StyledRecentHeader>
        <StyledSectionTitle>{strings.home.recentSessions}</StyledSectionTitle>
        <StyledViewAllBtn onClick={onViewAll}>
          {strings.home.viewAll} &rsaquo;
        </StyledViewAllBtn>
      </StyledRecentHeader>

      <StyledSessionList>
        {sessions.map((session) => (
          <StyledSessionItem
            key={session.date}
            onClick={() => onSessionClick(session.date)}
          >
            <StyledSessionIcon $status={session.sessionStatus}>
              {session.sessionStatus === "recorded" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
              ) : session.sessionStatus === "skipped" ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
                </svg>
              )}
            </StyledSessionIcon>

            <StyledSessionContent>
              <StyledSessionNameRow>
                <StyledSessionName>
                  {DAY_FULL_LABELS[session.dayOfWeek]}
                </StyledSessionName>
                <StyledSessionBadge $status={session.sessionStatus}>
                  {session.sessionStatus === "recorded"
                    ? strings.home.completedBadge
                    : session.sessionStatus === "skipped"
                      ? strings.home.skippedBadge
                      : strings.home.partialBadge}
                </StyledSessionBadge>
              </StyledSessionNameRow>
              <StyledSessionMeta>
                {session.muscles.length > 0
                  ? `${session.muscles.join(" · ")} · ${strings.home.seriesCount(session.totalSeries)}`
                  : strings.home.seriesCount(session.totalSeries)}
              </StyledSessionMeta>
            </StyledSessionContent>

            <StyledSessionDate>
              {formatShortDate(session.date)}
            </StyledSessionDate>
          </StyledSessionItem>
        ))}
      </StyledSessionList>
    </>
  );
}
