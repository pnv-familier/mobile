import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import {
  ChevronLeft,
  Search,
  ChevronRight,
  Plus,
  Users,
  Calendar as CalendarIcon,
  Clock,
  FileText,
  X,
  User,
} from 'lucide-react-native';
import { useEvents, parseEventDate } from '../hooks/useEvents';
import { FamilyEvent } from '../types';
import { useFocusEffect } from '@react-navigation/native';
import { useNotificationStore } from '../../notification/store/notification.store';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppButton,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

interface FamilyScheduleProps {
  navigation: any;
}

const FamilySchedule: React.FC<FamilyScheduleProps> = ({ navigation }) => {
  const { t } = useTranslation();
  const openEventId = useNotificationStore((s) => s.openEventId);
  const setOpenEventId = useNotificationStore((s) => s.setOpenEventId);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());
  const [selectedWeekStart, setSelectedWeekStart] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<FamilyEvent | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);

  const { events, loading, error, refetch } = useEvents(selectedYear, selectedMonth);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [selectedYear, selectedMonth])
  );

  useEffect(() => {
    if (!openEventId || events.length === 0) return;
    const event = events.find((e) => String(e.eventId) === String(openEventId));
    if (event) {
      setSelectedEvent(event);
      setShowEventDetail(true);
      setOpenEventId(null);
    }
  }, [openEventId, events]);

  const getMonthName = (monthIndex: number) => {
    const months = [
      t('time.january'),
      t('time.february'),
      t('time.march'),
      t('time.april'),
      t('time.may'),
      t('time.june'),
      t('time.july'),
      t('time.august'),
      t('time.september'),
      t('time.october'),
      t('time.november'),
      t('time.december'),
    ];
    return months[monthIndex];
  };

  const getDayName = (dayIndex: number) => {
    const days = [
      t('time.monday'),
      t('time.tuesday'),
      t('time.wednesday'),
      t('time.thursday'),
      t('time.friday'),
      t('time.saturday'),
      t('time.sunday'),
    ];
    return days[dayIndex];
  };

  const getDayShortName = (dayIndex: number) => {
    const shortDays = [
      t('time.mon'),
      t('time.tue'),
      t('time.wed'),
      t('time.thu'),
      t('time.fri'),
      t('time.sat'),
      t('time.sun'),
    ];
    return shortDays[dayIndex];
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const startMonth = getMonthName(startDate.getMonth());
    const endMonth = getMonthName(endDate.getMonth());
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDay} - ${endDay} ${startMonth}`;
    }
    return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
  };

  const formatEventDate = (date: Date) => {
    const dayName = getDayName(date.getDay() === 0 ? 6 : date.getDay() - 1);
    const monthName = getMonthName(date.getMonth());
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName}, ${day} ${monthName}, ${year}`;
  };

  const monthNames = Array.from({ length: 12 }, (_, i) => getMonthName(i));
  const days = Array.from({ length: 7 }, (_, i) => getDayShortName(i));

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month - 1, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handleEventPress = (event: FamilyEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const getWeekDates = (startDate: Date) => {
    const week = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const handlePrevWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeekStart(newDate);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth() + 1);
  };

  const handleNextWeek = () => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeekStart(newDate);
    setSelectedYear(newDate.getFullYear());
    setSelectedMonth(newDate.getMonth() + 1);
  };

  const weekDates = getWeekDates(selectedWeekStart);

  const filteredEvents = searchQuery.trim()
    ? events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  // Auto navigate to first filtered event
  useEffect(() => {
    if (searchQuery.trim() && filteredEvents.length > 0) {
      const firstEvent = filteredEvents[0];
      const eventDate = parseEventDate(firstEvent.startTime);

      setSelectedYear(eventDate.getFullYear());
      setSelectedMonth(eventDate.getMonth() + 1);
      setSelectedDate(eventDate.getDate());

      if (viewMode === 'week') {
        setSelectedWeekStart(eventDate);
      }
    }
  }, [searchQuery, filteredEvents.length]);

  const getFilteredEventsForDate = (date: number) => {
    return filteredEvents.filter((event) => {
      const eventDate = parseEventDate(event.startTime);
      return (
        eventDate.getDate() === date &&
        eventDate.getMonth() + 1 === selectedMonth &&
        eventDate.getFullYear() === selectedYear
      );
    });
  };

  const getFilteredEventsForWeekDate = (date: Date) => {
    return filteredEvents.filter((event) => {
      const eventDate = parseEventDate(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const selectedDateEvents = getFilteredEventsForDate(selectedDate);

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('schedule.familySchedule')} navigation={navigation} />

      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={18} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder={t('schedule.searchEvents')}
            placeholderTextColor={colors.textPlaceholder}
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* View Mode Segmented Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'month' && styles.toggleButtonActive]}
            onPress={() => setViewMode('month')}
            activeOpacity={0.8}
          >
            <CalendarIcon
              size={15}
              color={viewMode === 'month' ? colors.textLight : colors.textSecondary}
            />
            <AppText
              variant="captionBold"
              color={viewMode === 'month' ? 'white' : 'secondary'}
            >
              {t('schedule.month')}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'week' && styles.toggleButtonActive]}
            onPress={() => setViewMode('week')}
            activeOpacity={0.8}
          >
            <CalendarIcon
              size={15}
              color={viewMode === 'week' ? colors.textLight : colors.textSecondary}
            />
            <AppText
              variant="captionBold"
              color={viewMode === 'week' ? 'white' : 'secondary'}
            >
              {t('schedule.week')}
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Calendar View Scroll Content */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {viewMode === 'month' ? (
            <View style={styles.calendarCard}>
              {/* Calendar Header with Month/Year Navigation */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  onPress={handlePrevMonth}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.navButton}
                >
                  <ChevronLeft size={20} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.monthSelector}>
                  <AppText variant="bodyBold" color="primary">
                    {monthNames[selectedMonth - 1]}
                  </AppText>
                  <AppText variant="caption" color="muted" style={styles.yearText}>
                    {selectedYear}
                  </AppText>
                </View>

                <TouchableOpacity
                  onPress={handleNextMonth}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.navButton}
                >
                  <ChevronRight size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Day Labels Row */}
              <View style={styles.daysRow}>
                {days.map((day) => (
                  <AppText key={day} variant="captionMedium" color="muted" align="center" style={styles.dayLabel}>
                    {day}
                  </AppText>
                ))}
              </View>

              {/* Dates Grid */}
              <View style={styles.datesGrid}>
                {Array.from({ length: firstDay }).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.dateCell} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const date = i + 1;
                  const dateEvents = getFilteredEventsForDate(date);
                  const isSelected = date === selectedDate;

                  return (
                    <TouchableOpacity
                      key={date}
                      style={styles.dateCell}
                      onPress={() => setSelectedDate(date)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.dateNumberContainer,
                          isSelected && styles.activeDate,
                        ]}
                      >
                        <AppText
                          variant="captionBold"
                          color={isSelected ? 'white' : 'primary'}
                        >
                          {date}
                        </AppText>
                      </View>
                      {dateEvents.length > 0 && (
                        <View style={styles.dotsRow}>
                          {dateEvents.slice(0, 3).map((_, idx) => (
                            <View
                              key={idx}
                              style={[
                                styles.dot,
                                isSelected && styles.dotSelected,
                              ]}
                            />
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.weekCard}>
              {/* Week Navigation Header */}
              <View style={styles.calendarHeader}>
                <TouchableOpacity
                  onPress={handlePrevWeek}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.navButton}
                >
                  <ChevronLeft size={20} color={colors.primary} />
                </TouchableOpacity>

                <AppText variant="bodyBold" color="brand">
                  {formatDateRange(weekDates[0], weekDates[6])}
                </AppText>

                <TouchableOpacity
                  onPress={handleNextWeek}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={styles.navButton}
                >
                  <ChevronRight size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Week Days List */}
              <View style={styles.weekViewContainer}>
                {weekDates.map((date, idx) => {
                  const dayEvents = getFilteredEventsForWeekDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <View key={idx} style={styles.weekDayRow}>
                      <View style={styles.weekDayHeader}>
                        <View style={styles.weekDayInfo}>
                          <AppText variant="captionBold" color="secondary" style={styles.weekDayName}>
                            {getDayShortName(idx)}
                          </AppText>
                          <View
                            style={[
                              styles.weekDateCircle,
                              isToday && styles.weekDateCircleToday,
                            ]}
                          >
                            <AppText
                              variant="captionBold"
                              color={isToday ? 'white' : 'primary'}
                            >
                              {date.getDate()}
                            </AppText>
                          </View>
                        </View>
                        <AppText variant="caption" color="muted">
                          {dayEvents.length} {t('schedule.events')}
                        </AppText>
                      </View>

                      <View style={styles.weekEventsContainer}>
                        {dayEvents.length > 0 ? (
                          dayEvents.map((event) => (
                            <TouchableOpacity
                              key={event.eventId}
                              style={styles.weekEventItem}
                              onPress={() => handleEventPress(event)}
                              activeOpacity={0.7}
                            >
                              <View style={styles.weekEventTime}>
                                <AppText variant="tiny" color="brand">
                                  {parseEventDate(event.startTime).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </AppText>
                              </View>
                              <AppText
                                variant="bodySmallMedium"
                                color="primary"
                                numberOfLines={1}
                                style={styles.weekEventTitle}
                              >
                                {event.title}
                              </AppText>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <AppText variant="caption" color="muted" align="center" style={styles.noEventsText}>
                            {t('schedule.noEvents')}
                          </AppText>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Month Mode Event List for Selected Day */}
          {viewMode === 'month' && (
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : selectedDateEvents.length === 0 ? (
              <View style={styles.emptyDayEvents}>
                <AppText variant="caption" color="muted" align="center">
                  {t('schedule.noEvents')}
                </AppText>
              </View>
            ) : (
              <View style={styles.eventList}>
                {selectedDateEvents.map((event) => (
                  <TouchableOpacity
                    key={event.eventId}
                    style={styles.eventItem}
                    onPress={() => handleEventPress(event)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.eventInfo}>
                      <AppText variant="bodySmallBold" color="primary">
                        {event.title}
                      </AppText>
                      <AppText variant="caption" color="muted">
                        {parseEventDate(event.startTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {parseEventDate(event.endTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </AppText>
                    </View>
                    <ChevronRight size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                ))}
              </View>
            )
          )}
        </ScrollView>

        {/* Floating Action Button (FAB) for Creating Events */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('CreateEvent')}
          activeOpacity={0.85}
          accessibilityLabel="add-event-fab"
          testID="add-event-fab"
        >
          <Plus size={24} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Event Detail Modal */}
      <Modal
        visible={showEventDetail}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEventDetail(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEventDetail(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.eventDetailModal}>
                <View style={styles.eventDetailHeader}>
                  <AppText variant="heading3" color="primary" style={styles.eventDetailTitle}>
                    {selectedEvent?.title}
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setShowEventDetail(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <X size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                <View style={styles.eventDetailContent}>
                  <View style={styles.eventDetailRow}>
                    <CalendarIcon size={18} color={colors.primary} />
                    <View style={styles.eventDetailInfo}>
                      <AppText variant="tiny" color="muted">
                        {t('schedule.date')}
                      </AppText>
                      <AppText variant="bodySmallMedium" color="primary">
                        {selectedEvent && formatEventDate(parseEventDate(selectedEvent.startTime))}
                      </AppText>
                    </View>
                  </View>

                  <View style={styles.eventDetailRow}>
                    <Clock size={18} color={colors.primary} />
                    <View style={styles.eventDetailInfo}>
                      <AppText variant="tiny" color="muted">
                        {t('schedule.time')}
                      </AppText>
                      <AppText variant="bodySmallMedium" color="primary">
                        {selectedEvent &&
                          parseEventDate(selectedEvent.startTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}{' '}
                        -{' '}
                        {selectedEvent &&
                          parseEventDate(selectedEvent.endTime).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                      </AppText>
                    </View>
                  </View>

                  {selectedEvent?.description && (
                    <View style={styles.eventDetailRow}>
                      <FileText size={18} color={colors.primary} />
                      <View style={styles.eventDetailInfo}>
                        <AppText variant="tiny" color="muted">
                          {t('schedule.note')}
                        </AppText>
                        <AppText variant="bodySmall" color="primary">
                          {selectedEvent.description}
                        </AppText>
                      </View>
                    </View>
                  )}

                  <View style={styles.eventDetailRow}>
                    <Users size={18} color={colors.primary} />
                    <View style={styles.eventDetailInfo}>
                      <AppText variant="tiny" color="muted">
                        {t('schedule.createdBy')}
                      </AppText>
                      <View style={styles.creatorInfo}>
                        {selectedEvent?.creator.avatarUrl ? (
                          <Image
                            source={{ uri: selectedEvent.creator.avatarUrl }}
                            style={styles.creatorAvatar}
                          />
                        ) : (
                          <View style={styles.creatorAvatar}>
                            <User size={14} color={colors.textMuted} />
                          </View>
                        )}
                        <AppText variant="bodySmallMedium" color="primary">
                          {selectedEvent?.creator.fullName}
                        </AppText>
                      </View>
                    </View>
                  </View>
                </View>

                <AppButton
                  title={t('common.close')}
                  variant="secondary"
                  size="md"
                  onPress={() => setShowEventDetail(false)}
                  style={styles.closeEventButton}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl + spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    height: 42,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.full,
    padding: 3,
    marginBottom: spacing.md,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    gap: spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  navButton: {
    padding: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
  },
  monthSelector: {
    alignItems: 'center',
  },
  yearText: {
    marginTop: 1,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  dayLabel: {
    width: 38,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
  },
  dateCell: {
    width: '14.28%',
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dateNumberContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDate: {
    backgroundColor: colors.primary,
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginHorizontal: 1,
  },
  dotSelected: {
    backgroundColor: colors.primary,
  },
  weekCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  weekViewContainer: {
    marginTop: spacing.sm,
  },
  weekDayRow: {
    marginBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: spacing.sm,
  },
  weekDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  weekDayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weekDayName: {
    width: 32,
  },
  weekDateCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDateCircleToday: {
    backgroundColor: colors.primary,
  },
  weekEventsContainer: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  weekEventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  weekEventTime: {
    marginRight: spacing.sm,
  },
  weekEventTitle: {
    flex: 1,
  },
  noEventsText: {
    paddingVertical: spacing.xs,
  },
  loadingContainer: {
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDayEvents: {
    marginTop: spacing.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventList: {
    marginTop: spacing.md,
  },
  eventItem: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  eventInfo: {
    flex: 1,
    gap: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventDetailModal: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    width: '90%',
    maxHeight: '80%',
    ...shadows.lg,
  },
  eventDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  eventDetailTitle: {
    flex: 1,
    marginRight: spacing.sm,
  },
  eventDetailContent: {
    gap: spacing.md,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
  },
  eventDetailInfo: {
    flex: 1,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  creatorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeEventButton: {
    marginTop: spacing.lg,
  },
});

export default FamilySchedule;
