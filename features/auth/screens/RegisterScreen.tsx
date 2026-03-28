import React from "react"
import { Image, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native"

import AppScreen from "../../../components/AppScreen"
import AppText from "../../../components/AppText"
import { useRegister } from "../hooks/userRegister"
import AuthInput from "../components/AuthInput"
import PasswordStrengthIndicator from "../components/PasswordStrengthIndicator"
import { useGoogleLogin } from "../hooks/useGoogleLogin"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

const RegisterScreen = () => {
    const { t } = useTranslation()
    const { values, errors, loading, onChange, submit, passwordStrength } = useRegister()
    const { login: googleLogin, loading: isGoogleLoading } = useGoogleLogin()
    const navigation = useNavigation<any>();

    return (
        <AppScreen style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                <Image
                    source={require("../../../assets/icon.png")}
                    style={styles.logo}
                />

                <AppText style={styles.title}>{t('auth.registerTitle')}</AppText>
                <AppText style={styles.subtitle}>
                    {t('auth.registerSubtitle')}
                </AppText>

                <AuthInput
                    icon="user"
                    placeholder={t('auth.fullName')}
                    value={values.fullName}
                    onChangeText={v => onChange("fullName", v)}
                    error={errors.fullName}
                />
                <AuthInput
                    icon="mail"
                    placeholder={t('auth.email')}
                    value={values.email}
                    onChangeText={v => onChange("email", v)}
                    error={errors.email}
                />
                <AuthInput
                    icon="lock"
                    placeholder={t('auth.password')}
                    secure
                    value={values.password}
                    onChangeText={v => onChange("password", v)}
                    error={errors.password}
                />
                <PasswordStrengthIndicator strength={passwordStrength} />
                <AuthInput
                    icon="lock"
                    placeholder={t('auth.confirmPassword')}
                    secure
                    value={values.confirmPassword}
                    onChangeText={v => onChange("confirmPassword", v)}
                    error={errors.confirmPassword}
                />

                <TouchableOpacity
                    style={styles.registerBtn}
                    onPress={submit}
                    disabled={loading}
                >
                    <AppText style={styles.registerText}>{t('auth.register')}</AppText>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.googleBtn, isGoogleLoading && { opacity: 0.7 }]}
                    onPress={googleLogin}
                    disabled={loading || isGoogleLoading}>
                    <Image
                        source={require("../../../assets/google-icon.png")}
                        style={styles.googleIcon}
                    />
                    <AppText style={styles.googleText}>
                        {t('auth.continueWithGoogle')}
                    </AppText>
                </TouchableOpacity>

                <AppText style={styles.loginText} onPress={() => navigation.navigate("Login")}>
                    {t('auth.alreadyHaveAccount')}{" "}
                    <AppText style={styles.loginLink}>{t('auth.login')}</AppText>
                </AppText>
                </ScrollView>
            </KeyboardAvoidingView>
        </AppScreen>
    )
}

export default RegisterScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF1DE",
        paddingHorizontal: 24,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 16,
        borderRadius: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#E39A5A",
        marginTop: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#E6A870",
        textAlign: "center",
        marginVertical: 8,
        marginBottom: 24,
        fontWeight: "500",
    },
    inputWrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        marginBottom: 14,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#333",
    },
    registerBtn: {
        width: "100%",
        height: 52,
        backgroundColor: "#E39A5A",
        borderRadius: 26,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
    },
    registerText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
    },
    googleBtn: {
        width: "100%",
        height: 52,
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 16,
    },
    googleIcon: {
        width: 18,
        height: 18,
        marginRight: 10,
        borderRadius: 4,
    },
    googleText: {
        fontSize: 14,
        fontWeight: "500",
    },
    loginText: {
        marginTop: 20,
        fontSize: 13,
        color: "#888",
        textAlign: 'center'
    },
    loginLink: {
        color: "#E39A5A",
        fontWeight: "600",
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 24,
    },
})
