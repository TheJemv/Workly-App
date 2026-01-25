import { Text, View } from "react-native";

const LabelComponent = ({ title = "Title", value = "Value" }) => {
   return (
      <View className="flex flex-row items-center justify-between block relative">
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
