import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  FlatList,
} from 'react-native';
import { Send, History, Mic } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useChatStore } from '../store/chat.store';
import ChatSidebar from '../components/ChatSidebar';
import MessageBubble from '../components/MessageBubble';
import MentionDropdown from '../components/MentionDropdown';
import SuggestionCard from '../components/SuggestionCard';
import TypingIndicator from '../components/TypingIndicator';
import { suggestionService } from '../../suggestion';
import { FamilyMember } from '../types';
import { useTranslation } from 'react-i18next';
import { AppScreen, AppText } from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

const SuggestionChips = React.memo(
  ({
    suggestions,
    onSelect,
  }: {
    suggestions: string[];
    onSelect: (s: string) => void;
  }) => {
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
              activeOpacity={0.7}
            >
              <AppText variant="captionMedium" color="brand">
                {suggestion}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
);

export default function ChatScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
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
    lastUserMessage,
  } = useChatStore();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      useChatStore.setState({
        currentSessionId: null,
        messages: [],
        error: null,
      });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const lastAiMessageContent = messages.find((m) => m.id === activeStreamingId)?.content;

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
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.isAi && lastMsg.suggestions?.length) {
      clearSuggestions(lastMsg.id);
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
          params: { id: response.suggestionId },
        });
      } else {
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
  const showSuggestions =
    lastMessage &&
    lastMessage.isAi &&
    !isStreaming &&
    lastMessage.suggestions &&
    lastMessage.suggestions.length > 0;

  // Compute dynamic keyboard offset based on platform and tab bar
  const keyboardOffset = Platform.OS === 'ios' ? 80 : 0;

  return (
    <AppScreen edges={['top']} backgroundColor={colors.surface}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={keyboardOffset}
        style={styles.keyboardRoot}
      >
        {/* Modern Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <AppText variant="heading3" color="primary" style={styles.headerTitle}>
            {t('chat.familyChat')}
          </AppText>
          <TouchableOpacity
            onPress={() => setIsSidebarVisible(true)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.historyButton}
          >
            <History size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages.filter(
            (m) => !(m.isAi && m.content === '' && m.id === activeStreamingId)
          )}
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
          ListHeaderComponent={() =>
            messages.length === 0 && !isLoadingMessages ? (
              <View style={styles.welcomeContainer}>
                <AppText variant="heading2" color="brand" align="center" style={styles.welcomeTitle}>
                  {t('chat.welcomeTitle')}
                </AppText>
                <AppText variant="bodySmall" color="secondary" align="center" style={styles.welcomeSubtitle}>
                  {t('chat.welcomeSubtitle')}
                </AppText>
              </View>
            ) : null
          }
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

        {/* Mention Auto-complete Dropdown */}
        {showMentionDropdown && (
          <MentionDropdown
            visible={showMentionDropdown}
            onSelect={handleMentionSelect}
            onClose={() => setShowMentionDropdown(false)}
            searchText={mentionSearchText}
          />
        )}

        {/* Modern Chat Composer Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.voiceButton}
            disabled={isStreaming}
            activeOpacity={0.7}
          >
            <Mic size={20} color={isStreaming ? colors.textMuted : colors.primary} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder={t('chat.typeMessage')}
            placeholderTextColor={colors.textPlaceholder}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            editable={!isStreaming}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isStreaming) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isStreaming}
            activeOpacity={0.8}
          >
            <Send size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Suggestion Card Confirmation Sheet */}
      <SuggestionCard
        visible={!!pendingSuggestion}
        metadata={pendingSuggestion}
        onConfirm={handleConfirmSuggestion}
        onIgnore={() => setPendingSuggestion(null)}
      />

      {/* History Sidebar Drawer */}
      <ChatSidebar
        isVisible={isSidebarVisible}
        onClose={() => setIsSidebarVisible(false)}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  keyboardRoot: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  historyButton: {
    padding: spacing.xs,
  },
  messageList: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messageListContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  welcomeContainer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  welcomeTitle: {
    marginBottom: spacing.xs,
  },
  welcomeSubtitle: {
    maxWidth: 280,
  },
  footerComponent: {
    paddingBottom: spacing.xs,
  },
  typingIndicatorFooter: {
    marginBottom: spacing.xs,
  },
  suggestionsWrapper: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  suggestionsContent: {
    paddingHorizontal: spacing.xs,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  suggestionChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.borderMedium,
    ...shadows.sm,
    marginRight: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: spacing.sm,
  },
  voiceButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.textPlaceholder,
    opacity: 0.5,
  },
});
