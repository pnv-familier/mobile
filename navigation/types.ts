import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp } from '@react-navigation/native'

export type RootStackParamList = {
    Auth: undefined
    App: undefined
}

export type AuthStackParamList = {
    Login: undefined
}

export type AppStackParamList = {
    SetupProfile: undefined
    MainTabs: undefined
    Feed: { feedId?: string }
}

export type TabStackParamList = {
    Home: undefined
}

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>
export type TabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabStackParamList>,
    NativeStackNavigationProp<AppStackParamList>
>
