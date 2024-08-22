import { Alert, ScrollView, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useContext } from 'react';

import { Singout } from '@/services/firebase/Singout';
import { UserConfigButton, Option } from "components";

import Entypo from "@expo/vector-icons/Entypo"
import Feather from "@expo/vector-icons/Feather"
import FontAwesome6 from "@expo/vector-icons/FontAwesome6"
import AntDesign from "@expo/vector-icons/AntDesign"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { AuthContext } from 'context/AuthContext';

const AccountScreen = ({ navigation }) => {
   const { isCompany } = useContext(AuthContext)
   const handleSingout = async () => {
      await Singout().catch(e => {
         Alert.alert("Error", e.message)
      })
   }

   const handleScreen = (name) => {
      navigation.navigate(name)
   }

   return (
      <SafeAreaView style={{flex: 1}}>
         <ScrollView className="px-3 pt-3 w-full" style={{flex: 1}}>
            <View style={{gap: 12}} className="flex flex-col">
               <Text className="order-0 text-dark font-bold text-[22px]">Configuracion</Text>
               <UserConfigButton onPress={() => handleScreen("Perfil")} />

               <View className="rounded-lg overflow-hidden flex flex-col">
                  <Option styles="bg-red-500" icon={Entypo} iconName="notification" label="Notificaciones" />
                  <Option styles="bg-gray-500" icon={Feather} iconName="lock" label="Privacidad" />
                  <Option styles="bg-green-500" icon={Entypo} iconName="phone" label="Telefono" />
               </View>

               <View className="rounded-lg overflow-hidden flex flex-col">
                  <Option styles="bg-green-500" icon={Feather} iconName="message-circle" label="Chats" />
                  <Option styles="bg-cyan-400" icon={AntDesign} iconName="addfile" label="Datos de Facturacion" />
                  <Option styles="bg-orange-500" icon={MaterialIcons} iconName="support-agent" label="Soporte" />
               </View>

               <View className="rounded-lg overflow-hidden flex flex-col">
                  <Option styles="bg-amber-700" icon={Feather} iconName="package" label="Pedidos" />
                  <Option onPress={() => handleScreen("Payment")} styles="bg-red-500" icon={AntDesign} iconName="creditcard" label="Datos Bancarios" />
               </View>

               <TouchableOpacity onPress={handleSingout} className="bg-white rounded-lg px-4 py-2">
                  <Text className="text-red-500 text-center">Cerrar Sesion</Text>
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
}

export default AccountScreen;
