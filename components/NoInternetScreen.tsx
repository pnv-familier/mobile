import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import AppScreen from './AppScreen';
import AppText from './AppText';
import AppButton from './AppButton';
import { colors, spacing, radius, typography, shadows } from '../theme';

export interface NoInternetScreenProps {
  onRetry?: () => Promise<boolean | void> | boolean | void;
  title?: string;
  description?: string;
  navigation?: any;
}

export default function NoInternetScreen({
  onRetry,
  title,
  description,
  navigation,
}: NoInternetScreenProps) {
  const { t } = useTranslation();
  const [checking, setChecking] = useState(false);
  const [retryFailed, setRetryFailed] = useState(false);

  const displayTitle = title || t('common.noInternetTitle', { defaultValue: 'No Internet Connection' });
  const displayDescription =
    description ||
    t('common.noInternetDesc', {
      defaultValue: 'Please check your Wi-Fi or mobile data settings and try again.',
    });

  const handleRetry = async () => {
    setChecking(true);
    setRetryFailed(false);

    try {
      if (onRetry) {
        const result = await onRetry();
        if (result === false) {
          setRetryFailed(true);
        }
      } else {
        // Default ping check with small delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setRetryFailed(true);
      }
    } catch {
      setRetryFailed(true);
    } finally {
      setChecking(false);
    }
  };

  return (
    <AppScreen edges={['top', 'bottom']} backgroundColor={colors.background}>
      <View style={styles.container}>
        <View style={styles.illustrationWrapper}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <WifiOff size={44} color={colors.primary} />
            </View>
          </View>
        </View>

        <View style={styles.textContainer}>
          <AppText variant="heading2" color="primary" align="center" style={styles.title}>
            {displayTitle}
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={styles.description}>
            {displayDescription}
          </AppText>
        </View>

        {retryFailed && (
          <View style={styles.alertBox}>
            <AlertCircle size={18} color={colors.error} />
            <AppText variant="caption" color="error" style={styles.alertText}>
              {t('common.stillNoConnection', { defaultValue: 'Still disconnected. Please check your network.' })}
            </AppText>
          </View>
        )}

        <View style={styles.actionContainer}>
          <AppButton
            title={t('common.tryAgain', { defaultValue: 'Try Again' })}
            variant="primary"
            size="lg"
            icon={
              checking ? (
                <ActivityIndicator size="small" color={colors.textLight} />
              ) : (
                <RefreshCw size={18} color={colors.textLight} />
              )
            }
            onPress={handleRetry}
            disabled={checking}
            style={styles.primaryBtn}
          />

          {navigation?.canGoBack && navigation.canGoBack() && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <AppText variant="captionBold" color="secondary">
                {t('common.goBack', { defaultValue: 'Go Back' })}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  illustrationWrapper: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  textContainer: {
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    lineHeight: 22,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.errorSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  alertText: {
    flex: 1,
  },
  actionContainer: {
    width: '100%',
    maxWidth: 320,
    gap: spacing.md,
  },
  primaryBtn: {
    width: '100%',
  },
  backBtn: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
