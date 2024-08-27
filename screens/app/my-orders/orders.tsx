import { SafeAreaView, ScrollView } from "react-native";
import { OrderTrackCard } from "./components/order-track-card";

type Props = {
   navigation: any;
};
export function OrdersScreen({}: Props): JSX.Element {
   return (
      <SafeAreaView className="flex-1">
         <ScrollView className="flex-1 px-3 my-3 space-y-2">
            <OrderTrackCard
               order={{
                  numberOrder: 999012,
                  dateCreated: "20-Dic-2019, 3:00 PM",
                  deliveryDate: "22 Dic",
                  rating: 0,
                  name: "Pedido 1",
                  percentComplete: 20,
               }}
            />
         </ScrollView>
      </SafeAreaView>
   );
}
