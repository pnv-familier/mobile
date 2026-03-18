import React, { useState, useEffect, useMemo } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { chatService } from '../services/chat.service';
import { FamilyMember } from '../types';

interface MentionPickerProps {
  visible: boolean;
  onSelect: (member: FamilyMember) => void;
  onClose: () => void;
  searchText?: string;
}

export default function MentionPicker({ visible, onSelect, onClose, searchText = '' }: MentionPickerProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      fetchMembers();
    }
  }, [visible]);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await chatService.getFamilyMembersForMention();
      setMembers(data);
    } catch (err: any) {
      console.error('Failed to fetch members:', err);
      setError(err.message || 'Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  // Filter members based on search text
  const filteredMembers = useMemo(() => {
    if (!searchText.trim()) return members;
    
    const lowerSearch = searchText.toLowerCase();
    return members.filter(member =>
      member.fullName.toLowerCase().includes(lowerSearch) ||
      member.email.toLowerCase().includes(lowerSearch)
    );
  }, [members, searchText]);

  const handleSelectMember = (member: FamilyMember) => {
    onSelect(member);
    onClose();
  };

  const renderMemberItem = ({ item }: { item: FamilyMember }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => handleSelectMember(item)}
    >
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.fullName}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {searchText ? `Mention: ${searchText}` : 'Mention a family member'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#D4A056" />
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchMembers}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : filteredMembers.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {searchText ? 'No members found' : 'No family members found'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredMembers}
            renderItem={renderMemberItem}
            keyExtractor={(item) => item.email}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  memberItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  memberInfo: {
    gap: 4,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  memberEmail: {
    fontSize: 13,
    color: '#999',
  },
  errorText: {
    fontSize: 14,
    color: '#E74C3C',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#D4A056',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
