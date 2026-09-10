import { useRef, useState } from "react";
import { View, Text, FlatList, useWindowDimensions } from "react-native";
import { Image } from "expo-image";

type Props = {
   photos: string[];
   /** Padding horizontal de la pantalla contenedora (para calcular el ancho). */
   horizontalPadding?: number;
   aspectRatio?: number;
};

/** Carrusel paginado de la galería del servicio, con contador y dots. */
export default function ServiceGallery({
   photos,
   horizontalPadding = 24,
   aspectRatio = 16 / 10,
}: Props) {
   const { width } = useWindowDimensions();
   const itemWidth = width - horizontalPadding;
   const [index, setIndex] = useState(0);
   const viewRef = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;

   const onViewable = useRef(({ viewableItems }: any) => {
      if (viewableItems?.length) setIndex(viewableItems[0].index ?? 0);
   }).current;

   if (!photos.length) return null;

   const height = itemWidth / aspectRatio;

   if (photos.length === 1) {
      return (
         <View
            className="bg-border-soft border border-border-soft"
            style={{ width: itemWidth, height, borderRadius: 14, overflow: "hidden" }}
         >
            <Image
               source={{ uri: photos[0] }}
               style={{ width: "100%", height: "100%" }}
               contentFit="cover"
               transition={150}
            />
         </View>
      );
   }

   return (
      <View style={{ gap: 8 }}>
         <View style={{ borderRadius: 14, overflow: "hidden" }}>
            <FlatList
               data={photos}
               keyExtractor={(uri, i) => `${uri.slice(0, 24)}-${i}`}
               horizontal
               pagingEnabled
               showsHorizontalScrollIndicator={false}
               onViewableItemsChanged={onViewable}
               viewabilityConfig={viewRef}
               renderItem={({ item }) => (
                  <View
                     className="bg-border-soft"
                     style={{ width: itemWidth, height }}
                  >
                     <Image
                        source={{ uri: item }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        transition={150}
                     />
                  </View>
               )}
            />

            <View
               style={{
                  position: "absolute",
                  right: 10,
                  top: 10,
                  backgroundColor: "rgba(0,0,0,0.55)",
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 999,
               }}
            >
               <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600" }}>
                  {index + 1} / {photos.length}
               </Text>
            </View>
         </View>

         <View className="flex-row items-center justify-center" style={{ gap: 5 }}>
            {photos.map((_, i) => (
               <View
                  key={i}
                  style={{
                     width: i === index ? 16 : 6,
                     height: 6,
                     borderRadius: 3,
                     backgroundColor: i === index ? "#24214a" : "#cfcfd6",
                  }}
               />
            ))}
         </View>
      </View>
   );
}
