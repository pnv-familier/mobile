import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigator from '../features/auth/AuthNavigator'
import AppNavigator from './AppNavigator'
import { useAuthStore } from '../features/auth/store/auth.store'
import { RootStackParamList } from './types'
import FamilyStatusScreen from '../features/family-group/screens/FamilyStatusScreen'
import CreateFamilyScreen from '../features/family-group/screens/CreateFamilyScreen'
import InviteMembersScreen from '../features/family-group/screens/InviteMembersScreen'
import HomeScreen from '../features/feed/screens/HomeScreen'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    const user = useAuthStore(s => s.data)
    console.log('RootNavigator user:', user);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
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
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                />
                {user ? (
                    <Stack.Screen
                        name="App"
                        component={AppNavigator}
                    />
                ) : (
                    <Stack.Screen
                        name="Auth"
                        component={AuthNavigator}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
