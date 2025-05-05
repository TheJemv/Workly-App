import { useNavigation } from "@react-navigation/native"
import SpinLoading from "components/SpinLoading"
import { AuthContext } from "context/AuthContext"
import { Colors } from "lib"
import { useContext, useEffect, useState } from "react"
import { View, FlatList, SafeAreaView, Text, TouchableOpacity, StyleSheet, Image } from "react-native"
import { getServices } from "services/api/services.api"


const ServiceItem = ({ data }) => {
   const navigation = useNavigation()

   return (
      <View style={styles.container} className="shadow-lg">
         <View style={styles.innerContainer}>
            <Image
               style={styles.imageService}
               source={{uri: data?.photo?data?.photo:"https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg"}}
               resizeMode="cover"
               width={110}
               height={110}
            />
            <View style={styles.textContainer}>
               <Text style={styles.title} numberOfLines={1}>{data?.name}</Text>
               <Text style={styles.description} className="text-text" numberOfLines={5}>{data?.description}</Text>
            </View>
         </View>
         {!data?.indefinite && (
            <Text className="" style={{fontSize:16,fontWeight:800,color:'#364670',paddingTop:6}}>Desde ${data?.unit_amount/100} {data?.currency}</Text>
         )}
         <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("service", {
               id: data?.id
            })} style={styles.buttonService}>
               <Text className="text-center text-white" style={{ fontWeight:700, fontSize:16 }}>Ver</Text>
            </TouchableOpacity>
         </View>
      </View>
   )
}



const ServicesScreenCategory = ({ route }) => {
   const [loading, setLoading] = useState(true);
   const [dataService, setData] = useState([]);
   const { token } = useContext(AuthContext);
   const [refresh, setRefresh] = useState(false)
   const dataCategory = route.params


   useEffect(() => {
      setLoading(true);
      getServices(token, dataCategory.label).then(data => {
         if (data?.services) {
            setData(data.services);
         }
      }).finally(() => {
         setLoading(false);
      });
   }, []);


   const fetchData = () => {
      if(refresh) return
      setRefresh(true)
      getServices(token, dataCategory.label).then(data => {
         setData(data.services)
      }).finally(() => {
         setRefresh(false)
      })
   }



   return (
      loading && !dataService.length ? (
         <View style={{ flex: 1 }} className="flex flex-col items-center justify-center">
            <SpinLoading size={48} color={Colors.principal.DEFAULT} />
         </View>
      ) : (
         <SafeAreaView style={{ flex: 1 }}>
            <FlatList
               data={dataService}
               renderItem={({ item }) => <ServiceItem data={item} />}
               keyExtractor={item => item.id.toString()}
               contentContainerStyle={{
                  gap: 12,
                  paddingHorizontal: 8,
                  paddingVertical: 8,
               }}
               refreshing={refresh}
               onRefresh={fetchData}
            />
         </SafeAreaView>
      )
   );
};


const styles = StyleSheet.create({
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
      display: "flex",
      justifyContent: "center"
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
      flexShrink: 1, // Permite que el texto se ajuste y no se desborde
   },
   buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: 6
   },
   buttonService: {
      flex: 1,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: Colors.principal.DEFAULT
   }
});


export default ServicesScreenCategory