.PHONY: clean-ios prebuild-dev open-dev run-dev start-dev prebuild-prod open-prod build-eas-dev build-eas-prod

# ==========================================
# 🧹 LIMPIEZA
# ==========================================
# Borra la carpeta ios y limpia la caché rebelde de Xcode
clean-ios:
	rm -rf ios
	rm -rf ~/Library/Developer/Xcode/DerivedData/Workly*
	@echo "✅ Carpeta ios y caché de Xcode eliminadas."

# ==========================================
# 🛠️ ENTORNO DE DESARROLLO (WorklyDev)
# ==========================================
# Genera el código nativo para desarrollo
prebuild-dev: clean-ios
	APP_ENV=development npx expo prebuild -p ios
	cp -R ./icons/DebugIcon.icon/ ./ios/WorklyDev/Images.xcassets/AppIcon.appiconset/
	@echo "✅ Prebuild de Desarrollo completado."

# Abre el proyecto de desarrollo en Xcode 26.1
open-dev:
	open -a "Xcode" ios/WorklyDev.xcworkspace

# Compila e instala en el simulador desde la terminal
run-dev:
	APP_ENV=development npx expo run:ios

# Inicia el servidor de Expo (Metro) para desarrollo
start-dev:
	APP_ENV=development npx expo start -c

# ==========================================
# 🚀 ENTORNO DE PRODUCCIÓN LOCAL (Workly)
# ==========================================
# Genera el código nativo para producción
prebuild-prod: clean-ios
	APP_ENV=production npx expo prebuild -p ios
	cp -R ./icons/AppIcon.icon ./ios/Workly/Images.xcassets/
	@echo "✅ Prebuild de Producción completado."

# Abre el proyecto de producción en Xcode 26.1 (Para hacer el Archive)
open-prod:
	open -a "Xcode" ios/Workly.xcworkspace

# ==========================================
# ☁️ COMPILACIÓN EN LA NUBE (EAS)
# ==========================================
# Manda a compilar la versión de pruebas a los servidores de Expo
build-eas-dev:
	eas build --profile development --platform ios

# Manda a compilar la versión final para la App Store a los servidores de Expo
build-eas-prod:
	eas build --profile production --platform ios
