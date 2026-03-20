import { useNotificationStore } from '../features/notification/store/notification.store';

export const showBanner = (title: string, body: string) => {
  useNotificationStore.getState().showBanner({ title, body });
};
