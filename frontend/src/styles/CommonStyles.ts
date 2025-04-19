import styled from "styled-components";
import { Theme } from "./theme";

export const Container = styled.div<{ theme: Theme }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.large};
`;

export const Button = styled.button<{
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  theme: Theme;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme, size = "medium" }) => {
    switch (size) {
      case "small":
        return `${theme.spacing.small} ${theme.spacing.medium}`;
      case "large":
        return `${theme.spacing.medium} ${theme.spacing.large}`;
      default:
        return `${theme.spacing.medium} ${theme.spacing.medium}`;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.default};

  ${({ theme, variant = "primary" }) => {
    switch (variant) {
      case "secondary":
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text.primary};
          &:hover {
            background-color: ${theme.colors.secondary}dd;
          }
        `;
      case "outline":
        return `
          background-color: transparent;
          border: 2px solid ${theme.colors.primary};
          color: ${theme.colors.primary};
          &:hover {
            background-color: ${theme.colors.primary}11;
          }
        `;
      default:
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text.primary};
          &:hover {
            background-color: ${theme.colors.primary}dd;
          }
        `;
    }
  }}
`;

export const Card = styled.div<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.large};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: box-shadow ${({ theme }) => theme.transitions.default};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

export const Input = styled.input<{ theme: Theme }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const TextArea = styled.textarea<{ theme: Theme }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  border: 1px solid ${({ theme }) => theme.colors.background.tertiary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  resize: vertical;
  min-height: 100px;
  transition: all ${({ theme }) => theme.transitions.default};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}33;
  }
`;

export const Label = styled.label<{ theme: Theme }>`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const ErrorMessage = styled.span<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.status.error};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-top: ${({ theme }) => theme.spacing.small};
`;

export const SuccessMessage = styled.span<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.status.success};
  font-size: ${({ theme }) => theme.typography.fontSize.small};
  margin-top: ${({ theme }) => theme.spacing.small};
`;
