import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";
import { MAX_IMAGE_BYTES, getFileSize, uriToDataUri } from "utils/imageToBase64";

const MAX_PHOTOS = 5;
const TILE = 104;

type Props = {
   /** Galería actual: mezcla de URLs de Cloudinary (existentes) y data-URIs (nuevas). */
   value: string[];
   onChange: (photos: string[]) => void;
   error?: string;
};

/** Selector de galería del servicio: 1 a 5 fotos, reordenables, con portada. */
export default function ServiceGalleryPicker({ value, onChange, error }: Props) {
   const [loading, setLoading] = useState(false);
   const photos = value ?? [];
   const canAdd = photos.length < MAX_PHOTOS;

   const move = (from: number, to: number) => {
      if (to < 0 || to >= photos.length) return;
      const next = photos.slice();
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      onChange(next);
   };

   const remove = (index: number) => {
      onChange(photos.filter((_, i) => i !== index));
   };

   const add = async () => {
      const remaining = MAX_PHOTOS - photos.length;
      if (remaining <= 0) return;

      setLoading(true);
      try {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== "granted") {
            Alert.alert("Permisos requeridos", "Necesitamos permiso para acceder a tus fotos.");
            return;
         }

         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsMultipleSelection: true,
            selectionLimit: remaining,
            quality: 0.8,
         });
         if (result.canceled) return;

         const picked: string[] = [];
         for (const asset of result.assets.slice(0, remaining)) {
            if ((await getFileSize(asset.uri)) >= MAX_IMAGE_BYTES) {
               Alert.alert("Archivo muy grande", "Cada imagen debe pesar menos de 10 MB.");
               continue;
            }
            picked.push(await uriToDataUri(asset.uri));
         }

         if (picked.length) onChange([...photos, ...picked]);
      } catch (e: any) {
         Alert.alert("Error", e?.message ?? "No se pudieron agregar las fotos.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <View style={{ gap: 8 }}>
         <View className="flex-row items-center justify-between">
            <Text style={{ color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: "700" }}>
               Fotos del servicio
            </Text>
            <Text className="text-text-light text-[12px]">{photos.length}/{MAX_PHOTOS}</Text>
         </View>
         <Text className="text-text-light text-[12px]">
            De 1 a 5 fotos. La primera es la portada — usa las flechas para reordenar.
         </Text>

         <View className="flex-row flex-wrap" style={{ gap: 10, marginTop: 2 }}>
            {photos.map((uri, index) => (
               <View key={index} style={{ width: TILE }}>
                  <View
                     className="bg-border-soft border border-border-soft"
                     style={{ width: TILE, height: TILE, borderRadius: 12, overflow: "hidden" }}
                  >
                     <Image
                        source={{ uri }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        transition={150}
                     />

                     {index === 0 ? (
                        <View
                           style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              backgroundColor: Colors.principal.DEFAULT,
                              paddingHorizontal: 6,
                              paddingVertical: 3,
                              borderBottomRightRadius: 8,
                           }}
                        >
                           <Text style={{ color: "#fff", fontSize: 9, fontWeight: "700" }}>
                              PORTADA
                           </Text>
                        </View>
                     ) : null}

                     <TouchableOpacity
                        onPress={() => remove(index)}
                        hitSlop={6}
                        style={{
                           position: "absolute",
                           right: 4,
                           top: 4,
                           width: 22,
                           height: 22,
                           borderRadius: 11,
                           backgroundColor: "rgba(0,0,0,0.6)",
                           alignItems: "center",
                           justifyContent: "center",
                        }}
                     >
                        <Ionicons name="close" size={14} color="#fff" />
                     </TouchableOpacity>
                  </View>

                  <View className="flex-row items-center justify-between" style={{ marginTop: 4 }}>
                     <TouchableOpacity
                        onPress={() => move(index, index - 1)}
                        disabled={index === 0}
                        hitSlop={6}
                        style={{ opacity: index === 0 ? 0.25 : 1, padding: 2 }}
                     >
                        <Ionicons name="chevron-back" size={18} color={Colors.principal.DEFAULT} />
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={() => move(index, index + 1)}
                        disabled={index === photos.length - 1}
                        hitSlop={6}
                        style={{ opacity: index === photos.length - 1 ? 0.25 : 1, padding: 2 }}
                     >
                        <Ionicons name="chevron-forward" size={18} color={Colors.principal.DEFAULT} />
                     </TouchableOpacity>
                  </View>
               </View>
            ))}

            {canAdd ? (
               <TouchableOpacity
                  onPress={add}
                  disabled={loading}
                  activeOpacity={0.7}
                  className="border border-dashed items-center justify-center"
                  style={{
                     width: TILE,
                     height: TILE,
                     borderRadius: 12,
                     borderColor: Colors.principal[300],
                     backgroundColor: Colors.principal[50],
                     gap: 4,
                  }}
               >
                  {loading ? (
                     <SpinLoading size={22} color={Colors.principal.DEFAULT} />
                  ) : (
                     <>
                        <Ionicons name="add" size={24} color={Colors.principal.DEFAULT} />
                        <Text style={{ color: Colors.principal.DEFAULT, fontSize: 11, fontWeight: "600" }}>
                           Agregar
                        </Text>
                     </>
                  )}
               </TouchableOpacity>
            ) : null}
         </View>

         {error ? <Text className="text-sm text-red-500 font-medium">{error}</Text> : null}
      </View>
   );
}
