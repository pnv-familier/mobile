import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';

export interface AppErrorProps {
  message: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: ViewStyle;
}

export default function AppError({
  message,
  onRetry,
  retryTitle = 'Retry',
  style,
}: AppErrorProps) {
  return (
    <View style={[styles.container, style]}>
      <AppText variant="bodySmallBold" color="error" align="center" style={styles.text}>
        {message}
      </AppText>
      {onRetry && (
        <AppButton
          title={retryTitle}
          onPress={onRetry}
          variant="outline"
          size="sm"
          style={styles.retryButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.errorSoft,
    borderRadius: radius.md,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
  },
  text: {
    marginBottom: spacing.xs,
  },
  retryButton: {
    marginTop: spacing.sm,
    borderColor: colors.error,
  },
});
