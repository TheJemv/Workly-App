import {
    View,
    ScrollView,
    TouchableOpacity,
    Text,
    FlatList,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { searchCompany } from "services/api/company.api";
import ContainerSearch from "components/ContainerSearch";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
    // States
    const [search, setSearch] = useState("");
    const [suggestions, setSuggetions] = useState([]);
    const [loading, setLoading] = useState(false);

    // Efecto para buscar
    useEffect(() => {
        const fetchServices = async () => {
            if (!search) return;
            try {
                setLoading(true);
                await searchCompany(search).then((data) => {
                    setSuggetions(data.suggestions);
                });
            } catch (error) {
                Alert.alert("Error", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [search]);

    const handleClickSearch = (query: string) => {
        router.navigate({
            pathname: "/(home)/search/results",
            params: {
                query: query
            }
        });
    }

    // Render
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <ContainerSearch loading={loading} search={search} setSearch={setSearch} />

            <ScrollView
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
                contentContainerStyle={{ gap: 18 }} // Mueve el gap aquí para ScrollView
            >
                {/* Contenido */}
                {!search ? (
                    <View
                        style={{
                            flex: 1,
                            paddingHorizontal: 12,
                            paddingTop: 18,
                            gap: 18,
                        }}
                    >
                        <Text style={{ fontSize: 18, fontWeight: "600", width: "100%" }}>
                            Recomendados...
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item, index) => index.toString()}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleClickSearch(item)}
                                style={{
                                    flexDirection: "row",
                                    gap: 12,
                                    alignItems: "center",
                                    paddingVertical: 12,
                                    paddingHorizontal: 12,
                                }}
                            >
                                <FontAwesome
                                    name="search"
                                    size={16}
                                    color={"#00000060"}
                                />
                                <View style={{ flexDirection: "column" }}>
                                    <Text
                                        numberOfLines={1}
                                        style={{ color: "#00000060", fontWeight: "bold" }}
                                    >
                                        {item}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 1, backgroundColor: "#00000010" }} />
                        )}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default SearchScreen;