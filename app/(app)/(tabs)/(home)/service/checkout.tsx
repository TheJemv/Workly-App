import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Text, View, Image, ScrollView, TouchableOpacity, Alert,
    Platform, KeyboardAvoidingView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "lib";
import { Feather } from "@expo/vector-icons";

import useGlobal from "core/globals";
import { useCheckoutStore } from "core/checkoutStore";
import { getServicePayment, type PayServiceResponse } from "services/api/services.api";
import { listOrders } from "services/api/orders.api";
import { getUserMessage } from "services/api/errors";
import { useServicePaymentSheet } from "hooks/stripe/useServicePaymentSheet";
import { Container, CardInfo, CardContent, cardShadow } from "components/CardInfo";
import PriceBreakdown from "components/Service/PriceBreakdown";
import LocationPreview from "components/Service/LocationPreview";
import SpinLoading from "components/SpinLoading";
import formatDateService from "functions/formatDateService";
import { formatMXN } from "utils/pricing";

type Phase = "preparing" | "ready" | "paying" | "processing" | "error";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function ServiceCheckout() {
    const router = useRouter();
    const draft = useCheckoutStore((s) => s.draft);
    const clearDraft = useCheckoutStore((s) => s.clear);
    const getOrders = useGlobal((s) => s.getOrders);
    const { pay } = useServicePaymentSheet();

    const [phase, setPhase] = useState<Phase>("preparing");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [data, setData] = useState<PayServiceResponse | null>(null);
    const startedRef = useRef(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const prepare = useCallback(async () => {
        if (!draft) return;
        setPhase("preparing");
        setErrorMsg("");
        try {
            const res = await getServicePayment(draft.serviceId, {
                dateRequest: draft.dateRequest,
                location: draft.location,
                billing: null, // la facturación se maneja por el chat de la orden
                notes: draft.notes,
                addonSelections: draft.addonSelections,
                customPrice: draft.customPrice ?? null,
            });
            if (!mountedRef.current) return;
            setData(res);
            setPhase("ready");
        } catch (e) {
            if (!mountedRef.current) return;
            setErrorMsg(getUserMessage(e));
            setPhase("error");
        }
    }, [draft]);

    useEffect(() => {
        if (!draft) {
            router.back();
            return;
        }
        if (startedRef.current) return;
        startedRef.current = true;
        prepare();
    }, [draft, prepare, router]);

    const handlePay = async () => {
        if (!data) return;
        setPhase("paying");
        try {
            const { success, error } = await pay({
                paymentIntentClientSecret: data.paymentintent,
                ephemeralKey: data.ephemeralKey,
                customerId: data.customerId,
                merchantDisplayName: data.serviceSnapshot?.company?.name ?? "Workly",
                merchantCountryCode: "MX",
            });

            if (!success) {
                if (error) Alert.alert("Pago no completado", error);
                setPhase("ready");
                return;
            }

            // Pago OK: la orden la crea el webhook. Buscarla por PaymentIntent.
            setPhase("processing");
            clearDraft();
            getOrders(1); // refresca la pestaña de órdenes

            const piId = data.paymentintent.split("_secret_")[0];
            for (let i = 0; i < 10; i++) {
                await sleep(1500);
                if (!mountedRef.current) return;
                try {
                    const orders = await listOrders();
                    const match = orders.find((o) => o.paymentIntent === piId);
                    if (match) {
                        router.replace({ pathname: "/(app)/order", params: { orderId: match.id } });
                        return;
                    }
                } catch {
                    // reintenta
                }
            }

            if (!mountedRef.current) return;
            router.replace("/(app)/(tabs)/(orders)");
            Alert.alert("Procesando tu orden", "Tu orden se está procesando y aparecerá en unos segundos.");
        } catch (e) {
            Alert.alert("Error", getUserMessage(e));
            setPhase("ready");
        }
    };

    if (!draft) return null;

    if (phase === "preparing" || phase === "processing") {
        return (
            <View className="flex-1 items-center justify-center bg-surface" style={{ gap: 12 }}>
                <SpinLoading size={32} color={Colors.principal.DEFAULT} />
                <Text className="text-sm text-text-light">
                    {phase === "preparing" ? "Preparando tu pago…" : "Procesando tu orden…"}
                </Text>
            </View>
        );
    }

    if (phase === "error") {
        return (
            <View className="flex-1 items-center justify-center bg-surface px-8" style={{ gap: 16 }}>
                <Feather name="alert-circle" size={40} color="#e53e3e" />
                <Text className="text-base text-text-default text-center">{errorMsg}</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="py-3 px-6 rounded-xl"
                    style={{ backgroundColor: Colors.principal.DEFAULT }}
                >
                    <Text className="text-white font-bold">Volver a configurar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const snap = data!.serviceSnapshot;
    const companyPhoto = data!.service?.company?.profile?.photo;
    const companyName = snap?.company?.name ?? data!.service?.company?.profile?.name;
    const busy = phase === "paying";

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                className="px-3 flex-1 bg-surface"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
            >
                <View style={{ gap: 18 }}>
                    {/* Servicio */}
                    <CardContent divided={false}>
                        <View className="p-4 flex-row items-center" style={{ gap: 12 }}>
                            <Image
                                source={{ uri: snap?.photo }}
                                style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: "#eaeaea" }}
                            />
                            <View className="flex-1">
                                <Text className="text-sm font-bold" style={{ color: "#040404" }} numberOfLines={2}>
                                    {snap?.name}
                                </Text>
                                <View className="flex-row items-center mt-1" style={{ gap: 6 }}>
                                    {companyPhoto ? (
                                        <Image source={{ uri: companyPhoto }} style={{ width: 16, height: 16, borderRadius: 8 }} />
                                    ) : null}
                                    <Text className="text-xs text-text-light">{companyName}</Text>
                                </View>
                            </View>
                        </View>
                    </CardContent>

                    {/* Tu pedido */}
                    <Container>
                        <CardInfo title="Tu pedido" icon="clipboard" variant="heading" />
                        <CardContent>
                            <SummaryRow icon="calendar" label="Fecha de entrega" value={formatDateService(new Date(draft.dateRequest))} />
                            <SummaryRow icon="edit-3" label="Notas" value={draft.notes || "Sin notas"} />
                        </CardContent>
                    </Container>

                    {/* Ubicación de entrega */}
                    {draft.location ? (
                        <Container>
                            <CardInfo title="Ubicación de entrega" icon="map-pin" variant="heading" />
                            <CardContent divided={false}>
                                {draft.locationData ? (
                                    <LocationPreview location={draft.locationData} />
                                ) : (
                                    <Text className="text-sm px-4 py-3.5" style={{ color: "#040404" }}>
                                        {draft.locationLabel ?? "Ubicación seleccionada"}
                                    </Text>
                                )}
                            </CardContent>
                        </Container>
                    ) : null}

                    {/* Desglose de pago */}
                    <Container>
                        <CardInfo title="Resumen de pago" icon="file-text" variant="heading" />
                        <CardContent divided={false}>
                            <PriceBreakdown variant="full" pricing={data!.pricing} />
                        </CardContent>
                    </Container>

                    <View className="px-1" style={{ gap: 6 }}>
                        <Text className="text-xs text-text-light leading-relaxed">
                            Tu pago queda retenido de forma segura y se libera a la empresa cuando confirmes la entrega.
                        </Text>
                        <Text className="text-xs text-text-light leading-relaxed">
                            <Text className="font-semibold text-text-light">Reembolsos:</Text>{" "}
                            una vez acordado el servicio, o dentro de las 24 horas previas a la
                            entrega, el pago no es reembolsable. Fuera de ese plazo la empresa
                            puede emitir un reembolso a su criterio, reservado para casos
                            excepcionales.
                        </Text>
                    </View>

                    {/* Botón pagar */}
                    <TouchableOpacity
                        disabled={busy}
                        onPress={handlePay}
                        className="flex-row items-center justify-center py-4 rounded-xl h-14"
                        style={[{ backgroundColor: Colors.principal.DEFAULT, gap: 8 }, cardShadow]}
                    >
                        {busy ? (
                            <SpinLoading color="#ffffff" />
                        ) : (
                            <>
                                <Feather name="lock" size={16} color="#ffffff" />
                                <Text className="text-white font-bold text-base">
                                    Pagar {formatMXN(data!.pricing.clientTotal)}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

function SummaryRow({ icon, label, value }: { icon: any; label: string; value: string }) {
    return (
        <View className="flex-row px-4 py-3.5" style={{ gap: 12 }}>
            <Feather name={icon} size={16} color={Colors.principal.DEFAULT} style={{ marginTop: 2 }} />
            <View className="flex-1">
                <Text className="text-xs text-text-light">{label}</Text>
                <Text className="text-sm mt-0.5" style={{ color: "#040404" }}>{value}</Text>
            </View>
        </View>
    );
}

