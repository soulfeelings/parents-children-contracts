import styled, { css } from "styled-components";

interface InputProps {
  error?: boolean;
  fullWidth?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid
    ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 15px;
  transition: all 0.2s ease-in-out;

  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.tertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) =>
      error ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 2px
      ${({ theme, error }) =>
        error ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

export const InputLabel = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

export const InputError = styled.span`
  display: block;
  margin-top: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
`;

export const InputGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
