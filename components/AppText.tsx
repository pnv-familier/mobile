import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { typography, TypographyVariant } from '../theme/typography';
import { colors } from '../theme/colors';

export type TextColor =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'brand'
  | 'error'
  | 'success'
  | 'warning'
  | 'white'
  | string;

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  color?: TextColor;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  style?: StyleProp<TextStyle>;
}

const colorMap: Record<string, string> = {
  primary: colors.textPrimary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  brand: colors.primary,
  error: colors.error,
  success: colors.successText,
  warning: colors.warningText,
  white: colors.textLight,
};

export default function AppText({
  variant = 'body',
  color = 'primary',
  align,
  style,
  children,
  ...props
}: AppTextProps) {
  const variantStyle = typography[variant] || typography.body;
  const textColor = colorMap[color] || color;

  const combinedStyle: TextStyle = {
    ...variantStyle,
    color: textColor,
    ...(align ? { textAlign: align } : {}),
  };

  return (
    <Text {...props} style={[combinedStyle, style]}>
      {children}
    </Text>
  );
}
