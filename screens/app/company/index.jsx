import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "context/AuthContext";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
   View, Text,
   SafeAreaView, Image,
   StyleSheet, TouchableOpacity,
   Linking, Platform,
   Alert, ScrollView,
   Animated,
   Easing
} from "react-native";
import { ServiceItem } from "components"

import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign"
import PaymentSubscription from "components/PaymentSubscription";

import useGlobal from "core/globals";


const openLink = (url) => {
   Linking.openURL(url).catch(err => console.error("Error al abrir el enlace:", err));
};


const handlePhonePress = (phoneNumber) => {
   if (Platform.OS === 'android' || Platform.OS === 'ios') {
      if (Platform.isTV || (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS && !Platform.isMacCatalyst && Platform.constants.interfaceIdiom === 'phone')) {
         Alert.alert('Advertencia', 'No se puede abrir la aplicación de teléfono en el simulador.');
      } else {
         openLink(`tel:${phoneNumber}`);
      }
   } else {
      Alert.alert('Advertencia', 'Esta función solo está disponible en dispositivos móviles.');
   }
};


const ProfileScreen = () => {
   const { statusSubscription, reloadCompany } = useContext(AuthContext);
   const navigation = useNavigation();

   const companyData = useGlobal((state) => state.company);
   const companyReload = useGlobal((state) => state.companyReload);

   const [servicesData, setServicesData] = useState(companyData?.services);
   const [loading, setLoading] = useState(false)
   const [translateYAnim] = useState(new Animated.Value(-100)); // Inicialmente fuera de la pantalla
   const [opacityAnim] = useState(new Animated.Value(0));


   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });

      companyReload();
   }, [navigation]);

   useEffect(() => {
      if (companyData) {
         setServicesData(companyData?.services);
      }
   }, [companyData]);


   const handleScroll = async (event) => {
      if(loading) return;
      const { contentOffset } = event.nativeEvent;
      if (contentOffset.y <= 0) {
         setLoading(true);
         await reloadCompany().finally(() => {
            Animated.parallel([
               Animated.timing(translateYAnim, {
                     toValue: 0,
                     duration: 300,
                     easing: Easing.out(Easing.exp),
                     useNativeDriver: true,
               }),
               Animated.timing(opacityAnim, {
                     toValue: 0,
                     duration: 300,
                     easing: Easing.out(Easing.exp),
                     useNativeDriver: true,
               }),
            ]).start();
         });
      }
   };


   return (
      <SafeAreaView style={{ flex: 1 }}>
         {companyData ? ( //  Urgente: Cambiar a una variable para verificar si esta pagado.
            <View style={{flex: 1}}>
               <View
                     className="px-2 py-2 w-full bg-transparent flex flex-row items-center"
                     style={{ gap: 8 }}
                  >
                     {!companyData?.public && <Ionicons size={16} name="lock-closed" />}
                     <Text
                        className="text-dark"
                        style={{ fontWeight: 600, fontSize: 16 }}
                     >
                        {companyData?.profile?.name}
                     </Text>
               </View>

               <ScrollView
                  className="flex flex-col"
                  style={{ flex: 1 }}
                  scrollEventThrottle={16}
                  onScroll={handleScroll}
               >
                  <View
                     style={{gap: 18}}
                     className="flex flex-col px-3 py-4 border-b border-text/20"
                  >
                     <View className="flex flex-row items-center" style={{ gap: 6 }}>
                        <Image
                           style={styles.image}
                           className="rounded-full"
                           source={{
                              uri: companyData?.profile?.photo
                           }}
                        />
                        <Text
                           numberOfLines={4}
                           className="text-text"
                           style={{ flex: 1, fontWeight: 700 }}
                        >{companyData?.profile?.description}</Text>
                     </View>


                     <View className="flex flex-col" style={{gap:0}}>
                        {["facebook", "instagram", "linkedin"].filter((data) => companyData?.profile?.contact[data]).map((data) => (
                           <TouchableOpacity className="py-1" key={data} onPress={() => openLink(companyData.profile.contact[data])}>
                              <Text className="text-blue-700" style={styles.linkText}>{data.charAt(0).toUpperCase() + data.slice(1)}: {companyData.profile.contact[data]}</Text>
                           </TouchableOpacity>
                        ))}
                        {companyData?.profile?.contact.phone && (
                           <TouchableOpacity className="py-1" onPress={() => handlePhonePress(`tel:${companyData.profile.contact.phone}`)}>
                              <Text className="text-blue-700" style={styles.linkText}>{`Telefono: ${companyData.profile.contact.phone}`}</Text>
                           </TouchableOpacity>
                        )}
                     </View>


                     <View className="flex flex-row" style={{ gap: 8 }}>
                        <TouchableOpacity onPress={() => navigation.navigate("edit")} className="py-1 flex-1 border-dark border rounded-lg">
                           <Text className="text-center text-dark">
                              Editar
                           </Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="py-1 flex-1 border-dark border rounded-lg">
                           <Text className="text-center text-dark">
                              Compartir Perfil
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>


                  <View className="py-2 px-2 flex flex-col" style={{gap:8,paddingBottom: 55}}>
                     <TouchableOpacity onPress={() => navigation.navigate("newservice")} style={styles.container} className="shadow-lg">
                        <View className="flex items-center py-4" style={{gap:24}}>
                           <Text className="text-[#92929D]" style={{fontWeight:700,fontSize:20}}>Agregar un nuevo servicio</Text>
                           <AntDesign size={24} color={"#92929D"} name="pluscircle" />
                        </View>
                     </TouchableOpacity>

                     {servicesData.slice().reverse().map((item, index) => (
                        <ServiceItem key={index} data={item} />
                     ))}
                  </View>
               </ScrollView>
            </View>
         ):(
            <PaymentSubscription />
         )}
      </SafeAreaView>
   )
};


const styles = StyleSheet.create({
   image: {
      width: 80,
      height: 80,
   },
   container: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      backgroundColor: 'white',
      borderRadius: 8,
      overflow: 'hidden',
      paddingHorizontal: 8,
      paddingVertical: 8,
      gap: 8,
   },
   innerContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 6,
   },
   imageService: {
      width: 110,
      height: 110,
      borderRadius: 8,
   },
   textContainer: {
      flex: 1, // Permite que el contenedor de texto use el espacio restante
      justifyContent: 'center',
   },
   title: {
      fontWeight: '700',
      color: 'black', // Ajusta el color del texto según sea necesario
      fontSize: 20
   },
   description: {
      color: 'black', // Ajusta el color del texto según sea necesario
      flexShrink: 1, // Permite que el texto se ajuste y no se desborde
   },
   buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 6
   },
   buttonService: {
      flex: 1,
      paddingVertical: 4,
      borderRadius: 8,
   }
});


export default ProfileScreen;