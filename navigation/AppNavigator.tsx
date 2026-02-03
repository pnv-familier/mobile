import { createNativeStackNavigator } from '@react-navigation/native-stack'
import TabNavigator from './TabNavigator'
import { AppStackParamList } from './types'
import SetupProfileScreen from '../features/user/screen/SetupProfileScreen'
import { useAuthStore } from '../features/auth/store/auth.store'
import FamilyNavigator from '../features/family/FamilyNavigator'
import { useFamilyStore } from '../features/family/store/family.store'

const Stack = createNativeStackNavigator<AppStackParamList>()

export default function AppNavigator() {
    const isSetup = useAuthStore((state) => state.data?.setup)
    const hasFamily = useFamilyStore((state) => state.hasFamily)
    console.log('AppNavigator isSetup:', isSetup);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isSetup ? (
                <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
            ) : !hasFamily ? (
                <Stack.Screen name="Family" component={FamilyNavigator} />
            ) : (
                <Stack.Screen name="MainTabs" component={TabNavigator} />
            )}
        </Stack.Navigator>
    )
}
