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
import { colors, spacing, radius, typography, shadows } from '../../../theme';

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  onDelete?: () => void;
  onUpdate?: () => void;
  onReaction?: (postId: number) => void;
  reactionLoading?: boolean;
  defaultShowComments?: boolean;
}

const MAX_PREVIEW_LENGTH = 150;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PostCard({
  post,
  currentUserId,
  onDelete,
  onUpdate,
  onReaction,
  reactionLoading,
  defaultShowComments = false,
}: PostCardProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showComments, setShowComments] = useState(defaultShowComments);

  const videoUrl = post.videos && post.videos.length > 0 ? post.videos[0] : null;
  const isOwner = currentUserId === post.user_id;

  const needsExpansion = post.content.length > MAX_PREVIEW_LENGTH;
  const displayContent =
    expanded || !needsExpansion
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
          },
        },
      ]
    );
  };

  return (
    <View style={styles.postCard}>
      {/* Header: Author + Timestamp + Menu */}
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
          <TouchableOpacity
            accessibilityLabel="show-post-menu-icon"
            testID="show-post-menu-icon"
            onPress={() => setShowMenu(true)}
            style={styles.menuButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <MoreVertical size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Post Text Content */}
      <Text style={styles.postContent}>{displayContent}</Text>

      {needsExpansion && !expanded && (
        <TouchableOpacity onPress={() => setExpanded(true)}>
          <Text style={styles.seeMore}>{t('social.seeMore')}</Text>
        </TouchableOpacity>
      )}

      {/* Video Content */}
      {videoUrl && (
        <View style={styles.videoContainer}>
          <VideoPlayer videoUrl={videoUrl} />
        </View>
      )}

      {/* Image Content */}
      {post.images && post.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {post.images.length === 1 ? (
            <TouchableOpacity onPress={() => setFullScreenImage(post.images[0].image_url)} activeOpacity={0.9}>
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
              snapToInterval={SCREEN_WIDTH - 48}
              snapToAlignment="start"
            >
              {post.images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setFullScreenImage(img.image_url)}
                  style={styles.doubleImageContainer}
                  activeOpacity={0.9}
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
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: post.images[0].image_url }}
                  style={styles.mainImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View style={styles.thumbnailScroll}>
                {post.images.slice(1).map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setFullScreenImage(img.image_url)}
                    style={styles.thumbnailContainer}
                    activeOpacity={0.9}
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

      {/* Footer: Reactions & Comments */}
      <View style={styles.postFooter}>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={[styles.statButton, post.user_reacted && styles.statButtonActive]}
            onPress={() => onReaction?.(post.post_id)}
            disabled={reactionLoading}
            accessibilityLabel="btn_ReactionIcon"
            testID="btn_ReactionIcon"
            activeOpacity={0.7}
          >
            <Heart
              size={16}
              color={post.user_reacted ? colors.love : colors.textMuted}
              fill={post.user_reacted ? colors.love : 'none'}
            />
            <Text
              style={[
                styles.statText,
                post.user_reacted && { color: colors.love, fontWeight: '600' },
              ]}
            >
              {post.reaction_count}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statButton}
            onPress={() => setShowComments(!showComments)}
            accessibilityLabel="btn_CommentIcon"
            testID="btn_CommentIcon"
            activeOpacity={0.7}
          >
            <MessageCircle size={16} color={colors.textSecondary} />
            <Text style={styles.statText}>{post.comment_count}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Comment Section */}
      {showComments && (
        <CommentSection postId={post.post_id} onCommentAdded={onUpdate} />
      )}

      {/* Post Actions Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                handleDelete();
              }}
            >
              <Trash2 size={18} color={colors.error} />
              <Text style={[styles.menuText, { color: colors.error }]}>
                {t('social.deletePost')}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Fullscreen Image Modal */}
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
            <X size={26} color="#FFFFFF" />
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
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm + 2,
  },
  avatarContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceSecondary,
    overflow: 'hidden',
    marginRight: spacing.sm + 2,
  },
  avatar: {
    width: 38,
    height: 38,
  },
  authorInfo: {
    flex: 1,
  },
  menuButton: {
    padding: spacing.xs,
  },
  authorName: {
    ...typography.bodySmallBold,
    color: colors.textPrimary,
  },
  timestamp: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
  postContent: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  seeMore: {
    ...typography.captionBold,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  videoContainer: {
    marginTop: spacing.sm,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  imagesContainer: {
    marginTop: spacing.sm,
  },
  singleImage: {
    width: '100%',
    height: 230,
    borderRadius: radius.md,
  },
  doubleImageScroll: {
    width: '100%',
  },
  doubleImageContainer: {
    width: SCREEN_WIDTH - 64,
    marginRight: spacing.sm,
  },
  doubleImage: {
    width: '100%',
    height: 230,
    borderRadius: radius.md,
  },
  multiImageLayout: {
    flexDirection: 'row',
    height: 230,
    gap: spacing.xs + 2,
  },
  mainImageContainer: {
    flex: 2,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.md,
  },
  thumbnailScroll: {
    flex: 1,
    gap: spacing.xs + 2,
  },
  thumbnailContainer: {
    flex: 1,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    borderRadius: radius.sm,
  },
  postFooter: {
    marginTop: spacing.sm + 2,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  statButtonActive: {
    backgroundColor: colors.loveSoft,
  },
  statText: {
    ...typography.captionMedium,
    color: colors.textSecondary,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xs,
    minWidth: 180,
    ...shadows.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  menuText: {
    ...typography.bodySmallBold,
  },
});
