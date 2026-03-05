import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FeedScreen from './screens/FeedScreen'
import ViewListFamilyScreen from '../family/screens/ViewListFamilyScreen'
import ChatScreen from '../chat/screens/ChatScreen'

const Stack = createNativeStackNavigator()

const SocialNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FeedScreen" component={FeedScreen} />
            <Stack.Screen name="ViewListFamily" component={ViewListFamilyScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    )
}

export default SocialNavigator