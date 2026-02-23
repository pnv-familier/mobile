import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ErrorResponse } from "../types/api";
import { refreshToken as refreshAuthToken } from "../features/auth/services/auth.service";
import { useAuthStore } from "../features/auth/store/auth.store";
import { saveTokens } from "../features/auth/utils/token";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
        const originalRequest = error.config;
        if (error.response?.status === 401 && originalRequest && !originalRequest.url?.includes("/auth")) {
            const refreshToken = await AsyncStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const response = await refreshAuthToken(refreshToken);
                    const { accessToken, user } = response.data;
                    await saveTokens({ accessToken, refreshToken, user });
                    useAuthStore.getState().setAuth(user);

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                } catch (e) {
                    await useAuthStore.getState().reset();
                    Alert.alert("Session Expired", "Your session has expired. Please log in again.");
                    return Promise.reject(e);
                }
            } else {
                await useAuthStore.getState().reset();
                Alert.alert("Session Expired", "Your session has expired. Please log in again.");
            }
        }

        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const { response, request } = error;

        if (response) {
            if (response.status >= 500) {
                Alert.alert("Server Error", "The system is under maintenance. Please try again later.");
            }

            const errorData: ErrorResponse = {
                message: response.data?.message || "An error occurred",
                path: response.data?.path,
                details: response.data?.details || null,
            };
            return Promise.reject(errorData);
        }

        if (request) {
            Alert.alert("Network Error", "No internet connection or server is not responding.");
            return Promise.reject({ message: "Network connection failed", details: null } as ErrorResponse);
        }

        Alert.alert("Error", error.message);
        return Promise.reject({ message: error.message, details: null } as ErrorResponse);
    }
);