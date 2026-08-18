import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import AppText from './AppText';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface AppLoaderProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export default function AppLoader({
  message,
  size = 'large',
  color = colors.primary,
  style,
}: AppLoaderProps) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <AppText variant="bodySmall" color="secondary" style={styles.message}>
          {message}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: spacing.md,
  },
});
