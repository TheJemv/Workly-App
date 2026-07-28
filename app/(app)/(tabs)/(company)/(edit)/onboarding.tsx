import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Container, CardInfo, CardContent, Row } from "components/CardInfo"
import {
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

    const currentlyDue = companyData?.activity?.requirements?.currently_due ?? [];
    const disabledReason = companyData?.activity?.requirements?.disabled_reason;
    const cardPayments = companyData?.activity?.capabilities?.card_payments;
    const transfers = companyData?.activity?.capabilities?.transfers;
    const isVerified = currentlyDue.length === 0;

    return (
        <View className="flex-1 bg-surface px-4 pt-4 pb-6" style={{ rowGap: 16 }}>
            {/* Cuenta */}
            <CardContent divided={false}>
                <View className="px-4 py-3 flex-row items-center justify-between gap-3">
                    <View className="flex-shrink">
                        <Text className="text-xs font-semibold text-text-light mb-0.5">Cuenta</Text>
                        <Text className="text-sm text-text-default" numberOfLines={1}>
                            {companyData?.account}
                        </Text>
                    </View>
                    {checkcompany(companyData) ? <ComponentChipActive /> : <ComponentChipInactive />}
                </View>
            </CardContent>

            {/* Métodos de pago */}
            <Container>
                <CardInfo title="Métodos de Pago" />
                <CardContent>
                    <Row
                        icon="credit-card"
                        label="Cobros"
                        value={GetStatus(companyData?.activity?.charges_enabled)}
                        tone={companyData?.activity?.charges_enabled ? "success" : "muted"}
                    />
                    <Row
                        icon="credit-card"
                        label="Depósitos"
                        value={GetStatus(companyData?.activity?.payouts_enabled)}
                        tone={companyData?.activity?.payouts_enabled ? "success" : "muted"}
                    />
                </CardContent>
            </Container>

            {/* Verificación */}
            <Container>
                <CardInfo title="Verificación de la Cuenta" />
                <CardContent>
                    <Row
                        icon="shield"
                        label="Estado de Verificación"
                        value={
                            isVerified ? (
                                "Verificada"
                            ) : (
                                <TouchableOpacity onPress={handleInformation}>
                                    <Text className="text-sm font-semibold text-brand underline">Ver</Text>
                                </TouchableOpacity>
                            )
                        }
                        tone={isVerified ? "success" : "default"}
                    />
                    <Row
                        icon="shield"
                        label="Razón de deshabilitado"
                        value={
                            disabledReason
                                ? MapCurrentlyDue[disabledReason] || disabledReason
                                : "Todo bien"
                        }
                        tone="default"
                    />
                </CardContent>
            </Container>

            {/* Capacidades */}
            <Container>
                <CardInfo title="Capacidades" />
                <CardContent>
                    <Row
                        icon="zap"
                        label="Pagos con tarjeta"
                        value={MapCurrentlyDue[cardPayments] || "Desactivado"}
                        tone={MapCurrentlyDue[cardPayments] ? "success" : "muted"}
                    />
                    <Row
                        icon="zap"
                        label="Transferencias"
                        value={MapCurrentlyDue[transfers] || "Desactivado"}
                        tone={MapCurrentlyDue[transfers] ? "success" : "muted"}
                    />
                </CardContent>
            </Container>

            <ComponentOnboardingButton />
        </View>
    )
}