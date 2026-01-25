import { View, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import React, { useLayoutEffect, useState, useCallback } from 'react';
import { DataDays, DayName, Period } from '../../types';
import useGlobal from 'core/globals';
import { useNavigation } from '@react-navigation/native';
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from 'lib';
import DayRow from './components/DayRow';
import TimePickerModal from './components/TimePickerModal';
import { parseTimeString, createTimeString, validateTimeRange } from './utils/timeUtils';
import { updateCompany } from 'services/api/company.api';
import { LoadingScreen } from 'screens/app/home/components';

const DAYS_WEEK: DayName[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

const DEFAULT_SCHEDULE: DataDays = {
    Lunes: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
    Martes: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
    Miércoles: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
    Jueves: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
    Viernes: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
    Sábado: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
    Domingo: { open: false, intervals: { start: '9:00 AM', end: '5:00 PM' } },
};

export default function ScheduleEdit() {
    const navigation = useNavigation();
    const company = useGlobal((state) => state.company);

    const [openDays, setOpenDays] = useState<DataDays>(
        company.businessHours || DEFAULT_SCHEDULE
    );
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDay, setSelectedDay] = useState<DayName | null>(null);
    const [selectedTimeType, setSelectedTimeType] = useState<'start' | 'end'>('start');
    const [selectedHour, setSelectedHour] = useState(9);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('AM');
    const [loading, setLoading] = useState(false);

    const toggleDay = useCallback((day: DayName) => {
        setOpenDays(prev => ({
            ...prev,
            [day]: { ...prev[day], open: !prev[day].open }
        }));
    }, []);

    const openTimePickerForDay = useCallback((day: DayName, timeType: 'start' | 'end') => {
        setSelectedDay(day);
        setSelectedTimeType(timeType);

        const currentTime = openDays[day].intervals[timeType];
        console.log('Opening picker for:', day, timeType, 'Current time:', currentTime);

        const parsed = parseTimeString(currentTime);
        console.log('Parsed time:', parsed);

        setSelectedHour(parsed.hour);
        setSelectedMinute(parsed.minute);
        setSelectedPeriod(parsed.period);
        setShowTimePicker(true);
    }, [openDays]);

    const handleConfirm = useCallback(() => {
        if (!selectedDay) {
            setShowTimePicker(false);
            return;
        }

        const timeString = createTimeString(selectedHour, selectedMinute, selectedPeriod);
        const currentIntervals = openDays[selectedDay].intervals;
        const newStartTime = selectedTimeType === 'start' ? timeString : currentIntervals.start;
        const newEndTime = selectedTimeType === 'end' ? timeString : currentIntervals.end;
        const isValid = validateTimeRange(newStartTime, newEndTime);

        if (!isValid) {
            Alert.alert(
                'Error de horario',
                'La hora de inicio debe ser menor que la hora de fin.',
                [{ text: 'OK' }]
            );
            setShowTimePicker(false);
            return;
        }

        setOpenDays(prev => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                intervals: {
                    start: newStartTime,
                    end: newEndTime
                }
            }
        }));

        setShowTimePicker(false);
    }, [selectedDay, selectedTimeType, selectedHour, selectedMinute, selectedPeriod, openDays]);

    const handleCancel = useCallback(() => {
        setShowTimePicker(false);
    }, []);

    const handleSave = useCallback(async () => {
        try {
            setLoading(true);
            await updateCompany(useGlobal.getState().token, { businessHours: openDays }).then(() => {
                navigation.goBack();
            });
        } catch (error) {
            Alert.alert(
                'Error',
                'Hubo un problema al guardar los horarios. Por favor, intenta de nuevo.',
                [{ text: 'OK' }]
            );
        } finally {
            setLoading(false);
        }
    }, [openDays, navigation]);

    const handleHourChange = useCallback((hour: number) => {
        setSelectedHour(hour);
    }, []);

    const handleMinuteChange = useCallback((minute: number) => {
        setSelectedMinute(minute);
    }, []);

    const handlePeriodChange = useCallback((period: Period) => {
        setSelectedPeriod(period);
    }, []);

    useLayoutEffect(() => {
        const hasChanges = JSON.stringify(company.businessHours) !== JSON.stringify(openDays);
        navigation.setOptions({
            headerRight: hasChanges ? () => (
                <TouchableOpacity onPress={handleSave}>
                    <View style={styles.saveButton}>
                        <Entypo name="save" size={26} color={Colors.principal.DEFAULT} />
                    </View>
                </TouchableOpacity>
            ) : undefined,
            headerBackVisible: !loading,
        });
    }, [company.businessHours, openDays, navigation, handleSave, loading]);

    return (
        loading ? (
            <LoadingScreen />
        ) : (
            <ScrollView style={styles.container}>
                <View style={{ marginBottom: 100, flex: 1 }}>
                    {DAYS_WEEK.map((day) => (
                        <DayRow
                            key={day}
                            day={day}
                            dayData={openDays[day]}
                            onToggle={toggleDay}
                            onOpenTimePicker={openTimePickerForDay}
                        />
                    ))}
                </View>

                <TimePickerModal
                    visible={showTimePicker}
                    selectedHour={selectedHour}
                    selectedMinute={selectedMinute}
                    selectedPeriod={selectedPeriod}
                    onHourChange={handleHourChange}
                    onMinuteChange={handleMinuteChange}
                    onPeriodChange={handlePeriodChange}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            </ScrollView>
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E5E5',
        padding: 12,
    },
    saveButton: {
        alignSelf: "center",
        borderColor: "#E8ECF3",
        marginStart: 5
    },
});