import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateFeedScreen from './screens/CreateFeedScreen'

const Stack = createNativeStackNavigator()

const FeedNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CreateFeedScreen" component={CreateFeedScreen} />
        </Stack.Navigator>


    )
}

export default FeedNavigator