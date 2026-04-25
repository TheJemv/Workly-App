import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getAuth, GoogleAuthProvider, signInWithCredential } from '@react-native-firebase/auth';

const LoginGoogle = () => {
   const GoogleIcon = require('assets/Icons/googleIcon.png');

   async function onGoogleButtonPress() {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      let idToken = signInResult.data?.idToken;
      if (!idToken) {
         idToken = signInResult.idToken;
      }
      if (!idToken) return;

      const googleCredential = GoogleAuthProvider.credential(idToken);
      return signInWithCredential(getAuth(), googleCredential);
   }

   return (
      <TouchableOpacity onPress={onGoogleButtonPress} style={styles.buttons}>
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