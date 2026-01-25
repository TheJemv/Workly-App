import { View, Text, FlatList } from "react-native";
import { CompanyType } from "./types";
import { CompanyItem } from "./components";

const CompaniesTrending = ({ data }: { data: CompanyType[] }) => {
   return (
      <View
         style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
         }}
      >
         <View
            style={{
               display: "flex",
               flexDirection: "column",
               gap: 2,
               paddingHorizontal: 12,
            }}
         >
            <Text
               className="text-dark"
               style={{ fontSize: 20, fontWeight: 600 }}
            >
               Empresas Recomendas
            </Text>
            <Text className="text-text">
               ¡Estas son las empresas que workit te recomienda!
            </Text>
         </View>

         <FlatList
            renderItem={({ item, index }) => (
               <CompanyItem item={item} key={index} />
            )}
            keyExtractor={(item) => item.id}
            data={data}
            scrollEnabled={false}
            contentContainerStyle={{
               paddingHorizontal: 12,
               gap: 12,
               flexGrow: 1,
               paddingBottom: 14,
               paddingTop: 8,
            }}
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
};

export default CompaniesTrending;
