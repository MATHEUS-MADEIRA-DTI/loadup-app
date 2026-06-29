"use client";

import { forwardRef } from "react";
import styled, { useTheme } from "styled-components";

import { WorkoutShareCardProps } from "../WorkoutShareCard";

const CardBold = forwardRef<HTMLDivElement, WorkoutShareCardProps>(
  function CardBold({ dayName, date, stats, topExercises, photoUrl }, ref) {
    const theme = useTheme();
    const primary = theme.colors.primary;
    const primaryDark = theme.colors.primaryDark;

    return (
      <Root ref={ref}>
        {/* Hero */}
        <Hero>
          {photoUrl ? (
            <HeroImg src={photoUrl} alt="" />
          ) : (
            <NoPhotoGrad
              style={{
                background: `linear-gradient(155deg, ${primary} 0%, ${primaryDark} 100%)`,
              }}
            />
          )}
          <HeroOverlay />
          <HeroContent>
            <AppTag style={{ color: primary, borderColor: `${primary}50` }}>
              LOADUP
            </AppTag>
            <HeroDayName>{dayName}</HeroDayName>
            <HeroDate>{date}</HeroDate>
          </HeroContent>
        </Hero>

        {/* Body */}
        <Body>
          <StatsStrip>
            <StripStat>
              <StripVal>{stats.kg.toLocaleString("pt-BR")}</StripVal>
              <StripLbl>kg</StripLbl>
            </StripStat>
            <StripBar />
            <StripStat>
              <StripVal>{stats.series}</StripVal>
              <StripLbl>séries</StripLbl>
            </StripStat>
            <StripBar />
            <StripStat>
              <StripVal>{stats.exercises}</StripVal>
              <StripLbl>exerc.</StripLbl>
            </StripStat>
          </StatsStrip>

          <ExList>
            {topExercises.slice(0, 4).map((ex, i) => (
              <ExRow key={i} $last={i === Math.min(topExercises.length, 4) - 1}>
                <ExName>{ex.name}</ExName>
                <ExVal style={{ color: primary }}>
                  {ex.bestWeight}
                  <ExUnit>kg</ExUnit>
                </ExVal>
              </ExRow>
            ))}
          </ExList>

          <FooterRow>
            <FooterBrand style={{ color: primary }}>LOADUP</FooterBrand>
            <DonePill>✓ CONCLUÍDO</DonePill>
          </FooterRow>
        </Body>
      </Root>
    );
  },
);

export default CardBold;

/* ─── Styles ─── */

const BG = "#020617";
const SURFACE = "#0F172A";
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
  display: flex;
  flex-direction: column;
`;

const Hero = styled.div`
  position: relative;
  height: 260px;
  overflow: hidden;
`;

const HeroImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoPhotoGrad = styled.div`
  position: absolute;
  inset: 0;
`;

const HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(2, 6, 23, 0.15) 0%,
    rgba(2, 6, 23, 0.5) 55%,
    rgba(2, 6, 23, 0.92) 100%
  );
`;

const HeroContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const AppTag = styled.span`
  display: inline-block;
  font-family: "Bebas Neue", sans-serif;
  font-size: 12px;
  letter-spacing: 0.2em;
  border: 1px solid;
  padding: 2px 8px;
  border-radius: 999px;
  align-self: flex-start;
  margin-bottom: 8px;
`;

const HeroDayName = styled.div`
  font-family: "Bebas Neue", sans-serif;
  font-size: 52px;
  color: ${TEXT};
  line-height: 0.9;
  letter-spacing: 0.01em;
`;

const HeroDate = styled.div`
  font-family: "Inter", sans-serif;
  font-size: 13px;
  color: rgba(248, 250, 252, 0.65);
  margin-top: 4px;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
`;

const StatsStrip = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid ${BORDER};
  gap: 0;
`;

const StripStat = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
`;

const StripBar = styled.div`
  width: 1px;
  height: 28px;
  background: ${BORDER};
`;

const StripVal = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 26px;
  color: ${TEXT};
  line-height: 1;
`;

const StripLbl = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${MUTED};
`;

const ExList = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 14px;
`;

const ExRow = styled.div<{ $last: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 0;
  border-bottom: ${({ $last }) => ($last ? "none" : `1px solid ${BORDER}`)};
`;

const ExName = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: ${TEXT};
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 12px;
`;

const ExVal = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
`;

const ExUnit = styled.span`
  font-family: "Inter", sans-serif;
  font-size: 10px;
  font-weight: 500;
  color: ${MUTED2};
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid ${BORDER};
`;

const FooterBrand = styled.span`
  font-family: "Bebas Neue", sans-serif;
  font-size: 16px;
  letter-spacing: 0.1em;
`;

const DonePill = styled.span`
  font-family: "Barlow Condensed", sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #22c55e;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
`;
