import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   name: "Workly",
   slug: "Workly",
   version: "0.6.3",
   orientation: "portrait",
   icon: "./assets/icon.png",
   userInterfaceStyle: "light",
   splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
   },
   ios: {
      icon: "./assets/ios-icon.png",
      supportsTablet: false,
      bundleIdentifier: "com.workly.services",
      googleServicesFile: "./GoogleService-Info.plist",
      config: {
         googleSignIn: {
            reservedClientId: "com.googleusercontent.apps.642547837410-ua5umahbh07furo9f5vtvhfceejqghqk"
         },
      },

      infoPlist: {
         NSLocationWhenInUseUsageDescription:
            "Necesitamos tu ubicación para mostrar información relevante.",
         NSLocationAlwaysUsageDescription:
            "Necesitamos tu ubicación para proporcionar funcionalidades avanzadas incluso cuando la aplicación no esté en uso.",
         LSApplicationQueriesSchemes: [
            "tel",
            "whatsapp",
            "fb-messenger",
            "instagram",
            "linkedin",
         ],
      },
   },
   android: {
      adaptiveIcon: {
         foregroundImage: "./assets/adaptive-icon.png",
         backgroundColor: "#ffffff",
      },
      permissions: [
         "android.permission.ACCESS_FINE_LOCATION",
         "android.permission.ACCESS_COARSE_LOCATION",
         "android.permission.RECORD_AUDIO",
      ],
      softwareKeyboardLayoutMode: "pan",
      package: "com.workly.services",
      googleServicesFile: "./google-services.json",
      versionCode: 5,
      config: {
         googleMaps: {
            apiKey: process.env.ANDROID_MAP,
         },
      },
   },
   web: {
      favicon: "./assets/favicon.png",
   },
   extra: {
      eas: {
         projectId: "14c850df-3d61-4681-8232-0e24c3c02710",
      },
      router: {
         origin: false,
      },
   },
   owner: "jemv05",
   scheme: "workly",
   plugins: [
      "expo-notifications",
      "expo-router",
      "expo-web-browser",
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
      "@react-native-firebase/crashlytics",
      "@react-native-google-signin/google-signin",
      [
         "expo-image-picker",
         {
            photosPermission:
               "Work It, te pide permiso para acceder a tus fotos.",
         },
      ],
      [
         "expo-location",
         {
            locationAlwaysAndWhenInUsePermission:
               "Allow Work It to use your location.",
         },
      ],
      [
         "@stripe/stripe-react-native",
         {
            merchantIdentifier: "merchant.com.workly.services",
            enableGooglePay: true,
         },
      ],
      [
         "expo-build-properties",
         {
            ios: {
               useFrameworks: "static",
               deploymentTarget: "15.3",
            },
         },
      ],
   ],
});
