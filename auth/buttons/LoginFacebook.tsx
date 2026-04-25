import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const FacebookGoogle = () => {
   const FacebookIcon = require('assets/Icons/facebookIcon.png');

   async function onFacebookButtonPress() {
      console.log("Iniciando proceso de inicio de sesión con Facebook...");
   }

   return (
      <TouchableOpacity onPress={onFacebookButtonPress} style={styles.buttons}>
         <Image
            style={styles.Icon}
            source={FacebookIcon}
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

export default FacebookGoogle