import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuggestionsScreen from './screens/SuggestionsScreen';
import SuggestionDetailScreen from './screens/SuggestionDetailScreen';
import CreateEventScreen from '../schedule/screens/CreateEventScreen';
import CreateLoveTaskScreen from '../lovetask/screens/CreateLoveTaskScreen';

const Stack = createNativeStackNavigator();

export default function SuggestionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SuggestionList" component={SuggestionsScreen} />
      <Stack.Screen name="SuggestionDetail" component={SuggestionDetailScreen} />
      <Stack.Screen name="SuggestionCreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="SuggestionCreateLoveTask" component={CreateLoveTaskScreen} />
    </Stack.Navigator>
  );
}
