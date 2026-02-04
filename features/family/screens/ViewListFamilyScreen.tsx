
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
} from 'react-native';
import {
  ChevronLeft,
  Camera,
  Home,
  MoreVertical,
} from 'lucide-react-native';
import type { RootNavigationProp } from '../../../navigation/types';
import { useFamilyMembers } from '../hooks/useFamilyMembers';
import { useFamilyStore } from '../store/family.store';


const PRIMARY_COLOR = '#FDF2E3';
const ACCENT_COLOR = '#D4A056';


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
          <Text style={styles.familyMeta}>
            {members?.length || 0} members • Created {familyCreatedAt ? new Date(familyCreatedAt).toLocaleDateString() : 'N/A'}
          </Text>
        </View>


        <View style={styles.memberList}>
          {loading ? (
            <ActivityIndicator size="large" color={ACCENT_COLOR} style={{ marginTop: 20 }} />
          ) : (
            members?.map((item: any) => (
              <View key={item.userId} style={styles.memberItem}>
                <Image 
                  source={{ uri: item.avatar || 'https://placekitten.com/100/100' }} 
                  style={styles.memberAvatar} 
                />
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
    backgroundColor: PRIMARY_COLOR,
  },


  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 10,
    backgroundColor: '#FFF',
  },


  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: ACCENT_COLOR,
  },


  profileSection: {
    alignItems: 'center',
    marginVertical: 30,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },

  mainAvatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
  },

  familyAvatar: {
    width: '100%',
    height: '100%',
  },


  cameraBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: ACCENT_COLOR,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFF',
  },


  familyName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },


  familyMeta: {
    fontSize: 16,
    color: '#333',
  },


  memberList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },


  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
  },


  memberAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
  },


  memberInfo: {
    marginLeft: 15,
    flex: 1,
  },


  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
  },


  memberRole: {
    fontSize: 14,
    color: '#999',
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



