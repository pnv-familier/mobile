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
import { X, MessageCircle, Heart, CheckCircle2, Calendar, Sparkles, Bell, LayoutGrid } from 'lucide-react-native';
import { useNotifications } from '../hooks/useNotifications';
import { Notification, NotificationTab, NotificationType } from '../types';
import { useNotificationStore } from '../store/notification.store';
import { useNavigation } from '@react-navigation/native';
import { useUrgentSuggestionStore } from '../../suggestion/store/urgentSuggestion.store';
import { suggestionService } from '../../suggestion/services/suggestion.service';

const ACCENT_COLOR = '#D4A056';

const TABS: { icon: any; value: NotificationTab; color: string }[] = [
  { icon: LayoutGrid, value: 'ALL', color: '#666' },
  { icon: MessageCircle, value: 'POST', color: '#2196F3' },
  { icon: Sparkles, value: 'AI', color: ACCENT_COLOR },
  { icon: Heart, value: 'LOVE_TASK', color: '#E91E63' },
  { icon: Calendar, value: 'SCHEDULE', color: '#FF9800' },
];

const TYPE_ICON: Record<NotificationType, { icon: any; color: string }> = {
  POST_COMMENT: { icon: MessageCircle, color: '#2196F3' },
  POST_REACTION: { icon: Heart, color: '#E91E63' },
  LOVE_TASK: { icon: CheckCircle2, color: '#4CAF50' },
  SCHEDULE: { icon: Calendar, color: '#FF9800' },
  AI: { icon: Sparkles, color: ACCENT_COLOR },
  URGENT_SUGGESTION: { icon: Sparkles, color: '#FF5722' },
};

interface NotificationPopupProps {
  visible: boolean;
  onClose: () => void;
}

const formatTime = (createdAt: string) => {
  if (!createdAt) return '';
  // Handle array format [year, month, day, hour, minute]
  if (Array.isArray(createdAt)) {
    const [year, month, day, hour = 0, minute = 0] = createdAt as any;
    const date = new Date(year, month - 1, day, hour, minute);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  }
  const normalized = createdAt.includes('Z') || createdAt.includes('+') ? createdAt : createdAt + 'Z';
  const date = new Date(normalized);
  if (isNaN(date.getTime())) return '';
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

export const NotificationPopup: React.FC<NotificationPopupProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<NotificationTab>('ALL');
  const { loading, error, fetchNotifications, markAsRead, getFiltered, notifications } = useNotifications();
  const unreadCount = useNotificationStore(s => s.unreadCount);
  const setOpenPostId = useNotificationStore(s => s.setOpenPostId);
  const setOpenEventId = useNotificationStore(s => s.setOpenEventId);
  const setCurrentSuggestion = useUrgentSuggestionStore(s => s.setCurrentSuggestion);

  useEffect(() => {
    if (visible && notifications.length === 0) fetchNotifications();
  }, [visible]);

  const handleNotificationPress = async (notification: Notification) => {
    if (notification.status === 'UNREAD') {
      await markAsRead(notification.id);
    }
    onClose();

    switch (notification.type) {
      case 'POST_COMMENT':
      case 'POST_REACTION':
        setOpenPostId(notification.referenceId || null);
        navigation.navigate('Home');
        break;
      case 'LOVE_TASK':
        if (notification.referenceId) {
          navigation.navigate('LoveTasks', {
            screen: 'TaskDetail',
            params: { taskId: Number(notification.referenceId) },
          });
        }
        break;
      case 'SCHEDULE':
        setOpenEventId(notification.referenceId || null);
        navigation.navigate('Schedule');
        break;
      case 'URGENT_SUGGESTION':
        if (notification.referenceId) {
          try {
            const urgentSuggestion = await suggestionService.getUrgentSuggestionById(notification.referenceId);
            setCurrentSuggestion(urgentSuggestion);
          } catch (error) {
            console.error('Failed to fetch urgent suggestion:', error);
          }
        }
        break;
      case 'AI':
        if (notification.referenceId) {
          navigation.navigate('Suggestions', {
            screen: 'SuggestionDetail',
            params: { id: notification.referenceId },
          });
        } else {
          navigation.navigate('Suggestions');
        }
        break;
    }
  };

  const filtered = getFiltered(activeTab);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.popup}>

              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Bell size={18} color={ACCENT_COLOR} />
                  <Text style={styles.headerTitle}>Notifications</Text>
                  {unreadCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color="#666" />
                </TouchableOpacity>
              </View>

              <View style={styles.tabRow}>
                {TABS.map(tab => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.value;
                  return (
                    <TouchableOpacity
                      key={tab.value}
                      style={[styles.tab, isActive && styles.tabActive]}
                      onPress={() => setActiveTab(tab.value)}
                    >
                      <IconComponent size={18} color={isActive ? '#FFF' : tab.color} />
                    </TouchableOpacity>
                  );
                })}
              </View>

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
                  <Bell size={36} color="#DDD" />
                  <Text style={styles.emptyText}>No notifications</Text>
                </View>
              ) : (
                <ScrollView style={styles.list} showsVerticalScrollIndicator={false} nestedScrollEnabled>
                  {filtered.map(notification => {
                    const config = TYPE_ICON[notification.type];
                    const IconComponent = config.icon;
                    return (
                      <TouchableOpacity
                        key={notification.id}
                        style={[styles.item, notification.status === 'UNREAD' ? styles.itemUnread : styles.itemRead]}
                        onPress={() => handleNotificationPress(notification)}
                      >
                        <View style={[styles.iconBox, { backgroundColor: config.color + (notification.status === 'UNREAD' ? '25' : '10') }]}>
                          <IconComponent size={18} color={notification.status === 'READ' ? '#BBB' : config.color} />
                        </View>
                        <View style={styles.itemContent}>
                          <View style={styles.titleRow}>
                            <Text style={[styles.itemTitle, notification.status === 'READ' && styles.itemTitleRead]} numberOfLines={1}>
                              {notification.title}
                            </Text>
                            <Text style={styles.itemTime}>{formatTime(notification.createdAt)}</Text>
                          </View>
                          <Text style={[styles.itemBody, notification.status === 'READ' && styles.itemBodyRead]} numberOfLines={2}>
                            {notification.body}
                          </Text>
                        </View>
                        {notification.status === 'UNREAD' && <View style={styles.unreadDot} />}
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
    alignItems: 'center',
    paddingTop: 80,
  },
  popup: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    width: '90%',
    maxHeight: '70%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  badge: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  closeBtn: { padding: 4 },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FAFAFA',
  },
  tabActive: {
    backgroundColor: ACCENT_COLOR,
    borderColor: ACCENT_COLOR,
  },
  list: { maxHeight: 220 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    gap: 12,
  },
  itemUnread: { backgroundColor: '#FDF2E3' },
  itemRead: { backgroundColor: '#FAFAFA' },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContent: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  itemTitle: { fontSize: 13, fontWeight: '600', color: '#333', flex: 1, marginRight: 6 },
  itemTitleRead: { fontWeight: '400', color: '#999' },
  itemBody: { fontSize: 12, color: '#666', lineHeight: 16 },
  itemBodyRead: { color: '#BBB' },
  itemTime: { fontSize: 10, color: '#AAA', marginTop: 3 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ACCENT_COLOR,
  },
  centered: { height: 120, justifyContent: 'center', alignItems: 'center', gap: 8 },
  emptyText: { color: '#AAA', fontSize: 13 },
  errorText: { color: '#E53935', fontSize: 12 },
});
