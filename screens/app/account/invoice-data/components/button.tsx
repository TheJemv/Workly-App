import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

type Props = {
   icon?: "address-book" | "save";
   children?: ReactNode;
   onPress?: () => void;
};
export function Button({ icon, children, onPress }: Props): JSX.Element {
   return (
      <Pressable
         className="flex flex-row items-center justify-center space-x-2 flex-1 px-4 py-3 rounded-xl bg-primary active:bg-primary/80"
         onPress={onPress}
      >
         <FontAwesome name={icon} size={20} color={Colors.white} />
         <Text className="text-base text-white text-center font-medium">
            {children}
         </Text>
      </Pressable>
   );
}
