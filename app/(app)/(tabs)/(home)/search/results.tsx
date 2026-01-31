import { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, StatusBar, View } from "react-native";
import { getCompnaiesByIds, searchCompany } from "services/api/company.api";
import { CompanyItem } from "components/Search";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Company as CompanyType } from "@/types/Company";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResultsScreen() {
    const params = useLocalSearchParams()
    const { query } = params;

    const [loading, setLoading] = useState<boolean>(false);
    const [companies, setCompanies] = useState<CompanyType[] | null>(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const { results } = await searchCompany(query as string);
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
        loading || companies === null ? (
            <ScrollView className="h-full flex-1">
                <FlatList
                    scrollEnabled={false}
                    data={companies}
                    renderItem={({ item }) => <CompanyItem item={item} />}
                    contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingTop: StatusBar.currentHeight,
                        flex: 1
                    }}
                />
            </ScrollView>
        ) : (
            <View className="fle flex-1 pb-[70px] h-full flex-col items-center justify-center">
                <FontAwesome name="hourglass-end" color={"#B1B1B4"} size={52} />
            </View>
        )
    );
}
