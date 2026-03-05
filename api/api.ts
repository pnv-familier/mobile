import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ErrorResponse } from "../types/api";
import { saveTokens } from "../features/auth/utils/token";
import { useAuthStore } from "../features/auth/store/auth.store";

export const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 30000,
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        const isAuthRequest = originalRequest?.url?.includes("/auth");
        if (error.response?.status === 401 && !originalRequest?._retry && !isAuthRequest) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = await AsyncStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("No refresh token");

                const response = await axios.post(`${apiUrl}/api/v1/auth/refresh-token`, {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                    timeout: 10000,
                });

                const { accessToken, user } = response.data.data;
                
                await saveTokens({ accessToken, refreshToken, user });
                useAuthStore.getState().setAuth(user);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);

            } catch (refreshError) {
                await useAuthStore.getState().reset();
                await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
                
                return new Promise(() => {}); 
            }
        }

        const { response } = error;

        if (response) {
            if (response.status >= 500) {
                Alert.alert("Server Error", "The system is under maintenance. Please try again later.");
            }

            const responseData = response.data as any;
            const errorData: ErrorResponse = {
                message: responseData?.message || "An error occurred",
                path: responseData?.path || "",
                details: responseData?.details || null,
            };

            return Promise.reject(errorData);
        }

        Alert.alert("Network Error", "No internet connection or server is not responding.");
        return Promise.reject({ 
            message: "Network connection failed", 
            details: null 
        } as ErrorResponse);
    }
);
