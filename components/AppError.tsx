import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
    message: string
}

export default function AppError({ message }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
        backgroundColor: '#FDECEA',
        borderRadius: 8,
        marginVertical: 8,
    },
    text: {
        color: '#B71C1C',
        fontSize: 14,
    },
})
