import React, { View } from 'react-native'
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

export default function OrderPage() {
    const orders = useGlobal((state) => state.orders);
    const sales = useGlobal((state) => state.sales);

    const params = useLocalSearchParams()
    const order: Order = getOrderFromState(params, orders, sales);

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


    return (
        <>
            <ScrollView className="flex-1 px-3 space-y-2">
                <View
                    className="flex flex-1 flex-col my-3 rounded-xl bg-white shadow-md shadow-dark/25"
                >
                    <OrderHeader order={order} />
                    <OrderDetails order={order} />
                    <OrderNotes order={order} />
                    <OrderDate
                        order={order}
                        isCompany={isCompany}
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