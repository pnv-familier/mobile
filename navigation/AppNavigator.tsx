import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import FeedNavigator from '../features/feed/FeedNavigator'
import { AppStackParamList } from './types'

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Feed"
                component={FeedNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}
