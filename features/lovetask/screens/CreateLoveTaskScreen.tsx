import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { User, Send, Users, ChevronDown, Check, X } from 'lucide-react-native';
import { useCreateLoveTask } from '../hooks/useCreateLoveTask';
import { useFamilyMembers } from '../../family/hooks/useFamilyMembers';
import { FamilyMember } from '../../family/types';
import { useAuthStore } from '../../auth/store/auth.store';
import {
  AppScreen,
  AppHeader,
  AppText,
  AppButton,
} from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';
import { useTranslation } from 'react-i18next';

interface CreateLoveTaskScreenProps {
  navigation: any;
  route: any;
}

const CreateLoveTaskScreen: React.FC<CreateLoveTaskScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const prefill = route?.params;
  const [title, setTitle] = useState(prefill?.prefillTitle || '');
  const [description, setDescription] = useState(prefill?.prefillDescription || '');
  const [loveMessage, setLoveMessage] = useState('');
  const [assignedToUserId, setAssignedToUserId] = useState('');
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { createTask, loading } = useCreateLoveTask();
  const { members: allMembers, loading: loadingMembers } = useFamilyMembers();
  const user = useAuthStore((state) => state.data);
  const members = allMembers.filter((m: FamilyMember) => m.userId !== user?.id);

  const selectedMember = members.find((m: FamilyMember) => m.userId === assignedToUserId);

  const handleCreate = async () => {
    if (!assignedToUserId.trim()) {
      Alert.alert(t('common.error'), t('loveTasks.assigneeRequired'));
      return;
    }
    if (!title.trim()) {
      Alert.alert(t('common.error'), t('loveTasks.taskTitleRequired'));
      return;
    }
    if (!description.trim()) {
      Alert.alert(t('common.error'), t('loveTasks.taskDescRequired'));
      return;
    }

    try {
      await createTask(
        title.trim(),
        description.trim(),
        assignedToUserId.trim(),
        loveMessage.trim() || undefined
      );

      if (prefill?.onSuccess) {
        await prefill.onSuccess();
      }

      Alert.alert(t('common.success'), t('loveTasks.createTaskSuccess'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert(t('common.error'), err?.message || t('loveTasks.createTaskFailed'));
    }
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader title={t('loveTasks.createLoveTask')} navigation={navigation} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Assignee Selection Field */}
          <View style={styles.labelRow}>
            <AppText variant="captionBold" color="primary">
              {t('loveTasks.assignTo')}
            </AppText>
            <AppText variant="captionBold" color="error">
              {' '}*
            </AppText>
          </View>

          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowMemberModal(true)}
            disabled={loadingMembers}
            activeOpacity={0.7}
          >
            {loadingMembers ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : selectedMember ? (
              <View style={styles.selectedMemberRow}>
                {selectedMember.avatar ? (
                  <Image source={{ uri: selectedMember.avatar }} style={styles.avatarSmall} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={14} color={colors.textMuted} />
                  </View>
                )}
                <AppText variant="bodySmallBold" color="primary" style={styles.selectedMemberName}>
                  {selectedMember.displayName}
                </AppText>
              </View>
            ) : (
              <View style={styles.placeholderRow}>
                <View style={styles.avatarPlaceholder}>
                  <Users size={14} color={colors.primary} />
                </View>
                <AppText variant="bodySmall" color="secondary" style={styles.dropdownPlaceholder}>
                  {t('loveTasks.selectMember')}
                </AppText>
              </View>
            )}
            <ChevronDown size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {/* Task Title Input */}
          <View style={styles.labelRow}>
            <AppText variant="captionBold" color="primary">
              {t('loveTasks.taskTitle')}
            </AppText>
            <AppText variant="captionBold" color="error">
              {' '}*
            </AppText>
          </View>
          <TextInput
            style={styles.input}
            placeholder={t('loveTasks.taskTitlePlaceholder')}
            placeholderTextColor={colors.textPlaceholder}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />

          {/* Task Description Input */}
          <View style={styles.labelRow}>
            <AppText variant="captionBold" color="primary">
              {t('loveTasks.taskDescription')}
            </AppText>
            <AppText variant="captionBold" color="error">
              {' '}*
            </AppText>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('loveTasks.taskDescPlaceholder')}
            placeholderTextColor={colors.textPlaceholder}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            editable={!loading}
          />

          {/* Love Message (Optional) */}
          <View style={styles.labelRow}>
            <AppText variant="captionBold" color="primary">
              {t('loveTasks.loveMessage')}
            </AppText>
          </View>
          <TextInput
            style={[styles.input, styles.loveMessageInput]}
            placeholder={t('loveTasks.loveMessagePlaceholder')}
            placeholderTextColor={colors.textPlaceholder}
            multiline
            numberOfLines={2}
            value={loveMessage}
            onChangeText={setLoveMessage}
            editable={!loading}
          />
        </ScrollView>

        {/* Pinned Bottom Action Button */}
        <View style={styles.bottomFooter}>
          <AppButton
            title={t('loveTasks.sendLoveTask')}
            variant="primary"
            size="md"
            icon={<Send size={16} color={colors.textLight} />}
            onPress={handleCreate}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Member Selection Modal */}
      <Modal
        visible={showMemberModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.memberModal}>
            <View style={styles.modalHeader}>
              <AppText variant="heading3" color="primary">
                {t('loveTasks.selectMember')}
              </AppText>
              <TouchableOpacity
                onPress={() => setShowMemberModal(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {loadingMembers ? (
              <ActivityIndicator size="large" color={colors.primary} style={styles.loaderMargin} />
            ) : members.length > 0 ? (
              <ScrollView style={styles.memberList}>
                {members.map((member: FamilyMember) => {
                  const isSelected = member.userId === assignedToUserId;
                  return (
                    <TouchableOpacity
                      key={member.userId}
                      style={styles.memberItem}
                      onPress={() => {
                        setAssignedToUserId(member.userId);
                        setShowMemberModal(false);
                      }}
                      activeOpacity={0.7}
                    >
                      {member.avatar ? (
                        <Image source={{ uri: member.avatar }} style={styles.avatarModal} />
                      ) : (
                        <View style={styles.avatarModalPlaceholder}>
                          <User size={18} color={colors.textMuted} />
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
                No family members found
              </AppText>
            )}

            <AppButton
              title={t('common.close')}
              variant="secondary"
              size="sm"
              onPress={() => setShowMemberModal(false)}
              style={styles.closeModalBtn}
            />
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
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: 4,
  },
  dropdown: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  selectedMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedMemberName: {
    marginLeft: spacing.sm,
  },
  placeholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownPlaceholder: {
    marginLeft: spacing.sm,
  },
  avatarSmall: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  avatarPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 2,
    height: 40,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...typography.bodySmall,
    color: colors.textPrimary,
    ...shadows.sm,
  },
  textArea: {
    height: 75,
    textAlignVertical: 'top',
  },
  loveMessageInput: {
    height: 55,
    textAlignVertical: 'top',
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  submitButton: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberModal: {
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
  avatarModal: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  avatarModalPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  closeModalBtn: {
    marginTop: spacing.md,
  },
});

export default CreateLoveTaskScreen;
