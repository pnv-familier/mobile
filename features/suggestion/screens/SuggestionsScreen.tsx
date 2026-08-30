import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Lightbulb, Heart, Calendar } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSuggestions, FilterValue } from '../hooks/useSuggestions';
import { SuggestionListItem, SuggestionType } from '../types';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppLoader,
  AppError,
  EmptyState,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

const TYPE_CONFIG: Record<SuggestionType, { icon: any; labelKey: string; color: string; bg: string }> = {
  TASK: { icon: Heart, labelKey: 'loveTasks.loveTasks', color: colors.love, bg: colors.loveSoft },
  EVENT: { icon: Calendar, labelKey: 'schedule.events', color: colors.info, bg: colors.infoSoft },
  OFFLINE: { icon: Lightbulb, labelKey: 'suggestions.offline', color: colors.warning, bg: colors.warningSoft },
};

const FILTERS: { labelKey: string; value: FilterValue }[] = [
  { labelKey: 'suggestions.all', value: 'ALL' },
  { labelKey: 'suggestions.pending', value: 'PENDING' },
  { labelKey: 'suggestions.done', value: 'ACCEPTED' },
];

interface SuggestionsScreenProps {
  navigation: any;
}

const SuggestionsScreen: React.FC<SuggestionsScreenProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterValue>('ALL');
  const { suggestions, loading, error, fetchSuggestions } = useSuggestions();

  useFocusEffect(
    React.useCallback(() => {
      fetchSuggestions(activeFilter);
    }, [activeFilter])
  );

  const handleFilterChange = (filter: FilterValue) => {
    setActiveFilter(filter);
    fetchSuggestions(filter);
  };

  const renderItem = (item: SuggestionListItem) => {
    const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.OFFLINE;
    const IconComponent = config.icon;
    const isDone = item.status === 'ACCEPTED';

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        onPress={() => navigation.navigate('SuggestionDetail', { id: item.id })}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, { backgroundColor: config.bg }]}>
          <IconComponent size={20} color={config.color} />
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <AppText
              variant="bodySmallBold"
              color="primary"
              numberOfLines={1}
              style={styles.cardTitle}
            >
              {item.title}
            </AppText>
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

          <AppText variant="tiny" style={[styles.typeLabel, { color: config.color }]}>
            {t(config.labelKey)}
          </AppText>

          <AppText variant="caption" color="secondary" numberOfLines={2} style={styles.cardDesc}>
            {item.description}
          </AppText>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('suggestions.aiSuggestions')} navigation={navigation} />

      {/* Segmented Filter Pills */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isActive = activeFilter === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                style={[styles.filterBtn, isActive && styles.filterBtnActive]}
                onPress={() => handleFilterChange(f.value)}
                activeOpacity={0.8}
              >
                <AppText
                  variant="captionBold"
                  color={isActive ? 'white' : 'secondary'}
                >
                  {t(f.labelKey)}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Suggestion Feed & UX States */}
      {loading ? (
        <AppLoader style={styles.centered} />
      ) : error ? (
        <View style={styles.stateWrapper}>
          <AppError
            message={error}
            onRetry={() => fetchSuggestions(activeFilter)}
            retryTitle={t('common.retry')}
          />
        </View>
      ) : suggestions.length === 0 ? (
        <EmptyState
          icon={<Lightbulb size={36} color={colors.primary} />}
          title={t('suggestions.noSuggestionsFound')}
          description="AI will provide helpful recommendations based on your family habits."
          style={styles.emptyCard}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {suggestions.map(renderItem)}
        </ScrollView>
      )}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  filterWrapper: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.full,
    padding: 3,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl + spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm + 2,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm + 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  typeLabel: {
    fontWeight: '700',
    marginBottom: 2,
  },
  cardDesc: {
    lineHeight: 18,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  statusText: {
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  stateWrapper: {
    margin: spacing.md,
  },
  emptyCard: {
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
});

export default SuggestionsScreen;
