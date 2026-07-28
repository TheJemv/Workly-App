import { View, Text, TextInput, TouchableOpacity, Platform } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'

import useGlobal from 'core/globals'

import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import { Colors } from 'lib'
import PhoneInput from 'react-native-phone-number-input'

import SpinLoading from 'components/SpinLoading'

import OptionsKeyEnum from 'enum/OptionsKeyEnum';
import { updateCompany } from 'services/api/company.api';

const DESCRIPTION_MAX_LENGTH = 130;

// shadow-sm de NativeWind no funciona en Android (falta elevation),
// y en iOS se corta si el contenedor tiene overflow-hidden.
const cardShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    android: {
        elevation: 2,
    },
});

function buildByPath(path: string, value: any) {
    const keys = path.split(".");
    const result: any = {};
    let current = result;

    keys.forEach((key, index) => {
        if (index === keys.length - 1) {
            current[key] = value;
        } else {
            current[key] = {};
            current = current[key];
        }
    });

    return result;
}

function getByPath(obj: any, path: string) {
    return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export default function OptionScreen() {
    const navigation = useNavigation()
    const params = useLocalSearchParams()

    const companyData = useGlobal(s => s.company)
    const reloadCompany = useGlobal((state) => state.companyReload);

    const phoneInput = useRef(null);
    const inputRef = useRef(null);

    if (!params || !params.key) {
        router.back()
        alert("No existe esta propiedad de key.")
    }

    const [loading, setLoading] = useState<boolean>(false)
    const [value, setValue] = useState<string | boolean>(getByPath(companyData, params.key as string))

    useLayoutEffect(() => {
        navigation.setOptions({
            title: params.title
        })
    }, [])

    const clearValue = () => {
        setValue("");
    };

    const handleSaveData = async () => {
        setLoading(true)
        try {
            const data = buildByPath(params.key as string, value)
            await updateCompany(data).then(async () => {
                await reloadCompany();
                setLoading(false)
                if (router.canGoBack()) router.back()
            })
        } catch (error) {
            alert((error as Error).message)
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                getByPath(companyData, params.key as string) !== value ? (
                    <TouchableOpacity
                        onPress={handleSaveData}
                        disabled={getByPath(companyData, params.key as string) === value}
                        className="flex flex-col ml-1"
                    >
                        <Feather
                            color={Colors.principal.DEFAULT}
                            size={24}
                            name="edit"
                        />
                    </TouchableOpacity>
                ) : undefined,
            headerBackVisible: !loading,
        });
        inputRef.current?.focus();
    }, [navigation, value, getByPath(companyData, params.key as string), loading]);

    const helperText = params?.description as string | undefined;

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-surface">
                <SpinLoading size={52} color={Colors.principal.DEFAULT} />
            </View>
        )
    }

    // ---- Teléfono ----
    if (params.key === OptionsKeyEnum.phone) {
        return (
            <View className="flex-1 bg-surface p-4">
                <View className="rounded-xl bg-white" style={cardShadow}>
                    <View className="rounded-xl border border-border-soft p-4">
                        <Text className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">
                            Número de teléfono
                        </Text>

                        <PhoneInput
                            ref={phoneInput}
                            value={(value as string).slice(-10)}
                            defaultCode={"MX"}
                            layout="second"
                            onChangeFormattedText={(text) => {
                                setValue(text);
                            }}
                            autoFocus
                            containerStyle={{
                                width: "100%",
                                backgroundColor: "transparent",
                                paddingTop: 0,
                            }}
                            textContainerStyle={{
                                backgroundColor: "transparent",
                                paddingLeft: 0,
                            }}
                            textInputStyle={{
                                fontSize: 14,
                                color: Colors.principal.DEFAULT,
                            }}
                            codeTextStyle={{ fontSize: 14 }}
                        />
                    </View>
                </View>

                {helperText && (
                    <Text className="text-xs text-text-light mt-3 px-1 leading-relaxed">
                        {helperText}
                    </Text>
                )}
            </View>
        )
    }

    // ---- Descripción ----
    if (params.key === OptionsKeyEnum.description) {
        const currentLength = (value as string)?.length || 0;
        return (
            <View className="flex-1 bg-surface p-4">
                <View className="rounded-xl bg-white" style={cardShadow}>
                    <View className="rounded-xl border border-border-soft p-4">
                        <Text className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">
                            Descripción de la empresa
                        </Text>
                        <TextInput
                            ref={inputRef}
                            value={value as string}
                            onChangeText={(e) => setValue(e)}
                            placeholder={(params.title as string).toLowerCase()}
                            className="text-sm text-text-default leading-relaxed"
                            style={{ minHeight: 120, textAlignVertical: "top" }}
                            multiline
                            maxLength={DESCRIPTION_MAX_LENGTH}
                            autoFocus
                        />
                        <View className="flex-row justify-end pt-2 border-t border-border-soft mt-2">
                            <Text className="text-xs text-text-light">
                                {currentLength}/{DESCRIPTION_MAX_LENGTH}
                            </Text>
                        </View>
                    </View>
                </View>

                {helperText && (
                    <Text className="text-xs text-text-light mt-3 px-1 leading-relaxed">
                        {helperText}
                    </Text>
                )}
            </View>
        )
    }

    // ---- Campo genérico (ej. Nombre) ----
    return (
        <View className="flex-1 bg-surface p-4">
            <View className="rounded-xl bg-white" style={cardShadow}>
                <View className="rounded-xl border border-border-soft p-4">
                    <Text className="text-xs font-semibold text-text-light uppercase tracking-wide mb-2">
                        {params?.title}
                    </Text>
                    <View className="flex-row items-center">
                        <TextInput
                            ref={inputRef}
                            value={value as string}
                            onChangeText={(e) => setValue(e)}
                            placeholder={(params?.title as string).toLowerCase()}
                            className="flex-1 text-sm text-text-default"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={clearValue}>
                            <AntDesign color={Colors.principal[300]} size={16} name="close-circle" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {helperText && (
                <Text className="text-xs text-text-light mt-3 px-1 leading-relaxed">
                    {helperText}
                </Text>
            )}
        </View>
    )
}