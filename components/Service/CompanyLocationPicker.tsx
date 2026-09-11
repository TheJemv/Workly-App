import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";

import { getCompanyLocations } from "services/api/companyLocation.api";
import { CompanyLocation } from "@/types/Location";
import { Colors } from "lib";

type Props = {
   value?: string | null;
   onChange: (id: string) => void;
   error?: string;
};

/** Selector de sucursal para el modo "company_location" del form de servicio. */
export default function CompanyLocationPicker({ value, onChange, error }: Props) {
   const [locations, setLocations] = useState<CompanyLocation[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      let alive = true;
      getCompanyLocations()
         .then(({ data }) => {
            if (alive) setLocations(data ?? []);
         })
         .catch(() => {
            // se queda con [] — el picker cae al estado "no tienes sucursales"
         })
         .finally(() => {
            if (alive) setLoading(false);
         });
      return () => {
         alive = false;
      };
   }, []);

   if (!loading && locations.length === 0) {
      return (
         <View style={{ gap: 6 }}>
            <Text style={{ color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: "700" }}>
               Sucursal
            </Text>
            <View className="flex-row items-center flex-wrap" style={{ gap: 4 }}>
               <Text className="text-sm" style={{ color: "#e53e3e" }}>
                  No tienes sucursales creadas.
               </Text>
               <TouchableOpacity onPress={() => router.push("/(edit)/locations/create")}>
                  <Text style={{ color: "#e53e3e", fontSize: 14, textDecorationLine: "underline" }}>
                     Crea una sucursal.
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      );
   }

   return (
      <View style={{ gap: 4 }}>
         <Text style={{ color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: "700" }}>
            Sucursal
         </Text>
         <Dropdown
            style={{
               borderRadius: 10,
               borderWidth: 1,
               borderColor: "#04040420",
               paddingHorizontal: 10,
               paddingVertical: 10,
            }}
            selectedTextStyle={{ color: "#050505", fontSize: 15 }}
            placeholder={loading ? "Cargando…" : "Selecciona una sucursal"}
            placeholderStyle={{ color: "#92929D", fontSize: 15 }}
            itemContainerStyle={{ backgroundColor: Colors.white, borderRadius: 8 }}
            containerStyle={{ borderRadius: 10, borderWidth: 1 }}
            labelField="label"
            valueField="value"
            data={locations.map((l) => ({ label: l.name, value: l.id }))}
            value={value ?? null}
            onChange={(item) => onChange(item.value)}
         />
         {error ? <Text className="text-sm text-red-500 font-medium">{error}</Text> : null}
      </View>
   );
}
