import React, { useEffect, useState } from 'react';
import {
   StyleSheet,
   Text,
   View,
   TouchableOpacity,
   Image,
   Alert,
   KeyboardAvoidingView,
   Platform,
} from 'react-native';
import { Colors } from '../../lib';

// Icons
import GoogleIcon from '../../assets/Icons/googleIcon.png';
import {
   ContainerBack,
   SpinLoading,
   TextInputComponent,
   LoginFacebook,
   LoginGoogle
} from '../../components';
import { authRoutes as routes } from '../../constants/routes';
import { Singin } from '../../services/firebase/Singin';

import AntDesign from "@expo/vector-icons/AntDesign"


const LoginScreen = ({ navigation }) => {
   const [ loading, setLoading ] = useState(false);
   const [user, setUser] = useState({email: '', password: ''});

   const handleRegister = () => navigation.push(routes.SIGNUP);
   const handleLoginUser = async () => {
      setLoading(true)
      await Singin(user).catch(e => {
         Alert.alert("Error", e.message)
      }).finally(() => {
         setLoading(false)
      })
   };

   const handleInput = (key, value) => {
      setUser(prevUser => ({
         ...prevUser,
         [key]: value,
      }));
   };

   return (
      <ContainerBack navigation={navigation}>
         <View style={styles.top}>
            <AntDesign name="find" color="#F66" size={52} />
            <Text style={styles.top.title}>Inicia sesion ahora</Text>
            <Text style={styles.top.description}>
               Entra o registrate ahora, para poder buscar los servicios que
               nesecitas.
            </Text>
         </View>

         <KeyboardAvoidingView
            style={styles.fills}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={50}
         >
            <TextInputComponent
               value={user.email}
               onChangeText={e => handleInput("email", e)}
               label="Email"
               placeholder="email@hotmail.com"
               autoComplete="email"
               keyboardType="email-address"
               autoCapitalize="none"
            />

            <TextInputComponent
               hide
               value={user.password}
               onChangeText={e => handleInput("password", e)}
               label="Password"
               placeholder="password"
               autoComplete="password"
               autoCapitalize="none"
            />
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
               <Text style={{ color: '#040048', fontWeight: '600' }}>
                  Olvidaste la contraseña?
               </Text>
            </TouchableOpacity>
         </KeyboardAvoidingView>

         <View style={styles.bottom}>
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

            <View style={styles.bottom.socialMedia}>
               <LoginGoogle />
               <LoginFacebook />
            </View>

            <View style={styles.bottom.register}>
               <Text style={{ color: Colors.secondary.DEFAULT }}>
                  No tienes cuenta?
               </Text>
               <TouchableOpacity onPress={handleRegister}>
                  <Text style={{ color: '#040048', fontWeight: '600' }}>
                     Registrate
                  </Text>
               </TouchableOpacity>
            </View>
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
      width: '85%',
      marginHorizontal: 'auto',
   },
   top: {
      marginTop: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      marginHorizontal: 'auto',
      alignItems: 'center',
      maxWidth: '75%',
      title: {
         color: '#040048',
         fontWeight: '700',
         fontSize: 26,
      },
      description: {
         color: Colors.secondary.DEFAULT,
         textAlign: 'center',
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
   bottom: {
      width: '100%',
      marginHorizontal: 'auto',
      gap: 24,
      button: {
         width: '100%',
         height: 52,
         borderRadius: 50,
         backgroundColor: '#040048',
         text: {
            color: Colors.white,
            marginHorizontal: 'auto',
            fontSize: 16,
            marginVertical: 'auto',
         },
      },
      socialMedia: {
         width: '100%',
         display: 'flex',
         flexDirection: 'row',
         justifyContent: 'center',
         gap: 12,
         buttons: {
            borderWidth: 1,
            borderRadius: 8,
            padding: 6,
            borderColor: '#040048',
            Icon: {
               width: 32,
               height: 32,
            },
         },
      },
      register: {
         display: 'flex',
         flexDirection: 'row',
         gap: 4,
         marginHorizontal: 'auto',
      },
   },
});

export default LoginScreen;
