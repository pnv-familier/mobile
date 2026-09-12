import React from 'react';
import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { X, Calendar, CheckCircle, Lightbulb, Sparkles } from 'lucide-react-native';
import { AppText } from '../../../components';
import { colors, spacing, radius, shadows } from '../../../theme';

interface SuggestionCardProps {
  visible: boolean;
  metadata: any;
  onConfirm: () => void;
  onIgnore: () => void;
}

const sanitizeText = (val?: string | null): string => {
  if (!val || val === 'undefined' || val === 'null') return '';
  return String(val).trim();
};

export default function SuggestionCard({
  visible,
  metadata,
  onConfirm,
  onIgnore,
}: SuggestionCardProps) {
  if (!visible || !metadata) return null;

  const rawTitle = sanitizeText(metadata.title);
  const rawDesc = sanitizeText(metadata.description);
  const rawAction = sanitizeText(metadata.action);
  const rawStartTime = sanitizeText(metadata.startTime);
  const rawEndTime = sanitizeText(metadata.endTime);
  const rawLocation = sanitizeText(metadata.location);

  // If metadata is empty and has no meaningful content, do not show empty card
  const hasContent = Boolean(
    rawTitle || rawDesc || rawAction || rawStartTime || rawEndTime || rawLocation
  );
  if (!hasContent) return null;

  const type = (metadata.type || '').toUpperCase();

  const getDisplayContent = () => {
    if (type === 'EVENT') {
      let timeRange = '';
      if (rawStartTime && rawEndTime) {
        timeRange = `${rawStartTime} - ${rawEndTime}`;
      } else if (rawStartTime) {
        timeRange = rawStartTime;
      } else if (rawEndTime) {
        timeRange = rawEndTime;
      }

      let timeAndLocation = timeRange;
      if (rawLocation) {
        timeAndLocation = timeRange ? `${timeRange} at ${rawLocation}` : rawLocation;
      }

      return {
        title: rawTitle || 'Event Suggestion',
        description: rawDesc || timeAndLocation || 'Scheduled family event',
      };
    }

    if (type === 'TASK') {
      return {
        title: rawTitle || 'Care Task',
        description: rawDesc || 'Care task recommendation for your family',
      };
    }

    if (type === 'OFFLINE') {
      return {
        title: rawTitle || 'Offline Action',
        description: rawAction || rawDesc || 'Family offline activity recommendation',
      };
    }

    return {
      title: rawTitle || 'AI Suggestion',
      description: rawDesc || rawAction || 'Recommendation for you and your family',
    };
  };

  const { title, description } = getDisplayContent();

  const getTypeTag = () => {
    if (type === 'TASK') {
      return {
        Icon: CheckCircle,
        label: 'Care Task',
        color: colors.loveSoft,
        textColor: colors.love,
        iconColor: colors.love,
      };
    }
    if (type === 'EVENT') {
      return {
        Icon: Calendar,
        label: 'Event',
        color: colors.infoSoft,
        textColor: colors.info,
        iconColor: colors.info,
      };
    }
    if (type === 'OFFLINE') {
      return {
        Icon: Lightbulb,
        label: 'Offline Action',
        color: colors.warningSoft,
        textColor: colors.warningText,
        iconColor: colors.warning,
      };
    }

    return {
      Icon: Sparkles,
      label: 'Suggestion',
      color: colors.primarySoft,
      textColor: colors.primary,
      iconColor: colors.primary,
    };
  };

  const typeTag = getTypeTag();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onIgnore}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Sparkles size={18} color={colors.primary} />
              <AppText variant="bodyBold" color="primary">
                Suggestions for you!
              </AppText>
            </View>
            <TouchableOpacity
              onPress={onIgnore}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.closeBtn}
            >
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.tag, { backgroundColor: typeTag.color }]}>
            <typeTag.Icon size={13} color={typeTag.iconColor} />
            <AppText
              variant="tiny"
              style={[styles.tagText, { color: typeTag.textColor }]}
            >
              {typeTag.label}
            </AppText>
          </View>

          <View style={styles.messageBox}>
            <AppText variant="bodySmallBold" color="primary" style={styles.messageTitle}>
              {title}
            </AppText>
            {Boolean(description) && (
              <AppText variant="caption" color="secondary" style={styles.description}>
                {description}
              </AppText>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.hideButton}
              onPress={onIgnore}
              activeOpacity={0.7}
            >
              <AppText variant="captionBold" color="secondary">
                Hide
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestButton}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <AppText variant="captionBold" color="white">
                Suggest
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  tag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontWeight: '700',
  },
  messageBox: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    minHeight: 56,
  },
  messageTitle: {
    marginBottom: spacing.xs,
  },
  description: {
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  hideButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  suggestButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.xs + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    ...shadows.sm,
  },
});
