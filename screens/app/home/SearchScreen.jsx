import { View, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Text } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'


import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

const SearchScreen = () => {
   // States
   const [search, setSearch] = useState('')


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
                        name="search"
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


   // Render
   return (
      <SafeAreaView style={{
         flex: 1
      }}>
         <ScrollView style={{
            flex: 1,
            paddingHorizontal: 12,
            display: "flex",
            flexDirection: "column",
            gap: 18,
         }}>
            {/* Contenido */}
            { !search && (
               <View style={{
                     flex: 1,
                     display: "flex",
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
            )}
         </ScrollView>
      </SafeAreaView>
   )
}

export default SearchScreen