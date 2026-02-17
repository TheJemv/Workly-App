import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect, useRef, useState } from 'react'
import { router, useLocalSearchParams, useNavigation } from 'expo-router'

import useGlobal from 'core/globals'

import CountryCodeMap from "constants/countryCodeMap.json";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import { Colors } from 'lib'
import getValue from 'utils/getValue'
import PhoneInput from 'react-native-phone-number-input'

import DataOptions from 'components/DataOptions'
import SpinLoading from 'components/SpinLoading'

import OptionsKeyEnum from 'enum/OptionsKeyEnum';
import { updateCompany } from 'services/api/company.api';

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

    return (
        <View className="flex flex-col flex-1">
            {loading ? (
                <View className="h-1/2 items-center justify-center">
                    <SpinLoading size={52} color={Colors.principal.DEFAULT} />
                </View>
            ) : params.key !== OptionsKeyEnum.description &&
                params.key !== OptionsKeyEnum.phone &&
                params.key !== OptionsKeyEnum.public ? (
                <View className="flex flex-col px-2 flex-1 py-3">
                    <View className="py-1 px-2 rounded-lg flex items-center flex-row border border-dark">
                        <View className="flex flex-col flex-1" style={{ gap: 0 }}>
                            <Text style={{ fontSize: 12 }} className="text-text">
                                {params?.title}
                            </Text>
                            <TextInput
                                ref={inputRef}
                                value={value as string}
                                onChangeText={(e) => setValue(e)}
                                placeholder={(params?.title as string).toLowerCase()}
                                className="pl-0"
                                style={{ fontSize: 15 }}
                                autoCapitalize="none"
                            // keyboardType={
                            //     params?.key === "phone" && "phone-pad"
                            // }
                            />
                        </View>

                        <TouchableOpacity onPress={clearValue} className="py-full">
                            <AntDesign color={"black"} size={16} name="close-circle" />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : params.key === OptionsKeyEnum.phone ? (
                <PhoneInput
                    ref={phoneInput}
                    value={(value as string).slice(-10)}
                    defaultCode={"MX"}
                    layout="second"
                    onChangeFormattedText={(text) => {
                        setValue(text);
                    }}
                    withDarkTheme
                    autoFocus
                    containerStyle={{
                        width: "100%",
                        paddingTop: 12,
                    }}
                />
            ) : params.key === OptionsKeyEnum.description ? (
                <View className="border-black/20 border-b pb-2 px-1 py-2">
                    <TextInput
                        ref={inputRef}
                        value={value as string}
                        onChangeText={(e) => setValue(e)}
                        placeholder={(params.title as string).toLowerCase()}
                        style={{ fontSize: 16 }}
                        multiline
                        maxLength={130}
                    />
                </View>
            ) : (
                params.key === "public" && (
                    <DataOptions
                        setValue={(e) => setValue(e === "publica" ? true : false)}
                        value={value ? "publica" : "privada"}
                        data={["publica", "privada"]}
                    />
                )
            )}
        </View>
    )
}