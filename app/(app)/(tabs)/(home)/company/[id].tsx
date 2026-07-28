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
import { CardContent, CardInfo, Container, Row } from "components/CardInfo";


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
            <ScrollView className="flex-1 px-0">
                <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* TopSide */}
                    <View className="flex-1 overflow-y-auto" style={{ gap: 32 }}>
                        <View className="relative">
                            <View className="h-28 bg-brand-light" />

                            <View className="absolute left-1/2 -translate-x-1/2 -ml-10 -bottom-10 z-10">
                                <View className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                                    <Image
                                        className="w-full h-full rounded-2xl"
                                        source={{ uri: company.profile.photo }}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className="mt-4 px-4 pb-4 flex flex-col items-center">
                            <Text className="text-xl font-bold text-text-dark font-heading text-balance text-center">Plometo Don Pepe 2</Text>
                        </View>


                        {/* <div className="mt-12 px-4 pb-4 flex flex-col items-center">
                            <h2 className="text-xl font-bold text-text-dark font-heading text-balance text-center">
                                Plomero Don Pepe 2
                            </h2>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span className="flex items-center gap-1 text-xs text-text-light">
                                    <MapPin size={11} />
                                    Hermosillo, Sonora
                                </span>
                                <span className="w-1 h-1 rounded-full bg-border-soft" />
                                <span className="flex items-center gap-1 text-xs text-success font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
                                    Disponible
                                </span>
                            </div>
                        </div> */}
                    </View>


                    {/* Detalles */}
                    <View className="px-3 flex gap-y-3">
                        <Container>
                            <CardInfo title="Detalles de la Empresa" variant="heading" />
                            <CardContent>
                                <View className="p-4">
                                    <Text className="text-sm text-text-default leading-relaxed">
                                        {company.profile.description}
                                    </Text>
                                </View>
                            </CardContent>
                        </Container>


                        <TouchableOpacity
                            onPress={openSchedule}
                            className="flex-1 flex flex-row items-center justify-center py-3 px-4 rounded-xl mb-1"
                            style={{ backgroundColor: Colors.principal.DEFAULT, gap: 6 }}
                        >
                            <MaterialIcons name="schedule" size={18} color="white" />
                            <Text className="text-white font-medium">Horarios</Text>
                        </TouchableOpacity>

                        <Container>
                            <CardInfo title="Servicios" variant="heading" />
                            <CardContent>
                                {company.services.map((s, k) => (
                                    <CardService item={s} key={k} />
                                ))}
                            </CardContent>
                        </Container>
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