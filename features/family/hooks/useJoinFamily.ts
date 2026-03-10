import { useState } from "react";
import { Alert } from "react-native";
import { useFamilyStore } from "../store/family.store";
import { getFamilyPreview, joinFamilyWithRelationship } from "../service/family.service";
import { FamilyPreview } from "../types";

export const useJoinFamily = () => {
    const setFamily = useFamilyStore((state) => state.setFamily);
    const [joinCode, setJoinCode] = useState("");
    const [familyPreview, setFamilyPreview] = useState<FamilyPreview | null>(null);
    const [relationship, setRelationship] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const fetchFamilyPreview = async () => {
        if (!joinCode.trim()) {
            Alert.alert("Error", "Please enter a family code");
            return;
        }

        setLoading(true);
        try {
            const response = await getFamilyPreview(joinCode);
            setFamilyPreview(response.data);
            setStep(2);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Invalid family code");
        } finally {
            setLoading(false);
        }
    };

    const joinFamilyWithRelationshipHandler = async () => {
        if (!relationship) {
            Alert.alert("Error", "Please select your relationship");
            return;
        }

        if (!familyPreview) {
            Alert.alert("Error", "Family information is missing");
            return;
        }

        setLoading(true);
        try {
            const code = joinCode.trim();
            if (!code) {
                Alert.alert("Error", "Family code is empty");
                setLoading(false);
                return;
            }
            await joinFamilyWithRelationship(code, relationship);
            Alert.alert("Success", "You have joined the family!");
            setFamily({} as any);
        } catch (error: any) {
            Alert.alert("Error", error.message || "Could not join family");
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        setStep(1);
        setFamilyPreview(null);
        setRelationship("");
        setJoinCode("");
    };

    return {
        joinCode,
        setJoinCode,
        familyPreview,
        relationship,
        setRelationship,
        loading,
        step,
        fetchFamilyPreview,
        joinFamilyWithRelationshipHandler,
        goBack
    };
};
