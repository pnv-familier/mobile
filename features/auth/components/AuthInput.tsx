import React, { useState } from "react"
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TextInputProps,
} from "react-native"
import { Feather } from "@expo/vector-icons"
import AppText from "../../../components/AppText"

type Props = {
    icon: React.ComponentProps<typeof Feather>["name"]
    error?: string
    secure?: boolean
} & TextInputProps

export default function AuthInput({ icon, error, secure, ...props }: Props) {
    const [hidden, setHidden] = useState(secure)

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.wrapper,
                    { borderColor: error ? "red" : "transparent" },
                ]}
            >
                <Feather name={icon} size={20} color="#E39A5A" />

                <TextInput
                    placeholderTextColor="#F0B785"
                    secureTextEntry={hidden}
                    style={styles.input}
                    {...props}
                />

                {secure && (
                    <TouchableOpacity onPress={() => setHidden(!hidden)}>
                        <Feather
                            name={hidden ? "eye" : "eye-off"}
                            size={18}
                            color="#E39A5A"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <AppText style={styles.error}>{error}</AppText>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },
    wrapper: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#333",
    },
    error: {
        color: "red",
        marginTop: 4,
        fontSize: 12,
    },
})