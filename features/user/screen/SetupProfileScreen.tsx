import React from "react"
import {
    View,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native"
import { Feather, Entypo } from "@expo/vector-icons"
import AppScreen from "../../../components/AppScreen"
import AppText from "../../../components/AppText"
import AppButton from "../../../components/AppButton"
import { HOBBY_LIST } from "../constant/hobbyList"
import { useSetupProfile } from "../hook/setupProfile"

const IMAGE_URL =
    "https://media.istockphoto.com/id/2173059563/vector/coming-soon-image-on-white-background-no-photo-available.jpg?s=612x612&w=0&k=20&c=v0a_B58wPFNDPULSiw_BmPyhSNCyrP_d17i2BPPyDTk="

const SetupProfileScreen = () => {
    const { selectedHobbies, toggleHobby, onContinue, loading } = useSetupProfile()

    return (
        <AppScreen style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Feather name="arrow-left" size={22} color="#E39A5A" />
                    <AppText style={styles.headerTitle}>Set up profile</AppText>
                    <View style={{ width: 22 }} />
                </View>

                <View style={styles.avatarWrapper}>
                    <View style={styles.avatarCircle}>
                        <Image
                            source={{ uri: IMAGE_URL }}
                            style={styles.avatar}
                        />
                    </View>
                    <View style={styles.cameraBadge}>
                        <Entypo name="camera" size={14} color="#fff" />
                    </View>
                </View>
                <AppText style={styles.addImageText}>
                    Add representative image
                </AppText>

                <View style={styles.inputWrapper}>
                    <Feather name="user" size={18} color="#E39A5A" />
                    <TextInput
                        placeholder="Family nicknames"
                        placeholderTextColor="#F0B785"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Feather name="calendar" size={18} color="#E39A5A" />
                    <TextInput
                        placeholder="Date of birth"
                        placeholderTextColor="#F0B785"
                        style={styles.input}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <Feather name="map-pin" size={18} color="#E39A5A" />
                    <TextInput
                        placeholder="Current residence"
                        placeholderTextColor="#F0B785"
                        style={styles.input}
                    />
                </View>

                <View style={styles.textAreaWrapper}>
                    <TextInput
                        placeholder="Write a few lines about yourself..."
                        placeholderTextColor="#F0B785"
                        style={styles.textArea}
                        multiline
                    />
                    <AppText style={styles.counter}>0/150</AppText>
                </View>

                <AppText style={styles.prefTitle}>Your Preferences:</AppText>
                <AppText style={styles.prefSub}>
                    Choose up to 5 hobbies to help your family understand you better
                </AppText>

                <View style={styles.tagsWrapper}>
                    {HOBBY_LIST.map((item, index) => {
                        const isActive = selectedHobbies.includes(item);

                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => toggleHobby(item)}
                                activeOpacity={0.7}
                                style={[
                                    styles.tag,
                                    isActive && styles.tagActive,
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
                                        styles.tagText,
                                        isActive && styles.tagTextActive,
                                    ]}
                                >
                                    {item}
                                </AppText>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <AppButton
                    title={loading ? "Saving..." : "Continue"}
                    style={styles.continueBtn}
                    onPress={onContinue}
                    disabled={loading}
                />
            </ScrollView>
        </AppScreen>
    )
}

export default SetupProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF1DE",
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#E39A5A",
    },
    avatarWrapper: {
        alignItems: "center",
        marginBottom: 10,
    },
    avatarCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 2,
        borderColor: "#E39A5A",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 110,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: "#E39A5A",
        alignItems: "center",
        justifyContent: "center",
    },
    addImageText: {
        textAlign: "center",
        color: "#E39A5A",
        fontWeight: "600",
        marginBottom: 20,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#333",
    },
    textAreaWrapper: {
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 12,
        height: 90,
        marginBottom: 16,
    },
    textArea: {
        flex: 1,
        fontSize: 14,
        color: "#333",
        textAlignVertical: "top",
    },
    counter: {
        alignSelf: "flex-end",
        fontSize: 12,
        color: "#E39A5A",
    },
    prefTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#E39A5A",
        marginBottom: 4,
    },
    prefSub: {
        fontSize: 12,
        color: "#E6A870",
        marginBottom: 12,
    },
    tagsWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 24,
    },
    tag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: "#F3C596",
        flexDirection: 'row', // Thêm dòng này để icon và text nằm ngang
        alignItems: 'center',
    },
    tagActive: {
        backgroundColor: "#7A4A2A", // Màu nâu đậm khi active
    },
    tagText: {
        fontSize: 13,
        color: "#fff",
        fontWeight: "500",
        textTransform: "capitalize",
    },
    tagTextActive: {
        color: "#fff",
        fontWeight: "700", // Đậm hơn chút khi active
    },
    continueBtn: {
        marginTop: 8,
        marginBottom: 40,
        backgroundColor: "#E39A5A",
    },
})