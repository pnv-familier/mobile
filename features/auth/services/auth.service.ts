import { apiClient } from "../../../api/api"
import { SuccessResponse } from "../../../types/api"
import { AuthResponse, LoginPayload, RegisterPayload } from "../type"

export const register = async (payload: RegisterPayload): Promise<SuccessResponse<AuthResponse>> => {
    const response = await apiClient.post("/api/v1/auth/register", payload)
    return response.data

}

export const loginWithGoogle = async (idToken: string): Promise<SuccessResponse<AuthResponse>> => {
    const response = await apiClient.post('/api/v1/auth/google', {
        idToken,
    });
    return response.data;
}

export const login = async (payload: LoginPayload): Promise<SuccessResponse<AuthResponse>> => {
    const response = await apiClient.post("/api/v1/auth/login", payload)
    return response.data
}
