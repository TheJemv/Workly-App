import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   KeyboardAvoidingView,
   Platform,
   Alert,
   Keyboard,
} from 'react-native';
import { Checkbox } from "expo-checkbox"
import React, { useState, useEffect } from 'react';
import { Colors } from '../../lib';
import {
   TextInputComponent,
   ContainerBack,
   SpinLoading,
} from '../../components';
import { authRoutes as routes } from '../../constants/routes';
import { Register } from "../../services/firebase/Register";
import { registerSchema } from "../../schemas/auth.schema";

const RegisterScreen = ({ navigation }) => {
   const [loading, setLoading] = useState(false);
   const [errors, setErrors] = useState({});

   const handleLogin = () => navigation.push(routes.LOGIN);

   const [user, setUser] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
   });

   const handleInput = (key, value) => {
      if (key === 'terms') {
         setUser(prevUser => ({
            ...prevUser,
            [key]: value,
         }));
         return;
      }

      let trimmedValue = value.trim();
      if (key == 'email') {
         trimmedValue = trimmedValue.toLowerCase();
      }

      setUser(prevUser => ({
         ...prevUser,
         [key]: trimmedValue,
      }));

      // Limpiar error del campo cuando el usuario empieza a escribir
      if (errors[key]) {
         setErrors(prev => ({
            ...prev,
            [key]: undefined
         }));
      }
   };

   const validateForm = () => {
      try {
         registerSchema.parse(user);
         setErrors({});
         return true;
      } catch (error) {
         if (error.errors) {
            const formattedErrors = {};
            error.errors.forEach(err => {
               formattedErrors[err.path[0]] = err.message;
            });
            setErrors(formattedErrors);
         }
         return false;
      }
   };

   const handleRegisterUser = async () => {
      // Cerrar teclado
      Keyboard.dismiss();

      // Validar formulario
      if (!validateForm()) {
         const firstError = Object.values(errors)[0];
         Alert.alert("Error de validación", firstError || "Por favor corrige los errores");
         return;
      }

      // Validar aceptación de términos
      if (!user.terms) {
         Alert.alert("Error", "Debes aceptar los términos y condiciones para continuar.");
         return;
      }

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
         <View style={styles.container}>
            {/* Titulo... */}
            <View style={styles.top}>
               <Text style={styles.top.title}>
                  Bienvenido de nuevo!, Tus Servicios al instante...
               </Text>
            </View>

            <KeyboardAvoidingView
               style={styles.fills}
               behavior={Platform.OS === 'ios' ? 'padding' : undefined}
               keyboardVerticalOffset={100}
            >
               <View
                  style={{
                     display: "flex",
                     flexDirection: "column",
                     gap: 12
                  }}
               >
                  <View>
                     <TextInputComponent
                        value={user.email}
                        onChangeText={e => handleInput('email', e)}
                        label="Email"
                        placeholder="email@hotmail.com"
                        autoComplete="email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                     />
                     {errors.email && (
                        <Text style={styles.errorText}>{errors.email}</Text>
                     )}
                  </View>

                  <View>
                     <TextInputComponent
                        hide
                        value={user.password}
                        onChangeText={e => handleInput('password', e)}
                        label="Password"
                        placeholder="password"
                        autoComplete="password"
                        autoCapitalize="none"
                     />
                     {errors.password && (
                        <Text style={styles.errorText}>{errors.password}</Text>
                     )}
                  </View>

                  <View>
                     <TextInputComponent
                        hide
                        value={user.confirmPassword}
                        onChangeText={e => handleInput('confirmPassword', e)}
                        label="Confirm Password"
                        placeholder="password"
                        autoComplete="password"
                        autoCapitalize="none"
                     />
                     {errors.confirmPassword && (
                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                     )}
                  </View>

                  {/* Check point */}
                  <View className='flex flex-row items-center gap-x-2'>
                     <Checkbox
                        value={user.terms}
                        onValueChange={(val) => {
                           handleInput('terms', val);
                        }}
                        color={Colors.principal.DEFAULT}
                     />

                     <View className='flex flex-row items-center'>
                        <Text>Acepto los </Text>
                        <TouchableOpacity>
                           <Text style={{ color: '#040048', fontWeight: '600' }} onPress={() => {
                              navigation.navigate(routes.TERMS);
                           }}>
                              Terminos y Condiciones
                           </Text>
                        </TouchableOpacity>
                     </View>
                  </View>
               </View>

               <View
                  style={{
                     display: 'flex',
                     flexDirection: 'column',
                     gap: 8,
                  }}
               >
                  <View style={styles.bottom}>
                     <TouchableOpacity
                        onPress={handleRegisterUser}
                        style={styles.bottom.button}
                        disabled={loading}
                     >
                        {!loading ? (
                           <Text style={styles.bottom.button.text}>Sign Up</Text>
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
                        <Text style={{ color: '#040048', fontWeight: '600' }}>
                           Inicia Sesion
                        </Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </KeyboardAvoidingView>
         </View>
      </ContainerBack>
   );
};

const styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
      marginHorizontal: 'auto',
      height: '100%',
      marginVertical: 32,
   },

   top: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      title: {
         color: '#1E232C',
         fontWeight: '700',
         fontSize: 24,
      },
   },

   fills: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      input: {
         paddingVertical: 8,
         flex: 1,
      },
   },

   errorText: {
      color: '#EF4444',
      fontSize: 12,
      marginTop: 4,
      marginLeft: 4,
   },

   bottom: {
      width: '100%',
      marginHorizontal: 'auto',
      gap: 24,
      button: {
         width: '100%',
         height: 52,
         borderRadius: 12,
         backgroundColor: '#1E232C',
         borderColor: '#1E232C',
         borderWidth: 2,
         text: {
            color: Colors.white,
            marginHorizontal: 'auto',
            fontSize: 16,
            marginVertical: 'auto',
         },
      },

      login: {
         display: 'flex',
         flexDirection: 'row',
         gap: 4,
         marginHorizontal: 'auto',
      },
   },
});

export default RegisterScreen;