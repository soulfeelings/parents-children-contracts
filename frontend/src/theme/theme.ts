export const theme = {
  colors: {
    primary: "#007AFF",
    secondary: "#5856D6",
    background: {
      primary: "#FFFFFF",
      secondary: "#F2F2F7",
      tertiary: "#E5E5EA",
    },
    text: {
      primary: "#000000",
      secondary: "#3C3C43",
      tertiary: "#8E8E93",
    },
    status: {
      success: "#34C759",
      error: "#FF3B30",
      warning: "#FF9500",
      info: "#5856D6",
    },
    border: "#C6C6C8",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "12px",
    circle: "50%",
    lg: "16px",
  },
  shadows: {
    small: "0 2px 4px rgba(0, 0, 0, 0.1)",
    medium: "0 4px 8px rgba(0, 0, 0, 0.1)",
    large: "0 8px 16px rgba(0, 0, 0, 0.1)",
  },
};

export type Theme = typeof theme;
