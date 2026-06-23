import styled from "styled-components";

export const StyledWrapper = styled.div`
  width: 100%;
  padding-top: 8px;
`;

export const StyledEmpty = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.bodyMedium.fontSize};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;
