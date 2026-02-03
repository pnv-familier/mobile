import { useAuthStore } from "../store/auth.store";
import { logout as logoutService } from "../services/auth.service";
import { removeTokens } from "../utils/token";
import { Alert } from "react-native";

export const useLogout = () => {
    const resetAuthStore = useAuthStore((state) => state.reset);

    const logout = async () => {
        try {
            await logoutService();
        } catch (error) {
            console.error("Logout failed", error);
            Alert.alert("Logout Failed", "An error occurred during logout. Please try again.");
        } finally {
            await removeTokens();
            await resetAuthStore();
        }
    };

    return { logout };
};
