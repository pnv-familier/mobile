export type RegisterPayload = {
    fullName: string
    email: string
    password: string
}

export type RegisterForm = RegisterPayload & {
    confirmPassword?: string
}

export type UserResponse = {
    id: string
    email: string
    fullName: string
    avatarUrl: null
    authProvider: string
    createdAt: string
    updatedAt: string
    premium: boolean
}

export type RegisterErrors = Partial<Record<keyof RegisterForm, string>>
