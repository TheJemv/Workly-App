import { FlatList, Text, ImageBackground, ScrollView, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useLayoutEffect } from "react"
import { HomeServicesData } from "data"
import { BlurView } from "expo-blur"
import Constants from 'expo-constants';

import CategoryItem from "./components/CategoryItem"
import PopularItem from "./components/PopularItem"

const HomeScreen = () => {
   const navigation = useNavigation()
   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      })
   }, [navigation])

   return (
      <ImageBackground
         style={{ flex: 1 }}
         source={require("assets/BackgroundHome.jpg")}
         imageStyle={{
            transform: [{
               rotate: "180deg"
            }],
            opacity: 0.7,
         }}
      >
         <BlurView
            intensity={100}
            style={{ flex: 1 }}
         >
            <ScrollView style={{
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
                     >¡Hola, Oscar!</Text>
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
                           renderItem={({ item, id }) => <CategoryItem item={item} key={id} />}
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
                              gap: 24,
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
                              renderItem={({ item, id }) => <PopularItem item={item} key={id} />}
                              horizontal={true}
                              data={[{
                                 Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagenes.elpais.com%2Fresizer%2FaIHR-EpBhcuUzFOObwnjcKr7HoA%3D%2F1960x0%2Farc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com%2Fpublic%2F24ESUXKGCOFX7UGZFVTU2W2BPI.jpg",
                                 name: "BK Chicken Lover",
                                 company: {
                                    Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F04%2FBurger-King-Logo-1994-1999.png"
                                 }
                              }, {
                                 Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagenes.elpais.com%2Fresizer%2FaIHR-EpBhcuUzFOObwnjcKr7HoA%3D%2F1960x0%2Farc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com%2Fpublic%2F24ESUXKGCOFX7UGZFVTU2W2BPI.jpg",
                                 name: "BK Chicken Lover",
                                 company: {
                                    Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F04%2FBurger-King-Logo-1994-1999.png"
                                 }
                              }, {
                                 Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimagenes.elpais.com%2Fresizer%2FaIHR-EpBhcuUzFOObwnjcKr7HoA%3D%2F1960x0%2Farc-anglerfish-eu-central-1-prod-prisa.s3.amazonaws.com%2Fpublic%2F24ESUXKGCOFX7UGZFVTU2W2BPI.jpg",
                                 name: "BK Chicken Lover",
                                 company: {
                                    Image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogos-world.net%2Fwp-content%2Fuploads%2F2020%2F04%2FBurger-King-Logo-1994-1999.png"
                                 }
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
                        <Text>Hola Mundo</Text>
                     </View>
                  </View>
            </ScrollView>
         </BlurView>
      </ImageBackground>
   )
}


export default HomeScreen