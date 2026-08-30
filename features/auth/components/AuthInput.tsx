import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import AppText from '../../../components/AppText';
import { capitalizeFirstLetter } from '../../../utils/string';
import { colors, radius, spacing, typography, shadows } from '../../../theme';

type Props = {
  icon?: 'mail' | 'lock' | 'user';
  error?: string;
  secure?: boolean;
} & TextInputProps;

export default function AuthInput({ icon, error, secure, ...props }: Props) {
  const [hidden, setHidden] = useState(secure);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.wrapper,
          error ? styles.wrapperError : styles.wrapperNormal,
        ]}
      >
        {icon === 'mail' && <Mail size={18} color={colors.primary} />}
        {icon === 'lock' && <Lock size={18} color={colors.primary} />}
        {icon === 'user' && <User size={18} color={colors.primary} />}

        <TextInput
          placeholderTextColor={colors.textPlaceholder}
          secureTextEntry={hidden}
          style={styles.input}
          {...props}
        />

        {secure && (
          <TouchableOpacity
            onPress={() => setHidden(!hidden)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {hidden ? (
              <EyeOff size={18} color={colors.textMuted} />
            ) : (
              <Eye size={18} color={colors.primary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <AppText variant="tiny" color="error" style={styles.errorText}>
          {capitalizeFirstLetter(error)}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
    width: '100%',
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    ...shadows.sm,
  },
  wrapperNormal: {
    borderColor: colors.borderLight,
  },
  wrapperError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    marginLeft: spacing.sm,
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  errorText: {
    marginTop: 3,
    marginLeft: 4,
  },
});