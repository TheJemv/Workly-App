# ==============================================================================
#  Workly — Makefile
#  Automatiza limpieza, prebuild nativo (iOS) y builds locales/EAS.
#  Corré `make` o `make help` para ver todos los comandos disponibles.
# ==============================================================================

.DEFAULT_GOAL := help

APP_NAME     := Workly
DERIVED_DATA := $(HOME)/Library/Developer/Xcode/DerivedData/$(APP_NAME)*

.PHONY: help clean \
        dev-prebuild dev-open dev-ios dev-android dev-start \
        prod-prebuild prod-open \
        eas-dev eas-prod eas-submit-ios

##@ Ayuda

help: ## Muestra esta ayuda
	@awk 'BEGIN {FS = ":.*##"}; /^[a-zA-Z0-9_-]+:.*##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)
	@echo ""

##@ Limpieza

clean: ## Borra ios/ y la cache de DerivedData de Xcode
	rm -rf ios
	rm -rf $(DERIVED_DATA)
	@echo "✅ ios/ y la cache de Xcode fueron eliminadas."

##@ Desarrollo (WorklyDev)

dev-prebuild: clean ## Genera el proyecto nativo de iOS para desarrollo
	APP_ENV=development npx expo prebuild -p ios
	cp -R ./icons/DebugIcon.icon/ ./ios/WorklyDev/Images.xcassets/AppIcon.appiconset/
	@echo "✅ Prebuild de desarrollo completado."

dev-open: ## Abre WorklyDev.xcworkspace en Xcode
	open -a "Xcode" ios/WorklyDev.xcworkspace

dev-ios: ## Compila y corre en el simulador de iOS (dev)
	APP_ENV=development npx expo run:ios

dev-android: ## Compila y corre en el emulador de Android (dev)
	APP_ENV=development npx expo run:android

dev-start: ## Inicia Metro (con cache limpia) en modo desarrollo
	APP_ENV=development npx expo start -c

##@ Producción local (Workly)

prod-prebuild: clean ## Genera el proyecto nativo de iOS para producción
	APP_ENV=production npx expo prebuild -p ios
	cp -R ./icons/AppIcon.icon ./ios/Workly/Images.xcassets/
	@echo "✅ Prebuild de producción completado."

prod-open: ## Abre Workly.xcworkspace en Xcode (para Archive)
	open -a "Xcode" ios/Workly.xcworkspace

##@ Builds en la nube (EAS)

eas-dev: ## Manda a compilar la versión de desarrollo en EAS
	eas build --profile development --platform ios

eas-prod: ## Manda a compilar la versión de producción (App Store) en EAS
	eas build --profile production --platform ios

eas-submit-ios: ## Envía el último build de producción de iOS a App Store Connect
	eas submit --platform ios --profile production
