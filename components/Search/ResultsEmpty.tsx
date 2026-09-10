import { Image, Text, View } from "react-native";

export default function ResultsEmpty({ query }: { query?: string }) {
   return (
      <View
         className="flex-1 items-center justify-center px-8"
         style={{ gap: 10, paddingTop: 72 }}
      >
         <Image
            source={require("assets/Empty/NotFound.png")}
            style={{ width: 120, height: 100 }}
            resizeMode="contain"
         />
         <Text className="text-dark font-semibold text-base text-center">
            Sin resultados
         </Text>
         <Text className="text-text text-[13px] text-center">
            {query
               ? `No encontramos empresas ni servicios para “${query}”.`
               : "Intenta con otra búsqueda."}
         </Text>
      </View>
   );
}
