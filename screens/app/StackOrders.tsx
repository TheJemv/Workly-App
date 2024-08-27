import { SafeAreaView } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NativeStackOptions from "constants/NativeStackOptions";
import { MyOrdersScreen } from "./my-orders";
import { TrackOrdersScreen } from "./my-orders/track-orders";
import { OrdersScreen } from "./my-orders/orders";
import { SalesScreen } from "./my-orders/sales";
import { Colors } from "lib";

const Stack = createNativeStackNavigator();

const Tab = createMaterialTopTabNavigator();

type Props = {};
function StackOrders({}: Props): JSX.Element {
   const isBusiness: boolean = true;
   return (
      <>
         {isBusiness ? (
            <SafeAreaView className="flex-1">
               <Tab.Navigator
                  initialRouteName="Orders"
                  screenOptions={{
                     tabBarStyle: {
                        backgroundColor: Colors.white,
                     },
                     tabBarIndicatorStyle: {
                        backgroundColor: Colors.principal.DEFAULT,
                     },
                     tabBarLabelStyle: {
                        fontWeight: 800,
                        textTransform: "capitalize",
                     },
                     tabBarActiveTintColor: Colors.principal.DEFAULT,
                     tabBarInactiveTintColor: Colors.secondary.DEFAULT,
                     animationEnabled: true,
                  }}
               >
                  <Tab.Screen
                     name="Orders"
                     options={{
                        tabBarLabel: "Ordenes",
                     }}
                     component={OrdersScreen}
                  />
                  <Tab.Screen
                     name="Sales"
                     options={{
                        tabBarLabel: "Ventas",
                     }}
                     component={SalesScreen}
                  />
               </Tab.Navigator>
            </SafeAreaView>
         ) : (
            <Stack.Navigator
               initialRouteName="Orders"
               screenOptions={NativeStackOptions}
            >
               <Stack.Screen
                  name="MyOrders"
                  component={MyOrdersScreen}
                  options={{
                     headerShown: false,
                  }}
               />
               <Stack.Screen
                  name="TrackOrders"
                  component={TrackOrdersScreen}
                  options={{
                     headerShown: false,
                  }}
               />
            </Stack.Navigator>
         )}
      </>
   );
}

export default StackOrders;
