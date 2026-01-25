import { Linking, Alert } from "react-native";

const handleOpenLink = (url) => async () => {
   try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
         // Alert.alert(
         //    "Error",
         //    "No se puede abrir la aplicación."
         // );
      } else {
         return Linking.openURL(url);
      }
   } catch (error) {
      console.error("Error al intentar hacer la llamada:", error);
   }
};

export default handleOpenLink;
