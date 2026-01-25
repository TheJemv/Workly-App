import { Colors } from "lib";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { ServiceType } from "../type";
import formatterUnit from "utils/fomatterUnit";
import { useNavigation } from "@react-navigation/native";
type Props = {
   item: ServiceType;
};

const CardService = ({ item }: Props): JSX.Element => {
   const navigation = useNavigation();
   const handleService = () => {
      navigation.navigate("service", {
         id: item.id,
      });
   };

   return (
      <TouchableOpacity onPress={handleService} className="flex flex-col items-start space-y-3 bg-white border-2 border-border rounded-xl p-2">
         <View className="flex flex-row space-x-3">
            <View className="flex items-center justify-center overflow-hidden w-[56px] h-[56px] rounded-[6px] bg-light/10">
               <Image
                  className="w-full h-full cover"
                  source={{
                     uri: item.photo,
                  }}
               />
            </View>

            <View className="flex flex-1 flex-col">
               <View className="flex flex-col space-y-[-2]">
                  <Text
                     className="text-base text-dark font-semibold"
                     numberOfLines={1}
                  >
                     {item.name}
                  </Text>
                  <Text className="text-sm text-text">{item.category}</Text>
               </View>
            </View>
         </View>

         <Text numberOfLines={3} className="text-text">
            {item.description}
         </Text>

         <Text
            style={{ paddingTop: 8, color: Colors.principal.DEFAULT }}
            className="font-bold text-principal w-full text-right"
         >
            {item.indefinite ? "Precio indefinido" : `Desde ${formatterUnit.format(item.unit_amount / 100)} ${item.currency.toUpperCase()}`}
         </Text>
      </TouchableOpacity>
   );
};

export default CardService;
