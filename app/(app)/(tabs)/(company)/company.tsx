import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { router, useNavigation } from 'expo-router';

import { Image } from 'expo-image'

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from '@expo/vector-icons/Entypo';

import Colors from "lib/Colors"
import useGlobal from 'core/globals';

import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { Day, DayName } from '@/types/Schedule';

import CardService from "components/MyCompany/card-service";
import TextSchedule from 'components/Schedule/TextSchedule';
import DayView from 'components/Schedule/DayView';

const daysArray: DayName[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];


export default function Company() {
    const navigation = useNavigation();
    const companyData = useGlobal((state) => state.company);
    const servicesData = useGlobal((state) => state.services);

    const getServices = useGlobal((state) => state.getServices)

    // Optimizar la lista de servicios invertida
    const reversedServices = useMemo(() => {
        return servicesData?.data?.slice().reverse() || [];
    }, [servicesData?.data]);

    const scheduleModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ["85%"], []);

    const openSchedule = () => scheduleModalRef.current?.present();
    const closeSchedule = () => scheduleModalRef.current?.dismiss();

    const handleEditPress = () => {
        router.push("/edit")
    };

    const handleAddServicePress = () => {
        router.push("/service-create");
    };

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

    useEffect(() => {
        getServices()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleEditPress} style={{
                    marginLeft: 7
                }}>
                    <Entypo
                        name="edit"
                        size={20}
                        color={Colors.principal.DEFAULT}
                    />
                </TouchableOpacity>
            )
        })
    }, [companyData])

    return (
        <>
            <ScrollView className="flex-1 px-2">
                <View style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* TopSide */}
                    <View className="flex flex-col items-center justify-center" style={{ gap: 32 }}>
                        <View
                            style={{ backgroundColor: Colors.principal[200], borderRadius: 12 }}
                            className="w-full h-48 flex items-center justify-center relative"
                        >
                            <View
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 9999,
                                    overflow: "hidden",
                                    backgroundColor: Colors.principal[400]
                                }}
                                className="absolute -bottom-8 border-[#f2f2f2] border-4"
                            >
                                <Image
                                    className="w-full h-full"
                                    source={{ uri: companyData?.profile?.photo }}
                                    contentFit="cover"
                                />
                            </View>
                        </View>

                        <Text className="text-xl font-bold" style={{ color: Colors.principal.DEFAULT }}>
                            {companyData?.profile?.name}
                        </Text>

                        {/* Dirección debajo del nombre si existe */}
                        {companyData?.profile?.address && (
                            <View className="flex flex-row items-center space-x-1 -mt-6">
                                <FontAwesome
                                    name="map-marker"
                                    size={18}
                                    color={Colors.principal.DEFAULT}
                                />
                                <Text className="text-sm font-medium" style={{ color: Colors.principal.DEFAULT }}>
                                    {companyData.profile.address}
                                </Text>
                            </View>
                        )}
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

                            {companyData?.profile?.description && (
                                <Text style={{ color: Colors.principal.DEFAULT }}>
                                    {companyData.profile.description}
                                </Text>
                            )}
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

                            <TouchableOpacity
                                className="flex-1 flex flex-row items-center justify-center py-3 px-4 rounded-full"
                                style={{ backgroundColor: Colors.principal.DEFAULT, gap: 6 }}
                            >
                                <Ionicons name="location-outline" size={18} color="white" />
                                <Text className="text-white font-medium">Ubicación</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Services Section */}
                    <View className="flex flex-col" style={{ gap: 6 }}>
                        <View className="flex flex-row items-center">
                            <Text style={{ color: Colors.principal.DEFAULT, fontWeight: "600" }} className="text-base">
                                Servicios de la Empresa
                            </Text>
                            <Entypo name="chevron-down" size={24} color={Colors.principal.DEFAULT} />
                        </View>

                        <TouchableOpacity
                            onPress={handleAddServicePress}
                            className="flex flex-row items-center space-x-2 p-3 rounded-lg"
                            style={{ backgroundColor: Colors.principal[100] }}
                        >
                            <AntDesign
                                name="plus-circle"
                                size={24}
                                color={Colors.principal.DEFAULT}
                            />
                            <Text className="text-base font-semibold" style={{ color: Colors.principal.DEFAULT }}>
                                Agregar un nuevo servicio
                            </Text>
                        </TouchableOpacity>

                        <View style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {reversedServices.map((item) => (
                                <CardService
                                    key={item.id}
                                    id={item.id}
                                    title={item.name}
                                    description={item.description}
                                    price={item.unit_amount}
                                    currency={item.currency}
                                    photo={item.photo}
                                    data={item}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Modal Schedule */}
            <BottomSheetModal
                ref={scheduleModalRef}
                snapPoints={snapPoints}
                enablePanDownToClose
                onDismiss={() => { }}
                backdropComponent={renderBackdrop}
                backgroundStyle={{ backgroundColor: "white", borderRadius: 32, borderWidth: 3, borderColor: "#b0aed720" }}
            >
                <BottomSheetView className="flex-1">
                    <View className="px-2 flex-1 pt-4 pb-16" style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                        <View style={{ display: "flex", alignItems: "center", width: "100%", gap: 6 }}>
                            <Text className="text-2xl text-dark font-bold">Horarios de la empresa</Text>
                            <Text className="text-text">{TextSchedule(companyData?.businessHours, daysArray)}</Text>
                        </View>

                        <View className="px-4 flex flex-col">
                            {daysArray.map((day, k) => {
                                const dayData: Day = companyData.businessHours[day];
                                return <DayView daysArray={daysArray} data={dayData} key={k} label={day} />
                            })}
                        </View>

                        <TouchableOpacity
                            onPress={closeSchedule}
                            className="py-3 px-12"
                            style={{ backgroundColor: Colors.principal.DEFAULT, borderRadius: 9999, alignSelf: "center" }}
                        >
                            <Text className="w-full text-center font-semibold text-white">Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
}