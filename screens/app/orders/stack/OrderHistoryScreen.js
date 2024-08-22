import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOrders } from '../../../../services/api/getOrders'
import OrderItem from '../../../../components/OrdersItem'
import { Colors } from '../../../../lib'

const OrderHistoryScreen = () => {
   const [loader, setLoader] = useState(false)
   const [fakeOrders, setFakeOrders] = useState([])

   useEffect(() => {
      setLoader(true)
      getOrders()
         .then(data => {
            setFakeOrders(
               data.sort(
                  (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
               ),
            )
            setLoader(false)
         }).catch(e => {
            setLoader(true)
            throw new Error(e)
         })
   }, [])

   return (  
      !loader && fakeOrders.length > 0 && (
         <FlatList
            data={fakeOrders}
            renderItem={({ item }) => <OrderItem key={item.id} data={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={{
               gap: 24,
               paddingHorizontal: 12,
               backgroundColor: Colors.transparent
            }}
         />
      )
   )
}



export default OrderHistoryScreen