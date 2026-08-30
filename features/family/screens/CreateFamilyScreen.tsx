import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Home, Sparkles } from 'lucide-react-native';
import { useCreateFamily } from '../hooks/useCreateFamily';
import { useTranslation } from 'react-i18next';
import { AppScreen, AppHeader, AppText, AppButton } from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

export default function CreateFamilyScreen({ navigation }: any) {
  const { t } = useTranslation();
  const {
    familyName,
    setFamilyName,
    loading,
    suggestions,
    handleContinue,
    validationError,
    isFormValid,
    handleInputFocus,
  } = useCreateFamily();

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader
        title={t('family.createFamily')}
        navigation={navigation}
        showBack={true}
        showNotification={false}
        showProfile={false}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Home Icon Hero */}
          <View style={styles.heroBadge}>
            <View style={styles.iconCircle}>
              <Home size={40} color={colors.primary} />
            </View>
          </View>

          {/* Title & Instructions */}
          <AppText variant="heading1" color="brand" align="center" style={styles.title}>
            {t('family.familyName')}
          </AppText>
          <AppText
            variant="bodySmall"
            color="secondary"
            align="center"
            style={styles.instructionText}
          >
            {t('family.enterFamilyName')}
          </AppText>

          {/* Family Name Input Box */}
          <View
            style={[
              styles.inputContainer,
              validationError ? styles.inputErrorBorder : styles.inputNormalBorder,
            ]}
          >
            <Home size={18} color={colors.primary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('family.enterFamilyName')}
              placeholderTextColor={colors.textPlaceholder}
              value={familyName}
              onChangeText={setFamilyName}
              onFocus={handleInputFocus}
              editable={!loading}
            />
          </View>

          {validationError ? (
            <AppText variant="tiny" color="error" style={styles.errorText}>
              {validationError}
            </AppText>
          ) : null}

          {/* Suggested Names Section */}
          {suggestions && suggestions.length > 0 && (
            <View style={styles.suggestSection}>
              <View style={styles.suggestHeaderRow}>
                <Sparkles size={14} color={colors.primary} />
                <AppText variant="captionBold" color="primary">
                  Suggest:
                </AppText>
              </View>

              <View style={styles.chipContainer}>
                {suggestions.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.chip}
                    onPress={() => setFamilyName(item)}
                    activeOpacity={0.7}
                  >
                    <AppText variant="captionBold" color="secondary">
                      {item}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Pinned Bottom CTA */}
        <View style={styles.bottomFooter}>
          <AppButton
            title={t('common.next')}
            variant="primary"
            size="md"
            onPress={handleContinue}
            loading={loading}
            disabled={loading || !isFormValid}
            style={styles.continueButton}
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    alignItems: 'center',
  },
  heroBadge: {
    marginBottom: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primarySoft,
    borderWidth: 3,
    borderColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  title: {
    marginBottom: 4,
  },
  instructionText: {
    marginBottom: spacing.xl,
    maxWidth: 280,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 46,
    width: '100%',
    borderWidth: 1,
    ...shadows.sm,
  },
  inputNormalBorder: {
    borderColor: colors.borderLight,
  },
  inputErrorBorder: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  errorText: {
    marginTop: 4,
    alignSelf: 'flex-start',
    marginLeft: 4,
  },
  suggestSection: {
    width: '100%',
    marginTop: spacing.xl,
  },
  suggestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  chip: {
    backgroundColor: colors.surfaceSecondary,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  continueButton: {
    width: '100%',
  },
});