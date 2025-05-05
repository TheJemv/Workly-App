import type { ReactNode } from "react";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type Props = {
   icon: "facebook-square" | "linkedin-square" | "phone-square" | "instagram";
   color: string;
   children?: ReactNode;
   onPress?: () => void;
};
export function ButtonIconLink({ icon, color, onPress }: Props): JSX.Element {
   return (
      <Pressable className="active:opacity-80" onPress={onPress}>
         <FontAwesome name={icon} size={24} color={color} />
      </Pressable>
   );
}
