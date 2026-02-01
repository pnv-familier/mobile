import { useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "../../auth/store/auth.store";
import { userService } from "../service/user.service";
import { HOBBY_LIST } from "../constant/hobbyList";
import { useNavigation } from "@react-navigation/native";

export const useSetupProfile = () => {
    const updateIsSetup = useAuthStore((state) => state.updateIsSetUp);

    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleHobby = (hobby: string) => {
        setSelectedHobbies((prev) => {
            if (prev.includes(hobby)) {
                return prev.filter((h) => h !== hobby);
            }

            if (prev.length >= 5) {
                Alert.alert("Limit Reached", "You can only select up to 5 hobbies.");
                return prev;
            }

            return [...prev, hobby];
        });
    };

    const onContinue = async () => {
        setLoading(true);
        try {
            const response = await userService.updateProfile({ hobbies: selectedHobbies });
            updateIsSetup(response.data.setup);

            Alert.alert("Success", "Your hobbies have been updated!");
        } catch (error: any) {
            console.error("Update failed", error);
            Alert.alert("Error", error.message || "Could not update profile");
        } finally {
            setLoading(false);
        }
    };

    return {
        hobbiesList: HOBBY_LIST,
        selectedHobbies,
        toggleHobby,
        onContinue,
        loading
    };
};