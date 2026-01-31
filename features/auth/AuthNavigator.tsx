import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ReferenceScreen from './screens/ReferenceScreen'

const Stack = createNativeStackNavigator()

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Reference" component={ReferenceScreen} />
        </Stack.Navigator>
    )
}

export default AuthNavigator