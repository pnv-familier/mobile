import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoveTasksScreen from './screens/LoveTasksScreen';
import TaskDetailScreen from './screens/TaskDetailScreen';
import CreateLoveTaskScreen from './screens/CreateLoveTaskScreen';

const Stack = createNativeStackNavigator();

export default function LoveTaskNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoveTasksScreen" component={LoveTasksScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailScreen} />
      <Stack.Screen name="CreateLoveTask" component={CreateLoveTaskScreen} />
    </Stack.Navigator>
  );
}
