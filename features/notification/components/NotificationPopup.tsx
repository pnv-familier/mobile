import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { X, MessageCircle, Heart, CheckCircle2, Calendar, Lightbulb, Bell } from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';
import { Notification, NotificationTab, NotificationType } from '../types';

const ACCENT_COLOR = '#D4A056';

const TABS: { label: string; value: NotificationTab }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Post', value: 'POST' },
  { label: 'AI', value: 'AI' },
  { label: 'Love Task', value: 'LOVE_TASK' },
  { label: 'Schedule', value: 'SCHEDULE' },
];

const TYPE_ICON: Record<NotificationType, { icon: any; color: string }> = {
  POST_COMMENT: { icon: MessageCircle, color: '#2196F3' },
  POST_REACTION: { icon: Heart, color: '#E91E63' },
  LOVE_TASK: { icon: CheckCircle2, color: '#4CAF50' },
  SCHEDULE: { icon: Calendar, color: '#FF9800' },
  AI: { icon: Lightbulb, color: '#9C27B0' },
};

interface NotificationPopupProps {
  visible: boolean;
  onClose: () => void;
  navigation: any;
}

const formatTime = (createdAt: string) => {
  const date = new Date(createdAt);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ visible, onClose, navigation }) => {
  const [activeTab, setActiveTab] = useState<NotificationTab>('ALL');
  const { loading, error, fetchNotifications, markAsRead, getFiltered, unreadCount } = useNotifications();

  useEffect(() => {
    if (visible) fetchNotifications();
  }, [visible]);

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.isRead) await markAsRead(notification.id);
    onClose();

    switch (notification.type) {
      case 'POST_COMMENT':
      case 'POST_REACTION':
        // AC-NT-07: navigate to post
        navigation.navigate('Home');
        break;
      case 'LOVE_TASK':
        // AC-NT-11: navigate to love task detail
        if (notification.referenceId) {
          navigation.navigate('LoveTasks', {
            screen: 'TaskDetail',
            params: { taskId: Number(notification.referenceId) },
          });
        }
        break;
      case 'SCHEDULE':
        // AC-NT-15: navigate to schedule
        navigation.navigate('Schedule');
        break;
      case 'AI':
        navigation.navigate('Suggestions');
        break;
    }
  };

  const filtered = getFiltered(activeTab);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {/* AC-NT-17: tap outside to close */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popup}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Bell size={20} color={ACCENT_COLOR} />
                  <Text style={styles.headerTitle}>Notifications</Text>
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                  )}
                </View>
                {/* AC-NT-16: X to close */}
                <TouchableOpacity onPress={onClose}>
                  <X size={22} color="#666" />
                </TouchableOpacity>
              </View>

              {/* Tabs */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
                <View style={styles.tabRow}>
                  {TABS.map(tab => (
                    <TouchableOpacity
                      key={tab.value}
                      style={[styles.tab, activeTab === tab.value && styles.tabActive]}
                      onPress={() => setActiveTab(tab.value)}
                    >
                      <Text style={[styles.tabText, activeTab === tab.value && styles.tabTextActive]}>
                        {tab.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* List - AC-NT-06: scrollable */}
              {loading ? (
                <View style={styles.centered}>
                  <ActivityIndicator color={ACCENT_COLOR} />
                </View>
              ) : error ? (
                <View style={styles.centered}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : filtered.length === 0 ? (
                <View style={styles.centered}>
                  <Bell size={40} color="#DDD" />
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              ) : (
                <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                  {filtered.map(notification => {
                    const config = TYPE_ICON[notification.type];
                    const IconComponent = config.icon;
                    return (
                      <TouchableOpacity
                        key={notification.id}
                        // AC-NT-05: unread = darker background
                        style={[styles.item, !notification.isRead && styles.itemUnread]}
                        onPress={() => handleNotificationPress(notification)}
                      >
                        <View style={[styles.iconBox, { backgroundColor: config.color + '20' }]}>
                          <IconComponent size={20} color={config.color} />
                        </View>
                        <View style={styles.itemContent}>
                          <Text style={styles.itemTitle} numberOfLines={1}>{notification.title}</Text>
                          <Text style={styles.itemBody} numberOfLines={2}>{notification.body}</Text>
                          <Text style={styles.itemTime}>{formatTime(notification.createdAt)}</Text>
                        </View>
                        {!notification.isRead && <View style={styles.unreadDot} />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 90,
    paddingRight: 10,
  },
  popup: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    width: 340,
    maxHeight: 500,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  badge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  tabScroll: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  tabRow: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8, gap: 8 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  tabActive: { backgroundColor: ACCENT_COLOR },
  tabText: { fontSize: 12, fontWeight: '600', color: ACCENT_COLOR },
  tabTextActive: { color: '#FFF' },
  list: { maxHeight: 360 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
    gap: 10,
  },
  itemUnread: { backgroundColor: '#FDF2E3' },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 2 },
  itemBody: { fontSize: 12, color: '#777', lineHeight: 16 },
  itemTime: { fontSize: 11, color: '#AAA', marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_COLOR,
  },
  centered: { height: 150, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { color: '#AAA', fontSize: 14 },
  errorText: { color: '#E53935', fontSize: 13 },
});
