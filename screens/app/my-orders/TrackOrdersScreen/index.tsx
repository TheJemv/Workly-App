import { SafeAreaView, ScrollView, View } from "react-native";
import { useLayoutEffect } from "react";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useGlobal from "core/globals";
import { Order } from "./types";
import { OrderHeader } from "./components/OrderHeader";
import { OrderDetails } from "./components/OrderDetails";
import { OrderNotes } from "./components/OrderNotes";
import { OrderDate } from "./components/OrderDate";
import { OrderTracking } from "./components/OrderTracking";
import { CompanyActions } from "./components/CompanyActions";
import { CustomerActions } from "./components/CustomerActions";
import { DatePickerModal } from "./components/DatePickerModal";
import { useOrderActions } from "./hooks/useOrderActions";
import { getOrderFromState } from "./utils/orderHelpers";

type Props = {
    navigation: any;
    route: any;
};

export function TrackOrdersScreen({ navigation, route }: Props): JSX.Element {
    const orders = useGlobal((state) => state.orders);
    const sales = useGlobal((state) => state.sales);

    const order: Order = getOrderFromState(route.params.data, orders, sales);

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: `Pedido#: ${order.id}`,
        });
    }, [order.id]);

    return (
        <>
            <SafeAreaView className="flex-1">
                <ScrollView className="flex-1 px-3 space-y-2">
                    <View
                        className="flex flex-col rounded-xl bg-white shadow-md shadow-dark/25"
                        style={{
                            marginBottom: useBottomTabBarHeight(),
                        }}
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
            </SafeAreaView>

            <DatePickerModal
                show={showEditDate}
                currentDate={order.dateRequest}
                onConfirm={handleModifyDate}
                onCancel={() => setShowEditDate(false)}
            />
        </>
    );
}