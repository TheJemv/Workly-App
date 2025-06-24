import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";
import { TimeOpen } from "./time-open";

interface Schedule {
   opensAt: string;
   closesAt: string;
}

interface OpeningHour {
   monday: Schedule;
   tuesday: Schedule;
   wednesday: Schedule;
   thursday: Schedule;
   friday: Schedule;
   saturday: Schedule;
   sunday: Schedule;
}

interface Props {
   openingHours: OpeningHour;
}

export const TimesOpen = ({ openingHours }: Props): JSX.Element => {
   const [show, setShow] = useState<boolean>(false);

   const handleShow = (): void => {
      setShow(!show);
   };

   const formatHour = (hour: string): string => {
      const [h, m] = hour.split(":").map(Number);
      const period = h >= 12 ? "p.m." : "a.m.";
      const hour12 = h % 12 === 0 ? 12 : h % 12;
      return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
   };

   const getScheduleDescription = (
      opensAt: string,
      closesAt: string
   ): string => {
      if (opensAt === "00:00" && closesAt === "00:00") {
         return "Cerrado";
      }
      return `${formatHour(opensAt)} - ${formatHour(closesAt)}`;
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
               <TimeOpen
                  title="Lunes"
                  description={getScheduleDescription(
                     openingHours.monday.opensAt,
                     openingHours.monday.closesAt
                  )}
               />
               <TimeOpen
                  title="Martes"
                  description={getScheduleDescription(
                     openingHours.tuesday.opensAt,
                     openingHours.tuesday.closesAt
                  )}
               />
               <TimeOpen
                  title="Miércoles"
                  description={getScheduleDescription(
                     openingHours.wednesday.opensAt,
                     openingHours.wednesday.closesAt
                  )}
               />
               <TimeOpen
                  title="Jueves"
                  description={getScheduleDescription(
                     openingHours.thursday.opensAt,
                     openingHours.thursday.closesAt
                  )}
               />
               <TimeOpen
                  title="Viernes"
                  description={getScheduleDescription(
                     openingHours.friday.opensAt,
                     openingHours.friday.closesAt
                  )}
               />
               <TimeOpen
                  title="Sábado"
                  description={getScheduleDescription(
                     openingHours.saturday.opensAt,
                     openingHours.saturday.closesAt
                  )}
               />
               <TimeOpen
                  title="Domingo"
                  description={getScheduleDescription(
                     openingHours.sunday.opensAt,
                     openingHours.sunday.closesAt
                  )}
               />
            </View>
         )}
      </View>
   );
};
