import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { MessageCircle, Phone, X } from 'lucide-react-native';
import { UrgentSuggestion, URGENT_SUGGESTION_CONFIG } from '../types/urgent';

interface UrgentSuggestionModalProps {
  visible: boolean;
  suggestion: UrgentSuggestion | null;
  onMessage: () => void;
  onCall: () => void;
  onDismiss: () => void;
}

export const UrgentSuggestionModal: React.FC<UrgentSuggestionModalProps> = ({
  visible,
  suggestion,
  onMessage,
  onCall,
  onDismiss,
}) => {
  if (!suggestion) return null;

  const config = URGENT_SUGGESTION_CONFIG[suggestion.subType];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <X size={20} color="#999" />
          </TouchableOpacity>

          <Text style={styles.icon}>{config.icon}</Text>
          <Text style={styles.title}>AI nhận thấy {suggestion.senderName}</Text>
          <Text style={styles.subtitle}>đang {suggestion.emotion}</Text>

          {suggestion.context && (
            <View style={styles.contextBox}>
              <Text style={styles.contextText} numberOfLines={3}>
                "{suggestion.context}"
              </Text>
            </View>
          )}

          <Text style={styles.message}>{config.actionText}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.primaryBtn, { backgroundColor: config.color }]}
              onPress={onMessage}
            >
              <MessageCircle size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>Nhắn tin cho {suggestion.senderName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.secondaryBtn]}
              onPress={onCall}
            >
              <Phone size={18} color={config.color} />
              <Text style={[styles.secondaryBtnText, { color: config.color }]}>Gọi điện</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <Text style={styles.dismissText}>Bỏ qua</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  contextBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  contextText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    width: '100%',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryBtn: {
    backgroundColor: '#D4A056',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFF',
  },
  secondaryBtn: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  dismissBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  dismissText: {
    fontSize: 14,
    color: '#999',
  },
});
