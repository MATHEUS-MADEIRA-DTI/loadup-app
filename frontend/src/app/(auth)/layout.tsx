"use client";

import styled from "styled-components";

import ThemeToggle from "@/components/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StyledPage>
      <StyledHeader>
        <StyledThemeToggleWrap>
          <ThemeToggle />
        </StyledThemeToggleWrap>
        <StyledLogoCircle>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z"
              fill="white"
            />
          </svg>
        </StyledLogoCircle>
        <StyledLogoTitle>LoadUp</StyledLogoTitle>
        <StyledTagline>Gerencie seus treinos com inteligência</StyledTagline>
      </StyledHeader>
      <StyledBody>{children}</StyledBody>
    </StyledPage>
  );
}

const StyledPage = styled.div`
  min-height: 100dvh;
  background-color: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
`;

const StyledThemeToggleWrap = styled.div`
  position: absolute;
  bottom: 16px;
  left: 16px;
`;

const StyledHeader = styled.header`
  position: relative;
  background: linear-gradient(
    176deg,
    rgba(79, 55, 139, 1) 0%,
    rgba(103, 80, 164, 1) 50%,
    rgba(154, 130, 219, 1) 100%
  );
  border-radius: 0 0 40px 40px;
  padding: 48px 24px 36px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StyledLogoCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
`;

const StyledLogoTitle = styled.h1`
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.onPrimary};
  line-height: 1;
`;

const StyledTagline = styled.p`
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.035em;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
`;

const StyledBody = styled.div`
  flex: 1;
  padding: 0 20px 40px;
`;
