import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { useEffect } from "react";

import { Singout } from "services/firebase/Singout";
import { UserConfigButton, Option } from "components";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

import { useAccountPaymentSheet } from "hooks/stripe/useAccountPaymentSheet";
import useGlobal from "core/globals";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { STATUS_MARGIN_TOP } from "constants/index";
import type { Customer } from "@/types/Customer";

const AccountScreen: React.FC = () => {
    const customerUser = useGlobal((s) => s.customer) as Customer | null | undefined;

    const {
        loadingPayments,
        isModalActivePayment,
        initializePaymentSheet,
        handleNewCard,
    } = useAccountPaymentSheet(customerUser);

    useEffect(() => {
        initializePaymentSheet();
    }, [initializePaymentSheet]);

    const handleSingout = async (): Promise<void> => {
        await Singout()
            .then(() => {
                router.replace('/(app)/(tabs)/(home)');
            })
            .catch((e: Error) => {
                Alert.alert("Error", e.message);
            });
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: STATUS_MARGIN_TOP }}>
            <ScrollView className="px-3 pt-3 w-full" style={{ flex: 1 }}>
                <View style={{ gap: 12 }} className="flex flex-col">
                    <Text className="order-0 text-dark font-bold text-[22px]">
                        Configuracion
                    </Text>

                    <UserConfigButton onPress={() => router.push('/profile')} />

                    <View className="rounded-lg overflow-hidden flex flex-col">
                        <Option
                            styles="bg-slate-500"
                            icon={MaterialIcons}
                            iconName="history"
                            label="Historial de ordenes"
                            onPress={() => router.push('/history')}
                        />

                        <Option
                            styles="bg-orange-500"
                            icon={MaterialIcons}
                            iconName="support-agent"
                            label="Soporte"
                            onPress={() => router.push('/support')}
                        />
                    </View>

                    <View className="rounded-lg overflow-hidden flex flex-col">
                        <Option
                            styles="bg-cyan-500"
                            icon={Feather}
                            iconName="file-plus"
                            label="Datos de Facturacion"
                            onPress={() => router.push('/billing')}
                        />

                        <Option
                            styles="bg-rose-500"
                            icon={FontAwesome5}
                            iconName="location-arrow"
                            label="Direcciones"
                            onPress={() => router.push('/location')}
                        />

                        <Option
                            onPress={handleNewCard}
                            styles="bg-blue-500"
                            icon={FontAwesome}
                            iconName="credit-card"
                            label="Datos Bancarios"
                            disabled={isModalActivePayment}
                            loading={loadingPayments}
                        />
                    </View>

                    <View className="rounded-lg overflow-hidden flex flex-col">
                        <Option
                            styles="bg-red-500"
                            icon={Feather}
                            iconName="trash-2"
                            label="Borrar Cuenta"
                            onPress={() => router.push('/delete-account')}
                        />
                    </View>

                    <TouchableOpacity
                        onPress={handleSingout}
                        className="bg-white rounded-lg px-4 py-2"
                    >
                        <Text className="text-red-500 text-center">
                            Cerrar Sesion
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AccountScreen;