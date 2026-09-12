import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { AlertCircle, WifiOff } from 'lucide-react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { colors, spacing, radius, shadows } from '../theme';
import { getFriendlyErrorMessage } from '../utils/errorHandler';

export interface AppErrorProps {
  message: string;
  title?: string;
  onRetry?: () => void;
  retryTitle?: string;
  style?: ViewStyle;
}

export default function AppError({
  message,
  title,
  onRetry,
  retryTitle = 'Try Again',
  style,
}: AppErrorProps) {
  const friendly = getFriendlyErrorMessage(message);
  const displayTitle = title || friendly.title;
  const displayMessage = friendly.message || message;
  const isNetwork = friendly.isNetwork;

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.iconContainer, isNetwork && styles.networkIconContainer]}>
        {isNetwork ? (
          <WifiOff size={24} color={colors.warning} />
        ) : (
          <AlertCircle size={24} color={colors.error} />
        )}
      </View>

      <AppText variant="bodyBold" color="primary" align="center" style={styles.title}>
        {displayTitle}
      </AppText>

      <AppText variant="bodySmall" color="secondary" align="center" style={styles.text}>
        {displayMessage}
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
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    ...shadows.sm,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.errorSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  networkIconContainer: {
    backgroundColor: colors.warningSoft,
  },
  title: {
    marginBottom: spacing.xs,
  },
  text: {
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  retryButton: {
    marginTop: spacing.md,
    minWidth: 120,
  },
});
