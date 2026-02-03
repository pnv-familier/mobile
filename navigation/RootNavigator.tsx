import { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AuthNavigator from '../features/auth/AuthNavigator'
import AppNavigator from './AppNavigator'
import { useAuthStore } from '../features/auth/store/auth.store'
import { RootStackParamList } from './types'
import { useFamilyStore } from '../features/family/store/family.store'

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    const user = useAuthStore(s => s.data)
    const { hasFamily, fetchMyFamily } = useFamilyStore()

    useEffect(() => {
        if (user) {
            fetchMyFamily()
        }
    }, [user])

    console.log('RootNavigator user:', user);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen
                        name="Auth"
                        component={AuthNavigator}
                    />
                ) : (
                    <Stack.Screen
                        name="App"
                        component={AppNavigator}
                    />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}
