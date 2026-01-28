import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Auth from '../features/auth/AuthNavigator'

const Stack = createNativeStackNavigator()

export default function AuthNavigator() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={Auth} />
        </Stack.Navigator>
    )
}
