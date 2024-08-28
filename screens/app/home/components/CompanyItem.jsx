import { Image, View, Text, TouchableOpacity } from "react-native";

const CompanyItem = ({ item }) => (
   <TouchableOpacity
      style={{
         display: "flex",
         flexDirection: "row",
         gap: 12,
         padding: 6,
         backgroundColor: "#fff",
         borderRadius: 12,

         // shadow
         shadowColor: "#000",
         shadowOffset: {
            width: 0,
            height: 2,
         },
         shadowOpacity: 0.25,
         shadowRadius: 3.84,
         elevation: 9,

      }}
   >
      <View
         style={{
            width: 140,
            height: 90,
            borderRadius: 8,
            overflow: "hidden",
         }}
      >
         <Image
            source={{ uri: item.image }}
            style={{
               width: "100%",
               height: "100%",
            }}
         />
         <View
            style={{
               position: "absolute",
               color: "#fff",
               padding: 3,
               fontSize: 10,
               overflow: "hidden",
               fontWeight: 600,
               borderBottomEndRadius: 8,
               display: "flex",
               flexDirection: "row",
               alignItems: "center",
               gap: 2,
               paddingHorizontal: 4,
            }}
            className="bg-darkmode-border"
         >
            <Image
               source={require("assets/Icons/Home/star.png")}
               style={{
                  width: 10,
                  height: 10,
               }}
            />
            <Text className="text-white font-semibold" style={{fontSize:10,fontWeight:500}} numberOfLines={1}>WorkIt Top</Text>
         </View>
      </View>
      <View className="flex-1 flex flex-col">
         <Text numberOfLines={1} className="text-dark font-semibold text-base pb-1">BurgerKing</Text>
         <Text className="text-text">En Matamoros Tamaulipas</Text>
         <Text className="text-text">A 1.2 km de ti</Text>
         <Text className="text-text">Hasta 500$ MXN</Text>
      </View>
   </TouchableOpacity>
);
export default CompanyItem;