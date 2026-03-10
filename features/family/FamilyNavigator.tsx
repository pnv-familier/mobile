import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FamilyParamsList } from "./types";
import FamilyStatusScreen from "./screens/FamilyStatusScreen";
import CreateFamilyScreen from "./screens/CreateFamilyScreen";
import InviteMembersScreen from "./screens/InviteMembersScreen";
import JoinFamilyScreen from "./screens/JoinFamilyScreen";
import CreateLoveTaskScreen from "./screens/CreateLoveTaskScreen";

const Stack = createNativeStackNavigator<FamilyParamsList>()

export default function FamilyNavigator() {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="FamilyStatus"
                component={FamilyStatusScreen}
            />
            <Stack.Screen
                name="CreateFamily"
                component={CreateFamilyScreen}
            />
            <Stack.Screen
                name="InviteMembers"
                component={InviteMembersScreen}
            />
            <Stack.Screen
                name="JoinFamily"
                component={JoinFamilyScreen}
            />
            <Stack.Screen
                name="CreateLoveTask"
                component={CreateLoveTaskScreen}
            />
        </Stack.Navigator>
    )
}
