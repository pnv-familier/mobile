import { useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFamilyAction } from './useFamilyStatus';
import { useNavigation } from '@react-navigation/native';

export const useCreateFamily = () => {
  const [familyName, setFamilyName] = useState('');
  const [validationError, setValidationError] = useState('');
  const { createFamily, loading } = useFamilyAction();
  const navigation = useNavigation<any>();
  const suggestions = ["My family", "Loving family", "Warm nest", "Sunflower"];

  useEffect(() => {
    if (familyName.length > 0) {
      validateName(familyName);
    } else {
      setValidationError('');
    }
  }, [familyName]);

  const validateName = (name: string): boolean => {
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setValidationError('Family name must be at least 2 characters.');
      return false;
    }
    if (trimmedName.length > 30) {
      setValidationError('Family name cannot exceed 30 characters.');
      return false;
    }
    if (!/^(?=.*[a-zA-Z]).+$/.test(trimmedName)) {
      setValidationError('Family name must contain at least one letter.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const isFormValid = useMemo(() => {
    return familyName.trim().length >= 2 && validationError === '';
  }, [familyName, validationError]);

  const handleContinue = async () => {
    if (!validateName(familyName)) {
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

  const handleInputFocus = () => {
    if (validationError) {
      setValidationError('');
    }
  };

  return {
    familyName,
    setFamilyName,
    loading,
    suggestions,
    handleContinue,
    validationError,
    isFormValid,
    handleInputFocus,
  };
};
