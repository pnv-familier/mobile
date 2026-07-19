import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, Dimensions, Alert } from 'react-native';
import { Heart, MessageCircle, X, MoreVertical, Trash2 } from 'lucide-react-native';
import { Post } from '../types';
import { getDefaultAvatar } from '../utils/avatar';
import { deletePost } from '../services/post.service';
import { VideoPlayer } from './VideoPlayer';
import { CommentSection } from './CommentSection';
import { formatInstantRelative } from '../../../utils/instantUtils';
import { useTranslation } from 'react-i18next';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: () => void;
  onUpdate?: () => void;
  onReaction?: (postId: number) => void;
  reactionLoading?: boolean;
  defaultShowComments?: boolean;
}

const ACCENT_COLOR = '#D4A056';
const MAX_PREVIEW_LENGTH = 150;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_MARGIN = 30;
const IMAGE_GAP = 8;

export default function PostCard({ post, currentUserId, onDelete, onUpdate, onReaction, reactionLoading, defaultShowComments = false }: PostCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(defaultShowComments);

  const videoUrl = post.videos && post.videos.length > 0 ? post.videos[0] : null;

  const isOwner = currentUserId === post.user_id;

  const needsExpansion = post.content.length > MAX_PREVIEW_LENGTH;
  const displayContent = expanded || !needsExpansion 
    ? post.content 
    : post.content.substring(0, MAX_PREVIEW_LENGTH) + '...';

  const handleDelete = () => {
    Alert.alert(
      t('social.deletePost'),
      t('social.deletePostConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(post.post_id);
              onDelete?.();
            } catch (error) {
              Alert.alert(t('common.error'), t('social.failedToDeletePost'));
            }
          }
        }
      ]
    );
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
          <Text style={styles.timestamp}>{formatInstantRelative(post.created_at, t)}</Text>
        </View>
        {isOwner && (
          <TouchableOpacity accessibilityLabel='show-post-menu-icon' testID='show-post-menu-icon' onPress={() => setShowMenu(true)} style={styles.menuButton}>
            <MoreVertical size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.postContent}>{displayContent}</Text>
      
      {needsExpansion && !expanded && (
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <Text style={styles.seeMore}>{t('social.seeMore')}</Text>
        </TouchableOpacity>
      )}

      {videoUrl && (
        <View style={styles.videoContainer}>
          <VideoPlayer videoUrl={videoUrl} />
        </View>
      )}

      {post.images && post.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {post.images.length === 1 ? (
            <TouchableOpacity onPress={() => setFullScreenImage(post.images[0].image_url)}>
              <Image 
                source={{ uri: post.images[0].image_url }} 
                style={styles.singleImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ) : post.images.length === 2 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.doubleImageScroll}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH - 60 - 12}
              snapToAlignment="start"
            >
              {post.images.map((img, idx) => (
                <TouchableOpacity 
                  key={idx}
                  onPress={() => setFullScreenImage(img.image_url)}
                  style={styles.doubleImageContainer}
                >
                  <Image 
                    source={{ uri: img.image_url }} 
                    style={styles.doubleImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.multiImageLayout}>
              <TouchableOpacity 
                style={styles.mainImageContainer} 
                onPress={() => setFullScreenImage(post.images[0].image_url)}
              >
                <Image 
                  source={{ uri: post.images[0].image_url }} 
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View 
                style={styles.thumbnailScroll}
              >
                {post.images.slice(1).map((img, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => setFullScreenImage(img.image_url)}
                    style={styles.thumbnailContainer}
                  >
                    <Image 
                      source={{ uri: img.image_url }} 
                      style={styles.thumbnailImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.postFooter}>
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={styles.stat} 
            onPress={() => onReaction?.(post.post_id)}
            disabled={reactionLoading}
            accessibilityLabel="btn_ReactionIcon"
            testID="btn_ReactionIcon"
          >
            <Heart 
              size={18} 
              color={post.user_reacted ? ACCENT_COLOR : '#999'} 
              fill={post.user_reacted ? ACCENT_COLOR : 'none'} 
            />
            <Text style={[styles.statText, post.user_reacted && { color: ACCENT_COLOR, fontWeight: '700' }]}>
              {post.reaction_count}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.stat}
            onPress={() => setShowComments(!showComments)}
            accessibilityLabel="btn_CommentIcon"
            testID="btn_CommentIcon"
          >
            <MessageCircle size={18} color={ACCENT_COLOR} />
            <Text style={styles.statText}>{post.comment_count}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showComments && (
        <CommentSection
          postId={post.post_id}
          onCommentAdded={onUpdate}
        />
      )}

      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity style={styles.menuOverlay} onPress={() => setShowMenu(false)} activeOpacity={1}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); handleDelete(); }}>
              <Trash2 size={20} color="#FF6B6B" />
              <Text style={[styles.menuText, { color: '#FF6B6B' }]}>{t('social.deletePost')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  menuButton: {
    padding: 5,
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
  videoContainer: {
    marginTop: 10,
  },
  imagesContainer: {
    marginTop: 10,
  },
  singleImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  doubleImageScroll: {
    width: '100%',
  },
  doubleImageContainer: {
    width: SCREEN_WIDTH - 60 - 20,
    marginRight: 8,
  },
  doubleImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  multiImageLayout: {
    flexDirection: 'row',
    height: 250,
    gap: 8,
  },
  mainImageContainer: {
    flex: 2,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  thumbnailScroll: {
    flex: 1,
    gap: 8,
  },
  thumbnailContainer: {
    flex: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
});
