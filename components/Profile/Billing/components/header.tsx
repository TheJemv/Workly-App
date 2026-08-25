import type { ReactNode, JSX } from "react";
import { View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Colors } from "lib";

type Props = {
   children?: ReactNode;
   onBack?: () => void;
};
export function Header({ children, onBack }: Props): JSX.Element {
   return (
      <View className="flex flex-row items-center space-x-4 mx-3 pt-2 pb-5 border-b-2 border-b-light/25">
         <FontAwesome
            name="arrow-left"
            size={20}
            color={Colors.principal.DEFAULT}
            onPress={onBack}
         />
         <Text className="text-xl text-primary font-semibold">{children}</Text>
      </View>
   );
}
