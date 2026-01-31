import {
    Alert,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";

import { Singout } from "services/firebase/Singout";
import { UserConfigButton, Option } from "components";

import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { usePaymentSheet } from "@stripe/stripe-react-native";
import { getPaymentParams } from "services/api/getPaymantParams";
import useGlobal from "core/globals";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const AccountScreen = () => {
    const { token } = useGlobal()
    const customerUser = useGlobal(state => state.customer)

    const handleSingout = async () => {
        await Singout().catch((e) => {
            Alert.alert("Error", e.message);
        });
    };

    // Datos Bancarios
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const [loadingPayments, setLoadingPayments] = useState(false);
    const [isModalActivePayment, setIsModalActivePayment] = useState(false);


    useEffect(() => {
        initializePaymentSheet();
    }, []);

    const fetchPaymentSheetParams = async () => {
        try {
            const { ephemeralKey, setupIntent } = await getPaymentParams(token).catch((error) => {
                throw new Error(error.message)
            });
            return { ephemeralKey, setupIntent };
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    const initializePaymentSheet = async () => {
        setLoadingPayments(false);
        const { ephemeralKey, setupIntent } = await fetchPaymentSheetParams();

        if (ephemeralKey && setupIntent) {
            const { error } = await initPaymentSheet({
                customerEphemeralKeySecret: ephemeralKey,
                merchantDisplayName: "User",
                allowsDelayedPaymentMethods: true,
                returnURL: 'workit://stripe-return',
                setupIntentClientSecret: setupIntent,
                customerId: customerUser.customerId,
            });

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                setLoadingPayments(true);
            }
        }
    };

    const handleNewCard = async () => {
        if (!loadingPayments) return;
        setIsModalActivePayment(true);
        await initializePaymentSheet();
        await presentPaymentSheet();
        setIsModalActivePayment(false);
    };

    return (
        <SafeAreaView style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
            <ScrollView className="px-3 pt-3 w-full" style={{ flex: 1 }}>
                <View style={{ gap: 12 }} className="flex flex-col">
                    <Text className="order-0 text-dark font-bold text-[22px]">
                        Configuracion
                    </Text>
                    <UserConfigButton onPress={() => router.push('/profile')} />

                    <View className="rounded-lg overflow-hidden flex flex-col">
                        <Option
                            styles="bg-gray-600"
                            icon={Feather}
                            iconName="lock"
                            label="Privacidad"
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
                            styles="bg-slate-500"
                            icon={MaterialIcons}
                            iconName="history"
                            label="Historial de ordenes"
                            onPress={() => router.push('/support')}
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
                            onPress={handleNewCard}
                            styles="bg-red-500"
                            icon={FontAwesome}
                            iconName="credit-card"
                            label="Datos Bancarios"
                            disabled={isModalActivePayment}
                            loading={loadingPayments}
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
