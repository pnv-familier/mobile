import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { chatService } from '../services/chat.service';
import { FamilyMember } from '../types';

interface MentionDropdownProps {
  visible: boolean;
  onSelect: (member: FamilyMember) => void;
  onClose: () => void;
  searchText?: string;
}

export default function MentionDropdown({ 
  visible, 
  onSelect, 
  onClose, 
  searchText = '' 
}: MentionDropdownProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchMembers();
    }
  }, [visible]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await chatService.getFamilyMembersForMention();
      setMembers(data);
    } catch (err: any) {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = React.useMemo(() => {
    if (!searchText.trim()) return members;
    
    const lowerSearch = searchText.toLowerCase();
    return members.filter(member =>
      member.fullName.toLowerCase().includes(lowerSearch) ||
      member.email.toLowerCase().includes(lowerSearch)
    );
  }, [members, searchText]);

  const handleSelectMember = (member: FamilyMember) => {
    onSelect(member);
  };

  if (!visible) return null;

  const displayMembers = filteredMembers.slice(0, 5);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <View style={styles.dropdown}>
        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="small" color="#D4A056" />
          </View>
        ) : displayMembers.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No members found</Text>
          </View>
        ) : (
          <ScrollView 
            scrollEnabled={displayMembers.length > 5}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          >
            {displayMembers.map((member, index) => (
              <TouchableOpacity
                key={member.email}
                style={[
                  styles.memberItem,
                  index !== displayMembers.length - 1 && styles.memberItemBorder
                ]}
                onPress={() => handleSelectMember(member)}
                activeOpacity={0.6}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {member.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.memberContent}>
                  <Text style={styles.memberName} numberOfLines={1}>
                    {member.fullName}
                  </Text>
                  <Text style={styles.memberEmail} numberOfLines={1}>
                    {member.email}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: -10,
    right: -10,
    height: 1000,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  list: {
    maxHeight: 280,
  },
  centerContent: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  memberItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4A056',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFF',
  },
  memberContent: {
    flex: 1,
  },
  memberName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 11,
    color: '#999',
  },
  emptyText: {
    fontSize: 13,
    color: '#999',
  },
});
