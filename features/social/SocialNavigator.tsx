import { createNativeStackNavigator } from '@react-navigation/native-stack'
import FeedScreen from './screens/FeedScreen'
import ViewListFamilyScreen from '../family/screens/ViewListFamilyScreen'

const Stack = createNativeStackNavigator()

const SocialNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="FeedScreen" component={FeedScreen} />
            <Stack.Screen name="ViewListFamily" component={ViewListFamilyScreen} />
        </Stack.Navigator>
    )
}

export default SocialNavigator