import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Heart, MessageCircle, X } from 'lucide-react-native';
import { Post } from '../types';
import { getDefaultAvatar } from '../utils/avatar';

interface PostCardProps {
  post: Post;
}

const ACCENT_COLOR = '#D4A056';
const MAX_PREVIEW_LENGTH = 150;

export default function PostCard({ post }: PostCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);

  const needsExpansion = post.content.length > MAX_PREVIEW_LENGTH;
  const displayContent = expanded || !needsExpansion 
    ? post.content 
    : post.content.substring(0, MAX_PREVIEW_LENGTH) + '...';

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: post.author_avatar || getDefaultAvatar(post.author_name) }} 
            style={styles.avatar}
            defaultSource={require('../../../assets/icon.png')}
          />
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author_name}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(post.created_at)}</Text>
        </View>
      </View>

      <Text style={styles.postContent}>{displayContent}</Text>
      
      {needsExpansion && !expanded && (
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <Text style={styles.seeMore}>See more</Text>
        </TouchableOpacity>
      )}

      {post.images && post.images.length > 0 && (
        <TouchableOpacity onPress={() => setFullScreenImage(post.images[0].image_url)}>
          <Image 
            source={{ uri: post.images[0].image_url }} 
            style={styles.postImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      <View style={styles.postFooter}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Heart size={18} color={ACCENT_COLOR} fill={ACCENT_COLOR} />
            <Text style={styles.statText}>{post.reaction_count}</Text>
          </View>
          <View style={styles.stat}>
            <MessageCircle size={18} color={ACCENT_COLOR} />
            <Text style={styles.statText}>{post.comment_count}</Text>
          </View>
        </View>
      </View>

      <Modal
        visible={fullScreenImage !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFullScreenImage(null)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setFullScreenImage(null)}
          >
            <X size={30} color="white" />
          </TouchableOpacity>
          {fullScreenImage && (
            <Image 
              source={{ uri: fullScreenImage }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  postCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 15,
    padding: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: 45,
    height: 45,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  seeMore: {
    color: ACCENT_COLOR,
    fontWeight: '600',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  postFooter: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
});
