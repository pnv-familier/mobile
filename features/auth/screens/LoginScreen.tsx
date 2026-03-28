import { useNavigation } from "@react-navigation/native"
import { View, StyleSheet, Image, TouchableOpacity } from "react-native"
import Constants from "expo-constants"
import AppScreen from "../../../components/AppScreen"
import AppText from "../../../components/AppText"
import AppButton from "../../../components/AppButton"
import AuthInput from "../components/AuthInput"
import { useGoogleLogin } from "../hooks/useGoogleLogin"
import { useLogin } from "../hooks/useLogin"
import { useTranslation } from "react-i18next"

const LoginScreen = () => {
    const { t } = useTranslation()
    const navigation = useNavigation<any>()
    const { login: googleLogin, loading: isGoogleLoading } = useGoogleLogin()
    const { values, errors, loading, onChange, submit } = useLogin()

    return (
        <AppScreen style={styles.container}>
            <Image source={require("../../../assets/icon.png")} style={styles.logo} />

            <AppText style={styles.title}>{t('auth.loginTitle')}</AppText>
            <AppText style={styles.subtitle}>
                {t('auth.loginSubtitle')}
            </AppText>

            <View style={styles.form}>
                <AuthInput
                    icon="mail"
                    placeholder={t('auth.email')}
                    value={values.email}
                    onChangeText={(v) => onChange("email", v)}
                    error={errors.email}
                />
                <AuthInput
                    icon="lock"
                    placeholder={t('auth.password')}
                    secure
                    value={values.password}
                    onChangeText={(v) => onChange("password", v)}
                    error={errors.password}
                />
            </View>

            <AppButton title={t('auth.login')} style={styles.loginBtn} onPress={submit} loading={loading} />

            <View style={styles.dividerWrapper}>
                <View style={styles.divider} />
                <AppText style={styles.orText}>{t('common.or')}</AppText>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity 
                style={[styles.googleBtn, isGoogleLoading && { opacity: 0.7 }]}
                onPress={googleLogin}
                disabled={isGoogleLoading}>
                <Image
                    source={require("../../../assets/google-icon.png")}
                    style={styles.googleIcon}
                />
                <AppText style={styles.googleText}>
                    {t('auth.continueWithGoogle')}
                </AppText>
            </TouchableOpacity>

            <AppText style={styles.signupText}>
                {t('auth.dontHaveAccount')}{" "}
                <AppText
                    style={styles.signupLink}
                    onPress={() => navigation.navigate("Register")}
                >
                    {t('auth.signUp')}
                </AppText>
            </AppText>

            <AppText style={styles.versionText}>
                {t('auth.appVersion')}: v{Constants.expoConfig?.version}{" "}
                <AppText
                    style={styles.versionLink}
                    onPress={() => navigation.navigate("Version")}
                >
                    | {t('auth.checkInfo')}
                </AppText>
            </AppText>
        </AppScreen>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF1DE",
        alignItems: "center",
        justifyContent: "center",
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
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: "#E6A870",
        marginBottom: 24,
        fontWeight: "500",
    },
    form: {
        width: "100%",
        gap: 12,
        marginBottom: 16,
    },
    loginBtn: {
        marginTop: 8,
        width: "100%",
        backgroundColor: "#E39A5A",
    },
    dividerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
        width: "100%",
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: "#E6A870",
        opacity: 0.6,
    },
    orText: {
        marginHorizontal: 10,
        color: "#E39A5A",
        fontSize: 12,
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
    signupText: {
        marginTop: 20,
        fontSize: 13,
        color: "#888",
    },
    signupLink: {
        color: "#E39A5A",
        fontWeight: "600",
    },
    versionText: {
        marginTop: 30,
        fontSize: 11,
        color: "#888",
        opacity: 0.7,
    },
    versionLink: {
        color: "#cc701f",
        fontWeight: "500",
        fontSize: 12,
        opacity: 0.2,
    },
})
