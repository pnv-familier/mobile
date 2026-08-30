import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Key, Users, User, Heart, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { AppScreen, AppHeader, AppText, AppButton } from '../../../components';
import { RELATIONSHIP_LIST } from '../../user/constant/relationshipList';
import { useJoinFamily } from '../hooks/useJoinFamily';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

const RELATIONSHIP_CONFIG: Record<string, { color: string; bg: string }> = {
  SPOUSE: { color: '#E91E63', bg: '#FCE4EC' },
  SON: { color: '#0288D1', bg: '#E1F5FE' },
  DAUGHTER: { color: '#9C27B0', bg: '#F3E5F5' },
  FATHER: { color: '#3F51B5', bg: '#E8EAF6' },
  MOTHER: { color: '#E64A19', bg: '#FBE9E7' },
  BROTHER: { color: '#00897B', bg: '#E0F2F1' },
  SISTER: { color: '#8E24AA', bg: '#EDE7F6' },
  GRANDFATHER: { color: '#6D4C41', bg: '#EFEBE9' },
  GRANDMOTHER: { color: '#D4A056', bg: '#FFF8E1' },
};

const JoinFamilyScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    joinCode,
    setJoinCode,
    familyPreview,
    relationship,
    setRelationship,
    loading,
    step,
    fetchFamilyPreview,
    joinFamilyWithRelationshipHandler,
    goBack,
  } = useJoinFamily();

  const getRelationshipIcon = (icon: string, iconColor: string) => {
    if (icon === 'heart') {
      return <Heart size={18} color={iconColor} fill={iconColor} />;
    }
    if (icon === 'users') {
      return <Users size={18} color={iconColor} />;
    }
    return <User size={18} color={iconColor} />;
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      {/* Hero Badge */}
      <View style={styles.heroBadge}>
        <View style={styles.iconCircle}>
          <Key size={36} color={colors.primary} />
        </View>
      </View>

      <AppText variant="heading2" color="brand" align="center" style={styles.stepTitle}>
        {t('family.enterFamilyCode')}
      </AppText>
      <AppText variant="caption" color="secondary" align="center" style={styles.stepSubtitle}>
        {t('family.familyCodeRequired')}
      </AppText>

      {/* Code Input Card */}
      <View style={styles.inputCard}>
        <AppText variant="captionBold" color="secondary" style={styles.inputLabel}>
          {t('family.familyCode')}
        </AppText>
        <View style={styles.inputWrapper}>
          <Key size={18} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            placeholder={t('family.enterFamilyCode')}
            placeholderTextColor={colors.textPlaceholder}
            style={styles.textInput}
            value={joinCode}
            onChangeText={setJoinCode}
            editable={!loading}
            autoCapitalize="characters"
          />
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <AppText variant="heading2" color="brand" align="center" style={styles.stepTitle}>
        {t('family.joinFamily')}
      </AppText>

      {/* Family Preview Card */}
      {familyPreview && (
        <View style={styles.familyCard}>
          <View style={styles.familyHeader}>
            {familyPreview.admin.avatarUrl ? (
              <Image
                source={{ uri: familyPreview.admin.avatarUrl }}
                style={styles.adminAvatar}
              />
            ) : (
              <View style={styles.adminAvatarPlaceholder}>
                <User size={22} color={colors.textMuted} />
              </View>
            )}
            <View style={styles.familyInfo}>
              <AppText variant="bodyBold" color="brand">
                {familyPreview.familyName}
              </AppText>
              <AppText variant="caption" color="secondary">
                Admin: {familyPreview.admin.fullName}
              </AppText>
              <AppText variant="tiny" color="muted">
                {familyPreview.memberCount} {t('family.members')}
              </AppText>
            </View>
          </View>
        </View>
      )}

      {/* Relationship Picker Card */}
      <View style={styles.inputCard}>
        <AppText variant="captionBold" color="primary" style={styles.inputLabel}>
          Relationship to {familyPreview?.admin.fullName || 'Admin'}
        </AppText>
        <AppText variant="tiny" color="muted" style={styles.inputSubtext}>
          Select your relationship to the family creator
        </AppText>

        <View style={styles.relationshipList}>
          {RELATIONSHIP_LIST.map((item) => {
            const isActive = relationship === item.key;
            const config =
              RELATIONSHIP_CONFIG[item.key] || { color: colors.primary, bg: colors.primarySoft };

            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => setRelationship(item.key)}
                style={[
                  styles.relationshipCard,
                  isActive
                    ? { backgroundColor: config.color, borderColor: config.color }
                    : { backgroundColor: colors.surface, borderColor: colors.borderLight },
                ]}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.relationshipIconContainer,
                    {
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.25)'
                        : config.bg,
                    },
                  ]}
                >
                  {getRelationshipIcon(item.icon, isActive ? '#FFFFFF' : config.color)}
                </View>
                <AppText
                  variant="bodySmallBold"
                  style={[
                    styles.relationshipText,
                    { color: isActive ? '#FFFFFF' : colors.textPrimary },
                  ]}
                >
                  {item.label}
                </AppText>
                {isActive && <Check size={18} color="#FFFFFF" />}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader
        title={t('family.joinFamily')}
        navigation={navigation}
        showBack={true}
        onBackPress={step === 2 ? goBack : () => navigation.goBack()}
        showNotification={false}
        showProfile={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === 1 ? renderStep1() : renderStep2()}
        </ScrollView>

        {/* Pinned Bottom Actions */}
        <View style={styles.bottomFooter}>
          {step === 1 ? (
            <AppButton
              title={loading ? t('common.loading') : t('common.next')}
              variant="primary"
              size="md"
              onPress={fetchFamilyPreview}
              disabled={!joinCode.trim() || loading}
              loading={loading}
              style={styles.fullWidthBtn}
            />
          ) : (
            <View style={styles.buttonRow}>
              <AppButton
                title={t('common.back')}
                variant="outline"
                size="md"
                onPress={goBack}
                disabled={loading}
                style={styles.halfBtn}
              />
              <AppButton
                title={loading ? t('common.loading') : t('family.join')}
                variant="primary"
                size="md"
                onPress={joinFamilyWithRelationshipHandler}
                disabled={!relationship || loading}
                loading={loading}
                style={styles.halfBtn}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default JoinFamilyScreen;

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  heroBadge: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  stepTitle: {
    marginBottom: 2,
  },
  stepSubtitle: {
    marginBottom: spacing.lg,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  inputLabel: {
    marginBottom: spacing.xs,
  },
  inputSubtext: {
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  textInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  familyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  adminAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  familyInfo: {
    flex: 1,
    gap: 1,
  },
  relationshipList: {
    gap: spacing.xs + 2,
  },
  relationshipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingVertical: spacing.xs + 3,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    ...shadows.sm,
  },
  relationshipIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  relationshipText: {
    flex: 1,
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  fullWidthBtn: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  halfBtn: {
    flex: 1,
  },
});
