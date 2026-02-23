import React from 'react'
import {
    SafeAreaView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ViewStyle,
} from 'react-native'

type Props = {
    children: React.ReactNode
    style?: ViewStyle
}

export default function AppScreen({ children, style }: Props) {
    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={[styles.container, style]}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {children}
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
})
