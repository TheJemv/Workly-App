import { useNavigation, useRoute } from "@react-navigation/native"
import { AuthContext } from "context/AuthContext"
import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { SafeAreaView, ScrollView, TouchableOpacity, View, Image, Text, Linking, Alert } from "react-native"
import getValue from "utils/getValue"
import * as ImagePicker from "expo-image-picker";
import RNFS from "react-native-fs"
import { fetchOnboardingCompany, updateCompany } from "services/api/company.api"
import SpinLoading from "components/SpinLoading"
import { Colors } from "lib"
import useGlobal from "core/globals"


const MAX_FILE_SIZE = 10485760; // 10 MB en bytes
const ScreenEdit = () => {
   const navigation = useNavigation()
   const route = useRoute()

   const companyData = useGlobal((state) => state.company);
   const reloadCompany = useGlobal((state) => state.companyReload);

   const Options = route.params
   const [loadingImage, setLoadingImage] = useState(false)
   const [linkOnboarding, setLinkOnboarding] = useState(null)
   const { token } = useContext(AuthContext)
   const [currentImage, setCurrentImage] = useState(companyData?.profile?.photo)



   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Editar",
      })
   }, [navigation])


   useEffect(() => {
      const fetchOnboarding = async () => {
         const data = await fetchOnboardingCompany(token)
         setLinkOnboarding(data?.url)
      }

      fetchOnboarding()
   }, [])


   const handleImage = async () => {
      setLoadingImage(true)
      try {
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
         });

         if (!result.canceled) {
            const fileSize = await getFileSize(result.assets[0].uri);
            if (fileSize >= MAX_FILE_SIZE) {
               Alert.alert("Error", "La foto no puede ser mayor de 10MB")
               return
            }

            const base64 = await RNFS.readFile(result.assets[0].uri, "base64")
            const data = await updateCompany(token, {
               photo: base64
            })


            setCurrentImage(data?.profile?.photo);
            await reloadCompany()
         }
      } catch(error) {
         Alert.alert(error.message)
      } finally {
         setLoadingImage(false)
      }
   };

   const getFileSize = async (uri) => {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob.size;
      } catch (error) {
        console.error('Error al obtener el tamaño del archivo:', error);
        return 0; // Si ocurre un error, asumimos un tamaño de archivo de 0
      }
   }

   const getValueOnOption = (key, title) => {
      if (key === "public") {
         return getValue(companyData, key) ? 'Publica' : 'Privada'
      }

      return getValue(companyData, key) ? getValue(companyData, key) : title
   }


   return (
      <SafeAreaView style={{flex:1}}>
         <ScrollView style={{flex:1}}>
            <View className="flex flex-col flex-1">
               <TouchableOpacity onPress={handleImage} className="flex flex-col items-center justify-center border-black/20 border-b py-4" style={{gap:12}}>
                  <View className="w-[120] rounded-full overflow-hidden bg-gray-200 h-[120] flex flex-col items-center justify-center">
                     {loadingImage ? (
                        <SpinLoading size={32} color={Colors.principal.DEFAULT} />
                     ) : (
                        <Image style={{ width: "100%", height: "100%"}}  className="rounded-full" source={{uri: currentImage}} />
                     )}
                  </View>
                  <Text>Cambiar foto</Text>
               </TouchableOpacity>

               {Object.entries(Options).map(([index, { title, key }]) => (
                  <TouchableOpacity key={index} onPress={() => navigation.navigate(title)} className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b" style={{gap:12}}>
                     <Text className="text-dark" style={{fontWeight: 600, fontSize: 15}}>{title}</Text>
                     <Text className={getValue(companyData, key)!=="" ? "text-dark/90":"text-text/60"} numberOfLines={1}>{getValueOnOption(key, title)}</Text>
                   </TouchableOpacity>
               ))}

               <TouchableOpacity onPress={() => Linking.openURL(linkOnboarding && linkOnboarding)} className="w-full py-3 px-2 flex flex-row items-center border-black/20 border-b" style={{gap:12}}>
                  <Text className="text-dark" style={{fontWeight: 600, fontSize: 15}}>Onboarding</Text>
                  <Text className={"text-dark/90"} numberOfLines={1}>{companyData.completed?'Completado':'Incompleto'}</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   )
}

export default ScreenEdit