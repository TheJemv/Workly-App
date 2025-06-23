import { useState, useTransition } from "react";
import {
   SafeAreaView,
   View,
   Text,
   TextInput,
   TouchableOpacity,
   DevSettings,
   Alert,
} from "react-native";
import {
   FirebaseAuthTypes,
   getAuth,
   signInWithPhoneNumber,
   sendEmailVerification,
} from "@react-native-firebase/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type Verification = "email" | "phone" | "phone-code";

export function EmailPhoneVerified() {
   const [isPendingEmail, startTransitionEmail] = useTransition();
   const [isPendingPhone, startTransitionPhone] = useTransition();
   const [isPendingPhoneCode, startTransitionPhoneCode] = useTransition();
   const [type, setType] = useState<Verification | null>(null);
   const [phone, setPhone] = useState<string>("");
   const [code, setCode] = useState<string>("");
   const [confirmation, setConfirmation] =
      useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

   const handleCheckEmail = () => {
      startTransitionEmail(() => {
         setType("email");
         sendEmailVerification(getAuth().currentUser);
      });
   };

   const handleCheckPhone = () => {
      setType("phone");
   };

   const handleSignInWithPhoneNumber = async () => {
      startTransitionPhone(() => {
         signInWithPhoneNumber(getAuth(), phone).then((confirmation) => {
            setConfirmation(confirmation);
            setType("phone-code");
         });
      });
   };

   const handleConfirmCode = () => {
      startTransitionPhoneCode(() => {
         confirmation.confirm(code);
      });
   };

   const handleEmailVerified = () => {
      const auth = getAuth();
      auth.currentUser?.reload().then(() => {
         const refreshedUser = auth.currentUser;
         if (refreshedUser?.emailVerified) {
            DevSettings.reload();
         } else {
            Alert.alert(
               "Tu correo aún no ha sido verificado. Por favor revisa tu bandeja de entrada."
            );
         }
      });
   };

   return (
      <SafeAreaView className="flex-1">
         <KeyboardAwareScrollView
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
         >
            <View className="flex-1 justify-center items-center p-6">
               <Text className="text-2xl font-bold mb-8 text-center">
                  Verifica tu cuenta
               </Text>
               {!type ? (
                  <View className="w-full mb-4">
                     <View className="bg-white rounded-lg shadow p-6 mb-4">
                        <Text className="text-lg font-semibold mb-2">
                           Verificar con Email
                        </Text>
                        <Text className="text-gray-600 mb-4">
                           Te enviaremos un enlace de verificación a tu correo
                           electrónico.
                        </Text>
                        <TouchableOpacity
                           disabled={isPendingEmail}
                           onPress={handleCheckEmail}
                           className="bg-blue-600 rounded py-2"
                        >
                           <Text className="text-center text-white font-bold">
                              {isPendingEmail ? (
                                 <>Enviando correo...</>
                              ) : (
                                 <>Enviar Email</>
                              )}
                           </Text>
                        </TouchableOpacity>
                     </View>
                     <View className="bg-white rounded-lg shadow p-6">
                        <Text className="text-lg font-semibold mb-2">
                           Verificar con Teléfono
                        </Text>
                        <Text className="text-gray-600 mb-4">
                           Recibirás un código de verificación por SMS.
                        </Text>
                        <TouchableOpacity
                           onPress={handleCheckPhone}
                           className="bg-green-600 rounded py-2"
                        >
                           <Text className="text-center text-white font-bold">
                              Enviar SMS
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               ) : (
                  <>
                     {type === "email" && (
                        <View>
                           <Text className="text-xl font-semibold mb-4 text-center text-green-700">
                              ¡Correo de verificación enviado!
                           </Text>
                           <Text className="text-base text-gray-700 mb-6 text-center">
                              Hemos enviado un enlace de verificación a tu
                              correo electrónico. Por favor, revisa tu bandeja
                              de entrada y sigue las instrucciones para
                              verificar tu cuenta.
                           </Text>
                           <TouchableOpacity
                              onPress={handleEmailVerified}
                              className="bg-blue-500 rounded py-2 mt-4"
                           >
                              <Text className="text-center text-white font-bold">
                                 He verificado mi correo. Continuar
                              </Text>
                           </TouchableOpacity>
                        </View>
                     )}
                     {type === "phone" && (
                        <View className="flex flex-col gap-4">
                           <Text className="text-gray-700 font-medium">
                              Ingresa tu número de teléfono para enviarte un
                              código de verificación
                           </Text>
                           <TextInput
                              className="border border-gray-300 rounded px-4 py-2"
                              placeholder="Ingresa tu número de teléfono"
                              keyboardType="phone-pad"
                              value={phone}
                              onChangeText={setPhone}
                           />
                           <TouchableOpacity
                              onPress={handleSignInWithPhoneNumber}
                              disabled={!phone || isPendingPhone}
                              className="bg-green-600 rounded py-2"
                           >
                              <Text className="text-center text-white font-bold">
                                 {isPendingPhone ? (
                                    <>Enviando código...</>
                                 ) : (
                                    <>Enviar código</>
                                 )}
                              </Text>
                           </TouchableOpacity>
                        </View>
                     )}
                     {confirmation && type === "phone-code" && (
                        <View className="flex flex-col gap-4">
                           <Text className="text-gray-700 font-medium">
                              Ingrese el código que se envió a tu número de
                              teléfono
                           </Text>
                           <TextInput
                              className="border border-gray-300 rounded px-4 py-2"
                              placeholder="Ingresa el código de verificación"
                              keyboardType="number-pad"
                              value={code}
                              onChangeText={setCode}
                           />
                           <TouchableOpacity
                              onPress={handleConfirmCode}
                              disabled={!code || isPendingPhoneCode}
                              className="bg-green-600 rounded py-2"
                           >
                              <Text className="text-center text-white font-bold">
                                 {isPendingPhoneCode ? (
                                    <>Verificando código...</>
                                 ) : (
                                    <>Verificar código</>
                                 )}
                              </Text>
                           </TouchableOpacity>
                        </View>
                     )}
                  </>
               )}
            </View>
         </KeyboardAwareScrollView>
      </SafeAreaView>
   );
}
