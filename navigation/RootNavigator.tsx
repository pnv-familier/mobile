import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigator from '../features/auth/AuthNavigator'
import AppNavigator from './AppNavigator'
import { useAuthStore } from '../features/auth/store/auth.store'
import { RootStackParamList } from './types'
import { useFamilyStore } from '../features/family/store/family.store'
import { usePushNotification } from '../hooks/usePushNotification'
import { notificationService } from '../features/notification/services/notification.service'
import { useNotificationStore } from '../features/notification/store/notification.store'
import { InAppNotificationBanner } from '../components/InAppNotificationBanner'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    const user = useAuthStore(s => s.data)
    const { fetchMyFamily } = useFamilyStore()
    const setUnreadCount = useNotificationStore(s => s.setUnreadCount)
    const showBanner = useNotificationStore(s => s.showBanner)
    const banner = useNotificationStore(s => s.banner)
    const clearBanner = useNotificationStore(s => s.clearBanner)

    const setNotifications = useNotificationStore(s => s.setNotifications)

    usePushNotification();

    useEffect(() => {
        if (user) {
            fetchMyFamily();
            notificationService.getNotifications()
                .then(data => {
                    setNotifications(data);
                    const unread = data.filter(n => n.status === 'UNREAD');
                    setUnreadCount(unread.length);
                    // Chỉ show banner cho unread, đè lên nhau nhanh (500ms)
                    unread.forEach((n, i) => {
                        setTimeout(() => {
                            showBanner({ title: n.title, body: n.body });
                        }, i * 200);
                    });
                })
                .catch(() => {});
        }
    }, [user])

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="App" component={AppNavigator} />
                )}
            </Stack.Navigator>

            <InAppNotificationBanner
                notification={banner}
                onDismiss={clearBanner}
                onPress={clearBanner}
            />
        </NavigationContainer>
    )
}
