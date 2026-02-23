import { Share, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFamilyStore } from '../store/family.store';

export const useInviteMembers = (inviteCode: string) => {
  const navigation = useNavigation<any>();
  const fetchMyFamily = useFamilyStore((state) => state.fetchMyFamily);

  const onShare = async () => {
    try {
      await Share.share({
        message: `Join my family on Familier! 👨‍👩‍👧‍👦\n\nInvite code: ${inviteCode}`,
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const onShowCode = () => {
    Alert.alert(
      'Family Invite Code',
      inviteCode,
      [{ text: 'OK' }],
      { cancelable: true }
    );
  };

  const handleFinish = async () => {
    await fetchMyFamily();
  };

  const goBack = () => {
      navigation.goBack();
  }

  return {
    onShare,
    onShowCode,
    handleFinish,
    goBack
  };
};
