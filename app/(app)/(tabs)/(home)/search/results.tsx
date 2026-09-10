import { useEffect, useState } from "react";
import { Alert, FlatList, RefreshControl, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { getCompnaiesByIds, searchCompany } from "services/api/company.api";
import { getUserMessage } from "services/api/errors";
import { CompanyItem, ResultsEmpty, ResultsSkeleton } from "components/Search";
import { Company as CompanyType } from "@/types/Company";
import { COLOR_BACKGROUND } from "constants/index";

export default function ResultsScreen() {
    const { query } = useLocalSearchParams<{ query?: string }>();

    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [companies, setCompanies] = useState<CompanyType[]>([]);

    const fetchData = async () => {
        try {
            const { results } = await searchCompany((query as string) ?? "");
            if (!results?.length) {
                setCompanies([]);
                return;
            }
            const companiesIds = results.map((c: any) => c.objectID);
            const data = await getCompnaiesByIds(companiesIds);
            setCompanies(data.companies ?? []);
        } catch (error) {
            Alert.alert("Error", getUserMessage(error));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLOR_BACKGROUND }}>
            <FlatList
                data={loading ? [] : companies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CompanyItem item={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 12, gap: 12, flexGrow: 1 }}
                refreshControl={
                    loading ? undefined : (
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    )
                }
                ListHeaderComponent={
                    !loading && companies.length > 0 && query ? (
                        <Text className="text-text text-[13px]" style={{ paddingHorizontal: 4 }}>
                            {`${companies.length} ${companies.length === 1 ? "resultado" : "resultados"} para “${query}”`}
                        </Text>
                    ) : null
                }
                ListEmptyComponent={
                    loading ? (
                        <ResultsSkeleton />
                    ) : (
                        <ResultsEmpty query={query as string | undefined} />
                    )
                }
            />
        </View>
    );
}
