import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Camera,
  Home,
  Copy,
  Users,
  Calendar,
} from 'lucide-react-native';
import type { RootNavigationProp } from '../../../navigation/types';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { useFamilyStore } from '../store/family.store';
import * as Clipboard from 'expo-clipboard';
import { AppScreen, AppHeader, AppText } from '../../../components';
import { colors, spacing, radius, typography, shadows } from '../../../theme';

interface ViewListFamilyScreenProps {
  navigation: RootNavigationProp;
}

export default function ViewListFamilyScreen({
  navigation,
}: ViewListFamilyScreenProps) {
  const [familyAvatar] = useState<string | null>(
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400'
  );
  const { members, familyCreatedAt, loading } = useFamilyMembers();
  const { familyData, fetchMyFamily } = useFamilyStore();

  useEffect(() => {
    fetchMyFamily();
  }, []);

  const formattedDate = familyCreatedAt
    ? (() => {
        if (Array.isArray(familyCreatedAt)) {
          const [y, m, d] = familyCreatedAt as any;
          return new Date(y, m - 1, d).toLocaleDateString();
        }
        return new Date(familyCreatedAt).toLocaleDateString();
      })()
    : null;

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader
        title="Family members"
        navigation={navigation}
        showBack={true}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Family Hero Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.mainAvatar}>
              {familyAvatar ? (
                <Image source={{ uri: familyAvatar }} style={styles.familyAvatar} />
              ) : (
                <Home size={44} color={colors.primary} />
              )}
            </View>

            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => console.log('Change family avatar')}
              activeOpacity={0.8}
            >
              <Camera size={14} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <AppText variant="heading2" color="brand" align="center" style={styles.familyName}>
            {familyData?.name || 'Family'}
          </AppText>

          {familyData?.inviteCode && (
            <TouchableOpacity
              style={styles.inviteCodeRow}
              onPress={async () => {
                await Clipboard.setStringAsync(familyData.inviteCode);
                Alert.alert('Copied!', 'Invite code copied to clipboard.');
              }}
              activeOpacity={0.7}
            >
              <AppText variant="captionBold" color="brand">
                {familyData.inviteCode}
              </AppText>
              <Copy size={13} color={colors.primary} style={styles.copyIcon} />
            </TouchableOpacity>
          )}

          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Users size={13} color={colors.textSecondary} />
              <AppText variant="caption" color="secondary">
                {members?.length || 0} members
              </AppText>
            </View>

            {formattedDate && (
              <View style={styles.metaBadge}>
                <Calendar size={13} color={colors.textSecondary} />
                <AppText variant="caption" color="secondary">
                  Since {formattedDate}
                </AppText>
              </View>
            )}
          </View>
        </View>

        {/* Member Section Header */}
        <View style={styles.sectionHeader}>
          <AppText variant="bodySmallBold" color="primary">
            Members ({members?.length || 0})
          </AppText>
        </View>

        {/* Member List */}
        <View style={styles.memberList}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
          ) : (
            members?.map((item: any) => (
              <View key={item.userId} style={styles.memberItem}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                ) : (
                  <View style={[styles.memberAvatar, styles.memberAvatarPlaceholder]}>
                    <AppText variant="bodySmallBold" color="brand">
                      {item.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </AppText>
                  </View>
                )}
                <View style={styles.memberInfo}>
                  <AppText variant="bodySmallBold" color="primary">
                    {item.displayName}
                  </AppText>
                  <AppText variant="caption" color="secondary">
                    {item.role}
                  </AppText>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  mainAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  familyAvatar: {
    width: '100%',
    height: '100%',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
    ...shadows.sm,
  },
  familyName: {
    marginBottom: 4,
  },
  inviteCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyIcon: {
    marginLeft: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionHeader: {
    marginBottom: spacing.xs + 2,
    marginLeft: spacing.xs,
  },
  memberList: {
    gap: spacing.sm,
  },
  loader: {
    marginTop: spacing.md,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  memberAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  memberAvatarPlaceholder: {
    backgroundColor: colors.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
});
