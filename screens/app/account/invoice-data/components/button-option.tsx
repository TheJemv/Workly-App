import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

type Props = {
   icon?: "pencil" | "trash";
   children?: ReactNode;
   onPress?: () => void;
};
export function ButtonOption({ icon, children, onPress }: Props): JSX.Element {
   return (
      <Pressable
         className="flex flex-row items-center justify-center space-x-2 flex-1 px-4 py-2 border border-light/25 active:bg-light/10"
         onPress={onPress}
      >
         <FontAwesome name={icon} size={20} color={Colors.principal.DEFAULT} />
         <Text className="text-base text-primary font-medium">{children}</Text>
      </Pressable>
   );
}
