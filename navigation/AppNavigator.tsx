import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import FeedNavigator from '../features/feed/FeedNavigator'
import { AppStackParamList } from './types'
import SetupProfileScreen from '../features/user/screen/SetupProfileScreen'
import { useAuthStore } from '../features/auth/store/auth.store'

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppNavigator() {
    const isSetup = useAuthStore((state) => state.data?.setup)
    console.log('AppNavigator isSetup:', isSetup);

    return (
        <Stack.Navigator>
            {isSetup ? (
                <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
            ) : (
                <Stack.Screen name="SetupProfile" component={SetupProfileScreen} options={{ headerShown: false }} />
            )}
    
            <Stack.Screen
                name="Feed"
                component={FeedNavigator}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    )
}
