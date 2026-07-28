import { usePaymentSheet } from "@stripe/stripe-react-native";
import { AuthContext } from "context/AuthContext";
import { Colors } from "lib";
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import {
    Text, ScrollView, View, Image,
    TouchableOpacity, TextInput, Alert, Share,
    Platform, KeyboardAvoidingView
} from "react-native";
import DatePicker from "react-native-date-picker";
import formatDateService from "functions/formatDateService";
import { router, useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { BusinessHours } from "components/Company";
import { StatsComponent } from "components/Services";
import { getService, getServicePayment } from "services/api/services.api";
import LoadingScreen from "components/LoadingScreen";
import { timeToNumber } from "utils";
import type { Service as ServiceType } from "@/types/Service";
import type { Day, DayName } from "@/types/Schedule";
import type { Location } from "@/types/Location"; // 👈 tu interface
import ShareButton from "components/Header/ShareButton";
import { MoneyTextInput } from "@alexzunik/react-native-money-input";
import { Dropdown } from "react-native-element-dropdown";
import SpinLoading from "components/SpinLoading";
import { getLocations } from "services/api/location.api";

import { getServiceShareUrl } from "utils/shareLinks"

const daysArray: DayName[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const ServiceHire = () => {
    const params = useLocalSearchParams();
    const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();
    const navigation = useNavigation();
    const { token, customer } = useContext(AuthContext);

    const [infoUserNote, setInfoUserNote] = useState("");
    const [dataService, setDataService] = useState<ServiceType | null>(null);
    const [loading, setLoading] = useState(true);
    const [enableButton, setEnableButton] = useState(false);
    const [dateRequest, setDateRequest] = useState(
        new Date(new Date().setMinutes(new Date().getMinutes() + 30))
    );
    const [showPickerDate, setShowPickerDate] = useState(false);
    const [valuePrice, setValuePrice] = useState<number>(0); // 👈 inicia en 0, se setea en el fetch

    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const router = useRouter();

    useEffect(() => {
        // Esperar a tener token y id antes de pedir el servicio
        if (!params.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getService(params.id as string);
                setDataService(data?.service);
                setValuePrice(data.service.unit_amount / 100); // 👈 aquí sí está disponible
            } catch (error: any) {
                Alert.alert("Error", error.message ?? "No se pudo obtener el servicio.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token, params.id]);

    useFocusEffect(
        useCallback(() => {
            if (!dataService?.requiresLocation) return;

            getLocations().then(data => {
                const list: Location[] = Array.isArray(data.data) ? data.data : [];
                setLocations(list);
                setSelectedLocation(prev =>
                    prev ? list.find(l => l.id === prev.id) ?? list[0] ?? null : list[0] ?? null
                );
            });
        }, [dataService?.requiresLocation])
    );

    const handlePayService = async () => {
        setEnableButton(true);

        if (valuePrice * 100 <= 4999) {
            Alert.alert("Error", "El precio del servicio no puede ser menor a $50.00");
            setEnableButton(false);
            return;
        }

        // 👇 Validar location solo si el servicio la requiere
        if (dataService?.requiresLocation && !selectedLocation) {
            Alert.alert("Error", "Selecciona una ubicación de entrega.");
            setEnableButton(false);
            return;
        }

        try {
            if (!token) {
                router.replace("/(auth)");
                return
            }
            const { paymentintent, ephemeralKey } = await getServicePayment(
                token,
                dataService?.id,
                {
                    notes: infoUserNote,
                    dateRequest: dateRequest.toString(),
                    location: selectedLocation?.id ?? undefined, // 👈 undefined si no aplica
                    amount: valuePrice * 100,
                },
            );

            await initializePaymentSheet(paymentintent, ephemeralKey);

            const { error: payError } = await presentPaymentSheet();
            if (payError) return;

            if (router.canGoBack()) router.back();
        } catch (error) {
            Alert.alert("Error", error?.message);
        } finally {
            setEnableButton(false);
        }
    };

    const initializePaymentSheet = async (payment: string, key: string) => {
        const { error } = await initPaymentSheet({
            customerEphemeralKeySecret: key,
            merchantDisplayName: dataService?.name,
            allowsDelayedPaymentMethods: true,
            returnURL: "workly://stripe-return",
            paymentIntentClientSecret: payment,
            customerId: customer?.customer?.customerId,
            // 👇 Agrega esto para Apple Pay
            applePay: {
                merchantCountryCode: "MX",
            },
            // 👇 Y esto para Google Pay en Android
            // googlePay: {
            //     merchantCountryCode: "MX",
            //     testEnv: __DEV__,
            // },
        });
        if (error) throw new Error(error.message);
    };

    const OpenCompany = () => {
        if (!dataService?.company?.id) return;
        router.navigate({ pathname: '/(home)/company/[id]', params: { id: dataService.company.id } });
    };

    const onConfirmDate = (date?: Date) => {
        setShowPickerDate(false);
        if (!date || !dataService?.company?.businessHours) {
            Alert.alert("Error", "Error para obtener los horarios de la empresa.");
            return;
        }

        const businessHours = dataService.company.businessHours;
        const currentDay = daysArray[date.getDay()];
        const daySchedule: Day = businessHours[currentDay];

        if (!daySchedule?.open) {
            Alert.alert("Cerrado", `El negocio está cerrado los ${currentDay}s.`);
            return;
        }

        const selectedTime = date.getHours() * 100 + date.getMinutes();
        const openTime = timeToNumber(daySchedule.intervals.start);
        const closeTime = timeToNumber(daySchedule.intervals.end);

        if (selectedTime < openTime || selectedTime >= closeTime) {
            Alert.alert("Fuera de horario", `El horario de atención es de ${daySchedule.intervals.start} a ${daySchedule.intervals.end}`);
            return;
        }

        setDateRequest(date);
    };

    const handleShare = async () => {
        try {
            const url = getServiceShareUrl(params.id as string)
            const payload = Platform.select({
                ios: { message: "¡Mira este servicio en Workly!", url },
                android: { message: `¡Mira este servicio en Workly!\n${url}` },
                default: { message: `¡Mira este servicio en Workly!\n${url}` },
            });

            await Share.share(payload, {
                subject: "Servicio en Workly",
                dialogTitle: "Compartir servicio"
            });
        } catch (e) {
            console.error(e);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({ headerRight: () => <ShareButton onPress={handleShare} /> });
    }, []);

    if (loading) return <LoadingScreen />;
    if (!dataService) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>No se pudo cargar el servicio.</Text>
            </View>
        );
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    className="px-3 flex flex-col flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 20, // Espacio extra para que el último input suba holgadamente
                    }}>
                    <View className="flex flex-col pb-3" style={{ gap: 18 }}>

                        {/* Header imagen + empresa */}
                        <View className="flex flex-col items-center justify-center overflow-hidden" style={{ gap: 8 }}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: dataService.photo ?? "https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg" }}
                                width={110}
                                height={110}
                                className="rounded-lg"
                            />
                            <TouchableOpacity onPress={OpenCompany} className="flex flex-col items-center">
                                <Text style={{ fontSize: 14, fontWeight: '600', color: Colors.principal.DEFAULT }}>
                                    Empresa
                                </Text>
                                <Text className="text-text" style={{ fontSize: 12 }}>
                                    {dataService.name ?? "Servicio"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <StatsComponent
                            orders={dataService.ordersCount || 0}
                            views={dataService.views || 0}
                            createdAt={dataService.createdAt}
                        />

                        {/* Descripción */}
                        <View className="py-2 px-3 shadow-lg bg-white rounded-lg flex flex-col" style={{ gap: 6 }}>
                            <Text style={{ color: Colors.principal.DEFAULT, fontWeight: '600', fontSize: 16 }}>
                                Descripción del servicio
                            </Text>
                            <Text className="text-text" style={{ fontWeight: '500' }}>
                                {dataService.description}
                            </Text>
                        </View>

                        <BusinessHours businessHours={dataService.company?.businessHours} />

                        {/* Fecha */}
                        <View className="flex flex-col" style={{ gap: 6 }}>
                            <Text style={{ color: Colors.principal.DEFAULT, fontWeight: '600', fontSize: 16 }}>
                                Fecha de Entrega
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowPickerDate(true)}
                                className="flex flex-row items-center justify-between py-2 px-3 bg-white rounded-lg"
                            >
                                <Text className="text-text" style={{ fontWeight: '500' }}>
                                    {formatDateService(dateRequest)}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Location (opcional) */}
                        {dataService.requiresLocation && (
                            <View className="flex flex-col" style={{ gap: 6 }}>
                                <Text style={{ color: Colors.principal.DEFAULT, fontWeight: '600', fontSize: 16 }}>
                                    Ubicación de entrega
                                </Text>
                                {locations.length === 0 ? (
                                    <View className="flex flex-row items-center" style={{ gap: 4 }}>
                                        <Text style={{ fontSize: 14, color: '#e53e3e' }}>
                                            No tienes ubicaciones guardadas.
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                router.push("/(app)/(tabs)/(user)");
                                                setTimeout(() => {
                                                    router.push("/(app)/(tabs)/(user)/location");
                                                }, 100);
                                            }}
                                        >
                                            <Text style={{ color: "#e53e3e", fontSize: 14, textDecorationLine: "underline" }}>
                                                Agregar una ubicacion.
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <>
                                        <Dropdown
                                            data={locations.map(l => ({ label: l.name, value: l.id }))}
                                            labelField="label"
                                            valueField="value"
                                            value={selectedLocation?.id ?? null}
                                            onChange={item =>
                                                setSelectedLocation(locations.find(l => l.id === item.value) ?? null)
                                            }
                                            placeholder="Selecciona una ubicación"
                                            placeholderStyle={{ color: '#92929D', fontSize: 14 }}
                                            selectedTextStyle={{ color: '#444444', fontSize: 14, fontWeight: '600' }}
                                            itemTextStyle={{ fontSize: 13 }}
                                            style={{ backgroundColor: "#fff", borderRadius: 8, borderWidth: 0, paddingVertical: 8, paddingHorizontal: 12 }}
                                            itemContainerStyle={{ backgroundColor: '#fff', borderRadius: 8 }}
                                            containerStyle={{ borderRadius: 8, borderWidth: 1 }}
                                        />
                                        {selectedLocation && (
                                            <Text style={{ fontSize: 12, color: '#555', paddingHorizontal: 4 }}>
                                                {[selectedLocation.street, selectedLocation.streetNumber, selectedLocation.neighborhood, selectedLocation.city]
                                                    .filter(Boolean).join(", ")}
                                            </Text>
                                        )}
                                    </>
                                )}
                            </View>
                        )}

                        {/* Notas */}
                        <View className="flex flex-col" style={{ gap: 6 }}>
                            <Text style={{ color: Colors.principal.DEFAULT, fontWeight: '600', fontSize: 16 }}>
                                Agregar Notas
                            </Text>
                            <TextInput
                                placeholder="Agregar notas..."
                                multiline
                                className="bg-white text-text rounded-lg py-2 px-3"
                                style={{ height: 120, fontWeight: '500' }}
                                value={infoUserNote}
                                onChangeText={setInfoUserNote} // 👈 simplificado
                            />
                        </View>

                        {/* Precio indefinido */}
                        {dataService.indefinite && (
                            <View className="flex flex-col" style={{ gap: 6 }}>
                                <Text style={{ color: Colors.principal.DEFAULT, fontWeight: '600', fontSize: 16 }}>
                                    Agrega un Precio
                                </Text>
                                <MoneyTextInput
                                    placeholder="Agrega un precio..."
                                    value={valuePrice.toString()}
                                    onChangeText={(_, extracted) => setValuePrice(Number(extracted))}
                                    style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, borderWidth: 0, backgroundColor: "#fff" }}
                                    prefix="$"
                                    groupingSeparator=","
                                    fractionSeparator="."
                                />
                            </View>
                        )}

                        {/* Botón pagar */}
                        <TouchableOpacity
                            disabled={enableButton}
                            onPress={handlePayService}
                            className="flex flex-col items-center justify-center py-3 rounded-lg shadow-lg h-12"
                            style={{ backgroundColor: Colors.principal.DEFAULT }}
                        >
                            {enableButton ? (
                                <SpinLoading color="#ffffff" />
                            ) : (
                                <Text className="text-white" style={{ fontWeight: '600', fontSize: 18 }}>
                                    {valuePrice.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 })}
                                    {" "}{dataService.currency.toUpperCase()}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <DatePicker
                modal
                mode="datetime"
                date={dateRequest}
                onConfirm={onConfirmDate}
                onCancel={() => setShowPickerDate(false)}
                open={showPickerDate}
                minimumDate={new Date(new Date().setMinutes(new Date().getMinutes() + 30))}
            />
        </>
    );
};

export default ServiceHire;
