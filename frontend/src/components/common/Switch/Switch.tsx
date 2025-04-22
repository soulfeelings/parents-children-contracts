import React from "react";
import styled from "styled-components";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

const SwitchContainer = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const SwitchLabel = styled.span`
  margin-left: 8px;
  color: ${({ theme }) => theme.colors.text};
`;

const SwitchInput = styled.input`
  display: none;
`;

const SwitchTrack = styled.div<{ checked: boolean; disabled: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  background-color: ${({ checked, theme, disabled }) =>
    disabled
      ? theme.colors.disabled
      : checked
      ? theme.colors.primary
      : theme.colors.border};
  border-radius: 12px;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ checked, theme, disabled }) =>
      disabled
        ? theme.colors.disabled
        : checked
        ? theme.colors.primaryDark
        : theme.colors.borderDark};
  }
`;

const SwitchThumb = styled.div<{ checked: boolean; disabled: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ checked }) => (checked ? "26px" : "2px")};
  width: 20px;
  height: 20px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.textLight : theme.colors.white};
  border-radius: 50%;
  transition: left 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <SwitchContainer>
      <SwitchInput
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <SwitchTrack checked={checked} disabled={disabled}>
        <SwitchThumb checked={checked} disabled={disabled} />
      </SwitchTrack>
      {label && <SwitchLabel>{label}</SwitchLabel>}
    </SwitchContainer>
  );
};
