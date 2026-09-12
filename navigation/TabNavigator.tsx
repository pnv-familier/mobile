import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, MessageCircle, Calendar, Heart, Lightbulb } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SocialNavigator from '../features/social/SocialNavigator';
import { TabStackParamList } from './types';
import ChatNavigator from '../features/chat/ChatNavigator';
import ScheduleNavigator from '../features/schedule/ScheduleNavigator';
import LoveTaskNavigator from '../features/lovetask/LoveTaskNavigator';
import SuggestionNavigator from '../features/suggestion/SuggestionNavigator';
import { useTranslation } from 'react-i18next';
import { colors, spacing, radius, typography, shadows } from '../theme';

const Tab = createBottomTabNavigator<TabStackParamList>();

export default function TabNavigator() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.borderLight,
          height: Platform.OS === 'ios' ? 64 + insets.bottom : 64,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 4 : spacing.xs,
          paddingTop: spacing.xs,
          ...shadows.md,
        },
        tabBarLabelStyle: {
          ...typography.tiny,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ color, focused, size }) => {
          const iconSize = 22;

          if (route.name === 'Home') {
            return (
              <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
                <Home size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            );
          }
          if (route.name === 'Chat') {
            return (
              <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
                <MessageCircle size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            );
          }
          if (route.name === 'Schedule') {
            return (
              <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
                <Calendar size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            );
          }
          if (route.name === 'LoveTasks') {
            return (
              <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
                <Heart size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            );
          }
          if (route.name === 'Suggestions') {
            return (
              <View style={[styles.iconWrapper, focused && styles.activeIconWrapper]}>
                <Lightbulb size={iconSize} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            );
          }

          return null;
        },
      })}
    >
      <Tab.Screen
        name="Suggestions"
        component={SuggestionNavigator}
        options={{ tabBarLabel: t('tabs.suggestions') }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.reset({ index: 0, routes: [{ name: 'Suggestions' }] }),
        })}
      />
      <Tab.Screen
        name="Chat"
        component={ChatNavigator}
        options={{ tabBarLabel: t('tabs.chat') }}
      />
      <Tab.Screen
        name="Home"
        component={SocialNavigator}
        options={{ tabBarLabel: t('tabs.home') }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            const state = navigation.getState();
            const homeRoute = state.routes.find((r: any) => r.name === 'Home');
            if (homeRoute?.state?.index && homeRoute.state.index > 0) {
              e.preventDefault();
              navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
            }
          },
        })}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleNavigator}
        options={{ tabBarLabel: t('tabs.schedule') }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.reset({ index: 0, routes: [{ name: 'Schedule' }] }),
        })}
      />
      <Tab.Screen
        name="LoveTasks"
        component={LoveTaskNavigator}
        options={{ tabBarLabel: t('tabs.loveTasks') }}
        listeners={({ navigation }) => ({
          tabPress: () => navigation.reset({ index: 0, routes: [{ name: 'LoveTasks' }] }),
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderRadius: radius.md,
  },
  activeIconWrapper: {
    backgroundColor: colors.primarySoft,
  },
});
