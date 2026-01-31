import { FlatList, Text, View } from "react-native";
import { CategroyItem } from "./components";

export default function Categories({ data }: { data: any[] }) {
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
               Categorias
            </Text>
            <Text className="text-text">
               ¡Busca tus servicios por categoria!
            </Text>
         </View>

         <FlatList
            renderItem={({ item, index }) => (
               <CategroyItem item={item} key={index} />
            )}
            keyExtractor={(item) => item.id}
            horizontal={true}
            data={data}
            contentContainerStyle={{
               paddingHorizontal: 12,
               gap: 12,
               flexGrow: 1,
               paddingBottom: 14,
               paddingTop: 8,
            }}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
         />
      </View>
   );
}
