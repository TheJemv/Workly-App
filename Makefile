# ==============================================================================
#  Workly — Makefile
#  Automatiza limpieza, prebuild nativo (iOS) y builds locales/EAS.
#  Corré `make` o `make help` para ver todos los comandos disponibles.
# ==============================================================================

.DEFAULT_GOAL := help

APP_NAME     := Workly
DERIVED_DATA := $(HOME)/Library/Developer/Xcode/DerivedData/$(APP_NAME)*

# Cache local de los binarios prebuilt de React Native (ReactNativeCore /
# ReactNativeDependencies) que Expo descarga de Maven en cada `pod install`.
# `clean` los respalda acá antes de borrar ios/, y los prebuild los restauran
# después, para no re-descargar ~200MB en cada corrida si la versión de RN
# no cambió.
RN_ARTIFACTS_CACHE := $(HOME)/.cache/workit-rn-artifacts

.PHONY: help clean restore-rn-cache \
        dev-prebuild dev-open dev-ios dev-android dev-ios-device dev-android-device dev-start \
        prod-prebuild prod-open \
        eas-dev eas-prod eas-submit-ios

##@ Ayuda

help: ## Muestra esta ayuda
	@awk 'BEGIN {FS = ":.*##"}; /^[a-zA-Z0-9_-]+:.*##/ { printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) }' $(MAKEFILE_LIST)
	@echo ""

##@ Limpieza

clean: ## Borra ios/ y la cache de DerivedData de Xcode (conserva la cache de RN prebuilt)
	@mkdir -p $(RN_ARTIFACTS_CACHE)
	@[ -d ios/Pods/ReactNativeDependencies-artifacts ] && rsync -a --delete ios/Pods/ReactNativeDependencies-artifacts/ $(RN_ARTIFACTS_CACHE)/ReactNativeDependencies-artifacts/ || true
	@[ -d ios/Pods/ReactNativeCore-artifacts ] && rsync -a --delete ios/Pods/ReactNativeCore-artifacts/ $(RN_ARTIFACTS_CACHE)/ReactNativeCore-artifacts/ || true
	rm -rf ios
	rm -rf $(DERIVED_DATA)
	@echo "✅ ios/ y la cache de Xcode fueron eliminadas (RN prebuilt cacheado en $(RN_ARTIFACTS_CACHE))."

restore-rn-cache: ## (interno) Restaura la cache de RN prebuilt dentro de ios/Pods
	@mkdir -p ios/Pods
	@[ -d $(RN_ARTIFACTS_CACHE)/ReactNativeDependencies-artifacts ] && rsync -a $(RN_ARTIFACTS_CACHE)/ReactNativeDependencies-artifacts/ ios/Pods/ReactNativeDependencies-artifacts/ || true
	@[ -d $(RN_ARTIFACTS_CACHE)/ReactNativeCore-artifacts ] && rsync -a $(RN_ARTIFACTS_CACHE)/ReactNativeCore-artifacts/ ios/Pods/ReactNativeCore-artifacts/ || true

##@ Desarrollo (WorklyDev)

dev-prebuild: clean ## Genera el proyecto nativo de iOS para desarrollo
	APP_ENV=development npx expo prebuild -p ios --no-install
	cp -R ./icons/DebugIcon.icon/ ./ios/WorklyDev/Images.xcassets/AppIcon.appiconset/
	$(MAKE) restore-rn-cache
	cd ios && pod install
	@echo "✅ Prebuild de desarrollo completado."

dev-open: ## Abre WorklyDev.xcworkspace en Xcode
	open -a "Xcode" ios/WorklyDev.xcworkspace

dev-ios: ## Compila y corre en el simulador de iOS (dev)
	APP_ENV=development npx expo run:ios

dev-android: ## Compila y corre en el emulador de Android (dev)
	APP_ENV=development npx expo run:android

dev-ios-device: ## Compila y corre en iOS eligiendo simulador/dispositivo
	APP_ENV=development npx expo run:ios --device

dev-android-device: ## Compila y corre en Android eligiendo emulador/dispositivo
	APP_ENV=development npx expo run:android --device

dev-start: ## Inicia Metro (con cache limpia) en modo desarrollo
	APP_ENV=development npx expo start -c

##@ Producción local (Workly)

prod-prebuild: clean ## Genera el proyecto nativo de iOS para producción
	APP_ENV=production npx expo prebuild -p ios --no-install
	cp -R ./icons/AppIcon.icon ./ios/Workly/Images.xcassets/
	$(MAKE) restore-rn-cache
	cd ios && pod install
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
