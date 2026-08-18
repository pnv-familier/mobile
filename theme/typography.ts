import { TextStyle } from "react-native";

export const typography = {
  display: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
  } as TextStyle,
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    lineHeight: 32,
  } as TextStyle,
  heading2: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
  } as TextStyle,
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 24,
  } as TextStyle,
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 22,
  } as TextStyle,
  bodyMedium: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 22,
  } as TextStyle,
  bodyBold: {
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 22,
  } as TextStyle,
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
  } as TextStyle,
  bodySmallMedium: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  } as TextStyle,
  bodySmallBold: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
  } as TextStyle,
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
  } as TextStyle,
  captionMedium: {
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  } as TextStyle,
  captionBold: {
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 16,
  } as TextStyle,
  tiny: {
    fontSize: 10,
    fontWeight: "500",
    lineHeight: 14,
  } as TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
