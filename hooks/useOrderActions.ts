import { useState } from "react";
import { Alert } from "react-native";

import useGlobal from "core/globals";
import { getUserMessage } from "services/api/errors";
import { Order } from "@/types/Order";

import {
    acceptOrder,
    modifyDeliveryDate,
    approveDateChange,
    rejectDateChange,
    confirmDelivery,
    cancelOrder,
} from "services/api/orders.api";
import formatDateService from "functions/formatDateService";

export const useOrderActions = (order: Order) => {
    const sales = useGlobal((state) => state.sales);
    const orders = useGlobal((state) => state.orders);

    const [loading, setLoading] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [showEditDate, setShowEditDate] = useState(false);

    const isCompany = order?.id ? sales?.data?.find((o) => o.id === order.id) : null
    const isCustomer = order?.id ? orders?.data?.find((o) => o.id === order.id) : null


    // EMPRESA: Aceptar orden sin cambios
    const handleAcceptOrder = async () => {
        try {
            setLoading(true);
            const response = await acceptOrder(order.id);
            Alert.alert("Éxito", "Orden aceptada y confirmada");
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        } finally {
            setLoading(false);
        }
    };

    // EMPRESA: Modificar fecha de entrega
    const handleModifyDate = async (newDate: Date) => {
        try {
            setShowEditDate(false);

            Alert.alert(
                "Modificar Fecha",
                `¿Estás seguro de proponer la nueva fecha "${formatDateService(newDate)}"?\n\nEl cliente deberá aprobar este cambio.`,
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Modificar",
                        onPress: async () => {
                            try {
                                setLoading(true);
                                const response = await modifyDeliveryDate(
                                    order.id,
                                    newDate.toISOString()
                                );
                                Alert.alert(
                                    "Fecha Modificada",
                                    "El cliente recibirá una notificación para aprobar el cambio"
                                );
                            } catch (error) {
                                Alert.alert("Error", getUserMessage(error));
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        }
    };

    // CLIENTE: Aprobar cambio de fecha
    const handleApproveDate = async () => {
        try {
            Alert.alert(
                "Aprobar Cambio",
                `¿Aceptas la nueva fecha?\n\n${formatDateService(new Date(order.dateRequest))}`,
                [
                    {
                        text: "No",
                        style: "cancel",
                    },
                    {
                        text: "Sí, aceptar",
                        onPress: async () => {
                            try {
                                setLoading(true);
                                await approveDateChange(order.id);
                                // updateOrderInState(response.data);
                                Alert.alert(
                                    "Cambio Aprobado",
                                    "La orden ha sido confirmada con la nueva fecha"
                                );
                            } catch (error) {
                                Alert.alert("Error", getUserMessage(error));
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        }
    };

    // CLIENTE: Rechazar cambio de fecha
    const handleRejectDate = async () => {
        try {
            Alert.alert(
                "Rechazar Cambio",
                "¿Estás seguro de rechazar la nueva fecha?\n\nSe restaurará la fecha original y la empresa deberá decidir nuevamente.",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Rechazar",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                setLoading(true);
                                await rejectDateChange(order.id);
                                // updateOrderInState(response.data);
                                Alert.alert(
                                    "Cambio Rechazado",
                                    "Se ha restaurado la fecha original"
                                );
                            } catch (error) {
                                Alert.alert("Error", getUserMessage(error));
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        }
    };

    // EMPRESA: Confirmar entrega
    const handleConfirmDelivery = async () => {
        try {
            Alert.alert(
                "Confirmar Finalización",
                "¿Confirmas que el servicio fue completado?\n\nEsto liberará el pago a la empresa.",
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Confirmar",
                        onPress: async () => {
                            try {
                                setLoading(true);
                                await confirmDelivery(order.id);
                                // updateOrderInState(response.data);
                                Alert.alert(
                                    "Finalización Confirmada",
                                    "El pago ha sido liberado exitosamente"
                                );
                            } catch (error) {
                                Alert.alert("Error", getUserMessage(error));
                            } finally {
                                setLoading(false);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        }
    };

    // AMBOS: Cancelar orden
    const handleCancelOrder = async () => {
        try {
            Alert.alert(
                "Cancelar Orden",
                "¿Estás seguro de cancelar esta orden?\n\nEsta acción no se puede deshacer.",
                [
                    {
                        text: "No",
                        style: "cancel",
                    },
                    {
                        text: "Sí, cancelar",
                        style: "destructive",
                        onPress: async () => {
                            try {
                                setLoadingCancel(true);
                                cancelOrder(order.id);
                                // updateOrderInState(response.data);
                                Alert.alert("Orden Cancelada", "La orden ha sido cancelada exitosamente");
                            } catch (error) {
                                Alert.alert("Error", getUserMessage(error));
                            } finally {
                                setLoadingCancel(false);
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        }
    };

    return {
        loading,
        loadingCancel,
        showEditDate,
        setShowEditDate,
        handleAcceptOrder,
        handleModifyDate,
        handleApproveDate,
        handleRejectDate,
        handleConfirmDelivery,
        handleCancelOrder,
        isCompany,
        isCustomer,
    };
};