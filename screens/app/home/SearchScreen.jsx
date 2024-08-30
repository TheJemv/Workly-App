import { View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Text, FlatList } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'


import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import { API_HOST } from '@env';
import axios from 'axios';

import useGlobal from 'core/globals';

const SearchScreen = () => {
   // States
   const token = useGlobal((state) => state.token)
   const [search, setSearch] = useState('')
   const [services, setServices] = useState([])
   const [loading, setLoading] = useState(false)


   // Navigations
   const navigation = useNavigation()
   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: () => (
            <View
               style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: 0, // Asegúrate de que no haya espacio a la izquierda
                  marginLeft: -30,
               }}
            >
               <View style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "row",
                  marginHorizontal: 22,
                  alignItems: "center",
                  gap: 12,
                  paddingHorizontal: 4,
               }}>
                  <TouchableOpacity
                     onPress={() => navigation.goBack()}
                     style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        borderRadius: 8,
                     }}
                  >
                     <FontAwesome
                        name="angle-left"
                        color={"#B1B1B4"}
                        size={28}
                     />
                  </TouchableOpacity>

                  <View
                     style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2,
                        alignItems: "center",
                        flex: 1,
                        backgroundColor: "#D0D0D0",
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        paddingVertical: 8,
                     }}
                  >
                     <TextInput
                        placeholder='buscar un servicio...'
                        style={{
                           fontSize: 16,
                           fontWeight: 500,
                           flex: 1,
                        }}
                        placeholderTextColor={"#00000050"}
                        value={search}
                        onChangeText={setSearch}
                     />

                     {search && (
                        <TouchableOpacity
                           onPress={() => setSearch('')}
                           style={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              borderRadius: 100,
                           }}
                        >
                           <AntDesign
                              name="closecircle"
                              size={18}
                              color={"#B1B1B4"}
                              onPress={() => setSearch('')}
                           />
                        </TouchableOpacity>
                     )}

                     <AntDesign
                        name='minus'
                        size={18}
                        color={"#B1B1B4"}
                        transform={[{ rotate: '90deg' }]}
                     />

                     <FontAwesome
                        name={loading?"hourglass-end":"search"}
                        size={18}
                        color={"#B1B1B4"}
                     />
                  </View>
               </View>
            </View>
         ),
         headerBackVisible: false,
         headerTitleAlign: 'center',
      })
   }, [navigation, search])


   useEffect(() => {
      // Lógica para buscar servicios
      const fetchServices = async () => {
         if (!token) return
         if (!search) {
            setServices([])
            return
         }
         setLoading(true)
         await axios.get(`${await API_HOST}/service/search`, {
            params: {
               q: search
            },
            headers: {
               Authorization: `Bearer ${token}`
            }
         }).then(({ data }) => {
            setServices(data?.services)
         }).catch((err) => {
            console.error(err)
         }).finally(() => {
            setLoading(false)
         })
      }

      fetchServices()
   }, [search])


   // Render
   return (
      <SafeAreaView style={{
         flex: 1
      }}>
         <ScrollView style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 18,
         }}>
            {/* Contenido */}
            { !search ? (
               <View style={{
                     flex: 1,
                     display: "flex",
                     paddingHorizontal: 12,
                     flexDirection: "column",
                     gap: 18,
                  }}
               >
                  <Text style={{
                     fontSize: 18,
                     fontWeight: 600,
                     width: "100%",
                  }}>Recomendados...</Text>
               </View>
            ) : (
               <FlatList
                  data={services}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        onPress={() => navigation.navigate('service', { id: item.objectID })}
                        style={{
                           display: "flex",
                           flexDirection: "row",
                           gap: 12,
                           alignItems: "center",
                           paddingVertical: 12,
                           paddingHorizontal: 12,
                        }}
                     >
                        <FontAwesome
                           name="search"
                           size={16}
                           color={"#00000060"}
                        />
                        <Text>{item.name}</Text>
                     </TouchableOpacity>
                  )}
                  contentContainerStyle={{
                     display: "flex",
                     flexDirection: "column",
                     gap: 0,
                     paddingVertical: 12,
                     paddingHorizontal: 12,
                  }}
                  ItemSeparatorComponent={() => (
                     <View style={{
                        height: 1,
                        backgroundColor: "#00000010",
                     }} />
                  )}
               />
            )}
         </ScrollView>
      </SafeAreaView>
   )
}

export default SearchScreen