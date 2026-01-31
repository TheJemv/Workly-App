import type { ReactNode } from "react";
import { Pressable, View, Text } from "react-native";

type Props = {
   icon?: ReactNode;
   children?: ReactNode;
   onPress?: () => void;
};
function Buttonlink({ icon, children, onPress }: Props): JSX.Element {
   return (
      <Pressable
         className="flex flex-row items-center space-x-3 bg-white rounded-lg px-4 py-3 active:bg-white/50"
         onPress={onPress}
      >
         <View className="flex items-center justify-center w-10 h-10 rounded-full bg-dark/10">
            {icon}
         </View>
         <Text className="text-base text-dark font-medium">{children}</Text>
      </Pressable>
   );
}

export default Buttonlink