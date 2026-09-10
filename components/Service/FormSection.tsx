import { ReactNode } from "react";
import { View, Text } from "react-native";

type Props = {
   title?: string;
   /** Texto de ayuda bajo el título. */
   caption?: string;
   children: ReactNode;
};

/** Tarjeta blanca que agrupa un bloque de campos del formulario de servicio. */
export default function FormSection({ title, caption, children }: Props) {
   return (
      <View
         className="bg-white rounded-2xl border border-border-soft"
         style={{ padding: 14, gap: 14 }}
      >
         {title ? (
            <View style={{ gap: 2 }}>
               <Text className="text-dark font-semibold text-[15px]">{title}</Text>
               {caption ? (
                  <Text className="text-text-light text-[12px]">{caption}</Text>
               ) : null}
            </View>
         ) : null}

         {children}
      </View>
   );
}
