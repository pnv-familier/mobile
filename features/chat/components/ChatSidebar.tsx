import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { MessageSquare, Plus, ChevronRight, X } from 'lucide-react-native';
import { useChatStore } from '../store/chat.store';

interface ChatSidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';

export default function ChatSidebar({ isVisible, onClose }: ChatSidebarProps) {
  const { sessions, fetchSessions, selectSession, startNewSession, currentSessionId, isSessionsLoading } = useChatStore();

  useEffect(() => {
    if (isVisible) {
      fetchSessions();
    }
  }, [isVisible]);

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    onClose();
  };

  const handleNewChat = () => {
    startNewSession();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sidebarSheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Chat History</Text>
                <TouchableOpacity onPress={onClose}>
                  <X size={24} color="#666" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.newChatBtn} onPress={handleNewChat}>
                <Plus size={20} color="#FFF" />
                <Text style={styles.newChatText}>New Conversation</Text>
              </TouchableOpacity>

              <ScrollView style={styles.sessionList} showsVerticalScrollIndicator={false}>
                {sessions.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No previous chats yet.</Text>
                  </View>
                ) : (
                  sessions.map((session) => (
                    <TouchableOpacity
                      key={session.id}
                      style={[
                        styles.sessionItem,
                        currentSessionId === session.id && styles.activeSessionItem
                      ]}
                      onPress={() => handleSelectSession(session.id)}
                    >
                      <View style={styles.sessionIconBox}>
                        <MessageSquare size={18} color={ACCENT_COLOR} />
                      </View>
                      <View style={styles.sessionContent}>
                        <Text 
                          style={styles.sessionTitle}
                          numberOfLines={1}
                        >
                          {session.target_context || 'New Chat'}
                        </Text>
                        <Text style={styles.sessionDate}>
                          {new Date(session.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <ChevronRight size={18} color="#CCC" />
                    </TouchableOpacity>
                  ))
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sidebarSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    height: '70%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  newChatBtn: {
    flexDirection: 'row',
    backgroundColor: ACCENT_COLOR,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  newChatText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
  sessionList: {
    flex: 1,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FDF2E3',
    borderRadius: 15,
    marginBottom: 10,
  },
  activeSessionItem: {
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  sessionIconBox: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginRight: 15,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  sessionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
});
