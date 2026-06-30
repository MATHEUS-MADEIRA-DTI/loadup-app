"use client";

import React, { forwardRef } from "react";
import styled, { useTheme } from "styled-components";

export interface ShareCardExercise {
  name: string;
  bestWeight: number;
  bestReps: number;
}

export interface WorkoutShareCardProps {
  dayName: string;
  date: string;
  stats: { kg: number; series: number; exercises: number; duration: string };
  topExercises: ShareCardExercise[];
  photoUrl?: string | null;
}

const WorkoutShareCard = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function WorkoutShareCard(
    { dayName, date, stats, topExercises, photoUrl },
    ref,
  ) {
    const theme = useTheme();
    const primary = theme.colors.primary;
    const primaryDark = theme.colors.primaryDark;

    return (
      <CardRoot ref={ref}>
        {/* ambient glow */}
        <GlowOrb
          style={{
            background: `radial-gradient(circle, ${primary}30 0%, transparent 70%)`,
          }}
        />

        {/* header */}
        <CardHeader>
          <AppRow>
            <AppName style={{ color: primary }}>LOADUP</AppName>
            <DoneBadge>CONCLUÍDO</DoneBadge>
          </AppRow>
        </CardHeader>

        {/* photo or gradient hero */}
        <HeroArea
          $hasPhoto={!!photoUrl}
          style={
            photoUrl
              ? {
                  backgroundImage: `url(${photoUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background: `linear-gradient(160deg, ${primaryDark}55 0%, ${primary}25 50%, transparent 100%)`,
                }
          }
        >
          {photoUrl ? (
            <HeroOverlay
              style={{
                background: `linear-gradient(to top, #020617 0%, #020617aa 30%, transparent 70%)`,
              }}
            />
          ) : (
            <HeroPattern />
          )}
          <HeroText>
            <HeroDayName>{dayName}</HeroDayName>
            <HeroDate>{date}</HeroDate>
          </HeroText>
        </HeroArea>

        {/* stats */}
        <StatsRow>
          <StatItem>
            <StatValue>{stats.duration}</StatValue>
            <StatLabel>DURAÇÃO</StatLabel>
          </StatItem>
          <StatSep />
          <StatItem>
            <StatValue>{stats.series}</StatValue>
            <StatLabel>SÉRIES</StatLabel>
          </StatItem>
          <StatSep />
          <StatItem>
            <StatValue>{stats.exercises}</StatValue>
            <StatLabel>EXERCÍCIOS</StatLabel>
          </StatItem>
        </StatsRow>

        {/* exercises */}
        <ExSection>
          <ExSectionLabel>EXERCÍCIOS</ExSectionLabel>
          {topExercises.slice(0, 4).map((ex, i) => (
            <React.Fragment key={i}>
              <ExRow>
                <ExIdx style={{ color: primary }}>
                  {String(i + 1).padStart(2, "0")}
                </ExIdx>
                <ExName>{ex.name}</ExName>
                <ExBest>
                  {ex.bestWeight}
                  <ExBestUnit>kg</ExBestUnit>
                  {" × "}
                  {ex.bestReps}
                </ExBest>
              </ExRow>
              {i < Math.min(topExercises.length, 4) - 1 && <ExDivider />}
            </React.Fragment>
          ))}
          {topExercises.length > 4 && (
            <OverflowHint>+{topExercises.length - 3} exercícios</OverflowHint>
          )}
        </ExSection>

        {/* footer */}
        <CardFooter>
          <FooterBrand style={{ color: primary }}>LOADUP</FooterBrand>
        </CardFooter>
      </CardRoot>
    );
  },
);

export default WorkoutShareCard;

/* ─── Styles (hardcoded dark for consistent sharing) ─── */

const BG = "#020617";
const SURFACE = "#0F172A";
const BORDER = "#1E293B";
const TEXT = "#F8FAFC";
const MUTED = "#64748B";
const MUTED2 = "#94A3B8";

const CARD_H = 640;

const CardRoot = styled.div`
  position: relative;
  width: 360px;
  height: ${CARD_H}px;
  background: ${BG};
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GlowOrb = styled.div`
  position: absolute;
  top: -80px;
  right: -80px;
  width: 280px;
  height: 280px;
  pointer-events: none;
  z-index: 0;
`;

const CardHeader = styled.div`
  position: relative;
  z-index: 1;
  padding: 20px 20px 0;
`;

const AppRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AppName = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 22px;
  letter-spacing: 0.08em;
  line-height: 1;
`;

const DoneBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #22c55e;
  font-family: var(--font-barlow), sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
`;

const DoneDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
`;

const HeroArea = styled.div<{ $hasPhoto: boolean }>`
  position: relative;
  z-index: 1;
  height: 190px;
  flex-shrink: 0;
  margin: 14px 20px 0;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: ${SURFACE};
  background-size: cover;
  background-position: center;
`;

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const HeroPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.08;
  background-image: repeating-linear-gradient(
    45deg,
    #ffffff 0px,
    #ffffff 1px,
    transparent 1px,
    transparent 20px
  );
`;

const HeroText = styled.div`
  position: relative;
  z-index: 1;
  padding: 16px;
`;

const HeroDayName = styled.div`
  font-family: var(--font-bebas), sans-serif;
  font-size: 36px;
  color: ${TEXT};
  line-height: 1;
  letter-spacing: 0.02em;
`;

const HeroDate = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 12px;
  color: rgba(248, 250, 252, 0.7);
  margin-top: 2px;
`;

const StatsRow = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 14px 20px 0;
  padding: 14px 0;
  border-top: 1px solid ${BORDER};
  border-bottom: 1px solid ${BORDER};
`;

const StatItem = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const StatSep = styled.div`
  width: 1px;
  height: 32px;
  background: ${BORDER};
`;

const StatValue = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 28px;
  color: ${TEXT};
  line-height: 1;
`;

const StatLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${MUTED};
`;

const ExSection = styled.div`
  position: relative;
  z-index: 1;
  margin: 14px 20px 0;
  flex: 1;
  min-height: 0;
`;

const ExSectionLabel = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: ${MUTED};
  margin-bottom: 8px;
`;

const ExRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 16px 0;
`;

const ExDivider = styled.div``;

const OverflowHint = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 11px;
  color: ${MUTED};
  padding: 6px 0 2px;
`;

const ExIdx = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 18px;
  line-height: 1.2 !important;
  width: 24px;
  flex-shrink: 0;
`;

const ExBest = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 16px;
  color: ${MUTED2};
  flex-shrink: 0;
  line-height: 1.2 !important;
`;

const ExName = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${TEXT};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.4 !important;
  padding-bottom: 2px;
`;

const ExBestUnit = styled.span`
  font-size: 11px;
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
`;

const CardFooter = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin: 14px 20px 20px;
  padding-top: 12px;
  border-top: 1px solid ${BORDER};
`;

const FooterBrand = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 16px;
  letter-spacing: 0.1em;
`;

const FooterTag = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 11px;
  color: ${MUTED};
`;
