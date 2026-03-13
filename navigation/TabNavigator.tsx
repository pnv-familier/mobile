import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import SocialNavigator from '../features/social/SocialNavigator'
import { TabStackParamList } from './types'
import ChatNavigator from '../features/chat/ChatNavigator'
import ScheduleNavigator from '../features/schedule/ScheduleNavigator'
import LoveTaskNavigator from '../features/lovetask/LoveTaskNavigator'

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
                    else if (route.name === 'Schedule') iconName = 'calendar'
                    else if (route.name === 'LoveTasks') iconName = 'heart'

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
        >
            <Tab.Screen name="Home" component={SocialNavigator} />
            <Tab.Screen name="Chat" component={ChatNavigator} />
            <Tab.Screen name="Schedule" component={ScheduleNavigator} />
            <Tab.Screen name="LoveTasks" component={LoveTaskNavigator} />
        </Tab.Navigator>
    )
}
