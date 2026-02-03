import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import FeedNavigator from '../features/feed/FeedNavigator'
import { AppStackParamList } from './types'
import SetupProfileScreen from '../features/user/screen/SetupProfileScreen'
import { useAuthStore } from '../features/auth/store/auth.store'

import FamilyStatusScreen from '../features/family-group/screens/FamilyStatusScreen'
import CreateFamilyScreen from '../features/family-group/screens/CreateFamilyScreen'
import InviteMembersScreen from '../features/family-group/screens/InviteMembersScreen'

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
            <Stack.Screen
                name="FamilyStatus"
                component={FamilyStatusScreen}
            />
            <Stack.Screen
                name="CreateFamily"
                component={CreateFamilyScreen}
            />
            <Stack.Screen
                name="InviteMembers"
                component={InviteMembersScreen}
            />

        </Stack.Navigator>
    )
}
