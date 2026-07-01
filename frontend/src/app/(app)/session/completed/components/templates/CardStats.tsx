"use client";

import React, { forwardRef } from "react";
import styled from "styled-components";

import { WorkoutShareCardProps } from "../WorkoutShareCard";

/* ─── Design tokens ─── */
const ACCENT = "#F43F5E";
const ACCENT_SOFT = "rgba(244,63,94,0.14)";
const BG = "#07070B";
const MUTED = "#6B7280";
const TEXT = "#F8FAFC";

const CardStats = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function CardStats(
    { dayName, date, stats, topExercises, muscleGroups = [] },
    ref,
  ) {
    const dayShort = dayName.split("-")[0].trim();
    const visibleGroups = muscleGroups.slice(0, 3);
    const extraGroups = muscleGroups.length - visibleGroups.length;
    const kgFormatted = Math.round(stats.kg).toLocaleString("pt-BR");

    return (
      <Root ref={ref}>
        <RadialGlow />
        <Content>
          {/* Top bar */}
          <TopBar>
            <Wordmark>LOADUP</Wordmark>
            <DatePill>
              {dayShort} · {date.toUpperCase()}
            </DatePill>
          </TopBar>

          {/* Hero duration with gradient text */}
          <HeroBlock>
            <HeroLabel>DURAÇÃO DO TREINO</HeroLabel>
            <HeroVal>{stats.duration}</HeroVal>
          </HeroBlock>

          <Rule />

          {/* Stats inline row */}
          <StatsRow>
            <StatCell>
              <StatVal>{stats.series}</StatVal>
              <StatLbl>SÉRIES</StatLbl>
            </StatCell>
            <StatSep />
            <StatCell>
              <StatVal>{stats.exercises}</StatVal>
              <StatLbl>EXERCÍCIOS</StatLbl>
            </StatCell>
            <StatSep />
            <StatCell>
              <StatVal>{kgFormatted}</StatVal>
              <StatLbl>KG TOTAIS</StatLbl>
            </StatCell>
          </StatsRow>

          <Rule />

          {/* Top sets header + muscle chips */}
          <SetsHeader>
            <SectionLabel>MELHORES SETS</SectionLabel>
            <ChipsRow>
              {visibleGroups.map((g, i) => (
                <Chip key={g} $accent={i === 0}>{g}</Chip>
              ))}
              {extraGroups > 0 && <ChipMore>+{extraGroups}</ChipMore>}
            </ChipsRow>
          </SetsHeader>

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

          {/* Footer */}
          <Footer>
            <FooterTag>@loadup.app</FooterTag>
            <Wordmark>LOADUP</Wordmark>
          </Footer>
        </Content>
      </Root>
    );
  },
);

export default CardStats;

/* ─── Styles ─── */

const Root = styled.div`
  position: relative;
  width: 360px;
  height: 640px;
  background: ${BG};
  border-radius: 24px;
  overflow: hidden;
`;

const RadialGlow = styled.div`
  position: absolute;
  inset-x: 0;
  top: 0;
  height: 55%;
  pointer-events: none;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(244, 63, 94, 0.22) 0%,
    rgba(244, 63, 94, 0.06) 40%,
    transparent 70%
  );
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
  color: ${ACCENT};
`;

const DatePill = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: ${TEXT};
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
`;

const HeroBlock = styled.div`
  margin-top: 24px;
  text-align: center;
`;

const HeroLabel = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.22em;
  color: ${MUTED};
  text-transform: uppercase;
`;

const HeroVal = styled.div`
  font-family: var(--font-bebas), sans-serif;
  font-size: 86px;
  line-height: 0.9;
  margin-top: 8px;
  background: linear-gradient(180deg, #ffffff 0%, ${ACCENT} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Rule = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.10);
  margin: 16px 0;
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
  background: rgba(255, 255, 255, 0.10);
  flex-shrink: 0;
`;

const StatVal = styled.div`
  font-family: var(--font-bebas), sans-serif;
  font-size: 26px;
  color: ${TEXT};
  line-height: 1;
`;

const StatLbl = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: ${MUTED};
  margin-top: 5px;
  text-transform: uppercase;
`;

const SetsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SectionLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: ${MUTED};
  text-transform: uppercase;
`;

const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Chip = styled.span<{ $accent?: boolean }>`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.10em;
  color: ${TEXT};
  padding: 2px 7px;
  border: 1px solid
    ${({ $accent }) => ($accent ? ACCENT : "rgba(255,255,255,0.14)")};
  border-radius: 999px;
  background: ${({ $accent }) => ($accent ? ACCENT_SOFT : "transparent")};
`;

const ChipMore = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.10em;
  color: ${MUTED};
`;

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 11px;
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
  color: ${ACCENT};
  font-size: 18px;
  min-width: 22px;
  line-height: 1;
  flex-shrink: 0;
`;

const SetName = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-weight: 600;
  font-size: 12px;
  color: ${TEXT};
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
  color: ${ACCENT};
`;

const SetUnit = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 9px;
  font-weight: 600;
  color: ${MUTED};
  margin-left: 2px;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 12px;
`;

const FooterTag = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 10px;
  color: ${MUTED};
`;
