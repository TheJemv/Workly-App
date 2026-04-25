import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

import { appleAuth } from "@invertase/react-native-apple-authentication"
import { AppleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';

const LoginApple = () => {
   if (!appleAuth.isSupported) return null;

   const AppleIcon = require('assets/Icons/appleIcon.png');
   async function onAppleButtonPress() {
      const appleAuthRequestResponse = await appleAuth.performRequest({
         requestedOperation: appleAuth.Operation.LOGIN,
         requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      })

      if (!appleAuthRequestResponse.identityToken) {
         throw new Error('Apple Sign-In failed - no identify token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = AppleAuthProvider.credential(identityToken, nonce);

      // Sign in with the credential
      return signInWithCredential(getAuth(), appleCredential);
   }

   return (
      <TouchableOpacity onPress={onAppleButtonPress} style={styles.buttons}>
         <Image
            style={styles.Icon}
            source={AppleIcon}
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

export default LoginApple