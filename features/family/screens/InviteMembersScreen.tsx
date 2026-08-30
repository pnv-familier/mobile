import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Copy, Share2 } from 'lucide-react-native';
import { useInviteMembers } from '../hooks/useInviteMembers';
import { AppScreen, AppHeader, AppText, AppButton } from '../../../components';
import { colors, spacing, radius, shadows } from '../../../theme';

export default function InviteMembersScreen({ route }: any) {
  const { inviteCode } = route.params || { inviteCode: 'FAM-XXXX-0000' };
  const { onShare, onCopy, handleFinish, goBack } = useInviteMembers(inviteCode);

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader
        title="Invite members"
        showBack={true}
        onBackPress={goBack}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Brand Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title & Subtitle */}
        <AppText variant="heading2" color="brand" align="center" style={styles.mainTitle}>
          Invite your family to join
        </AppText>
        <AppText
          variant="caption"
          color="secondary"
          align="center"
          style={styles.subtitle}
        >
          Share the code or link to invite members
        </AppText>

        {/* Compact Family Code Card */}
        <View style={styles.codeCard}>
          <AppText variant="captionBold" color="secondary" style={styles.codeLabel}>
            Your family code
          </AppText>
          <AppText variant="heading2" color="brand" style={styles.codeText}>
            {inviteCode}
          </AppText>

          <View style={styles.actionRow}>
            <AppButton
              title="Copy"
              variant="secondary"
              size="sm"
              icon={<Copy size={15} color={colors.primary} />}
              onPress={onCopy}
              style={styles.codeActionBtn}
            />

            <AppButton
              title="Share"
              variant="primary"
              size="sm"
              icon={<Share2 size={15} color={colors.textLight} />}
              onPress={onShare}
              style={styles.codeActionBtn}
            />
          </View>
        </View>
      </ScrollView>

      {/* Pinned Bottom Actions */}
      <View style={styles.bottomFooter}>
        <AppButton
          title="Continue"
          variant="primary"
          size="md"
          onPress={handleFinish}
          style={styles.mainBtn}
        />

        <TouchableOpacity style={styles.skipBtn} onPress={handleFinish} activeOpacity={0.7}>
          <AppText variant="captionBold" color="muted">
            Skip this, we'll continue later
          </AppText>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
  },
  mainTitle: {
    marginBottom: 2,
  },
  subtitle: {
    marginBottom: spacing.lg,
    maxWidth: 240,
  },
  codeCard: {
    backgroundColor: colors.surface,
    width: '100%',
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  codeLabel: {
    marginBottom: 2,
  },
  codeText: {
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.sm,
  },
  codeActionBtn: {
    flex: 1,
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  mainBtn: {
    width: '100%',
  },
  skipBtn: {
    alignItems: 'center',
    marginTop: spacing.xs + 2,
    paddingVertical: spacing.xs,
  },
});
