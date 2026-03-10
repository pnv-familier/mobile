import React from "react";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AppScreen from "../../../components/AppScreen";
import AppText from "../../../components/AppText";
import AppButton from "../../../components/AppButton";
import { RELATIONSHIP_LIST } from "../../user/constant/relationshipList";
import { useJoinFamily } from "../hooks/useJoinFamily";

const JoinFamilyScreen = () => {
    const navigation = useNavigation();
    const {
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
    } = useJoinFamily();

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <AppText style={styles.stepTitle}>Enter Family Code</AppText>
            <AppText style={styles.stepSubtitle}>Ask your family admin for the invite code</AppText>

            <View style={styles.inputCard}>
                <AppText style={styles.inputLabel}>Family Code</AppText>
                <View style={styles.inputWrapper}>
                    <Feather name="key" size={18} color="#E39A5A" />
                    <TextInput
                        placeholder="e.g., FAM-ABC-1234"
                        placeholderTextColor="#B8860B"
                        style={styles.textInput}
                        value={joinCode}
                        onChangeText={setJoinCode}
                        editable={!loading}
                    />
                </View>
            </View>

            <AppButton
                title={loading ? "Checking..." : "Continue"}
                style={styles.continueButton}
                onPress={fetchFamilyPreview}
                disabled={!joinCode.trim() || loading}
            />
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <AppText style={styles.stepTitle}>Join Family</AppText>

            {familyPreview && (
                <View style={styles.familyCard}>
                    <View style={styles.familyHeader}>
                        <Image
                            source={{ uri: familyPreview.admin.avatarUrl }}
                            style={styles.adminAvatar}
                        />
                        <View style={styles.familyInfo}>
                            <AppText style={styles.familyName}>{familyPreview.familyName}</AppText>
                            <AppText style={styles.adminName}>Admin: {familyPreview.admin.fullName}</AppText>
                            <AppText style={styles.memberCount}>{familyPreview.memberCount} members</AppText>
                        </View>
                    </View>
                </View>
            )}

            <View style={styles.inputCard}>
                <AppText style={styles.inputLabel}>Your Relationship to {familyPreview?.admin.fullName}</AppText>
                <AppText style={styles.inputSubtext}>Select your relationship to the family creator</AppText>
                <ScrollView style={styles.relationshipScroll} scrollEnabled={true} nestedScrollEnabled={true}>
                    {RELATIONSHIP_LIST.map((item) => (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => setRelationship(item.key)}
                            style={[
                                styles.relationshipCard,
                                relationship === item.key && styles.relationshipCardActive
                            ]}
                        >
                            <View style={styles.relationshipIconContainer}>
                                <Feather
                                    name={item.icon as any}
                                    size={24}
                                    color={relationship === item.key ? "#fff" : "#E39A5A"}
                                />
                            </View>
                            <AppText style={[
                                styles.relationshipText,
                                relationship === item.key && styles.relationshipTextActive
                            ]}>
                                {item.label}
                            </AppText>
                            {relationship === item.key && (
                                <Feather name="check-circle" size={20} color="#fff" />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.buttonRow}>
                <AppButton
                    title="Back"
                    style={styles.backButton}
                    onPress={goBack}
                />
                <AppButton
                    title={loading ? "Joining..." : "Join Family"}
                    style={styles.joinButton}
                    onPress={joinFamilyWithRelationshipHandler}
                    disabled={!relationship || loading}
                />
            </View>
        </View>
    );

    return (
        <AppScreen style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButtonHeader} onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={22} color="#E39A5A" />
                </TouchableOpacity>
                <Feather name="users" size={32} color="#E39A5A" />
                <AppText style={styles.headerTitle}>Join Your Family</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {step === 1 ? renderStep1() : renderStep2()}
            </ScrollView>
        </AppScreen>
    );
};

export default JoinFamilyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF8E7",
    },
    header: {
        alignItems: "center",
        paddingVertical: 30,
        paddingHorizontal: 24,
    },
    backButtonHeader: {
        position: "absolute",
        left: 24,
        top: 30,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#E39A5A",
        textAlign: "center",
        marginTop: 12,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    stepContainer: {
        flex: 1,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#E39A5A",
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 14,
        color: "#B8860B",
        marginBottom: 24,
    },
    inputCard: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: "#E39A5A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "600",
        color: "#E39A5A",
        marginBottom: 4,
    },
    inputSubtext: {
        fontSize: 12,
        color: "#B8860B",
        marginBottom: 16,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: "rgba(240, 183, 133, 0.1)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(227, 154, 90, 0.2)",
    },
    textInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#333",
    },
    familyCard: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        shadowColor: "#E39A5A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    familyHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    adminAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    familyInfo: {
        flex: 1,
    },
    familyName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#E39A5A",
        marginBottom: 4,
    },
    adminName: {
        fontSize: 13,
        color: "#B8860B",
        marginBottom: 2,
    },
    memberCount: {
        fontSize: 12,
        color: "#B8860B",
    },
    relationshipScroll: {
        height: 200,
        flexGrow: 0,
    },
    relationshipCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 12,
        padding: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: "rgba(227, 154, 90, 0.2)",
    },
    relationshipCardActive: {
        backgroundColor: "#E39A5A",
        borderColor: "#E39A5A",
    },
    relationshipIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "rgba(240, 183, 133, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    relationshipText: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: "#E39A5A",
    },
    relationshipTextActive: {
        color: "#fff",
    },
    buttonRow: {
        flexDirection: "row",
        gap: 12,
        marginTop: 24,
    },
    continueButton: {
        marginTop: 24,
        backgroundColor: "#E39A5A",
        borderRadius: 16,
    },
    backButton: {
        flex: 1,
        backgroundColor: "rgba(240, 183, 133, 0.3)",
        borderRadius: 16,
    },
    joinButton: {
        flex: 2,
        backgroundColor: "#E39A5A",
        borderRadius: 16,
    },
});
