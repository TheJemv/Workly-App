import { Alert, Linking } from "react-native";

const handleCall = async (phoneNumber) => {
   try {
      const url = `tel:${phoneNumber}`;
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
         Alert.alert("Error", "No se puede abrir la aplicación de llamadas.");
      } else {
         return Linking.openURL(url);
      }
   } catch (error) {
      console.error("Error al intentar hacer la llamada:", error);
   }
};

export default handleCall;
