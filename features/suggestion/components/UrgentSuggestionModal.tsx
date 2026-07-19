import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
  Share,
} from 'react-native';
import { MessageCircle, Phone, X } from 'lucide-react-native';
import { UrgentSuggestion, URGENT_SUGGESTION_CONFIG } from '../types/urgent';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

interface UrgentSuggestionModalProps {
  visible: boolean;
  suggestion: UrgentSuggestion | null;
  onDismiss: () => void;
}

export const UrgentSuggestionModal: React.FC<UrgentSuggestionModalProps> = ({
  visible,
  suggestion,
  onDismiss,
}) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  if (!suggestion) return null;

  const config = URGENT_SUGGESTION_CONFIG[suggestion.subType];

  const handleMessage = async () => {
    try {
      const message = `Message to ${suggestion.senderName}`;
      await Share.share({ message });
    } catch (error) {
      // User cancelled
    }
  };

  const handleCall = async () => {
    const phone = suggestion.senderPhone;
    
    if (!phone) {
      Alert.alert(t('suggestions.noPhoneNumber'), t('suggestions.noPhoneNumberDesc'));
      return;
    }

    try {
      await Linking.openURL(`tel:${phone}`);
    } catch (error) {
      Alert.alert(t('suggestions.cannotOpenApp'), t('suggestions.cannotOpenAppDesc'));
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeBtn} onPress={onDismiss}>
            <X size={20} color="#999" />
          </TouchableOpacity>

          <View style={[styles.iconCircle, { backgroundColor: config.color + '15' }]}>
            <Text style={styles.icon}>{config.icon}</Text>
          </View>
          <Text style={styles.title}>{t('suggestions.aiDetected')} {suggestion.senderName}</Text>
          <Text style={styles.subtitle}>{t('suggestions.isFeeling')} {suggestion.emotion}</Text>

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
              style={[styles.actionBtn, styles.primaryBtn]}
              onPress={handleMessage}
            >
              <MessageCircle size={18} color="#FFF" />
              <Text style={styles.primaryBtnText}>{t('suggestions.messageTo')} {suggestion.senderName}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.secondaryBtn]}
              onPress={handleCall}
            >
              <Phone size={18} color="#D4A056" />
              <Text style={[styles.secondaryBtnText]}>{t('suggestions.call')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
              <Text style={styles.dismissText}>{t('suggestions.dismiss')}</Text>
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
    backgroundColor: '#FFF4E6',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5D6B5',
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 10,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3428',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 16,
  },
  contextBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F5D6B5',
  },
  contextText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  message: {
    fontSize: 14,
    color: '#8B7355',
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
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#D4A056',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D4A056',
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
