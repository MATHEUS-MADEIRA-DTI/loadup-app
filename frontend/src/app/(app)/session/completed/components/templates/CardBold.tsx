"use client";

import React, { forwardRef } from "react";
import styled from "styled-components";

import { WorkoutShareCardProps } from "../WorkoutShareCard";

const CardBold = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function CardBold(
    { dayName, date, stats, topExercises, photoUrl, muscleGroups = [] },
    ref,
  ) {
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

          {/* Photo card / Polaroid */}
          <PhotoCard>
            {photoUrl ? (
              <PhotoImg src={photoUrl} alt="" />
            ) : (
              <PhotoFallback />
            )}
            <PhotoOverlay />
            <AccentCorner />
            <PhotoText>
              <PhotoDayName>{dayName}</PhotoDayName>
              <PhotoDate>{date}</PhotoDate>
            </PhotoText>
          </PhotoCard>

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

          {/* Top sets header + chips */}
          <SetsHeader>
            <SectionLabel>MELHORES SETS</SectionLabel>
            <ChipsRow>
              {visibleGroups.map((g, i) => (
                <Chip key={g} $accent={i === 0}>{g}</Chip>
              ))}
              {extraGroups > 0 && <ChipMore>+{extraGroups}</ChipMore>}
            </ChipsRow>
          </SetsHeader>

          {/* Top 4 sets */}
          <SetsList>
            {topExercises.slice(0, 4).map((ex, i) => (
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
            <Wordmark>LOADUP</Wordmark>
            <FooterTag>@loadup.app</FooterTag>
          </Footer>
        </Content>
      </Root>
    );
  },
);

export default CardBold;

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
  padding: 22px 22px 20px;
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

const PhotoCard = styled.div`
  position: relative;
  margin-top: 16px;
  height: 220px;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.outlineVariant};
  flex-shrink: 0;
`;

const PhotoImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PhotoFallback = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    155deg,
    ${({ theme }) => theme.colors.primaryContainer} 0%,
    ${({ theme }) => theme.colors.background} 100%
  );
`;

const PhotoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0.10) 0%,
    rgba(0, 0, 0, 0.50) 55%,
    rgba(0, 0, 0, 0.82) 100%
  );
`;

const AccentCorner = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 32px;
  height: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.primary};
`;

const PhotoText = styled.div`
  position: absolute;
  inset-x: 0;
  bottom: 0;
  padding: 16px;
`;

const PhotoDayName = styled.div`
  font-family: var(--font-barlow), sans-serif;
  font-weight: 900;
  font-size: 36px;
  color: #f8fafc;
  line-height: 0.88;
  letter-spacing: -0.01em;
`;

const PhotoDate = styled.div`
  font-family: var(--font-inter), sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 4px;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
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

const Rule = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.outlineVariant};
  margin: 14px 0;
  flex-shrink: 0;
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
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
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
  color: ${({ theme }) => theme.colors.onSurface};
  padding: 2px 7px;
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

const SetsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
`;
