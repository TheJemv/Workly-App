import { Text, ScrollView, View, Alert, Button } from "react-native";
import { useEffect, useState } from "react";

import { Image } from 'expo-image'
import { HomeServicesData } from "data";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

import SearchBar from "components/Home/SearchBar";
import useGlobal from "core/globals";
import { trandingCustomer } from "services/api/customer.api";

import ServicesTrending from "components/Home/ServicesTrending";
import CompaniesTrending from "components/Home/CompaniesTrending";
import Categories from "components/Home/Categories";

const HomeScreen = () => {
    const [companies, setCompanies] = useState([]);
    const [services, setServices] = useState([]);

    const { customer } = useGlobal();
    useEffect(() => {
        const fetchData = async () => {
            // Cambia temporalmente a una URL pública para probar
            try {
                const data = await trandingCustomer();
                setCompanies(data.companies);
                setServices(data.services);
            } catch (error) {
                console.error("Error en el fetch de los trendings:", error);
                Alert.alert("Error", "Error en el fetch de los trendings");
            }
        };


        fetchData()
    }, []);


    return (
        <View style={{ flex: 1, backgroundColor: "#F7F7F9", marginBottom: 0 }}>
            <Image
                source={require("assets/BackgroundHome.jpg")}
                style={{
                    width: "100%",
                    height: "100%",
                    opacity: 0.5,
                    position: "absolute",
                    top: "-40%",
                    left: 0,
                    transform: [{ rotate: "180deg" }],
                }}
                contentFit="cover"
                cachePolicy="memory-disk"
            />

            <BlurView intensity={100} style={{ flex: 1 }}>
                <ScrollView
                    scrollEnabled={true}
                    style={{
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            gap: 18,
                            paddingTop: 24 + Constants.statusBarHeight,
                        }}
                    >
                        <Text
                            className="text-dark"
                            style={{
                                fontSize: 18,
                                paddingHorizontal: 12,
                                fontWeight: 600,
                            }}
                        >
                            ¡Hola, {customer ? customer.profile.name : "Invitado"}!
                        </Text>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "#F7F7F9",
                                width: "100%",
                                height: "100%",
                                paddingTop: 12,

                                borderTopStartRadius: 24,
                                borderTopEndRadius: 24,
                                paddingBottom: 24,
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >

                            {/* Categrias de los Servicios */}
                            <Categories data={HomeServicesData} />

                            {/* Servicios Populares */}
                            <ServicesTrending data={services} />

                            {/* Buscar Servicios */}
                            <SearchBar />

                            {/* Empresas recomendadas */}
                            <CompaniesTrending data={companies} />
                        </View>
                    </View>
                </ScrollView>
            </BlurView>
        </View>
    );
};

export default HomeScreen;
