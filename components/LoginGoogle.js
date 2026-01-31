import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect } from 'react'
import * as Google from "expo-auth-session/providers/google"
import GoogleIcon from '../assets/Icons/googleIcon.png';
import { ParamsAuthRequest } from '../services/firebase/GoogleProvider';

const LoginGoogle = () => {
   const [_request, response, promptAsync] = Google.useAuthRequest(ParamsAuthRequest)
   return (
      <TouchableOpacity onPress={() => promptAsync()} style={styles.buttons}>
         <Image
            style={styles.Icon}
            source={GoogleIcon}
         />
      </TouchableOpacity>
   )
}


const styles = StyleSheet.create({
   Icon: {
      width: 32,
      height: 32,
   },
   buttons: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 6,
      borderColor: '#DADADA',
      flex: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center"
   },
});

export default LoginGoogle