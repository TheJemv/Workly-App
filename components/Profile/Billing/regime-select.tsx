// components/Profile/Billing/components/regime-select.tsx
import { Colors } from "lib";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

import regimenes from "../../../data/RegimenFiscales.json"

const data = Object.entries(regimenes).map(([key, value]) => ({
    label: value,
    value: key,
}))

type Props = {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    error?: string;
};

export function RegimeSelect({ label, value, onChange, error }: Props) {
    return (
        <View className="flex flex-col" style={{ gap: 4 }}>
            {label && (
                <Text style={{
                    color: Colors.principal.DEFAULT,
                    fontSize: 14,
                    fontWeight: '700',
                }}>
                    {label}
                </Text>
            )}
            <Dropdown
                data={data}
                labelField="label"
                valueField="value"
                value={value}
                onChange={(item) => onChange?.(item.value)}
                placeholder="Selecciona un régimen fiscal:"
                dropdownPosition="top"

                placeholderStyle={{ color: '#92929D', fontSize: 14 }}
                selectedTextStyle={{ color: '#040404', fontSize: 14 }}

                style={{
                    paddingVertical: 8,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: 'rgba(4,4,4,0.1)', // border-dark/10
                    backgroundColor: Colors.transparent,
                }}
                containerStyle={{
                    borderRadius: 8,
                    borderColor: 'rgba(4,4,4,0.1)',
                }}
                itemTextStyle={{ fontSize: 13 }}
                maxHeight={300}
            />
            {error && (
                <Text className="text-sm text-red-500 font-medium">{error}</Text>
            )}
        </View>
    )
}