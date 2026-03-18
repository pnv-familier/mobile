import { useState } from "react";
import { Alert } from "react-native";
import { useAuthStore } from "../../auth/store/auth.store";
import { userService } from "../service/user.service";
import { HOBBY_LIST } from "../constant/hobbyList";
import { useNavigation } from "@react-navigation/native";

const isValidDateOfBirth = (day: number, month: number, year: number): boolean => {
    const today = new Date();
    const dob = new Date(year, month - 1, day);
    
    if (dob > today) return false;
    if (year < 1900) return false;
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    
    const age = today.getFullYear() - year;
    if (age < 1) return false;
    
    return true;
};

export const useSetupProfile = () => {
    const updateIsSetup = useAuthStore((state) => state.updateIsSetUp);

    const [dateOfBirth, setDateOfBirth] = useState({ day: 1, month: 1, year: new Date().getFullYear() - 20 });
    const [gender, setGender] = useState("");
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

    const onSaveProfile = async () => {
        if (!gender) {
            Alert.alert("Error", "Please select your gender");
            return;
        }

        if (!isValidDateOfBirth(dateOfBirth.day, dateOfBirth.month, dateOfBirth.year)) {
            Alert.alert("Invalid Date", "Please enter a valid date of birth. You must be at least 1 year old.");
            return;
        }

        setLoading(true);
        try {
            const dob = `${dateOfBirth.year}-${dateOfBirth.month.toString().padStart(2, '0')}-${dateOfBirth.day.toString().padStart(2, '0')}`;
            const response = await userService.updateProfile({
                dateOfBirth: dob,
                gender,
                hobbies: selectedHobbies
            });
            updateIsSetup(response.data.setup);
            Alert.alert("Success", "Profile created successfully!");
        } catch (error: any) {
            console.error("Update failed", error);
            Alert.alert("Error", error.message || "Could not create profile");
        } finally {
            setLoading(false);
        }
    };

    return {
        dateOfBirth,
        setDateOfBirth,
        gender,
        setGender,
        selectedHobbies,
        toggleHobby,
        onSaveProfile,
        loading
    };
};
