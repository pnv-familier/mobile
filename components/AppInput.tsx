import React from 'react'
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native'

type Props = TextInputProps & {
    label?: string
    error?: string
}

export default function AppInput({ label, error, style, ...props }: Props) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.errorBorder, style]}
                placeholderTextColor="#999"
                {...props}
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        color: '#444',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
    },
    errorBorder: {
        borderColor: '#E53935',
    },
    error: {
        marginTop: 4,
        color: '#E53935',
        fontSize: 13,
    },
})
