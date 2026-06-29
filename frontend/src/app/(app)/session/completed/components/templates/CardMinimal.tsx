"use client";

import { forwardRef } from "react";
import styled, { useTheme } from "styled-components";

import { WorkoutShareCardProps } from "../WorkoutShareCard";

const CardMinimal = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function CardMinimal({ dayName, date, stats, topExercises, photoUrl }, ref) {
    const theme = useTheme();
    const primary = theme.colors.primary;

    return (
      <Root ref={ref}>
        {photoUrl && (
          <>
            <BgPhoto src={photoUrl} alt="" />
            <BgOverlay />
          </>
        )}

        <Content>
          {/* top row */}
          <TopRow>
            <AppName style={{ color: primary }}>LOADUP</AppName>
            <DoneTag style={{ color: "#22C55E" }}>✓ CONCLUÍDO</DoneTag>
          </TopRow>

          {/* accent bar */}
          <AccentBar style={{ background: primary }} />

          {/* hero text */}
          <DayName>{dayName}</DayName>
          <DateText>{date}</DateText>

          {/* divider */}
          <Rule />

          {/* stats */}
          <StatsRow>
            <Stat>
              <StatVal>{stats.kg.toLocaleString("pt-BR")}</StatVal>
              <StatLbl>kg totais</StatLbl>
            </Stat>
            <StatDiv />
            <Stat>
              <StatVal>{stats.series}</StatVal>
              <StatLbl>séries</StatLbl>
            </Stat>
            <StatDiv />
            <Stat>
              <StatVal>{stats.exercises}</StatVal>
              <StatLbl>exercícios</StatLbl>
            </Stat>
          </StatsRow>

          {/* divider */}
          <Rule />

          {/* exercises */}
          <ExList>
            {topExercises.map((ex, i) => (
              <ExRow key={i} $last={i === topExercises.length - 1}>
                <ExNum style={{ color: primary }}>
                  {String(i + 1).padStart(2, "0")}
                </ExNum>
                <ExName>{ex.name}</ExName>
                <ExVal>
                  {ex.bestWeight}kg × {ex.bestReps}
                </ExVal>
              </ExRow>
            ))}
          </ExList>
        </Content>
      </Root>
    );
  },
);

export default CardMinimal;

/* ─── Styles ─── */

const BG = "#020617";
const BORDER = "#1E293B";
const TEXT = "#F8FAFC";
const MUTED = "#64748B";
const MUTED2 = "#94A3B8";

const Root = styled.div`
  position: relative;
  width: 360px;
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
`;

const BgOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(2, 6, 23, 0.88);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const AppName = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 18px;
  letter-spacing: 0.12em;
`;

const DoneTag = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const AccentBar = styled.div`
  width: 36px;
  height: 4px;
  border-radius: 999px;
  margin-bottom: 14px;
`;

const DayName = styled.div`
  font-family: "Bebas Neue", sans-serif;
  font-size: 54px;
  color: ${TEXT};
  line-height: 0.9;
  letter-spacing: 0.01em;
`;

const DateText = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: ${MUTED2};
  margin-top: 8px;
`;

const Rule = styled.div`
  height: 1px;
  background: ${BORDER};
  margin: 20px 0;
`;

const StatsRow = styled.div`
  display: flex;
  align-items: center;
`;

const Stat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const StatDiv = styled.div`
  width: 1px;
  height: 28px;
  background: ${BORDER};
`;

const StatVal = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 28px;
  color: ${TEXT};
  line-height: 1;
`;

const StatLbl = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${MUTED};
`;

const ExList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ExRow = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${BORDER}`)};
`;

const ExNum = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 16px;
  width: 20px;
  flex-shrink: 0;
  line-height: 1;
`;

const ExName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: ${TEXT};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ExVal = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 14px;
  color: ${MUTED2};
  flex-shrink: 0;
`;
