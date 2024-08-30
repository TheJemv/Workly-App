import type { ReactNode } from "react";
import { View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

type Props = {
   icon: "file-text" | "credit-card" | "check" | "dropbox" | "bus";
   title: string;
   description: string;
   stepProcess?: boolean;
   stepSelected?: boolean;
};
export function StepTrack({
   icon,
   title,
   description,
   stepProcess,
   stepSelected,
}: Props): JSX.Element {
   return (
      <View className="flex flex-row items-center space-x-4">
         <View className="flex flex-col items-center">
            {stepProcess && (
               <>
                  <View className="w-3 h-3 rounded-full bg-white border-2 border-dark" />
                  <View className="w-1 flex-1 bg-dark" />
               </>
            )}
            {stepSelected && (
               <>
                  <View className="w-3 h-3 rounded-full bg-dark" />
                  <View className="w-1 flex-1 bg-light/50" />
               </>
            )}
            {!stepSelected && !stepProcess && (
               <>
                  <View className="w-3 h-3 rounded-full bg-light" />
                  <View className="w-1 flex-1 bg-light/50" />
               </>
            )}
         </View>
         {stepProcess && (
            <View className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-dark">
               <FontAwesome
                  name={icon}
                  size={20}
                  color={Colors.principal.DEFAULT}
               />
            </View>
         )}
         {stepSelected && (
            <View className="flex items-center justify-center w-10 h-10 rounded-full bg-dark">
               <FontAwesome name={icon} size={20} color={Colors.white} />
            </View>
         )}
         {!stepSelected && !stepProcess && (
            <View className="flex items-center justify-center w-10 h-10 rounded-full bg-light/50">
               <FontAwesome name={icon} size={20} color={Colors.white} />
            </View>
         )}
         <View className="flex flex-1 flex-col space-y-0.5 pb-5">
            {!stepSelected && !stepProcess ? (
               <>
                  <Text className="text-base text-dark/50 font-bold">
                     {title}
                  </Text>
                  <Text className="text-sm text-text/50 font-medium">
                     {description}
                  </Text>
               </>
            ) : (
               <>
                  <Text className="text-base text-dark font-bold">{title}</Text>
                  <Text className="text-sm text-text font-medium">
                     {description}
                  </Text>
               </>
            )}
         </View>
      </View>
   );
}
