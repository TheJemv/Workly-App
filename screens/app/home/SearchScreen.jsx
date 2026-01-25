import {
   View,
   ScrollView,
   TextInput,
   TouchableOpacity,
   SafeAreaView,
   Text,
   FlatList,
   Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";

import useGlobal from "core/globals";
import { searchCompany } from "services/api/company.api";

const SearchScreen = () => {
   // States
   const [search, setSearch] = useState("");

   const [suggestions, setSuggetions] = useState([]);
   const [loading, setLoading] = useState(false);

   // Navigations
   const navigation = useNavigation();
   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: () => (
            <View
               style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 0, // Asegúrate de que no haya espacio a la izquierda
                  marginLeft: -30,
               }}
            >
               <View
                  style={{
                     flex: 1,
                     display: "flex",
                     flexDirection: "row",
                     marginHorizontal: 22,
                     alignItems: "center",
                     gap: 0,
                     paddingHorizontal: 4,
                  }}
               >
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
                        size={38}
                        style={{
                           paddingRight: 12,
                        }}
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
                        placeholder="buscar un servicio..."
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
                           onPress={() => setSearch("")}
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
                              onPress={() => setSearch("")}
                           />
                        </TouchableOpacity>
                     )}

                     <AntDesign
                        name="minus"
                        size={18}
                        color={"#B1B1B4"}
                        transform={[{ rotate: "90deg" }]}
                     />

                     <FontAwesome
                        name={loading ? "hourglass-end" : "search"}
                        size={18}
                        color={"#B1B1B4"}
                     />
                  </View>
               </View>
            </View>
         ),
         headerBackVisible: false,
         headerTitleAlign: "center",
      });
   }, [navigation, search]);

   useEffect(() => {
      const fetchServices = async () => {
         if (!search) return;
         try {
            setLoading(true);
            await searchCompany(search).then((data) => {
               setSuggetions(data.suggestions);
            });
         } catch (error) {
            Alert.alert("Error", error.message);
         } finally {
            setLoading(false);
         }
      };

      fetchServices();
   }, [search]);

   // Render
   return (
      <SafeAreaView
         style={{
            flex: 1,
         }}
      >
         <ScrollView
            style={{
               flex: 1,
               display: "flex",
               flexDirection: "column",
               gap: 18,
            }}
         >
            {/* Contenido */}
            {!search ? (
               <View
                  style={{
                     flex: 1,
                     display: "flex",
                     paddingHorizontal: 12,
                     flexDirection: "column",
                     gap: 18,
                  }}
               >
                  <Text
                     style={{
                        fontSize: 18,
                        fontWeight: 600,
                        width: "100%",
                     }}
                  >
                     Recomendados...
                  </Text>
               </View>
            ) : (
               <FlatList
                  data={suggestions}
                  // 1. CORRECCIÓN: Usar el índice o el propio string como key
                  keyExtractor={(item, index) => index.toString()}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                     <TouchableOpacity
                        // Nota: No necesitas poner 'key' aquí, el keyExtractor ya lo maneja
                        onPress={() =>
                           // 2. CORRECCIÓN: Pasas el 'item' (el texto) directamente, ya que no hay ID
                           navigation.navigate("results", { query: item })
                        }
                        style={{
                           display: "flex",
                           flexDirection: "row",
                           gap: 12,
                           alignItems: "center",
                           paddingVertical: 12,
                           paddingHorizontal: 12,
                           marginEnd: 12,
                        }}
                     >
                        <FontAwesome
                           name="search"
                           size={16}
                           color={"#00000060"}
                        />
                        <View className="flex flex-col">
                           {/* 3. Esto ya estaba bien, 'item' es el texto */}
                           <Text
                              numberOfLines={1}
                              className="text-[#00000060] font-bold"
                           >
                              {item}
                           </Text>
                        </View>
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
                     <View
                        style={{
                           height: 1,
                           backgroundColor: "#00000010",
                        }}
                     />
                  )}
               />
            )}
         </ScrollView>
      </SafeAreaView>
   );
};

export default SearchScreen;
