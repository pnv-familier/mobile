import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { joinFamily } from '../service/family.service';
import { useFamilyStore } from '../store/family.store';

export const useJoinFamily = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();
  const { setFamily } = useFamilyStore();

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Error", "Please enter invite code");
      return;
    }

    setLoading(true);
    try {
      const familyData = await joinFamily(inviteCode, '');
      // Update family state
      setFamily(familyData);
      // Navigation will happen automatically due to state change
    } catch (err: any) {
      Alert.alert("Failed to join family", err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    inviteCode,
    setInviteCode,
    loading,
    handleJoin,
  };
};