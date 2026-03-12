import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp } from '@react-navigation/native'

export type RootStackParamList = {
    Auth: undefined
    App: undefined
    FamilySetup: undefined
}

export type AppStackParamList = {
    SetupProfile: undefined
    MainTabs: undefined
    Home: undefined
    Family: undefined
    Chat: undefined
}

export type TabStackParamList = {
    Home: undefined
    Chat: undefined
    Schedule: undefined
}

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>
export type TabNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<TabStackParamList>,
    NativeStackNavigationProp<AppStackParamList>
>
