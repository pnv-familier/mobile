import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNotificationStore } from '../store/notification.store';

const ACCENT_COLOR = '#D4A056';

interface NotificationBellProps {
  onPress: () => void;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onPress,
  color = ACCENT_COLOR,
  size = 24,
  style,
}) => {
  const unreadCount = useNotificationStore(s => s.unreadCount);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Bell size={size} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
});
