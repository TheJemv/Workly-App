import {
    View,
    Text,
    Image,
    FlatList,
    Alert,
    ScrollView,
    TouchableOpacity,
    Share,
    Platform,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { CardService } from "components/Company";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { getByIdCompany } from "services/api/company.api";
import { Company as CompanyType } from "@/types/Company";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from '@expo/vector-icons/Entypo';

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Day, DayName } from "@/types/Schedule";
import TextSchedule from "components/Schedule/TextSchedule";
import DayView from "components/Schedule/DayView";
import { Colors } from "lib";
import ShareButton from "components/Header/ShareButton";
import { getCompanyShareUrl } from "utils/shareLinks";


const daysArray: DayName[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

const ProfileCompanyScreen = () => {
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState<CompanyType | null>(null);
    const scheduleModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["85%"], []);
    const openSchedule = () => scheduleModalRef.current?.present();
    const closeSchedule = () => scheduleModalRef.current?.dismiss();

    const navigation = useNavigation()

    useEffect(() => {
        const fetchData = async () => {
            if (!params?.id) {
                Alert.alert("Error", "Error al obtener la empresa.");
                return;
            }

            try {
                setLoading(true);
                const data = await getByIdCompany(params.id as string);
                setCompany(data.company);
            } catch (error: any) {
                Alert.alert("Error", error?.message ?? "Error al obtener la empresa");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                opacity={0.5}
                pressBehavior="close"
            />
        ),
        []
    );

    const handleShare = async () => {
        try {
            const url = getCompanyShareUrl(params.id as string)
            const payload = Platform.select({
                ios: { message: "¡Mira esta empresa en Workly!", url },
                android: { message: `¡Mira este servicio en Workly!\n${url}` },
                default: { message: `¡Mira este servicio en Workly!\n${url}` },
            });

            await Share.share(payload, {
                subject: "Empresa en Workly",
                dialogTitle: "Compartir empresa"
            });
        } catch (e) {
            console.error(e);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({ headerRight: () => <ShareButton onPress={handleShare} /> });
    }, []);

    if (loading || !company) {
        return (
            <View className="flex pb-[70px] h-full flex-col items-center justify-center">
                <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
            </View>
        );
    }

    return (
        <>
            {/* Company */}
            <ScrollView className="flex-1 px-2">
                <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* TopSide */}
                    <View className="flex flex-col items-center justify-center" style={{ gap: 32 }}>
                        <View style={{ backgroundColor: Colors.principal[200], borderRadius: 12 }} className="w-full h-48 flex items-center justify-center">
                            <View style={{ width: 150, height: 150, borderRadius: 9999, overflow: "hidden", backgroundColor: Colors.principal[400] }} className="absolute -bottom-8 border-[#f2f2f2] border-4">
                                <Image
                                    className="w-full h-full rounded-2xl"
                                    source={{ uri: company.profile.photo }}
                                />
                            </View>
                        </View>

                        <Text className="text-xl font-bold" style={{ color: Colors.principal.DEFAULT }}>
                            {company.profile.name}
                        </Text>
                    </View>

                    {/* Description */}
                    <View className="flex flex-col" style={{ gap: 18 }}>
                        <View className="flex flex-col" style={{ gap: 6 }}>
                            <View className="flex flex-row items-center">
                                <Text style={{ color: Colors.principal.DEFAULT, fontWeight: "600" }} className="text-base">
                                    Detalles de la Empresa
                                </Text>
                                <Entypo name="chevron-down" size={24} color={Colors.principal.DEFAULT} />
                            </View>
                            <Text style={{ color: Colors.principal.DEFAULT }}>
                                {company.profile.description}
                            </Text>
                        </View>

                        <View className="flex flex-row justify-between items-center" style={{ gap: 8 }}>
                            <TouchableOpacity
                                onPress={openSchedule}
                                className="flex-1 flex flex-row items-center justify-center py-3 px-4 rounded-full"
                                style={{ backgroundColor: Colors.principal.DEFAULT, gap: 6 }}
                            >
                                <MaterialIcons name="schedule" size={18} color="white" />
                                <Text className="text-white font-medium">Horarios</Text>
                            </TouchableOpacity>

                            {company.location && (
                                <TouchableOpacity
                                    className="flex-1 flex flex-row items-center justify-center py-3 px-4 rounded-full"
                                    style={{ backgroundColor: Colors.principal.DEFAULT, gap: 6 }}
                                >
                                    <Ionicons name="location-outline" size={18} color="white" />
                                    <Text className="text-white font-medium">Ubicación</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Services */}
                    <View className="flex flex-col" style={{ gap: 6 }}>
                        <View className="flex flex-row items-center">
                            <Text style={{ color: Colors.principal.DEFAULT, fontWeight: "600" }} className="text-base">
                                Servicios de la Empresa
                            </Text>
                            <Entypo name="chevron-down" size={24} color={Colors.principal.DEFAULT} />
                        </View>

                        <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {company.services.map((service, k) => (
                                <CardService item={service} key={k} />
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>



            {/* ✅ MODAL: esto ya tapa el header del Stack */}
            <BottomSheetModal
                ref={scheduleModalRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                onDismiss={() => { }}
                backgroundStyle={{ backgroundColor: "white", borderRadius: 32, borderWidth: 3, borderColor: "#b0aed720" }}
            >
                <BottomSheetView className="flex-1">
                    <View className="px-2 flex-1 pt-4 pb-16" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        <View style={{ display: "flex", alignItems: "center", width: "100%", gap: 6 }}>
                            <Text className="text-2xl text-dark font-bold">Horarios de la empresa</Text>
                            <Text className="text-text">{TextSchedule(company.businessHours, daysArray)}</Text>
                        </View>

                        <View className="px-4 flex flex-col">
                            {daysArray.map((day, k) => {
                                const dayData: Day = company.businessHours[day];
                                return <DayView daysArray={daysArray} data={dayData} key={k} label={day} />
                            })}
                        </View>

                        <TouchableOpacity onPress={closeSchedule} className="py-3 px-12" style={{ backgroundColor: Colors.principal.DEFAULT, borderRadius: 9999, alignSelf: "center" }}>
                            <Text className="w-full text-center font-semibold text-white">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

export default ProfileCompanyScreen;