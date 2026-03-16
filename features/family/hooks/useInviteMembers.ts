import { Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFamilyStore } from '../store/family.store';
import * as Clipboard from 'expo-clipboard';

export const useInviteMembers = (inviteCode: string) => {
  const navigation = useNavigation<any>();
  const fetchMyFamily = useFamilyStore((state) => state.fetchMyFamily);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join my family on Familier! 👨👩👧👦\n\nInvite code: ${inviteCode}`,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const onCopy = async () => {
    await Clipboard.setStringAsync(inviteCode);
    Alert.alert('Copied!', 'Invite code copied to clipboard.');
  };

  const handleFinish = async () => {
    await fetchMyFamily();
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    onShare,
    onCopy,
    handleFinish,
    goBack,
  };
};
