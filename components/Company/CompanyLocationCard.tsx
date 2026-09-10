import { View, Text, TouchableOpacity, Linking, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Container, CardInfo, CardContent } from "components/CardInfo";
import { Colors } from "lib";

type Location = {
   address: string;
   latitude: number;
   longitude: number;
};

export default function CompanyLocationCard({ location }: { location: Location }) {
   const openMap = () => {
      const { latitude, longitude, address } = location;
      const label = encodeURIComponent(address ?? "Ubicación");
      const url = Platform.select({
         ios: `maps://?q=${label}&ll=${latitude},${longitude}`,
         android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${label})`,
         default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      });
      Linking.openURL(url as string).catch(() => {
         Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
         );
      });
   };

   return (
      <Container>
         <CardInfo title="Ubicación" icon="map-pin" variant="heading" />
         <CardContent divided={false}>
            <View className="p-4" style={{ gap: 12 }}>
               <Text className="text-sm text-text-default leading-relaxed">
                  {location.address}
               </Text>

               <TouchableOpacity
                  onPress={openMap}
                  activeOpacity={0.8}
                  className="flex-row items-center justify-center rounded-xl"
                  style={{ gap: 8, paddingVertical: 11, backgroundColor: Colors.principal[100] }}
               >
                  <Ionicons name="navigate-outline" size={16} color={Colors.principal.DEFAULT} />
                  <Text className="font-semibold" style={{ color: Colors.principal.DEFAULT }}>
                     Ver en el mapa
                  </Text>
               </TouchableOpacity>
            </View>
         </CardContent>
      </Container>
   );
}
