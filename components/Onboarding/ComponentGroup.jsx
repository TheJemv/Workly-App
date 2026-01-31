import { Text, View } from "react-native";

const ComponentGroup = ({ title = "Title", children }) => {
   return (
      <View className="felx flex-col" style={{ gap: 6 }}>
         <Text className="font-semibold">{title}</Text>
         <View className="flex flex-col pl-2" style={{ gap: 4 }}>
            {children}
         </View>
      </View>
   );
};

export default ComponentGroup;
