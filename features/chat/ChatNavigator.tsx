import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChatScreen from './screens/ChatScreen'

const Stack = createNativeStackNavigator()

const ChatNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
    )
}

export default ChatNavigator