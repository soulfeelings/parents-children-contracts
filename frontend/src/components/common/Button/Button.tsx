import styled, { css } from "styled-components";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  ${({ size = "medium" }) => {
    switch (size) {
      case "small":
        return css`
          padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
          font-size: 14px;
          @media (max-width: 768px) {
            padding: ${({ theme }) =>
              `${theme.spacing.xs} ${theme.spacing.sm}`};
            font-size: 12px;
          }
        `;
      case "large":
        return css`
          padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
          font-size: 16px;
          @media (max-width: 768px) {
            padding: ${({ theme }) =>
              `${theme.spacing.sm} ${theme.spacing.lg}`};
            font-size: 14px;
          }
        `;
      default:
        return css`
          padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
          font-size: 15px;
          @media (max-width: 768px) {
            padding: ${({ theme }) =>
              `${theme.spacing.xs} ${theme.spacing.md}`};
            font-size: 14px;
          }
        `;
    }
  }}
  
  ${({ variant = "primary", theme }) => {
    switch (variant) {
      case "secondary":
        return css`
          background-color: ${theme.colors.background};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};

          &:hover {
            background-color: ${theme.colors.hover};
          }

          &:active {
            background-color: ${theme.colors.active};
          }

          @media (max-width: 768px) {
            &:hover {
              background-color: ${theme.colors.background};
            }
          }
        `;
      case "outline":
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};

          &:hover {
            background-color: ${theme.colors.primary}10;
          }

          &:active {
            background-color: ${theme.colors.primary}20;
          }

          @media (max-width: 768px) {
            &:hover {
              background-color: transparent;
            }
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          border: none;

          &:hover {
            opacity: 0.9;
            transform: translateY(-1px);
          }

          &:active {
            transform: translateY(0);
          }

          @media (max-width: 768px) {
            &:hover {
              opacity: 1;
              transform: none;
            }
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;
