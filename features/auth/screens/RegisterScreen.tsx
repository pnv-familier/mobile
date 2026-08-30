import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { AppScreen, AppText, AppButton } from '../../../components';
import { useRegister } from '../hooks/userRegister';
import AuthInput from '../components/AuthInput';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { colors, spacing, radius, shadows } from '../../../theme';

const RegisterScreen = () => {
  const { t } = useTranslation();
  const { values, errors, loading, onChange, submit, passwordStrength } = useRegister();
  const { login: googleLogin, loading: isGoogleLoading } = useGoogleLogin();
  const navigation = useNavigation<any>();

  return (
    <AppScreen backgroundColor={colors.background}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Logo & Header */}
          <View style={styles.headerSection}>
            <Image source={require('../../../assets/icon.png')} style={styles.logo} />
            <AppText variant="heading1" color="brand" align="center">
              {t('auth.registerTitle')}
            </AppText>
            <AppText variant="bodySmall" color="secondary" align="center" style={styles.subtitle}>
              {t('auth.registerSubtitle')}
            </AppText>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
            <AuthInput
              icon="user"
              placeholder={t('auth.fullName')}
              value={values.fullName}
              onChangeText={(v) => onChange('fullName', v)}
              error={errors.fullName}
            />
            <AuthInput
              icon="mail"
              placeholder={t('auth.email')}
              value={values.email}
              onChangeText={(v) => onChange('email', v)}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthInput
              icon="lock"
              placeholder={t('auth.password')}
              secure
              value={values.password}
              onChangeText={(v) => onChange('password', v)}
              error={errors.password}
            />
            <PasswordStrengthIndicator strength={passwordStrength} />
            <AuthInput
              icon="lock"
              placeholder={t('auth.confirmPassword')}
              secure
              value={values.confirmPassword}
              onChangeText={(v) => onChange('confirmPassword', v)}
              error={errors.confirmPassword}
            />
          </View>

          {/* Register Primary CTA */}
          <AppButton
            title={t('auth.register')}
            variant="primary"
            size="md"
            style={styles.registerBtn}
            onPress={submit}
            loading={loading}
            disabled={loading}
          />

          {/* Divider */}
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <AppText variant="captionBold" color="secondary" style={styles.orText}>
              {t('common.or')}
            </AppText>
            <View style={styles.divider} />
          </View>

          {/* Google Sign-in Button */}
          <TouchableOpacity
            style={[styles.googleBtn, (loading || isGoogleLoading) && styles.googleBtnDisabled]}
            onPress={googleLogin}
            disabled={loading || isGoogleLoading}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/google-icon.png')}
              style={styles.googleIcon}
            />
            <AppText variant="bodySmallBold" color="primary">
              {t('auth.continueWithGoogle')}
            </AppText>
          </TouchableOpacity>

          {/* Already have account -> Login Link */}
          <View style={styles.loginRow}>
            <AppText variant="caption" color="muted">
              {t('auth.alreadyHaveAccount')}{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <AppText variant="captionBold" color="brand">
                {t('auth.login')}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  form: {
    width: '100%',
    marginBottom: spacing.xs,
  },
  registerBtn: {
    width: '100%',
    marginTop: spacing.xs,
  },
  dividerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
    width: '100%',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderMedium,
    opacity: 0.6,
  },
  orText: {
    marginHorizontal: spacing.sm,
  },
  googleBtn: {
    width: '100%',
    height: 44,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  googleBtnDisabled: {
    opacity: 0.7,
  },
  googleIcon: {
    width: 18,
    height: 18,
    marginRight: spacing.sm,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
