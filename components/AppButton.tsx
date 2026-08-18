import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { typography } from '../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export default function AppButton({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  testID,
  accessibilityLabel,
}: AppButtonProps) {
  const buttonStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.baseText,
    styles[`textSize_${size}`],
    styles[`variantText_${variant}`],
    disabled && styles.disabledText,
    textStyle,
  ];

  const spinnerColor =
    variant === 'outline' || variant === 'ghost' ? colors.primary : '#FFFFFF';

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} size="small" />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          {title ? <Text style={textStyles}>{title}</Text> : children}
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.8,
  },

  // Sizes
  size_sm: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xxl,
    minHeight: 54,
  },

  // Text Sizes
  textSize_sm: {
    ...typography.bodySmallBold,
  },
  textSize_md: {
    ...typography.bodyBold,
  },
  textSize_lg: {
    ...typography.heading3,
  },

  // Variants
  variant_primary: {
    backgroundColor: colors.primary,
  },
  variant_secondary: {
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  variant_danger: {
    backgroundColor: colors.error,
  },

  // Variant text styles
  baseText: {
    textAlign: 'center',
  },
  variantText_primary: {
    color: '#FFFFFF',
  },
  variantText_secondary: {
    color: colors.textPrimary,
  },
  variantText_outline: {
    color: colors.primary,
  },
  variantText_ghost: {
    color: colors.primary,
  },
  variantText_danger: {
    color: '#FFFFFF',
  },
});
