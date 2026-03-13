import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { ChevronLeft, Bell, User, Menu, CheckCircle2, Users, ChevronRight } from 'lucide-react-native';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { CreatePostModal } from '../../social/components/CreatePostModal';
import { useAuthStore } from '../../auth/store/auth.store';
import { useLogout } from '../../auth/hooks/useLogout';
import AppButton from '../../../components/AppButton';

const BACKGROUND_COLOR = '#FFF4E6';
const ACCENT_COLOR = '#EAB676';
const TEXT_COLOR = '#4A3428';

interface TaskDetailScreenProps {
  navigation: any;
  route: any;
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ navigation, route }) => {
  const { taskId } = route.params;
  const { task, loading, error, shareTask, completeTask, refetch } = useTaskDetail(taskId);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const user = useAuthStore((state) => state.data);
  const { logout } = useLogout();

  const [postContent, setPostContent] = useState('');
  const [postImages, setPostImages] = useState<string[]>([]);

  const handleShareToFamily = () => {
    setPostContent(prefilledContent);
    setShowCreatePost(true);
  };

  const handlePostSuccess = async (finalContent: string, imageUrls: string[]) => {
    setIsSharing(true);
    try {
      await shareTask(finalContent, imageUrls);
      Alert.alert('Success', 'Task shared to family space!');
      await refetch();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to update task status');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCompleteTask = () => {
    Alert.alert(
      'Complete Task',
      'Are you sure you want to mark this task as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: async () => {
            try {
              await completeTask();
              Alert.alert('Success', 'Task completed!');
              await refetch();
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to complete task');
            }
          },
        },
      ]
    );
  };

  // AC024.11: Check if task is assigned to current user
  const isAssignedToUser = task?.assignee?.userId === user?.id;
  
  // AC024.1, AC024.12: Show Share button only if PENDING and assigned to user
  const showShareButton = task?.status === 'PENDING' && isAssignedToUser;
  
  // AC024.10, AC024.12: Show Complete button only if SHARED and assigned to user
  const showCompleteButton = task?.status === 'SHARED' && isAssignedToUser;

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={ACCENT_COLOR} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ChevronLeft size={28} color="#333" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image source={require('../../../assets/icon.png')} style={styles.logoIcon} />
              <Text style={styles.headerTitle}>Love Task Details</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity>
              <Bell size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
            <TouchableOpacity>
              <User size={24} color={ACCENT_COLOR} style={styles.headerIconGap} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Menu size={24} color={ACCENT_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Task not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const prefilledContent = `💕 I just completed a love task from ${task.sender.fullName}: ${task.title}`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeft size={28} color="#333" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Image source={require('../../../assets/icon.png')} style={styles.logoIcon} />
            <Text style={styles.headerTitle}>Love Task Details</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Bell size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <User size={24} color={ACCENT_COLOR} style={styles.headerIconGap} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Menu size={24} color={ACCENT_COLOR} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Match Card */}
        <View style={styles.matchCard}>
          <View style={styles.profileInfo}>
            {task.sender.avatarUrl ? (
              <Image source={{ uri: task.sender.avatarUrl }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={24} color="#999" />
              </View>
            )}
            <Text style={styles.roleLabel}>From:</Text>
            <Text style={styles.roleName}>{task.sender.fullName}</Text>
          </View>

          <Text style={styles.heartIcon}>💖</Text>

          <View style={styles.profileInfo}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={24} color="#999" />
              </View>
            )}
            <Text style={styles.roleLabel}>For:</Text>
            <Text style={styles.roleName}>Me</Text>
          </View>
        </View>

        {/* Task Detail Card */}
        <View style={styles.mainCard}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.taskDesc}>{task.description}</Text>
          
          {task.status === 'COMPLETED' && (
            <View style={styles.completeBadge}>
              <CheckCircle2 size={16} color="#4CAF50" />
              <Text style={styles.completeText}>Complete</Text>
            </View>
          )}
          
          {task.status === 'SHARED' && (
            <View style={[styles.completeBadge, { backgroundColor: '#FCE4EC' }]}>
              <Text style={[styles.completeText, { color: '#C2185B' }]}>Shared</Text>
            </View>
          )}
          
          {task.status === 'PENDING' && (
            <View style={[styles.completeBadge, { backgroundColor: '#FFF3E0' }]}>
              <Text style={[styles.completeText, { color: '#EF6C00' }]}>Pending</Text>
            </View>
          )}
        </View>

        {/* Love Message Section */}
        {task.status === 'COMPLETED' && task.loveMessage && (
          <View style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Text>💗</Text>
              <Text style={styles.messageTitle}>Love Message from {task.sender.fullName}</Text>
            </View>
            <Text style={styles.messageBody}>{task.loveMessage}</Text>
          </View>
        )}

        {/* Reminder for Pending Tasks */}
        {task.status === 'PENDING' && isAssignedToUser && (
          <View style={styles.reminderCard}>
            <Text style={styles.reminderText}>
              💡 Share this task to the family space before completing it!
            </Text>
          </View>
        )}

        {/* Action Buttons */}
        {showShareButton && (
          <TouchableOpacity
            style={[styles.actionButton, isSharing && styles.actionButtonDisabled]}
            onPress={handleShareToFamily}
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.actionButtonText}>Share To Family Space</Text>
            )}
          </TouchableOpacity>
        )}

        {showCompleteButton && (
          <TouchableOpacity style={styles.completeButton} onPress={handleCompleteTask}>
            <CheckCircle2 size={24} color="white" />
            <Text style={[styles.completeButtonText, { marginLeft: 10 }]}>Complete Love Task</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {showCreatePost && (
        <CreatePostModal
          visible={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSuccess={handlePostSuccess}
          user={user}
          prefilledContent={prefilledContent}
        />
      )}

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
                    navigation.navigate('ViewListFamily');
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
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND_COLOR },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', marginLeft: 1 },
  logoIcon: { width: 40, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#000' },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  headerIconGap: { marginHorizontal: 15 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#E53935',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: ACCENT_COLOR,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  container: { padding: 20, paddingBottom: 40 },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: { alignItems: 'center' },
  avatarLarge: { width: 50, height: 50, borderRadius: 25, marginBottom: 5 },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleLabel: { fontSize: 10, color: '#888' },
  roleName: { fontSize: 12, fontWeight: 'bold', color: TEXT_COLOR },
  heartIcon: { fontSize: 30 },
  mainCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 25,
    borderWidth: 1,
    borderColor: '#FFDAB9',
  },
  taskTitle: { fontSize: 18, fontWeight: 'bold', color: ACCENT_COLOR },
  divider: {
    height: 1,
    backgroundColor: '#FFDAB9',
    marginVertical: 12,
  },
  taskDesc: { color: '#666', lineHeight: 20, marginBottom: 15 },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  completeText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontSize: 13,
    fontWeight: '500',
  },
  messageCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFDAB9',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  messageTitle: {
    color: ACCENT_COLOR,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  messageBody: {
    color: ACCENT_COLOR,
    opacity: 0.8,
    fontStyle: 'italic',
  },
  reminderCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },
  reminderText: {
    color: '#EF6C00',
    textAlign: 'center',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 25,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  completeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
});

export default TaskDetailScreen;