import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
  ScrollView,
  StyleProp,
} from 'react-native';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

export interface AppScreenProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  edges?: Edge[];
  avoidKeyboard?: boolean;
  keyboardVerticalOffset?: number;
  scrollable?: boolean;
  backgroundColor?: string;
}

export default function AppScreen({
  children,
  style,
  contentContainerStyle,
  edges = ['top', 'bottom'],
  avoidKeyboard = false,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0,
  scrollable = false,
  backgroundColor = colors.background,
}: AppScreenProps) {
  const insets = useSafeAreaInsets();

  const safePadding: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  const containerContent = scrollable ? (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.container, style]}>{children}</View>
  );

  return (
    <View style={[styles.root, { backgroundColor }, safePadding]}>
      {avoidKeyboard ? (
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          {containerContent}
        </KeyboardAvoidingView>
      ) : (
        containerContent
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});
