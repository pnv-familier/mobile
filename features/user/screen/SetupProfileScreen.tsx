import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { Users, User, Check, Calendar, Heart } from 'lucide-react-native';
import { AppScreen, AppText, AppButton } from '../../../components';
import { GENDER_LIST } from '../constant/genderList';
import { HOBBY_LIST } from '../constant/hobbyList';
import { useSetupProfile } from '../hook/setupProfile';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

const SetupProfileScreen = () => {
  const { t } = useTranslation();
  const {
    dateOfBirth,
    setDateOfBirth,
    gender,
    setGender,
    selectedHobbies,
    toggleHobby,
    onSaveProfile,
    loading,
  } = useSetupProfile();

  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const renderPicker = (
    items: any[],
    selectedValue: any,
    onSelect: (value: any) => void,
    onClose: () => void,
    isMonth = false
  ) => (
    <Modal transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppText variant="bodySmall" color="secondary">
                {t('common.cancel')}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <AppText variant="bodySmallBold" color="brand">
                {t('common.done')}
              </AppText>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
            {items.map((item) => {
              const itemVal = isMonth ? item.value : item;
              const isSelected = selectedValue === itemVal;
              return (
                <TouchableOpacity
                  key={itemVal}
                  style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                  onPress={() => {
                    onSelect(itemVal);
                    onClose();
                  }}
                >
                  <AppText
                    variant="bodySmall"
                    style={[
                      styles.pickerItemText,
                      isSelected && styles.pickerItemTextSelected,
                    ]}
                  >
                    {isMonth ? item.label : item}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Hero */}
        <View style={styles.headerSection}>
          <View style={styles.iconBadge}>
            <Users size={28} color={colors.primary} />
          </View>
          <AppText variant="heading1" color="brand" align="center">
            {t('profile.setupProfile')}
          </AppText>
          <AppText variant="bodySmall" color="secondary" align="center" style={styles.subtitle}>
            {t('profile.setupSubtitle')}
          </AppText>
        </View>

        {/* Date of Birth Card */}
        <View style={styles.inputCard}>
          <View style={styles.cardHeaderRow}>
            <Calendar size={18} color={colors.primary} />
            <AppText variant="bodySmallBold" color="primary">
              {t('profile.dateOfBirth')}
            </AppText>
          </View>
          <AppText variant="caption" color="muted" style={styles.inputSubtext}>
            Used for family calendar and birthday reminders
          </AppText>

          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowDayPicker(true)}
              activeOpacity={0.7}
            >
              <AppText variant="tiny" color="muted">
                Day
              </AppText>
              <AppText variant="bodySmallBold" color="primary">
                {dateOfBirth.day}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowMonthPicker(true)}
              activeOpacity={0.7}
            >
              <AppText variant="tiny" color="muted">
                Month
              </AppText>
              <AppText variant="bodySmallBold" color="primary">
                {months.find((m) => m.value === dateOfBirth.month)?.label}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateSelector}
              onPress={() => setShowYearPicker(true)}
              activeOpacity={0.7}
            >
              <AppText variant="tiny" color="muted">
                Year
              </AppText>
              <AppText variant="bodySmallBold" color="primary">
                {dateOfBirth.year}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gender Selection Card */}
        <View style={styles.inputCard}>
          <View style={styles.cardHeaderRow}>
            <User size={18} color={colors.primary} />
            <AppText variant="bodySmallBold" color="primary">
              {t('profile.gender')}
            </AppText>
          </View>
          <AppText variant="caption" color="muted" style={styles.inputSubtext}>
            Used for correct pronoun usage by AI
          </AppText>

          <View style={styles.genderContainer}>
            {GENDER_LIST.map((item) => {
              const isActive = gender === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  onPress={() => setGender(item.key)}
                  style={[styles.genderOption, isActive && styles.genderOptionActive]}
                  activeOpacity={0.7}
                >
                  <User
                    size={18}
                    color={isActive ? colors.textLight : colors.primary}
                  />
                  <AppText
                    variant="bodySmallBold"
                    style={[styles.genderText, isActive && styles.genderTextActive]}
                  >
                    {item.label}
                  </AppText>
                  {isActive && <Check size={16} color={colors.textLight} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Hobbies Card */}
        <View style={styles.inputCard}>
          <View style={styles.cardHeaderRow}>
            <Heart size={18} color={colors.primary} />
            <AppText variant="bodySmallBold" color="primary">
              {t('profile.hobbies')}
            </AppText>
          </View>
          <AppText variant="caption" color="muted" style={styles.inputSubtext}>
            {t('profile.selectHobbies')}
          </AppText>

          <View style={styles.hobbiesContainer}>
            {HOBBY_LIST.map((hobby, index) => {
              const isActive = selectedHobbies.includes(hobby);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => toggleHobby(hobby)}
                  style={[styles.hobbyTag, isActive && styles.hobbyTagActive]}
                  activeOpacity={0.7}
                >
                  {isActive && (
                    <Check size={13} color={colors.textLight} style={styles.checkIcon} />
                  )}
                  <AppText
                    variant="captionBold"
                    style={[styles.hobbyText, isActive && styles.hobbyTextActive]}
                  >
                    {hobby}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Pinned Bottom Save Button */}
      <View style={styles.bottomFooter}>
        <AppButton
          title={loading ? t('common.loading') : t('common.save')}
          variant="primary"
          size="md"
          onPress={onSaveProfile}
          disabled={!gender || loading}
          loading={loading}
          style={styles.saveButton}
        />
      </View>

      {showDayPicker &&
        renderPicker(
          days,
          dateOfBirth.day,
          (day) => setDateOfBirth({ ...dateOfBirth, day }),
          () => setShowDayPicker(false)
        )}
      {showMonthPicker &&
        renderPicker(
          months,
          dateOfBirth.month,
          (month) => setDateOfBirth({ ...dateOfBirth, month }),
          () => setShowMonthPicker(false),
          true
        )}
      {showYearPicker &&
        renderPicker(
          years,
          dateOfBirth.year,
          (year) => setDateOfBirth({ ...dateOfBirth, year }),
          () => setShowYearPicker(false)
        )}
    </AppScreen>
  );
};

export default SetupProfileScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginTop: 4,
  },
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    marginBottom: 2,
  },
  inputSubtext: {
    marginBottom: spacing.sm,
  },
  datePickerContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dateSelector: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  genderContainer: {
    gap: spacing.sm,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    gap: spacing.sm,
  },
  genderOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderText: {
    color: colors.textPrimary,
    flex: 1,
  },
  genderTextActive: {
    color: colors.textLight,
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  hobbyTag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceSecondary,
    borderWidth: 1,
    borderColor: colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hobbyTagActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkIcon: {
    marginRight: 4,
  },
  hobbyText: {
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  hobbyTextActive: {
    color: colors.textLight,
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  saveButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  pickerContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    maxHeight: '50%',
    paddingBottom: spacing.xl,
    ...shadows.lg,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pickerScroll: {
    maxHeight: 280,
  },
  pickerItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  pickerItemSelected: {
    backgroundColor: colors.primarySoft,
  },
  pickerItemText: {
    color: colors.textPrimary,
    textAlign: 'center',
  },
  pickerItemTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
});