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
import SuggestionCard from '../components/SuggestionCard';
import TypingIndicator from '../components/TypingIndicator';
import { suggestionService } from '../../suggestion';
import { FamilyMember } from '../types';
import { useTranslation } from 'react-i18next';

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';

const SuggestionChips = React.memo(({ suggestions, onSelect }: { suggestions: string[], onSelect: (s: string) => void }) => {
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
});

export default function ChatScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [showMentionDropdown, setShowMentionDropdown] = useState(false);
  const [mentionedUser, setMentionedUser] = useState<FamilyMember | null>(null);
  const [mentionSearchText, setMentionSearchText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const scrollTimeoutRef = useRef<any>(null);
  
  const { 
    messages, 
    sendMessage, 
    isLoadingMessages, 
    isStreaming, 
    activeStreamingId,
    error, 
    clearError,
    clearSuggestions,
    pendingSuggestion,
    setPendingSuggestion,
    currentSessionId,
    lastUserMessage
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
      Alert.alert(t('common.error'), error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const lastAiMessageContent = messages.find(m => m.id === activeStreamingId)?.content;

  useEffect(() => {
    if (isStreaming && lastAiMessageContent) {
      if (!scrollTimeoutRef.current) {
        scrollTimeoutRef.current = setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
          scrollTimeoutRef.current = null;
        }, 100);
      }
    }
  }, [lastAiMessageContent, isStreaming]);

  useEffect(() => {
    if (!isLoadingMessages && messages.length > 0) {
      const timer = setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoadingMessages, currentSessionId]);

  useEffect(() => {
    return () => {
      if (isStreaming) {
        useChatStore.setState({ isStreaming: false, activeStreamingId: null });
      }
    };
  }, [isStreaming]);

  // Detect @ mention trigger - only allow one mention per message
  useEffect(() => {
    const lastChar = inputText[inputText.length - 1];
    const lastAtIndex = inputText.lastIndexOf('@');
    const atCount = (inputText.match(/@/g) || []).length;
    
    // If @ is deleted, hide dropdown and reset mentioned user
    if (!inputText.includes('@')) {
      setShowMentionDropdown(false);
      setMentionSearchText('');
      if (mentionedUser) {
        setMentionedUser(null);
      }
      return;
    }
    
    // Only show dropdown if: typing @, and only 1 @
    if (lastChar === '@' && lastAtIndex !== -1 && atCount === 1) {
      setShowMentionDropdown(true);
      setMentionSearchText('');
    } else if (lastAtIndex !== -1 && showMentionDropdown) {
      const textAfterAt = inputText.substring(lastAtIndex + 1);
      // Hide if space after @ or multiple @
      if (textAfterAt.includes(' ') || atCount > 1) {
        setShowMentionDropdown(false);
      } else {
        setMentionSearchText(textAfterAt);
      }
    }
  }, [inputText]);



  const handleSend = async () => {
    if (inputText.trim() === '' || isStreaming) return;
    
    const messageContent = inputText.trim();
    setInputText('');
    setShowMentionDropdown(false);
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

  const handleConfirmSuggestion = async () => {
    if (!pendingSuggestion || !currentSessionId || !lastUserMessage) return;
    
    try {
      const response = await suggestionService.confirmSuggestion(
        pendingSuggestion,
        currentSessionId,
        lastUserMessage
      );
      
      // Close modal first
      setPendingSuggestion(null);
      
      // Navigate to suggestion detail if success
      if (response.success && response.suggestionId) {
        navigation.navigate('Suggestions', {
          screen: 'SuggestionDetail',
          params: { id: response.suggestionId }
        });
      } else {
        // Show error if backend returns success: false
        Alert.alert('Error', response.message || 'Failed to confirm suggestion');
      }
    } catch (err: any) {
      console.error('Error confirming suggestion:', err);
      Alert.alert('Error', err?.message || 'Failed to confirm suggestion');
      setPendingSuggestion(null);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.headerTitle}>{t('chat.familyChat')}</Text>
          <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
            <History size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages.filter(m => !(m.isAi && m.content === '' && m.id === activeStreamingId))}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          onContentSizeChange={() => {
            if (isStreaming || messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: isStreaming });
            }
          }}
          renderItem={({ item }) => (
            <MessageBubble 
              message={item} 
              isStreaming={isStreaming && item.id === activeStreamingId}
            />
          )}
          style={styles.messageList}
          contentContainerStyle={styles.messageListContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          ListHeaderComponent={() => (
            messages.length === 0 && !isLoadingMessages ? (
              <View style={styles.welcomeContainer}>
                <Text style={styles.welcomeTitle}>{t('chat.welcomeTitle')}</Text>
                <Text style={styles.welcomeSubtitle}>{t('chat.welcomeSubtitle')}</Text>
              </View>
            ) : null
          )}
          ListFooterComponent={() => (
            <View style={styles.footerComponent}>
              {isStreaming && (
                <View style={styles.typingIndicatorFooter}>
                  <TypingIndicator />
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
        />

        {showMentionDropdown && (
          <MentionDropdown
            visible={showMentionDropdown}
            onSelect={handleMentionSelect}
            onClose={() => setShowMentionDropdown(false)}
            searchText={mentionSearchText}
          />
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.voiceButton}
            disabled={isStreaming}
          >
            <Mic size={20} color={isStreaming ? '#CCC' : '#D4A056'} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder={t('chat.typeMessage')}
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

      <SuggestionCard
        visible={!!pendingSuggestion}
        metadata={pendingSuggestion}
        onConfirm={handleConfirmSuggestion}
        onIgnore={() => setPendingSuggestion(null)}
      />

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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
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
  footerComponent: {
    paddingBottom: 10,
  },
  typingIndicatorFooter: {
    marginBottom: 5,
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
    width: 40,
    height: 40,
    borderRadius: 22,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
});
