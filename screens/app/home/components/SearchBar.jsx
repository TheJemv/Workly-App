import {
   View,
   Text,
   TouchableOpacity,
} from "react-native";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

const SearchBar = () => {
   const navigation = useNavigation();
   const handleNavigate = () => {
      navigation.navigate("search");
   };

   return (
      <TouchableOpacity
         onPress={handleNavigate}
         style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            paddingHorizontal: 12,

            // Shadow
            shadowColor: "#000",
            shadowOffset: {
               width: 0,
               height: 4,
            },
            shadowOpacity: 0.32,
            shadowRadius: 5.46,

            elevation: 9,
         }}
      >
         <View
            style={{
               backgroundColor: "#E3E3E4",
               paddingHorizontal: 8,
               borderRadius: 8,
               paddingVertical: 12,
               display: "flex",
               flexDirection: "row",
               gap: 8,
               alignItems: "center",
            }}
         >
            <FontAwesome
               name="search"
               size={18}
               color={"#00000050"}
            />
            <Text
               style={{
                  fontSize: 16,
                  fontWeight: 500,
                  flex: 1,
                  color: "#00000050",
               }}
            >buscar un servicio...</Text>
         </View>
      </TouchableOpacity>
   )
};

export default SearchBar;
