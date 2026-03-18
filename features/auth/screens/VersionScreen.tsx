import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import AppScreen from '../../../components/AppScreen';
import AppText from '../../../components/AppText';
import AppButton from '../../../components/AppButton';

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
        : isDev ? 'Development Mode' : 'N/A';

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
        <AppScreen style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#E39A5A" />
                </TouchableOpacity>
                <AppText style={styles.headerTitle}>App Information</AppText>
            </View>

            <View style={styles.content}>
                <View style={styles.infoCard}>
                    <InfoRow label="Native Version" value={nativeVersion} />
                    <InfoRow label="OTA Update ID" value={updateId} />
                    <InfoRow label="Release Channel" value={releaseChannel} />
                    <InfoRow label="Build Date" value={buildDate} />
                    {lastCheck && <InfoRow label="Last Checked" value={lastCheck} />}
                </View>

                <AppButton
                    title={checking ? "Checking..." : "Check for Updates"}
                    onPress={handleCheckUpdate}
                    loading={checking}
                    style={styles.updateBtn}
                />
            </View>
        </AppScreen>
    );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.infoRow}>
        <AppText style={styles.infoLabel}>{label}</AppText>
        <AppText style={styles.infoValue}>{value}</AppText>
    </View>
);

export default VersionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF1DE",
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    backBtn: {
        padding: 8,
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#E39A5A',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 10,
    },
    updateBtn: {
        width: '100%',
        backgroundColor: '#E39A5A',
    },
});
