import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp } from '@react-navigation/native'

// Root Navigator
export type RootStackParamList = {
    Auth: undefined
    App: undefined
}

// Auth Stack
export type AuthStackParamList = {
    Login: undefined
}

// App Stack (Main app after login)
export type AppStackParamList = {
    MainTabs: undefined
    Feed: { feedId?: string }
}

// Tab Navigator
export type TabStackParamList = {
    Home: undefined
}

// Navigation Props Types
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>
export type TabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabStackParamList>,
    NativeStackNavigationProp<AppStackParamList>
>
