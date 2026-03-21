
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  ChevronLeft,
  Camera,
  Home,
  MoreVertical,
  Copy,
} from 'lucide-react-native';
import type { RootNavigationProp } from '../../../navigation/types';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { useFamilyStore } from '../store/family.store';
import * as Clipboard from 'expo-clipboard';


const BACKGROUND_COLOR = '#FFF4E6';
const ACCENT_COLOR = '#D4A056';
const TEXT_COLOR = '#4A3428';


interface ViewListFamilyScreenProps {
  navigation: RootNavigationProp;
}


export default function ViewListFamilyScreen({
  navigation,
}: ViewListFamilyScreenProps) {
  const [familyAvatar, setFamilyAvatar] = useState<string | null>(
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400'
  );
  const { members, familyCreatedAt, loading } = useFamilyMembers();
  const { familyData, fetchMyFamily } = useFamilyStore();

  useEffect(() => {
    fetchMyFamily();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={28} color={ACCENT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Family members</Text>
        <View style={{ width: 28 }} />
      </View>


      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.mainAvatar}>
              {familyAvatar ? (
                <Image source={{ uri: familyAvatar }} style={styles.familyAvatar} />
              ) : (
                <Home size={60} color={ACCENT_COLOR} />
              )}
            </View>


            <TouchableOpacity
              style={styles.cameraBtn}
              onPress={() => console.log('Change family avatar')}
            >
              <Camera size={18} color="#FFF" />
            </TouchableOpacity>
          </View>


          <Text style={styles.familyName}>{familyData?.name || 'Family'}</Text>
          {familyData?.inviteCode && (
            <TouchableOpacity
              style={styles.inviteCodeRow}
              onPress={async () => {
                await Clipboard.setStringAsync(familyData.inviteCode);
                Alert.alert('Copied!', 'Invite code copied to clipboard.');
              }}
            >
              <Text style={styles.inviteCodeText}>{familyData.inviteCode}</Text>
              <Copy size={14} color={ACCENT_COLOR} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          )}
          <Text style={styles.familyMeta}>
            {members?.length || 0} members • Created {familyCreatedAt 
              ? (() => {
                  if (Array.isArray(familyCreatedAt)) {
                    const [y, m, d] = familyCreatedAt as any;
                    return new Date(y, m - 1, d).toLocaleDateString();
                  }
                  return new Date(familyCreatedAt).toLocaleDateString();
                })()
              : 'N/A'}
          </Text>
        </View>


        <View style={styles.memberList}>
          {loading ? (
            <ActivityIndicator size="large" color={ACCENT_COLOR} style={{ marginTop: 20 }} />
          ) : (
            members?.map((item: any) => (
              <View key={item.userId} style={styles.memberItem}>
                {item.avatar ? (
                  <Image source={{ uri: item.avatar }} style={styles.memberAvatar} />
                ) : (
                  <View style={[styles.memberAvatar, styles.memberAvatarPlaceholder]}>
                    <Text style={styles.memberAvatarText}>
                      {item.displayName?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                  </View>
                )}
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{item.displayName}</Text>
                  <Text style={styles.memberRole}>{item.role}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={20} color="#999" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const TabItem = ({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <TouchableOpacity style={styles.tabItem}>
    {icon}
    <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
      {label}
    </Text>
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },


  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 15,
    backgroundColor: BACKGROUND_COLOR,
  },


  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: TEXT_COLOR,
  },


  profileSection: {
    alignItems: 'center',
    marginVertical: 25,
    paddingHorizontal: 20,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },

  mainAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 3,
    borderColor: '#FFF',
  },

  familyAvatar: {
    width: '100%',
    height: '100%',
  },


  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: ACCENT_COLOR,
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: BACKGROUND_COLOR,
    elevation: 2,
  },


  familyName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: TEXT_COLOR,
  },
  inviteCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FFDAB9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  inviteCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: ACCENT_COLOR,
    letterSpacing: 1,
  },


  familyMeta: {
    fontSize: 14,
    color: '#666',
  },


  memberList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },


  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#FFDAB9',
  },


  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberAvatarPlaceholder: {
    backgroundColor: '#FFDAB9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },


  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },


  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR,
    marginBottom: 2,
  },


  memberRole: {
    fontSize: 13,
    color: '#888',
  },

  memberDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },


  bottomTab: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
  },


  tabItem: {
    alignItems: 'center',
  },


  tabLabel: {
    fontSize: 12,
    color: ACCENT_COLOR,
    marginTop: 4,
  },


  activeTabLabel: {
    fontWeight: 'bold',
  },

  moreButton: {
    padding: 8,
  },
});



