import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import {
    ComponentLabel,
    ComponentGroup,
    ComponentChipActive,
    ComponentChipInactive,
    ComponentOnboardingButton
} from "components/Onboarding"

import useGlobal from 'core/globals'
import { router } from 'expo-router'
import MapCurrentlyDue from 'constants/MapCurrentlyDue'

import GetStatus from 'functions/GetStatus'
import checkcompany from 'functions/CheckCompany'

export default function Onboarding() {
    const companyData = useGlobal(state => state.company)
    const handleInformation = () => {
        router.push({
            pathname: "/onboarding-information",
            params: {
                data: JSON.stringify(companyData?.activity?.requirements?.currently_due)
            }
        })
    }

    return (
        <View className="px-2 py-3" style={{ rowGap: 24 }}>
            <View className="flex flex-row items-center justify-between">
                <Text className="text-[14px] text-[#6B6C69]">
                    <Text className="font-semibold text-dark">Cuenta:</Text>{" "}
                    {companyData?.account}
                </Text>

                {checkcompany(companyData) ? (
                    <ComponentChipActive />
                ) : (
                    <ComponentChipInactive />
                )}
            </View>

            <View className="flex flex-col" style={{ rowGap: 22 }}>
                <ComponentGroup title="Metodos de Pago">
                    <ComponentLabel
                        title="Cobros"
                        value={GetStatus(companyData?.activity?.charges_enabled)}
                    />

                    <ComponentLabel
                        title="Depositos"
                        value={GetStatus(companyData?.activity?.payouts_enabled)}
                    />
                </ComponentGroup>

                <ComponentGroup title="Verificacion de la Cuenta">
                    <ComponentLabel
                        title="Estado de Verificacion"
                        value={
                            companyData.activity.requirements.currently_due.length ===
                                0 ? (
                                "Verificada"
                            ) : (
                                <TouchableOpacity onPress={handleInformation}>
                                    <Text className="text-blue-500 text-[15px] underline">
                                        Ver
                                    </Text>
                                </TouchableOpacity>
                            )
                        }
                    />
                    <ComponentLabel
                        title="Razon de deshabilitado"
                        value={
                            companyData.activity.requirements.disabled_reason
                                ? MapCurrentlyDue[
                                companyData.activity.requirements.disabled_reason
                                ] || companyData.activity.requirements.disabled_reason
                                : "Todo bien"
                        }
                    />
                </ComponentGroup>

                <ComponentGroup title="Capacidades">
                    <ComponentLabel
                        title="Pagos con tarjeta"
                        value={
                            MapCurrentlyDue[
                            companyData.activity.capabilities.card_payments
                            ] || "Desactivado"
                        }
                    />

                    <ComponentLabel
                        title="Transferencias"
                        value={
                            MapCurrentlyDue[companyData.activity.capabilities.transfers] ||
                            "Desactivado"
                        }
                    />
                </ComponentGroup>
            </View>

            <ComponentOnboardingButton />
        </View>
    )
}