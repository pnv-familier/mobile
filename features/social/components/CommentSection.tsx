import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Send } from 'lucide-react-native';
import { useComments } from '../hooks/useComments';
import { getDefaultAvatar } from '../utils/avatar';
import { useAuthStore } from '../../auth/store/auth.store';

interface CommentSectionProps {
  postId: number;
  onCommentAdded?: () => void;
}

const ACCENT_COLOR = '#D4A056';

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  onCommentAdded,
}) => {
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);
  const { comments, addComment, totalComments } = useComments(postId);
  const currentUser = useAuthStore((state) => state.data);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  const handleSubmit = async () => {
    if (!commentText.trim() || posting) return;

    setPosting(true);
    try {
      await addComment(commentText.trim());
      setCommentText('');
      onCommentAdded?.();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to post comment');
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Image
          source={{ uri: currentUser?.avatarUrl || getDefaultAvatar(currentUser?.fullName) }}
          style={styles.inputAvatar}
        />
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor="#999"
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          accessibilityLabel="send-comment-btn"
          testID="send-comment-btn"
          style={[
            styles.sendButton,
            (!commentText.trim() || posting) && styles.sendButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!commentText.trim() || posting}
        >
          {posting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Send size={18} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.commentsScrollView}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {comments.map((comment) => (
          <View key={comment.comment_id} style={styles.commentItem}>
            <Image
              source={{ uri: comment.author_avatar || getDefaultAvatar(comment.author_name) }}
              style={styles.commentAvatar}
            />
            <View style={styles.commentContent}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.author_name}</Text>
                <Text style={styles.commentTime}>{formatTimestamp(comment.created_at)}</Text>
              </View>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginRight: 6,
  },
  commentTime: {
    fontSize: 11,
    color: '#999',
  },
  commentText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
    fontSize: 13,
    color: '#333',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#CCC',
  },
  commentsScrollView: {
    maxHeight: 150,
  },
});
