import React, { useEffect, useRef, useState } from 'react';
import { Animated, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Bell } from 'lucide-react-native';
import { Audio } from 'expo-av';

const ACCENT_COLOR = '#D4A056';
const BANNER_DURATION = 3000;

interface BannerData {
  title: string;
  body: string;
  time?: string;
}

interface InAppNotificationBannerProps {
  notification: BannerData | null;
  onPress?: () => void;
  onDismiss?: () => void;
}

export const InAppNotificationBanner: React.FC<InAppNotificationBannerProps> = ({
  notification,
  onPress,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [current, setCurrent] = useState<BannerData | null>(null);
  const queue = useRef<BannerData[]>([]);
  const isShowing = useRef<boolean>(false);

  const playSound = async () => {
    try {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: false, staysActiveInBackground: false });
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/notification-message.mp3'),
        { shouldPlay: true, volume: 1.0 }
      );
      sound.setOnPlaybackStatusUpdate(status => {
        if ('didJustFinish' in status && status.didJustFinish) sound.unloadAsync();
      });
    } catch {}
  };

  const showNext = () => {
    if (queue.current.length === 0) {
      isShowing.current = false;
      return;
    }
    const next = queue.current.shift()!;
    isShowing.current = true;
    setCurrent(next);
    playSound();

    // Slide down nhanh
    translateY.setValue(-120);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => dismiss(), 2000);
  };

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, {
      toValue: -120,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrent(null);
      onDismiss?.();
      setTimeout(() => showNext(), 50);
    });
  };

  useEffect(() => {
    if (!notification) return;
    queue.current.push(notification);
    if (!isShowing.current) showNext();
    else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => dismiss(), 400);
    }
  }, [notification]);

  if (!current) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        style={styles.banner}
        onPress={() => { dismiss(); onPress?.(); }}
        activeOpacity={0.95}
      >
        <View style={styles.iconBox}>
          <Bell size={20} color={ACCENT_COLOR} />
        </View>
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{current.title}</Text>
            <Text style={styles.time}>{current.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</Text>
          </View>
          <Text style={styles.body} numberOfLines={2}>{current.body}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    paddingHorizontal: 12,
    paddingTop: 50,
  },
  banner: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderLeftWidth: 4,
    borderLeftColor: ACCENT_COLOR,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDF2E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333', flex: 1, marginRight: 8 },
  time: { fontSize: 10, color: '#AAA' },
  body: { fontSize: 12, color: '#666', lineHeight: 16 },
});
