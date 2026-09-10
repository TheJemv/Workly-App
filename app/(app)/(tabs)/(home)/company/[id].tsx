import {
    View,
    Text,
    Alert,
    ScrollView,
    Platform,
    Share,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";

import { getByIdCompany } from "services/api/company.api";
import { getUserMessage } from "services/api/errors";
import { Company as CompanyType } from "@/types/Company";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
    CardService,
    CompanyProfileHeader,
    CompanyHoursCard,
    CompanyLocationCard,
} from "components/Company";
import { Container, CardInfo, CardContent } from "components/CardInfo";
import ShareButton from "components/Header/ShareButton";
import { getCompanyShareUrl } from "utils/shareLinks";
import { getOpenStatus } from "utils/companySchedule";
import { COLOR_BACKGROUND } from "constants/index";

const ProfileCompanyScreen = () => {
    const params = useLocalSearchParams();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<CompanyType | null>(null);

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
            } catch (error) {
                Alert.alert("Error", getUserMessage(error));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params?.id]);

    const handleShare = async () => {
        try {
            const url = getCompanyShareUrl(params.id as string);
            const payload = Platform.select({
                ios: { message: "¡Mira esta empresa en Workly!", url },
                android: { message: `¡Mira esta empresa en Workly!\n${url}` },
                default: { message: `¡Mira esta empresa en Workly!\n${url}` },
            });
            await Share.share(payload, {
                subject: "Empresa en Workly",
                dialogTitle: "Compartir empresa",
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

    const status = getOpenStatus(company.businessHours);
    const services = company.services ?? [];

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 12, gap: 12, paddingBottom: 28 }}
        >
            <CompanyProfileHeader
                name={company.profile.name}
                photo={company.profile.photo}
                address={company.location?.address}
                status={status}
            />

            {company.profile.description ? (
                <Container>
                    <CardInfo title="Acerca de" icon="info" variant="heading" />
                    <CardContent divided={false}>
                        <View className="p-4">
                            <Text className="text-sm text-text-default leading-relaxed">
                                {company.profile.description}
                            </Text>
                        </View>
                    </CardContent>
                </Container>
            ) : null}

            {company.location?.address ? (
                <CompanyLocationCard location={company.location} />
            ) : null}

            {company.businessHours ? (
                <CompanyHoursCard businessHours={company.businessHours} />
            ) : null}

            <Container>
                <CardInfo
                    title={services.length ? `Servicios · ${services.length}` : "Servicios"}
                    icon="grid"
                    variant="heading"
                />
                {services.length ? (
                    <View style={{ gap: 10 }}>
                        {services.map((service, k) => (
                            <CardService item={service} key={k} />
                        ))}
                    </View>
                ) : (
                    <CardContent divided={false}>
                        <View className="p-4">
                            <Text className="text-sm text-text-light">
                                Esta empresa todavía no tiene servicios publicados.
                            </Text>
                        </View>
                    </CardContent>
                )}
            </Container>
        </ScrollView>
    );
};

export default ProfileCompanyScreen;
