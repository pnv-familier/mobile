import { apiClient } from "../../../api/api"
import { SuccessResponse } from "../../../types/api"
import { AuthResponse, RegisterPayload } from "../type"
import { isAxiosError } from "axios"

export const register = async (payload: RegisterPayload): Promise<SuccessResponse<AuthResponse>> => {
    try {
        const response = await apiClient.post("/api/v1/auth/register", payload)
        return response.data
    } catch (error) {
        if (isAxiosError(error)) {
            if (error.response) {
                throw error.response.data
            } else {
                throw new Error("No internet connection")
            }
        }
        throw new Error("An unexpected error occurred")
    }
}

export const loginWithGoogle = async (idToken: string): Promise<SuccessResponse<AuthResponse>> => {
    const response = await apiClient.post('/api/v1/auth/google', {
        idToken,
    });
    return response.data;
}
