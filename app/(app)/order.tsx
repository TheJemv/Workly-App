import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import useGlobal from 'core/globals';
import { Order } from '@/types/Order';

import { getOrderFromState } from 'utils/orderHelpers';
import { useOrderActions } from 'hooks/useOrderActions';
import { ScrollView } from 'react-native-gesture-handler';

import { OrderHeader } from 'components/TrackOrderScreen/OrderHeader';
import { OrderDetails } from 'components/TrackOrderScreen/OrderDetails';
import { OrderNotes } from 'components/TrackOrderScreen/OrderNotes';
import { OrderDate } from 'components/TrackOrderScreen/OrderDate';
import { OrderTracking } from 'components/TrackOrderScreen/OrderTracking';
import { CompanyActions } from 'components/TrackOrderScreen/CompanyActions';
import { CustomerActions } from 'components/TrackOrderScreen/CustomerActions';
import { DatePickerModal } from 'components/TrackOrderScreen/DatePickerModal';

import { useLocalSearchParams } from 'expo-router';
import TrackLocation from 'components/TrackOrderScreen/TrackLocation';
import apiClient from 'services/api/apiClient';

const getOrderById = async (orderId: string): Promise<Order> => {
    const res = await apiClient.get(`/orders/${orderId}`)
    return res.data.data
}

export default function OrderPage() {
    const orders = useGlobal((state) => state.orders);
    const sales = useGlobal((state) => state.sales);
    const params = useLocalSearchParams()

    const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null)
    const [fetching, setFetching] = useState(false)

    // Store tiene prioridad sobre el fetch (para tener status en vivo)
    const storeOrder = getOrderFromState(params, orders, sales)
    const order: Order = storeOrder?.status ? storeOrder : (fetchedOrder as Order)

    useEffect(() => {
        // Si ya está en el store, no hacer fetch
        if (storeOrder?.status) return

        const orderId = String(params.orderId ?? params.id ?? '')
        if (!orderId) return

        const fetch = async () => {
            setFetching(true)
            try {
                console.log(orderId)
                const data = await getOrderById(orderId)
                setFetchedOrder(data)
            } catch (e) {
                console.error('Error fetching order:', e)
            } finally {
                setFetching(false)
            }
        }
        fetch()
    }, [params.orderId, params.id, storeOrder?.status])

    const {
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
    } = useOrderActions(order);

    if (fetching || !order?.id) return (
        <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" />
        </View>
    )

    return (
        <>
            <ScrollView className="flex-1 px-3 space-y-2">
                <View className="flex mb-12 flex-1 flex-col mt-4 rounded-xl bg-white shadow-xl">
                    <OrderHeader order={order} />
                    <OrderDetails order={order} />
                    <OrderNotes order={order} />
                    {order?.location && (
                        <TrackLocation location={order.location} />
                    )}
                    <OrderDate
                        order={order}
                        isCompany={!!isCompany}
                        onEditPress={() => setShowEditDate(true)}
                    />
                    <OrderTracking order={order} />
                    {/* Acciones de la EMPRESA */}
                    {isCompany && (
                        <CompanyActions
                            order={order}
                            loading={loading}
                            loadingCancel={loadingCancel}
                            onAccept={handleAcceptOrder}
                            onModifyDate={() => setShowEditDate(true)}
                            onConfirmDelivery={handleConfirmDelivery}
                            onCancel={handleCancelOrder}
                        />
                    )}
                    {/* Acciones del CLIENTE */}
                    {isCustomer && (
                        <CustomerActions
                            order={order}
                            loadingCancel={loadingCancel}
                            onApproveDate={handleApproveDate}
                            onRejectDate={handleRejectDate}
                            onCancel={handleCancelOrder}
                        />
                    )}
                </View>
            </ScrollView>
            <DatePickerModal
                show={showEditDate}
                currentDate={order.dateRequest}
                onConfirm={handleModifyDate}
                onCancel={() => setShowEditDate(false)}
            />
        </>
    );
}