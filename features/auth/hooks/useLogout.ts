import { useAuthStore } from "../store/auth.store";
import { logout as logoutService } from "../services/auth.service";
import { removeTokens } from "../utils/token";

export const useLogout = () => {
    const resetAuthStore = useAuthStore((state) => state.reset);

    const logout = async () => {
        try {
            await logoutService();
        } finally {
            await removeTokens();
            await resetAuthStore();
        }
    };

    return { logout };
};
