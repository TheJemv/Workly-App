import {
   View,
   Text,
   Image,
   TouchableOpacity,
} from "react-native"

const PopularItem = ({ item }) => (
   <TouchableOpacity
      className="shadow-2xl"
      style={{
         display: "flex",
         flexDirection: "column",
         width: 140,
         height: 160,
         backgroundColor: "#fff",
         borderRadius: 12,

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
               uri: item.Image
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
                  uri: item.company.Image
               }}
               style={{
                  width: 28,
                  height: 28,
               }}
            />
         </View>
      </View>
      <View className="flex flex-col px-2 py-3" style={{gap: 2}}>
         <Text className="text-dark text-xs font-semibold" numberOfLines={1}>{item.name}</Text>
         <Text className="text-text/70 text-xs font-semibold" numberOfLines={1}>MXN $69.00</Text>
      </View>
   </TouchableOpacity>
)

export default PopularItem