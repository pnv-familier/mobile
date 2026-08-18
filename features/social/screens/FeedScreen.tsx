import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Home, ChevronRight, X, Image as ImageIcon, Video as VideoIcon, Plus } from 'lucide-react-native';
import { useAuthStore } from '../../auth/store/auth.store';
import { usePosts } from '../hooks/usePosts';
import { useCreatePost } from '../hooks/useCreatePost';
import { useFamilyMembers } from '../../family/hooks/useFamilyMembers';
import PostCard from '../components/PostCard';
import { getDefaultAvatar } from '../utils/avatar';
import { uploadImages, uploadVideo } from '../services/post.service';
import { useFocusEffect } from '@react-navigation/native';
import { useNotificationStore } from '../../notification/store/notification.store';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppButton,
  AppLoader,
  AppError,
  EmptyState,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

export default function FeedScreen({ navigation, route }: { navigation: any; route: any }) {
  const { t } = useTranslation();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [openCommentPostId, setOpenCommentPostId] = useState<number | null>(null);
  const scrollViewRef = useRef<any>(null);
  const postRefs = useRef<{ [key: number]: any }>({});
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [reactionLoading, setReactionLoading] = useState<number | null>(null);
  const { data: user } = useAuthStore();
  const { posts, loading, error, refetch, addNewPost, updatePostReaction, incrementCommentCount } = usePosts();
  const { create: createNewPost, loading: creating } = useCreatePost();
  const { members } = useFamilyMembers();
  const openPostId = useNotificationStore((s) => s.openPostId);
  const setOpenPostId = useNotificationStore((s) => s.setOpenPostId);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );

  useEffect(() => {
    if (!openPostId) return;
    const postId = Number(openPostId);
    setOpenCommentPostId(postId);
    refetch().then(() => {
      setTimeout(() => {
        postRefs.current[postId]?.measureLayout(
          scrollViewRef.current,
          (_x: number, y: number) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          },
          () => {}
        );
        setOpenPostId(null);
      }, 800);
    });
  }, [openPostId]);

  const handleReaction = async (postId: number) => {
    setReactionLoading(postId);
    try {
      await updatePostReaction(postId);
    } catch (err) {
      Alert.alert(t('common.error'), t('social.failedToUpload'));
    } finally {
      setReactionLoading(null);
    }
  };

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('social.failedToUpload'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        allowsMultipleSelection: true,
        quality: 0.5,
      });

      if (!result.canceled && result.assets.length > 0) {
        const uris = result.assets.map((asset) => asset.uri);
        if (mediaType === 'image') {
          setSelectedMedia((prev) => [...prev, ...uris]);
        } else {
          setSelectedMedia(uris);
          setMediaType('image');
        }
        setCreateError(null);
      }
    } catch (error) {
      setCreateError(t('social.failedToUpload'));
    }
  };

  const handleSelectVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('social.failedToUpload'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],
        allowsEditing: false,
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedMedia([result.assets[0].uri]);
        setMediaType('video');
        setCreateError(null);
      }
    } catch (error) {
      setCreateError(t('social.failedToUpload'));
    }
  };

  const handleRemoveMedia = (index?: number) => {
    if (index !== undefined) {
      setSelectedMedia((prev) => prev.filter((_, i) => i !== index));
    } else {
      setSelectedMedia([]);
      setMediaType(null);
    }
  };

  const handleCloseModal = () => {
    if (postContent.trim() || selectedMedia.length > 0) {
      Alert.alert(
        t('social.discardPost'),
        t('social.discardPostConfirm'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('social.discard'),
            style: 'destructive',
            onPress: () => {
              setPostContent('');
              setSelectedMedia([]);
              setMediaType(null);
              setCreateError(null);
              setShowCreatePost(false);
            },
          },
        ]
      );
    } else {
      setShowCreatePost(false);
    }
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedMedia.length === 0) return;

    setShowCreatePost(false);
    setIsPosting(true);

    try {
      setCreateError(null);
      let imageUrls: string[] = [];

      if (selectedMedia.length > 0) {
        if (mediaType === 'video') {
          const videoFile = {
            uri: selectedMedia[0],
            type: 'video/mp4',
            fileName: 'video.mp4',
          };
          try {
            const uploadResult = await uploadVideo(videoFile);
            imageUrls = [uploadResult.data];
          } catch (uploadErr) {
            throw new Error('Failed to upload video. Please try a smaller video.');
          }
        } else {
          const localFiles = selectedMedia.filter((uri) => !uri.startsWith('http'));
          const remoteUrls = selectedMedia.filter((uri) => uri.startsWith('http'));

          if (localFiles.length > 0) {
            const files = localFiles.map((uri) => ({
              uri,
              type: 'image/jpeg',
              fileName: 'image.jpg',
            }));
            const uploadResult = await uploadImages(files);
            imageUrls = [...remoteUrls, ...uploadResult.data];
          } else {
            imageUrls = remoteUrls;
          }
        }
      }

      const finalContent = postContent.trim() || ' ';
      let videoUrls: string[] = [];
      if (mediaType === 'video') {
        videoUrls = imageUrls;
        imageUrls = [];
      }
      const newPost = await createNewPost(finalContent, imageUrls, videoUrls);

      addNewPost(newPost);

      setPostContent('');
      setSelectedMedia([]);
      setMediaType(null);
    } catch (err: any) {
      const errorMsg =
        err?.message || err?.response?.data?.message || t('social.failedToCreatePost');
      setIsPosting(false);
      Alert.alert(t('common.error'), errorMsg);
      return;
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('social.socialMedia')} navigation={navigation} />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Sleek Top Family Strip */}
        <TouchableOpacity
          style={styles.familyBar}
          onPress={() => navigation.navigate('ViewListFamily')}
          activeOpacity={0.7}
        >
          <View style={styles.familyBarLeft}>
            <View style={styles.familyIconDot}>
              <Home size={14} color={colors.primary} />
            </View>
            <AppText variant="bodySmallBold" color="primary">
              {t('family.myFamily')}
            </AppText>
            <AppText variant="caption" color="muted" style={styles.memberDot}>
              • {members.length} {members.length === 1 ? t('family.member') : t('family.members')}
            </AppText>
          </View>
          <View style={styles.viewBadge}>
            <AppText variant="captionMedium" color="brand">
              {t('family.view')}
            </AppText>
            <ChevronRight size={14} color={colors.primary} />
          </View>
        </TouchableOpacity>

        {/* Modern Quick Composer Box */}
        <TouchableOpacity
          style={styles.composerCard}
          onPress={() => setShowCreatePost(true)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: user?.avatarUrl || getDefaultAvatar(user?.fullName) }}
            style={styles.composerAvatar}
            defaultSource={require('../../../assets/icon.png')}
          />
          <View style={styles.composerInputPill}>
            <AppText variant="bodySmall" color="muted">
              {t('social.whatsOnYourMind')}
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.composerMediaBtn}
            onPress={() => {
              setShowCreatePost(true);
            }}
          >
            <ImageIcon size={18} color={colors.primary} />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Posting Progress Indicator */}
        {isPosting && (
          <View style={styles.postingIndicator}>
            <ActivityIndicator size="small" color={colors.primary} />
            <AppText variant="captionMedium" color="brand" style={styles.postingText}>
              {t('social.posting')}
            </AppText>
          </View>
        )}

        {/* Feed Content States */}
        {loading ? (
          <AppLoader message={isPosting ? 'Posting...' : undefined} style={styles.stateContainer} />
        ) : error ? (
          <View style={styles.stateWrapper}>
            <AppError message={error} onRetry={refetch} retryTitle={t('common.retry')} />
          </View>
        ) : posts.length === 0 ? (
          <EmptyState
            image={require('../../../assets/feed-home.png')}
            title={t('social.noPostsYet')}
            description={t('social.noPostsDesc')}
            actionTitle={t('social.createFirstPost')}
            onActionPress={() => setShowCreatePost(true)}
            style={styles.emptyContainer}
          />
        ) : (
          posts.map((post) => (
            <View
              key={post.post_id}
              ref={(ref) => {
                postRefs.current[post.post_id] = ref;
              }}
            >
              <PostCard
                post={post}
                currentUserId={user?.id}
                onDelete={refetch}
                onUpdate={() => incrementCommentCount(post.post_id)}
                onReaction={handleReaction}
                reactionLoading={reactionLoading === post.post_id}
                defaultShowComments={openCommentPostId === post.post_id}
              />
            </View>
          ))
        )}
      </ScrollView>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardAvoidingView}
          >
            <TouchableWithoutFeedback onPress={handleCloseModal}>
              <View style={styles.modalTouchableArea} />
            </TouchableWithoutFeedback>
            <View style={styles.createPostModalContent}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.modalHeader}>
                  <AppText variant="heading3" color="primary">
                    {t('social.createPost')}
                  </AppText>
                  <TouchableOpacity
                    onPress={handleCloseModal}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalBody}>
                  <Image
                    source={{ uri: user?.avatarUrl || getDefaultAvatar(user?.fullName) }}
                    style={styles.modalAvatar}
                    defaultSource={require('../../../assets/icon.png')}
                  />
                  <AppText variant="bodySmallBold" color="primary">
                    {user?.fullName || 'User'}
                  </AppText>
                </View>

                <TextInput
                  style={styles.modalInput}
                  placeholder={t('social.whatsOnYourMind')}
                  placeholderTextColor={colors.textPlaceholder}
                  multiline
                  value={postContent}
                  onChangeText={setPostContent}
                  autoFocus
                />

                {selectedMedia.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.mediaScrollContainer}
                  >
                    {selectedMedia.map((uri, index) => (
                      <View key={index} style={styles.mediaPreviewContainer}>
                        <Image
                          source={{ uri }}
                          style={styles.mediaPreview}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={styles.removeMediaButton}
                          onPress={() => handleRemoveMedia(index)}
                        >
                          <X size={12} color={colors.textLight} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {createError && (
                  <AppText variant="caption" color="error" style={styles.errorMessage}>
                    {createError}
                  </AppText>
                )}

                <View style={styles.divider} />

                <View style={styles.modalFooter}>
                  <View style={styles.mediaActionsRow}>
                    <TouchableOpacity style={styles.footerAction} onPress={handleSelectImage}>
                      <ImageIcon size={18} color={colors.primary} />
                      <AppText variant="captionMedium" color="primary" style={styles.footerActionText}>
                        {t('social.photo')}
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.footerAction} onPress={handleSelectVideo}>
                      <VideoIcon size={18} color={colors.primary} />
                      <AppText variant="captionMedium" color="primary" style={styles.footerActionText}>
                        {t('social.video')}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                  <AppButton
                    title={t('social.post')}
                    size="sm"
                    onPress={handleCreatePost}
                    disabled={!postContent.trim() && selectedMedia.length === 0}
                    style={styles.postSubmitButton}
                  />
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  familyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  familyBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  familyIconDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  memberDot: {
    marginLeft: spacing.xs,
  },
  viewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  composerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  composerAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceSecondary,
  },
  composerInputPill: {
    flex: 1,
    marginHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.full,
  },
  composerMediaBtn: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.primarySoft,
  },
  postingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postingText: {
    marginLeft: spacing.sm,
  },
  stateContainer: {
    paddingVertical: spacing.xxl,
  },
  stateWrapper: {
    marginHorizontal: spacing.md,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: spacing.xl,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTouchableArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  createPostModalContent: {
    width: '92%',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    maxHeight: '80%',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  modalAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surfaceSecondary,
  },
  modalInput: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    textAlignVertical: 'top',
    minHeight: 90,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaActionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  footerActionText: {
    marginLeft: 2,
  },
  postSubmitButton: {
    minWidth: 80,
  },
  mediaScrollContainer: {
    marginBottom: spacing.sm,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: spacing.sm,
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
  },
  removeMediaButton: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.overlay,
    borderRadius: radius.full,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    marginBottom: spacing.xs,
  },
});
