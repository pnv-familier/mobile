import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Check, X } from 'lucide-react-native';

interface SuggestionCardProps {
  visible: boolean;
  metadata: any;
  onConfirm: () => void;
  onIgnore: () => void;
}

export default function SuggestionCard({
  visible,
  metadata,
  onConfirm,
  onIgnore,
}: SuggestionCardProps) {
  if (!visible || !metadata) return null;

  const title = metadata.title || 'Suggestion';
  const description = metadata.description || 'Do you want to proceed?';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onIgnore}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.ignoreButton]}
              onPress={onIgnore}
            >
              <X size={18} color="#999" />
              <Text style={styles.ignoreText}>Ignore</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
            >
              <Check size={18} color="#FFF" />
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  ignoreButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  ignoreText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  confirmButton: {
    backgroundColor: '#D4A056',
  },
  confirmText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFF',
  },
});
