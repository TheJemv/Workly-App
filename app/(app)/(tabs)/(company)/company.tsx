import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Colors from "lib/Colors"
import useGlobal from 'core/globals';

import { TimesOpen } from "components/times-open";
import { ButtonIconLink } from "components/Company/button-link";
import CardService from "components/MyCompany/card-service";

const ALLOWED_CONTACT_TYPES = ["instagram", "facebook", "phone", "linkedin"] as const;

export default function Company() {
    const companyData = useGlobal((state) => state.company);
    const servicesData = useGlobal((state) => state.services);

    const getServices = useGlobal((state) => state.getServices)

    // Optimizar la lista de contactos filtrados
    const contactLinks = useMemo(() => {
        if (!companyData?.profile?.contact) return [];

        return Object.entries(companyData.profile.contact)
            .filter(([key, value]) =>
                ALLOWED_CONTACT_TYPES.includes(key as any) && value && key !== 'id'
            )
            .map(([key, value]) => ({
                type: key,
                value: value as string
            }));
    }, [companyData?.profile?.contact]);

    // Optimizar la lista de servicios invertida
    const reversedServices = useMemo(() => {
        return servicesData?.data?.slice().reverse() || [];
    }, [servicesData?.data]);

    const handleEditPress = () => {
        router.push("/edit")
    };

    const handleAddServicePress = () => {
        router.push("/service-create");
    };


    useEffect(() => {
        getServices()
    }, [])


    return (
        <SafeAreaView className="flex-1">
            <ScrollView className="flex-1 px-3 my-3 space-y-5">
                {/* Header Section */}
                <View className="flex flex-col space-y-3">
                    {/* Company Profile Header */}
                    <View className="flex flex-row items-center space-x-3 w-full">
                        <View className="w-14 h-14 rounded-full bg-light/25">
                            <Image
                                className="w-full h-full rounded-full"
                                source={{
                                    uri: companyData?.profile?.photo,
                                }}
                            />
                        </View>

                        <View className="flex flex-col space-y-1 flex-1">
                            <Text className="text-base text-dark font-semibold">
                                {companyData?.profile?.name}
                            </Text>

                            {companyData?.profile?.address && (
                                <View className="flex flex-row items-center space-x-1">
                                    <FontAwesome
                                        name="map-marker"
                                        size={20}
                                        color={Colors.buttonColor}
                                    />
                                    <Text className="text-sm text-text font-medium">
                                        {companyData.profile.address}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={handleEditPress}
                            className="bg-primary p-1.5 rounded-full"
                        >
                            <AntDesign color="white" size={14} name="edit" />
                        </TouchableOpacity>
                    </View>

                    {/* Company Description */}
                    {companyData?.profile?.description && (
                        <Text
                            className="text-base text-text font-medium"
                            numberOfLines={3}
                        >
                            {companyData.profile.description}
                        </Text>
                    )}

                    {/* Business Hours and Contact */}
                    <View className="flex flex-col space-y-3">
                        {/* Contact Links */}
                        {contactLinks.length > 0 && (
                            <View className="flex flex-row items-center justify-evenly space-x-2">
                                {contactLinks.map(({ type, value }) => (
                                    <ButtonIconLink
                                        key={type}
                                        icon={type}
                                        value={value}
                                    />
                                ))}
                            </View>
                        )}

                        {companyData?.businessHours && (
                            <TimesOpen businessHours={companyData.businessHours} />
                        )}

                    </View>
                </View>

                {/* Services Section */}
                <FlatList
                    data={reversedServices}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                        <CardService
                            id={item.id}
                            title={item.name}
                            description={item.description}
                            price={item.unit_amount}
                            currency={item.currency}
                            photo={item.photo}
                            data={item}
                        />
                    )}
                    contentContainerStyle={{ gap: 8 }}
                    ListHeaderComponent={
                        <TouchableOpacity
                            onPress={handleAddServicePress}
                            className="flex flex-row items-center space-x-2 p-2 bg-light/25 rounded-lg"
                        >
                            <AntDesign
                                name="plus-circle"
                                size={24}
                                color={Colors.buttonColor}
                            />
                            <Text className="text-base text-dark font-semibold">
                                Agregar un nuevo servicio
                            </Text>
                        </TouchableOpacity>
                    }
                />
            </ScrollView>
        </SafeAreaView>
    );
}