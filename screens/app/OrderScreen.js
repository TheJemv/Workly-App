import React from 'react'
import TabOrders from "./orders/TabOrders"
import OrderDetails from './orders/OrderDetails'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Colors } from '../../lib'
import { SafeAreaView } from 'react-native'

const StackOrder = createNativeStackNavigator()
const OrderScreen = () => {
   return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
         <StackOrder.Navigator
            initialRouteName='Orders'
            screenOptions={{
               headerShown: false,
               contentStyle: {
                  backgroundColor: Colors.transparent,
               },
            }}
         >
            <StackOrder.Screen name="Orders" component={TabOrders} />
            <StackOrder.Screen name="OrderDetails" component={OrderDetails} 
               options={{
                  headerShown: false,
                  tabBarVisible: false,
               }}
            />
         </StackOrder.Navigator>
      </SafeAreaView>
   )
}

export default OrderScreen