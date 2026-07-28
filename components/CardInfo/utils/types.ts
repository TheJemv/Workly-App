import { Feather } from "@expo/vector-icons";

/** Nombre de ícono válido del set Feather (@expo/vector-icons) */
export type IconName = keyof typeof Feather.glyphMap;

/** Tono de color para íconos y valores dentro de un Row */
export type Tone = "success" | "muted" | "default";