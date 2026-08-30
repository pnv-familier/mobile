import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { RotateCw } from 'lucide-react-native';
import { AppScreen, AppHeader, AppText, AppButton } from '../../../components';
import { colors, spacing, radius, shadows } from '../../../theme';

const LAST_CHECK_KEY = '@last_update_check';

const VersionScreen = () => {
  const navigation = useNavigation();
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const nativeVersion = Constants.expoConfig?.version || 'Unknown';
  const updateId = Updates.updateId ? Updates.updateId.substring(0, 8) : 'None';
  const releaseChannel = Updates.channel || 'Development';
  const isDev = __DEV__;
  const buildDate = Updates.createdAt
    ? new Date(Updates.createdAt).toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : isDev
    ? 'Development Mode'
    : 'N/A';

  useEffect(() => {
    loadLastCheck();
  }, []);

  const loadLastCheck = async () => {
    try {
      const val = await AsyncStorage.getItem(LAST_CHECK_KEY);
      if (val) setLastCheck(val);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckUpdate = async () => {
    setChecking(true);
    try {
      const update = await Updates.checkForUpdateAsync();
      const now = new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
      await AsyncStorage.setItem(LAST_CHECK_KEY, now);
      setLastCheck(now);

      if (update.isAvailable) {
        Alert.alert(
          'Update Available',
          'A new version is available. Would you like to download and restart?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Update',
              onPress: async () => {
                try {
                  await Updates.fetchUpdateAsync();
                  await Updates.reloadAsync();
                } catch (err) {
                  Alert.alert('Error', 'Failed to fetch update.');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Up to Date', 'You are running the latest version.');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not check for updates. ' + (e as Error).message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <AppScreen edges={['top']} backgroundColor={colors.background}>
      <AppHeader
        title="App Information"
        navigation={navigation}
        showBack={true}
        showNotification={false}
        showProfile={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <InfoRow label="Native Version" value={nativeVersion} />
          <InfoRow label="OTA Update ID" value={updateId} />
          <InfoRow label="Release Channel" value={releaseChannel} />
          <InfoRow label="Build Date" value={buildDate} />
          {lastCheck && <InfoRow label="Last Checked" value={lastCheck} isLast />}
        </View>
      </ScrollView>

      {/* Pinned Bottom CTA */}
      <View style={styles.bottomFooter}>
        <AppButton
          title={checking ? 'Checking...' : 'Check for Updates'}
          variant="primary"
          size="md"
          icon={<RotateCw size={16} color={colors.textLight} />}
          onPress={handleCheckUpdate}
          loading={checking}
          disabled={checking}
          style={styles.updateBtn}
        />
      </View>
    </AppScreen>
  );
};

const InfoRow = ({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View style={[styles.infoRow, isLast && styles.infoRowLast]}>
    <AppText variant="bodySmall" color="muted" style={styles.infoLabel}>
      {label}
    </AppText>
    <AppText variant="bodySmallBold" color="primary" style={styles.infoValue}>
      {value}
    </AppText>
  </View>
);

export default VersionScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    flex: 1,
  },
  infoValue: {
    textAlign: 'right',
    flex: 1,
    marginLeft: spacing.sm,
  },
  bottomFooter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    ...shadows.sm,
  },
  updateBtn: {
    width: '100%',
  },
});
