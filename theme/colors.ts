export const colors = {
  // Background & Surfaces
  background: "#FAF7F2",
  backgroundSecondary: "#FFF4E6",
  surface: "#FFFFFF",
  surfaceSecondary: "#F5F2EC",
  surfaceTertiary: "rgba(212, 160, 86, 0.08)",

  // Text colors
  textPrimary: "#4A3428",
  textSecondary: "#8D5B39",
  textMuted: "#9E9E9E",
  textLight: "#FFFFFF",
  textPlaceholder: "#A0A0A0",

  // Brand / Primary
  primary: "#D4A056",
  primaryPressed: "#B8860B",
  primarySoft: "#FDF2E3",
  primaryWarm: "#E39A5A",
  accent: "#EAB676",

  // Semantic Status
  success: "#4CAF50",
  successSoft: "#E8F5E9",
  successText: "#2E7D32",

  warning: "#EF6C00",
  warningSoft: "#FFF3E0",
  warningText: "#E65100",

  error: "#E53935",
  errorSoft: "#FFEBEE",
  errorText: "#B71C1C",

  info: "#2196F3",
  infoSoft: "#E3F2FD",
  infoText: "#0D47A1",

  love: "#E91E63",
  loveSoft: "#FCE4EC",
  loveText: "#C2185B",

  // Borders & Dividers
  border: "#EDE6DA",
  borderLight: "#F5F0E8",
  borderMedium: "#DFD6C6",
  borderActive: "#D4A056",

  // Overlay
  overlay: "rgba(0, 0, 0, 0.4)",
  overlayLight: "rgba(0, 0, 0, 0.2)",
} as const;

export type ColorToken = keyof typeof colors;
