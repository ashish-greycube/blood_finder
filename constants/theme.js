// Centralized theme — change values here to restyle the entire app.
// Blood-themed colors with dark/light mode support.

const bloodRed = {
  50: "#FFEBEE",
  100: "#FFCDD2",
  200: "#EF9A9A",
  300: "#E57373",
  400: "#EF5350",
  500: "#C62828",
  600: "#B71C1C",
  700: "#8E0000",
  800: "#5C0000",
  900: "#3A0000",
};

const bloodDark = {
  50: "#FFCDD2",
  100: "#EF9A9A",
  200: "#E57373",
  300: "#EF5350",
  400: "#C62828",
  500: "#B71C1C",
  600: "#8E0000",
  700: "#5C0000",
  800: "#3A0000",
  900: "#1A0000",
};

// ─── Neutral palettes ─────────────────────────────────────────────
const neutralLight = {
  bg: "#F2F2F7", // iOS-style off-white, not pure white
  surface: "#FFFFFF",
  surfaceAlt: "#EBEBF0",
  border: "#D1D1D6",
  text: "#1C1C1E",
  textSecondary: "#636366",
  textMuted: "#8E8E93",
  cardBg: "#FFFFFF",
  inputBg: "#EBEBF0",
};

const neutralDark = {
  bg: "#0A0A0A", // Match the screen background used throughout the app
  surface: "#1E1E1E",
  surfaceAlt: "#252525",
  border: "#333333",
  text: "#FAFAFA",
  textSecondary: "#B0B0B0",
  textMuted: "#707070",
  cardBg: "#1E1E1E",
  inputBg: "#252525",
};

// ─── Base color sets ───────────────────────────────────────────────
const COLORS_LIGHT = {
  primary: bloodRed[500],
  primaryLight: bloodRed[400],
  primaryDark: bloodRed[600],
  primaryGlow: "rgba(198, 40, 40, 0.10)",

  background: neutralLight.bg,
  surface: neutralLight.surface,
  surfaceAlt: neutralLight.surfaceAlt,
  cardBg: neutralLight.cardBg,
  inputBg: neutralLight.inputBg,

  text: neutralLight.text,
  textSecondary: neutralLight.textSecondary,
  textMuted: neutralLight.textMuted,
  textOnPrimary: "#FFFFFF",

  border: neutralLight.border,
  divider: "#D1D1D6",

  success: "#2E7D32",
  warning: "#F57C00",
  error: bloodRed[600],
  info: "#1565C0",

  // ─── Glass / card ────────────────────────────────────────────────
  glassBg: "#eaeaef",
  glassBorder: "rgba(255, 255, 255, 0.29)",
  glassHighlight: "rgba(255,255,255,0.95)",

  // ─── Form inputs ─────────────────────────────────────────────────
  fieldLabelColor: "rgba(0,0,0,0.55)",
  inputFieldBg: "rgba(0,0,0,0.04)",
  inputFieldBorder: "rgba(0,0,0,0.12)",
  inputTextColor: "#1C1C1E",
  placeholderColor: "rgba(0,0,0,0.35)",
  chevronColor: "rgba(0,0,0,0.45)",
  dropdownBg: "#FFFFFF",
  dropdownBorder: "rgba(0,0,0,0.1)",

  // ─── Toggle pills ─────────────────────────────────────────────────
  pillContainerBg: "rgba(0,0,0,0.05)",
  pillContainerBorder: "rgba(0,0,0,0.1)",
  pillInactiveText: "rgba(0,0,0,0.45)",

  // ─── Icon circles ─────────────────────────────────────────────────
  iconCircleBg: "rgba(0,0,0,0.06)",
  iconCircleBorder: "rgba(0,0,0,0.1)",

  // ─── Header ───────────────────────────────────────────────────────
  headerBg: "rgba(242,242,247,0.97)",
  headerGlassBg: "rgba(255,255,255,0.55)",
  headerGlassBorder: "rgba(255,255,255,0.9)",
  headerHighlightLine: "rgba(0,0,0,0.05)",
  userIconBg: "rgba(0,0,0,0.06)",
  userIconBorder: "rgba(0,0,0,0.1)",
  userIconTint: "rgba(0,0,0,0.65)",

  // ─── Card labels ──────────────────────────────────────────────────
  cardLabel: "#1C1C1E",

  // ─── Orb opacities ────────────────────────────────────────────────
  orbOpacity1: 0.06,
  orbOpacity2: 0.04,
  orbOpacity3: 0.04,
  orbOpacity4: 0.03,
};

const COLORS_DARK = {
  primary: bloodDark[400],
  primaryLight: bloodDark[300],
  primaryDark: bloodDark[500],
  primaryGlow: "rgba(239, 83, 80, 0.15)",

  background: neutralDark.bg,
  surface: neutralDark.surface,
  surfaceAlt: neutralDark.surfaceAlt,
  cardBg: neutralDark.cardBg,
  inputBg: neutralDark.inputBg,

  text: neutralDark.text,
  textSecondary: neutralDark.textSecondary,
  textMuted: neutralDark.textMuted,
  textOnPrimary: "#FFFFFF",

  border: neutralDark.border,
  divider: "#2A2A2A",

  success: "#4CAF50",
  warning: "#FF9800",
  error: bloodDark[300],
  info: "#42A5F5",

  // ─── Glass / card ────────────────────────────────────────────────
  glassBg: "rgba(255,255,255,0.07)",
  glassBorder: "rgba(255,255,255,0.12)",
  glassHighlight: "rgba(255,255,255,0.18)",

  // ─── Form inputs ─────────────────────────────────────────────────
  fieldLabelColor: "rgba(255,255,255,0.5)",
  inputFieldBg: "rgba(255,255,255,0.03)",
  inputFieldBorder: "rgba(255,255,255,0.06)",
  inputTextColor: "#FFFFFF",
  placeholderColor: "rgba(255,255,255,0.3)",
  chevronColor: "rgba(255,255,255,0.5)",
  dropdownBg: "#1A1A1A",
  dropdownBorder: "rgba(255,255,255,0.12)",

  // ─── Toggle pills ─────────────────────────────────────────────────
  pillContainerBg: "rgba(255,255,255,0.06)",
  pillContainerBorder: "rgba(255,255,255,0.08)",
  pillInactiveText: "rgba(255,255,255,0.5)",

  // ─── Icon circles ─────────────────────────────────────────────────
  iconCircleBg: "rgba(255,255,255,0.07)",
  iconCircleBorder: "rgba(255,255,255,0.12)",

  // ─── Header ───────────────────────────────────────────────────────
  headerBg: "rgba(0,0,0,0.95)",
  headerGlassBg: "rgba(255,255,255,0.03)",
  headerGlassBorder: "rgba(255,255,255,0.08)",
  headerHighlightLine: "rgba(255,255,255,0.16)",
  userIconBg: "rgba(255,255,255,0.04)",
  userIconBorder: "rgba(255,255,255,0.06)",
  userIconTint: "rgba(255,255,255,0.7)",

  // ─── Card labels ──────────────────────────────────────────────────
  cardLabel: "#FFFFFF",

  // ─── Orb opacities ────────────────────────────────────────────────
  orbOpacity1: 0.25,
  orbOpacity2: 0.14,
  orbOpacity3: 0.12,
  orbOpacity4: 0.08,
};

export const COLORS = {
  light: COLORS_LIGHT,
  dark: COLORS_DARK,
};

export const TYPOGRAPHY = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,

  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

export const RADII = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const SHADOWS = {
  card: (dark) => ({
    shadowColor: dark ? "#000000" : "#8E0000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: dark ? 0.2 : 0.08,
    shadowRadius: 6,
    elevation: 2,
  }),
  primary: (dark) => ({
    shadowColor: dark ? bloodDark[300] : bloodRed[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: dark ? 0.3 : 0.25,
    shadowRadius: 10,
    elevation: 6,
  }),
  dropdown: (dark) => ({
    shadowColor: dark ? "#000000" : "#1A1108",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: dark ? 0.4 : 0.1,
    shadowRadius: 14,
    elevation: 8,
  }),
};

// Theme toggle helper
export const getTheme = (mode = "light") => ({
  colors: mode === "dark" ? COLORS_DARK : COLORS_LIGHT,
  isDark: mode === "dark",
});
