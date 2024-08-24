import type { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
   title?: string;
   children?: ReactNode;
};
export function DetailInfo({ title, children }: Props): JSX.Element {
   return (
      <View className="flex flex-row items-center space-x-1 py-0.5">
         <Text className="text-base text-primary font-semibold">{title}</Text>
         <Text className="text-base text-text font-medium">{children}</Text>
      </View>
   );
}
