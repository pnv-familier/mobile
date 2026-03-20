import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react-native';
import { ChatMessageDto } from '../types';
import { formatMessageTime } from '../../../utils/dateFormatter';
import FeedbackModal from './FeedbackModal';
import { feedbackService, FeedbackType } from '../services/report.service';

interface MessageBubbleProps {
  message: ChatMessageDto;
  isStreaming?: boolean;
}

const ACCENT_COLOR = '#D4A056';

const MessageBubble = memo(({ message, isStreaming = false }: MessageBubbleProps) => {
  const isAi = message.isAi === true;
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    try {
      await feedbackService.submitFeedback(FeedbackType.LIKE);
      setLiked(true);
      setDisliked(false);
    } catch (error) {
      console.error('Failed to submit like:', error);
    }
  };

  const handleDislike = async () => {
    if (disliked) return;
    try {
      await feedbackService.submitFeedback(FeedbackType.DISLIKE);
      setDisliked(true);
      setLiked(false);
    } catch (error) {
      console.error('Failed to submit dislike:', error);
    }
  };

  const handleReport = () => {
    setShowFeedbackModal(true);
  };

  const handleConfirmReport = async (reason: string) => {
    try {
      await feedbackService.submitFeedback(FeedbackType.REPORT, reason);
    } catch (error) {
      console.error('Failed to report message:', error);
    }
  };

  return (
    <>
      <View
        style={[
          styles.messageBubble,
          isAi ? styles.aiBubble : styles.userBubble
        ]}
      >
      <View style={styles.messageContentWrapper}>
        {isAi ? (
          <Markdown style={markdownStyles}>
            {message.content}
          </Markdown>
        ) : (
          <Text style={styles.userMessageText}>
            {message.content}
          </Text>
        )}
      </View>
      <View style={styles.footer}>
        <Text style={[
          styles.timestamp,
          isAi ? styles.aiTimestamp : styles.userTimestamp
        ]}>
          {formatMessageTime(message.timestamp)}
        </Text>
        {isAi && (
          <View style={styles.feedbackButtons}>
            <TouchableOpacity onPress={handleLike} style={styles.feedbackButton}>
              <ThumbsUp 
                size={14} 
                color={liked ? '#D4A056' : 'rgba(0,0,0,0.3)'}
                fill={liked ? '#D4A056' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDislike} style={styles.feedbackButton}>
              <ThumbsDown 
                size={14} 
                color={disliked ? '#D4A056' : 'rgba(0,0,0,0.3)'}
                fill={disliked ? '#D4A056' : 'transparent'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleReport} style={styles.feedbackButton}>
              <Flag size={12} color="rgba(0,0,0,0.3)" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      </View>

      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onConfirm={handleConfirmReport}
      />
    </>
  );
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id && 
         prevProps.message.content === nextProps.message.content &&
         prevProps.message.suggestions === nextProps.message.suggestions &&
         prevProps.isStreaming === nextProps.isStreaming;
});

const markdownStyles: any = {
  body: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  strong: {
    fontWeight: 'bold',
    color: '#000',
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet_list_icon: {
    color: ACCENT_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    lineHeight: 24,
  },
  ordered_list_icon: {
    color: ACCENT_COLOR,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    lineHeight: 24,
  },
  bullet_list_content: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  ordered_list_content: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  code_inline: {
    backgroundColor: '#F5F5F5',
    color: '#C0392B',
    borderRadius: 4,
    paddingHorizontal: 5,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  code_block: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fence: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  link: {
    color: ACCENT_COLOR,
    textDecorationLine: 'underline',
  },
  heading1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    lineHeight: 28,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 10,
    lineHeight: 26,
  },
};

const styles = StyleSheet.create({
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 15,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: ACCENT_COLOR,
    borderBottomRightRadius: 5,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  messageContentWrapper: {
    flexDirection: 'column',
  },
  userMessageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#FFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  timestamp: {
    fontSize: 10,
  },
  aiTimestamp: {
    color: 'rgba(0,0,0,0.4)',
  },
  userTimestamp: {
    color: 'rgba(255,255,255,0.7)',
    alignSelf: 'flex-end',
    width: '100%',
    textAlign: 'right',
  },
  feedbackButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  feedbackButton: {
    padding: 4,
  },
});

export default React.memo(MessageBubble, (prev, next) => {
  return prev.message.id === next.message.id && 
         prev.message.content === next.message.content &&
         prev.message.suggestions === next.message.suggestions &&
         prev.isStreaming === next.isStreaming;
});
