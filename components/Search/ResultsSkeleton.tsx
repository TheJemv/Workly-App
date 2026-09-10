import { useEffect, useRef } from "react";
import { Animated, DimensionValue, View } from "react-native";

function Bar({
   w,
   h,
   r = 6,
}: {
   w: DimensionValue;
   h: number;
   r?: number;
}) {
   return (
      <View
         style={{ width: w, height: h, borderRadius: r, backgroundColor: "#e6e6ea" }}
      />
   );
}

function SkeletonCard() {
   return (
      <View className="bg-white rounded-2xl p-3" style={{ gap: 14 }}>
         <View className="flex-row items-center" style={{ gap: 12 }}>
            <Bar w={56} h={56} r={12} />
            <View style={{ flex: 1, gap: 7 }}>
               <Bar w="55%" h={12} />
               <Bar w="85%" h={10} />
               <Bar w="40%" h={10} />
            </View>
         </View>

         <View className="flex-row" style={{ gap: 12 }}>
            {[0, 1, 2].map((i) => (
               <View key={i} style={{ gap: 7 }}>
                  <Bar w={150} h={112} r={12} />
                  <Bar w={120} h={10} />
                  <Bar w={70} h={10} />
               </View>
            ))}
         </View>
      </View>
   );
}

export default function ResultsSkeleton() {
   const opacity = useRef(new Animated.Value(0.45)).current;

   useEffect(() => {
      const loop = Animated.loop(
         Animated.sequence([
            Animated.timing(opacity, {
               toValue: 1,
               duration: 750,
               useNativeDriver: true,
            }),
            Animated.timing(opacity, {
               toValue: 0.45,
               duration: 750,
               useNativeDriver: true,
            }),
         ])
      );
      loop.start();
      return () => loop.stop();
   }, [opacity]);

   return (
      <Animated.View style={{ opacity, gap: 12 }}>
         <SkeletonCard />
         <SkeletonCard />
      </Animated.View>
   );
}
