import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback, TextInput, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Home, Bell, User, Menu, Users, ChevronRight, Plus, X, Image as ImageIcon, Video as VideoIcon, MoreVertical, Edit2, Trash2 } from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useLogout } from '../../auth/hooks/useLogout';
import { useAuthStore } from '../../auth/store/auth.store';
import AppButton from '../../../components/AppButton';
import { usePosts } from '../hooks/usePosts';
import { useCreatePost } from '../hooks/useCreatePost';
import { useFamilyMembers } from '../../family/hooks/useFamilyMembers';
import PostCard from '../components/PostCard';
import { getDefaultAvatar } from '../utils/avatar';
import { uploadImages, uploadVideo } from '../services/post.service';
import { useFocusEffect } from '@react-navigation/native';
import { NotificationPopup } from '../../notification/components/NotificationPopup';
import { NotificationBell } from '../../notification/components/NotificationBell';
import { useNotificationStore } from '../../notification/store/notification.store';

const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';


export default function FeedScreen({ navigation, route }: { navigation: any; route: any }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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
  const { logout } = useLogout();
  const { data: user } = useAuthStore();
  const { posts, loading, error, refetch, updatePostReaction, incrementCommentCount } = usePosts();
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
      Alert.alert('Error', 'Failed to update reaction');
    } finally {
      setReactionLoading(null);
    }
  };

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to photos');
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
        setSelectedMedia(uris);
        setMediaType('image');
        setCreateError(null);
      }
    } catch (error) {
      setCreateError('Failed to pick image');
    }
  };

  const handleSelectVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to photos');
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
      setCreateError('Failed to pick video');
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
        'Discard post?',
        'Are you sure you want to discard this post?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Discard', 
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
      await createNewPost(finalContent, imageUrls, videoUrls);
      setPostContent('');
      setSelectedMedia([]);
      setMediaType(null);
      refetch();
    } catch (err: any) {
      const errorMsg = err?.message || err?.response?.data?.message || 'Failed to create post. Please try again.';
      setIsPosting(false);
      Alert.alert('Error', errorMsg);
      return;
    } finally {
      setIsPosting(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../../assets/icon.png')} style={{ width: 40, height: 40 }} />
          <Text style={styles.headerTitle}>Social Media</Text>
        </View>
        <View style={styles.headerIcons}>
          <NotificationBell onPress={() => setShowNotifications(true)} color="#D4A056" style={styles.icon} />
          <TouchableOpacity 
            accessibilityLabel='profile-options-btn'
            testID='profile-options-btn'
            onPress={() => setShowOptions(true)}
          >
            <User size={24} color={ACCENT_COLOR} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Menu size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>


      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.familyCard}>
          <View style={styles.familyIconBox}>
            <Home size={28} color="#D4A056" />
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <Text style={styles.familyTitle}>My family</Text>
            <Text style={styles.familySub}>{members.length} {members.length === 1 ? 'member' : 'members'}</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ViewListFamily')}
          >
            <Text style={styles.xemText}>View</Text>
          </TouchableOpacity>
        </View>

        {!loading && !error && posts.length > 0 && (
          <View style={styles.fabContainer}>
            <TouchableOpacity 
              style={styles.fabButton} 
              onPress={() => setShowCreatePost(true)}
            >
              <View style={styles.fabContent}>
                <Text style={styles.fabText}>Create post</Text>
                <View style={styles.fabIconCircle}>
                  <Plus size={24} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {loading || isPosting ? (
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
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.noPostContainer}>
            <Image
              source={require('../../../assets/feed-home.png')}
              style={styles.noPostImage}
              resizeMode="contain"
            />
            <Text style={styles.noPostTitle}>No posts yet</Text>
            <Text style={styles.noPostSubtitle}>
              Be the first to share a memorable moment with your family! Every post is a memory preserved forever.
            </Text>
           
            <TouchableOpacity style={styles.createPostButton} onPress={() => setShowCreatePost(true)}>
              <Plus size={20} color="white" />
              <Text style={styles.createPostButtonText}>Create first Post</Text>
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
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.createPostModalContent}>
                <>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Create a post</Text>
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
                      placeholder="What's on your mind?"
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
                        <Text style={styles.footerActionText}>Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.footerAction} onPress={handleSelectVideo}>
                        <VideoIcon size={22} color={ACCENT_COLOR} />
                        <Text style={styles.footerActionText}>Video</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.postSubmitButton, 
                          (!postContent.trim() && selectedMedia.length === 0) && styles.postSubmitButtonDisabled
                        ]}
                        onPress={handleCreatePost}
                        disabled={!postContent.trim() && selectedMedia.length === 0}
                      >
                        <Text style={styles.postSubmitButtonText}>Post</Text>
                      </TouchableOpacity>
                    </View>
                  </>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>


      <Modal
        visible={showOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOptions(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setShowOptions(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.optionSheet}>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>Family Options</Text>


                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptions(false);
                  }}
                >
                  <View style={styles.optionIconContainer}>
                    <Users size={20} color={ACCENT_COLOR} />
                  </View>
                  <Text style={styles.optionText}>View Member List</Text>
                  <ChevronRight size={20} color="#CCC" />
                </TouchableOpacity>
                <AppButton title="Logout" onPress={logout} style={{ backgroundColor: '#D4A056' }} />


                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowOptions(false)}
                >
                  <Text style={styles.cancelButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <NotificationPopup
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
    alignItems: 'center',
    marginTop: 35,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 15
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
    borderRadius: 30,
    paddingLeft: 20,
  },
  fabIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabText: {
    marginRight: 12,
    fontSize: 16,
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
    paddingVertical: 30,
    borderRadius: 15,
    marginTop: 5,
  },
  noPostImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  createPostModalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
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
    height: 50,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
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
    backgroundColor: '#FFE8CC',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  postSubmitButtonDisabled: {
    opacity: 0.5,
  },
  postSubmitButtonText: {
    color: ACCENT_COLOR,
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
  uploadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  uploadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
    marginTop: 20,
  },
  uploadingSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  optionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    marginTop: 'auto',
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#EEE',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FDF2E3',
    borderRadius: 15,
    marginBottom: 15,
  },
  optionIconContainer: {
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginRight: 15,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#999',
    fontWeight: '600',
  }
});

