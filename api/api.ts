import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // 1. Phải import cái này

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const apiClient = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json"
    }
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
