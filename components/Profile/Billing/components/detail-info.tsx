import type { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
   title?: string;
   children?: ReactNode;
};

export function DetailInfo({ title, children }: Props) {
   return (
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 2, flex: 1 }}>
         <Text style={{ fontWeight: '600', fontSize: 16, color: '#364670' }}>
            {title}
         </Text>
         <Text
            style={{ fontWeight: '400', fontSize: 16, flex: 1, marginLeft: 4 }}
            numberOfLines={1}
            ellipsizeMode="tail"
         >
            {children}
         </Text>
      </View>
   );
}