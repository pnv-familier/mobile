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
  ActivityIndicator,
  Alert
} from 'react-native';
import { Send, History, ChevronLeft } from 'lucide-react-native';
import { useChatStore } from '../store/chat.store';
import ChatSidebar from '../components/ChatSidebar';
import MessageBubble from '../components/MessageBubble';

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';

export default function ChatScreen({ navigation }: { navigation: any }) {
  const [inputText, setInputText] = useState('');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const { 
    messages, 
    sendMessage, 
    isLoadingMessages, 
    isStreaming, 
    error, 
    clearError,
  } = useChatStore();

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: clearError }]);
    }
  }, [error]);

  const handleSend = async () => {
    if (inputText.trim() === '' || isStreaming) return;
    
    const messageContent = inputText.trim();
    setInputText('');
    await sendMessage(messageContent);
  };

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

      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 && !isLoadingMessages && (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Hello! I'm your Family Assistant.</Text>
            <Text style={styles.welcomeSubtitle}>How can I help your family today?</Text>
          </View>
        )}

        {isLoadingMessages ? (
          <ActivityIndicator size="large" color={ACCENT_COLOR} style={{ marginTop: 20 }} />
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isStreaming && (
            <View style={styles.streamingIndicator}>
                <Text style={styles.streamingText}>AI is typing...</Text>
            </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything..."
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
  inputContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#FFF',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
});
