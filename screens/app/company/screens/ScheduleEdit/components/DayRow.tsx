import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DayName, Day } from '../../../types';

interface DayRowProps {
    day: DayName;
    dayData: Day;
    onToggle: (day: DayName) => void;
    onOpenTimePicker: (day: DayName, timeType: 'start' | 'end') => void;
}

export default function DayRow({ day, dayData, onToggle, onOpenTimePicker }: DayRowProps) {
    return (
        <View style={styles.dayContainer}>
            <View style={styles.dayHeader}>
                <TouchableOpacity
                    style={styles.checkbox}
                    onPress={() => onToggle(day)}
                >
                    {dayData.open && <View style={styles.checkboxChecked} />}
                </TouchableOpacity>
                <Text style={styles.dayName}>{day}</Text>
            </View>

            {dayData.open ? (
                <View style={styles.timeContainer}>
                    <View style={styles.timeSection}>
                        <Text style={styles.timeLabel}>Desde</Text>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => onOpenTimePicker(day, 'start')}
                        >
                            <Text style={styles.timeText}>
                                {dayData.intervals.start}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.timeSection}>
                        <Text style={styles.timeLabel}>Hasta</Text>
                        <TouchableOpacity
                            style={styles.timeButton}
                            onPress={() => onOpenTimePicker(day, 'end')}
                        >
                            <Text style={styles.timeText}>
                                {dayData.intervals.end}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <Text style={styles.closedText}>CERRADO</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    dayContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#1E40AF',
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        width: 16,
        height: 16,
        borderRadius: 2,
        backgroundColor: '#1E40AF',
    },
    dayName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    timeContainer: {
        marginTop: 8,
    },
    timeSection: {
        marginBottom: 12,
    },
    timeLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    timeButton: {
        backgroundColor: '#F3F4F6',
        padding: 12,
        borderRadius: 8,
    },
    timeText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
    },
    closedText: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '600',
        marginLeft: 36,
    },
});