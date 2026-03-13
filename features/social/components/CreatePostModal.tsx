import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { X, Image as ImageIcon, Video as VideoIcon } from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage, uploadVideo } from '../services/upload.service';
import { createPost } from '../services/post.service';
import { getDefaultAvatar } from '../../../utils/avatar';

const ACCENT_COLOR = '#D4A056';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (content: string, imageUrls: string[]) => void;
  user: any;
  prefilledContent?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  visible,
  onClose,
  onSuccess,
  user,
  prefilledContent,
}) => {
  const [postContent, setPostContent] = useState(prefilledContent || '');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [createError, setCreateError] = useState('');

  React.useEffect(() => {
    if (visible && prefilledContent) {
      setPostContent(prefilledContent);
    }
  }, [visible, prefilledContent]);

  const handleClose = () => {
    if (!isPosting) {
      setPostContent(prefilledContent || '');
      setSelectedMedia([]);
      setMediaType(null);
      setCreateError('');
      onClose();
    }
  };

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedMedia(result.assets.map((asset) => asset.uri));
      setMediaType('image');
    }
  };

  const handleSelectVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedMedia([result.assets[0].uri]);
      setMediaType('video');
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = selectedMedia.filter((_, i) => i !== index);
    setSelectedMedia(newMedia);
    if (newMedia.length === 0) setMediaType(null);
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && selectedMedia.length === 0) return;

    setIsPosting(true);
    setCreateError('');

    try {
      let imageUrls: string[] = [];
      let videoUrls: string[] = [];

      if (selectedMedia.length > 0) {
        if (mediaType === 'image') {
          for (const uri of selectedMedia) {
            const uploadedUrl = await uploadImage(uri);
            if (uploadedUrl) imageUrls.push(uploadedUrl);
          }
        } else if (mediaType === 'video') {
          const uploadedUrl = await uploadVideo(selectedMedia[0]);
          if (uploadedUrl) videoUrls.push(uploadedUrl);
        }
      }

      const finalContent = postContent.trim() || ' ';
      await createPost(finalContent, imageUrls, videoUrls);
      
      setPostContent('');
      setSelectedMedia([]);
      setMediaType(null);
      onSuccess(finalContent, imageUrls);
      onClose();
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || 'Failed to create post. Please try again.';
      setCreateError(errorMsg);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {isPosting ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator size="large" color={ACCENT_COLOR} />
                  <Text style={styles.uploadingText}>Posting...</Text>
                  <Text style={styles.uploadingSubtext}>Please wait</Text>
                </View>
              ) : (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Create a post</Text>
                    <TouchableOpacity onPress={handleClose}>
                      <X size={24} color="#333" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalBody}>
                    <View style={styles.avatarContainer}>
                      <Image
                        source={{ uri: user?.avatarUrl || getDefaultAvatar(user?.fullName) }}
                        style={styles.avatar}
                        defaultSource={require('../../../assets/icon.png')}
                      />
                    </View>
                    <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="What's on your mind?"
                    placeholderTextColor="#999"
                    multiline
                    value={postContent}
                    onChangeText={setPostContent}
                  />

                  {selectedMedia.length > 0 && (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScroll}>
                      {selectedMedia.map((uri, index) => (
                        <View key={index} style={styles.mediaContainer}>
                          {mediaType === 'video' ? (
                            <View style={styles.mediaPreview}>
                              <VideoView
                                style={styles.mediaPreview}
                                player={useVideoPlayer(uri, (player) => player.pause())}
                                nativeControls={false}
                              />
                            </View>
                          ) : (
                            <Image source={{ uri }} style={styles.mediaPreview} resizeMode="cover" />
                          )}
                          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveMedia(index)}>
                            <X size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </ScrollView>
                  )}

                  {createError && <Text style={styles.errorText}>{createError}</Text>}

                  <View style={styles.divider} />

                  <View style={styles.footer}>
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
                        styles.postButton,
                        (!postContent.trim() && selectedMedia.length === 0) && styles.postButtonDisabled,
                      ]}
                      onPress={handleCreatePost}
                      disabled={!postContent.trim() && selectedMedia.length === 0}
                    >
                      <Text style={styles.postButtonText}>Post</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  uploadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  uploadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  uploadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    fontSize: 16,
    color: '#333',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  mediaScroll: {
    marginBottom: 16,
  },
  mediaContainer: {
    marginRight: 12,
    position: 'relative',
  },
  mediaPreview: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 14,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerActionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  postButton: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  postButtonDisabled: {
    backgroundColor: '#CCC',
  },
  postButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
