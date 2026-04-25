import { View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

type Props = {
   icon: "file-text" | "credit-card" | "check" | "dropbox" | "bus" | "times" | "clock-o" | "check-circle" | "times-circle";
   title: string;
   description: string;
   completed?: boolean;
   current?: boolean;
   cancelled?: boolean;
};

export function StepTrack({ icon, title, description, completed, current, cancelled }: Props): JSX.Element {
   const dotColor = cancelled
      ? "bg-red-500"
      : completed || current
         ? "bg-dark"
         : "bg-light";

   const lineColor = cancelled
      ? "bg-red-300"
      : completed
         ? "bg-dark"
         : "bg-light/50";

   const iconBg = cancelled
      ? "bg-red-500"
      : current
         ? "bg-white border-2 border-dark"
         : completed
            ? "bg-dark"
            : "bg-light/50";

   const iconColor = cancelled
      ? Colors.white
      : current
         ? Colors.principal.DEFAULT
         : completed
            ? Colors.white
            : Colors.white;

   const isActive = completed || current || cancelled;

   return (
      <View className="flex flex-row items-center space-x-4">
         {/* Línea y punto */}
         <View className="flex flex-col items-center">
            <View className={`w-3 h-3 rounded-full ${dotColor}`} />
            <View className={`w-1 flex-1 min-h-[40px] ${lineColor}`} />
         </View>

         {/* Ícono */}
         <View className={`flex items-center justify-center w-10 h-10 rounded-full ${iconBg}`}>
            <FontAwesome name={icon} size={20} color={iconColor} />
         </View>

         {/* Texto */}
         <View className="flex flex-1 flex-col space-y-0.5 pb-5">
            <Text className={`text-base font-bold ${isActive ? (cancelled ? "text-red-500" : "text-dark") : "text-dark/50"}`}>
               {title}
            </Text>
            <Text className={`text-sm font-medium ${isActive ? (cancelled ? "text-red-400" : "text-text") : "text-text/50"}`}>
               {description}
            </Text>
         </View>
      </View>
   );
}