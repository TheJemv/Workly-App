import {
    View,
    Text,
    Image,
    FlatList,
    Alert,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { CardService } from "components/Company";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getByIdCompany } from "services/api/company.api";
import { Company as CompanyType } from "@/types/Company";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import {
    BottomSheetBackdrop,
    BottomSheetModal,
    BottomSheetView,
} from "@gorhom/bottom-sheet";
import { DataDays, Day, DayName } from "@/types/Schedule";
import { Colors } from "lib";


const daysArray: DayName[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

interface PropsScheduleView {
    label: DayName
    data: Day
}

const ComponentScheduleDayView = ({ label, data }: PropsScheduleView) => {
    const date = new Date()
    const currentDay = daysArray[date.getDay() - 1]
    return (
        <View className="flex flex-row items-center justify-between py-3" style={{ borderBottomWidth: 1, borderBottomColor: "#c2c2c2" }}>
            <Text style={{ color: currentDay === label ? "#6366f1" : "#040404" }} className="text-lg text-indigo-500 font-semibold">{label}</Text>
            <Text style={{ color: data.open ? "#000" : "#444444" }}>{data.open ? `${data.intervals.start} - ${data.intervals.end}` : "Cerrado"}</Text>
        </View>
    )
}

const timeToMinutes = (time: string) => {
    const [hourMin, period] = time.split(/(AM|PM)/);
    let [hours, minutes] = hourMin.split(":").map(Number);

    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;

    return hours * 60 + minutes;
};

const messageSchedule = (dataDays: DataDays[]) => {
    const date = new Date()
    const currentDay = daysArray[date.getDay() - 1]
    const currentDaySchedule: Day = dataDays[currentDay]
    const currentMinutes = date.getHours() * 60 + date.getMinutes();

    if (currentDaySchedule.open === false) return "Cerrado"
    if (currentMinutes < timeToMinutes(currentDaySchedule.intervals.start)) return `Abre a las ${currentDaySchedule.intervals.start}`
    if (currentMinutes < timeToMinutes(currentDaySchedule.intervals.end)) return `Cierra a las ${currentDaySchedule.intervals.end}`
    return "Cerrado por hoy, revisa otro dia."
}


const ProfileCompanyScreen = () => {
    const params = useLocalSearchParams();

    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState<CompanyType | null>(null);

    const scheduleModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["85%"], []);

    const openSchedule = () => scheduleModalRef.current?.present();
    const closeSchedule = () => scheduleModalRef.current?.dismiss();

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

    if (loading || !company) {
        return (
            <View className="flex pb-[70px] h-full flex-col items-center justify-center">
                <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
            </View>
        );
    }

    return (
        <>
            <ScrollView className="flex-1 px-3 mb-0 space-y-5">
                <View className="flex flex-col space-y-3">
                    <View className="flex flex-row items-center space-x-3 w-full">
                        <View className="w-14 h-14 rounded-full bg-light/25">
                            <Image
                                className="w-full h-full rounded-full"
                                source={{ uri: company.profile.photo }}
                            />
                        </View>

                        <View className="flex flex-col space-y-1">
                            <View className="flex flex-row justify-between">
                                <Text className="text-base text-dark font-semibold">
                                    {company.profile.name}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text
                        className="text-base text-text font-medium ml-4"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {company.profile.description}
                    </Text>

                    <View className="pt-2 flex flex-col">
                        <Text className="text-lg text-dark font-semibold">
                            Detalles de la Empresa
                        </Text>

                        <View className="flex flex-col ml-2">
                            <TouchableOpacity
                                onPress={openSchedule}
                                className="flex flex-row items-center gap-x-1 w-full py-1"
                            >
                                <MaterialIcons name="schedule" size={18} color="black" />
                                <Text className="text-black">Horarios</Text>
                            </TouchableOpacity>

                            <TouchableOpacity className="flex flex-row items-center gap-x-1 w-full py-1">
                                <Ionicons name="location-outline" size={18} color="black" />
                                <Text className="text-black">Ubicacion</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <FlatList
                    data={company.services}
                    contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
                    ListHeaderComponent={() => (
                        <Text className="text-lg text-dark font-semibold">
                            Servicios de la Empresa
                        </Text>
                    )}
                    renderItem={({ item }) => <CardService item={item} />}
                    scrollEnabled={false}
                />
            </ScrollView>

            {/* ✅ MODAL: esto ya tapa el header del Stack */}
            <BottomSheetModal
                ref={scheduleModalRef}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enablePanDownToClose
                onDismiss={() => { }}
            >
                <BottomSheetView className="flex-1">
                    <View className="px-2 flex-1 pt-8 pb-16" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        <View style={{ display: "flex", alignItems: "center", width: "100%", gap: 12 }}>
                            <Text className="text-2xl text-dark font-bold">Horarios de la empresa</Text>
                            <Text className="text-text">{messageSchedule(company.businessHours)}</Text>
                        </View>

                        <View className="px-4 flex flex-col">
                            {daysArray.map((day, k) => {
                                const dayData: Day = company.businessHours[day];
                                return <ComponentScheduleDayView data={dayData} key={k} label={day} />
                            })}
                        </View>

                        <TouchableOpacity onPress={closeSchedule} className="py-2">
                            <Text className="w-full text-center font-semibold text-dark">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

export default ProfileCompanyScreen;