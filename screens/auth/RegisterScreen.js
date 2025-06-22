import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../../lib";
import {
   TextInputComponent,
   ContainerBack,
   SpinLoading,
} from "../../components";
import { authRoutes as routes } from "../../constants/routes";
import { Register } from "../../services/firebase/Register";

const RegisterScreen = ({ navigation }) => {
   const [loading, setLoading] = useState(false);
   const handleLogin = () => navigation.push(routes.LOGIN);
   const [user, setUser] = useState({
      email: "",
      password: "",
      confirmPassword: "",
   });

   const handleInput = (key, value) => {
      setUser((prevUser) => ({
         ...prevUser,
         [key]: value,
      }));
   };

   const handleRegisterUser = async () => {
      setLoading(true);
      await Register(user)
         .catch((e) => {
            Alert.alert("Error", e.message);
         })
         .finally(() => {
            setLoading(false);
         });
   };

   return (
      <ContainerBack navigation={navigation}>
         <KeyboardAwareScrollView
            style={{
               flex: 1,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.container}>
               <View style={styles.fills}>
                  {/* Titulo... */}
                  <View style={styles.top}>
                     <Text style={styles.top.title}>
                        Bienvenido de nuevo!, Tus Servicios al instante...
                     </Text>
                  </View>
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
                        placeholder="email@hotmail.com"
                        autoComplete="email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                     />

                     <TextInputComponent
                        hide
                        value={user.password}
                        onChangeText={(e) => handleInput("password", e)}
                        label="Password"
                        placeholder="password"
                        autoComplete="password"
                        autoCapitalize="none"
                     />

                     <TextInputComponent
                        hide
                        value={user.confirmPassword}
                        onChangeText={(e) => handleInput("confirmPassword", e)}
                        label="Confirm Password"
                        placeholder="password"
                        autoComplete="password"
                        autoCapitalize="none"
                     />
                  </View>

                  <View
                     style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                     }}
                  >
                     <View style={styles.bottom}>
                        <TouchableOpacity
                           onPress={handleRegisterUser}
                           style={styles.bottom.button}
                        >
                           {!loading ? (
                              <Text style={styles.bottom.button.text}>
                                 Sign Up
                              </Text>
                           ) : (
                              <SpinLoading />
                           )}
                        </TouchableOpacity>
                     </View>

                     <View style={styles.bottom.login}>
                        <Text style={{ color: Colors.secondary.DEFAULT }}>
                           Ya tienes cuenta?
                        </Text>
                        <TouchableOpacity onPress={handleLogin}>
                           <Text
                              style={{ color: "#040048", fontWeight: "600" }}
                           >
                              Inicia Sesion
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>
            </View>
         </KeyboardAwareScrollView>
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
      width: "100%",
      marginHorizontal: "auto",
      height: "100%",
      marginVertical: 32,
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
      gap: 24,
      input: {
         paddingVertical: 8,
         flex: 1,
      },
   },

   bottom: {
      width: "100%",
      marginHorizontal: "auto",
      gap: 24,
      button: {
         width: "100%",
         height: 52,
         borderRadius: 12,
         backgroundColor: "#1E232C",
         borderColor: "#1E232C",
         borderWidth: 2,
         text: {
            color: Colors.white,
            marginHorizontal: "auto",
            fontSize: 16,
            marginVertical: "auto",
         },
      },

      login: {
         display: "flex",
         flexDirection: "row",
         gap: 4,
         marginHorizontal: "auto",
      },
   },
});

export default RegisterScreen;
