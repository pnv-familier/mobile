import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ErrorResponse } from "../types/api";
import { removeTokens, saveTokens } from "../features/auth/utils/token";
import { useAuthStore } from "../features/auth/store/auth.store";

export const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 60000,
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

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        const EXCLUDED_URLS = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/google"];
        const isExcluded = EXCLUDED_URLS.some(url => originalRequest?.url?.includes(url));

        if (error.response?.status === 401 && !originalRequest?._retry && !isExcluded) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest));
                        },
                        reject: (err: any) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = await AsyncStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token");
                }

                const response = await axios.post(`${apiUrl}/api/v1/auth/refresh-token`, {}, {
                    headers: { Authorization: `Bearer ${refreshToken}` },
                    timeout: 60000,
                });

                const responseData = response.data?.data;
                const newAccessToken = responseData?.accessToken;
                const newRefreshToken = responseData?.refreshToken || refreshToken;
                const user = responseData?.user;

                if (!newAccessToken) {
                    throw new Error("No access token returned from refresh endpoint");
                }

                await saveTokens({
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                    user: user || undefined
                });

                if (user) {
                    useAuthStore.getState().setAuth(user);
                }

                processQueue(null, newAccessToken);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest);

            } catch (refreshError: any) {
                processQueue(refreshError, null);
                const isAuthFailure =
                    refreshError?.response?.status === 401 ||
                    refreshError?.response?.status === 403 ||
                    refreshError?.message === "No refresh token";

                if (isAuthFailure) {
                    await useAuthStore.getState().reset();
                    await removeTokens();
                    Alert.alert("Session Expired", "Please login again.");
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const { response } = error;
        const isLogoutRequest = originalRequest?.url?.includes("/auth/logout");

        if (response) {
            const responseData = response.data as any;
            const errorData: ErrorResponse = {
                message: responseData?.message || "An unexpected error occurred",
                path: responseData?.path || "",
                details: responseData?.details || null,
            };

            if (response.status >= 500 && !isLogoutRequest) {
                Alert.alert("Server Notice", "Our service is experiencing a temporary issue. Please try again in a few moments.");
            }

            return Promise.reject(errorData);
        }

        if (!isLogoutRequest) {
            Alert.alert("Connection Problem", "Unable to connect to the server. Please check your internet connection and try again.");
        }
        return Promise.reject({ 
            message: "Unable to connect to server. Please check your internet connection.", 
            details: null 
        } as ErrorResponse);
    }
);
