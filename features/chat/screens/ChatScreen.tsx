import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList
} from 'react-native';
import { Send, History, ChevronLeft, Mic } from 'lucide-react-native';
import { useChatStore } from '../store/chat.store';
import ChatSidebar from '../components/ChatSidebar';
import MessageBubble from '../components/MessageBubble';
import MentionDropdown from '../components/MentionDropdown';
import { FamilyMember } from '../types';

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';

const SuggestionChips = ({ suggestions, onSelect }: { suggestions: string[], onSelect: (s: string) => void }) => {
  if (!suggestions || suggestions.length === 0) return null;
  return (
    <View style={styles.suggestionsWrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.suggestionsContent}
      >
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.suggestionChip} 
            onPress={() => onSelect(suggestion)}
          >
            <Text style={styles.suggestionText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default function ChatScreen({ navigation }: { navigation: any }) {
  const [inputText, setInputText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionedUser, setMentionedUser] = useState<FamilyMember | null>(null);
  const [mentionSearchText, setMentionSearchText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const { 
    messages, 
    sendMessage, 
    isLoadingMessages, 
    isStreaming, 
    error, 
    clearError,
    clearSuggestions
  } = useChatStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      useChatStore.setState({
        currentSessionId: null,
        messages: [],
        error: null
      });
    });
    
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (!isLoadingMessages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 300);
    }
  }, [isLoadingMessages]);

  useEffect(() => {
    return () => {
      if (isStreaming) {
        useChatStore.setState({ isStreaming: false });
      }
    };
  }, []);

  // Detect @ mention trigger - only allow one mention per message
  useEffect(() => {
    const lastChar = inputText[inputText.length - 1];
    const lastAtIndex = inputText.lastIndexOf('@');
    const atCount = (inputText.match(/@/g) || []).length;
    
    if (lastChar === '@' && lastAtIndex !== -1 && atCount === 1 && !mentionedUser) {
      setShowMentionDropdown(true);
      setMentionSearchText('');
    } else if (lastAtIndex !== -1 && showMentionDropdown && !mentionedUser) {
      const textAfterAt = inputText.substring(lastAtIndex + 1);
      if (textAfterAt.includes(' ')) {
        setShowMentionDropdown(false);
      } else {
        setMentionSearchText(textAfterAt);
      }
    } else if (atCount > 1 || (mentionedUser && atCount > 1)) {
      setShowMentionDropdown(false);
    }
  }, [inputText, mentionedUser]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isStreaming) return;
    
    const messageContent = inputText.trim();
    setInputText('');
    await sendMessage(messageContent, mentionedUser?.email);
    setMentionedUser(null);
    setMentionSearchText('');
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setInputText(suggestion);
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.isAi && lastMessage.suggestions?.length) {
      clearSuggestions(lastMessage.id);
    }
  };

  const handleMentionSelect = (member: FamilyMember) => {
    const lastAtIndex = inputText.lastIndexOf('@');
    if (lastAtIndex !== -1) {
      const beforeMention = inputText.substring(0, lastAtIndex);
      const afterMention = inputText.substring(inputText.length);
      setInputText(beforeMention + `@${member.fullName} ` + afterMention);
      setMentionedUser(member);
      setShowMentionDropdown(false);
      setMentionSearchText('');
    }
  };

  const lastMessage = messages[messages.length - 1];
  const showSuggestions = lastMessage && lastMessage.isAi && !isStreaming && lastMessage.suggestions && lastMessage.suggestions.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ChevronLeft size={24} color={ACCENT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Family Assistant</Text>
        <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
          <History size={24} color={ACCENT_COLOR} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        ListHeaderComponent={() => (
          messages.length === 0 && !isLoadingMessages ? (
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Hello! I'm your Family Assistant.</Text>
              <Text style={styles.welcomeSubtitle}>How can I help your family today?</Text>
            </View>
          ) : null
        )}
        ListFooterComponent={() => (
          <View>
            {isStreaming && (
              <View style={styles.streamingIndicator}>
                <Text style={styles.streamingText}>AI is typing...</Text>
              </View>
            )}
            {showSuggestions && (
              <SuggestionChips 
                suggestions={lastMessage.suggestions!} 
                onSelect={handleSelectSuggestion} 
              />
            )}
          </View>
        )}
        onLayout={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.voiceButton}
            disabled={isStreaming}
          >
            <Mic size={20} color={isStreaming ? '#CCC' : '#D4A056'} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask anything... (@ to mention)"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            editable={!isStreaming}
          />
          <TouchableOpacity 
            style={[
                styles.sendButton, 
                (!inputText.trim() || isStreaming) && styles.sendButtonDisabled
            ]} 
            onPress={handleSend}
            disabled={!inputText.trim() || isStreaming}
          >
            <Send size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {showMentionDropdown && (
        <MentionDropdown
          visible={showMentionDropdown}
          onSelect={handleMentionSelect}
          onClose={() => setShowMentionDropdown(false)}
          searchText={mentionSearchText}
        />
      )}

      <ChatSidebar 
        isVisible={isSidebarVisible} 
        onClose={() => setIsSidebarVisible(false)} 
      />
    </SafeAreaView>
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
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messageList: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  messageListContent: {
    padding: 15,
    paddingBottom: 20,
    flexGrow: 1,
  },
  welcomeContainer: {
    marginTop: 50,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#D4A056',
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8D5B39',
  },
  streamingIndicator: {
    padding: 10,
    alignItems: 'center',
  },
  streamingText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  suggestionsWrapper: {
    marginTop: 5,
    marginBottom: 10,
  },
  suggestionsContent: {
    paddingHorizontal: 5,
    gap: 10,
    flexDirection: 'row',
  },
  suggestionChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginRight: 8,
  },
  suggestionText: {
    color: ACCENT_COLOR,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
  },
  voiceButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
});
