import React, { useState } from "react";
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Alert,
   KeyboardAvoidingView,
   Platform,
   Image,
} from "react-native";
import { Colors } from "../../lib";

// Icons
import {
   ContainerBack,
   SpinLoading,
   TextInputComponent,
   LoginFacebook,
   LoginGoogle,
} from "../../components";
import { authRoutes as routes } from "../../constants/routes";
import { Singin } from "../../services/firebase/Singin";

const LoginScreen = ({ navigation }) => {
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState({ email: "", password: "" });

   const handleRegister = () => navigation.push(routes.SIGNUP);
   const handleLoginUser = async () => {
      setLoading(true);
      await Singin(user)
         .catch((e) => {
            Alert.alert("Error", e.message);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   const handleInput = (key, value) => {
      setUser((prevUser) => ({
         ...prevUser,
         [key]: value,
      }));
   };

   return (
      <ContainerBack navigation={navigation}>
         <KeyboardAvoidingView
            style={styles.fills}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={60}
         >
            {/* Titulo... */}
            <View style={styles.top}>
               <Text style={styles.top.title}>
                  Bienvenido de nuevo!, Tus Servicios al instante...
               </Text>
            </View>

            {/* Inputs... */}
            <View
               style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
               }}
            >
               <TextInputComponent
                  value={user.email}
                  onChangeText={(e) => handleInput("email", e)}
                  label="Email"
                  placeholder="Ingresa tu email"
                  autoComplete="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
               />

               <TextInputComponent
                  hide
                  value={user.password}
                  onChangeText={(e) => handleInput("password", e)}
                  label="Ingresa tu contraseña"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="password"
                  autoCapitalize="none"
               />

               <TouchableOpacity style={{ marginLeft: "auto" }}>
                  <Text style={{ color: "#040048", fontWeight: "600" }}>
                     Olvidaste la contraseña?
                  </Text>
               </TouchableOpacity>
            </View>

            {/* Iniciar sesion... */}
            <TouchableOpacity
               onPress={handleLoginUser}
               style={styles.bottom.button}
            >
               {!loading ? (
                  <Text style={styles.bottom.button.text}>Sign In</Text>
               ) : (
                  <SpinLoading />
               )}
            </TouchableOpacity>
            <View className="flex-1 mb-6 ">
               <Image
                  source={require("assets/photo-signin.jpg")}
                  className="w-full h-full"
                  resizeMode="cover"
               />
            </View>
         </KeyboardAvoidingView>

         {/* Aplicacion */}
         <View style={styles.bottom}>
            <View style={styles.lines}>
               <View style={styles.lines.line} />
               <Text style={styles.lines.text}>O Inicia Sesion con</Text>
               <View style={styles.lines.line} />
            </View>

            <View style={styles.socialMedia}>
               <LoginGoogle />
               <LoginFacebook />
            </View>
         </View>

         <View style={styles.bottom.register}>
            <Text style={{ color: Colors.secondary.DEFAULT }}>
               No tienes cuenta?
            </Text>
            <TouchableOpacity onPress={handleRegister}>
               <Text style={{ color: "#040048", fontWeight: "600" }}>
                  Registrate
               </Text>
            </TouchableOpacity>
         </View>
      </ContainerBack>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: "white",
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "85%",
      marginHorizontal: "auto",
   },
   top: {
      display: "flex",
      flexDirection: "column",
      alignItems: "left",
      title: {
         color: "#1E232C",
         fontWeight: "700",
         fontSize: 24,
      },
   },
   fills: {
      display: "flex",
      flexDirection: "column",
      gap: 48,
      input: {
         paddingVertical: 8,
         flex: 1,
      },
      marginBottom: "auto",
      paddingVertical: 32,
      flex: 1,
   },
   bottom: {
      width: "100%",
      marginHorizontal: "auto",
      gap: 24,
      marginBottom: 48,
      button: {
         width: "100%",
         height: 52,
         borderRadius: 12,
         backgroundColor: "#1E232C",
         text: {
            color: Colors.white,
            marginHorizontal: "auto",
            fontSize: 16,
            marginVertical: "auto",
         },
      },
      register: {
         display: "flex",
         flexDirection: "row",
         gap: 4,
         marginHorizontal: "auto",
      },
   },
   lines: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      line: {
         flex: 1, // Para que las líneas sean del mismo tamaño
         height: 1,
         backgroundColor: "#ccc",
      },
      text: {
         marginHorizontal: 10, // Espaciado entre el texto y las líneas
      },
   },
   socialMedia: {
      flexDirection: "row",
      width: "100%",
      gap: 12,
   },
});

export default LoginScreen;
