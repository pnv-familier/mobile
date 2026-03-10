import React from "react"
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import AppScreen from "../../../components/AppScreen"
import AppText from "../../../components/AppText"
import AppButton from "../../../components/AppButton"
import { GENDER_LIST } from "../constant/genderList"
import { HOBBY_LIST } from "../constant/hobbyList"
import { useSetupProfile } from "../hook/setupProfile"

const SetupProfileScreen = () => {
    const {
        dateOfBirth,
        setDateOfBirth,
        gender,
        setGender,
        selectedHobbies,
        toggleHobby,
        onSaveProfile,
        loading
    } = useSetupProfile()

    const [showDayPicker, setShowDayPicker] = React.useState(false)
    const [showMonthPicker, setShowMonthPicker] = React.useState(false)
    const [showYearPicker, setShowYearPicker] = React.useState(false)

    const days = Array.from({ length: 31 }, (_, i) => i + 1)
    const months = [
        { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
        { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
        { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
        { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" }
    ]
    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

    const renderPicker = (items: any[], selectedValue: any, onSelect: (value: any) => void, onClose: () => void, isMonth = false) => (
        <Modal transparent animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.pickerContainer}>
                    <View style={styles.pickerHeader}>
                        <TouchableOpacity onPress={onClose}>
                            <AppText style={styles.pickerCancel}>Cancel</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onClose}>
                            <AppText style={styles.pickerDone}>Done</AppText>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.pickerScroll}>
                        {items.map((item) => (
                            <TouchableOpacity
                                key={isMonth ? item.value : item}
                                style={[
                                    styles.pickerItem,
                                    selectedValue === (isMonth ? item.value : item) && styles.pickerItemSelected
                                ]}
                                onPress={() => {
                                    onSelect(isMonth ? item.value : item)
                                    onClose()
                                }}
                            >
                                <AppText style={[
                                    styles.pickerItemText,
                                    selectedValue === (isMonth ? item.value : item) && styles.pickerItemTextSelected
                                ]}>
                                    {isMonth ? item.label : item}
                                </AppText>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    )

    return (
        <AppScreen style={styles.container}>
            <View style={styles.header}>
                <Feather name="users" size={32} color="#E39A5A" />
                <AppText style={styles.headerTitle}>Let's personalize your family experience!</AppText>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.stepContainer}>
                    <AppText style={styles.stepTitle}>Basic Information</AppText>
                    
                    <View style={styles.inputCard}>
                        <AppText style={styles.inputLabel}>Date of Birth</AppText>
                        <AppText style={styles.inputSubtext}>Used for family calendar and birthday reminders</AppText>
                        <View style={styles.datePickerContainer}>
                            <TouchableOpacity style={styles.dateSelector} onPress={() => setShowDayPicker(true)}>
                                <AppText style={styles.dateSelectorLabel}>Day</AppText>
                                <AppText style={styles.dateSelectorValue}>{dateOfBirth.day}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateSelector} onPress={() => setShowMonthPicker(true)}>
                                <AppText style={styles.dateSelectorLabel}>Month</AppText>
                                <AppText style={styles.dateSelectorValue}>{months.find(m => m.value === dateOfBirth.month)?.label}</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.dateSelector} onPress={() => setShowYearPicker(true)}>
                                <AppText style={styles.dateSelectorLabel}>Year</AppText>
                                <AppText style={styles.dateSelectorValue}>{dateOfBirth.year}</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.inputCard}>
                        <AppText style={styles.inputLabel}>Gender</AppText>
                        <AppText style={styles.inputSubtext}>Used for correct pronoun usage by AI</AppText>
                        <View style={styles.genderContainer}>
                            {GENDER_LIST.map((item) => (
                                <TouchableOpacity
                                    key={item.key}
                                    onPress={() => setGender(item.key)}
                                    style={[
                                        styles.genderOption,
                                        gender === item.key && styles.genderOptionActive
                                    ]}
                                >
                                    <Feather 
                                        name={item.icon as any} 
                                        size={18} 
                                        color={gender === item.key ? "#fff" : "#E39A5A"} 
                                    />
                                    <AppText style={[
                                        styles.genderText,
                                        gender === item.key && styles.genderTextActive
                                    ]}>
                                        {item.label}
                                    </AppText>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputCard}>
                        <AppText style={styles.inputLabel}>Your Preferences</AppText>
                        <AppText style={styles.inputSubtext}>Choose up to 5 hobbies to help your family understand you better</AppText>
                        <View style={styles.hobbiesContainer}>
                            {HOBBY_LIST.map((hobby, index) => {
                                const isActive = selectedHobbies.includes(hobby);
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => toggleHobby(hobby)}
                                        style={[
                                            styles.hobbyTag,
                                            isActive && styles.hobbyTagActive,
                                        ]}
                                    >
                                        {isActive && (
                                            <Feather
                                                name="check"
                                                size={14}
                                                color="#fff"
                                                style={{ marginRight: 4 }}
                                            />
                                        )}
                                        <AppText
                                            style={[
                                                styles.hobbyText,
                                                isActive && styles.hobbyTextActive,
                                            ]}
                                        >
                                            {hobby}
                                        </AppText>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>

                    <AppButton
                        title={loading ? "Saving..." : "Save Profile"}
                        style={styles.saveButton}
                        onPress={onSaveProfile}
                        disabled={!gender || loading}
                    />
                </View>
            </ScrollView>

            {showDayPicker && renderPicker(days, dateOfBirth.day, (day) => setDateOfBirth({...dateOfBirth, day}), () => setShowDayPicker(false))}
            {showMonthPicker && renderPicker(months, dateOfBirth.month, (month) => setDateOfBirth({...dateOfBirth, month}), () => setShowMonthPicker(false), true)}
            {showYearPicker && renderPicker(years, dateOfBirth.year, (year) => setDateOfBirth({...dateOfBirth, year}), () => setShowYearPicker(false))}
        </AppScreen>
    )
}

export default SetupProfileScreen

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
        fontSize: 16,
        fontWeight: "700",
        color: "#E39A5A",
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
    datePickerContainer: {
        flexDirection: "row",
        gap: 12,
    },
    dateSelector: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: "rgba(240, 183, 133, 0.1)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(227, 154, 90, 0.2)",
    },
    dateSelectorLabel: {
        fontSize: 12,
        fontWeight: "600",
        color: "#B8860B",
        marginBottom: 4,
    },
    dateSelectorValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#E39A5A",
    },
    genderContainer: {
        gap: 8,
    },
    genderOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: "rgba(240, 183, 133, 0.2)",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "rgba(227, 154, 90, 0.3)",
        gap: 12,
    },
    genderOptionActive: {
        backgroundColor: "#E39A5A",
        borderColor: "#E39A5A",
    },
    genderText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#E39A5A",
        flex: 1,
    },
    genderTextActive: {
        color: "#fff",
    },
    saveButton: {
        marginTop: 24,
        backgroundColor: "#E39A5A",
        borderRadius: 16,
        shadowColor: "#E39A5A",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "flex-end",
    },
    pickerContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: "50%",
    },
    pickerHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    pickerCancel: {
        fontSize: 16,
        color: "#999",
    },
    pickerDone: {
        fontSize: 16,
        fontWeight: "600",
        color: "#E39A5A",
    },
    pickerScroll: {
        maxHeight: 300,
    },
    pickerItem: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f5f5f5",
    },
    pickerItemSelected: {
        backgroundColor: "rgba(227, 154, 90, 0.1)",
    },
    pickerItemText: {
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
    pickerItemTextSelected: {
        color: "#E39A5A",
        fontWeight: "600",
    },
    hobbiesContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    hobbyTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3C596",
        flexDirection: "row",
        alignItems: "center",
    },
    hobbyTagActive: {
        backgroundColor: "#E39A5A",
    },
    hobbyText: {
        fontSize: 13,
        color: "#fff",
        fontWeight: "500",
        textTransform: "capitalize",
    },
    hobbyTextActive: {
        color: "#fff",
        fontWeight: "700",
    },
})