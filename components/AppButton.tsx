import React from 'react'
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
} from 'react-native'

type Props = {
    title: string
    onPress: () => void
    disabled?: boolean
    loading?: boolean
    style?: ViewStyle
    testID?: string
    accessibilityLabel?: string
}

export default function AppButton({
    title,
    onPress,
    disabled,
    loading,
    style,
    testID,
    accessibilityLabel,
}: Props) {
    return (
        <TouchableOpacity
            testID={testID}
            accessibilityLabel={accessibilityLabel}
            style={[
                styles.button,
                disabled && styles.disabled,
                style,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4F46E5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    disabled: {
        opacity: 0.6,
    },
    text: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
})
