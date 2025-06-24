import { SafeAreaView, View } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NativeStackOptions from "constants/NativeStackOptions";
import { MyOrdersScreen } from "./my-orders";
import { TrackOrdersScreen } from "./my-orders/track-orders";
import { OrdersScreen } from "./my-orders/orders";
import { SalesScreen } from "./my-orders/sales";
import { Colors } from "lib";
import useGlobal from "core/globals";
import { useEffect } from "react";

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

type Props = {};
function StackOrders({}: Props): JSX.Element {
   const isBusiness: object = useGlobal((state) => state.company);

   useEffect(() => {
      console.log("StackOrders rendered");
   }, []);

   return (
      <View className="flex-1 bg-[#eee]">
         <SafeAreaView className="flex-1">
            {isBusiness ? (
               <Stack.Navigator
                  screenOptions={NativeStackOptions}
                  initialRouteName="OrdersTab"
               >
                  <Stack.Screen
                     name="OrdersTab"
                     component={TabOrders}
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
            ) : (
               <Stack.Navigator
                  initialRouteName="MyOrders"
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
         </SafeAreaView>
      </View>
   );
}

const TabOrders = (): JSX.Element => {
   return (
      <Tab.Navigator
         initialRouteName="Orders"
         screenOptions={{
            tabBarStyle: {
               backgroundColor: "#eee",
               // Shadow
               shadowColor: "#000",
               shadowOffset: {
                  width: 0,
                  height: 2,
               },
               shadowOpacity: 0.25,
               shadowRadius: 3.84,
               elevation: 5,
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
            animationEnabled: false,
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
   );
};

export default StackOrders;
