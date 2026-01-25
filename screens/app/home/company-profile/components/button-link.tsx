import type { ReactNode } from "react";
import { Pressable } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type IconKey = "facebook" | "linkedin" | "phone" | "instagram"; // ✅ Corregido: "linkedin"

type Props = {
   icon: IconKey;
   onPress?: () => void;
};

const dataIconMap = {
   facebook: "facebook-square",
   linkedin: "linkedin-square",
   phone: "phone-square",
   instagram: "instagram",
} as const;

const dataColorMap = {
   facebook: "#3b5998",
   linkedin: "#0077b5",
   phone: "#34c759",
   instagram: "#C13584",
} as const;

export function ButtonIconLink({ icon, onPress }: Props): JSX.Element {
   return (
      <Pressable className="active:opacity-80" onPress={onPress}>
         <FontAwesome
            name={dataIconMap[icon]}
            size={32}
            color={dataColorMap[icon]}
         />
      </Pressable>
   );
}