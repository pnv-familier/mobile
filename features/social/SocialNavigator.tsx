import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FeedScreen from './screens/FeedScreen'

const Stack = createNativeStackNavigator()

const SocialNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FeedScreen" component={FeedScreen} />
        </Stack.Navigator>


    )
}

export default SocialNavigator