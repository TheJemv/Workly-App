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
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatsComponent } from "components/Services";
import { getService, getServicePayment } from "services/api/services.api";
import LoadingScreen from "components/LoadingScreen";
import { timeToNumber } from "utils";
import type { Service as ServiceType } from "@/types/Service";
import type { Day, DayName } from "@/types/Schedule";
import type { Location } from "@/types/Location";
import ShareButton from "components/Header/ShareButton";
import { MoneyTextInput } from "@alexzunik/react-native-money-input";
import { Dropdown } from "react-native-element-dropdown";
import SpinLoading from "components/SpinLoading";
import { getLocations } from "services/api/location.api";
import { Container, CardInfo, CardContent, Row, cardShadow } from "components/CardInfo";

import { getServiceShareUrl } from "utils/shareLinks"
import { Feather } from "@expo/vector-icons";

import { useServicePaymentSheet } from "hooks/stripe/useServicePaymentSheet";

// Orden para validar contra Date.getDay() (0 = Domingo) - NO reordenar, es índice real
const daysArray: DayName[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Orden solo para mostrar el listado de horarios (Lunes → Domingo), como en el diseño
const displayDaysOrder: DayName[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const FALLBACK_PHOTO_URL = "https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg";

const ServiceHire = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { token, customer } = useContext(AuthContext);
    const { pay } = useServicePaymentSheet();

    const [infoUserNote, setInfoUserNote] = useState("");
    const [dataService, setDataService] = useState<ServiceType | null>(null);
    const [loading, setLoading] = useState(true);
    const [enableButton, setEnableButton] = useState(false);
    const [dateRequest, setDateRequest] = useState(
        new Date(new Date().setMinutes(new Date().getMinutes() + 30))
    );
    const [showPickerDate, setShowPickerDate] = useState(false);
    const [valuePrice, setValuePrice] = useState<number>(0);

    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (!params.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getService(params.id as string);
                setDataService(data?.service);
                setValuePrice(data.service.unit_amount / 100);
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

        if (dataService?.requiresLocation && !selectedLocation) {
            Alert.alert("Error", "Selecciona una ubicación de entrega.");
            setEnableButton(false);
            return;
        }

        if (!token) {
            router.replace("/(auth)");
            setEnableButton(false);
            return;
        }

        const customerId = customer?.customer?.customerId;
        if (!customerId) {
            Alert.alert("Error", "No se pudo obtener tu información de cliente.");
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
                    location: selectedLocation?.id ?? undefined,
                    amount: valuePrice * 100,
                },
            );

            const { success, error } = await pay({
                paymentIntentClientSecret: paymentintent,
                ephemeralKey,
                customerId,
                merchantDisplayName: dataService?.name ?? "Workly",
                merchantCountryCode: "MX",
            });

            if (!success) {
                if (error) Alert.alert("Error", error);
                return;
            }

            if (router.canGoBack()) router.back();
        } catch (error: any) {
            Alert.alert("Error", error?.message ?? "Ocurrió un error al procesar el pago.");
        } finally {
            setEnableButton(false);
        }
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
                    className="px-3 flex flex-col flex-1 bg-surface"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="flex flex-col pb-3" style={{ gap: 18 }}>

                        {/* Header imagen + empresa */}
                        <View className="flex flex-col items-center justify-center pt-2" style={{ gap: 8 }}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: dataService.photo ?? FALLBACK_PHOTO_URL }}
                                style={[{ width: 96, height: 96, borderRadius: 12 }, cardShadow]}
                                className="border border-border-soft"
                            />
                            <TouchableOpacity onPress={OpenCompany} className="flex flex-col items-center mt-1">
                                <Text className="text-sm font-bold" style={{ color: Colors.principal.DEFAULT }}>
                                    Empresa
                                </Text>
                                <Text className="text-xs text-text-light mt-0.5">
                                    {dataService.name ?? "Servicio"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <StatsComponent
                            orders={dataService.ordersCount || 0}
                            views={dataService.views || 0}
                            createdAt={dataService.createdAt}
                        />

                        {/* Descripción (título vive dentro de la card) */}
                        <CardContent divided={false}>
                            <View className="p-4">
                                <View className="flex-row items-center gap-2 mb-2">
                                    <Feather name="file-text" size={13} color={Colors.principal.DEFAULT} />
                                    <Text className="text-sm font-bold" style={{ color: Colors.principal.DEFAULT }}>
                                        Descripción del servicio
                                    </Text>
                                </View>
                                <Text className="text-sm text-text-default leading-relaxed">
                                    {dataService.description}
                                </Text>
                            </View>
                        </CardContent>

                        {/* Horarios de la empresa */}
                        <Container>
                            <CardInfo title="Horarios de la Empresa" icon="clock" variant="heading" />
                            <CardContent>
                                {displayDaysOrder.map((day) => {
                                    const schedule: Day | undefined = dataService.company?.businessHours?.[day];
                                    return (
                                        <Row
                                            key={day}
                                            label={day}
                                            value={
                                                schedule?.open ? (
                                                    <Text className="text-sm font-medium text-text-dark">
                                                        {schedule.intervals.start}
                                                        <Text className="text-text-light"> – </Text>
                                                        {schedule.intervals.end}
                                                    </Text>
                                                ) : (
                                                    <Text className="text-sm text-text-light italic">Cerrado</Text>
                                                )
                                            }
                                        />
                                    );
                                })}
                            </CardContent>
                        </Container>

                        {/* Fecha de entrega */}
                        <Container>
                            <CardInfo title="Fecha de Entrega" icon="calendar" variant="heading" />
                            <CardContent divided={false}>
                                <TouchableOpacity
                                    onPress={() => setShowPickerDate(true)}
                                    className="px-4 py-3"
                                >
                                    <Text className="text-sm text-text-default">
                                        {formatDateService(dateRequest)}
                                    </Text>
                                </TouchableOpacity>
                            </CardContent>
                        </Container>

                        {/* Ubicación (opcional) */}
                        {dataService.requiresLocation && (
                            <Container>
                                <CardInfo title="Ubicación de entrega" icon="map-pin" variant="heading" />
                                {locations.length === 0 ? (
                                    <CardContent divided={false}>
                                        <View className="px-4 py-3 flex-row items-center flex-wrap" style={{ gap: 4 }}>
                                            <Text className="text-sm" style={{ color: '#e53e3e' }}>
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
                                    </CardContent>
                                ) : (
                                    <CardContent divided={false}>
                                        <View className="p-3">
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
                                                style={{ backgroundColor: "transparent", paddingVertical: 4, paddingHorizontal: 4 }}
                                                itemContainerStyle={{ backgroundColor: '#fff', borderRadius: 8 }}
                                                containerStyle={{ borderRadius: 8, borderWidth: 1 }}
                                            />
                                            {selectedLocation && (
                                                <Text className="text-xs text-text-light px-1 mt-1">
                                                    {[selectedLocation.street, selectedLocation.streetNumber, selectedLocation.neighborhood, selectedLocation.city]
                                                        .filter(Boolean).join(", ")}
                                                </Text>
                                            )}
                                        </View>
                                    </CardContent>
                                )}
                            </Container>
                        )}

                        {/* Notas */}
                        <Container>
                            <CardInfo title="Agregar Notas" icon="edit-3" variant="heading" />
                            <CardContent divided={false}>
                                <TextInput
                                    placeholder="Agregar notas..."
                                    multiline
                                    className="text-sm text-text-default px-4 py-3"
                                    style={{ height: 100, textAlignVertical: "top" }}
                                    value={infoUserNote}
                                    onChangeText={setInfoUserNote}
                                />
                            </CardContent>
                        </Container>

                        {/* Precio indefinido */}
                        {dataService.indefinite && (
                            <Container>
                                <CardInfo title="Agrega un Precio" icon="dollar-sign" variant="heading" />
                                <CardContent divided={false}>
                                    <MoneyTextInput
                                        placeholder="Agrega un precio..."
                                        value={valuePrice.toString()}
                                        onChangeText={(_, extracted) => setValuePrice(Number(extracted))}
                                        style={{ paddingVertical: 10, paddingHorizontal: 16, backgroundColor: "transparent" }}
                                        prefix="$"
                                        groupingSeparator=","
                                        fractionSeparator="."
                                    />
                                </CardContent>
                            </Container>
                        )}

                        {/* Botón pagar */}
                        <TouchableOpacity
                            disabled={enableButton}
                            onPress={handlePayService}
                            className="flex flex-col items-center justify-center py-4 rounded-xl h-14"
                            style={[{ backgroundColor: Colors.principal.DEFAULT }, cardShadow]}
                        >
                            {enableButton ? (
                                <SpinLoading color="#ffffff" />
                            ) : (
                                <Text className="text-white font-bold text-base">
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