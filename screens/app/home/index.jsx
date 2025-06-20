import { FlatList, Text, ScrollView, View, Image } from "react-native";
import { useLayoutEffect, useContext, useEffect, useState } from "react";
import { HomeServicesData } from "data";
import { BlurView } from "expo-blur";
import Constants from "expo-constants";

import CategoryItem from "./components/CategoryItem";
import PopularItem from "./components/PopularItem";
import SearchBar from "./components/SearchBar";
import Companies from "./components/Companies";
import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";
import useGlobal from "core/globals";
import { AuthContext } from "context/AuthContext";
import { getServices } from "services/api/services.api";

const HomeScreen = ({ navigation }) => {
   const { token } = useContext(AuthContext);
   const { customer } = useGlobal();
   const [loading, setLoading] = useState(true);
   const [dataService, setData] = useState([]);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, [navigation]);

   useEffect(() => {
      setLoading(true);
      getServices(token, "servicios")
         .then((data) => {
            if (data?.services) {
               setData(data.services);
            }
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   return (
      <View style={{ flex: 1, backgroundColor: "#F7F7F9" }}>
         <Image
            source={require("assets/BackgroundHome.jpg")}
            style={{
               width: "100%",
               height: "100%",
               opacity: 0.5,
               position: "absolute",
               top: "-40%",
               left: 0,
               transform: [
                  {
                     rotate: "180deg",
                  },
               ],
            }}
            resizeMode="cover"
         />

         <BlurView intensity={100} style={{ flex: 1 }}>
            <ScrollView
               scrollEnabled={true}
               style={{
                  flex: 1,
               }}
            >
               <View
                  style={{
                     flex: 1,
                     display: "flex",
                     flexDirection: "column",
                     gap: 18,
                     paddingTop: 24 + Constants.statusBarHeight,
                  }}
               >
                  <Text
                     className="text-dark"
                     style={{
                        fontSize: 18,
                        paddingHorizontal: 12,
                        fontWeight: 600,
                     }}
                  >
                     ¡Hola, {customer?.profile?.name}!
                  </Text>
                  <View
                     style={{
                        flex: 1,
                        backgroundColor: "#F7F7F9",
                        width: "100%",
                        height: "100%",
                        paddingTop: 32,

                        borderTopStartRadius: 24,
                        borderTopEndRadius: 24,
                        paddingBottom: 24,
                        display: "flex",
                        flexDirection: "column",
                        gap: 24,
                     }}
                  >
                     <FlatList
                        data={HomeServicesData}
                        renderItem={({ item }) => (
                           <CategoryItem
                              navigation={navigation}
                              item={item}
                              key={item.id}
                           />
                        )}
                        keyExtractor={(item) => item.id}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                           gap: 12,
                           paddingHorizontal: 12,
                           paddingVertical: 12,
                        }}
                     />

                     <View
                        style={{
                           display: "flex",
                           flexDirection: "column",
                           gap: 12,
                        }}
                     >
                        <View
                           style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                              paddingHorizontal: 12,
                           }}
                        >
                           <Text
                              className="text-dark"
                              style={{ fontSize: 20, fontWeight: 600 }}
                           >
                              Populares
                           </Text>
                           <Text className="text-text">
                              ¡Los servicios mas vendidos!
                           </Text>
                        </View>

                        {loading && !dataService.length ? (
                           <View className="flex flex-col items-center justify-center">
                              <SpinLoading
                                 size={24}
                                 color={Colors.principal.DEFAULT}
                              />
                           </View>
                        ) : (
                           <FlatList
                              renderItem={({ item, index }) => (
                                 <PopularItem item={item} key={index} />
                              )}
                              keyExtractor={(item) => item.id}
                              horizontal={true}
                              data={dataService}
                              contentContainerStyle={{
                                 paddingHorizontal: 12,
                                 gap: 12,
                                 flexGrow: 1,
                                 paddingBottom: 12,
                              }}
                              scrollEnabled={true}
                              ListEmptyComponent={() => (
                                 <View className="flex items-center justify-center flex-1">
                                    <Text className="text-text">
                                       No hay servicios populares
                                    </Text>
                                 </View>
                              )}
                           />
                        )}
                     </View>

                     {/* Buscar Servicios */}
                     <SearchBar />

                     {/* Empresas recomendadas */}
                     <Companies />
                  </View>
               </View>
            </ScrollView>
         </BlurView>
      </View>
   );
};

export default HomeScreen;
