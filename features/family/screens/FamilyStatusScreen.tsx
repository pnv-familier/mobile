import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Users, UserPlus, ChevronRight, LogOut } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FamilyParamsList } from '../types';
import { useLogout } from '../../auth/hooks/useLogout';
import { useTranslation } from 'react-i18next';
import { AppScreen, AppText, AppButton } from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

type Props = NativeStackScreenProps<FamilyParamsList, 'FamilyStatus'>;

export default function FamilyStatusScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { logout } = useLogout();

  const handleLogout = () => {
    Alert.alert(t('common.confirm'), t('settings.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.logout'),
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration */}
        <Image
          source={require('../../../assets/family_illustration.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Title & Subtitle */}
        <AppText variant="heading1" color="brand" align="center">
          {t('family.familyStatus')}
        </AppText>
        <AppText
          variant="bodySmall"
          color="secondary"
          align="center"
          style={styles.subtitle}
        >
          {t('family.chooseOption')}
        </AppText>

        {/* Option Card: Join Family */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('JoinFamily')}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <Users size={22} color={colors.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <AppText variant="bodySmallBold" color="primary">
              {t('family.joinFamily')}
            </AppText>
            <AppText variant="caption" color="secondary" style={styles.cardDesc}>
              {t('family.joinFamilyDesc')}
            </AppText>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Option Card: Create Family */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('CreateFamily')}
          activeOpacity={0.7}
        >
          <View style={styles.iconBox}>
            <UserPlus size={22} color={colors.primary} />
          </View>
          <View style={styles.cardTextContainer}>
            <AppText variant="bodySmallBold" color="primary">
              {t('family.createFamily')}
            </AppText>
            <AppText variant="caption" color="secondary" style={styles.cardDesc}>
              {t('family.createFamilyDesc')}
            </AppText>
          </View>
          <ChevronRight size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Logout Action */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <LogOut size={16} color={colors.textMuted} style={styles.logoutIcon} />
          <AppText variant="captionBold" color="muted">
            {t('common.logout')}
          </AppText>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  illustration: {
    width: '100%',
    height: 180,
    marginBottom: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    width: '100%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardDesc: {
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  logoutIcon: {
    marginRight: spacing.xs,
  },
});