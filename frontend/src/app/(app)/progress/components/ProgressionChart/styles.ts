import styled from "styled-components";

export const StyledWrapper = styled.div`
  width: 100%;
  padding-top: 14px;
`;

export const StyledEmpty = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  color: ${({ theme }) => theme.colors.onSurfaceMuted};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;
