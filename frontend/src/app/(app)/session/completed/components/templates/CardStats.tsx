"use client";

import React, { forwardRef } from "react";
import styled, { useTheme } from "styled-components";

import { WorkoutShareCardProps } from "../WorkoutShareCard";

const CardStats = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function CardStats({ dayName, date, stats, topExercises }, ref) {
    const theme = useTheme();
    const primary = theme.colors.primary;
    const primaryDark = theme.colors.primaryDark;

    return (
      <Root ref={ref}>
        {/* Subtle bg glow */}
        <BgGlow
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${primary}22 0%, transparent 65%)`,
          }}
        />

        <Content>
          {/* Header */}
          <Header>
            <AppName style={{ color: primary }}>LOADUP</AppName>
            <HeaderRight>
              <DayChip>{dayName.split("-")[0].trim()}</DayChip>
            </HeaderRight>
          </Header>

          {/* Hero duration */}
          <HeroBlock>
            <HeroLabel>DURAÇÃO DO TREINO</HeroLabel>
            <HeroVal
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${primary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {stats.duration}
            </HeroVal>
          </HeroBlock>

          {/* Secondary stats */}
          <SecRow>
            <SecCard
              style={{
                borderColor: `${primary}30`,
                background: `${primary}0D`,
              }}
            >
              <SecVal>{stats.series}</SecVal>
              <SecLbl>SÉRIES</SecLbl>
            </SecCard>
            <SecCard
              style={{
                borderColor: `${primary}30`,
                background: `${primary}0D`,
              }}
            >
              <SecVal>{stats.exercises}</SecVal>
              <SecLbl>EXERCÍCIOS</SecLbl>
            </SecCard>
          </SecRow>

          {/* Divider */}
          <Divider />

          {/* Exercise list */}
          <ExLabel>MELHORES SETS</ExLabel>
          <ExList>
            {topExercises.slice(0, 4).map((ex, i) => {
              const isLast = i === Math.min(topExercises.length, 4) - 1;
              return (
                <React.Fragment key={i}>
                  <ExRow>
                    <ExNum style={{ color: primary }}>
                      {String(i + 1).padStart(2, "0")}
                    </ExNum>
                    <ExName>{ex.name}</ExName>
                    <ExBest>
                      <span style={{ color: primary }}>{ex.bestWeight}</span>
                      <ExBestUnit>kg × {ex.bestReps}</ExBestUnit>
                    </ExBest>
                  </ExRow>
                  {!isLast && <ExDivider />}
                </React.Fragment>
              );
            })}
          </ExList>

          {/* Footer */}
          <Footer>
            <FooterDate>{date}</FooterDate>
            <FooterBrand style={{ color: primary }}>LOADUP</FooterBrand>
          </Footer>
        </Content>
      </Root>
    );
  },
);

export default CardStats;

/* ─── Styles ─── */

const BG = "#020617";
const BORDER = "#1E293B";
const TEXT = "#F8FAFC";
const MUTED = "#64748B";
const MUTED2 = "#94A3B8";

const Root = styled.div`
  position: relative;
  width: 360px;
  height: 640px;
  background: ${BG};
  border-radius: 24px;
  overflow: hidden;
`;

const BgGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 24px 20px 20px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
`;

const AppName = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 20px;
  letter-spacing: 0.1em;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DayChip = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${MUTED2};
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid ${BORDER};
`;

const HeroBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  flex-shrink: 0;
  padding: 8px 0 20px;
`;

const HeroLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: ${MUTED};
  margin-bottom: 8px;
`;

const HeroVal = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 64px;
  line-height: 0.9;
  letter-spacing: -0.01em;
  display: block;
`;

const SecRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex-shrink: 0;
  margin-bottom: 16px;
`;

const SecCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 14px 10px;
  border-radius: 16px;
  border: 1px solid;
`;

const SecVal = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 32px;
  color: ${TEXT};
  line-height: 1;
`;

const SecLbl = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${MUTED};
`;

const Divider = styled.div`
  height: 1px;
  background: ${BORDER};
  margin-bottom: 16px;
`;

const ExLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: ${MUTED};
  margin-bottom: 10px;
`;

const ExList = styled.div`
  flex: 1;
  min-height: 0;
`;

const ExRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
`;

const ExDivider = styled.div`
  height: 1px;
  background: ${BORDER};
  flex-shrink: 0;
`;

const ExNum = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 16px;
  width: 22px;
  flex-shrink: 0;
  line-height: 1;
`;

const ExName = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${TEXT};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExBest = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 16px;
  flex-shrink: 0;
`;

const ExBestUnit = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: ${MUTED2};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${BORDER};
`;

const FooterDate = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 11px;
  color: ${MUTED};
`;

const FooterBrand = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 16px;
  letter-spacing: 0.1em;
`;
