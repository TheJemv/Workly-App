import { StyleSheet, TouchableOpacity, Image } from "react-native";
import React, { useEffect } from "react";
import * as Facebook from "expo-auth-session/providers/facebook";
import { ResponseType } from "expo-auth-session";
import FacebookeIcon from "../assets/Icons/facebookIcon.png";
import auth, { FacebookAuthProvider } from "@react-native-firebase/auth";

const LoginFacebook = () => {
   const [_request, response, promptAsync] = Facebook.useAuthRequest({
      responseType: ResponseType.Token,
      clientId: "1543934623185040",
   });

   useEffect(() => {
      if (response?.type === "success") {
         const { access_token } = response.params;
         const credential = FacebookAuthProvider.credential(access_token);
         auth().signInWithCredential(credential);
      }
   }, [response]);

   return (
      <TouchableOpacity onPress={() => promptAsync()} style={styles.buttons}>
         <Image style={styles.Icon} source={FacebookeIcon} />
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   Icon: {
      width: 32,
      height: 32,
   },
   buttons: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 6,
      borderColor: "#DADADA",
      flex: 1,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
   },
});

export default LoginFacebook;
