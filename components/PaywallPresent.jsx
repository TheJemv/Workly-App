import React, { useEffect, useLayoutEffect, useState } from "react";
import {
   View,
   Text,
   TouchableOpacity,
   Dimensions,
   Image,
   KeyboardAvoidingView,
   Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Carousel from "react-native-reanimated-carousel";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import TextInputComponent from "./TextInputComponent";
import { companyRequest } from "services/api/company.api";
import useGlobal from "core/globals";

const { width } = Dimensions.get("window");

const data = [
   {
      title: "Simple de Comprar",
      subtitle: "A un solo click de contratar",
      image: require("assets/paywall/paywall-1.png"),
   },
   {
      title: "Rápido y Seguro",
      subtitle: "Tus transacciones protegidas",
      image: require("assets/paywall/paywall-2.png"),
   },
   {
      title: "Listo para Usarse",
      subtitle: "Activa todo en segundos",
      image: require("assets/paywall/paywall-3.png"),
   },
];

const PaywallPresent = () => {
   const navigation = useNavigation();
   const [index, setIndex] = useState(0);
   const [ready, setReady] = useState(false);

   const [company, setCompany] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");

   const token = useGlobal((state) => state.token);
   const customer = useGlobal((state) => state.customer);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, []);

   const HandleSubmit = async () => {
      try {
         const res = await companyRequest(token, {
            company,
            email,
            phone,
         });

      } catch (error) {
         console.error("Error sending request:", error.message);
         alert(error.message);
      }
   };

   return (
      <View
         style={{ flex: 1, paddingBottom: 80 }}
         className="flex flex-col w-full h-full"
      >
         <View className="flex-1 items-center gap-y-4 pt-[68px]">
            <View
               style={{
                  flexDirection: "row",
                  marginTop: 15,
               }}
            >
               {data.map((_, i) => (
                  <View
                     key={i}
                     style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        marginHorizontal: 4,
                        backgroundColor: i === index ? "#6F6F6F" : "#ccc",
                     }}
                  />
               ))}
            </View>

            <Carousel
               width={width}
               height={350}
               data={data}
               onSnapToItem={(i) => setIndex(i)}
               renderItem={({ item }) => (
                  <View
                     style={{ alignItems: "center" }}
                     className="flex flex-col"
                  >
                     <Text style={{ fontSize: 28, fontWeight: "bold" }}>
                        {item.title}
                     </Text>

                     <Text
                        style={{ color: "#555", marginTop: 5, fontSize: 18 }}
                     >
                        {item.subtitle}
                     </Text>

                     <Image
                        source={item.image}
                        style={{ marginTop: 20 }}
                        className="w-[300px] h-[250px]"
                        resizeMode="contain"
                     />
                  </View>
               )}
               loop
               pagingEnabled
               autoPlay
               autoPlayInterval={3000}
               scrollAnimationDuration={800}
            />
         </View>

         {customer?.requestCompanyId ? (
            <View className="h-[30%] transition-all duration-300 w-full bg-white border-t-2 border-gray-200 rounded-t-3xl overflow-hidden py-[10px] px-4 gap-y-4 flex flex-col">
               <Text className="text-2xl font-bold text-center w-full">
                  Solicitud enviada.
               </Text>

               <Text className="text-text mt-2 flex-1">
                  Al convertirte en nuestro socio accedes a herramientas
                  avanzadas, soporte prioritario y funciones diseñadas para
                  ahorrar tiempo, aumentar tu productividad y escalar tu negocio
                  con inteligencia.
               </Text>
            </View>
         ) : !ready ? (
            <View className="h-[35%] transition-all duration-300 w-full bg-white border-t-2 border-gray-200 rounded-t-3xl overflow-hidden py-[10px] px-4 gap-y-4 flex flex-col">
               <Text className="text-2xl font-bold text-center w-full">
                  Conviertete en nuestro Socio
               </Text>
               <Text className="text-text mt-2 flex-1">
                  Al convertirte en nuestro socio desbloqueas beneficios
                  exclusivos, soporte prioritario y funcionalidades que te
                  permiten optimizar tu tiempo, mejorar tus resultados y hacer
                  crecer tu negocio de manera inteligente.
               </Text>

               <TouchableOpacity
                  onPress={() => setReady(true)}
                  className="items-center justify-center bg-primary border-0 py-3 mt-auto rounded-lg border-transparent"
               >
                  <Text className="text-white font-bold text-[16px]">
                     Continuar
                  </Text>
               </TouchableOpacity>
            </View>
         ) : (
            <KeyboardAvoidingView
               behavior={Platform.OS === "ios" ? "padding" : undefined}
               keyboardVerticalOffset={50}
               style={{ flex: 1 }}
               className="transition-all duration-300 w-full bg-white border-t-2 border-gray-200 rounded-t-3xl overflow-hidden px-4 gap-y-4 flex flex-col"
            >
               <View className="mb-16 flex-1">
                  <View className="flex flex-1 flex-col">
                     <View className="flex flex-row w-full items-center gap-x-1">
                        <TouchableOpacity
                           onPress={() => setReady(false)}
                           className="p-2"
                        >
                           <FontAwesome
                              color={"#354671"}
                              name="arrow-left"
                              size={20}
                           />
                        </TouchableOpacity>
                        <Text className="text-2xl font-bold w-full">
                           Envia tu solicitud.
                        </Text>
                     </View>

                     {customer?.requestCompanyId && (
                        <Text>Solicitud enviada...</Text>
                     )}

                     <Text className="text-text mt-2 flex-1">
                        Envíanos tu solicitud para iniciar tu registro como
                        socio. Este formulario nos permitirá conocer tu perfil y
                        determinar la mejor manera de colaborar contigo. Damos
                        este primer paso contigo para construir una relación
                        sólida y profesional.
                     </Text>
                  </View>

                  <View
                     style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginTop: "auto",
                     }}
                     className="flex-1 flex flex-col gap-1"
                  >
                     <TextInputComponent
                        onChangeText={(e) => setCompany(e)}
                        placeholder="nombre de empresa"
                     />
                     <TextInputComponent
                        onChangeText={(e) => setEmail(e)}
                        placeholder="correo"
                     />
                     <TextInputComponent
                        onChangeText={(e) => setPhone(e)}
                        keyboardType="number-pad"
                        placeholder="numero de telefono"
                     />

                     <TouchableOpacity
                        onPress={HandleSubmit}
                        className="items-center justify-center bg-primary border-0 py-3 rounded-lg border-transparent"
                     >
                        <Text className="text-white font-bold text-[16px]">
                           Enviar Solicitud
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </KeyboardAvoidingView>
         )}
      </View>
   );
};

export default PaywallPresent;
