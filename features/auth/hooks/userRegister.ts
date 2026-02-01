import { useState } from "react"
import { Alert } from "react-native"
import { RegisterForm, RegisterErrors, AuthResponse } from "../type"
import { validateRegister } from "../utils/validator"
import { register } from "../services/auth.service"
import { checkPasswordStrength, PasswordStrength } from "../utils/password"
import { saveTokens } from "../utils/token"
import { useAuthStore } from "../store/auth.store"

const INITIAL_VALUES: RegisterForm = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export function useRegister() {
    const [values, setValues] = useState(INITIAL_VALUES)
    const [errors, setErrors] = useState<RegisterErrors>({})
    const [loading, setLoading] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('')
    const setAuth = useAuthStore((state) => state.setAuth);

    const onChange = (key: keyof RegisterForm, value: string) => {
        setValues(prev => ({ ...prev, [key]: value }))
        setErrors(prev => ({ ...prev, [key]: undefined }))

        if (key === 'password') {
            setPasswordStrength(checkPasswordStrength(value))
        }
    }

    const submit = async () => {
        const validationErrors = validateRegister(values)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        try {
            setLoading(true)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { confirmPassword, ...rest } = values
            const data: AuthResponse = (await register(rest)).data
            saveTokens(data)
            setAuth(data.user)
        } catch (err: any) {
            if (err.details) {
                setErrors(err.details)
            } else {
                Alert.alert("Registration Failed", err.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return {
        values,
        errors,
        loading,
        passwordStrength,
        onChange,
        submit,
    }
}

