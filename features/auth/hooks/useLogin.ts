import { useState } from "react";
import { AuthResponse, LoginErrors, LoginPayload } from "../type";
import { useAuthStore } from "../store/auth.store";
import { isEmailValid } from "../utils/validator";
import { login } from "../services/auth.service";
import { saveTokens } from "../utils/token";
import { Alert } from "react-native";
import { ErrorResponse } from "../../../types/api";

const INITIAL_VALUES: LoginPayload = {
    email: "",
    password: ""
}
export function useLogin() {
    const [values, setValues] = useState(INITIAL_VALUES)
    const [errors, setErrors] = useState<LoginErrors>({})
    const [loading, setLoading] = useState(false)
    const setAuth = useAuthStore((state) => state.setAuth)

    const onChange = (key: keyof LoginPayload, value: string) => {
        setValues(prev => ({... prev, [key]: value}))
        setErrors(prev => ({... prev, [key]: undefined}))
    }

    const submit = async () => {
        if (!isEmailValid(values.email)) {
            setErrors({email: "Email is invalid"})
            return;
        }

        try {
            setLoading(true)
            const data: AuthResponse = (await login(values)).data
            saveTokens(data)
            setAuth(data.user)
        } catch (error: any) {
            const err: ErrorResponse = error;
            if (err.details) {
                setErrors(err.details)
            } else {
                Alert.alert("Login Failed", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        values,
        errors,
        loading,
        onChange,
        submit,
    }
}