import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoveTasksScreen from './screens/LoveTasksScreen';

const Stack = createNativeStackNavigator();

export default function LoveTaskNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoveTasks" component={LoveTasksScreen} />
    </Stack.Navigator>
  );
}
