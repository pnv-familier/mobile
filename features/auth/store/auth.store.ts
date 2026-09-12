import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAxiosError } from "axios";
import { User } from "../../user/type";
import { storage } from "../../../utils/storage";

type AuthState = {
    data: User | null;
    isLoading: boolean;
    error: string | null;

    fetchData: () => Promise<void>;
    setAuth: (user: User) => void;
    reset: () => Promise<void>;
    updateIsSetUp: (isSetup: boolean) => void;
};

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

            // Restore cached user profile if exists to reduce UI flicker on cold start
            const cachedUserStr = await AsyncStorage.getItem("user");
            if (cachedUserStr) {
                try {
                    const cachedUser = JSON.parse(cachedUserStr);
                    if (cachedUser) {
                        set({ data: cachedUser });
                    }
                } catch (e) {}
            }

            const { userService } = require("../../user/service/user.service");
            const response = await userService.getCurrentUser();
            const userData = response.data;

            if (userData) {
                await AsyncStorage.setItem("user", JSON.stringify(userData));
                set({ data: userData, isLoading: false, error: null });
            }
        } catch (error) {
            console.error("Failed to get user info:", error);

            if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
                set({ data: null, error: "Session expired" });
            } else {
                // If offline / network error, preserve cached user if available
                const cachedUserStr = await AsyncStorage.getItem("user");
                if (cachedUserStr) {
                    try {
                        const cachedUser = JSON.parse(cachedUserStr);
                        set({ data: cachedUser, error: null });
                    } catch (e) {
                        set({ error: "Cannot get user info", data: null });
                    }
                } else {
                    set({ error: "Cannot get user info", data: null });
                }
            }

            set({ isLoading: false });
        }
    },

    reset: async () => {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
        await storage.clearNotifiedIds();
        set({ data: null, error: null, isLoading: false });
    },

    updateIsSetUp: (isSetup: boolean) => {
        set((state) => ({
            ...state,
            data: state.data
                ? { ...state.data, setup: isSetup }
                : null
        }));
    }
}));