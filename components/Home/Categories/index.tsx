import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { CategroyItem } from "./components";
import { HomeCategory } from "data/serviceCategories";

const TWO_ROWS_THRESHOLD = 6;

export default function Categories({ data }: { data: HomeCategory[] }) {
   // >= 6 categorías -> 2 filas (reparto column-major para que al hacer scroll
   // horizontal las columnas queden alineadas de a pares). <= 5 -> una sola fila.
   const rows = useMemo<HomeCategory[][]>(() => {
      if (data.length < TWO_ROWS_THRESHOLD) return [data];

      const top: HomeCategory[] = [];
      const bottom: HomeCategory[] = [];
      data.forEach((item, index) => {
         (index % 2 === 0 ? top : bottom).push(item);
      });
      return [top, bottom];
   }, [data]);

   if (data.length === 0) return null;

   return (
      <View style={{ flexDirection: "column", gap: 4 }}>
         <View style={{ flexDirection: "column", gap: 2, paddingHorizontal: 12 }}>
            <Text className="text-dark" style={{ fontSize: 20, fontWeight: "600" }}>
               Categorias
            </Text>
            <Text className="text-text">¡Busca tus servicios por categoria!</Text>
         </View>

         <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
               paddingHorizontal: 12,
               paddingBottom: 14,
               paddingTop: 8,
            }}
         >
            <View style={{ flexDirection: "column", gap: 12 }}>
               {rows.map((row, i) => (
                  <View key={i} style={{ flexDirection: "row", gap: 12 }}>
                     {row.map((item) => (
                        <CategroyItem key={item.category} item={item} />
                     ))}
                  </View>
               ))}
            </View>
         </ScrollView>
      </View>
   );
}
