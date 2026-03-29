import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback, TextInput, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Home, Plus, X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react-native';
import { useAuthStore } from '../../auth/store/auth.store';
import { usePosts } from '../hooks/usePosts';
import { useCreatePost } from '../hooks/useCreatePost';
import { useFamilyMembers } from '../../family/hooks/useFamilyMembers';
import PostCard from '../components/PostCard';
import { getDefaultAvatar } from '../utils/avatar';
import { uploadImages, uploadVideo } from '../services/post.service';
import { useFocusEffect } from '@react-navigation/native';
import { useNotificationStore } from '../../notification/store/notification.store';
import { AppHeader } from '../../../components/AppHeader';
import { useTranslation } from 'react-i18next';

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';


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
  const openPostId = useNotificationStore(s => s.openPostId);
  const setOpenPostId = useNotificationStore(s => s.setOpenPostId);

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
        const uris = result.assets.map(asset => asset.uri);
        if (mediaType === 'image') {
          setSelectedMedia(prev => [...prev, ...uris]);
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
      setSelectedMedia(prev => prev.filter((_, i) => i !== index));
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
            }
          }
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
          const localFiles = selectedMedia.filter(uri => !uri.startsWith('http'));
          const remoteUrls = selectedMedia.filter(uri => uri.startsWith('http'));
          
          if (localFiles.length > 0) {
            const files = localFiles.map(uri => ({
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
      const errorMsg = err?.message || err?.response?.data?.message || t('social.failedToCreatePost');
      setIsPosting(false);
      Alert.alert(t('common.error'), errorMsg);
      return;
    } finally {
      setIsPosting(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={t('social.socialMedia')} navigation={navigation} />


      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.familyCard}>
          <View style={styles.familyIconBox}>
            <Home size={28} color="#D4A056" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.familyTitle}>{t('family.myFamily')}</Text>
            <Text style={styles.familySub}>{members.length} {members.length === 1 ? t('family.member') : t('family.members')}</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ViewListFamily')}
          >
            <Text style={styles.xemText}>{t('family.view')}</Text>
          </TouchableOpacity>
        </View>

        {!loading && !error && posts.length > 0 && (
          <View style={styles.fabContainer}>
            <TouchableOpacity 
              style={styles.fabButton} 
              onPress={() => setShowCreatePost(true)}
            >
              <View style={styles.fabContent}>
                <Text style={styles.fabText}>{t('social.createPost')}</Text>
                <View style={styles.fabIconCircle}>
                  <Plus size={20} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {isPosting && (
          <View style={styles.postingIndicator}>
            <ActivityIndicator size="small" color={ACCENT_COLOR} />
            <Text style={styles.postingText}>{t('social.posting')}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ACCENT_COLOR} />
            {isPosting && <Text style={styles.loadingText}>Posting...</Text>}
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={refetch}
            >
              <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
            </TouchableOpacity>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.noPostContainer}>
            <Image
              source={require('../../../assets/feed-home.png')}
              style={styles.noPostImage}
              resizeMode="contain"
            />
            <Text style={styles.noPostTitle}>{t('social.noPostsYet')}</Text>
            <Text style={styles.noPostSubtitle}>
              {t('social.noPostsDesc')}
            </Text>
           
            <TouchableOpacity style={styles.createPostButton} onPress={() => setShowCreatePost(true)}>
              <Plus size={20} color="white" />
              <Text style={styles.createPostButtonText}>{t('social.createFirstPost')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          posts.map((post) => (
            <View key={post.post_id} ref={ref => { postRefs.current[post.post_id] = ref; }}>
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
                  <Text style={styles.modalTitle}>{t('social.createPost')}</Text>
                  <TouchableOpacity onPress={handleCloseModal}>
                    <X size={24} color="#333" />
                  </TouchableOpacity>
                </View>
               
                <View style={styles.modalBody}>
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: user?.avatarUrl || getDefaultAvatar(user?.fullName) }}
                      style={styles.modalAvatar}
                      defaultSource={require('../../../assets/icon.png')}
                    />
                  </View>
                  <Text style={styles.modalUserName}>{user?.fullName || 'User'}</Text>
                </View>


                <TextInput
                  style={styles.modalInput}
                  placeholder={t('social.whatsOnYourMind')}
                  placeholderTextColor="#999"
                  multiline
                  value={postContent}
                  onChangeText={setPostContent}
                />

                {selectedMedia.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScrollContainer}>
                    {selectedMedia.map((uri, index) => (
                      <View key={index} style={styles.mediaPreviewContainer}>
                        {mediaType === 'video' ? (
                          <Image 
                            source={{ uri }} 
                            style={styles.mediaPreview}
                            resizeMode="cover"
                          />
                        ) : (
                          <Image 
                            source={{ uri }} 
                            style={styles.mediaPreview}
                            resizeMode="cover"
                          />
                        )}
                        <TouchableOpacity 
                          style={styles.removeMediaButton} 
                          onPress={() => handleRemoveMedia(index)}
                        >
                          <X size={16} color="white" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </ScrollView>
                )}

                {createError && (
                  <Text style={styles.errorMessage}>{createError}</Text>
                )}

                <View style={styles.divider} />
               
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.footerAction} onPress={handleSelectImage}>
                    <ImageIcon size={22} color={ACCENT_COLOR} />
                    <Text style={styles.footerActionText}>{t('social.photo')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerAction} onPress={handleSelectVideo}>
                    <VideoIcon size={22} color={ACCENT_COLOR} />
                    <Text style={styles.footerActionText}>{t('social.video')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[
                      styles.postSubmitButton, 
                      (!postContent.trim() && selectedMedia.length === 0) && styles.postSubmitButtonDisabled
                    ]}
                    onPress={handleCreatePost}
                    disabled={!postContent.trim() && selectedMedia.length === 0}
                  >
                    <Text style={styles.postSubmitButtonText}>{t('social.post')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  postingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    marginBottom: 15,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: ACCENT_COLOR,
  },
  postingText: {
    marginLeft: 10,
    fontSize: 14,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  familyCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  fabContainer: {
    alignItems: 'flex-end',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  fabButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingLeft: 14,
  },
  fabIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    marginRight: 10,
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
  },
  familyIconBox: {
    backgroundColor: '#FDF2E3',
    padding: 10,
    borderRadius: 10
  },
  familyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A056'
  },
  familySub: {
    color: '#999',
    fontSize: 12
  },
  xemText: {
    color: '#D4A056',
    fontWeight: '500'
  },
  noPostContainer: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 5,
  },
  noPostImage: {
    width: 180,
    height: 180,
    marginBottom: 15,
  },
  noPostTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noPostSubtitle: {
    fontSize: 10,
    color: '#cbc8c8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
  },
  createPostButton: {
    flexDirection: 'row',
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  createPostButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4A056',
  },
  modalBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
    marginRight: 12,
  },
  modalAvatar: {
    width: 40,
    height: 40,
  },
  modalUserName: {
    fontWeight: '600',
    fontSize: 16,
  },
  modalInput: {
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 15,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerActionText: {
    marginLeft: 8,
    fontWeight: '500',
    color: '#333',
  },
  postSubmitButton: {
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  postSubmitButtonDisabled: {
    opacity: 0.5,
  },
  postSubmitButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  mediaScrollContainer: {
    marginBottom: 15,
  },
  mediaPreviewContainer: {
    position: 'relative',
    marginRight: 10,
  },
  mediaPreview: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
  },
  removeMediaButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: '#FF6B6B',
    fontSize: 14,
    marginBottom: 10,
  },
});

