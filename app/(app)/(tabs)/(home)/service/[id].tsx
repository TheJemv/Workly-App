import { usePaymentSheet } from "@stripe/stripe-react-native";
import { AuthContext } from "context/AuthContext";
import { Colors } from "lib";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
    Text,
    ScrollView,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    Share,
} from "react-native";
import DatePicker from "react-native-date-picker";
import formatDateService from "functions/formatDateService";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

import { BusinessHours } from "components/Company";
import { StatsComponent } from "components/Services";

import { getService, getServicePayment } from "services/api/services.api";
import LoadingScreen from "components/LoadingScreen";

import { timeToNumber } from "utils"
import * as Linking from "expo-linking"

import type { Service as ServiceType } from "@/types/Service";
import type { Day, DayName } from "@/types/Schedule";

import ShareButton from "components/Header/ShareButton";
import { MoneyTextInput } from "@alexzunik/react-native-money-input";

const daysArray: DayName[] = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
];

const formatPrice = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    const formattedText = numericText.replace(/(\d)(\d{2})$/, "$1.$2");

    if (text > 0) {
        return `$${formattedText}`;
    }

    return text;
};


const ServiceHire = () => {
    const params = useLocalSearchParams()
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const navigation = useNavigation()

    const { token, customer } = useContext(AuthContext);

    const [infoUserNote, setInfoUserNote] = useState("");
    const [dataService, setDataService] = useState<ServiceType | null>(null);
    const [loading, setLoading] = useState(true);
    const [enableButton, setEnableButton] = useState(false);
    const [dateRequest, setDateRequest] = useState(
        new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    ); // Plus 30 minutes
    const [showPickerDate, setShowPickerDate] = useState(false);
    const [valuePrice, setValuePrice] = useState<number>(dataService?.unit_amount / 100 || 0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                await getService(token, params.id as string).then(data => {
                    setDataService(data?.service);
                    setValuePrice(data.service.unit_amount / 100)
                    setLoading(false);
                })
            } catch (error) {
                Alert.alert("Error", error.message);
            }
        }

        fetchData()
    }, []);

    // Stripe Payment
    const handlePayService = async () => {
        setEnableButton(true);
        if (valuePrice * 100 <= 4999) {
            Alert.alert(
                "Error",
                "El precio del servicio no puede ser menor a $50.00",
            );
            setEnableButton(false);
            return;
        }

        try {
            const { paymentintent, ephemeralKey } = await getServicePayment(
                token,
                dataService?.id,
                {
                    notes: infoUserNote,
                    dateRequest: dateRequest.toString(),
                    amount: valuePrice * 100,
                },
            );

            await initializePaymentSheet(paymentintent, ephemeralKey);

            const { error: payError } = await presentPaymentSheet()
            if (payError) {
                // El usuario canceló o falló el pago
                if (payError.code === "Canceled") {
                    console.error("Pago cancelado por el usuario");
                } else {
                    console.error("Falló el pago:", payError.message);
                }
                return;
            }

            // ✅ En este punto, para el usuario "se pagó"
            if (router.canGoBack()) router.back()
        } catch (error) {
            Alert.alert(error?.message);
        } finally {
            setEnableButton(false);
        }
    };

    const initializePaymentSheet = async (payment, key) => {
        const { error } = await initPaymentSheet({
            customerEphemeralKeySecret: key,
            merchantDisplayName: dataService?.name,
            allowsDelayedPaymentMethods: true,
            returnURL: "workly://stripe-return",
            paymentIntentClientSecret: payment,
            customerId: customer?.customer?.customerId,
        });

        if (error) {
            throw new Error(error.message);
        }
    };

    const OpenCompany = () => {
        router.navigate({
            pathname: '/(home)/company/[id]',
            params: { id: dataService.company.id }
        })
    };

    const onConfirmDate = (date?: Date) => {
        setShowPickerDate(false)
        if (!date || !dataService.company?.businessHours) {
            Alert.alert("Error", "Error para obtener los horarios de la empresa.")
            return;
        }

        const businessHours = dataService.company?.businessHours
        const currentDay = daysArray[date.getDay()]
        const daySchedule: Day = businessHours[currentDay]

        if (!daySchedule || !daySchedule.open) {
            alert(`El negocio está cerrado los ${currentDay}s.`)
            return;
        }

        const selectedHour = date.getHours();
        const selectedMinutes = date.getMinutes();
        const selectedTime = selectedHour * 100 + selectedMinutes;

        const openTime = timeToNumber(daySchedule.intervals.start)
        const closeTime = timeToNumber(daySchedule.intervals.end)

        if (selectedTime < openTime || selectedTime >= closeTime) {
            alert(`El horario de atención es de ${daySchedule.intervals.start} a ${daySchedule.intervals.end}`);
            return;
        }

        setDateRequest(date)
    }

    const handleShare = async () => {
        try {
            const deepLink = Linking.createURL(`/(app)/(tabs)/(home)/service/${params.id}`);
            await Share.share({
                title: dataService?.name,
                message: `¡Mira este servicio en Workly!\n\n${deepLink}`,
                url: "https://www.whatsapp.com/?lang=es"
            });
        } catch (e) {
            console.error(e)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <ShareButton onPress={handleShare} />,
        })
    }, [])


    return loading ? (
        <LoadingScreen />
    ) : (
        <>
            <ScrollView className="px-3 flex flex-col">
                <View
                    className="flex flex-col pb-3"
                    style={{
                        gap: 18
                    }}
                >
                    <View
                        className="flex flex-col items-center justify-center overflow-hidden"
                        style={{ gap: 8 }}
                    >
                        <Image
                            resizeMode="cover"
                            source={{
                                uri: dataService?.photo
                                    ? dataService?.photo
                                    : "https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg",
                            }}
                            width={110}
                            height={110}
                            className="rounded-lg"
                        />

                        <TouchableOpacity
                            onPress={OpenCompany}
                            className="flex flex-col items-center"
                            style={{ gap: 0 }}
                        >
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color: Colors.principal.DEFAULT,
                                }}
                            >
                                Empresa
                            </Text>


                            <Text className="text-text" style={{ fontSize: 12 }}>
                                {dataService?.name ? dataService?.name : "Servicio"}
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {/* Stats */}
                    <StatsComponent
                        orders={dataService?.ordersCount || 0}
                        views={dataService?.views || 0}
                        createdAt={dataService?.createdAt}
                    />

                    <View
                        className="py-2 px-3 shadow-lg bg-white rounded-lg flex flex-col"
                        style={{ gap: 6 }}
                    >
                        <Text
                            style={{
                                color: Colors.principal.DEFAULT,
                                fontWeight: 600,
                                fontSize: 16,
                            }}
                        >
                            Descripcion del servicio
                        </Text>
                        <Text className="text-text" style={{ fontWeight: 500 }}>
                            {dataService?.description}
                        </Text>
                    </View>

                    {/* Horarios de la Empresa */}
                    <BusinessHours businessHours={dataService?.company?.businessHours} />


                    <View className="flex flex-col" style={{ gap: 6 }}>
                        <Text
                            style={{
                                color: Colors.principal.DEFAULT,
                                fontWeight: 600,
                                fontSize: 16,
                            }}
                        >
                            Fecha de Entrega
                        </Text>

                        <TouchableOpacity
                            onPress={() => setShowPickerDate(true)}
                            className="flex flex-row items-center justify-between py-2 px-3 bg-transparent rounded-lg bg-white"
                        >
                            <Text className="text-text" style={{ fontWeight: 500 }}>
                                {formatDateService(dateRequest)}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View className="flex flex-col" style={{ gap: 6 }}>
                        <Text
                            style={{
                                color: Colors.principal.DEFAULT,
                                fontWeight: 600,
                                fontSize: 16,
                            }}
                        >
                            Agregar Notas
                        </Text>
                        <TextInput
                            placeholder="Agregar notas..."
                            multiline
                            className="bg-white text-text rounded-lg py-2 px-3"
                            style={{
                                height: 120,
                                fontWeight: 500,
                            }}
                            value={infoUserNote}
                            onChangeText={(e) => setInfoUserNote(e)}
                        />
                    </View>

                    {dataService?.indefinite && (
                        <View className="flex flex-col" style={{ gap: 6 }}>
                            <Text
                                style={{
                                    color: Colors.principal.DEFAULT,
                                    fontWeight: 600,
                                    fontSize: 16,
                                }}
                            >
                                Agrega un Precio
                            </Text>
                            <MoneyTextInput
                                placeholder="Agrega un precio..."
                                value={valuePrice.toString()}
                                onChangeText={(_, extracted) => {
                                    setValuePrice(Number(extracted))
                                }}
                                style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 0, borderColor: "#04040420", backgroundColor: "#fff" }}
                                prefix="$"
                                groupingSeparator=","
                                fractionSeparator="."
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        disabled={enableButton}
                        onPress={handlePayService}
                        className="flex flex-col items-center justify-center py-3 rounded-lg shadow-lg"
                        style={{ backgroundColor: Colors.principal.DEFAULT }}
                    >
                        <Text
                            className="text-white"
                            style={{ fontWeight: 600, fontSize: 18 }}
                        >
                            {(valuePrice).toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                                minimumFractionDigits: 2,
                            })}
                            {" "}
                            {dataService.currency.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <DatePicker
                modal
                mode="datetime"
                date={dateRequest}
                onConfirm={(date) => onConfirmDate(date)}
                onCancel={() => setShowPickerDate(false)}
                open={showPickerDate}
                minimumDate={
                    new Date(new Date().setMinutes(new Date().getMinutes() + 30))
                }
            />
        </>
    );
};

export default ServiceHire;
