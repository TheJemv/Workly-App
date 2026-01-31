import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const ComponentChipActive = () => {
   return (
      <View
         className="py-1 px-2 border-[#000]/10 bg-[#f1f5f9] shadown flex flex-row items-center"
         style={{
            borderRadius: 999,
            borderWidth: 1,
         }}
      >
         <Ionicons name="checkmark-circle" size={20} color="#32a852" />
         <Text className="text-[#32a852] pl-1 font-semibold">Habilitada</Text>
      </View>
   );
};

export default ComponentChipActive;
