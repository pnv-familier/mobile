import React from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'

export default function AppLoader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#4F46E5" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
