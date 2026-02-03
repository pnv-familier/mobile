import { useState } from 'react';
import { Alert } from 'react-native';
import { useFamilyAction } from './useFamilyStatus';
import { useNavigation } from '@react-navigation/native';

export const useCreateFamily = () => {
  const [familyName, setFamilyName] = useState('');
  const { createFamily, loading } = useFamilyAction();
  const navigation = useNavigation<any>();
  const suggestions = ["My family", "Loving family", "Warm nest", "Sunflower"];

  const handleContinue = async () => {
    if (!familyName.trim()) {
      Alert.alert("Error", "Please enter a family name");
      return;
    }

    try {
      const familyData = await createFamily(familyName);
      navigation.navigate('InviteMembers', {
          inviteCode: familyData.inviteCode
      });
    } catch (err: any) {
      Alert.alert("Failed to create family", err.message);
    }
  };

  return {
    familyName,
    setFamilyName,
    loading,
    suggestions,
    handleContinue,
  };
};
