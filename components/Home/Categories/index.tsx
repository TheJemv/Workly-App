import React, { useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import { CategroyItem } from "./components";

export default function Categories({ data }: { data: any[] }) {
   const rows = useMemo(() => {
      const r1: any[] = [];
      const r2: any[] = [];

      data.forEach((item, index) => {
         if (index % 2 === 0) r1.push(item);
         else r2.push(item);
      });

      return [r1, r2];
   }, [data]);

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
               {/* ROW 1 */}
               <View style={{ flexDirection: "row", gap: 12 }}>
                  {rows[0].map((item) => (
                     <CategroyItem key={item.id} item={item} />
                  ))}
               </View>

               {/* ROW 2 */}
               <View style={{ flexDirection: "row", gap: 12 }}>
                  {rows[1].map((item) => (
                     <CategroyItem key={item.id} item={item} />
                  ))}
               </View>
            </View>
         </ScrollView>
      </View>
   );
}