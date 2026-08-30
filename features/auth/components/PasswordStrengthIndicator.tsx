import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PasswordStrength } from '../utils/password';
import AppText from '../../../components/AppText';
import { colors, radius, spacing } from '../../../theme';

type Props = {
  strength: PasswordStrength;
};

const strengthLevels: Record<string, { text: string; color: string; percent: string }> = {
  weak: { text: 'Weak', color: colors.error, percent: '33%' },
  medium: { text: 'Medium', color: colors.warning, percent: '66%' },
  strong: { text: 'Strong', color: colors.success, percent: '100%' },
};

const PasswordStrengthIndicator = ({ strength }: Props) => {
  if (!strength || !strengthLevels[strength]) {
    return null;
  }

  const { text, color, percent } = strengthLevels[strength];

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <AppText variant="tiny" color="muted">
          Password strength:{' '}
        </AppText>
        <AppText variant="captionBold" style={{ color }}>
          {text}
        </AppText>
      </View>
      <View style={styles.strengthBarContainer}>
        <View
          style={[
            styles.strengthBar,
            {
              backgroundColor: color,
              width: percent as any,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  strengthBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  strengthBar: {
    height: 4,
    borderRadius: radius.full,
  },
});

export default PasswordStrengthIndicator;
