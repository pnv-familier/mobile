import { useAuthStore } from "../store/auth.store";
import { logout as logoutService } from "../services/auth.service";
import { removeTokens } from "../utils/token";
import * as Notifications from 'expo-notifications';
import { notificationService } from '../../notification/services/notification.service';
import { useNotificationStore } from '../../notification/store/notification.store';

export const useLogout = () => {
    const resetAuthStore = useAuthStore((state) => state.reset);
    const resetNotifications = useNotificationStore((state) => state.reset);

    const logout = async () => {
        try {
            try {
                const token = (await Notifications.getExpoPushTokenAsync()).data;
                await notificationService.removePushToken(token);
            } catch {}
            await logoutService();
        } finally {
            await removeTokens();
            await resetAuthStore();
            resetNotifications();
        }
    };

    return { logout };
};
