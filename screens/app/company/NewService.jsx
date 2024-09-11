import { useNavigation } from "@react-navigation/native"
import { Colors } from "lib"
import { useContext, useEffect, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Alert } from "react-native"
import * as ImagePicker from "expo-image-picker";
import { setService } from "services/api/services.api";
import { AuthContext } from "context/AuthContext";
import SpinLoading from "components/SpinLoading";
import{ Picker } from "@react-native-picker/picker"
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import ServiceCategoryEnum from "enum/ServiceCategoryEnum";
import loadImageFile from "utils/loadImageFile";
import { Dropdown } from "react-native-element-dropdown";


const Col = ({children, gap=0, className=""}) => (
   <View className={`flex flex-col ${className&&className}`} style={{gap:gap}}>
      {children}
   </View>
)

const formatPrice = (text) => {
   const numericText = text.replace(/[^0-9]/g, '');
   const formattedText = numericText.replace(/(\d)(\d{2})$/, '$1.$2');

   if(text > 0) {
      return `$${formattedText}`;
   }
   return text
};


const NewService = () => {
   const { token, reloadCompany } = useContext(AuthContext)
   const navigation = useNavigation()
   const bottomHeight = useBottomTabBarHeight()

   const [valuePrice, setValuePrice] = useState("")
   const [currentImage, setCurrentImage] = useState("https://static.vecteezy.com/system/resources/previews/011/801/482/original/eps10-grey-customer-service-desk-or-reception-icon-isolated-on-white-background-information-counter-symbol-in-a-simple-flat-trendy-modern-style-for-your-website-design-logo-and-mobile-app-vector.jpg");
   const [loading, setLoading] = useState(false)
   const [loadingPhoto, setLoadingPhoto] = useState(false)
   const [value, setValue] = useState({
      public: false,
      name: '',
      description: '',
      unit_amount: null,
      category: 'none',
      photo: '',
   })


   useEffect(() => {
      navigation.setOptions({
         headerTitle: 'Nuevo Servicio'
      })
   }, [navigation])


   const handleChange = (text) => {
      setValuePrice(formatPrice(text));
   };


   const handleService = async () => {
      setLoading(true)
      try {
         await setService(token, value)
         await reloadCompany()
         navigation.goBack()
      } catch(e) {
         Alert.alert("Error", e.message)
      } finally {
         setLoading(false)
      }
   }


   const handleImageService = async () => {
      if(loadingPhoto) return;
      setLoadingPhoto(true)
      try {
         let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
         });
         if(result.canceled) return;

         const base64 = await loadImageFile(result.assets[0].uri)
         setValue((prevData) => ({
            ...prevData,
            photo: base64
         }))

         setCurrentImage(result.assets[0].uri)
      } catch(e) {
         Alert.alert("Error", e.message)
      } finally {
         setLoadingPhoto(false)
      }
   }


   return (
      loading ? (
         <View style={{flex:1}} className="flex flex-col items-center justify-center">
            <SpinLoading size={64} color={"#364670"} />
         </View>
      ):(
         <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1 }}
            keyboardVerticalOffset={50}
         >
            <ScrollView className="flex-1">
               <View className="flex-1 flex flex-col pt-4 px-3" style={{paddingBottom:bottomHeight+12}} gap={32}>
                  <Text className="text-center" style={{color:Colors.principal.DEFAULT,fontSize:22,fontWeight:700}}>Añadir un servicio</Text>
                  <Col gap={40}>
                     <Col gap={8}>
                        <TouchableOpacity onPress={handleImageService} className="flex flex-col items-center">
                           <View className="items-center justify-center" style={styles.imageBox}>
                              <Image
                                 style={styles.image}
                                 source={{uri: currentImage}}
                                 resizeMode="cover"
                                 width={110}
                                 height={110}
                              />
                           </View>
                        </TouchableOpacity>
                     </Col>

                     <Col gap={8}>
                        <Text style={{color:Colors.principal.DEFAULT,fontSize:14,fontWeight:700}}>Nombre del servicio</Text>
                        <TextInput
                           value={value.name}
                           onChangeText={e => setValue((prevData) => ({
                              ...prevData,
                              name: e
                           }))}
                           placeholder="nombre del servicio"
                           className="py-2 px-2 rounded-lg border border-dark/10"
                           maxLength={36}
                           placeholderTextColor={"#92929D"}
                        />
                     </Col>

                     <Col gap={8}>
                        <Text style={{color:Colors.principal.DEFAULT,fontSize:14,fontWeight:700}}>Descripcion del servicio</Text>
                        <TextInput
                           value={value.description}
                           onChangeText={(e) => setValue((prevData) => ({
                              ...prevData,
                              description: e
                           }))}
                           placeholder="descripcion del servicio"
                           className="py-2 px-2 rounded-lg border border-dark/10"
                           multiline
                           maxLength={260}
                           placeholderTextColor={"#92929D"}
                        />
                     </Col>

                     <Col gap={8}>
                        <Text style={{color:Colors.principal.DEFAULT,fontSize:14,fontWeight:700}}>Precio Fijo</Text>
                        <Dropdown
                           className="border-dark/10 rounded-lg border py-2 px-2"
                           style={{
                              backgroundColor: Colors.transparent,
                           }}
                           selectedTextStyle={{
                              color: "#050505",
                              fontSize: 14,
                           }}
                           data={[
                              {label: 'Indefinido', value: true},
                              {label: 'Fijo', value: false}
                           ]}
                           labelField="label"
                           valueField="value"
                           placeholder="Escoje el tipo de Precio:"
                           placeholderStyle={{
                              color: "#92929D",
                              fontSize: 14,
                           }}
                           itemContainerStyle={{
                              backgroundColor: Colors.white,
                              borderRadius: 8,
                              fontSize: 14,
                           }}
                           containerStyle={{
                              borderRadius: 8,
                              borderWidth: 1,
                           }}

                           value={value?.indefinite}
                           onChange={(e) => {
                              console.log(e)
                              if(e.value) {
                                 setValue((prevData) => ({
                                    ...prevData,
                                    unit_amount: null
                                 }))
                              }
                              setValue((prevData) => ({
                                 ...prevData,
                                 indefinite: e.value
                              }))
                           }}
                        />
                     </Col>

                     {(value?.indefinite === false) && (
                        <Col gap={8}>
                           <Text style={{color:Colors.principal.DEFAULT,fontSize:14,fontWeight:700}}>Precio del servicio</Text>
                           <TextInput
                              onChangeText={(e) => {
                                 const cleanedValue = e.replace(/[^0-9.]/g, '');
                                 const numericValue = parseFloat(cleanedValue) * 100;
                                 setValue((prevData) => ({
                                    ...prevData,
                                    unit_amount: numericValue,
                                 }))

                                 handleChange(e)
                              }}
                              className="py-2 px-2 rounded-lg border border-dark/10"
                              keyboardType="numeric"
                              placeholder="$0.00"
                              value={valuePrice}
                              placeholderTextColor={"#92929D"}
                           />
                           <Text className="text-[#A1A1AA]">Define un precio a tu servicio.</Text>
                        </Col>
                     )}
                  </Col>

                  <Col gap={8}>
                     <Text style={{color:Colors.principal.DEFAULT,fontSize:14,fontWeight:700}}>Categorio del servicio</Text>
                     <Dropdown
                        className="border-dark/10 rounded-lg border py-2 px-2"
                        style={{
                           backgroundColor: Colors.transparent,
                        }}
                        selectedTextStyle={{
                           color: "#050505",
                           fontSize: 14,
                        }}
                        data={Object.keys(ServiceCategoryEnum).map(key => ({
                           label: ServiceCategoryEnum[key],
                           value: ServiceCategoryEnum[key]
                        }))}
                        labelField="label"
                        valueField="value"
                        placeholder="Escoje tu Categoria:"
                        placeholderStyle={{
                           color: "#92929D",
                           fontSize: 14,
                        }}
                        itemContainerStyle={{
                           backgroundColor: Colors.white,
                           borderRadius: 8,
                           fontSize: 14,
                        }}
                        containerStyle={{
                           borderRadius: 8,
                           borderWidth: 1,
                        }}
                        dropdownPosition="top"

                        value={value?.category}
                        onChange={(e) => {
                           setValue((prevData) => ({
                              ...prevData,
                              category: e.value
                           }))
                        }}
                     />
                  </Col>

                  <TouchableOpacity disabled={loading} onPress={handleService} className="bg-[#364670] py-3 rounded-lg">
                     <Text className="text-white text-center" style={{fontWeight:600,fontSize:22}}>Publicar</Text>
                  </TouchableOpacity>
               </View>
            </ScrollView>
         </KeyboardAvoidingView>
      )
   )
}


const styles = StyleSheet.create({
   image: {
      width: 120,
      height: 120,
      borderRadius: 100,
   },
   imageBox: {
      width: 140,
      height: 140,
      borderRadius: 200,
      borderWidth: 4,
      display: 'flex',
      flexDirection: 'col',
      borderStyle: 'dashed',
      borderColor: '#364670'
   }
})


export default NewService