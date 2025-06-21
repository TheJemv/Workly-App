import { useEffect, useState, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import CompanyItem from "./CompanyItem";
import { getCompaniesRecommended } from "services/api/company.api";
import { AuthContext } from "context/AuthContext";
import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";

const Companies = () => {
   const { token } = useContext(AuthContext);
   const [loading, setLoading] = useState(true);
   const [dataCompanies, setData] = useState([]);

   useEffect(() => {
      setLoading(true);
      getCompaniesRecommended(token)
         .then((data) => {
            if (data?.companies) {
               setData(data.companies);
            }
         })
         .finally(() => {
            setLoading(false);
         });
   }, []);

   return (
      <View
         style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
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

         {loading && !dataCompanies.length ? (
            <View className="flex flex-col items-center justify-center">
               <SpinLoading size={24} color={Colors.principal.DEFAULT} />
            </View>
         ) : (
            <FlatList
               renderItem={({ item, index }) => (
                  <CompanyItem item={item} key={index} />
               )}
               keyExtractor={(item) => item.id}
               data={dataCompanies}
               scrollEnabled={false}
               contentContainerStyle={{
                  gap: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  paddingBottom: 82,
               }}
               ListEmptyComponent={() => (
                  <View className="flex items-center justify-center flex-1">
                     <Text className="text-text">
                        No hay empresas recomendadas
                     </Text>
                  </View>
               )}
            />
         )}
      </View>
   );
};

export default Companies;
