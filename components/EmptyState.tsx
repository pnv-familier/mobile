import React from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import AppText from './AppText';
import AppButton from './AppButton';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export interface EmptyStateProps {
  title: string;
  description?: string;
  image?: ImageSourcePropType;
  icon?: React.ReactNode;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  title,
  description,
  image,
  icon,
  actionTitle,
  onActionPress,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : icon ? (
        <View style={styles.iconContainer}>{icon}</View>
      ) : null}
      <AppText variant="heading2" color="brand" align="center" style={styles.title}>
        {title}
      </AppText>
      {description && (
        <AppText variant="bodySmall" color="secondary" align="center" style={styles.description}>
          {description}
        </AppText>
      )}
      {actionTitle && onActionPress && (
        <AppButton
          title={actionTitle}
          onPress={onActionPress}
          variant="primary"
          size="md"
          style={styles.actionButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: spacing.lg,
    opacity: 0.85,
  },
  iconContainer: {
    marginBottom: spacing.lg,
    padding: spacing.lg,
    borderRadius: 999,
    backgroundColor: colors.primarySoft,
  },
  title: {
    marginBottom: spacing.sm,
  },
  description: {
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  actionButton: {
    minWidth: 160,
  },
});
