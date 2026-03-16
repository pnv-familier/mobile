import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { X, Calendar, CheckCircle, Lightbulb, Sun } from 'lucide-react-native';

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

  const getDisplayContent = () => {
    const type = metadata.type;
    
    if (type === 'EVENT') {
      return {
        title: metadata.title || 'Event',
        description: metadata.location 
          ? `${metadata.startTime} - ${metadata.endTime} at ${metadata.location}`
          : `${metadata.startTime} - ${metadata.endTime}`
      };
    } else if (type === 'TASK') {
      return {
        title: metadata.title || 'Task',
        description: metadata.description || ''
      };
    } else if (type === 'OFFLINE') {
      return {
        title: 'Offline Suggestion',
        description: metadata.action || ''
      };
    }
    
    return {
      title: 'Suggestion',
      description: ''
    };
  };
  
  const { title, description } = getDisplayContent();
  
  const getTypeTag = () => {
    const type = metadata.type || '';
    
    if (type === 'TASK') {
      return { 
        Icon: CheckCircle, 
        label: 'Care Task', 
        color: '#F7D6EA', 
        textColor: '#C05299',
        iconColor: '#C05299'
      };
    } else if (type === 'EVENT') {
      return { 
        Icon: Calendar, 
        label: 'Event', 
        color: '#E3F2FD', 
        textColor: '#1976D2',
        iconColor: '#1976D2'
      };
    } else if (type === 'OFFLINE') {
      return { 
        Icon: Lightbulb, 
        label: 'Offline Action', 
        color: '#FFF3E0', 
        textColor: '#F57C00',
        iconColor: '#F57C00'
      };
    }
    
    return { 
      Icon: Lightbulb, 
      label: 'Suggestion', 
      color: '#FFF3E0', 
      textColor: '#F57C00',
      iconColor: '#F57C00'
    };
  };
  
  const typeTag = getTypeTag();

  const handleHide = () => {
    onIgnore();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onIgnore}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Sun size={16} color="#E4A86E" />
              <Text style={styles.headerTitle}>Suggestions for you!</Text>
            </View>
            <TouchableOpacity onPress={onIgnore}>
              <X size={18} color="#555" />
            </TouchableOpacity>
          </View>

          <View style={[styles.tag, { backgroundColor: typeTag.color }]}>
            <typeTag.Icon size={14} color={typeTag.iconColor} />
            <Text style={[styles.tagText, { color: typeTag.textColor }]}>
              {typeTag.label}
            </Text>
          </View>

          <View style={styles.messageBox}>
            <Text style={styles.messageTitle}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={handleHide}
            >
              <Text style={styles.hideText}>Hide 5min</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestButton}
              onPress={onConfirm}
            >
              <Text style={styles.suggestText}>Suggest</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 14,
    borderWidth: 2,
    borderColor: '#E4A86E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#E4A86E',
  },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  messageBox: {
    borderWidth: 2,
    borderColor: '#E4A86E',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  hideButton: {
    borderWidth: 1,
    borderColor: '#E4A86E',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  hideText: {
    color: '#E4A86E',
    fontSize: 13,
    fontWeight: '500',
  },
  suggestButton: {
    backgroundColor: '#7A4A21',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  suggestText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
});
