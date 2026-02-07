import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { DataDays, Day, DayName } from '@/types/Schedule';
import { Colors } from 'lib';

interface Props {
    businessHours: DataDays[];
}

const daysArray: DayName[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
];

export default function BusinessHours({ businessHours }: Props) {
    return (
        <View className='flex flex-col gap-y-0'>
            <Text style={Styles.title}>Horarios de la Empresa</Text>

            <View className='flex flex-col gap-y-1 mb-3'>
                {daysArray.map((day) => {
                    const dayData: Day = businessHours[day];
                    return (
                        <View key={day} className='flex flex-row pl-4 justify-between items-center'>
                            <Text className='text-sm font-medium text-gray-700 w-24'>
                                {day}
                            </Text>

                            {dayData.open ? (
                                <View className='flex flex-row items-center space-x-2'>
                                    <Text className='text-sm text-gray-600'>{dayData.intervals.start}</Text>
                                    <Text className='text-sm text-gray-400'>-</Text>
                                    <Text className='text-sm text-gray-600'>{dayData.intervals.end}</Text>
                                </View>
                            ) : (
                                <Text className='text-sm text-gray-400 italic'>
                                    Cerrado
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    )
}

const Styles = StyleSheet.create({
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.principal.DEFAULT,
    }
});