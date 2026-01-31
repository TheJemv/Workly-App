import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import * as ImagePicker from "expo-image-picker";
import MultiSwitch from "react-native-multiple-switch";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Colors } from 'lib';
import { AuthContext } from 'context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { updateCompany } from 'services/api/company.api';
import SpinLoading from './SpinLoading';
import getChangedProperties from 'utils/CompareObjects';


const CustomCompany = () => {
   const navigation = useNavigation();
   const [loading, setLoading] = useState(false)
   const { companyData, token, reloadCompany } = useContext(AuthContext);
   const [currentImage, setCurrentImage] = useState("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn1.vectorstock.com%2Fi%2F1000x1000%2F00%2F65%2Fuser-profile-grey-icon-web-avatar-employee-vector-32550065.jpg");
   const [editinData, setEditingData] = useState(companyData)


   const dataPrivacy = ["publica", "privada"]
   const dataContact = ["facebook", "instagram", "linkedin", "phone"]


   useEffect(() => {
      setEditingData(companyData)
   }, [companyData])


   const inputRefs = useRef([]);
   const focusInput = (index) => {
      if (inputRefs.current[index]) {
         inputRefs.current[index].focus();
      }
   };


   const handleImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 1
      });
      if (!result.canceled) {
         setCurrentImage(result.assets[0].uri);
      }
   };


   const handleSaveData = async () => {
      setLoading(true);
      try {
         const newData = getChangedProperties(companyData, editinData);
         await updateCompany(newData);
         await reloadCompany();
      } catch (error) {
         Alert.alert('Error', error.message);
      } finally {
         setLoading(false);
      }
   };


   const saveComponent = () => (
      JSON.stringify(editinData) !== JSON.stringify(companyData) && (
         <TouchableOpacity onPress={handleSaveData} className="rounded-full p-[6px]" style={{ backgroundColor: Colors.principal.DEFAULT }}>
            <Entypo name='save' size={18} color={"white"} />
         </TouchableOpacity>
      )
   );


   useLayoutEffect(() => {
      navigation.setOptions({
         headerRight: saveComponent
      });
   }, [companyData, editinData]);


   return (
      !loading ? (
         <ScrollView>
            <View className="flex flex-col" style={{ gap: 32 }}>
               <View className="flex flex-row items-center justify-between">
                  <Text className="text-dark" style={{ fontWeight: 700, fontSize: 20 }}>Modifica tu empresa.</Text>
               </View>

               <View className="flex flex-col items-center justify-center" style={{ gap: 4 }}>
                  <TouchableOpacity onPress={handleImage} style={styles.image} className="border-[4px] rounded-full">
                     <Image style={styles.image.box} source={{ uri: currentImage }} />
                     <View style={styles.image.icon}>
                        <MaterialCommunityIcons name='image-edit' size={24} color={"white"} />
                     </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => focusInput(0)} className="flex flex-row items-center" style={{ gap: 6 }}>
                     <TextInput
                        ref={el => inputRefs.current[0] = el}
                        maxLength={24}

                        value={editinData?.profile.name}
                        onChangeText={e => setEditingData((prevData) => ({
                           ...prevData,
                           profile: {
                              ...prevData?.profile,
                              name: e
                           }
                        }))}
                     />
                     <AntDesign name='edit' size={18} color={Colors.principal.DEFAULT} />
                  </TouchableOpacity>
                  <Text className="text-text text-xs" style={{ fontWeight: 600, fontSize: 10 }}>{companyData?.id}</Text>
               </View>

               <View className="bg-white rounded-lg px-2 py-1 flex flex-col" style={{ gap: 4 }}>
                  <Text className="text-dark" style={{ fontSize: 16, fontWeight: 700 }}>Descripción de tu empresa.</Text>
                  <TextInput
                     ref={el => inputRefs.current[1] = el}
                     placeholder="Agrega la descripción de tu empresa..."
                     multiline
                     style={styles.textarea}
                     className="text-text"

                     value={editinData?.profile?.description}
                     onChangeText={e => setEditingData((prevData) => ({
                        ...prevData,
                        profile: {
                           ...prevData?.profile,
                           description: e
                        }
                     }))}
                  />
               </View>

               <View className="flex flex-col" style={{ gap: 4 }}>
                  <Text className="text-dark" style={{ fontSize: 16, fontWeight: 700 }}>Privacidad de cuenta</Text>
                  <Text className="text-text" style={{ fontWeight: 400, paddingBottom: 12 }}>Hacer tu cuenta pública para los usuarios.</Text>

                  <MultiSwitch
                     items={dataPrivacy}
                     value={editinData.public ? dataPrivacy[0] : dataPrivacy[1]}
                     onChange={value => setEditingData((prevData) => ({
                        ...prevData,
                        public: value === dataPrivacy[0],
                     }))}
                  />
               </View>

               <View className="flex flex-col" style={{ gap: 12 }}>
                  <Text className="text-dark pb-4" style={{ fontWeight: 700, fontSize: 22 }}>Contacto</Text>
                  {dataContact.map((data, index) => (
                     <TouchableOpacity onPress={() => focusInput(index + 12)} key={index} className="py-3 px-2 rounded-lg flex flex-row items-center border-[0] border-light" style={{ gap: 12 }}>
                        <Entypo name={data} size={22} color={Colors.principal.DEFAULT} />
                        <TextInput
                           value={editinData.profile.contact[data]}
                           onChangeText={e => setEditingData((prevData) => ({
                              ...prevData,
                              profile: {
                                 ...prevData?.profile,
                                 contact: {
                                    ...prevData?.profile?.contact,
                                    [data]: e
                                 }
                              }
                           }))}

                           ref={el => inputRefs.current[index + 12] = el}
                           placeholder={data}
                           style={{ fontSize: 18, flex: 1 }}
                           className="text-dark"
                           keyboardType={data === "phone" && "phone-pad"}
                        />
                     </TouchableOpacity>
                  ))}
               </View>
            </View>
         </ScrollView>
      ) : (
         <View className="flex flex-col items-center justify-center my-auto bg-transparent" style={{ flex: 1 }}>
            <SpinLoading size={62} color={Colors.principal.DEFAULT} />
         </View>
      )
   );
}


const styles = StyleSheet.create({
   image: {
      borderColor: Colors.principal.DEFAULT,
      padding: 8,
      marginBottom: 30,
      borderStyle: "dashed",
      box: {
         borderRadius: 1000,
         width: 160,
         height: 160,
         backgroundColor: Colors.gray[200]
      },
      icon: {
         position: "absolute",
         bottom: -20,
         alignSelf: "center",
         borderRadius: 1000,
         backgroundColor: Colors.principal.DEFAULT,
         width: 44,
         height: 44,
         display: "flex",
         justifyContent: "center",
         alignItems: "center"
      },
   },
   textarea: {
      height: 180,
      padding: 0,
      borderColor: 'gray',
      borderWidth: 0,
      marginBottom: 20,
      textAlignVertical: 'top',
   },
});

export default CustomCompany;