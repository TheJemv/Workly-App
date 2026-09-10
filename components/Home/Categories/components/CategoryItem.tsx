import { router } from "expo-router";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { HomeCategory } from "data/serviceCategories";
import { Colors } from "lib";

const CategoryItem = ({ item }: { item: HomeCategory }) => {
   const handleCategory = () => {
      router.navigate({
         pathname: "/(home)/categories/[name]",
         params: { name: item.category },
      });
   };

   return (
      <TouchableOpacity
         onPress={handleCategory}
         activeOpacity={0.8}
         style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            maxWidth: 92,
            width: 92,
            paddingHorizontal: 4,
            backgroundColor: "#fff",
            borderRadius: 12,
            justifyContent: "space-between",
            paddingVertical: 12,

            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,
            elevation: 9,
         }}
      >
         {item.count > 0 ? (
            <View
               style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  minWidth: 18,
                  height: 18,
                  paddingHorizontal: 5,
                  borderRadius: 9,
                  backgroundColor: "#eef0f6",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <Text style={{ fontSize: 10, fontWeight: "600", color: Colors.principal[400] }}>
                  {item.count > 99 ? "99+" : item.count}
               </Text>
            </View>
         ) : null}

         {item.Icon ? (
            <Image
               source={item.Icon}
               style={{ width: 110, height: 38 }}
               fadeDuration={0}
            />
         ) : (
            <View style={{ height: 38, alignItems: "center", justifyContent: "center" }}>
               <Ionicons
                  name={(item.fallbackIcon ?? "pricetags-outline") as any}
                  size={34}
                  color={Colors.principal.DEFAULT}
               />
            </View>
         )}

         <Text numberOfLines={1} className="capitalize text-text">
            {item.label}
         </Text>
      </TouchableOpacity>
   );
};

export default CategoryItem;
