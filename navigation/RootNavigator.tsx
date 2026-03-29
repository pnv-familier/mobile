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
import { storage } from '../utils/storage'
import { useUrgentSuggestions } from '../features/suggestion/hooks/useUrgentSuggestions'
import { UrgentSuggestionBanner } from '../features/suggestion/components/UrgentSuggestionBanner'
import { UrgentSuggestionModal } from '../features/suggestion/components/UrgentSuggestionModal'
import { useUrgentSuggestionStore } from '../features/suggestion/store/urgentSuggestion.store'
import { useNavigation } from '@react-navigation/native'

const Stack = createNativeStackNavigator<RootStackParamList>()

function AppContent() {
    const navigation = useNavigation<any>();
    const user = useAuthStore(s => s.data)
    const currentSuggestion = useUrgentSuggestionStore(s => s.currentSuggestion)
    const setCurrentSuggestion = useUrgentSuggestionStore(s => s.setCurrentSuggestion)
    const { markAsRead } = useUrgentSuggestions(!!user)

    const handleUrgentSuggestionPress = () => {
        // Modal sẽ hiển thị currentSuggestion
    }

    const handleUrgentSuggestionDismiss = async () => {
        if (currentSuggestion) {
            await markAsRead(currentSuggestion.id)
            setCurrentSuggestion(null)
        }
    }

    return (
        <>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="App" component={AppNavigator} />
                )}
            </Stack.Navigator>

            <UrgentSuggestionBanner
                suggestion={currentSuggestion}
                onPress={handleUrgentSuggestionPress}
                onDismiss={handleUrgentSuggestionDismiss}
            />

            <UrgentSuggestionModal
                visible={!!currentSuggestion}
                suggestion={currentSuggestion}
                onDismiss={handleUrgentSuggestionDismiss}
            />
        </>
    )
}

export default function RootNavigator() {
    const user = useAuthStore(s => s.data)
    const { fetchMyFamily } = useFamilyStore()
    const setUnreadCount = useNotificationStore(s => s.setUnreadCount)
    const showBanner = useNotificationStore(s => s.showBanner)
    const banner = useNotificationStore(s => s.banner)
    const clearBanner = useNotificationStore(s => s.clearBanner)

    usePushNotification();

    useEffect(() => {
        if (user) {
            fetchMyFamily();
            notificationService.getNotifications()
                .then(async data => {
                    const unread = data.filter(n => n.status === 'UNREAD');
                    setUnreadCount(unread.length);
                    
                    const notifiedIds = await storage.getNotifiedIds();
                    const newUnread = unread.filter(n => {
                        if (n.notified !== undefined && n.notified !== null) {
                            return !n.notified;
                        }
                        return !notifiedIds.has(n.id);
                    });
                    
                    if (newUnread.length > 0) {
                        // Chỉ hiển thị banner cho notification thông thường
                        // Không hiển thị cho type='AI' (urgent suggestions sẽ dùng modal riêng)
                        const regularNotifications = newUnread.filter(n => n.type !== 'AI');
                        
                        regularNotifications.forEach((n, i) => {
                            setTimeout(() => {
                                showBanner({ title: n.title, body: n.body });
                            }, i * 200);
                        });
                        
                        // Lưu IDs và update notified status
                        await storage.addNotifiedIds(newUnread.map(n => n.id));
                        
                        // Gọi API để update notified = true cho backend
                        newUnread.forEach(async (n) => {
                            try {
                                await notificationService.markAsNotified(n.id);
                            } catch (error) {
                                console.error('Failed to mark notification as notified:', error);
                            }
                        });
                    }
                })
                .catch(() => {});
        }
    }, [user])

    return (
        <NavigationContainer>
            <AppContent />
            <InAppNotificationBanner
                notification={banner}
                onDismiss={clearBanner}
                onPress={clearBanner}
            />
        </NavigationContainer>
    )
}
