import { Linking, Platform, Alert } from "react-native"

type ReginModel = {
   latitude: Number,
   longitude: Number
}

export const getMap = async (region: ReginModel, label: String) => {
   let url = '';

   if (Platform.OS === 'ios') {
      // En iOS, abre la aplicación de mapas predeterminada
      url = `maps:0,0?q=${region.latitude},${region.longitude}(${label})`;
   } else {
      // En Android, abre la aplicación de mapas predeterminada
      url = `geo:${region.latitude},${region.longitude}?q=${region.latitude},${region.longitude}(${label})`;
   }

   const supported = await Linking.canOpenURL(url);

   if (supported) {
      await Linking.openURL(url);
   } else {
      Alert.alert('Error', 'No se puede abrir una aplicación de mapas en este dispositivo.');
   }
}