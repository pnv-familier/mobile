import React from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import { AppScreen, AppText, AppButton } from '../../../components';
import AuthInput from '../components/AuthInput';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import { useLogin } from '../hooks/useLogin';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

const LoginScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { login: googleLogin, loading: isGoogleLoading } = useGoogleLogin();
  const { values, errors, loading, onChange, submit } = useLogin();

  return (
    <AppScreen backgroundColor={colors.background}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Logo & Header */}
          <View style={styles.headerSection}>
            <Image source={require('../../../assets/icon.png')} style={styles.logo} />
            <AppText variant="heading1" color="brand" align="center">
              {t('auth.loginTitle')}
            </AppText>
            <AppText variant="bodySmall" color="secondary" align="center" style={styles.subtitle}>
              {t('auth.loginSubtitle')}
            </AppText>
          </View>

          {/* Form Inputs */}
          <View style={styles.form}>
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
          </View>

          {/* Login Primary CTA */}
          <AppButton
            testID="login-btn"
            accessibilityLabel="login-btn"
            title={t('auth.login')}
            variant="primary"
            size="md"
            style={styles.loginBtn}
            onPress={submit}
            loading={loading}
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
            style={[styles.googleBtn, isGoogleLoading && styles.googleBtnDisabled]}
            onPress={googleLogin}
            disabled={isGoogleLoading}
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

          {/* Signup Link */}
          <View style={styles.signupRow}>
            <AppText variant="caption" color="muted">
              {t('auth.dontHaveAccount')}{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <AppText variant="captionBold" color="brand">
                {t('auth.signUp')}
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Version Footer */}
          <View style={styles.versionRow}>
            <AppText variant="tiny" color="muted">
              {t('auth.appVersion')}: v{Constants.expoConfig?.version}{' '}
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Version')}>
              <AppText variant="tiny" color="secondary">
                | {t('auth.checkInfo')}
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default LoginScreen;

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
  loginBtn: {
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
