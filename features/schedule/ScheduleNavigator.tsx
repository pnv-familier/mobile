import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FamilySchedule from './screens/FamilySchedule';

const Stack = createNativeStackNavigator();

export default function ScheduleNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FamilySchedule" component={FamilySchedule} />
    </Stack.Navigator>
  );
}
