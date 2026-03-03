import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, SafeAreaView, Modal, TouchableWithoutFeedback, TextInput, ActivityIndicator } from 'react-native';
import { Home, Bell, User, Menu, Users, ChevronRight, Plus, X, Image as ImageIcon, Video } from 'lucide-react-native';
import { useLogout } from '../../auth/hooks/useLogout';
import { useAuthStore } from '../../auth/store/auth.store';
import AppButton from '../../../components/AppButton';
import { usePosts } from '../hooks/usePosts';
import { useCreatePost } from '../hooks/useCreatePost';
import { useFamilyMembers } from '../../family/hooks/useFamilyMembers';
import PostCard from '../components/PostCard';
import { getDefaultAvatar } from '../utils/avatar';


const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';


export default function FeedScreen({ navigation }: { navigation: any }) {
  const [showOptions, setShowOptions] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postContent, setPostContent] = useState('');
  const { logout } = useLogout();
  const { data: user } = useAuthStore();
  const { posts, loading, error, refetch } = usePosts();
  const { create: createNewPost, loading: creating } = useCreatePost();
  const { members } = useFamilyMembers();

  const handleCreatePost = async () => {
    if (!postContent.trim()) return;
    
    try {
      await createNewPost(postContent);
      setPostContent('');
      setShowCreatePost(false);
      refetch();
    } catch (err) {
      console.error('Failed to create post:', err);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Home size={20} color="#8D5B39" />
          </View>
          <Text style={styles.headerTitle}>Social Media</Text>
        </View>
        <View style={styles.headerIcons}>
          <Bell size={24} color="#D4A056" style={styles.icon} />
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <User size={24} color="#D4A056" style={styles.icon} />
          </TouchableOpacity>
          <Menu size={24} color="#D4A056" />
        </View>
      </View>


      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
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

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ACCENT_COLOR} />
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
          posts.map((post) => <PostCard key={post.post_id} post={post} />)
        )}
      </ScrollView>


      <Modal
        visible={showCreatePost}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCreatePost(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCreatePost(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.createPostModalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Create a post</Text>
                  <TouchableOpacity onPress={() => setShowCreatePost(false)}>
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
                  placeholder="What's on your head?"
                  placeholderTextColor="#999"
                  multiline
                  value={postContent}
                  onChangeText={setPostContent}
                />


                <View style={styles.divider} />
               
                <View style={styles.modalFooter}>
                  <TouchableOpacity style={styles.footerAction}>
                    <ImageIcon size={22} color={ACCENT_COLOR} />
                    <Text style={styles.footerActionText}>Photo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.footerAction}>
                    <Video size={22} color={ACCENT_COLOR} />
                    <Text style={styles.footerActionText}>Video</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.postSubmitButton, creating && styles.postSubmitButtonDisabled]}
                    onPress={handleCreatePost}
                    disabled={creating || !postContent.trim()}
                  >
                    <Text style={styles.postSubmitButtonText}>
                      {creating ? 'Posting...' : 'Post'}
                    </Text>
                  </TouchableOpacity>
                </View>
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
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
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
                <AppButton title="Logout" onPress={logout} />


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
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#FFF',
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoBox: {
    padding: 5,
    backgroundColor: '#FDF2E3',
    borderRadius: 8
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333'
  },
  headerIcons: {
    flexDirection: 'row'
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
    justifyContent: 'center', // Thay đổi để modal nằm giữa
    alignItems: 'center',
  },
  // --- STYLES CHO MODAL TẠO BÀI VIẾT MỚI ---
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
    height: 100,
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
  // ----------------------------------------
  optionSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
    width: '100%',
    marginTop: 'auto', // Để nó nằm dưới cùng
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

