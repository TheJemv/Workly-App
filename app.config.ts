import { ExpoConfig, ConfigContext } from "expo/config";

// 1. Detectamos el entorno basándonos en APP_ENV
const IS_DEV = process.env.APP_ENV === "development";

export default ({ config }: ConfigContext): ExpoConfig => ({
   ...config,
   // 2. Nombre dinámico para distinguirla en tu pantalla de inicio
   name: IS_DEV ? "Workly (Dev)" : "Workly",
   slug: "workly-services",
   version: "0.7.0",
   orientation: "portrait",
   icon: "./assets/icon.png",
   userInterfaceStyle: "light",
   // El splash ya no se configura acá (esto es solo el fallback nativo antes de
   // que el plugin de abajo tome control) — la config real vive en el plugin
   // "expo-splash-screen", que es lo que permite controlarlo a mano desde JS
   // (ver app/_layout.tsx: se queda visible hasta que la app está lista, y
   // luego hace fade en vez de desaparecer de golpe).
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
      [
         "expo-splash-screen",
         {
            image: "./assets/splash.png",
            // El PNG es de 1284×2778 (pantalla completa de iPhone), no un logo
            // chico — sin esto, el plugin lo trata como ícono y lo encoge a
            // imageWidth (200pt por defecto). Esta flag replica el comportamiento
            // que ya tenía el `splash` viejo a nivel raíz (imagen completa,
            // "contain" = se ajusta sin recortar). Solo aplica en iOS: Android no
            // soporta imagen de pantalla completa en su splash nativo, ahí
            // siempre se ve como ícono centrado (imageWidth abajo).
            enableFullScreenImage_legacy: true,
            imageWidth: 200,
            resizeMode: "contain",
            backgroundColor: "#ffffff",
         },
      ],
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