import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { OrderDraftScreen, OrderHistoryScreen, OrderOngoingScreen } from './stack'
import { Colors } from '../../../lib'

const TabsTop = createMaterialTopTabNavigator()
const TabOrders = () => {
   return (
      <TabsTop.Navigator
         screenOptions={{
            tabBarStyle: {
               backgroundColor: Colors.gray[200],
               elevation: 5, // Para Android
               shadowColor: '#000', // Para iOS
               shadowOffset: { width: 0, height: 2 }, // Ajusta la posición de la sombra
               shadowOpacity: 0.25, // Ajusta la opacidad de la sombra
               shadowRadius: 3.5, // Ajusta el difuminado de la sombra
            },
            tabBarIndicatorStyle: {
               backgroundColor: Colors.principal[400],
            },
            tabBarLabelStyle: {
               color: Colors.principal[500],
               fontWeight: 800,
               textTransform: "capitalize"
            },
            animationEnabled: true,
         }}
         sceneContainerStyle={{
            backgroundColor: Colors.transparent,
            paddingTop: 12
         }}
      
         initialRouteName='History'
      >
         <TabsTop.Screen name="Ongoing" component={OrderOngoingScreen} />
         <TabsTop.Screen name="History" component={OrderDraftScreen} />
         <TabsTop.Screen name="Draft" component={OrderHistoryScreen} />
      </TabsTop.Navigator>
   )
}

export default TabOrders