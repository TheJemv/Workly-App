import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import themes from "config/theme.json"

export const ENTITLEMENT_ID = 'company';
export const STATUS_MARGIN_TOP = Platform.OS === "ios" ? StatusBar.currentHeight : 0
export const COLOR_BACKGROUND = "#f6f6f6"