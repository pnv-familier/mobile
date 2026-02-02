import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { ErrorResponse } from "../types/api";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    },
    timeout: 15000,
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