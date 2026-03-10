import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import SocialNavigator from '../features/social/SocialNavigator'
import { TabStackParamList } from './types'
import ChatNavigator from '../features/chat/ChatNavigator'
import CreateLoveTaskScreen from '../features/family/screens/CreateLoveTaskScreen'

const Tab = createBottomTabNavigator<TabStackParamList>()

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: any

                    if (route.name === 'Home') iconName = 'home'
                    else if (route.name === 'Chat') iconName = 'chatbubbles'
                    else if (route.name === 'LoveTask') iconName = 'link'

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
        >
            <Tab.Screen name="Home" component={SocialNavigator} />
            <Tab.Screen name="Chat" component={ChatNavigator} />
            <Tab.Screen name="LoveTask" component={CreateLoveTaskScreen} />
        </Tab.Navigator>
    )
}
