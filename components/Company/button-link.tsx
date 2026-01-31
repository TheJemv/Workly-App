import { Pressable, Linking, Alert } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

type IconKey = "facebook" | "linkedin" | "phone" | "instagram";

type Props = {
   icon: string;
   value: string;
   onPress?: () => void;
};

const dataIconMap = {
   facebook: "facebook-square",
   linkedin: "linkedin-square",
   phone: "phone-square",
   instagram: "instagram",
} as const;

const dataColorMap = {
   facebook: "#3b5998",
   linkedin: "#0077b5",
   phone: "#34c759",
   instagram: "#C13584",
} as const;

/**
 * Formatea el valor según el tipo de contacto
 */
const formatContactUrl = (icon: string, value: string): string => {
   // Si ya tiene protocolo, retornarlo tal cual
   if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('tel:')) {
      return value;
   }

   switch (icon) {
      case "phone":
         // Limpiar el número de teléfono y agregar tel:
         const cleanPhone = value.replace(/[^\d+]/g, '');
         return `tel:${cleanPhone}`;

      case "facebook":
         // Si es username, crear URL
         return value.includes('facebook.com')
            ? `https://${value}`
            : `https://www.facebook.com/${value}`;

      case "instagram":
         // Si es username, crear URL
         return value.includes('instagram.com')
            ? `https://${value}`
            : `https://www.instagram.com/${value}`;

      case "linkedin":
         // LinkedIn ya suele venir con URL completa
         return value.includes('linkedin.com')
            ? (value.startsWith('http') ? value : `https://${value}`)
            : `https://www.linkedin.com/in/${value}`;

      default:
         return value;
   }
};

export function ButtonIconLink({ icon, value, onPress }: Props) {
   const handlePress = async () => {
      if (onPress) {
         onPress();
         return;
      }

      const url = formatContactUrl(icon, value);

      try {
         const canOpen = await Linking.canOpenURL(url);

         if (canOpen) {
            await Linking.openURL(url);
         } else {
            Alert.alert(
               "Error",
               `No se puede abrir ${icon}. Verifica que tengas la app instalada.`
            );
         }
      } catch (error) {
         console.error(`Error opening ${icon}:`, error);
         Alert.alert(
            "Error",
            `No se pudo abrir el enlace de ${icon}`
         );
      }
   };

   return (
      <Pressable
         className="active:opacity-80"
         onPress={handlePress}
      >
         <FontAwesome
            name={dataIconMap[icon]}
            size={32}
            color={dataColorMap[icon]}
         />
      </Pressable>
   );
}