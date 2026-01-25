import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Period } from '../../../types';

interface TimePickerModalProps {
    visible: boolean;
    selectedHour: number;
    selectedMinute: number;
    selectedPeriod: Period;
    onHourChange: (hour: number) => void;
    onMinuteChange: (minute: number) => void;
    onPeriodChange: (period: Period) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function TimePickerModal({
    visible,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    onHourChange,
    onMinuteChange,
    onPeriodChange,
    onConfirm,
    onCancel
}: TimePickerModalProps) {
    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.pickerContainer}>
                    <View style={styles.pickerHeader}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={styles.cancelButton}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={onConfirm}>
                            <Text style={styles.confirmButton}>Listo</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.pickersRow}>
                        {/* Hora */}
                        <View style={styles.pickerColumn}>
                            <Picker
                                selectedValue={selectedHour}
                                onValueChange={onHourChange}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                {hours.map((hour) => (
                                    <Picker.Item
                                        key={hour}
                                        label={hour.toString()}
                                        value={hour}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* Minutos */}
                        <View style={styles.pickerColumn}>
                            <Picker
                                selectedValue={selectedMinute}
                                onValueChange={onMinuteChange}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                {minutes.map((minute) => (
                                    <Picker.Item
                                        key={minute}
                                        label={minute.toString().padStart(2, '0')}
                                        value={minute}
                                    />
                                ))}
                            </Picker>
                        </View>

                        {/* AM/PM */}
                        <View style={styles.pickerColumn}>
                            <Picker
                                selectedValue={selectedPeriod}
                                onValueChange={onPeriodChange}
                                style={styles.picker}
                                itemStyle={styles.pickerItem}
                            >
                                <Picker.Item label="AM" value="AM" />
                                <Picker.Item label="PM" value="PM" />
                            </Picker>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingBottom: 20,
    },
    pickerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    cancelButton: {
        fontSize: 17,
        color: '#007AFF',
    },
    confirmButton: {
        fontSize: 17,
        color: '#007AFF',
        fontWeight: '600',
    },
    pickersRow: {
        flexDirection: 'row',
        height: 200,
    },
    pickerColumn: {
        flex: 1,
    },
    picker: {
        width: '100%',
        height: 200,
    },
    pickerItem: {
        height: 200,
        fontSize: 20,
    },
});