import { FlatList, Text, ScrollView, View, Image } from "react-native"
import { useLayoutEffect } from "react"
import { HomeServicesData } from "data"
import { BlurView } from "expo-blur"
import Constants from 'expo-constants';

import CategoryItem from "./components/CategoryItem"
import PopularItem from "./components/PopularItem"
import SearchBar from "./components/SearchBar"
import Companies from "./components/Companies"
import useGlobal from "core/globals";


const HomeScreen = ({ navigation }) => {
   const { customer } = useGlobal()

   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      })
   }, [navigation])

   return (
      <View style={{flex:1, backgroundColor:"#F7F7F9"}}>
         <Image
            source={require("assets/BackgroundHome.jpg")}
            style={{
               width: "100%",
               height: "100%",
               opacity: 0.5,
               position: 'absolute',
               top: "-40%",
               left: 0,
               transform: [{
                  rotate: "180deg"
               }],
            }}
            resizeMode="cover"
         />

         <BlurView
            intensity={100}
            style={{ flex: 1 }}
         >
            <ScrollView scrollEnabled={true} style={{
               flex: 1,
            }}>
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
                     >¡Hola, {customer?.profile?.name}!</Text>
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
                           renderItem={({ item }) => <CategoryItem navigation={navigation} item={item} key={item.id} />}
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
                              <Text className="text-dark" style={{fontSize:20,fontWeight:600}}>Populares</Text>
                              <Text className="text-text">¡Los servicios mas vendidos!</Text>
                           </View>

                           <FlatList
                              renderItem={({ item, index }) => <PopularItem item={item} key={index} />}
                              keyExtractor={(item) => item.id}
                              horizontal={true}
                              data={[{
                                 Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagenes.elpais.com%2Fresizer%2FaIHR-EpBhcuUzFOObwnjcKr7HoA%3D%2F1960x0%2Farc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com%2Fpublic%2F24ESUXKGCOFX7UGZFVTU2W2BPI.jpg",
                                 name: "BK Chicken Lover",
                                 company: {
                                    Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F04%2FBurger-King-Logo-1994-1999.png"
                                 },
                                 id: "1"
                              }, {
                                 Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagenes.elpais.com%2Fresizer%2FaIHR-EpBhcuUzFOObwnjcKr7HoA%3D%2F1960x0%2Farc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com%2Fpublic%2F24ESUXKGCOFX7UGZFVTU2W2BPI.jpg",
                                 name: "BK Chicken Lover",
                                 company: {
                                    Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F04%2FBurger-King-Logo-1994-1999.png"
                                 },
                                 id: "2"
                              }, {
                                 Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagenes.elpais.com%2Fresizer%2FaIHR-EpBhcuUzFOObwnjcKr7HoA%3D%2F1960x0%2Farc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com%2Fpublic%2F24ESUXKGCOFX7UGZFVTU2W2BPI.jpg",
                                 name: "BK Chicken Lover",
                                 company: {
                                    Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F04%2FBurger-King-Logo-1994-1999.png"
                                 },
                                 id: "3"
                              }]}
                              contentContainerStyle={{
                                 paddingHorizontal: 12,
                                 gap: 12,
                                 flexGrow: 1,
                                 paddingBottom: 12,
                              }}
                              scrollEnabled={true}
                           />
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
   )
}


export default HomeScreen