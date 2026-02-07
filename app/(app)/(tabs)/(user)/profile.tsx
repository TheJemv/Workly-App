import {
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
    Text,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SpinLoading, TextInputUser, ThumnailEdit } from "components";
import { Colors } from "lib";
import { getStreetName } from "services/api/google.api";
import { Entypo } from "@expo/vector-icons";
import useGlobal from "core/globals";
import isEqual from "lodash/isEqual";
import getChangedProperties from "utils/CompareObjects";
import { updatedCustomer } from "services/api/customer.api";

import DatePicker from "react-native-date-picker"

const Profile = () => {
    // Globals Variables
    const customer = useGlobal((state) => state.customer);

    // Variables
    const navigation = useNavigation();

    // UseStates
    const [loading, setLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState(customer?.profile?.photo || null);
    const [valueDataEdit, setValueDataEdit] = useState(customer);
    const [markerCoordinate, setMarkerCoordinate] = useState({
        latitude: customer?.address?.latitude || 0,
        longitude: customer?.address?.longitude || 0,
    });
    const [markerDirection, setMarkerDirection] = useState(null);

    // Nuevo estado para el DatePicker
    const [openDatePicker, setOpenDatePicker] = useState(false);

    // Functions
    const handleValue = useCallback((key, handleValue) => {
        setValueDataEdit((prevValue) => {
            const keys = key.split(".");
            const newValue = JSON.parse(JSON.stringify(prevValue));
            let temp = newValue;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!temp[keys[i]]) {
                    temp[keys[i]] = {};
                }
                temp = temp[keys[i]];
            }
            temp[keys[keys.length - 1]] = handleValue;
            return newValue;
        });
    }, []);

    const formatearFecha = (fecha) => {
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleEditProfile = async () => {
        const newData = getChangedProperties(customer, valueDataEdit);
        setLoading(true);
        await updatedCustomer(newData)
            .then(() => {
                navigation.goBack();
            })
            .catch((e) => {
                Alert.alert("Error", e.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                !isEqual(customer, valueDataEdit) ? (
                    <TouchableOpacity
                        style={{ marginLeft: 6 }}
                        onPress={handleEditProfile}
                    >
                        <Entypo
                            color={Colors.principal.DEFAULT}
                            name="save"
                            size={24}
                        />
                    </TouchableOpacity>
                ) : undefined,
        });
    }, [navigation, valueDataEdit, customer, loading]);

    useEffect(() => {
        const updateAddress = async () => {
            if (!markerCoordinate.latitude && !markerCoordinate.longitude) return;

            handleValue("address.latitude", markerCoordinate.latitude);
            handleValue("address.longitude", markerCoordinate.longitude);
            await getStreetName(
                markerCoordinate.latitude,
                markerCoordinate.longitude,
            )
                .then((res) => {
                    setMarkerDirection(res);
                })
                .catch((e) => {
                    Alert.alert("Error", "Error al obtener la ubicacion...");
                });
        };

        updateAddress();
    }, [markerCoordinate, markerDirection]);

    // Return
    return loading ? (
        <View
            style={{ flex: 1 }}
            className="flex flex-col items-center justify-center"
        >
            <SpinLoading color={Colors.principal.DEFAULT} size={46} />
        </View>
    ) : (
        <ScrollView style={{ gap: 32 }}>
            <View style={{ gap: 32, paddingBottom: 70 }}>
                <View style={{ alignItems: "center" }}>
                    <ThumnailEdit
                        thumbnail={thumbnail}
                        setThumbnail={setThumbnail}
                        getDataPhoto={(e) => handleValue("profile.photo", e)}
                    />
                </View>

                <View style={{ paddingHorizontal: 16, gap: 20 }}>
                    <TextInputUser
                        label="Nombre"
                        placeholder="nombre"
                        value={valueDataEdit?.profile?.name || ""}
                        setValue={(e) => handleValue("profile.name", e)}
                    />
                    <TextInputUser
                        label="Apellidos"
                        placeholder="apellidos"
                        value={valueDataEdit?.profile?.lastName || ""}
                        setValue={(e) => handleValue("profile.lastName", e)}
                    />
                    <TextInputUser
                        label="Telefono"
                        placeholder="telefono"
                        value={valueDataEdit?.profile?.phone || ""}
                        setValue={(e) => handleValue("profile.phone", e)}
                    />

                    {/* Campo de fecha de nacimiento con DatePicker */}
                    <View className="flex flex-col" style={{ gap: 4 }}>
                        <Text style={{ color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: 700 }}>Fecha de Nacimiento</Text>
                        <TouchableOpacity
                            onPress={() => setOpenDatePicker(true)}
                            className="py-2 px-2 rounded-lg border border-dark/10"
                        >
                            {valueDataEdit?.profile?.bornDate ? (
                                <Text>{formatearFecha(new Date(valueDataEdit.profile.bornDate))}</Text>
                            ) : (
                                <Text style={{ fontSize: 14, color: "#92929D" }}>Selecciona tu fecha de nacimiento.</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* DatePicker Modal */}
                    <DatePicker
                        modal
                        open={openDatePicker}
                        date={new Date(valueDataEdit.profile.bornDate) || new Date()}
                        mode="date"
                        locale="es"
                        title="Selecciona la fecga de nacimiento"
                        confirmText="Confirmar"
                        cancelText="Cancelar"
                        maximumDate={new Date()}
                        minimumDate={new Date(1924, 0, 1)}
                        onConfirm={(date) => {
                            setOpenDatePicker(false);
                            handleValue("profile.bornDate", date);
                        }}
                        onCancel={() => {
                            setOpenDatePicker(false);
                        }}
                    />
                </View>
            </View>
        </ScrollView>
    );
};

export default Profile;