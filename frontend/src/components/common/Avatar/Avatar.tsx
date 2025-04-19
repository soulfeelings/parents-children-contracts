import styled, { css } from "styled-components";

interface AvatarProps {
  size?: "small" | "medium" | "large";
  online?: boolean;
}

export const AvatarContainer = styled.div<AvatarProps>`
  position: relative;
  width: ${({ size = "medium" }) => {
    switch (size) {
      case "small":
        return "32px";
      case "large":
        return "56px";
      default:
        return "40px";
    }
  }};
  height: ${({ size = "medium" }) => {
    switch (size) {
      case "small":
        return "32px";
      case "large":
        return "56px";
      default:
        return "40px";
    }
  }};
`;

export const AvatarImage = styled.div<AvatarProps>`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const OnlineStatus = styled.div<{ online?: boolean }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ theme, online }) =>
    online ? theme.colors.online : theme.colors.text.tertiary};
  border: 2px solid ${({ theme }) => theme.colors.white};
`;

interface AvatarComponentProps extends AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar: React.FC<AvatarComponentProps> = ({
  src,
  alt,
  size = "medium",
  online,
  fallback,
}) => {
  const getFallbackInitials = () => {
    if (!fallback) return "";
    return fallback
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AvatarContainer size={size}>
      <AvatarImage size={size}>
        {src ? (
          <img src={src} alt={alt || "avatar"} />
        ) : (
          <FallbackContainer size={size}>
            {getFallbackInitials()}
          </FallbackContainer>
        )}
      </AvatarImage>
      {typeof online === "boolean" && <OnlineStatus online={online} />}
    </AvatarContainer>
  );
};

const FallbackContainer = styled.div<AvatarProps>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: 500;
  font-size: ${({ size = "medium" }) => {
    switch (size) {
      case "small":
        return "12px";
      case "large":
        return "20px";
      default:
        return "16px";
    }
  }};
`;
