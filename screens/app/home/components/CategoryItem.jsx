import {
   Image,
   Text,
   TouchableOpacity,
} from "react-native"


const CategoryItem = ({ item }) => (
   <TouchableOpacity
      style={{
         display: "flex",
         flexDirection: "column",
         alignItems: "center",
         gap: 12,
         maxWidth: 92,
         width: 92,
         paddingHorizontal: 4,
         backgroundColor: "#fff",
         borderRadius: 12,
         justifyContent: "space-between",
         paddingVertical: 12,

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
      <Image
         source={item.Icon}
         style={{
            width: 38,
            height: 38,
         }}
      />
      <Text
         numberOfLines={1}
         className="capitalize text-text"
      >{item.label}</Text>
   </TouchableOpacity>
)

export default CategoryItem