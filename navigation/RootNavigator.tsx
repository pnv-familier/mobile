import { NavigationContainer } from '@react-navigation/native'
import AuthNavigator from './AuthNavigator'
import AppNavigator from './AppNavigator'
// import { useAuthStore } from '@/features/auth/store/auth.store'

export default function RootNavigator() {
    // const user = useAuthStore(s => s.user)
    const user = null;

    return (
        <NavigationContainer>
            {user ? <AppNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    )
}
