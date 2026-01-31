import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import formatRelativeDate from 'utils/formatRelativeDate';

interface Props {
    orders: number;
    views: number;
    createdAt: any;
}

interface StatsProps {
    name: string;
    value: number | string;
}

const Stats = ({ name = "Ordenes", value = 50 }: StatsProps) => (
    <View
        style={{ gap: 6 }}
        className="flex-1 rounded-lg shadow-lg py-3 bg-zinc-300 flex flex-col items-center"
    >
        <Text
            numberOfLines={1}
            className="text-gray-500"
            style={{ fontWeight: 700, fontSize: 18 }}
        >
            {value}
        </Text>

        <Text numberOfLines={1} className="text-text">
            {name}
        </Text>
    </View>
);

export default function StatsComponent({ orders, views, createdAt }: Props) {
    return (
        <View style={Styles.container}>
            <Stats name="Ordenes" value={orders} />
            <Stats name="Visitas" value={views} />
            <Stats name="Creado" value={formatRelativeDate(createdAt)} />
        </View>
    )
}

const Styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    }
});