import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { TimeOpen } from "./time-open";
import type { Time } from "../types";
import { times } from "../data";

type Props = {};
export const TimesOpen = ({}: Props): JSX.Element => {
   const [show, setShow] = useState<boolean>(false);

   const handleShow = (): void => {
      setShow(!show);
   };
   return (
      <View className="flex flex-col space-y-3">
         <View className="flex flex-row items-center space-x-2">
            <FontAwesome name="clock-o" size={20} color={Colors.buttonColor} />
            <Text className="text-base text-text font-medium">
               Horarios de la empresa
            </Text>
            <Pressable className="active:opacity-80" onPress={handleShow}>
               {show ? (
                  <FontAwesome
                     name="chevron-up"
                     size={16}
                     color={Colors.gray.DEFAULT}
                  />
               ) : (
                  <FontAwesome
                     name="chevron-down"
                     size={16}
                     color={Colors.gray.DEFAULT}
                  />
               )}
            </Pressable>
         </View>
         {show && (
            <View className="flex flex-col space-y-2 mb-3">
               {times.map((time: Time, index: number): JSX.Element => {
                  return (
                     <View key={index}>
                        <TimeOpen
                           title={time.title}
                           description={time.description}
                        />
                     </View>
                  );
               })}
            </View>
         )}
      </View>
   );
};
