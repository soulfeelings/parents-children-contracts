export const theme = {
  colors: {
    primary: "#3390EC",
    secondary: "#76A9EA",
    background: {
      primary: "#FFFFFF",
      secondary: "#F4F4F5",
      tertiary: "#EDEEF0",
    },
    text: {
      primary: "#232323",
      secondary: "#707579",
      tertiary: "#A3A3A3",
    },
    status: {
      success: "#31B545",
      error: "#E53935",
      warning: "#FFA000",
      info: "#3390EC",
    },
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
    large: "16px",
  },
  typography: {
    fontFamily:
      "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: {
      small: "13px",
      medium: "14px",
      large: "16px",
      xl: "20px",
      xxl: "24px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  shadows: {
    small: "0 1px 2px rgba(16, 35, 47, 0.07)",
    medium: "0 2px 8px rgba(16, 35, 47, 0.15)",
    large: "0 4px 12px rgba(16, 35, 47, 0.2)",
  },
  transitions: {
    default: "0.15s ease",
    fast: "0.1s ease",
    slow: "0.3s ease",
  },
};

export type Theme = typeof theme;
