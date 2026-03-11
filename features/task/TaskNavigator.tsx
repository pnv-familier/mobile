import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoveTaskDetailsScreen from './screens/LoveTaskDetailsScreen';

export type TaskStackParamList = {
  LoveTaskDetails: undefined;
};

const Stack = createNativeStackNavigator<TaskStackParamList>();

export default function TaskNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="LoveTaskDetails" 
        component={LoveTaskDetailsScreen}
        options={{ title: "Love Task Details" }}
      />
    </Stack.Navigator>
  );
}
