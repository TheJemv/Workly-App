import { Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { Service as ServiceType } from "@/types/Service";
import formatterUnit from "utils/fomatterUnit";
import { router } from "expo-router";
import { Colors } from "lib";

const CARD_WIDTH = 150;
const IMAGE_HEIGHT = 112;

export default function ServiceItem({ service }: { service: ServiceType }) {
   const handleService = () => {
      router.navigate({
         pathname: "/(home)/service/[id]",
         params: { id: service.id },
      });
   };

   const price = service.indefinite
      ? "Por consumo"
      : `${formatterUnit.format(service.unit_amount / 100)} ${(service.currency ?? "").toUpperCase()}`.trim();

   return (
      <TouchableOpacity
         onPress={handleService}
         activeOpacity={0.85}
         style={{ width: CARD_WIDTH }}
      >
         <View
            className="bg-border-soft"
            style={{
               width: "100%",
               height: IMAGE_HEIGHT,
               borderRadius: 12,
               overflow: "hidden",
            }}
         >
            <Image
               style={{ width: "100%", height: "100%" }}
               source={{ uri: service.photo }}
               contentFit="cover"
               transition={200}
            />
         </View>

         <View style={{ marginTop: 6, gap: 2 }}>
            <Text numberOfLines={1} className="text-dark text-[13px] font-medium">
               {service.name}
            </Text>
            <Text
               numberOfLines={1}
               className="text-[12px] font-semibold"
               style={{ color: Colors.principal.DEFAULT }}
            >
               {price}
            </Text>
         </View>
      </TouchableOpacity>
   );
}
