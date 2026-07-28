import { Platform } from "react-native";
import { Colors } from "lib";
import { Tone } from "./types";

/**
 * shadow-sm de NativeWind no funciona en Android (falta elevation),
 * y en iOS se corta si el contenedor tiene overflow-hidden.
 * Por eso se define aparte y se aplica en un View externo sin overflow-hidden.
 */
export const cardShadow = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    android: {
        elevation: 2,
    },
});

/** Mapea un Tone a un color real usando la paleta del proyecto */
export const toneColor = (tone: Tone): string => {
    switch (tone) {
        case "success":
            return Colors.green[600];
        case "muted":
            return Colors.principal[300];
        default:
            return Colors.principal.DEFAULT;
    }
};