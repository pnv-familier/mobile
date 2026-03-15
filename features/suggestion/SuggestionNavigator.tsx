import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SuggestionsScreen from './screens/SuggestionsScreen';
import SuggestionDetailScreen from './screens/SuggestionDetailScreen';

const Stack = createNativeStackNavigator();

export default function SuggestionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SuggestionList" component={SuggestionsScreen} />
      <Stack.Screen name="SuggestionDetail" component={SuggestionDetailScreen} />
    </Stack.Navigator>
  );
}
