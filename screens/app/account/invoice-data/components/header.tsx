import type { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
   children?: ReactNode;
};
export function Header({ children }: Props): JSX.Element {
   return (
      <View className="mx-3 pt-2 pb-5 border-b-2 border-b-light/25">
         <Text className="text-xl text-primary font-semibold">{children}</Text>
      </View>
   );
}
