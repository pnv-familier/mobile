import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { User, Plus, CheckCircle2, Heart } from 'lucide-react-native';
import { useLoveTasks } from '../hooks/useLoveTasks';
import { useFocusEffect } from '@react-navigation/native';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppLoader,
  AppError,
  EmptyState,
} from '../../../components';
import { colors, spacing, radius, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

interface LoveTasksScreenProps {
  navigation: any;
}

const LoveTasksScreen: React.FC<LoveTasksScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'received' | 'created'>('received');
  const { tasks, receivedCount, createdCount, loading, error, refetch } = useLoveTasks(activeTab);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [activeTab])
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return {
          bg: colors.successSoft,
          text: colors.successText,
          label: t('loveTasks.completed'),
        };
      case 'PENDING':
        return {
          bg: colors.warningSoft,
          text: colors.warningText,
          label: t('loveTasks.pending'),
        };
      case 'SHARED':
        return {
          bg: colors.loveSoft,
          text: colors.loveText,
          label: t('loveTasks.shared'),
        };
      default:
        return {
          bg: colors.surfaceSecondary,
          text: colors.textSecondary,
          label: status,
        };
    }
  };

  const handleTaskPress = (taskId: number) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  const handleCreateTask = () => {
    navigation.navigate('CreateLoveTask');
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('loveTasks.loveTasks')} navigation={navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Card with Integrated Segmented Tab Control */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View style={styles.bannerIconBadge}>
              <Heart color={colors.love} size={22} fill={colors.love} />
            </View>
            <View style={styles.bannerTextContainer}>
              <AppText variant="bodyBold" color="primary">
                {t('loveTasks.loveTasks')}
              </AppText>
              <AppText variant="caption" color="secondary" numberOfLines={1}>
                {t('loveTasks.loveTasksDesc')}
              </AppText>
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'received' && styles.tabActive]}
              onPress={() => setActiveTab('received')}
              activeOpacity={0.8}
            >
              <AppText
                variant="captionBold"
                color={activeTab === 'received' ? 'white' : 'secondary'}
              >
                {t('loveTasks.received')} ({receivedCount})
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabButton, activeTab === 'created' && styles.tabActive]}
              onPress={() => setActiveTab('created')}
              activeOpacity={0.8}
            >
              <AppText
                variant="captionBold"
                color={activeTab === 'created' ? 'white' : 'secondary'}
              >
                {t('loveTasks.created')} ({createdCount})
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Task List Feed / States */}
        {loading ? (
          <AppLoader style={styles.loaderContainer} />
        ) : error ? (
          <View style={styles.stateWrapper}>
            <AppError message={error} onRetry={refetch} retryTitle={t('common.retry')} />
          </View>
        ) : tasks.length === 0 ? (
          <EmptyState
            image={require('../../../assets/love-task.png')}
            title={
              activeTab === 'received'
                ? t('loveTasks.noTasksReceived')
                : t('loveTasks.noTasksCreated')
            }
            description={t('loveTasks.loveTasksDesc')}
            actionTitle={t('loveTasks.createLoveTask')}
            onActionPress={handleCreateTask}
            style={styles.emptyCard}
          />
        ) : (
          tasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            return (
              <TouchableOpacity
                key={task.taskId}
                style={styles.taskCard}
                onPress={() => handleTaskPress(task.taskId)}
                activeOpacity={0.7}
              >
                {/* Task Title & Status Header */}
                <View style={styles.taskHeader}>
                  <AppText
                    variant="bodySmallBold"
                    color="primary"
                    numberOfLines={1}
                    style={styles.taskTitle}
                  >
                    {task.title}
                  </AppText>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    {task.status === 'COMPLETED' && (
                      <CheckCircle2 size={12} color={statusConfig.text} style={styles.statusIcon} />
                    )}
                    <AppText
                      variant="tiny"
                      style={[styles.statusText, { color: statusConfig.text }]}
                    >
                      {statusConfig.label}
                    </AppText>
                  </View>
                </View>

                {/* Task Sender Info & Description */}
                <View style={styles.taskBody}>
                  {task.sender.avatarUrl ? (
                    <Image source={{ uri: task.sender.avatarUrl }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <User size={16} color={colors.textMuted} />
                    </View>
                  )}
                  <View style={styles.taskMainContent}>
                    <AppText
                      variant="bodySmall"
                      color="secondary"
                      numberOfLines={2}
                      style={styles.description}
                    >
                      {task.description}
                    </AppText>
                    <AppText variant="tiny" color="muted" style={styles.fromText}>
                      {t('loveTasks.from')}: {task.sender.fullName}
                    </AppText>
                  </View>
                </View>

                {/* Optional Love Message when Completed */}
                {task.status === 'COMPLETED' && task.loveMessage && (
                  <View style={styles.loveMessageContainer}>
                    <Heart size={14} color={colors.love} fill={colors.love} />
                    <AppText variant="tiny" color="primary" style={styles.loveMessageText}>
                      {task.loveMessage}
                    </AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Floating Action Button (FAB) for Creating Love Task */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreateTask}
        activeOpacity={0.85}
        accessibilityLabel="add-love-task-fab"
        testID="add-love-task-fab"
      >
        <Plus color={colors.textLight} size={24} />
      </TouchableOpacity>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl + spacing.xl,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  bannerIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.loveSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  bannerTextContainer: {
    flex: 1,
    gap: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.full,
    padding: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  loaderContainer: {
    paddingVertical: spacing.xxl,
  },
  stateWrapper: {
    marginVertical: spacing.md,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    paddingVertical: spacing.xl,
    ...shadows.sm,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: spacing.xs + 2,
    marginBottom: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  taskTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusIcon: {
    marginRight: 3,
  },
  statusText: {
    fontWeight: '700',
  },
  taskBody: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: spacing.sm,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskMainContent: {
    flex: 1,
  },
  description: {
    lineHeight: 18,
  },
  fromText: {
    marginTop: 2,
  },
  loveMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  loveMessageText: {
    fontStyle: 'italic',
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.md,
    backgroundColor: colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
});

export default LoveTasksScreen;
