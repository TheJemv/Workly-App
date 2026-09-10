import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Contact } from "@/types/Company";
import { OpenStatus } from "utils/companySchedule";
import { Colors } from "lib";
import handleCall from "./handle-call";

type Props = {
   name?: string;
   photo?: string;
   address?: string;
   contact?: Contact;
   status?: OpenStatus | null;
};

export default function CompanyProfileHeader({ name, photo, address, contact, status }: Props) {
   const phone = contact?.phone?.trim();

   return (
      <View
         className="bg-white rounded-2xl border border-border-soft"
         style={{ padding: 16, gap: 14 }}
      >
         <View className="flex-row" style={{ gap: 14 }}>
            <Image
               source={photo ? { uri: photo } : undefined}
               style={{ width: 76, height: 76, borderRadius: 18, backgroundColor: "#eaeaea" }}
               contentFit="cover"
               transition={200}
            />

            <View style={{ flex: 1, justifyContent: "center", gap: 5 }}>
               <Text className="text-dark font-bold text-[18px]" numberOfLines={2}>
                  {name ?? ""}
               </Text>

               {address ? (
                  <View className="flex-row items-center" style={{ gap: 4 }}>
                     <Ionicons name="location-outline" size={13} color="#717171" />
                     <Text className="text-text text-[12px] flex-1" numberOfLines={1}>
                        {address}
                     </Text>
                  </View>
               ) : null}

               {status ? (
                  <View className="flex-row items-center" style={{ gap: 6 }}>
                     <View
                        style={{
                           width: 7,
                           height: 7,
                           borderRadius: 4,
                           backgroundColor: status.open ? "#22c55e" : "#c94b4b",
                        }}
                     />
                     <Text
                        className="text-[12px] font-semibold"
                        style={{ color: status.open ? "#15803d" : "#9f1239" }}
                     >
                        {status.label}
                     </Text>
                  </View>
               ) : null}
            </View>
         </View>

         {phone ? (
            <TouchableOpacity
               onPress={() => handleCall(phone)}
               activeOpacity={0.8}
               className="flex-row items-center justify-center rounded-xl border border-border-soft"
               style={{ gap: 8, paddingVertical: 11 }}
            >
               <Ionicons name="call-outline" size={16} color={Colors.principal.DEFAULT} />
               <Text className="font-semibold text-[13px]" style={{ color: Colors.principal.DEFAULT }}>
                  Llamar
               </Text>
            </TouchableOpacity>
         ) : null}
      </View>
   );
}
