import { AuthContext } from "context/AuthContext";
import { useContext, useRef, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert } from "react-native";
import { delService } from "services/api/services.api";
import SpinLoading from "./SpinLoading";
import { useNavigation } from "@react-navigation/native";

const ServiceItem = ({ data }) => {
   const { token, reloadCompany } = useContext(AuthContext)
   const [loading, setLoading] = useState(false)
   const navigation = useNavigation()

   const handleDeleteAlert = () => {
      Alert.alert(
         '¿Estás seguro?',
         '¿Deseas borrar tu servicio?',
         [{
            text: 'Cancelar',
            style: 'cancel'
         }, {
            text: 'Aceptar',
            onPress: () => handleDelete(),
            style: 'default'
         }], {
         cancelable: false
      }
      );
   };


   const handleDelete = async () => {
      setLoading(true)
      try {
         await delService(token, data?.id)
         await reloadCompany()
      } catch (e) {
         throw new Error(e)
      } finally {
         setLoading(false)
      }
   }


   return (
      <View style={styles.container} className="shadow-lg">
         {loading ? (
            <View>
               <SpinLoading color={"#364670"} size={48} />
            </View>
         ) : (
            <View className="flex flex-col space-y-1">
               <View style={styles.innerContainer}>
                  <Image
                     style={styles.imageService}
                     source={{ uri: data?.photo ? data?.photo : "https://1.bp.blogspot.com/-CLJH1C9LCj8/U_qBzC3WCII/AAAAAAACR9g/_QV42D7tkO8/s1600/imagenes%2Bbonitas%2By%2Bfotos%2Bde%2Bpaisajes%2Bnaturales%2B-%2Bamazing%2Bfree%2Bwallpapers%2B(1).jpg" }}
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
                  <Text className="" style={{ fontSize: 16, fontWeight: 800, color: '#364670', paddingTop: 6 }}>Desde ${data?.unit_amount / 100} {data?.currency}</Text>
               )}

               <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate("editservice", {
                     service: data
                  })} className="bg-[#364670]" style={styles.buttonService}>
                     <Text className="text-center text-white" style={{ fontWeight: 700, fontSize: 16 }}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleDeleteAlert} className="bg-gray-400" style={styles.buttonService}>
                     <Text className="text-center text-white" style={{ fontWeight: 700, fontSize: 16 }}>Eliminar</Text>
                  </TouchableOpacity>
               </View>
            </View>
         )}
      </View>
   )
}

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
      paddingVertical: 12,
      gap: 8,
      maxHeight: 195,
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
      paddingVertical: 4,
      borderRadius: 8,
   }
});

export default ServiceItem