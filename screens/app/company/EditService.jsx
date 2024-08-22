import { useNavigation } from "@react-navigation/native"
import { Colors } from "lib"
import { useContext, useEffect, useState } from "react"
import { SafeAreaView, ScrollView, View, Text, Platform, TextInput, TouchableOpacity, KeyboardAvoidingView, StyleSheet, Image, Alert } from "react-native"
import SpinLoading from "components/SpinLoading";
import * as ImagePicker from "expo-image-picker"
import Entypo from "@expo/vector-icons/Entypo"
import { patchService } from "services/api/services.api";
import { AuthContext } from "context/AuthContext";
import getChangedProperties from "utils/CompareObjects";
import{ Picker } from "@react-native-picker/picker"
import ServiceCategoryEnum from "enum/ServiceCategoryEnum";
import loadImageFile from "utils/loadImageFile";


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


const ScreenEditService = ({ route }) => {
   const {token, reloadCompany} = useContext(AuthContext)
   const navigation = useNavigation()
   const data = route.params.service

   const [valuePrice, setValuePrice] = useState(data?.unit_amount)
   const [loading, setLoading] = useState(false)
   const [loadingPhoto, setLoadingPhoto] = useState(false)
   const [value, setValue] = useState(data)
   const [currentImage, setCurrentImage] = useState(data?.photo)

   useEffect(() => {
      navigation.setOptions({
         headerTitle: 'Editar servicio',
         headerRight: () => (
            JSON.stringify(data) !== JSON.stringify(value) && (
               <TouchableOpacity disabled={loading} onPress={handleEditService}>
                  <Entypo color={Colors.principal.DEFAULT} name="save" size={24} />
               </TouchableOpacity>
            )
         )
      })
   }, [navigation, data, value, loading])


   const handleEditService = async () => {
      setLoading(true)
      try {
         const newData = getChangedProperties(data, value)
         await patchService(token, data?.id, newData)
         await reloadCompany()
         navigation.goBack()
      } catch(e) {
         Alert.alert("Error", e.message)
      } finally {
         setLoading(false)
      }
   }

   const handleImageService = async () => {
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

   const handleChange = (text) => {
      setValuePrice(formatPrice(text));
   };

   return (
      loading ? (
         <View style={{flex:1}} className="flex flex-col items-center justify-center">
            <SpinLoading size={64} color={"#364670"} />
         </View>
      ) : (
         <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
               style={{ flex: 1 }}
               keyboardVerticalOffset={50}
            >
               <ScrollView className="flex-1">
                  <View className="flex-1 flex flex-col pt-4 px-3" style={{paddingBottom:58}} gap={32}>
                     <Text className="text-center" style={{color:Colors.principal.DEFAULT,fontSize:22,fontWeight:700}}>Modificar tu servicio</Text>
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
                              value={formatPrice(String(valuePrice))}
                              placeholderTextColor={"#92929D"}
                           />
                        </Col>

                        <Col gap={8}>
                           <Text style={{color:Colors.principal.DEFAULT,fontSize:14,fontWeight:700}}>Categorio del servicio</Text>
                           <Picker
                              onValueChange={(e) => {
                                 setValue((prevData) => ({
                                    ...prevData,
                                    category: e,
                                 }))
                              }}
                              selectedValue={value?.category}
                           >
                              <Picker.Item style={{ fontSize: 12 }} label="Escoje tu Categoria:" value={"none"} />
                              {Object.keys(ServiceCategoryEnum).map(key => (
                                 <Picker.Item
                                    style={{ fontSize: 12 }}
                                    key={key}
                                    value={ServiceCategoryEnum[key]}
                                    label={ServiceCategoryEnum[key]}
                                 />
                              ))}
                           </Picker>
                        </Col>
                     </Col>
                  </View>
               </ScrollView>
            </KeyboardAvoidingView>
         </SafeAreaView>
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


export default ScreenEditService