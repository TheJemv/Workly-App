import { ExpoConfig, ConfigContext } from "expo/config";

// 1. Detectamos el entorno basándonos en APP_ENV
const IS_DEV = process.env.APP_ENV === "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   // 2. Nombre dinámico para distinguirla en tu pantalla de inicio
   name: IS_DEV ? "Workly (Dev)" : "Workly",
   slug: "workly-services",
   version: "0.6.4",
   orientation: "portrait",
   icon: "./assets/icon.png",
   userInterfaceStyle: "light",
   splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
   },
   ios: {
      name: "Workly",
      bundleDisplayName: IS_DEV ? "Workly (Dev)" : "Workly",
      icon: IS_DEV ? "./icons/icon-dev.png" : "./icons/icon-prod.png",
      supportsTablet: false,
      bundleIdentifier: "com.workly.services",
      // 🔥 3. Ruta dinámica para el archivo de iOS
      googleServicesFile: IS_DEV
         ? "./firebase/dev/GoogleService-Info.plist"
         : "./firebase/production/GoogleService-Info.plist",
      config: {
         googleSignIn: {
            reservedClientId: "com.googleusercontent.apps.642547837410-ua5umahbh07furo9f5vtvhfceejqghqk"
         },
      },
      cocoapods: {
         "post_install": "(installer) => {\n  installer.pods_project.targets.each do |target|\n    target.build_configurations.each do |config|\n      config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'\n    end\n  end\n}"
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
      // 🔥 4. Ruta dinámica para el archivo de Android
      googleServicesFile: IS_DEV
         ? "./firebase/dev/google-services.json"
         : "./firebase/production/google-services.json",
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
         projectId: "574c91cf-ca27-44d9-bc2b-6d83ee820da3",
      },
      router: {
         origin: false,
      },
   },
   owner: "workly-services",
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
               forceStaticLinking: [
                  "RNFBApp",
                  "RNFBAuth",
                  "RNFBCrashlytics",
                  "RNFBMessaging"
               ]
            },
         },
      ],
   ],
});