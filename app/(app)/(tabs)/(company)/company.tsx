import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useMemo } from 'react'
import { router, useNavigation } from 'expo-router';

import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from '@expo/vector-icons/Entypo';

import Colors from "lib/Colors"
import useGlobal from 'core/globals';
import { Company as CompanyType } from '@/types/Company';

import { Container, CardInfo, CardContent } from "components/CardInfo"
import {
    CompanyProfileHeader,
    CompanyHoursCard,
    CompanyLocationCard,
} from "components/Company";
import CardService from "components/MyCompany/card-service";
import { getOpenStatus } from "utils/companySchedule";
import { serviceCover } from "utils/serviceGallery";
import { COLOR_BACKGROUND } from "constants/index";

export default function Company() {
    const navigation = useNavigation();
    const companyData = useGlobal((state) => state.company) as CompanyType | null;
    const servicesData = useGlobal((state) => state.services);
    const getServices = useGlobal((state) => state.getServices)

    const reversedServices = useMemo(
        () => servicesData?.data?.slice().reverse() || [],
        [servicesData?.data],
    );

    const handleEditPress = () => router.push("/edit");
    const handleAddServicePress = () => router.push("/service-create");

    useEffect(() => {
        getServices()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleEditPress} style={{ marginLeft: 7 }}>
                    <Entypo name="edit" size={20} color={Colors.principal.DEFAULT} />
                </TouchableOpacity>
            )
        })
    }, [companyData])

    if (!companyData) {
        return <View style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }} />;
    }

    const status = getOpenStatus(companyData.businessHours);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 28 }}
        >
            {/* Así ven los clientes tu empresa */}
            <View className="flex-row items-center" style={{ gap: 6, paddingHorizontal: 4 }}>
                <Entypo name="eye" size={13} color="#717171" />
                <Text className="text-text-light text-[12px]">
                    Vista previa de tu empresa
                </Text>
            </View>

            <CompanyProfileHeader
                name={companyData.profile?.name}
                photo={companyData.profile?.photo}
                address={companyData.location?.address}
                status={status}
            />

            {companyData.profile?.description ? (
                <Container>
                    <CardInfo title="Acerca de" icon="info" variant="heading" />
                    <CardContent divided={false}>
                        <View className="p-4">
                            <Text className="text-sm text-text-default leading-relaxed">
                                {companyData.profile.description}
                            </Text>
                        </View>
                    </CardContent>
                </Container>
            ) : null}

            {companyData.location?.address ? (
                <CompanyLocationCard location={companyData.location} />
            ) : null}

            {companyData.businessHours ? (
                <CompanyHoursCard businessHours={companyData.businessHours} />
            ) : null}

            {/* Servicios — con controles de dueño */}
            <Container>
                <CardInfo
                    title={reversedServices.length ? `Servicios · ${reversedServices.length}` : "Servicios"}
                    icon="grid"
                    variant="heading"
                />

                <View style={{ gap: 10 }}>
                    <TouchableOpacity
                        onPress={handleAddServicePress}
                        className="flex-row items-center justify-center rounded-xl"
                        style={{ backgroundColor: Colors.principal[100], gap: 8, paddingVertical: 12 }}
                    >
                        <AntDesign name="plus-circle" size={18} color={Colors.principal.DEFAULT} />
                        <Text className="font-semibold" style={{ color: Colors.principal.DEFAULT }}>
                            Agregar un nuevo servicio
                        </Text>
                    </TouchableOpacity>

                    {reversedServices.map((item) => (
                        <CardService
                            key={item.id}
                            id={item.id}
                            title={item.name}
                            description={item.description}
                            price={item.unit_amount}
                            currency={item.currency}
                            photo={serviceCover(item)}
                            data={item}
                        />
                    ))}
                </View>
            </Container>
        </ScrollView>
    );
}
