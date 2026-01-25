import { useEffect, useLayoutEffect, useState } from "react";
import { Alert, FlatList, StatusBar, View } from "react-native";
import { getCompnaiesByIds, searchCompany } from "services/api/company.api";
import { CompanyItem } from "./components";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CompanyType } from "./types";
import { useNavigation } from "@react-navigation/native";

export default function ResultsScreen({ route }) {
   const navigation = useNavigation();
   const { query } = route.params;

   const [loading, setLoading] = useState<boolean>(false);
   const [companies, setCompanies] = useState<CompanyType[] | null>(null);

   useLayoutEffect(() => {
      navigation.setOptions({
         headerTitle: "Resultados",
      });
   }, [navigation]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            const { results } = await searchCompany(query);
            if (!results) return;
            const companiesIds = results.map((c: any): any => c.objectID);
            await getCompnaiesByIds(companiesIds).then((data) => {
               setCompanies(data.companies);
            });
         } catch (error) {
            Alert.alert("Error", error?.message);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   return (
      <View className="h-full">
         {loading || companies === null ? (
            <View className="flex pb-[70px] h-full flex-col items-center justify-center">
               <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
            </View>
         ) : (
            <FlatList
               data={companies}
               renderItem={({ item }) => <CompanyItem item={item} />}
               contentContainerStyle={{
                  paddingHorizontal: 12,
                  paddingTop: StatusBar.currentHeight,
               }}
            />
         )}
      </View>
   );
}
