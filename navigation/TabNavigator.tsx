import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import HomeScreen from '../features/feed/screens/HomeScreen'
import { TabStackParamList } from './types'

const Tab = createBottomTabNavigator<TabStackParamList>()

export default function TabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName: any

                    if (route.name === 'Home') iconName = 'home'

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
        </Tab.Navigator>
    )
}
