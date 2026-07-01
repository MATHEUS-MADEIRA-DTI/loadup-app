"use client";

import React, { forwardRef } from "react";
import styled from "styled-components";

import { WorkoutShareCardProps } from "../WorkoutShareCard";

const CardMinimal = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function CardMinimal(
    { dayName, date, stats, topExercises, muscleGroups = [] },
    ref,
  ) {
    const primaryMuscle = muscleGroups[0]?.toLowerCase() ?? "força";
    const visibleGroups = muscleGroups.slice(0, 3);
    const extraGroups = muscleGroups.length - visibleGroups.length;

    return (
      <Root ref={ref}>
        <Content>
          {/* Header */}
          <TopBar>
            <Wordmark>LOADUP</Wordmark>
            <DoneBadge>✓ CONCLUÍDO</DoneBadge>
          </TopBar>

          {/* Accent bar */}
          <AccentBar />

          {/* Day headline */}
          <DayName>{dayName}</DayName>
          <DateText>
            {date} · treino de {primaryMuscle}
          </DateText>

          <Rule />

          {/* Stats */}
          <StatsRow>
            <StatCell>
              <StatVal>{stats.duration}</StatVal>
              <StatLbl>DURAÇÃO</StatLbl>
            </StatCell>
            <StatSep />
            <StatCell>
              <StatVal>{stats.series}</StatVal>
              <StatLbl>SÉRIES</StatLbl>
            </StatCell>
            <StatSep />
            <StatCell>
              <StatVal>{stats.exercises}</StatVal>
              <StatLbl>EXERCÍCIOS</StatLbl>
            </StatCell>
          </StatsRow>

          <Rule />

          {/* Top 5 sets */}
          <SetsList>
            {topExercises.slice(0, 5).map((ex, i) => (
              <SetRow key={i}>
                <SetRank>{String(i + 1).padStart(2, "0")}</SetRank>
                <SetName>{ex.name}</SetName>
                <SetWeight>
                  <SetKg>{ex.bestWeight}</SetKg>
                  <SetUnit>KG × {ex.bestReps}</SetUnit>
                </SetWeight>
              </SetRow>
            ))}
          </SetsList>

          {/* Muscle group chips */}
          {visibleGroups.length > 0 && (
            <ChipsRow>
              {visibleGroups.map((g, i) => (
                <Chip key={g} $accent={i === 0}>{g}</Chip>
              ))}
              {extraGroups > 0 && <ChipMore>+{extraGroups}</ChipMore>}
            </ChipsRow>
          )}

          {/* Footer */}
          <Footer>
            <Wordmark>LOADUP</Wordmark>
            <DoneBadge>✓ CONCLUÍDO</DoneBadge>
          </Footer>
        </Content>
      </Root>
    );
  },
);

export default CardMinimal;

/* ─── Styles ─── */

const Root = styled.div`
  position: relative;
  width: 360px;
  height: 640px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 24px;
  overflow: hidden;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Wordmark = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.colors.primary};
`;

const DoneBadge = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: ${({ theme }) => theme.colors.success};
`;

const AccentBar = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
  margin-top: 20px;
`;

const DayName = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 60px;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 0.9;
  letter-spacing: -0.01em;
  margin-top: 10px;
`;

const DateText = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 10px;
`;

const Rule = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  margin: 18px 0;
  flex-shrink: 0;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
`;

const StatCell = styled.div`
  flex: 1;
  text-align: center;
`;

const StatSep = styled.div`
  width: 1px;
  height: 32px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  flex-shrink: 0;
`;

const StatVal = styled.div`
  font-family: var(--font-bebas), sans-serif;
  font-size: 26px;
  color: ${({ theme }) => theme.colors.onSurface};
  line-height: 1;
`;

const StatLbl = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-top: 5px;
  text-transform: uppercase;
`;

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  flex: 1;
  min-height: 0;
`;

const SetRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const SetRank = styled.span`
  font-family: var(--font-bebas), sans-serif;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 18px;
  min-width: 22px;
  line-height: 1;
  flex-shrink: 0;
`;

const SetName = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.onSurface};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const SetWeight = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
`;

const SetKg = styled.span`
  color: ${({ theme }) => theme.colors.primary};
`;

const SetUnit = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  margin-left: 2px;
`;

const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  flex-wrap: wrap;
`;

const Chip = styled.span<{ $accent?: boolean }>`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.10em;
  color: ${({ theme }) => theme.colors.onSurface};
  padding: 3px 8px;
  border: 1px solid
    ${({ theme, $accent }) =>
      $accent ? theme.colors.primary : theme.colors.outlineVariant};
  border-radius: 999px;
  background: ${({ theme, $accent }) =>
    $accent ? theme.colors.primaryContainer : "transparent"};
`;

const ChipMore = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.10em;
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
`;
