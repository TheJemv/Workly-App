import { View, Text, FlatList, Image } from "react-native";
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


         {data.length === 0 ? (
            <View
               style={{
                  height: 160,
                  marginTop: 4,
                  marginBottom: 14,
                  elevation: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: -12
               }}
            >
               <Image
                  source={require("assets/Empty/Company.png")}
                  className="w-[120px] h-[100px]"
                  resizeMode="contain"
               />
               <Text className="text-gray-500 text-base text-center">
                  No hay empresas populares.
               </Text>
            </View>
         ) : (
            <FlatList
               renderItem={
                  ({ item, index }) => (
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
         )}

      </View>
   );
};

export default CompaniesTrending;
