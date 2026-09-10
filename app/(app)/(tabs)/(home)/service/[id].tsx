import { AuthContext } from "context/AuthContext";
import { Colors } from "lib";
import { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
    Text, ScrollView, View, Image,
    TouchableOpacity, TextInput, Alert, Share,
    Platform, KeyboardAvoidingView
} from "react-native";
import DatePicker from "react-native-date-picker";
import formatDateService from "functions/formatDateService";
import { useFocusEffect, useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StatsComponent } from "components/Services";
import { getService } from "services/api/services.api";
import { getUserMessage } from "services/api/errors";
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

import AddonStepper from "components/Service/AddonStepper";
import PriceBreakdown from "components/Service/PriceBreakdown";
import ServiceGallery from "components/Service/ServiceGallery";
import { serviceGallery } from "utils/serviceGallery";
import {
    computeMerchandiseSubtotal,
    defaultSelections,
    selectionsToArray,
} from "utils/pricing";
import { useCheckoutStore } from "core/checkoutStore";

// Orden para validar contra Date.getDay() (0 = Domingo) - NO reordenar, es índice real
const daysArray: DayName[] = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Orden solo para mostrar el listado de horarios (Lunes → Domingo), como en el diseño
const displayDaysOrder: DayName[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const FALLBACK_PHOTO_URL = "https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg";

const MIN_AMOUNT = 4999;

const ServiceHire = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();
    const { token } = useContext(AuthContext);
    const setDraft = useCheckoutStore((s) => s.setDraft);

    const [infoUserNote, setInfoUserNote] = useState("");
    const [dataService, setDataService] = useState<ServiceType | null>(null);
    const [loading, setLoading] = useState(true);
    const [enableButton, setEnableButton] = useState(false);
    const [dateRequest, setDateRequest] = useState(
        new Date(new Date().setMinutes(new Date().getMinutes() + 30))
    );
    const [showPickerDate, setShowPickerDate] = useState(false);
    // Precio para servicios "a convenir" (pesos). Para precio fijo no se usa.
    const [valuePrice, setValuePrice] = useState<number>(0);
    // Cantidades elegidas por addon: { [addonId]: quantity }
    const [selections, setSelections] = useState<Record<string, number>>({});

    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const router = useRouter();

    useEffect(() => {
        if (!params.id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getService(params.id as string);
                const svc: ServiceType = data?.service;
                setDataService(svc);
                setValuePrice((svc?.unit_amount ?? 0) / 100);
                setSelections(defaultSelections(svc ?? { addons: [] }));
            } catch (error: any) {
                Alert.alert("Error", getUserMessage(error));
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

    // Subtotal de mercancía en vivo (sin comisión). Para "a convenir" la base es lo que teclea el usuario.
    const subtotal = useMemo(() => {
        if (!dataService) return null;
        const isIndefinite = dataService.indefinite;
        return computeMerchandiseSubtotal(
            {
                unit_amount: isIndefinite ? Math.round(valuePrice * 100) : dataService.unit_amount,
                addons: isIndefinite ? [] : dataService.addons,
            },
            selections,
        );
    }, [dataService, valuePrice, selections]);

    const handleContinue = () => {
        if (!dataService) return;
        setEnableButton(true);
        try {
            if (!token) {
                router.replace("/(auth)");
                return;
            }
            if (dataService.requiresLocation && !selectedLocation) {
                Alert.alert("Error", "Selecciona una ubicación de entrega.");
                return;
            }
            if (dataService.indefinite && Math.round(valuePrice * 100) < MIN_AMOUNT) {
                Alert.alert("Error", "Ingresa un precio de al menos $49.99.");
                return;
            }
            if ((subtotal?.totalAmount ?? 0) < MIN_AMOUNT) {
                Alert.alert("Error", "El total no puede ser menor a $49.99.");
                return;
            }

            const locationLabel = selectedLocation
                ? [
                      selectedLocation.name,
                      [selectedLocation.street, selectedLocation.streetNumber, selectedLocation.neighborhood, selectedLocation.city]
                          .filter(Boolean)
                          .join(", "),
                  ]
                      .filter(Boolean)
                      .join(" · ")
                : null;

            setDraft({
                serviceId: dataService.id,
                dateRequest: dateRequest.toISOString(),
                location: dataService.requiresLocation ? selectedLocation?.id ?? null : null,
                locationLabel,
                locationData: dataService.requiresLocation ? selectedLocation : null,
                notes: infoUserNote.trim() ? infoUserNote.trim() : null,
                addonSelections: dataService.indefinite ? [] : selectionsToArray(selections),
                customPrice: dataService.indefinite ? Math.round(valuePrice * 100) : undefined,
            });

            router.push("/(app)/(tabs)/(home)/service/checkout");
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

    const addons = dataService.indefinite ? [] : dataService.addons ?? [];
    const gallery = serviceGallery(dataService);
    const galleryPhotos = gallery.length ? gallery : [FALLBACK_PHOTO_URL];

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

                        {/* Galería + servicio + empresa */}
                        <View className="pt-2" style={{ gap: 12 }}>
                            <ServiceGallery photos={galleryPhotos} horizontalPadding={24} />

                            <View>
                                <Text className="text-dark font-bold text-[18px]" numberOfLines={2}>
                                    {dataService.name ?? "Servicio"}
                                </Text>

                                {dataService.company?.profile ? (
                                    <TouchableOpacity
                                        onPress={OpenCompany}
                                        className="flex-row items-center"
                                        style={{ gap: 8, marginTop: 6 }}
                                    >
                                        <Image
                                            source={{ uri: dataService.company.profile.photo }}
                                            style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: "#eaeaea" }}
                                        />
                                        <Text className="text-text text-[13px] flex-1" numberOfLines={1}>
                                            {dataService.company.profile.name}
                                        </Text>
                                        <Feather name="chevron-right" size={16} color="#9fa8c9" />
                                    </TouchableOpacity>
                                ) : null}
                            </View>
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

                        {/* Complementos */}
                        {addons.length > 0 && (
                            <Container>
                                <CardInfo title="Complementos" icon="plus-circle" variant="heading" />
                                <CardContent>
                                    {addons.map((addon) => (
                                        <AddonStepper
                                            key={addon.id}
                                            addon={addon}
                                            quantity={selections[addon.id] ?? addon.minQuantity}
                                            onChange={(q) =>
                                                setSelections((prev) => ({ ...prev, [addon.id]: q }))
                                            }
                                        />
                                    ))}
                                </CardContent>
                            </Container>
                        )}

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
                                    maxLength={1000}
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

                        {/* Resumen (subtotal de mercancía en vivo) */}
                        {subtotal && (
                            <Container>
                                <CardInfo title="Resumen" icon="file-text" variant="heading" />
                                <CardContent divided={false}>
                                    <PriceBreakdown variant="preview" subtotal={subtotal} />
                                </CardContent>
                            </Container>
                        )}

                        {/* Botón continuar */}
                        <TouchableOpacity
                            disabled={enableButton}
                            onPress={handleContinue}
                            className="flex flex-row items-center justify-center py-4 rounded-xl h-14"
                            style={[{ backgroundColor: Colors.principal.DEFAULT, gap: 8 }, cardShadow]}
                        >
                            {enableButton ? (
                                <SpinLoading color="#ffffff" />
                            ) : (
                                <>
                                    <Text className="text-white font-bold text-base">Continuar</Text>
                                    <Feather name="arrow-right" size={18} color="#ffffff" />
                                </>
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
