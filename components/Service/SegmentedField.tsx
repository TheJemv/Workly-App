import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Colors } from "lib";

type Option<T> = { label: string; value: T };

type Props<T> = {
   label?: string;
   caption?: string;
   value: T;
   onChange: (value: T) => void;
   options: Option<T>[];
   error?: string;
};

const activeShadow = Platform.select({
   ios: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
   },
   android: { elevation: 2 },
});

/** Control segmentado (estilo iOS) para elegir entre 2-3 opciones. */
export default function SegmentedField<T extends string | number | boolean>({
   label,
   caption,
   value,
   onChange,
   options,
   error,
}: Props<T>) {
   return (
      <View style={{ gap: 6 }}>
         {label ? (
            <Text style={{ color: Colors.principal.DEFAULT, fontSize: 14, fontWeight: "700" }}>
               {label}
            </Text>
         ) : null}

         <View
            className="flex-row"
            style={{ backgroundColor: "#f0f0f3", borderRadius: 10, padding: 3, gap: 3 }}
         >
            {options.map((opt) => {
               const active = opt.value === value;
               return (
                  <TouchableOpacity
                     key={String(opt.value)}
                     onPress={() => onChange(opt.value)}
                     activeOpacity={0.7}
                     className="flex-1 items-center justify-center"
                     style={{
                        paddingVertical: 9,
                        borderRadius: 8,
                        backgroundColor: active ? "#fff" : "transparent",
                        ...(active ? activeShadow : null),
                     }}
                  >
                     <Text
                        style={{
                           fontSize: 13,
                           fontWeight: active ? "700" : "500",
                           color: active ? Colors.principal.DEFAULT : "#8a8a8f",
                        }}
                     >
                        {opt.label}
                     </Text>
                  </TouchableOpacity>
               );
            })}
         </View>

         {caption ? <Text className="text-text-light text-[12px]">{caption}</Text> : null}
         {error ? <Text className="text-sm text-red-500 font-medium">{error}</Text> : null}
      </View>
   );
}
