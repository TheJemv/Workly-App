import React from 'react';
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   ImageBackground,
} from 'react-native';
import { Colors } from '../../lib';
import loginImage from '../../assets/LoginImage.jpg';
import { authRoutes as routes } from '../../constants/routes';

export default function ({ navigation }) {
   const handleSignIn = () => navigation.push(routes.LOGIN);
   const handleSignUp = () => navigation.push(routes.SIGNUP);
   return (
      <ImageBackground source={loginImage} style={styles.container}>
         <View style={styles.bottomContainer}>
            <View style={{ flex: 1 }}>
               <View style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text style={styles.bottomContainer.title}>Welcome to</Text>
                  <Text style={styles.bottomContainer.subName}>WorkIt</Text>
               </View>

               <Text style={{ color: Colors.gray.DEFAULT, marginTop: 18 }}>
                  Bienvenido a WorkIt, somos una empresa que gestiona y vende
                  tus servicios, donde como cliente puedes encontrar todos los
                  servicos, entre yaaa!
               </Text>

               <View style={styles.buttons}>
                  <TouchableOpacity
                     onPress={handleSignUp}
                     style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 50,
                        backgroundColor: '#040048',
                     }}
                  >
                     <Text
                        ext
                        style={{
                           textAlign: 'center',
                           fontSize: 18,
                           color: Colors.white,
                        }}
                     >
                        Sing Up
                     </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                     onPress={handleSignIn}
                     style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 50,
                        backgroundColor: Colors.white,
                     }}
                  >
                     <Text
                        ext
                        style={{
                           textAlign: 'center',
                           fontSize: 18,
                           color: '#040048',
                        }}
                     >
                        Sing In
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </ImageBackground>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
   },
   bottomContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 24,
      backgroundColor: Colors.white,
      height: '50%',
      borderStartStartRadius: 24,
      borderStartEndRadius: 24,
      paddingVertical: 36,

      title: {
         color: '#040048',
         fontWeight: '700',
         fontSize: 46,
      },

      subName: {
         color: '#F66',
         fontWeight: '700',
         fontSize: 46,
      },
   },

   buttons: {
      borderWidth: 1,
      borderRadius: 50,
      width: '100%',
      marginTop: 'auto',
      borderColor: '#040048',
      display: 'flex',
      flexDirection: 'row',
   },
});
