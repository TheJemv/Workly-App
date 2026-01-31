import { ReactNode } from "react";
import { Text, View } from "react-native";

interface Props {
   title?: string
   value?: string | ReactNode
}

const LabelComponent = ({ title = "Title", value = "Value" }: Props) => {
   return (
      <View className="flex flex-row items-center justify-between relative">
         <Text className=" text-[15px] text-[#6B6C69]">{title}</Text>
         {typeof value === "string" ? (
            <Text className="font-semibold text-[#323232] text-[15px]">
               {value}
            </Text>
         ) : (
            value
         )}
      </View>
   );
};

export default LabelComponent;
