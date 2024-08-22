import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getOrders } from '../../../../services/api/getOrders'
import OrderItem from '../../../../components/OrdersItem'
import { Colors } from '../../../../lib'

const OrderDraftScreen = ({ navigation }) => {
   const [loader, setLoader] = useState(false)
   const [fakeOrders, setFakeOrders] = useState([])

   useEffect(() => {
      const fetchData = () => {
         setLoader(true)
         try {
            getOrders()
               .then(data => {
                  setFakeOrders(
                     data.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                     ),
                  )
               })
         } catch(e) {
            throw new Error(e)
         } finally {
            setLoader(false)
         }
      }
      fetchData()
   })

   return (  
      !loader && fakeOrders.length > 0 && (
         <FlatList
            data={fakeOrders}
            renderItem={({ item }) => <OrderItem navigation={navigation} key={item.id} data={item} />}
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



export default OrderDraftScreen