import {create} from "zustand"
import { User } from "../type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiClient } from "../../../api/api";
import { isAxiosError } from "axios";

type AuthState = {
    data: User | null;
    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>;
    setAuth: (user: User) => void;
    reset: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    data: null,
    isLoading: false,
    error: null,

    setAuth: (user: User) => {
        set({ data: user, error: null });
    },

    fetchData: async () => {
        set({ isLoading: true, error: null });
        try {
            const token = await AsyncStorage.getItem("accessToken");

            if (!token) {
                set({ data: null, isLoading: false });
                return;
            }

            const response = await apiClient.get("/api/users/me");

            const userData = response.data.data || response.data;

            set({ data: userData, isLoading: false });
        } catch (error) {
            console.error("Failed to get user info:", error);

            if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                await AsyncStorage.removeItem("accessToken");
                await AsyncStorage.removeItem("refreshToken");
                set({ data: null, error: "Session expired" });
            } else {
                set({ error: "Cannot get user info", data: null });
            }

            set({ isLoading: false });
        }
    },

    reset: async () => {
        await AsyncStorage.removeItem("accessToken");
        await AsyncStorage.removeItem("refreshToken");
        set({ data: null, error: null, isLoading: false });
    },
}))