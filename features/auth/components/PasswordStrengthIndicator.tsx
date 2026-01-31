import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PasswordStrength } from '../utils/password';

type Props = {
  strength: PasswordStrength;
};

const strengthLevels = {
  weak: { text: 'Weak', color: '#FF4136' },
  medium: { text: 'Medium', color: '#FFDC00' },
  strong: { text: 'Strong', color: '#2ECC40' },
  '': { text: '', color: 'transparent' }
};

const PasswordStrengthIndicator = ({ strength }: Props) => {
  if (!strength) {
    return null;
  }

  const { text, color } = strengthLevels[strength];

  return (
    <View style={styles.container}>
      <Text style={styles.strengthText}>
        Password strength: <Text style={{ color }}>{text}</Text>
      </Text>
      <View style={styles.strengthBarContainer}>
        <View
          style={[
            styles.strengthBar,
            {
              backgroundColor: color,
              width: strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  strengthText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  strengthBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
  },
  strengthBar: {
    height: 4,
    borderRadius: 2,
  },
});

export default PasswordStrengthIndicator;
