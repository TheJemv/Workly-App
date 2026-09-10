import { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import SpinLoading from "components/SpinLoading";
import { Colors } from "lib";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const PLACEHOLDER = require("assets/cover/service.png");

async function uriToBase64(uri: string): Promise<string> {
   const response = await fetch(uri);
   const blob = await response.blob();
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
         const result = reader.result as string;
         resolve(result.includes(",") ? result.split(",")[1] : result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
   });
}

async function getFileSize(uri: string): Promise<number> {
   try {
      const response = await fetch(uri);
      const blob = await response.blob();
      return blob.size;
   } catch {
      return 0;
   }
}

type Props = {
   /** URI remota, data-uri, o base64 crudo. */
   value?: string;
   /** Devuelve el base64 crudo (sin prefijo data:). */
   onChange: (base64: string) => void;
   error?: string;
};

/** Selector de foto de portada del servicio (rectángulo redondeado, no avatar). */
export default function ServiceImagePicker({ value, onChange, error }: Props) {
   const [loading, setLoading] = useState(false);
   const [preview, setPreview] = useState<string>("");

   const source = preview
      ? { uri: preview }
      : value
        ? { uri: value.startsWith("http") || value.startsWith("data:") ? value : `data:image/jpeg;base64,${value}` }
        : PLACEHOLDER;

   const pick = async () => {
      setLoading(true);
      try {
         const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
         if (status !== "granted") {
            Alert.alert("Permisos requeridos", "Necesitamos permiso para acceder a tus fotos.");
            return;
         }

         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [16, 10],
            quality: 0.8,
         });
         if (result.canceled) return;

         const uri = result.assets[0].uri;
         if ((await getFileSize(uri)) >= MAX_FILE_SIZE) {
            Alert.alert("Archivo muy grande", "La imagen no puede pesar más de 10 MB.");
            return;
         }

         const base64 = await uriToBase64(uri);
         setPreview(`data:image/jpeg;base64,${base64}`);
         onChange(base64);
      } catch (e: any) {
         Alert.alert("Error", e?.message ?? "No se pudo actualizar la foto. Intenta de nuevo.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <View style={{ gap: 8 }}>
         <TouchableOpacity onPress={pick} disabled={loading} activeOpacity={0.85}>
            <View
               className="bg-border-soft border border-border-soft"
               style={{
                  width: "100%",
                  aspectRatio: 16 / 10,
                  borderRadius: 16,
                  overflow: "hidden",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               {loading ? (
                  <SpinLoading size={30} color={Colors.principal.DEFAULT} />
               ) : (
                  <Image
                     source={source}
                     style={{ width: "100%", height: "100%" }}
                     contentFit="cover"
                     transition={150}
                  />
               )}

               {!loading ? (
                  <View
                     style={{
                        position: "absolute",
                        right: 10,
                        bottom: 10,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        backgroundColor: "rgba(0,0,0,0.55)",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                     }}
                  >
                     <Ionicons name="camera" size={14} color="#fff" />
                     <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600" }}>
                        {value || preview ? "Cambiar foto" : "Agregar foto"}
                     </Text>
                  </View>
               ) : null}
            </View>
         </TouchableOpacity>

         {error ? (
            <Text className="text-sm text-red-500 font-medium">{error}</Text>
         ) : null}
      </View>
   );
}
