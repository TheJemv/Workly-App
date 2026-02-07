import { View, Text, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import { ServiceType } from "../types";
import formatterUnit from "utils/fomatterUnit";
import { router } from "expo-router";


const PopularItem = ({ item }: { item: ServiceType }) => {
   const { width, height } = useWindowDimensions()
   const handleService = () => {
      router.navigate({
         pathname: '/(home)/service/[id]',
         params: { id: item.id }
      })
   };
   return (
      <TouchableOpacity
         onPress={handleService}
         className="shadow-2xl"
         style={{
            display: "flex",
            flexDirection: "column",
            width: ((width - 32 - 16) / 2),
            height: 190,
            backgroundColor: "#fff",
            borderRadius: 12,
            gap: 0,

            shadowColor: "#000",
            shadowOffset: {
               width: 0,
               height: 2,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
         }}
      >
         <View className="flex-1 overflow-hidden rounded-t-lg">
            <Image
               source={{
                  uri: item.photo,
               }}
               style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
               }}
            />

            <View
               style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "#fff",
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <Image
                  source={{
                     uri: item.company.profile.photo,
                  }}
                  style={{
                     width: 34,
                     height: 34,
                     borderRadius: 6,
                  }}
               />
            </View>
         </View>

         <View className="flex flex-col px-2 py-2" style={{ gap: 2 }}>
            <Text className="text-dark text-xs font-semibold" numberOfLines={1}>
               {item.name}
            </Text>
            <Text
               className="text-text/70 text-xs uppercase font-semibold"
               numberOfLines={1}
            >
               {item.indefinite ? "Pago por Consumo" : `${item.currency} ${formatterUnit.format(item.unit_amount / 100)}`}
            </Text>
         </View>
      </TouchableOpacity>
   );
};

export default PopularItem;
