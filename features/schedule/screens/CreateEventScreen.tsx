import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  ChevronDown,
  Check,
  X,
  User,
} from 'lucide-react-native';
import { scheduleService } from '../services/schedule.service';
import { getFamilyMembers } from '../../family/service/family.service';
import { useAuthStore } from '../../auth/store/auth.store';
import { showBanner } from '../../../utils/banner';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppButton,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

interface FamilyMember {
  userId: string;
  displayName: string;
  avatar: string | null;
  role: string;
  joinedAt: string;
}

interface CreateEventScreenProps {
  navigation: any;
  route?: any;
}

const CreateEventScreen: React.FC<CreateEventScreenProps> = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const prefill = route?.params;
  const currentUser = useAuthStore((state) => state.data);
  const [eventName, setEventName] = useState(prefill?.prefillTitle || '');
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    prefill?.prefillDate ? new Date(prefill.prefillDate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showParticipantPicker, setShowParticipantPicker] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<FamilyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Parse prefilled time to extract time and AM/PM
  const parseTimeString = (timeStr: string) => {
    if (!timeStr) return { time: '', ampm: 'AM' };
    const match = timeStr.match(/^(\d{1,2}:\d{2})\s*(AM|PM)?$/i);
    if (match) {
      return { time: match[1], ampm: match[2]?.toUpperCase() || 'AM' };
    }
    return { time: timeStr, ampm: 'AM' };
  };

  const startParsed = parseTimeString(prefill?.prefillStartTime);
  const endParsed = parseTimeString(prefill?.prefillEndTime);

  const [startTimeText, setStartTimeText] = useState(startParsed.time || '10:30');
  const [endTimeText, setEndTimeText] = useState(endParsed.time || '1:30');
  const [startAmPm, setStartAmPm] = useState(startParsed.ampm);
  const [endAmPm, setEndAmPm] = useState(endParsed.ampm);
  const [showInvalidCharWarning, setShowInvalidCharWarning] = useState(false);

  const [tempDate, setTempDate] = useState({ day: 1, month: 1, year: 2024 });

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months =
    i18n.language === 'vi'
      ? ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await getFamilyMembers();

      let members: any[] = [];
      if (response?.members && Array.isArray(response.members)) {
        members = response.members;
      } else if (Array.isArray(response)) {
        members = response;
      }

      const filteredMembers = members.filter((member: any) => member.userId !== currentUser?.id);
      setFamilyMembers(filteredMembers);
    } catch (error: any) {
      Alert.alert(t('common.error'), t('schedule.loadMembersFailed'));
    } finally {
      setLoadingMembers(false);
    }
  };

  const toggleParticipant = (member: FamilyMember) => {
    const exists = selectedParticipants.find((p) => p.userId === member.userId);
    if (exists) {
      setSelectedParticipants(selectedParticipants.filter((p) => p.userId !== member.userId));
    } else {
      setSelectedParticipants([...selectedParticipants, member]);
    }
  };

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const openDatePicker = () => {
    const current = selectedDate;
    setTempDate({
      day: current.getDate(),
      month: current.getMonth() + 1,
      year: current.getFullYear(),
    });
    setShowDatePicker(true);
  };

  const confirmDatePicker = () => {
    const newDate = new Date(tempDate.year, tempDate.month - 1, tempDate.day);
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const validateForm = () => {
    if (!eventName.trim()) {
      Alert.alert(t('common.error'), t('schedule.eventTitleRequired'));
      return false;
    }

    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5][0-9])$/;
    const trimmedStartTime = startTimeText.trim();
    const trimmedEndTime = endTimeText.trim();

    if (!timeRegex.test(trimmedStartTime)) {
      Alert.alert(
        t('common.error'),
        `${t('schedule.startTimeRequired')}\n${t('schedule.timeFormatExample')}: "${trimmedStartTime}"`
      );
      return false;
    }

    if (!timeRegex.test(trimmedEndTime)) {
      Alert.alert(
        t('common.error'),
        `${t('schedule.endTimeRequired')}\n${t('schedule.timeFormatExample')}: "${trimmedEndTime}"`
      );
      return false;
    }

    const [startHours, startMinutes] = trimmedStartTime.split(':').map((s) => parseInt(s.trim()));
    const [endHours, endMinutes] = trimmedEndTime.split(':').map((s) => parseInt(s.trim()));

    let startHour24 = startHours;
    if (startAmPm === 'PM' && startHours !== 12) {
      startHour24 = startHours + 12;
    } else if (startAmPm === 'AM' && startHours === 12) {
      startHour24 = 0;
    }

    let endHour24 = endHours;
    if (endAmPm === 'PM' && endHours !== 12) {
      endHour24 = endHours + 12;
    } else if (endAmPm === 'AM' && endHours === 12) {
      endHour24 = 0;
    }

    const startTotalMinutes = startHour24 * 60 + startMinutes;
    const endTotalMinutes = endHour24 * 60 + endMinutes;

    if (endTotalMinutes <= startTotalMinutes) {
      Alert.alert(
        t('common.error'),
        `${t('schedule.endTimeAfterStart')}\n${t('schedule.startTime')}: ${trimmedStartTime} ${startAmPm}\n${t('schedule.endTime')}: ${trimmedEndTime} ${endAmPm}`
      );
      return false;
    }

    return true;
  };

  const combineDateTime = (date: Date, timeText: string, ampm: string) => {
    const [hours, minutes] = timeText.split(':').map((s) => parseInt(s.trim()) || 0);
    let hour24 = hours;

    if (ampm === 'PM' && hours !== 12) {
      hour24 = hours + 12;
    } else if (ampm === 'AM' && hours === 12) {
      hour24 = 0;
    }

    const combined = new Date(date);
    combined.setHours(hour24, minutes, 0, 0);

    const yyyy = combined.getFullYear();
    const MM = String(combined.getMonth() + 1).padStart(2, '0');
    const dd = String(combined.getDate()).padStart(2, '0');
    const hh = String(combined.getHours()).padStart(2, '0');
    const mm = String(combined.getMinutes()).padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:00`;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const eventData = {
        title: eventName.trim(),
        description: note.trim(),
        startTime: combineDateTime(selectedDate, startTimeText, startAmPm),
        endTime: combineDateTime(selectedDate, endTimeText, endAmPm),
        participantIds: selectedParticipants.map((p) => p.userId),
      };

      await scheduleService.createEvent(eventData);
      showBanner('📅 Event Created!', `"${eventName}" has been added to the schedule`);

      if (prefill?.onSuccess) {
        await prefill.onSuccess();
      }

      Alert.alert(t('common.success'), t('schedule.createEventSuccess'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.message || t('schedule.createEventFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(t('common.cancel'), t('schedule.cancelConfirm'), [
      { text: t('common.no'), style: 'cancel' },
      { text: t('common.yes'), onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('schedule.createEvent')} navigation={navigation} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Event Title */}
          <AppText variant="captionBold" color="primary" style={styles.fieldLabel}>
            {t('schedule.eventTitle')}
          </AppText>
          <TextInput
            style={styles.input}
            placeholder={t('schedule.eventTitlePlaceholder')}
            placeholderTextColor={colors.textPlaceholder}
            value={eventName}
            onChangeText={(text) => {
              const hasInvalidChars = /[0-9@#$%^&*()_+=\[\]{}|<>?/\\"';:,~`!]/.test(text);
              if (hasInvalidChars) {
                setShowInvalidCharWarning(true);
                setTimeout(() => setShowInvalidCharWarning(false), 2000);
              }
              const filtered = text.replace(/[0-9@#$%^&*()_+=\[\]{}|<>?/\\"';:,~`!]/g, '');
              setEventName(filtered);
            }}
            editable={!loading}
          />
          {showInvalidCharWarning && (
            <AppText variant="tiny" color="error" style={styles.warningText}>
              {t('schedule.invalidCharsWarning')}
            </AppText>
          )}

          {/* Date Picker Trigger */}
          <AppText variant="captionBold" color="primary" style={styles.fieldLabel}>
            {t('schedule.date')}
          </AppText>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={openDatePicker}
            disabled={loading}
            activeOpacity={0.7}
          >
            <AppText variant="bodySmall" color="primary">
              {formatDate(selectedDate)}
            </AppText>
            <CalendarIcon size={18} color={colors.primary} />
          </TouchableOpacity>

          {/* Time Range Inputs */}
          <View style={styles.timeRow}>
            <View style={styles.timeColumn}>
              <AppText variant="captionBold" color="primary" style={styles.fieldLabel}>
                {t('schedule.startTime')}
              </AppText>
              <View style={styles.timeInputWrapper}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="10:30"
                  placeholderTextColor={colors.textPlaceholder}
                  value={startTimeText}
                  onChangeText={setStartTimeText}
                  keyboardType="numbers-and-punctuation"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.ampmButton}
                  onPress={() => setStartAmPm(startAmPm === 'AM' ? 'PM' : 'AM')}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <AppText variant="captionBold" color="white">
                    {startAmPm}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.timeColumn}>
              <AppText variant="captionBold" color="primary" style={styles.fieldLabel}>
                {t('schedule.endTime')}
              </AppText>
              <View style={styles.timeInputWrapper}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="1:30"
                  placeholderTextColor={colors.textPlaceholder}
                  value={endTimeText}
                  onChangeText={setEndTimeText}
                  keyboardType="numbers-and-punctuation"
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.ampmButton}
                  onPress={() => setEndAmPm(endAmPm === 'AM' ? 'PM' : 'AM')}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <AppText variant="captionBold" color="white">
                    {endAmPm}
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Note Input */}
          <AppText variant="captionBold" color="primary" style={styles.fieldLabel}>
            {t('schedule.note')}
          </AppText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('schedule.notePlaceholder')}
            placeholderTextColor={colors.textPlaceholder}
            multiline
            numberOfLines={3}
            value={note}
            onChangeText={setNote}
            editable={!loading}
          />

          {/* Participants Dropdown Trigger */}
          <AppText variant="captionBold" color="primary" style={styles.fieldLabel}>
            {t('schedule.participants')}
          </AppText>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowParticipantPicker(true)}
            disabled={loading || loadingMembers}
            activeOpacity={0.7}
          >
            <View style={styles.avatarPlaceholder}>
              <Users size={16} color={colors.primary} />
            </View>
            <AppText variant="bodySmall" color="secondary" style={styles.dropdownText}>
              {selectedParticipants.length > 0
                ? `${selectedParticipants.length} ${t('schedule.selected')}`
                : t('schedule.addRecipient')}
            </AppText>
            <ChevronDown size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Selected Participants Chips */}
          {selectedParticipants.length > 0 && (
            <View style={styles.participantList}>
              {selectedParticipants.map((participant) => (
                <View key={participant.userId} style={styles.participantItem}>
                  {participant.avatar ? (
                    <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                  ) : (
                    <View style={styles.participantAvatar}>
                      <User size={16} color={colors.textMuted} />
                    </View>
                  )}
                  <AppText variant="tiny" color="primary" numberOfLines={1} align="center">
                    {participant.displayName}
                  </AppText>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Pinned Bottom Action Buttons */}
        <View style={styles.bottomFooter}>
          <AppButton
            title={t('common.cancel')}
            variant="outline"
            size="sm"
            onPress={handleCancel}
            disabled={loading}
            style={styles.actionBtn}
          />
          <AppButton
            title={t('common.save')}
            variant="primary"
            size="sm"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={styles.actionBtn}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Participants Picker Modal */}
      <Modal
        visible={showParticipantPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowParticipantPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.participantModal}>
            <View style={styles.modalHeader}>
              <AppText variant="heading3" color="primary">
                {t('schedule.selectParticipants')}
              </AppText>
              <TouchableOpacity
                onPress={() => setShowParticipantPicker(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {loadingMembers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loaderMargin} />
            ) : familyMembers.length > 0 ? (
              <ScrollView style={styles.memberList}>
                {familyMembers.map((member) => {
                  const isSelected = selectedParticipants.find((p) => p.userId === member.userId);
                  return (
                    <TouchableOpacity
                      key={member.userId}
                      style={styles.memberItem}
                      onPress={() => toggleParticipant(member)}
                      activeOpacity={0.7}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.memberAvatar} />
                      ) : (
                        <View style={styles.memberAvatar}>
                          <User size={20} color={colors.textMuted} />
                        </View>
                      )}
                      <View style={styles.memberInfo}>
                        <AppText variant="bodySmallBold" color="primary">
                          {member.displayName}
                        </AppText>
                        <AppText variant="caption" color="muted">
                          {member.role}
                        </AppText>
                      </View>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Check size={14} color={colors.textLight} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <AppText variant="bodySmall" color="muted" align="center" style={styles.emptyText}>
                {t('schedule.noMembersFound')}
              </AppText>
            )}

            <AppButton
              title={t('common.done')}
              variant="primary"
              size="md"
              onPress={() => setShowParticipantPicker(false)}
              style={styles.confirmButton}
            />
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModal}>
            <AppText variant="heading3" color="primary" align="center" style={styles.pickerTitle}>
              {t('schedule.selectDate')}
            </AppText>
            <View style={styles.pickerContainer}>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={[styles.pickerItem, tempDate.day === day && styles.pickerItemSelected]}
                    onPress={() => setTempDate({ ...tempDate, day })}
                  >
                    <AppText
                      variant="bodySmall"
                      color={tempDate.day === day ? 'white' : 'primary'}
                      style={tempDate.day === day ? styles.pickerBold : undefined}
                    >
                      {day}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {months.map((month, idx) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.pickerItem,
                      tempDate.month === idx + 1 && styles.pickerItemSelected,
                    ]}
                    onPress={() => setTempDate({ ...tempDate, month: idx + 1 })}
                  >
                    <AppText
                      variant="bodySmall"
                      color={tempDate.month === idx + 1 ? 'white' : 'primary'}
                      style={tempDate.month === idx + 1 ? styles.pickerBold : undefined}
                    >
                      {month}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <ScrollView style={styles.pickerColumn} showsVerticalScrollIndicator={false}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.pickerItem, tempDate.year === year && styles.pickerItemSelected]}
                    onPress={() => setTempDate({ ...tempDate, year })}
                  >
                    <AppText
                      variant="bodySmall"
                      color={tempDate.year === year ? 'white' : 'primary'}
                      style={tempDate.year === year ? styles.pickerBold : undefined}
                    >
                      {year}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.pickerButtons}>
              <AppButton
                title={t('common.cancel')}
                variant="outline"
                size="sm"
                onPress={() => setShowDatePicker(false)}
                style={styles.pickerBtn}
              />
              <AppButton
                title={t('common.confirm')}
                variant="primary"
                size="sm"
                onPress={confirmDatePicker}
                style={styles.pickerBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  fieldLabel: {
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    height: 38,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...typography.bodySmall,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  inputWithIcon: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    height: 38,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.sm,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  timeColumn: {
    flex: 1,
  },
  timeInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeInput: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    height: 38,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...typography.bodySmall,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  ampmButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 38,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  dropdownText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  avatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  participantItem: {
    alignItems: 'center',
    width: 50,
  },
  participantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bottomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  actionBtn: {
    flex: 1,
  },
  warningText: {
    marginTop: 2,
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantModal: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    maxHeight: '70%',
    width: '90%',
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  loaderMargin: {
    marginVertical: spacing.lg,
  },
  memberList: {
    maxHeight: 280,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  emptyText: {
    marginVertical: spacing.xl,
  },
  confirmButton: {
    marginTop: spacing.md,
  },
  pickerModal: {
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    width: '85%',
    maxHeight: '50%',
    ...shadows.lg,
  },
  pickerTitle: {
    marginBottom: spacing.md,
  },
  pickerContainer: {
    flexDirection: 'row',
    height: 180,
  },
  pickerColumn: {
    flex: 1,
    marginHorizontal: 3,
  },
  pickerItem: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.sm,
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: colors.primary,
  },
  pickerBold: {
    fontWeight: '700',
  },
  pickerButtons: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  pickerBtn: {
    flex: 1,
  },
});

export default CreateEventScreen;
