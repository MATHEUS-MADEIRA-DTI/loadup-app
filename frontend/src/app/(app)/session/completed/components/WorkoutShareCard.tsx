"use client";

import React, { forwardRef } from "react";
import styled from "styled-components";

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
  muscleGroups?: string[];
}

/* ─── Design tokens (standalone palette, independent of app theme) ─── */
const ACCENT = "#F43F5E";
const ACCENT_SOFT = "rgba(244,63,94,0.14)";
const BG = "#07070B";
const MUTED = "#6B7280";
const TEXT = "#F8FAFC";

const WorkoutShareCard = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function WorkoutShareCard(
    { dayName, date, stats, topExercises, photoUrl, muscleGroups = [] },
    ref,
  ) {
    const visibleGroups = muscleGroups.slice(0, 3);
    const extraGroups = muscleGroups.length - visibleGroups.length;

    return (
      <Root ref={ref}>
        {/* Background: photo or gradient fallback */}
        {photoUrl ? (
          <BgPhoto src={photoUrl} alt="" />
        ) : (
          <BgGradient />
        )}
        {/* Overlay wash: red top → dark bottom */}
        <Wash $hasPhoto={!!photoUrl} />

        <ContentCol>
          <TopBar>
            <Wordmark>LOADUP</Wordmark>
            <DoneBadge>✓ CONCLUÍDO</DoneBadge>
          </TopBar>

          {/* All content pushed to bottom */}
          <BottomStack>
            <DayName>{dayName}</DayName>
            <DateText>{date}</DateText>

            {/* Glassmorphism stats card */}
            <GlassCard>
              <GlassStat>
                <GlassVal>{stats.duration}</GlassVal>
                <GlassLbl>DURAÇÃO</GlassLbl>
              </GlassStat>
              <GlassSep />
              <GlassStat>
                <GlassVal>{stats.series}</GlassVal>
                <GlassLbl>SÉRIES</GlassLbl>
              </GlassStat>
              <GlassSep />
              <GlassStat>
                <GlassVal>{stats.exercises}</GlassVal>
                <GlassLbl>EXERC.</GlassLbl>
              </GlassStat>
            </GlassCard>

            {/* Top 3 sets */}
            <SetsLabel>TOP 3 · MELHORES SETS</SetsLabel>
            <SetsList>
              {topExercises.slice(0, 3).map((ex, i) => (
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

            <FooterRow>
              <FooterTag>@loadup.app</FooterTag>
              <Wordmark>LOADUP</Wordmark>
            </FooterRow>
          </BottomStack>
        </ContentCol>
      </Root>
    );
  },
);

export default WorkoutShareCard;

/* ─── Styles ─── */

const Root = styled.div`
  position: relative;
  width: 360px;
  height: 640px;
  background: ${BG};
  border-radius: 24px;
  overflow: hidden;
`;

const BgPhoto = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.9) contrast(1.05);
`;

const BgGradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    rgba(244, 63, 94, 0.28) 0%,
    rgba(7, 7, 11, 0.6) 50%,
    ${BG} 100%
  );
`;

const Wash = styled.div<{ $hasPhoto: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: ${({ $hasPhoto }) =>
    $hasPhoto
      ? `linear-gradient(180deg, rgba(244,63,94,0.55) 0%, rgba(15,15,20,0.15) 35%, rgba(7,7,11,0.9) 70%, ${BG} 100%)`
      : `linear-gradient(180deg, rgba(244,63,94,0.20) 0%, transparent 55%)`};
`;

const ContentCol = styled.div`
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

const DoneBadge = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: #4ade80;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
`;

const BottomStack = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;

const DayName = styled.h1`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 54px;
  color: ${TEXT};
  line-height: 0.88;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  margin: 0;
  letter-spacing: -0.01em;
`;

const DateText = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 6px;
`;

const GlassCard = styled.div`
  display: flex;
  align-items: center;
  border-radius: 16px;
  padding: 14px 16px;
  margin-top: 16px;
  background: rgba(7, 7, 11, 0.72);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

const GlassStat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const GlassSep = styled.div`
  width: 1px;
  height: 28px;
  background: rgba(255, 255, 255, 0.10);
  flex-shrink: 0;
`;

const GlassVal = styled.span`
  font-family: var(--font-bebas), sans-serif;
  font-size: 26px;
  color: ${TEXT};
  line-height: 1;
`;

const GlassLbl = styled.span`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 9px;
  letter-spacing: 0.12em;
  color: ${MUTED};
  text-transform: uppercase;
`;

const SetsLabel = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  margin-top: 16px;
  margin-bottom: 10px;
`;

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SetRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const SetRank = styled.span`
  font-family: var(--font-bebas), sans-serif;
  color: ${ACCENT};
  font-size: 17px;
  min-width: 20px;
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
  font-size: 17px;
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
  color: ${TEXT};
  padding: 3px 8px;
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

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
`;

const FooterTag = styled.span`
  font-family: var(--font-inter), sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
`;
