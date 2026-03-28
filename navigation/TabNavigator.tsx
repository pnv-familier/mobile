import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Ionicons } from '@expo/vector-icons'
import SocialNavigator from '../features/social/SocialNavigator'
import { TabStackParamList } from './types'
import ChatNavigator from '../features/chat/ChatNavigator'
import ScheduleNavigator from '../features/schedule/ScheduleNavigator'
import LoveTaskNavigator from '../features/lovetask/LoveTaskNavigator'
import SuggestionNavigator from '../features/suggestion/SuggestionNavigator'
import { useTranslation } from 'react-i18next'

const Tab = createBottomTabNavigator<TabStackParamList>()

export default function TabNavigator() {
    const { t } = useTranslation();
    
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#D4A017',
                tabBarInactiveTintColor: '#999',
                tabBarIcon: ({ color, size }) => {
                    let iconName: any

                    if (route.name === 'Home') iconName = 'home'
                    else if (route.name === 'Chat') iconName = 'chatbubbles'
                    else if (route.name === 'Schedule') iconName = 'calendar'
                    else if (route.name === 'LoveTasks') iconName = 'heart'
                    else if (route.name === 'Suggestions') iconName = 'bulb'

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}
        >
            <Tab.Screen 
                name="Suggestions" 
                component={SuggestionNavigator} 
                options={{ tabBarLabel: t('tabs.suggestions') }}
                listeners={({ navigation }) => ({
                    tabPress: () => navigation.reset({ index: 0, routes: [{ name: 'Suggestions' }] })
                })} 
            />
            <Tab.Screen 
                name="Chat" 
                component={ChatNavigator}
                options={{ tabBarLabel: t('tabs.chat') }}
            />
            <Tab.Screen 
                name="Home" 
                component={SocialNavigator}
                options={{ tabBarLabel: t('tabs.home') }}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        const state = navigation.getState();
                        const homeRoute = state.routes.find(r => r.name === 'Home');
                        if (homeRoute?.state?.index && homeRoute.state.index > 0) {
                            e.preventDefault();
                            navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                        }
                    }
                })} 
            />
            <Tab.Screen 
                name="Schedule" 
                component={ScheduleNavigator}
                options={{ tabBarLabel: t('tabs.schedule') }}
                listeners={({ navigation }) => ({
                    tabPress: () => navigation.reset({ index: 0, routes: [{ name: 'Schedule' }] })
                })} 
            />
            <Tab.Screen 
                name="LoveTasks" 
                component={LoveTaskNavigator}
                options={{ tabBarLabel: t('tabs.loveTasks') }}
                listeners={({ navigation }) => ({
                    tabPress: () => navigation.reset({ index: 0, routes: [{ name: 'LoveTasks' }] })
                })} 
            />
        </Tab.Navigator>
    )
}
