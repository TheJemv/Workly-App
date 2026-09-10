import { View, Text } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";

import { OpenStatus } from "utils/companySchedule";

type Props = {
   name?: string;
   photo?: string;
   address?: string;
   status?: OpenStatus | null;
};

export default function CompanyProfileHeader({ name, photo, address, status }: Props) {
   return (
      <View
         className="bg-white rounded-2xl border border-border-soft"
         style={{ padding: 16 }}
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
      </View>
   );
}
