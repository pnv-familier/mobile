import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useAuthStore } from '../features/auth/store/auth.store';
import { apiClient } from '../api/api';
import { useNotificationStore } from '../features/notification/store/notification.store';
import { notificationService } from '../features/notification/services/notification.service';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

Notifications.setNotificationChannelAsync('default', {
  name: 'Family Emotions',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#D4A056',
  sound: 'default',
  enableVibrate: true,
  showBadge: true,
});

export function usePushNotification(navigation?: any) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const user = useAuthStore(s => s.data);

  useEffect(() => {
    if (!user) return;

    registerForPushNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      const store = useNotificationStore.getState();
      
      // Refresh list from server to get full notification object
      notificationService.getNotifications().then(data => {
        store.setNotifications(data);
        store.setUnreadCount(data.filter(n => n.status === 'UNREAD').length);
      }).catch(() => {
        // Fallback if fetch fails: just increment count
        store.setUnreadCount(store.unreadCount + 1);
      });

      if (title) {
        const now = new Date();
        const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        store.showBanner({ title, body: body || '', time });
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      handleNotificationTap(data);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [user]);

  async function registerForPushNotifications() {
    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId: 'ac6b5ff8-aef1-4d29-b96c-2149c8ae6627',
    });

    await apiClient.post('/api/v1/notifications/push-token', {
      token: pushToken.data,
      platform: 'android',
    }).catch(() => {});
  }

  function handleNotificationTap(data: any) {
    if (!navigation) return;
    switch (data?.type) {
      case 'POST_COMMENT':
      case 'POST_REACTION':
        navigation.navigate('Home');
        break;
      case 'LOVE_TASK':
        if (data.referenceId) {
          navigation.navigate('LoveTasks', {
            screen: 'TaskDetail',
            params: { taskId: Number(data.referenceId) },
          });
        }
        break;
      case 'SCHEDULE':
        navigation.navigate('Schedule');
        break;
      case 'AI':
        navigation.navigate('Suggestions');
        break;
    }
  }
}
