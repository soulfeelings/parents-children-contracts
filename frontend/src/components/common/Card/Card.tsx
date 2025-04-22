import styled, { css } from "styled-components";

interface CardProps {
  variant?: "default" | "outlined";
  padding?: "small" | "medium" | "large";
  clickable?: boolean;
}

export const Card = styled.div<CardProps>`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  width: 100%;

  ${({ variant = "default", theme }) =>
    variant === "outlined"
      ? css`
          border: 1px solid ${theme.colors.border};
        `
      : css`
          box-shadow: ${theme.shadows.light};
        `}

  ${({ padding = "medium", theme }) => {
    switch (padding) {
      case "small":
        return css`
          padding: ${theme.spacing.sm};
          @media (max-width: 768px) {
            padding: ${theme.spacing.xs};
          }
        `;
      case "large":
        return css`
          padding: ${theme.spacing.xl};
          @media (max-width: 768px) {
            padding: ${theme.spacing.lg};
          }
        `;
      default:
        return css`
          padding: ${theme.spacing.lg};
          @media (max-width: 768px) {
            padding: ${theme.spacing.md};
          }
        `;
    }
  }}
  
  ${({ clickable, theme }) =>
    clickable &&
    css`
      cursor: pointer;
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

      &:hover {
        transform: translateY(-2px);
        box-shadow: ${theme.shadows.medium};
      }

      &:active {
        transform: translateY(0);
      }

      @media (max-width: 768px) {
        &:hover {
          transform: none;
          box-shadow: ${theme.shadows.light};
        }
      }
    `}
`;

export const CardHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

export const CardTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 18px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const CardSubtitle = styled.h4`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const CardContent = styled.div`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 14px;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const CardFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    margin-top: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;
