import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Props {
    loading: boolean,
    search: string,
    setSearch: any
}

export default function ContainerSearch({ loading, search, setSearch }: Props) {
    const canGoBack = router.canGoBack()
    return (
        <View style={Styles.container}>
            {/* Botón Atrás Personalizado */}
            {canGoBack ? (
                <TouchableOpacity onPress={router.back} style={Styles.buttonBack}>
                    <FontAwesome
                        name="angle-left"
                        color={"#B1B1B4"}
                        size={38}
                    />
                </TouchableOpacity>
            ) : null
            }


            {/* Barra de Búsqueda (Input) */}
            <View
                style={Styles.containerInput}
            >
                <TextInput
                    placeholder="buscar un servicio..."
                    style={Styles.input}
                    placeholderTextColor={"#00000050"}
                    value={search}
                    onChangeText={setSearch}
                    autoFocus={true} // Opcional: enfocar al abrir
                />

                {search && (
                    <TouchableOpacity onPress={() => setSearch("")}>
                        <Ionicons
                            name="close-circle"
                            size={18}
                            color={"#B1B1B4"}
                        />
                    </TouchableOpacity>
                )}

                <AntDesign
                    name="minus"
                    size={18}
                    color={"#B1B1B4"}
                    style={{ transform: [{ rotate: "90deg" }] }}
                />

                <FontAwesome
                    name={loading ? "hourglass-end" : "search"}
                    size={18}
                    color={"#B1B1B4"}
                />
            </View>
        </View >
    )
}


const Styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 4
    },
    buttonBack: {
        flexDirection: "row",
        alignItems: "center",
        paddingRight: 10,
        paddingLeft: 12,
    },
    containerInput: {
        flex: 1,
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        backgroundColor: "#D0D0D0",
        paddingHorizontal: 12,
        borderRadius: 8,
        paddingVertical: 8,
        height: 45,
        marginRight: 12,
    },
    input: {
        fontSize: 16,
        fontWeight: "500", // "500" debe ser string
        flex: 1,
        height: '100%',
    }
})