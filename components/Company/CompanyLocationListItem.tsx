import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import { CompanyLocation } from "@/types/Location";
import { Colors } from "lib";

type Props = {
   location: CompanyLocation;
   onDelete: () => void;
};

export default function CompanyLocationListItem({ location, onDelete }: Props) {
   const address = [
      [location.street, location.streetNumber].filter(Boolean).join(" "),
      location.neighborhood,
      location.city,
   ]
      .filter(Boolean)
      .join(", ");

   return (
      <View
         className="bg-white rounded-2xl border border-border-soft flex-row items-center"
         style={{ padding: 14, gap: 12 }}
      >
         <View
            style={{
               width: 44,
               height: 44,
               borderRadius: 12,
               backgroundColor: Colors.principal[50],
               alignItems: "center",
               justifyContent: "center",
            }}
         >
            <Ionicons name="business-outline" size={20} color={Colors.principal.DEFAULT} />
         </View>

         <View style={{ flex: 1 }}>
            <Text className="text-dark font-semibold text-[14px]" numberOfLines={1}>
               {location.name}
            </Text>
            {address ? (
               <Text className="text-text text-[12px]" numberOfLines={2}>
                  {address}
               </Text>
            ) : null}
            {location.details ? (
               <Text className="text-text-light text-[11px]" numberOfLines={1}>
                  {location.details}
               </Text>
            ) : null}
         </View>

         <TouchableOpacity onPress={onDelete} hitSlop={10}>
            <Feather name="trash-2" size={18} color="#e53e3e" />
         </TouchableOpacity>
      </View>
   );
}
