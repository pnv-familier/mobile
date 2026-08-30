import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import { Heart, Calendar, Lightbulb, FileText, Sparkles } from 'lucide-react-native';
import { useSuggestionDetail } from '../hooks/useSuggestionDetail';
import { SuggestionType, EventPayload, TaskPayload } from '../types';
import { useTranslation } from 'react-i18next';
import { formatRelativeTime } from '../../../utils/dateFormat';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppButton,
  AppLoader,
  AppError,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

const TYPE_CONFIG: Record<
  SuggestionType,
  { icon: any; labelKey: string; color: string; bg: string }
> = {
  TASK: {
    icon: Heart,
    labelKey: 'loveTasks.loveTasks',
    color: colors.love,
    bg: colors.loveSoft,
  },
  EVENT: {
    icon: Calendar,
    labelKey: 'schedule.events',
    color: colors.info,
    bg: colors.infoSoft,
  },
  OFFLINE: {
    icon: Lightbulb,
    labelKey: 'suggestions.offline',
    color: colors.warning,
    bg: colors.warningSoft,
  },
};

interface SuggestionDetailScreenProps {
  navigation: any;
  route: any;
}

const SuggestionDetailScreen: React.FC<SuggestionDetailScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { id } = route.params;
  const { suggestion, loading, error, refetch, acceptSuggestion } = useSuggestionDetail(id);

  if (loading) {
    return (
      <AppScreen edges={['top']} backgroundColor={colors.background}>
        <AppHeader title={t('suggestions.suggestionDetail')} navigation={navigation} />
        <AppLoader style={styles.centered} />
      </AppScreen>
    );
  }

  if (error || !suggestion) {
    return (
      <AppScreen edges={['top']} backgroundColor={colors.background}>
        <AppHeader title={t('suggestions.suggestionDetail')} navigation={navigation} />
        <View style={styles.centered}>
          <AppError
            message={error || t('suggestions.suggestionNotFound')}
            onRetry={refetch}
            retryTitle={t('common.retry')}
          />
        </View>
      </AppScreen>
    );
  }

  const config = TYPE_CONFIG[suggestion.type] || TYPE_CONFIG.OFFLINE;
  const IconComponent = config.icon;
  const isDone = suggestion.status === 'ACCEPTED';

  const handleCreateLoveTask = () => {
    const payload = suggestion.payload as TaskPayload;
    navigation.navigate('SuggestionCreateLoveTask', {
      prefillTitle: payload.title,
      prefillDescription: payload.description,
      onSuccess: async () => {
        try {
          await acceptSuggestion();
        } catch (err: any) {
          Alert.alert('Error', err?.message || 'Failed to update suggestion status');
        }
      },
    });
  };

  const handleAddToSchedule = () => {
    const payload = suggestion.payload as EventPayload;
    navigation.navigate('SuggestionCreateEvent', {
      prefillTitle: payload.title,
      prefillStartTime: payload.startTime,
      prefillEndTime: payload.endTime,
      prefillDate: new Date(payload.year, payload.month - 1, payload.date),
      onSuccess: async () => {
        try {
          await acceptSuggestion();
        } catch (err: any) {
          Alert.alert('Error', err?.message || 'Failed to update suggestion status');
        }
      },
    });
  };

  const hasAction = !isDone && (suggestion.type === 'TASK' || suggestion.type === 'EVENT');

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('suggestions.suggestionDetail')} navigation={navigation} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title & Type Hero Card */}
        <View style={styles.titleCard}>
          <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
            <IconComponent size={22} color={config.color} />
          </View>

          <View style={styles.titleInfo}>
            <AppText variant="tiny" style={[styles.typeLabel, { color: config.color }]}>
              {t(config.labelKey)}
            </AppText>
            <AppText variant="bodyBold" color="primary">
              {suggestion.title}
            </AppText>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isDone ? colors.successSoft : colors.warningSoft },
            ]}
          >
            <AppText
              variant="tiny"
              style={[
                styles.statusText,
                { color: isDone ? colors.successText : colors.warningText },
              ]}
            >
              {isDone ? t('suggestions.done') : t('suggestions.pending')}
            </AppText>
          </View>
        </View>

        {/* Suggestion Content Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <FileText size={16} color={colors.primary} />
            <AppText variant="bodySmallBold" color="primary">
              {t('suggestions.suggestionContent')}
            </AppText>
          </View>
          <AppText variant="bodySmall" color="secondary" style={styles.sectionBody}>
            {suggestion.description}
          </AppText>
        </View>

        {/* Why This Suggestion Section */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Sparkles size={16} color={colors.primary} />
            <AppText variant="bodySmallBold" color="primary">
              {t('suggestions.whyThisSuggestion')}
            </AppText>
          </View>
          <AppText variant="bodySmall" color="secondary" style={styles.sectionBody}>
            {suggestion.triggerContext}
          </AppText>
          <AppText variant="caption" color="muted" style={styles.timestamp}>
            {formatRelativeTime(suggestion.createdAt, t)}
          </AppText>
        </View>
      </ScrollView>

      {/* Pinned Bottom Action Button */}
      {hasAction && (
        <View style={styles.bottomFooter}>
          {suggestion.type === 'TASK' && (
            <AppButton
              title={t('suggestions.createLoveTask')}
              variant="primary"
              size="md"
              icon={<Heart size={16} color={colors.textLight} />}
              onPress={handleCreateLoveTask}
              style={styles.actionBtnTask}
            />
          )}

          {suggestion.type === 'EVENT' && (
            <AppButton
              title={t('suggestions.addToSchedule')}
              variant="primary"
              size="md"
              icon={<Calendar size={16} color={colors.textLight} />}
              onPress={handleAddToSchedule}
              style={styles.actionBtnEvent}
            />
          )}
        </View>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  centered: {
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
  titleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 2,
  },
  titleInfo: {
    flex: 1,
    marginRight: spacing.xs,
  },
  typeLabel: {
    fontWeight: '700',
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  statusText: {
    fontWeight: '700',
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: spacing.sm,
  },
  sectionBody: {
    lineHeight: 20,
  },
  timestamp: {
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  actionBtnTask: {
    width: '100%',
    backgroundColor: colors.love,
    borderColor: colors.love,
  },
  actionBtnEvent: {
    width: '100%',
    backgroundColor: colors.info,
    borderColor: colors.info,
  },
});

export default SuggestionDetailScreen;
