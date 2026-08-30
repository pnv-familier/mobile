import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';
import { shadows } from '../theme/shadows';

export interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outlined' | 'flat';
  style?: StyleProp<ViewStyle>;
  contentPadding?: keyof typeof spacing;
  testID?: string;
  accessibilityLabel?: string;
}

export default function AppCard({
  children,
  onPress,
  variant = 'elevated',
  style,
  contentPadding = 'lg',
  testID,
  accessibilityLabel,
}: AppCardProps) {
  const cardStyles: StyleProp<ViewStyle> = [
    styles.base,
    styles[`variant_${variant}`],
    { padding: spacing[contentPadding] },
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={cardStyles}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  variant_elevated: {
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  variant_flat: {
    backgroundColor: colors.surfaceSecondary,
  },
});
