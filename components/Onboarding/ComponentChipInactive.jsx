import { Text, View } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";

const ComponentChipInactive = () => {
   return (
      <View
         className="py-1 px-2 border-[#000]/10 bg-[#f1f5f9] shadown flex flex-row items-center"
         style={{
            borderRadius: 999,
            borderWidth: 1,
         }}
      >
         <Octicons name="x-circle-fill" size={20} color="#F31260" />
         <Text className="text-[#F31260] pl-1 font-semibold">Restringida</Text>
      </View>
   );
};

export default ComponentChipInactive;
