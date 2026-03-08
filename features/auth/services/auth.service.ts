import AsyncStorage from "@react-native-async-storage/async-storage"
import { apiClient } from "../../../api/api"
import { SuccessResponse } from "../../../types/api"
import { AuthResponse, LoginPayload, RegisterPayload } from "../type"
import { removeTokens } from "../utils/token"

export const register = async (payload: RegisterPayload): Promise<SuccessResponse<AuthResponse>> => {
    const response = await apiClient.post("/api/v1/auth/register", payload)
    return response.data

}

export const loginWithGoogle = async (idToken: string): Promise<SuccessResponse<AuthResponse>> => {
    await removeTokens();
    const response = await apiClient.post('/api/v1/auth/google', {
        idToken,
    });
    return response.data;
}

export const login = async (payload: LoginPayload): Promise<SuccessResponse<AuthResponse>> => {
    await removeTokens();
    const response = await apiClient.post("/api/v1/auth/login", payload)
    return response.data
}

export const logout = async (): Promise<void> => {
    await apiClient.post("/api/v1/auth/logout");
};

export const refreshToken = async (token: string): Promise<SuccessResponse<AuthResponse>> => {
    const response = await apiClient.post("/api/v1/auth/refresh-token", {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};
