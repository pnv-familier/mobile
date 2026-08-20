import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { CheckCircle2, Users, ChevronRight, User, Heart, Sparkles, Share2 } from 'lucide-react-native';
import { useTaskDetail } from '../hooks/useTaskDetail';
import { CreatePostModal } from '../../social/components/CreatePostModal';
import { useAuthStore } from '../../auth/store/auth.store';
import { useLogout } from '../../auth/hooks/useLogout';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppButton,
  AppLoader,
  AppError,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

interface TaskDetailScreenProps {
  navigation: any;
  route: any;
}

const TaskDetailScreen: React.FC<TaskDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { taskId } = route.params;
  const { task, loading, error, shareTask, completeTask, refetch } = useTaskDetail(taskId);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const user = useAuthStore((state) => state.data);
  const { logout } = useLogout();

  const [postContent, setPostContent] = useState('');

  const prefilledContent = task
    ? `💕 I just completed a love task from ${task.sender.fullName}: ${task.title}`
    : '';

  const handleShareToFamily = () => {
    setPostContent(prefilledContent);
    setShowCreatePost(true);
  };

  const handlePostSuccess = async (finalContent: string, imageUrls: string[]) => {
    setIsSharing(true);
    try {
      await shareTask(finalContent, imageUrls);
      Alert.alert(t('common.success'), 'Task shared to family space!');
      await refetch();
    } catch (err: any) {
      Alert.alert(t('common.error'), err?.message || 'Failed to update task status');
    } finally {
      setIsSharing(false);
    }
  };

  const handleCompleteTask = () => {
    Alert.alert(
      t('loveTasks.markAsComplete'),
      'Are you sure you want to mark this task as completed?',
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('loveTasks.completed'),
          onPress: async () => {
            setIsCompleting(true);
            try {
              await completeTask();
              Alert.alert(t('common.success'), 'Task completed!');
              await refetch();
            } catch (err: any) {
              Alert.alert(t('common.error'), err?.message || 'Failed to complete task');
            } finally {
              setIsCompleting(false);
            }
          },
        },
      ]
    );
  };

  // Check if task is assigned to current user
  const isAssignedToUser = task?.assignee?.userId === user?.id;

  // Show Share button only if PENDING and assigned to user
  const showShareButton = task?.status === 'PENDING' && isAssignedToUser;

  // Show Complete button only if SHARED and assigned to user
  const showCompleteButton = task?.status === 'SHARED' && isAssignedToUser;

  if (loading) {
    return (
      <AppScreen edges={['top']} backgroundColor={colors.background}>
        <AppHeader title={t('loveTasks.loveTasks')} navigation={navigation} />
        <AppLoader style={styles.centerContainer} />
      </AppScreen>
    );
  }

  if (error || !task) {
    return (
      <AppScreen edges={['top']} backgroundColor={colors.background}>
        <AppHeader title={t('loveTasks.loveTasks')} navigation={navigation} />
        <View style={styles.centerContainer}>
          <AppError
            message={error || 'Task not found'}
            onRetry={refetch}
            retryTitle={t('common.retry')}
          />
        </View>
      </AppScreen>
    );
  }

  const getStatusBadge = () => {
    switch (task.status) {
      case 'COMPLETED':
        return {
          bg: colors.successSoft,
          text: colors.successText,
          label: t('loveTasks.completed'),
          icon: <CheckCircle2 size={13} color={colors.successText} style={styles.badgeIcon} />,
        };
      case 'SHARED':
        return {
          bg: colors.loveSoft,
          text: colors.loveText,
          label: t('loveTasks.shared'),
          icon: <Share2 size={13} color={colors.loveText} style={styles.badgeIcon} />,
        };
      case 'PENDING':
      default:
        return {
          bg: colors.warningSoft,
          text: colors.warningText,
          label: t('loveTasks.pending'),
          icon: <Sparkles size={13} color={colors.warningText} style={styles.badgeIcon} />,
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader
        title={t('loveTasks.loveTasks')}
        navigation={navigation}
        onUserPress={() => setShowOptions(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Connection Match Card */}
        <View style={styles.matchCard}>
          {/* Sender Column */}
          <View style={styles.profileColumn}>
            {task.sender.avatarUrl ? (
              <Image source={{ uri: task.sender.avatarUrl }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={20} color={colors.textMuted} />
              </View>
            )}
            <AppText variant="tiny" color="muted">
              {t('loveTasks.from')}
            </AppText>
            <AppText variant="captionBold" color="primary" numberOfLines={1}>
              {task.sender.fullName}
            </AppText>
          </View>

          {/* Connected Heart Icon */}
          <View style={styles.heartConnector}>
            <Heart size={24} color={colors.love} fill={colors.love} />
          </View>

          {/* Assignee / Me Column */}
          <View style={styles.profileColumn}>
            {user?.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarLarge} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={20} color={colors.textMuted} />
              </View>
            )}
            <AppText variant="tiny" color="muted">
              {t('loveTasks.to')}
            </AppText>
            <AppText variant="captionBold" color="primary" numberOfLines={1}>
              {task.assignee?.fullName || user?.fullName || 'Me'}
            </AppText>
          </View>
        </View>

        {/* Task Detail Card */}
        <View style={styles.mainCard}>
          <View style={styles.mainCardHeader}>
            <AppText variant="heading3" color="primary" style={styles.taskTitle}>
              {task.title}
            </AppText>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.bg }]}>
              {statusBadge.icon}
              <AppText variant="tiny" style={[styles.statusText, { color: statusBadge.text }]}>
                {statusBadge.label}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <AppText variant="bodySmall" color="secondary" style={styles.taskDesc}>
            {task.description}
          </AppText>
        </View>

        {/* Love Message Section (if Completed) */}
        {task.status === 'COMPLETED' && task.loveMessage && (
          <View style={styles.messageCard}>
            <View style={styles.messageHeader}>
              <Heart size={16} color={colors.love} fill={colors.love} />
              <AppText variant="captionBold" color="primary">
                {t('loveTasks.loveMessage')} {t('loveTasks.from')} {task.sender.fullName}
              </AppText>
            </View>
            <AppText variant="bodySmall" color="secondary" style={styles.messageBody}>
              "{task.loveMessage}"
            </AppText>
          </View>
        )}

        {/* Reminder for Pending Tasks */}
        {task.status === 'PENDING' && isAssignedToUser && (
          <View style={styles.reminderCard}>
            <AppText variant="captionMedium" color="warning" align="center">
              💡 Share this task to the family space before completing it!
            </AppText>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Action CTA */}
      {(showShareButton || showCompleteButton) && (
        <View style={styles.bottomFooter}>
          {showShareButton && (
            <AppButton
              title="Share to Family"
              variant="primary"
              size="md"
              icon={<Share2 size={16} color={colors.textLight} />}
              onPress={handleShareToFamily}
              loading={isSharing}
              disabled={isSharing}
              style={styles.actionBtn}
            />
          )}

          {showCompleteButton && (
            <AppButton
              title={t('loveTasks.markAsComplete')}
              variant="primary"
              size="md"
              icon={<CheckCircle2 size={18} color={colors.textLight} />}
              onPress={handleCompleteTask}
              loading={isCompleting}
              disabled={isCompleting}
              style={styles.completeBtn}
            />
          )}
        </View>
      )}

      {/* Social Post Modal for sharing love task to family space */}
      {showCreatePost && (
        <CreatePostModal
          visible={showCreatePost}
          onClose={() => setShowCreatePost(false)}
          onSuccess={handlePostSuccess}
          user={user}
          prefilledContent={prefilledContent}
          skipCreatePost={true}
        />
      )}

      {/* Options Modal */}
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
                <AppText variant="captionBold" color="muted" align="center" style={styles.sheetTitle}>
                  Family Options
                </AppText>

                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    setShowOptions(false);
                    navigation.navigate('ViewListFamily');
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionIconContainer}>
                    <Users size={18} color={colors.primary} />
                  </View>
                  <AppText variant="bodySmallBold" color="primary" style={styles.optionText}>
                    View Member List
                  </AppText>
                  <ChevronRight size={18} color={colors.textMuted} />
                </TouchableOpacity>

                <AppButton
                  title="Logout"
                  variant="outline"
                  size="sm"
                  onPress={logout}
                  style={styles.logoutBtn}
                />

                <TouchableOpacity
                  style={styles.closeOptionsButton}
                  onPress={() => setShowOptions(false)}
                >
                  <AppText variant="captionBold" color="muted">
                    {t('common.close')}
                  </AppText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  matchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  profileColumn: {
    alignItems: 'center',
    minWidth: 80,
    gap: 2,
  },
  avatarLarge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 2,
    backgroundColor: colors.surfaceSecondary,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 2,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartConnector: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.loveSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  mainCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  taskTitle: {
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeIcon: {
    marginRight: 3,
  },
  statusText: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.sm,
  },
  taskDesc: {
    lineHeight: 20,
  },
  messageCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  messageBody: {
    fontStyle: 'italic',
    lineHeight: 18,
  },
  reminderCard: {
    backgroundColor: colors.warningSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  actionBtn: {
    width: '100%',
  },
  completeBtn: {
    width: '100%',
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  optionSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    width: '100%',
    ...shadows.lg,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: colors.borderMedium,
    borderRadius: radius.full,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetTitle: {
    marginBottom: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
  },
  optionIconContainer: {
    padding: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    marginRight: spacing.md,
  },
  optionText: {
    flex: 1,
  },
  logoutBtn: {
    marginTop: spacing.xs,
  },
  closeOptionsButton: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
});

export default TaskDetailScreen;