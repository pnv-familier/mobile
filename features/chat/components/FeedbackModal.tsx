import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Pressable
} from 'react-native';
import { X } from 'lucide-react-native';

const OPTIONS = [
    'Violation of standards',
    'Inappropriate content',
    'Not helpful',
    'Other'
];

interface Props {
    visible: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
}

export default function FeedbackModal({ visible, onClose, onConfirm }: Props) {
    const [selected, setSelected] = useState<string | null>(null);
    const [otherText, setOtherText] = useState('');
    const [showThankYou, setShowThankYou] = useState(false);

    const handleConfirm = () => {
        if (!selected) return;

        if (selected === 'Other' && !otherText.trim()) return;

        const reason = selected === 'Other' ? otherText : selected;
        onConfirm(reason);
        setShowThankYou(true);
    };

    const handleClose = () => {
        setSelected(null);
        setOtherText('');
        setShowThankYou(false);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Pressable style={styles.container} onPress={(e) => e.stopPropagation()}>

                    {/* Close */}
                    <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
                        <X size={18} color="#333" />
                    </TouchableOpacity>

                    {showThankYou ? (
                        <>
                            {/* Icon */}
                            <View style={styles.iconWrapper}>
                                <View style={styles.iconCircle}>
                                    <Text style={styles.iconText}>✓</Text>
                                </View>
                            </View>

                            {/* Thank You Message */}
                            <Text style={styles.thankYouText}>
                                Thank you for your feedback! We will improve Familier
                            </Text>
                        </>
                    ) : (
                        <>
                            {/* Icon */}
                            <View style={styles.iconWrapper}>
                                <View style={styles.iconCircle}>
                                    <Text style={styles.iconText}>!</Text>
                                </View>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>Cloudy Feedback</Text>
                            <Text style={styles.subtitle}>
                                Help us improve Cloudy by sharing your feedback.
                            </Text>

                            {/* Options */}
                            {OPTIONS.map((opt) => {
                                const isSelected = selected === opt;
                                return (
                                    <TouchableOpacity
                                        key={opt}
                                        style={styles.optionRow}
                                        onPress={() => setSelected(opt)}
                                    >
                                        <View style={[styles.radio, isSelected && styles.radioActive]} />
                                        <Text style={styles.optionText}>{opt}</Text>
                                    </TouchableOpacity>
                                );
                            })}

                            {/* Other input */}
                            {selected === 'Other' && (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={styles.label}>
                                        Other reasons <Text style={{ color: 'red' }}>*</Text>
                                    </Text>
                                    <TextInput
                                        value={otherText}
                                        onChangeText={setOtherText}
                                        placeholder="Please enter a specific reason"
                                        style={styles.input}
                                        multiline
                                    />
                                </View>
                            )}

                            {/* Buttons */}
                            <View style={styles.buttonRow}>
                                <Pressable style={styles.cancelBtn} onPress={handleClose}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </Pressable>

                                <Pressable style={styles.confirmBtn} onPress={handleConfirm}>
                                    <Text style={styles.confirmText}>Confirm</Text>
                                </Pressable>
                            </View>
                        </>
                    )}

                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
    },
    closeBtn: {
        position: 'absolute',
        right: 15,
        top: 15,
        zIndex: 10,
    },
    iconWrapper: {
        alignItems: 'center',
        marginBottom: 10,
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFE7B3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 28,
        color: '#F59E0B',
        fontWeight: 'bold',
    },
    title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 5,
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        marginVertical: 10,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    radio: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: '#CCC',
        marginRight: 10,
    },
    radioActive: {
        borderColor: '#A16207',
        backgroundColor: '#A16207',
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    label: {
        fontSize: 13,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0C3A0',
        borderRadius: 10,
        padding: 10,
        minHeight: 60,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    cancelBtn: {
        backgroundColor: '#F2F2F2',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    cancelText: {
        color: '#333',
        fontWeight: '600',
    },
    confirmBtn: {
        backgroundColor: '#D4A056',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
    },
    confirmText: {
        color: '#FFF',
        fontWeight: '600',
    },
    thankYouText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#333',
        marginVertical: 20,
        paddingHorizontal: 10,
    },
});