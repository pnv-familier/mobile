import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { UrgentSuggestion, URGENT_SUGGESTION_CONFIG } from '../types/urgent';

interface UrgentSuggestionBannerProps {
  suggestion: UrgentSuggestion | null;
  onPress: () => void;
  onDismiss: () => void;
}

const BANNER_DURATION = 8000;

export const UrgentSuggestionBanner: React.FC<UrgentSuggestionBannerProps> = ({
  suggestion,
  onPress,
  onDismiss,
}) => {
  const translateY = useRef(new Animated.Value(-120)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    Animated.timing(translateY, {
      toValue: -120,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  useEffect(() => {
    if (!suggestion) return;

    translateY.setValue(-120);
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();

    timerRef.current = setTimeout(() => {
      dismiss();
    }, BANNER_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [suggestion]);

  if (!suggestion) return null;

  const config = URGENT_SUGGESTION_CONFIG[suggestion.subType];

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        style={[styles.banner, { borderLeftColor: config.color }]}
        onPress={() => {
          dismiss();
          onPress();
        }}
        activeOpacity={0.95}
      >
        <Text style={styles.icon}>{config.icon}</Text>
        <View style={styles.content}>
          <Text style={styles.text} numberOfLines={1}>
            {suggestion.senderName} đang {suggestion.emotion}
          </Text>
        </View>
        <View style={[styles.actionBtn, { backgroundColor: config.color }]}>
          <Text style={styles.actionText}>Nhắn tin</Text>
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
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
    borderLeftWidth: 4,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  actionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
